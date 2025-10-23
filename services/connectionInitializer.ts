import { autoDetectingApiService } from './autoDetectingApi';
import { Platform } from 'react-native';

/**
 * Connection initializer service that sets up automatic backend detection
 * This should be called when the app starts to ensure proper connectivity
 */
class ConnectionInitializer {
  private static instance: ConnectionInitializer;
  private isInitialized = false;
  private initializationPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): ConnectionInitializer {
    if (!ConnectionInitializer.instance) {
      ConnectionInitializer.instance = new ConnectionInitializer();
    }
    return ConnectionInitializer.instance;
  }

  /**
   * Initialize the connection detection system
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('✅ Connection already initialized');
      return true;
    }

    if (this.initializationPromise) {
      console.log('⏳ Connection initialization already in progress...');
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<boolean> {
    try {
      console.log('🚀 Initializing connection detection system...');
      console.log(`📱 Platform: ${Platform.OS}`);
      console.log(`🔧 Development mode: ${__DEV__}`);

      // Check if we're in development mode
      if (__DEV__) {
        console.log('🔍 Development mode: Starting automatic backend detection...');
        
        // Start the detection process
        const detectedUrl = await autoDetectingApiService.detectAndSetBackendUrl({
          timeout: 5000,
          retries: 2,
          port: 5000,
        });

        if (detectedUrl) {
          console.log(`✅ Backend URL detected and set: ${detectedUrl}`);
          this.isInitialized = true;
          return true;
        } else {
          console.log('⚠️ No backend URL detected, but initialization will continue');
          console.log('💡 The app will attempt to detect the backend when making API calls');
          this.isInitialized = true;
          return false;
        }
      } else {
        console.log('🏭 Production mode: Using configured backend URL');
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('❌ Error during connection initialization:', error);
      this.isInitialized = true; // Mark as initialized even if failed
      return false;
    } finally {
      this.initializationPromise = null;
    }
  }

  /**
   * Get the current connection status
   */
  async getConnectionStatus(): Promise<{
    initialized: boolean;
    connected: boolean;
    url: string | null;
    stats: any;
  }> {
    const stats = autoDetectingApiService.getConnectionStats();
    const status = await autoDetectingApiService.checkBackendStatus();

    return {
      initialized: this.isInitialized,
      connected: status.reachable,
      url: status.url,
      stats,
    };
  }

  /**
   * Force refresh the connection
   */
  async refreshConnection(): Promise<boolean> {
    console.log('🔄 Force refreshing connection...');
    
    try {
      const newUrl = await autoDetectingApiService.refreshBackendUrl();
      if (newUrl) {
        console.log(`✅ Connection refreshed: ${newUrl}`);
        return true;
      } else {
        console.log('❌ Failed to refresh connection');
        return false;
      }
    } catch (error) {
      console.error('❌ Error refreshing connection:', error);
      return false;
    }
  }

  /**
   * Get troubleshooting information
   */
  getTroubleshootingInfo(): {
    platform: string;
    isDev: boolean;
    isInitialized: boolean;
    currentUrl: string | null;
    stats: any;
  } {
    const stats = autoDetectingApiService.getConnectionStats();
    
    return {
      platform: Platform.OS,
      isDev: __DEV__,
      isInitialized: this.isInitialized,
      currentUrl: stats.currentUrl,
      stats,
    };
  }

  /**
   * Reset the initialization state (for testing)
   */
  reset(): void {
    this.isInitialized = false;
    this.initializationPromise = null;
    console.log('🔄 Connection initializer reset');
  }
}

// Export singleton instance
export const connectionInitializer = ConnectionInitializer.getInstance();

// Export the class for testing
export { ConnectionInitializer };
