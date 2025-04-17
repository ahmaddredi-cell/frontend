/**
 * Governorates Service
 * 
 * This service handles API requests related to governorates.
 */

import { apiClient, ApiResponse } from './api-client';

// Types
export interface Governorate {
  _id: string;
  name: string;
  code: string;
  regions: string[];
}

export interface CreateGovernorateData {
  name: string;
  code: string;
  regions?: string[];
}

export interface UpdateGovernorateData {
  name?: string;
  code?: string;
  regions?: string[];
}

class GovernoratesService {
  /**
   * Get all governorates
   */
  async getGovernorates(): Promise<ApiResponse<Governorate[]>> {
    return apiClient.get<Governorate[]>('/governorates');
  }

  /**
   * Get a single governorate by ID
   */
  async getGovernorate(id: string): Promise<ApiResponse<Governorate>> {
    return apiClient.get<Governorate>(`/governorates/${id}`);
  }

  /**
   * Get regions for a governorate
   */
  async getGovernorateRegions(id: string): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`/governorates/${id}/regions`);
  }

  /**
   * Create a new governorate (admin only)
   */
  async createGovernorate(data: CreateGovernorateData): Promise<ApiResponse<Governorate>> {
    return apiClient.post<Governorate>('/governorates', data);
  }

  /**
   * Update a governorate (admin only)
   */
  async updateGovernorate(id: string, data: UpdateGovernorateData): Promise<ApiResponse<Governorate>> {
    return apiClient.put<Governorate>(`/governorates/${id}`, data);
  }

  /**
   * Delete a governorate (admin only)
   */
  async deleteGovernorate(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/governorates/${id}`);
  }

  /**
   * Add a region to a governorate (admin only)
   */
  async addRegion(id: string, regionName: string): Promise<ApiResponse<Governorate>> {
    return apiClient.post<Governorate>(`/governorates/${id}/regions`, { name: regionName });
  }

  /**
   * Remove a region from a governorate (admin only)
   */
  async removeRegion(id: string, regionName: string): Promise<ApiResponse<Governorate>> {
    return apiClient.delete<Governorate>(`/governorates/${id}/regions/${encodeURIComponent(regionName)}`);
  }
}

// Export a singleton instance
export const governoratesService = new GovernoratesService();
