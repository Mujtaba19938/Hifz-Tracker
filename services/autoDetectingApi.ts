import { enhancedApiService, ApiResponse, User, CreateUserData, StudentDoc, HomeworkAssignment, AssignLessonPayload } from './enhancedApi';

// Types for class management
export interface ClassItem {
  _id: string;
  name: string;
  sections: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auto-detecting API service that automatically finds and connects to the backend
 * This service extends the enhanced API with all the existing API methods
 */
class AutoDetectingApiService {
  private authToken: string | null = null;

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.authToken = token;
    console.log('🔐 Auth token updated:', token ? 'Set' : 'Cleared');
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Make authenticated request with auto-detection
   */
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await enhancedApiService.fetchWithAutoDetection<T>(endpoint, {
      ...options,
      headers,
    });

    if (result.success) {
      return result.data as ApiResponse<T>;
    } else {
      return {
        success: false,
        error: result.error || 'Network request failed',
      };
    }
  }

  /**
   * Check backend connectivity and get status
   */
  async checkBackendStatus(): Promise<{
    reachable: boolean;
    url: string | null;
    error?: string;
    stats: any;
  }> {
    console.log('🏥 Checking backend status...');
    
    const healthCheck = await enhancedApiService.checkBackendHealth();
    const stats = enhancedApiService.getConnectionStats();
    
    return {
      ...healthCheck,
      stats,
    };
  }

  /**
   * Force refresh backend URL detection
   */
  async refreshBackendConnection(): Promise<string | null> {
    console.log('🔄 Refreshing backend connection...');
    return await enhancedApiService.refreshBackendUrl();
  }

  // ==================== ADMIN API METHODS ====================

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<ApiResponse<{ users: User[]; total: number }>> {
    console.log('👥 Fetching all users...');
    return this.makeAuthenticatedRequest<{ users: User[]; total: number }>('/admin/users');
  }

  /**
   * Add a new teacher
   */
  async addTeacher(userData: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    console.log('👨‍🏫 Adding teacher:', { name: userData.name, role: userData.role });
    
    return this.makeAuthenticatedRequest<{ user: User }>('/admin/add-teacher', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Add a new student
   */
  async addStudent(userData: CreateUserData): Promise<ApiResponse<{ user: User; student: StudentDoc }>> {
    console.log('👨‍🎓 Adding student:', { 
      name: userData.name, 
      role: userData.role,
      class: userData.studentInfo?.class,
      section: userData.studentInfo?.section 
    });
    
    return this.makeAuthenticatedRequest<{ user: User; student: StudentDoc }>('/admin/add-student', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Deleting user:', userId);
    
    return this.makeAuthenticatedRequest<void>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ==================== CLASS MANAGEMENT METHODS ====================

  async getClasses(): Promise<ApiResponse<ClassItem[]>> {
    console.log('🏫 Fetching classes...');
    return this.makeAuthenticatedRequest<ClassItem[]>(`/classes`);
  }

  async createClass(payload: { name: string; sections: string[] }): Promise<ApiResponse<ClassItem>> {
    console.log('🏫 Creating class:', payload.name);
    return this.makeAuthenticatedRequest<ClassItem>(`/classes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteClass(id: string): Promise<ApiResponse<void>> {
    console.log('🏫 Deleting class:', id);
    return this.makeAuthenticatedRequest<void>(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== AUTH API METHODS ====================

  /**
   * Admin login
   */
  async adminLogin(username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('🔐 Admin login attempt:', { username });
    
    const result = await this.makeAuthenticatedRequest<{ user: User; token: string }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    // If login successful, set the token
    if (result.success && result.data?.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  // ==================== ATTENDANCE API METHODS ====================

  /**
   * Get students by class and section
   */
  async getStudentsByClassSection(
    className: string,
    section: string
  ): Promise<ApiResponse<{ students: Pick<StudentDoc, 'name' | 'urduName' | 'studentId'>[] }>> {
    console.log('👥 Fetching students by class/section:', { className, section });
    
    return this.makeAuthenticatedRequest<{ students: Pick<StudentDoc, 'name' | 'urduName' | 'studentId'>[] }>(
      `/attendance/students/${encodeURIComponent(className)}/${encodeURIComponent(section)}`
    );
  }

  // ==================== HOMEWORK API METHODS ====================

  /**
   * Assign a lesson to a student
   */
  async assignLesson(payload: AssignLessonPayload): Promise<ApiResponse<{ homework: HomeworkAssignment }>> {
    console.log('📚 Assigning lesson:', {
      studentId: payload.studentId,
      startSurah: payload.startSurah.name,
      endSurah: payload.endSurah.name,
      dueDate: payload.dueDate
    });
    
    return this.makeAuthenticatedRequest<{ homework: HomeworkAssignment }>('/homework', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get homework assignments for a specific student
   */
  async getHomeworkByStudent(
    studentId: string,
    options: { page?: number; limit?: number; status?: 'assigned' | 'completed' | 'overdue' } = {}
  ): Promise<ApiResponse<{ homework: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>> {
    console.log('📚 Fetching homework for student:', { studentId, options });
    
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.status) params.set('status', options.status);
    
    return this.makeAuthenticatedRequest<{ homework: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>(
      `/homework/student/${encodeURIComponent(studentId)}?${params.toString()}`
    );
  }

  /**
   * Get my assignments (for students)
   */
  async getMyAssignments(
    options: { page?: number; limit?: number; status?: 'assigned' | 'completed' | 'overdue'; type?: string; studentId?: string } = {}
  ): Promise<ApiResponse<{ assignments: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>> {
    console.log('📚 Fetching my assignments:', options);
    
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.status) params.set('status', options.status);
    if (options.type) params.set('type', options.type);
    if (options.studentId) params.set('studentId', options.studentId);
    
    return this.makeAuthenticatedRequest<{ assignments: HomeworkAssignment[]; pagination: { current: number; pages: number; total: number } }>(
      `/homework/student-assignments?${params.toString()}`
    );
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get current API base URL
   */
  getCurrentApiUrl(): string | null {
    return enhancedApiService.getApiBaseUrl();
  }

  /**
   * Get connection statistics
   */
  getConnectionStats() {
    return enhancedApiService.getConnectionStats();
  }

  /**
   * Logout (clear token)
   */
  logout(): void {
    this.setToken(null);
    console.log('👋 User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authToken !== null;
  }
}

// Export singleton instance
export const autoDetectingApiService = new AutoDetectingApiService();

// Re-export types for convenience
export type {
  ApiResponse,
  User,
  CreateUserData,
  StudentDoc,
  HomeworkAssignment,
  AssignLessonPayload,
};
