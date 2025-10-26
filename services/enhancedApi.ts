import { networkDetector, NetworkDetectionOptions } from '../utils/networkDetector';

// Read API base URL from env (Expo public env vars)
const ENV_API_BASE = (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL as string | undefined;

// Enhanced API service with automatic network detection
class EnhancedApiService {
  private apiBaseUrl: string | null = null;
  private isDetecting = false;
  private lastDetectionTime = 0;
  private detectionCache = new Map<string, { url: string; timestamp: number }>();
  private connectionHistory: Array<{ url: string; success: boolean; timestamp: number; error?: string }> = [];

  constructor() {
    this.initializeApiBaseUrl();
  }

  /**
   * Initialize API base URL with environment override or auto-detection
   */
  private async initializeApiBaseUrl(): Promise<void> {
    console.log('🚀 Initializing Enhanced API Service...');
    
    // If ENV variable is set, use it directly
    if (ENV_API_BASE && ENV_API_BASE.trim().length > 0) {
      this.apiBaseUrl = ENV_API_BASE.endsWith('/api') ? ENV_API_BASE : `${ENV_API_BASE.replace(/\/$/, '')}/api`;
      console.log('✅ API Base URL set from ENV:', this.apiBaseUrl);
      return;
    }

    // For development, try auto-detection
    if (__DEV__) {
      console.log('🔍 Development mode: Starting network detection...');
      await this.detectAndSetBackendUrl();
    } else {
      // Production fallback
      this.apiBaseUrl = 'https://hifztracker-backend.onrender.com/api';
      console.log('✅ API Base URL set to production:', this.apiBaseUrl);
    }
  }

  /**
   * Create an abort signal with timeout that works across RN/web.
   * Uses AbortSignal.timeout if available, otherwise falls back to AbortController.
   */
  private withTimeout(timeoutMs: number): { signal: AbortSignal | undefined; cancel: () => void } {
    try {
      // Prefer native AbortSignal.timeout when available
      const anyAbort: any = (global as any).AbortSignal || (typeof AbortSignal !== 'undefined' ? AbortSignal : undefined);
      if (anyAbort && typeof anyAbort.timeout === 'function') {
        return { signal: anyAbort.timeout(timeoutMs), cancel: () => {} };
      }
    } catch (_) {}

    // Fallback using AbortController
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, timeoutMs);
      return { signal: controller.signal, cancel: () => clearTimeout(id) };
    } catch (_) {
      // Last resort: no signal support
      return { signal: undefined, cancel: () => {} };
    }
  }

  /**
   * Detect and set the best backend URL
   */
  async detectAndSetBackendUrl(options: NetworkDetectionOptions = {}): Promise<string | null> {
    if (this.isDetecting) {
      console.log('⏳ Network detection already in progress...');
      return this.apiBaseUrl;
    }

    this.isDetecting = true;
    
    try {
      console.log('🔍 Starting backend URL detection...');
      
      const { url, results } = await networkDetector.detectBackendURL({
        timeout: 3000,
        retries: 1,
        port: 5000,
        ...options,
      });

      if (url) {
        this.apiBaseUrl = url;
        this.lastDetectionTime = Date.now();
        
        // Cache the successful detection
        this.detectionCache.set('working_url', { url, timestamp: Date.now() });
        
        console.log(`✅ Backend URL detected and set: ${url}`);
        
        // Log connection history
        this.connectionHistory.push({
          url,
          success: true,
          timestamp: Date.now(),
        });
        
        return url;
      } else {
        console.log('❌ No working backend URL found');
        this.logTroubleshootingInfo(results);
        return null;
      }
    } catch (error) {
      console.error('❌ Error during network detection:', error);
      return null;
    } finally {
      this.isDetecting = false;
    }
  }

  /**
   * Get the current API base URL
   */
  getApiBaseUrl(): string | null {
    return this.apiBaseUrl;
  }

  /**
   * Force refresh the backend URL detection
   */
  async refreshBackendUrl(): Promise<string | null> {
    console.log('🔄 Force refreshing backend URL detection...');
    networkDetector.clearCache();
    this.detectionCache.clear();
    return await this.detectAndSetBackendUrl();
  }

  /**
   * Check if backend is reachable
   */
  async checkBackendHealth(): Promise<{ reachable: boolean; url: string | null; error?: string }> {
    if (!this.apiBaseUrl) {
      return { reachable: false, url: null, error: 'No API base URL set' };
    }

    try {
      const healthUrl = `${this.apiBaseUrl}/health`;
      console.log(`🏥 Checking backend health at: ${healthUrl}`);
      
      const { signal, cancel } = this.withTimeout(5000);
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
      });
      cancel();

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend health check successful:', data);
        return { reachable: true, url: this.apiBaseUrl };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Backend health check failed: ${errorMessage}`);
      
      // Log failed connection
      this.connectionHistory.push({
        url: this.apiBaseUrl,
        success: false,
        timestamp: Date.now(),
        error: errorMessage,
      });
      
      return { reachable: false, url: this.apiBaseUrl, error: errorMessage };
    }
  }

  /**
   * Enhanced fetch with automatic retry and fallback
   */
  async fetchWithAutoDetection<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; url?: string }> {
    // Ensure we have a valid API base URL
    if (!this.apiBaseUrl) {
      console.log('⚠️ No API base URL, attempting detection...');
      const detectedUrl = await this.detectAndSetBackendUrl();
      if (!detectedUrl) {
        return {
          success: false,
          error: 'Unable to detect backend URL. Please check your network connection and ensure the backend server is running.',
        };
      }
    }

    const fullUrl = `${this.apiBaseUrl}${endpoint}`;
    console.log(`🌐 Making request to: ${fullUrl}`);

    try {
      const { signal, cancel } = this.withTimeout(10000);
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal,
      });
      cancel();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data, url: fullUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Request failed to ${fullUrl}:`, errorMessage);
      
      // If this is a network error, try to detect a new backend URL
      if (errorMessage.includes('Network request failed') || errorMessage.includes('fetch')) {
        console.log('🔄 Network error detected, attempting to find new backend URL...');
        const newUrl = await this.detectAndSetBackendUrl();
        
        if (newUrl && newUrl !== this.apiBaseUrl) {
          console.log(`🔄 Retrying with new URL: ${newUrl}`);
          return this.fetchWithAutoDetection(endpoint, options);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        url: fullUrl,
      };
    }
  }

  /**
   * Get connection statistics and history
   */
  getConnectionStats(): {
    currentUrl: string | null;
    lastDetection: number;
    totalAttempts: number;
    successfulAttempts: number;
    recentErrors: string[];
  } {
    const recentErrors = this.connectionHistory
      .filter(entry => !entry.success && Date.now() - entry.timestamp < 300000) // Last 5 minutes
      .map(entry => entry.error || 'Unknown error');

    return {
      currentUrl: this.apiBaseUrl,
      lastDetection: this.lastDetectionTime,
      totalAttempts: this.connectionHistory.length,
      successfulAttempts: this.connectionHistory.filter(entry => entry.success).length,
      recentErrors,
    };
  }

  /**
   * Log troubleshooting information
   */
  private logTroubleshootingInfo(results: any[]): void {
    console.log('\n🔧 Backend Connection Troubleshooting:');
    console.log('=====================================');
    
    const failedCount = results.filter(r => !r.success).length;
    const timeoutCount = results.filter(r => r.error?.includes('timeout')).length;
    const networkErrorCount = results.filter(r => r.error?.includes('Network request failed')).length;
    
    console.log(`📊 Tested ${results.length} URLs`);
    console.log(`❌ Failed: ${failedCount}`);
    console.log(`⏱️ Timeouts: ${timeoutCount}`);
    console.log(`🌐 Network errors: ${networkErrorCount}`);
    
    console.log('\n💡 Troubleshooting suggestions:');
    console.log('1. Ensure the backend server is running: npm run start:backend');
    console.log('2. Check if the backend is accessible from your device');
    console.log('3. Verify firewall settings allow connections on port 5000');
    console.log('4. Ensure your device and computer are on the same network');
    console.log('5. Try connecting to the backend from a web browser first');
    console.log('6. Check the backend logs for any error messages');
    
    if (timeoutCount > 0) {
      console.log('\n⏱️ Timeout issues detected:');
      console.log('- The backend might be slow to respond');
      console.log('- Try increasing the timeout in the options');
      console.log('- Check if the backend is under heavy load');
    }
    
    if (networkErrorCount > 0) {
      console.log('\n🌐 Network connectivity issues:');
      console.log('- Check your internet connection');
      console.log('- Verify the backend server is running');
      console.log('- Ensure no firewall is blocking the connection');
    }
  }
}

// Export singleton instance
export const enhancedApiService = new EnhancedApiService();

// Export types for use in other files
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  role: 'teacher' | 'admin' | 'student';
  studentInfo?: {
    class: string;
    section: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  role: 'teacher' | 'student';
  studentInfo?: {
    class: string;
    section: string;
    urduName?: string;
    teacherId?: string;
  };
}

export interface StudentDoc {
  _id: string;
  name: string;
  urduName: string;
  class: string;
  section: string;
  studentId: string;
  teacherId?: string;
}

export interface HomeworkAssignment {
  _id: string;
  studentId: string;
  studentName: string;
  startSurah: { number: number; name: string; urduName: string };
  startVerse: number;
  endSurah: { number: number; name: string; urduName: string };
  endVerse: number;
  assignedDate: string;
  dueDate: string;
  status: 'assigned' | 'completed' | 'overdue';
  notes?: string;
}

export interface AssignLessonPayload {
  studentId: string;
  studentName?: string;
  startSurah: { number: number; name: string; urduName: string };
  startVerse: number;
  endSurah: { number: number; name: string; urduName: string };
  endVerse: number;
  dueDate: string;
  notes?: string;
}
