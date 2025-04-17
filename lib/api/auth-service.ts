import { apiClient, ApiResponse } from './api-client';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    governorate: string;
    permissions: string[];
  };
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  governorate: string;
  permissions: string[];
  lastLogin: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  /**
   * Log in a user with username and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    console.log("Auth service - login with:", credentials.username);
    
    try {
      console.log("Using direct fetch for login with credentials:", { username: credentials.username });
      
      // Create direct fetch request to bypass potential issues with api-client
      const requestBody = JSON.stringify(credentials);
      console.log("Request body:", requestBody);
      
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody,
        credentials: 'include'
      });
      
      console.log("Raw login response status:", response.status);
      
      // Get response text first for debugging
      const responseText = await response.text();
      console.log("Raw login response text:", responseText);
      
      // Parse JSON from text
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Parsed login response:", responseData);
      } catch (e) {
        console.error("Error parsing login response:", e);
        throw new Error("Invalid response format");
      }
      
      // Create ApiResponse compatible format
      const formattedResponse: ApiResponse<AuthResponse> = {
        success: responseData.success || false,
        message: responseData.message || '',
        data: responseData.data || responseData,
        statusCode: response.status
      };
      
      console.log("Auth service - formatted login response:", formattedResponse);
      
      // Store token if login was successful
      if (formattedResponse.success && formattedResponse.data?.token) {
        console.log("Login successful, storing auth data");
        
        // First clear any existing tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Set the new tokens
        localStorage.setItem('authToken', formattedResponse.data.token);
        
        if (formattedResponse.data.refreshToken) {
          localStorage.setItem('refreshToken', formattedResponse.data.refreshToken);
        }
        
        // Store user in localStorage for persistence
        if (typeof window !== 'undefined' && formattedResponse.data.user) {
          localStorage.setItem('user', JSON.stringify(formattedResponse.data.user));
        }
        
        // Removed the redirect here to avoid conflict with the login page's redirect
      }
      
      return formattedResponse;
    } catch (error) {
      console.error("Auth service - login error:", error);
      return {
        success: false,
        message: "خطأ في الاتصال بالخادم",
        statusCode: 500
      };
    }
  }
  
  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear auth data even if the API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
  }
  
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/auth/profile');
  }
  
  /**
   * Update the user's profile
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>('/auth/profile', profile);
  }
  
  /**
   * Change the user's password
   */
  async changePassword(passwordData: PasswordChange): Promise<ApiResponse<null>> {
    return apiClient.post<null>('/auth/change-password', passwordData);
  }
  
  /**
   * Request a password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email }, {
      requiresAuth: false
    });
  }
  
  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      '/auth/reset-password',
      { token, newPassword },
      { requiresAuth: false }
    );
  }
  
  /**
   * Set the refresh token in local storage
   */
  public setRefreshToken(refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  /**
   * Get the refresh token from local storage
   */
  public getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  /**
   * Remove the refresh token from local storage
   */
  public removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  /**
   * Get the current user from localStorage
   */
  getCurrentUser(): UserProfile | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  }
  
  /**
   * Check if the current user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }
  
  /**
   * Check if the current user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.role === role;
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
