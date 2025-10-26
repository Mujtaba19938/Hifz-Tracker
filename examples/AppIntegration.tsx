import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectionManager } from '../components/ConnectionManager';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

/**
 * Example of how to integrate the Connection Auto-Detector into your app
 * This shows the recommended integration pattern
 */

// Example 1: Basic Integration with ConnectionManager
export function BasicAppIntegration() {
  return (
    <ConnectionManager showStatusIndicator={true} autoInitialize={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Your App Content</Text>
        <Text style={styles.subtitle}>
          The ConnectionManager automatically handles backend detection
        </Text>
      </View>
    </ConnectionManager>
  );
}

// Example 2: Advanced Integration with Custom Status Display
export function AdvancedAppIntegration() {
  const { status, refreshConnection, checkConnection } = useConnectionStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Advanced App Integration</Text>
        <ConnectionStatusIndicator status={status} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your app content here</Text>
        
        {!status.isConnected && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ Backend connection issues detected
            </Text>
            <Text style={styles.warningSubtext}>
              The app will attempt to reconnect automatically
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Example 3: Custom Status Indicator Component
function ConnectionStatusIndicator({ status }: { status: any }) {
  const getStatusColor = () => {
    if (status.isChecking) return '#FFA500';
    if (status.isConnected) return '#4CAF50';
    return '#F44336';
  };

  const getStatusText = () => {
    if (status.isChecking) return 'Checking...';
    if (status.isConnected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusText}>{getStatusText()}</Text>
    </View>
  );
}

// Example 4: Integration with Existing API Service
export function ApiServiceIntegration() {
  const { status } = useConnectionStatus();

  // Your existing API calls will automatically use the auto-detection
  const handleApiCall = async () => {
    try {
      // This will automatically use the detected backend URL
      const response = await fetch('/api/some-endpoint');
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('API Error:', error);
      // The system will automatically try to find a new backend URL
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Service Integration</Text>
      <Text style={styles.subtitle}>
        Connection Status: {status.isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text style={styles.subtitle}>
        Backend URL: {status.url || 'Not detected'}
      </Text>
    </View>
  );
}

// Example 5: Production vs Development Configuration
export function EnvironmentAwareIntegration() {
  const { status } = useConnectionStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Aware Integration</Text>
      
      {__DEV__ ? (
        <View style={styles.devContainer}>
          <Text style={styles.devTitle}>Development Mode</Text>
          <Text style={styles.devText}>
            Auto-detection is enabled. The app will automatically find your backend.
          </Text>
          <Text style={styles.devText}>
            Status: {status.isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      ) : (
        <View style={styles.prodContainer}>
          <Text style={styles.prodTitle}>Production Mode</Text>
          <Text style={styles.prodText}>
            Using configured production backend URL.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginTop: 20,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
  },
  warningSubtext: {
    fontSize: 14,
    color: '#856404',
    marginTop: 5,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  devContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  devTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  devText: {
    fontSize: 14,
    color: '#1976D2',
    marginTop: 5,
  },
  prodContainer: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  prodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  prodText: {
    fontSize: 14,
    color: '#388E3C',
    marginTop: 5,
  },
});

export default BasicAppIntegration;
