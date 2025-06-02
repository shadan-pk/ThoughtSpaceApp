import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';

interface OptionsMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onClearAllThoughts: () => void;
  onOpenSettings: () => void;
  onOpenSpace: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OptionsMenuModal({
  visible,
  onClose,
  onClearAllThoughts,
  onOpenSettings,
  onOpenSpace,
}: OptionsMenuModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={false}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Options</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <View style={styles.modalContent}>
            <Pressable
              onPress={() => {
                onClearAllThoughts();
              }}
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
            >
              <Text
                style={[styles.optionText, styles.clearOptionText]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Clear All Thoughts
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                onOpenSettings();
              }}
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
            >
              <Text style={styles.optionText} numberOfLines={1} ellipsizeMode="tail">
                Settings
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                onOpenSpace();
              }}
              style={({ pressed }) => [
                styles.optionButton,
                styles.lastOptionButton,
                pressed && styles.optionButtonPressed,
              ]}
            >
              <Text style={styles.optionText} numberOfLines={1} ellipsizeMode="tail">
                Open Space
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 300,
    maxWidth: 350,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10000,
    position: 'relative',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  lastOptionButton: {
    borderBottomWidth: 0,
  },
  optionButtonPressed: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  clearOptionText: {
    color: '#FF3B30',
  },
});