import { apiClient, ApiResponse } from './api-client';

// Types
export interface Coordination {
  id: string;
  requestNumber: string;
  requestTime: string;
  approvalTime?: string;
  movementTime?: string;
  returnTime: string;
  fromLocation: string;
  toLocation: string;
  department: string;
  forces: number;
  weapons: number;
  purpose: string;
  governorate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoordinationFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
  governorate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CoordinationStatistics {
  totalCoordinations: number;
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  byDepartment: {
    department: string;
    count: number;
    percentage: number;
  }[];
  byGovernorate: {
    governorate: string;
    count: number;
    percentage: number;
  }[];
  byMonth: {
    month: string;
    count: number;
  }[];
}

export interface CreateCoordinationData {
  requestTime?: string;
  returnTime: string;
  fromLocation: string;
  toLocation: string;
  department: string;
  forces: number;
  weapons: number;
  purpose: string;
  governorate: string;
}

export interface UpdateCoordinationData extends Partial<CreateCoordinationData> {
  id: string;
}

export interface CoordinationResponse {
  id: string;
  coordinationId: string;
  status: 'approved' | 'rejected';
  approvalTime?: string;
  movementTime?: string;
  rejectionReason?: string;
  respondedBy: string;
}

class CoordinationsService {
  /**
   * Get all coordinations with optional filtering
   */
  async getCoordinations(filters?: CoordinationFilters): Promise<ApiResponse<{ coordinations: Coordination[]; total: number; page: number; totalPages: number }>> {
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
    return apiClient.get<{ coordinations: Coordination[]; total: number; page: number; totalPages: number }>(`/coordinations${queryString}`);
  }
  
  /**
   * Get a single coordination by ID
   */
  async getCoordinationById(id: string): Promise<ApiResponse<Coordination>> {
    return apiClient.get<Coordination>(`/coordinations/${id}`);
  }
  
  /**
   * Create a new coordination request
   */
  async createCoordination(coordinationData: CreateCoordinationData): Promise<ApiResponse<Coordination>> {
    return apiClient.post<Coordination>('/coordinations', coordinationData);
  }
  
  /**
   * Update an existing coordination
   */
  async updateCoordination(coordinationData: UpdateCoordinationData): Promise<ApiResponse<Coordination>> {
    return apiClient.put<Coordination>(`/coordinations/${coordinationData.id}`, coordinationData);
  }
  
  /**
   * Delete a coordination
   */
  async deleteCoordination(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/coordinations/${id}`);
  }
  
  /**
   * Cancel a coordination request
   */
  async cancelCoordination(id: string, reason?: string): Promise<ApiResponse<Coordination>> {
    return apiClient.patch<Coordination>(`/coordinations/${id}/cancel`, { reason });
  }
  
  /**
   * Respond to a coordination request (approve or reject)
   */
  async respondToCoordination(id: string, response: Omit<CoordinationResponse, 'id' | 'coordinationId' | 'respondedBy'>): Promise<ApiResponse<Coordination>> {
    return apiClient.post<Coordination>(`/coordinations/${id}/respond`, response);
  }
  
  /**
   * Update the movement time (when forces actually moved)
   */
  async updateMovementTime(id: string, movementTime: string): Promise<ApiResponse<Coordination>> {
    return apiClient.patch<Coordination>(`/coordinations/${id}/movement`, { movementTime });
  }
  
  /**
   * Mark a coordination as completed
   */
  async completeCoordination(id: string): Promise<ApiResponse<Coordination>> {
    return apiClient.patch<Coordination>(`/coordinations/${id}/complete`, {});
  }
  
  /**
   * Get coordination statistics
   */
  async getCoordinationStatistics(startDate?: string, endDate?: string): Promise<ApiResponse<CoordinationStatistics>> {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<CoordinationStatistics>(`/coordinations/statistics${queryString}`);
  }
  
  /**
   * Get pending coordinations that need response
   */
  async getPendingCoordinations(): Promise<ApiResponse<Coordination[]>> {
    return apiClient.get<Coordination[]>('/coordinations/pending');
  }
  
  /**
   * Get today's coordination requests
   */
  async getTodayCoordinations(): Promise<ApiResponse<Coordination[]>> {
    return apiClient.get<Coordination[]>('/coordinations/today');
  }
  
  /**
   * Export coordinations to Excel
   */
  async exportToExcel(filters?: CoordinationFilters): Promise<ApiResponse<{ url: string }>> {
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
    return apiClient.get<{ url: string }>(`/coordinations/export/excel${queryString}`);
  }
}

// Create and export a singleton instance
export const coordinationsService = new CoordinationsService();
