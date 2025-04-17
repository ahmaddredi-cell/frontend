/**
 * API Client Module
 * 
 * This module provides a unified way to interact with the backend API.
 * It handles common concerns like:
 * - Authentication headers
 * - Error handling
 * - Request/response interceptors
 * - Refreshing tokens
 */

import notifications from '@/lib/utils/notifications';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  errors?: string[];
};

export type RequestOptions = {
  requiresAuth?: boolean;
  contentType?: string;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API client class
class ApiClient {
  // Get the authentication token from local storage
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Set the authentication token in local storage
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      console.log('Auth token set, length:', token.length);
    }
  }

  // Remove the authentication token from local storage
  public removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      console.log('Auth token removed');
    }
  }

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Refresh the access token using refresh token
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.log('No refresh token found');
        return false;
      }
      
      console.log('Attempting to refresh token');
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.log('Token refresh response not OK:', response.status);
        return false;
      }
      
      const data = await response.json();
      console.log('Token refresh response:', data);
      
      if (data.success && data.data?.token) {
        this.setAuthToken(data.data.token);
        
        // Also update refresh token if provided
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  // Handle API errors
  private async handleError(error: any, originalRequest?: any): Promise<ApiResponse<never>> {
    console.error('API Error:', error);
    
    // Network error
    if (!error.response) {
      notifications.error('خطأ في الاتصال بالخادم');
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        statusCode: 0,
      };
    }

    // Handle different status codes
    const { status, data } = error.response;
    
    if (status === 401) {
      // Check if this is already a retry after token refresh
      if (originalRequest && originalRequest.isRetry) {
        // Token refresh failed or expired again, redirect to login
        this.removeAuthToken();
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return {
          success: false,
          message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
          statusCode: status,
        };
      }
      
      // Try to refresh the token
      const refreshSuccess = await this.refreshAccessToken();
      
      if (refreshSuccess && originalRequest) {
        // Retry the original request with the new token
        const { endpoint, method, data, options } = originalRequest;
        return this.request(endpoint, method, data, options, true);
      } else {
        // Refresh failed, redirect to login
        this.removeAuthToken();
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return {
          success: false,
          message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
          statusCode: status,
        };
      }
    }
    
    if (status === 403) {
      notifications.error('ليس لديك صلاحية للوصول إلى هذا المورد');
      return {
        success: false,
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
        statusCode: status,
      };
    }
    
    if (status === 404) {
      return {
        success: false,
        message: 'المورد غير موجود',
        statusCode: status,
      };
    }

    if (status === 422 || status === 400) {
      const errorMsg = data.message || 'بيانات غير صالحة';
      notifications.error(errorMsg);
      return {
        success: false,
        message: errorMsg,
        errors: data.errors || [],
        statusCode: status,
      };
    }

    // Default error
    const errorMsg = data.message || 'حدث خطأ ما';
    notifications.error(errorMsg);
    
    return {
      success: false,
      message: errorMsg,
      statusCode: status,
    };
  }

  // Make an API request
  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: any,
    options: RequestOptions = { requiresAuth: true },
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { requiresAuth = true, contentType = 'application/json' } = options;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = this.getAuthToken();
      if (!token) {
        window.location.href = '/login';
        return {
          success: false,
          message: 'غير مصرح، يرجى تسجيل الدخول',
          statusCode: 401,
        };
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      if (contentType === 'application/json') {
        requestOptions.body = JSON.stringify(data);
      } else if (data instanceof FormData) {
        requestOptions.body = data;
        // Remove Content-Type header to let the browser set it with the boundary
        delete headers['Content-Type'];
      }
    }

    try {
      console.log(`Making ${method} request to ${url}`, { requiresAuth, headers });
      
      const response = await fetch(url, requestOptions);
      console.log(`Response status:`, response.status);
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          responseData = { message: text };
        }
      }

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData,
          },
        };
      }

      // Handle direct data format or { success, data, message } format
      if (responseData.success !== undefined) {
        return {
          success: responseData.success,
          data: responseData.data,
          message: responseData.message,
          statusCode: response.status,
        };
      }
      
      // If API returns direct data without wrapping
      return {
        success: true,
        data: responseData,
        statusCode: response.status,
      };
    } catch (error) {
      // Store the original request information for potential retry after token refresh
      const originalRequest = {
        endpoint,
        method,
        data,
        options,
        isRetry
      };
      
      return this.handleError(error, originalRequest);
    }
  }

  // HTTP methods
  public async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  public async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  public async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  public async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, options);
  }

  public async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }

  // Upload file(s) with FormData
  public async uploadFile<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', formData, {
      ...options,
      contentType: 'multipart/form-data',
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
