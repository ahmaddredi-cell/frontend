import { apiClient, ApiResponse } from './api-client';

// Types
export interface MemoRelease {
  id: string;
  referenceNumber: string;
  type: 'memo' | 'release';
  date: string;
  time: string;
  location?: string;
  subject: string;
  content?: string;
  governorate: string;
  issuedTo?: string;
  issuedBy?: string;
  personName?: string;
  personId?: string;
  dateOfBirth?: string;
  residencePlace?: string;
  detentionDate?: string;
  releaseDate?: string;
  detentionPeriod?: string;
  detentionReason?: string;
  status: 'draft' | 'sent' | 'received' | 'processed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoReleaseFilters {
  startDate?: string;
  endDate?: string;
  type?: 'memo' | 'release' | string;
  status?: string;
  governorate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateMemoData {
  type: 'memo';
  date: string;
  time: string;
  location?: string;
  subject: string;
  content?: string;
  governorate: string;
  issuedTo?: string;
  issuedBy?: string;
  status?: 'draft' | 'sent';
}

export interface CreateReleaseData {
  type: 'release';
  date: string;
  time: string;
  location?: string;
  subject: string;
  content?: string;
  governorate: string;
  issuedTo?: string;
  issuedBy?: string;
  personName: string;
  personId?: string;
  dateOfBirth?: string;
  residencePlace: string;
  detentionDate: string;
  releaseDate?: string;
  detentionPeriod?: string;
  detentionReason?: string;
  status?: 'draft' | 'sent';
}

export type CreateMemoReleaseData = CreateMemoData | CreateReleaseData;

// Define a base interface with common properties for both types
export interface BaseMemoReleaseData {
  date: string;
  time: string;
  location?: string;
  subject: string;
  content?: string;
  governorate: string;
  issuedTo?: string;
  issuedBy?: string;
  status?: 'draft' | 'sent';
}

// Update interface using intersection types instead of extends
export interface UpdateMemoReleaseData {
  id: string;
  type?: 'memo' | 'release';
  date?: string;
  time?: string;
  location?: string;
  subject?: string;
  content?: string;
  governorate?: string;
  issuedTo?: string;
  issuedBy?: string;
  personName?: string;
  personId?: string;
  dateOfBirth?: string;
  residencePlace?: string;
  detentionDate?: string;
  releaseDate?: string;
  detentionPeriod?: string;
  detentionReason?: string;
  status?: 'draft' | 'sent' | 'received' | 'processed';
}

class MemosService {
  /**
   * Get all memos/releases with optional filtering
   */
  async getMemosReleases(filters?: MemoReleaseFilters): Promise<ApiResponse<{ documents: MemoRelease[]; total: number; page: number; totalPages: number }>> {
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
    return apiClient.get<{ documents: MemoRelease[]; total: number; page: number; totalPages: number }>(`/memos${queryString}`);
  }
  
  /**
   * Get a single memo/release by ID
   */
  async getMemoReleaseById(id: string): Promise<ApiResponse<MemoRelease>> {
    return apiClient.get<MemoRelease>(`/memos/${id}`);
  }
  
  /**
   * Create a new memo/release
   */
  async createMemoRelease(data: CreateMemoReleaseData): Promise<ApiResponse<MemoRelease>> {
    return apiClient.post<MemoRelease>('/memos', data);
  }
  
  /**
   * Update an existing memo/release
   */
  async updateMemoRelease(data: UpdateMemoReleaseData): Promise<ApiResponse<MemoRelease>> {
    return apiClient.put<MemoRelease>(`/memos/${data.id}`, data);
  }
  
  /**
   * Delete a memo/release
   */
  async deleteMemoRelease(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/memos/${id}`);
  }
  
  /**
   * Change memo/release status
   */
  async changeStatus(id: string, status: 'draft' | 'sent' | 'received' | 'processed'): Promise<ApiResponse<MemoRelease>> {
    return apiClient.patch<MemoRelease>(`/memos/${id}/status`, { status });
  }
  
  /**
   * Upload an attachment for a memo/release
   */
  async uploadAttachment(id: string, file: File): Promise<ApiResponse<{ filename: string; path: string; mimetype: string; size: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<{ filename: string; path: string; mimetype: string; size: number }>(`/memos/${id}/attachments`, formData);
  }
  
  /**
   * Delete an attachment
   */
  async deleteAttachment(memoId: string, attachmentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/memos/${memoId}/attachments/${attachmentId}`);
  }
  
  /**
   * Generate a PDF
   */
  async generatePdf(id: string): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>(`/memos/${id}/pdf`);
  }
  
  /**
   * Export to Excel
   */
  async exportToExcel(filters?: MemoReleaseFilters): Promise<ApiResponse<{ url: string }>> {
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
    return apiClient.get<{ url: string }>(`/memos/export/excel${queryString}`);
  }
}

// Create and export a singleton instance
export const memosService = new MemosService();
