import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Modal, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

export interface TopBarProps {
  title?: string;
  hasUnsavedChanges?: boolean;
  onSaveSpace: (name?: string) => Promise<void>;
  onCreateSpace: () => Promise<void>;
  onOptionsPress?: () => void;
}

export default function TopBar({
  title = 'TS',
  hasUnsavedChanges = false,
  onSaveSpace,
  onCreateSpace,
  onOptionsPress,
}: TopBarProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSpace = async () => {
    setIsSaving(true);
    try {
      await onSaveSpace(spaceName.trim() || undefined);
      setShowSaveModal(false);
      setSpaceName('');
    } catch (error) {
      console.error('Failed to save space:', error);
      Alert.alert('Error', 'Failed to save space. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSpace = async () => {
    try {
      await onCreateSpace();
    } catch (error) {
      console.error('Failed to create space:', error);
      Alert.alert('Error', 'Failed to create space. Please try again.');
    }
  };

  const handleSaveModalClose = () => {
    setShowSaveModal(false);
    setSpaceName('');
  };

  return (
    <>
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.topBarTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
            {hasUnsavedChanges && <Text style={styles.unsavedIndicator}> •</Text>}
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Pressable 
            onPress={() => setShowSaveModal(true)}
            style={({ pressed }) => [
              styles.actionButton,
              styles.saveButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>Save Space</Text>
          </Pressable>
          
          <Pressable 
            onPress={handleCreateSpace}
            style={({ pressed }) => [
              styles.actionButton,
              styles.createButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>Create Space</Text>
          </Pressable>
          
          {onOptionsPress && (
            <Pressable 
              onPress={onOptionsPress}
              style={({ pressed }) => [
                styles.optionsButton,
                pressed && styles.buttonPressed
              ]}
            >
              <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {/* Save Space Modal */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={handleSaveModalClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleSaveModalClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save Space</Text>
              <Pressable onPress={handleSaveModalClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Space Name (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={spaceName}
                onChangeText={setSpaceName}
                placeholder="Enter space name..."
                placeholderTextColor="#999"
                maxLength={50}
                autoFocus
              />
              
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={handleSaveModalClose}
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable
                  onPress={handleSaveSpace}
                  style={[styles.modalButton, styles.saveModalButton]}
                  disabled={isSaving}
                >
                  <Text style={styles.saveModalButtonText}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        </Modal>
      </>
    );
  }

  const styles = StyleSheet.create({
    topBar: {
      height: 60,
      backgroundColor: '#007AFF',
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 20,
    },
    titleContainer: {
      flex: 1, // Allow title to take available space
      marginRight: 10, // Space between title and buttons
    },
    topBarTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      overflow: 'hidden', // Ensure text doesn't overflow
    },
    unsavedIndicator: {
      color: '#FFD700',
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    saveButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    createButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
    },
    optionsButton: {
      padding: 8,
      borderRadius: 4,
    },
    buttonPressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: 'white',
      marginHorizontal: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: 12,
      minWidth: 300,
      maxWidth: 350,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
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
      padding: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: '#333',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    modalButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#F5F5F5',
    },
    cancelButtonText: {
      color: '#666',
      fontWeight: '500',
    },
    saveModalButton: {
      backgroundColor: '#007AFF',
    },
    saveModalButtonText: {
      color: 'white',
      fontWeight: '500',
    },
  });