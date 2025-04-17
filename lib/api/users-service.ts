import { apiClient, ApiResponse } from './api-client';

// Types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  governorate: string;
  permissions: string[];
  lastLogin: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  governorate?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
  governorate: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: string;
}

class UsersService {
  /**
   * Get all users with optional filtering
   */
  async getUsers(filters?: UserFilters): Promise<ApiResponse<{ users: User[]; total: number; page: number; totalPages: number }>> {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<{ users: User[]; total: number; page: number; totalPages: number }>(`/users${queryString}`);
  }
  
  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', userData);
  }
  
  /**
   * Update an existing user
   */
  async updateUser(userData: UpdateUserData): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${userData.id}`, userData);
  }
  
  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/users/${id}`);
  }
  
  /**
   * Change user status (activate/deactivate)
   */
  async changeUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/users/${id}/status`, { status });
  }
  
  /**
   * Reset user password (admin function)
   */
  async resetUserPassword(id: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(`/users/${id}/reset-password`, { newPassword });
  }
  
  /**
   * Get all available roles
   */
  async getRoles(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/users/roles');
  }
  
  /**
   * Get all available permissions
   */
  async getPermissions(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/users/permissions');
  }
  
  /**
   * Get user activity log
   */
  async getUserActivityLog(id: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{ activities: any[]; total: number; page: number; totalPages: number }>> {
    return apiClient.get<{ activities: any[]; total: number; page: number; totalPages: number }>(`/users/${id}/activity-log?page=${page}&limit=${limit}`);
  }
  
  /**
   * Export users to Excel
   */
  async exportToExcel(filters?: UserFilters): Promise<ApiResponse<{ url: string }>> {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<{ url: string }>(`/users/export/excel${queryString}`);
  }
}

// Create and export a singleton instance
export const usersService = new UsersService();
