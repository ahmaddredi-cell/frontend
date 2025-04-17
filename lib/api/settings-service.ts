import { apiClient, ApiResponse } from './api-client';

// Types
export interface SystemSettings {
  companyName: string;
  systemTitle: string;
  logoPath: string;
  defaultGovernorate: string;
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  mainColor: string;
  secondaryColor: string;
  apiUrl: string;
  apiTimeout: number; // milliseconds
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string; // 24-hour format
  dataRetentionPeriod: number; // days
  maxFileSize: number; // MB
  allowedFileTypes: string;
  notifyOnLogin: boolean;
  notifyOnReportCreation: boolean;
  notifyOnCoordinationResponse: boolean;
  enableDarkMode: boolean;
  rtlLayout: boolean;
  language: 'ar' | 'en';
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  dataRetentionPeriod: number;
  backupLocation: string;
  lastBackupDate?: string;
  lastBackupStatus?: 'success' | 'failed';
}

export interface BackupResult {
  success: boolean;
  filename: string;
  timestamp: string;
  fileSize: number;
  backupPath: string;
  message?: string;
}

export interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  defaultFromEmail: string;
  defaultFromName: string;
  notificationTemplate: string;
  reportTemplate: string;
}

export interface SecuritySettings {
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordChangeInterval: number; // days
  ipWhitelist?: string[];
  useSSL: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
}

class SettingsService {
  /**
   * Get all system settings
   */
  async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    return apiClient.get<SystemSettings>('/settings/system');
  }
  
  /**
   * Update system settings
   */
  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
    return apiClient.put<SystemSettings>('/settings/system', settings);
  }
  
  /**
   * Get backup settings
   */
  async getBackupSettings(): Promise<ApiResponse<BackupSettings>> {
    return apiClient.get<BackupSettings>('/settings/backup');
  }
  
  /**
   * Update backup settings
   */
  async updateBackupSettings(settings: Partial<BackupSettings>): Promise<ApiResponse<BackupSettings>> {
    return apiClient.put<BackupSettings>('/settings/backup', settings);
  }
  
  /**
   * Trigger a manual backup
   */
  async triggerBackup(): Promise<ApiResponse<BackupResult>> {
    return apiClient.post<BackupResult>('/settings/backup/trigger');
  }
  
  /**
   * Get list of available backups
   */
  async getBackupsList(): Promise<ApiResponse<{ backups: BackupResult[] }>> {
    return apiClient.get<{ backups: BackupResult[] }>('/settings/backup/list');
  }
  
  /**
   * Restore from a backup
   */
  async restoreFromBackup(filename: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>('/settings/backup/restore', { filename });
  }
  
  /**
   * Upload a backup file
   */
  async uploadBackupFile(file: File): Promise<ApiResponse<BackupResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<BackupResult>('/settings/backup/upload', formData);
  }
  
  /**
   * Get email settings
   */
  async getEmailSettings(): Promise<ApiResponse<EmailSettings>> {
    return apiClient.get<EmailSettings>('/settings/email');
  }
  
  /**
   * Update email settings
   */
  async updateEmailSettings(settings: Partial<EmailSettings>): Promise<ApiResponse<EmailSettings>> {
    return apiClient.put<EmailSettings>('/settings/email', settings);
  }
  
  /**
   * Test email settings
   */
  async testEmailSettings(testEmail: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>('/settings/email/test', { testEmail });
  }
  
  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    return apiClient.get<SecuritySettings>('/settings/security');
  }
  
  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<ApiResponse<SecuritySettings>> {
    return apiClient.put<SecuritySettings>('/settings/security', settings);
  }
  
  /**
   * Get system logs
   */
  async getSystemLogs(page: number = 1, limit: number = 100, logLevel?: string): Promise<ApiResponse<{ logs: any[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (logLevel) {
      queryParams.append('logLevel', logLevel);
    }
    
    const queryString = queryParams.toString();
    return apiClient.get<{ logs: any[]; total: number; page: number; totalPages: number }>(`/settings/logs?${queryString}`);
  }
  
  /**
   * Clear system logs
   */
  async clearSystemLogs(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>('/settings/logs');
  }
  
  /**
   * Get system information
   */
  async getSystemInfo(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/settings/system-info');
  }
}

// Create and export a singleton instance
export const settingsService = new SettingsService();
