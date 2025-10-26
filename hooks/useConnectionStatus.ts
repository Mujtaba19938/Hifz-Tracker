import { useState, useEffect, useCallback } from 'react';
import { connectionInitializer } from '../services/connectionInitializer';
import { autoDetectingApiService } from '../services/autoDetectingApi';

export interface ConnectionStatus {
  isInitialized: boolean;
  isConnected: boolean;
  url: string | null;
  isChecking: boolean;
  error: string | null;
  stats: {
    currentUrl: string | null;
    lastDetection: number;
    totalAttempts: number;
    successfulAttempts: number;
    recentErrors: string[];
  };
}

export interface UseConnectionStatusReturn {
  status: ConnectionStatus;
  refreshConnection: () => Promise<boolean>;
  checkConnection: () => Promise<void>;
  getTroubleshootingInfo: () => any;
}

/**
 * Hook for managing connection status and auto-detection
 * Provides real-time connection status and troubleshooting capabilities
 */
export const useConnectionStatus = (): UseConnectionStatusReturn => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isInitialized: false,
    isConnected: false,
    url: null,
    isChecking: false,
    error: null,
    stats: {
      currentUrl: null,
      lastDetection: 0,
      totalAttempts: 0,
      successfulAttempts: 0,
      recentErrors: [],
    },
  });

  const updateStatus = useCallback(async () => {
    try {
      const connectionStatus = await connectionInitializer.getConnectionStatus();
      const stats = autoDetectingApiService.getConnectionStats();
      
      setStatus(prev => ({
        ...prev,
        isInitialized: connectionStatus.initialized,
        isConnected: connectionStatus.connected,
        url: connectionStatus.url,
        error: connectionStatus.error || null,
        stats,
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isConnected: false,
      }));
    }
  }, []);

  const checkConnection = useCallback(async () => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));
    
    try {
      await updateStatus();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Connection check failed',
        isConnected: false,
      }));
    } finally {
      setStatus(prev => ({ ...prev, isChecking: false }));
    }
  }, [updateStatus]);

  const refreshConnection = useCallback(async (): Promise<boolean> => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));
    
    try {
      const success = await connectionInitializer.refreshConnection();
      await updateStatus();
      return success;
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Refresh failed',
        isConnected: false,
      }));
      return false;
    } finally {
      setStatus(prev => ({ ...prev, isChecking: false }));
    }
  }, [updateStatus]);

  const getTroubleshootingInfo = useCallback(() => {
    return connectionInitializer.getTroubleshootingInfo();
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await connectionInitializer.initialize();
        await updateStatus();
      } catch (error) {
        console.error('Failed to initialize connection:', error);
        setStatus(prev => ({
          ...prev,
          error: 'Failed to initialize connection',
          isConnected: false,
        }));
      }
    };

    initializeConnection();
  }, [updateStatus]);

  // Set up periodic connection checking in development
  useEffect(() => {
    if (!__DEV__) return;

    const interval = setInterval(() => {
      if (!status.isChecking) {
        checkConnection();
      }
    }, 30000); // Check every 30 seconds in development

    return () => clearInterval(interval);
  }, [checkConnection, status.isChecking]);

  return {
    status,
    refreshConnection,
    checkConnection,
    getTroubleshootingInfo,
  };
};

export default useConnectionStatus;
