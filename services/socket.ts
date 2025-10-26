import { io, Socket } from 'socket.io-client';
import { enhancedApiService } from './enhancedApi';

function getSocketBaseUrl(): string {
  const api = enhancedApiService.getApiBaseUrl();
  if (api) {
    // Remove trailing /api if present
    return api.replace(/\/api\/?$/, '');
  }
  // Fallback for development
  return 'http://localhost:5000';
}

// Initialize a single socket instance
const socketUrl = getSocketBaseUrl();
console.log(`[socket] Connecting to ${socketUrl}`);
export const socket: Socket = io(socketUrl, {
  transports: ['websocket'],
});

// Optional helpers
export function joinClassRoom(className: string, section: string) {
  socket.emit('join_class', { className, section });
}

export function joinStudentRoom(studentId: string) {
  socket.emit('join_student', studentId);
}
