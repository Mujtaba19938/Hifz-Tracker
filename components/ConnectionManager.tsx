import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import ConnectionStatus from './ConnectionStatus';

interface ConnectionManagerProps {
  children: React.ReactNode;
  showStatusIndicator?: boolean;
  autoInitialize?: boolean;
}

/**
 * ConnectionManager component that wraps the app and provides connection management
 * This component should be used at the root level to ensure proper connection handling
 */
export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  children,
  showStatusIndicator = true,
  autoInitialize = true,
}) => {
  const { status, refreshConnection, checkConnection, getTroubleshootingInfo } = useConnectionStatus();
  const [showDetails, setShowDetails] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  // Auto-initialize connection on mount
  useEffect(() => {
    if (autoInitialize && !status.isInitialized) {
      console.log('🔄 Auto-initializing connection...');
      checkConnection();
    }
  }, [autoInitialize, status.isInitialized, checkConnection]);

  const handleRefreshConnection = async () => {
    const success = await refreshConnection();
    if (success) {
      Alert.alert('Success', 'Connection refreshed successfully!');
    } else {
      Alert.alert('Failed', 'Could not refresh connection. Check troubleshooting guide.');
    }
  };

  const handleShowTroubleshooting = () => {
    const info = getTroubleshootingInfo();
    const troubleshootingText = `
Connection Troubleshooting Information:

Platform: ${info.platform}
Development Mode: ${info.isDev ? 'Yes' : 'No'}
Initialized: ${info.isInitialized ? 'Yes' : 'No'}
Current URL: ${info.currentUrl || 'None'}

Connection Stats:
- Total Attempts: ${info.stats.totalAttempts}
- Successful: ${info.stats.successfulAttempts}
- Recent Errors: ${info.stats.recentErrors.length}

Troubleshooting Steps:
1. Ensure backend server is running (npm run start:backend)
2. Check if device and computer are on same network
3. Verify firewall allows port 5000
4. Try refreshing the connection
5. Check backend logs for errors
6. Restart the backend server if needed

${status.error ? `Current Error: ${status.error}` : ''}
    `.trim();

    Alert.alert('Troubleshooting Guide', troubleshootingText, [
      { text: 'Refresh Connection', onPress: handleRefreshConnection },
      { text: 'OK', style: 'default' },
    ]);
  };

  const getStatusColor = () => {
    if (status.isChecking) return '#FFA500'; // Orange
    if (status.isConnected) return '#4CAF50'; // Green
    return '#F44336'; // Red
  };

  const getStatusText = () => {
    if (status.isChecking) return 'Checking...';
    if (status.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (status.isChecking) return '🔄';
    if (status.isConnected) return '✅';
    return '❌';
  };

  return (
    <View style={styles.container}>
      {children}
      
      {showStatusIndicator && (
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}
            onPress={() => setShowDetails(true)}
          >
            <Text style={styles.statusText}>
              {getStatusIcon()} {getStatusText()}
            </Text>
          </TouchableOpacity>
          
          {!status.isConnected && !status.isChecking && (
            <TouchableOpacity
              style={styles.troubleshootButton}
              onPress={handleShowTroubleshooting}
            >
              <Text style={styles.troubleshootButtonText}>🔧</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Connection Details Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Connection Status</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <ConnectionStatus showDetails={true} />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.refreshButton]}
                onPress={handleRefreshConnection}
                disabled={status.isChecking}
              >
                <Text style={styles.actionButtonText}>
                  {status.isChecking ? 'Refreshing...' : 'Refresh Connection'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.troubleshootButton]}
                onPress={handleShowTroubleshooting}
              >
                <Text style={styles.actionButtonText}>Troubleshooting Guide</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  troubleshootButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FF9800',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  troubleshootButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ConnectionManager;
