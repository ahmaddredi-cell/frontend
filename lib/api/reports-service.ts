import { apiClient, ApiResponse } from './api-client';

// Types
export interface Report {
  id: string;
  reportNumber: string;
  reportDate: string;
  reportType: 'morning' | 'evening';
  summary?: string;
  status: 'draft' | 'published' | 'reviewed' | 'archived';
  governorates: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportEvent {
  id: string;
  reportId: string;
  governorate: string;
  region: string;
  eventTime: string;
  eventDate: string;
  eventType: string;
  description: string;
  palestinianIntervention?: string;
  israeliResponse?: string;
  results?: string;
  status: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  reportType?: string;
  status?: string;
  governorate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ReportStatistics {
  totalReports: number;
  byGovernorate: {
    governorate: string;
    count: number;
    percentage: number;
  }[];
  byType: {
    type: string;
    count: number;
    percentage: number;
  }[];
  byMonth: {
    month: string;
    count: number;
  }[];
}

export interface CreateReportData {
  reportNumber: string;
  reportDate: string;
  reportType: 'morning' | 'evening';
  summary?: string;
  governorates: string[];
  status?: 'draft' | 'complete' | 'approved' | 'archived';
}

export interface UpdateReportData extends Partial<CreateReportData> {
  id: string;
}

class ReportsService {
  /**
   * Get all reports with optional filtering
   */
  async getReports(filters?: ReportFilters): Promise<ApiResponse<any>> {
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
    // Use any type to handle various response formats
    // The actual controller returns { success: true, count, total, pagination: {...}, data: reports }
    return apiClient.get<any>(`/reports${queryString}`);
  }
  
  /**
   * Get a single report by ID
   */
  async getReportById(id: string): Promise<ApiResponse<Report>> {
    return apiClient.get<Report>(`/reports/${id}`);
  }
  
  /**
   * Create a new report
   */
  async createReport(reportData: CreateReportData): Promise<ApiResponse<Report>> {
    return apiClient.post<Report>('/reports', reportData);
  }
  
  /**
   * Update an existing report
   */
  async updateReport(reportData: UpdateReportData): Promise<ApiResponse<Report>> {
    return apiClient.put<Report>(`/reports/${reportData.id}`, reportData);
  }
  
  /**
   * Delete a report
   */
  async deleteReport(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/reports/${id}`);
  }
  
  /**
   * Change report status
   */
  async changeReportStatus(id: string, status: 'draft' | 'published' | 'reviewed' | 'archived'): Promise<ApiResponse<Report>> {
    return apiClient.patch<Report>(`/reports/${id}/status`, { status });
  }
  
  /**
   * Get report statistics
   */
  async getReportStatistics(startDate?: string, endDate?: string): Promise<ApiResponse<ReportStatistics>> {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<ReportStatistics>(`/reports/statistics${queryString}`);
  }
  
  /**
   * Get all events for a specific report
   */
  async getReportEvents(reportId: string): Promise<ApiResponse<ReportEvent[]>> {
    return apiClient.get<ReportEvent[]>(`/reports/${reportId}/events`);
  }
  
  /**
   * Add an event to a report
   */
  async addReportEvent(reportId: string, eventData: Omit<ReportEvent, 'id' | 'reportId'>): Promise<ApiResponse<ReportEvent>> {
    return apiClient.post<ReportEvent>(`/reports/${reportId}/events`, eventData);
  }
  
  /**
   * Update a report event
   */
  async updateReportEvent(reportId: string, eventId: string, eventData: Partial<ReportEvent>): Promise<ApiResponse<ReportEvent>> {
    return apiClient.put<ReportEvent>(`/reports/${reportId}/events/${eventId}`, eventData);
  }
  
  /**
   * Delete a report event
   */
  async deleteReportEvent(reportId: string, eventId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/reports/${reportId}/events/${eventId}`);
  }
  
  /**
   * Upload an attachment for a report event
   */
  async uploadEventAttachment(reportId: string, eventId: string, file: File): Promise<ApiResponse<Attachment>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<Attachment>(`/reports/${reportId}/events/${eventId}/attachments`, formData);
  }
  
  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/attachments/${attachmentId}`);
  }
  
  /**
   * Generate a PDF report
   */
  async generatePdf(reportId: string): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>(`/reports/${reportId}/pdf`);
  }
  
  /**
   * Export reports to Excel
   */
  async exportToExcel(filters?: ReportFilters): Promise<ApiResponse<{ url: string }>> {
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
    return apiClient.get<{ url: string }>(`/reports/export/excel${queryString}`);
  }
}

// Create and export a singleton instance
export const reportsService = new ReportsService();
