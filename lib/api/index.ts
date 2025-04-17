/**
 * API Services Index
 * 
 * This file exports all API services to provide a centralized import point.
 * Import services from this file instead of importing them directly from their individual files.
 * Example: 
 * import { authService, reportsService } from '@/lib/api';
 */

// Import types we need to reference in this file
import { ApiResponse } from './api-client';

// Base API client
export { apiClient } from './api-client';
export type { ApiResponse, RequestOptions } from './api-client';

// Auth Service
export { authService } from './auth-service';
export type { 
  LoginCredentials,
  AuthResponse,
  UserProfile,
  PasswordChange
} from './auth-service';

// Reports Service
export { reportsService } from './reports-service';
export type {
  Report,
  ReportEvent,
  Attachment,
  ReportFilters,
  ReportStatistics,
  CreateReportData,
  UpdateReportData
} from './reports-service';

// Events Service
export { eventsService } from './events-service';
export type {
  Event,
  EventFilters,
  EventStatistics,
  CreateEventData,
  UpdateEventData
} from './events-service';

// Coordinations Service
export { coordinationsService } from './coordinations-service';
export type {
  Coordination,
  CoordinationFilters,
  CoordinationStatistics,
  CreateCoordinationData,
  UpdateCoordinationData,
  CoordinationResponse
} from './coordinations-service';

// Users Service
export { usersService } from './users-service';
export type {
  User,
  UserFilters,
  CreateUserData,
  UpdateUserData
} from './users-service';

// Governorates Service
export { governoratesService } from './governorates-service';
export type {
  Governorate,
  CreateGovernorateData,
  UpdateGovernorateData
} from './governorates-service';

// Settings Service
export { settingsService } from './settings-service';
export type {
  SystemSettings,
  BackupSettings,
  BackupResult,
  EmailSettings,
  SecuritySettings
} from './settings-service';

/**
 * Simplified check for API Response success
 * Use this to easily check if an API response was successful
 * Example:
 * if (isSuccessResponse(response)) {
 *   // do something with response.data
 * }
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.success === true;
}
