import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { autoDetectingApiService } from '../services/autoDetectingApi';

interface ConnectionStatusProps {
  onConnectionChange?: (isConnected: boolean) => void;
  showDetails?: boolean;
  style?: any;
}

interface ConnectionInfo {
  reachable: boolean;
  url: string | null;
  error?: string;
  stats: {
    currentUrl: string | null;
    lastDetection: number;
    totalAttempts: number;
    successfulAttempts: number;
    recentErrors: string[];
  };
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  onConnectionChange,
  showDetails = false,
  style,
}) => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const status = await autoDetectingApiService.checkBackendStatus();
      setConnectionInfo(status);
      onConnectionChange?.(status.reachable);
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionInfo({
        reachable: false,
        url: null,
        error: 'Failed to check connection',
        stats: {
          currentUrl: null,
          lastDetection: 0,
          totalAttempts: 0,
          successfulAttempts: 0,
          recentErrors: [],
        },
      });
      onConnectionChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  const refreshConnection = async () => {
    setIsChecking(true);
    try {
      const newUrl = await autoDetectingApiService.refreshBackendConnection();
      if (newUrl) {
        await checkConnection();
        Alert.alert('Success', `Connected to backend at ${newUrl}`);
      } else {
        Alert.alert('Failed', 'Could not find a working backend connection');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh connection');
    } finally {
      setIsChecking(false);
    }
  };

  const showTroubleshootingGuide = () => {
    Alert.alert(
      'Backend Connection Troubleshooting',
      `Current Status: ${connectionInfo?.reachable ? 'Connected' : 'Disconnected'}
      
Troubleshooting Steps:
1. Ensure backend server is running
2. Check if device and computer are on same network
3. Verify firewall allows port 5000
4. Try refreshing the connection
5. Check backend logs for errors

${connectionInfo?.error ? `Error: ${connectionInfo.error}` : ''}`,
      [
        { text: 'Refresh Connection', onPress: refreshConnection },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const getStatusColor = () => {
    if (isChecking) return '#FFA500'; // Orange for checking
    if (connectionInfo?.reachable) return '#4CAF50'; // Green for connected
    return '#F44336'; // Red for disconnected
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (connectionInfo?.reachable) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isChecking) return '🔄';
    if (connectionInfo?.reachable) return '✅';
    return '❌';
  };

  if (!showDetails) {
    return (
      <TouchableOpacity
        style={[styles.compactStatus, { backgroundColor: getStatusColor() }, style]}
        onPress={showTroubleshootingGuide}
      >
        <Text style={styles.compactStatusText}>
          {getStatusIcon()} {getStatusText()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Backend Connection Status</Text>
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: getStatusColor() }]}
          onPress={checkConnection}
          disabled={isChecking}
        >
          <Text style={styles.statusButtonText}>
            {getStatusIcon()} {getStatusText()}
          </Text>
        </TouchableOpacity>
      </View>

      {connectionInfo && (
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { color: getStatusColor() }]}>
              {connectionInfo.reachable ? 'Connected' : 'Disconnected'}
            </Text>
          </View>

          {connectionInfo.url && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Backend URL:</Text>
              <Text style={styles.detailValue}>{connectionInfo.url}</Text>
            </View>
          )}

          {connectionInfo.error && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Error:</Text>
              <Text style={[styles.detailValue, styles.errorText]}>{connectionInfo.error}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Attempts:</Text>
            <Text style={styles.detailValue}>{connectionInfo.stats.totalAttempts}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Successful:</Text>
            <Text style={styles.detailValue}>{connectionInfo.stats.successfulAttempts}</Text>
          </View>

          {connectionInfo.stats.recentErrors.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recent Errors:</Text>
              <Text style={[styles.detailValue, styles.errorText]}>
                {connectionInfo.stats.recentErrors.slice(0, 3).join(', ')}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.refreshButton]}
              onPress={refreshConnection}
              disabled={isChecking}
            >
              <Text style={styles.actionButtonText}>
                {isChecking ? 'Refreshing...' : 'Refresh Connection'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.troubleshootButton]}
              onPress={showTroubleshootingGuide}
            >
              <Text style={styles.actionButtonText}>Troubleshooting</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  compactStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  compactStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    maxHeight: 300,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  errorText: {
    color: '#F44336',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
  },
  troubleshootButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ConnectionStatus;
