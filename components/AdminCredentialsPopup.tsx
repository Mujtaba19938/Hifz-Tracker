import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminCredentialsPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function AdminCredentialsPopup({ visible, onClose }: AdminCredentialsPopupProps) {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  // Prepare lines and override password display to 'admin123'
  const lines = (t.defaultAdminCredentials || '').split('\n');
  const titleLine = lines[0] || '';
  const usernameDisplay = `Username: admin@hifztracker.com`;
  // Try to keep the localized label before ':' if present, else fallback to 'Password'
  const passwordDisplay = `Password: Admin123!`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>
                {titleLine}
              </Text>
              
              <View style={styles.credentialsContainer}>
                <Text style={[styles.credentialText, isRTL && styles.rtlText]}>
                  {usernameDisplay}
                </Text>
                <Text style={[styles.credentialText, isRTL && styles.rtlText]}>
                  {passwordDisplay}
                </Text>
                <Text style={[styles.warningText, isRTL && styles.rtlText]}>
                  {lines[3] || ''}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 0,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
  },
  credentialsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  credentialText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  warningText: {
    fontSize: 14,
    color: colors.warning || '#FFD700',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
