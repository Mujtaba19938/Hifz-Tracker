// Read API base URL from env (Expo public env vars)
const ENV_API_BASE = (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL as string | undefined;

// Initialize API base URL with ENV override first
let API_BASE_URL = ((): string => {
  if (ENV_API_BASE && ENV_API_BASE.trim().length > 0) {
    const normalized = ENV_API_BASE.endsWith('/api') ? ENV_API_BASE : `${ENV_API_BASE.replace(/\/$/, '')}/api`;
    console.log('✅ API Base URL set from ENV:', normalized);
    return normalized;
  }
  if (__DEV__) {
    // For development, try to read from .env file first, then fallback to localhost
    try {
      // In React Native, we can't directly read .env files, so we'll use the detected IP
      // This will be set by the updateEnv.js script before the app starts
      const fallback = 'http://localhost:5000/api';
      console.log('✅ API Base URL set to development:', fallback);
      return fallback;
    } catch (error) {
      const fallback = 'http://localhost:5000/api';
      console.log('✅ API Base URL set to development fallback:', fallback);
      return fallback;
    }
  }
  const prod = 'https://hifztracker-backend.onrender.com/api';
  console.log('✅ API Base URL set to production default:', prod);
  return prod;
})();

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
};

// Enhanced fetch with retry logic and better error handling
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    // Do not throw on non-OK here; let callers read the body and surface a useful message
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retryCount < RETRY_CONFIG.maxRetries) {
      console.log(`🔄 Retry ${retryCount + 1}/${RETRY_CONFIG.maxRetries} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelay * (retryCount + 1)));
      return fetchWithRetry(url, options, retryCount + 1);
    }
    
    console.error(`❌ Network request failed after ${RETRY_CONFIG.maxRetries} retries:`, error);
    throw error;
  }
}

// Safe JSON parsing with detailed error logging
function safeJsonParse<T>(text: string, context: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`❌ JSON parsing failed for ${context}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      rawResponse: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      responseLength: text.length
    });
    return null;
  }
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface User {
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

interface CreateUserData {
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

// Backend models (subset)
interface StudentDoc {
  _id: string;
  name: string;
  urduName: string;
  class: string;
  section: string;
  studentId: string;
  teacherId?: string;
}

interface HomeworkAssignment {
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

interface AssignLessonPayload {
  studentId: string;
  studentName?: string;
  startSurah: { number: number; name: string; urduName: string };
  startVerse: number;
  endSurah: { number: number; name: string; urduName: string };
  endVerse: number;
  dueDate: string;
  notes?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    // This will be set by the AuthContext
    return (global as any).authToken || null;
  }

  private setAuthToken(token: string | null) {
    (global as any).authToken = token;
  }

  // Public method to set token from AuthContext
  setToken(token: string | null) {
    this.setAuthToken(token);
  }

  private async tryMultipleIPs<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const possibleIPs = [
      '192.168.100.28',  // Main WiFi interface
      '10.5.0.2',        // VPN interface
      'localhost',        // Localhost fallback
      '127.0.0.1',       // Localhost alternative
    ];

    // If an ENV base URL is set, do not attempt IP probing
    if (ENV_API_BASE && ENV_API_BASE.trim().length > 0) {
      return {
        success: false,
        error: 'Network request failed',
      };
    }

    for (const ip of possibleIPs) {
      const fullUrl = `http://${ip}:5000/api${endpoint}`;
      console.log(`🧪 Trying IP: ${ip} - ${fullUrl}`);
      
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        const token = this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(fullUrl, {
          method: options.method || 'GET',
          headers,
          body: options.body,
        });

        console.log(`✅ Success with IP: ${ip}`);
        console.log('📡 API Response status:', response.status);
        
        // JSON-safe parsing to prevent "Unexpected character" errors
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        let data: any;
        try {
          data = JSON.parse(responseText);
          console.log('📦 Parsed JSON data:', data);
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          console.error('📄 Invalid response text:', responseText);
          throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
        }
        
        if (!response.ok) {
          throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        // Update the global API_BASE_URL to the working IP
        API_BASE_URL = `http://${ip}:5000/api`;
        console.log(`🔄 Updated API_BASE_URL to: ${API_BASE_URL}`);

        return data;
      } catch (error) {
        console.log(`❌ Failed with IP: ${ip} - ${error instanceof Error ? error.message : 'Unknown error'}`);
        continue; // Try next IP
      }
    }

    // If all IPs failed
    return {
      success: false,
      error: 'Cannot connect to server. Please check if the backend is running and accessible.',
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    console.log('🌐 Making API request to endpoint:', endpoint);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('🌍 Platform:', navigator.platform);
    console.log('🔧 Current API Base URL:', API_BASE_URL);
    
    // Try the current API_BASE_URL first
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('🧪 Testing current URL:', fullUrl);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      // Add authorization header if token exists
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetchWithRetry(fullUrl, {
        method: options.method || 'GET',
        headers,
        body: options.body,
      });

      console.log('✅ Success with current URL');
      console.log('📡 API Response status:', response.status);
      
      // JSON-safe parsing to prevent "Unexpected character" errors
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      const data = safeJsonParse<T>(responseText, `API request to ${endpoint}`);
      if (data === null) {
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('📦 Parsed JSON data:', data);
      
      if (!response.ok) {
        const errorMessage = (data as any)?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.log('❌ API request failed');
      console.error('🔍 Error:', error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network request failed',
      };
    }
  }

  // Admin API calls
  async getAllUsers(): Promise<ApiResponse<{ users: User[]; total: number }>> {
    return this.makeRequest<{ users: User[]; total: number }>('/admin/users');
  }

  async addTeacher(userData: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/admin/add-teacher', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async addStudent(userData: CreateUserData): Promise<ApiResponse<{ user: User; student: StudentDoc }>> {
    console.log('API Service - Adding student with data:', {
      ...userData,
      password: '[REDACTED]',
      passwordLength: userData.password?.length
    });
    
    return this.makeRequest<{ user: User; student: StudentDoc }>('/admin/add-student', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Auth API calls
  async adminLogin(username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('API Service - Admin login request:', {
      username,
      hasPassword: !!password,
      passwordLength: password?.length
    });
    
    const requestBody = { username, password };
    console.log('API Service - Request body:', {
      ...requestBody,
      password: '[REDACTED]'
    });
    
    return this.makeRequest<{ user: User; token: string }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async studentLogin(studentId: string, password?: string): Promise<ApiResponse<{ student: User; token: string }>> {
    console.log('API Service - Student login request:', {
      studentId,
      hasPassword: !!password,
      passwordLength: password?.length
    });
    
    const requestBody = { studentId, password };
    console.log('API Service - Request body:', {
      ...requestBody,
      password: '[REDACTED]'
    });
    
    return this.makeRequest<{ student: User; token: string }>('/auth/student-login', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // Attendance/Students
  async getStudentsByClassSection(
    className: string,
    section: string
  ): Promise<ApiResponse<{ students: Pick<StudentDoc, 'name' | 'urduName' | 'studentId'>[] }>> {
    return this.makeRequest<{ students: Pick<StudentDoc, 'name' | 'urduName' | 'studentId'>[] }>(
      `/attendance/students/${encodeURIComponent(className)}/${encodeURIComponent(section)}`
    );
  }

  // Homework / Lessons
  async assignLesson(payload: AssignLessonPayload): Promise<ApiResponse<{ homework: HomeworkAssignment }>> {
    return this.makeRequest<{ homework: HomeworkAssignment }>(
      '/homework',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  }

  async getHomeworkByStudent(
    studentId: string,
    options: { page?: number; limit?: number; status?: 'assigned' | 'completed' | 'overdue' } = {}
  ): Promise<ApiResponse<{ homework: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>> {
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.status) params.set('status', options.status);
    return this.makeRequest<{ homework: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>(
      `/homework/student/${encodeURIComponent(studentId)}?${params.toString()}`
    );
  }

  async getMyAssignments(
    options: { page?: number; limit?: number; status?: 'assigned' | 'completed' | 'overdue'; type?: string } = {}
  ): Promise<ApiResponse<{ assignments: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>> {
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.status) params.set('status', options.status);
    if (options.type) params.set('type', options.type);
    return this.makeRequest<{ assignments: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>(
      `/homework/student-assignments?${params.toString()}`
    );
  }
}

export const apiService = new ApiService();
export type { User, CreateUserData, ApiResponse, StudentDoc, HomeworkAssignment, AssignLessonPayload };
