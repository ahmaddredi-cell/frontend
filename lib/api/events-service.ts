import { apiClient, ApiResponse } from './api-client';
import { Attachment } from './reports-service';

// Types
export interface Event {
  id: string;
  eventNumber: string;
  eventTime: string;
  eventDate: string;
  governorate: string;
  region: string;
  eventType: string;
  description: string;
  palestinianIntervention?: string;
  israeliResponse?: string;
  results?: string;
  status: 'pending' | 'inProgress' | 'completed' | 'verified';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportId?: string;
  attachments?: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  status?: string;
  severity?: string;
  governorate?: string;
  region?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface EventStatistics {
  totalEvents: number;
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
  bySeverity: {
    severity: string;
    count: number;
    percentage: number;
  }[];
  byMonth: {
    month: string;
    count: number;
  }[];
}

export interface CreateEventData {
  eventTime: string;
  eventDate: string;
  governorate: string;
  region: string;
  eventType: string;
  description: string;
  palestinianIntervention?: string;
  israeliResponse?: string;
  results?: string;
  status?: 'pending' | 'inProgress' | 'completed' | 'verified';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportId?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

class EventsService {
  /**
   * Get all events with optional filtering
   */
  async getEvents(filters?: EventFilters): Promise<ApiResponse<{ events: Event[]; total: number; page: number; totalPages: number }>> {
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
    return apiClient.get<{ events: Event[]; total: number; page: number; totalPages: number }>(`/events${queryString}`);
  }
  
  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return apiClient.get<Event>(`/events/${id}`);
  }
  
  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventData): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>('/events', eventData);
  }
  
  /**
   * Update an existing event
   */
  async updateEvent(eventData: UpdateEventData): Promise<ApiResponse<Event>> {
    return apiClient.put<Event>(`/events/${eventData.id}`, eventData);
  }
  
  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/events/${id}`);
  }
  
  /**
   * Change event status
   */
  async changeEventStatus(id: string, status: 'pending' | 'inProgress' | 'completed' | 'verified'): Promise<ApiResponse<Event>> {
    return apiClient.patch<Event>(`/events/${id}/status`, { status });
  }
  
  /**
   * Get event statistics
   */
  async getEventStatistics(startDate?: string, endDate?: string): Promise<ApiResponse<EventStatistics>> {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<EventStatistics>(`/events/statistics${queryString}`);
  }
  
  /**
   * Get all events for today
   */
  async getTodayEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get<Event[]>('/events/today');
  }
  
  /**
   * Get critical events
   */
  async getCriticalEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get<Event[]>('/events/critical');
  }
  
  /**
   * Upload an attachment for an event
   */
  async uploadEventAttachment(eventId: string, file: File): Promise<ApiResponse<Attachment>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<Attachment>(`/events/${eventId}/attachments`, formData);
  }
  
  /**
   * Export events to Excel
   */
  async exportToExcel(filters?: EventFilters): Promise<ApiResponse<{ url: string }>> {
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
    return apiClient.get<{ url: string }>(`/events/export/excel${queryString}`);
  }
}

// Create and export a singleton instance
export const eventsService = new EventsService();
