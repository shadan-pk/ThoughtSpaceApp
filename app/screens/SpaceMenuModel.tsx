import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { SpaceMetadata } from '../types/spaces';
import { SpacesStorageService } from '../utils/spacesStorage';

interface SpaceMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSpace: (spaceId: string) => void;
}

export default function SpaceMenuModal({
  visible,
  onClose,
  onSelectSpace,
}: SpaceMenuModalProps) {
  const [spaces, setSpaces] = React.useState<SpaceMetadata[]>([]);

  React.useEffect(() => {
    const loadSpaces = async () => {
      const metadata = await SpacesStorageService.getSpacesMetadata();
      setSpaces(metadata);
    };
    if (visible) {
      loadSpaces();
    }
  }, [visible]);

  const renderSpaceItem = ({ item }: { item: SpaceMetadata }) => (
    <Pressable
      onPress={() => {
        onSelectSpace(item.id);
        onClose();
      }}
      style={({ pressed }) => [
        styles.spaceItem,
        pressed && styles.spaceItemPressed,
      ]}
    >
      <Text style={styles.spaceName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.spaceDetails}>
        {item.thoughtCount} thought{item.thoughtCount !== 1 ? 's' : ''} •{' '}
        {item.updatedAt.toLocaleDateString()}
      </Text>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Spaces</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          <FlatList
            data={spaces}
            renderItem={renderSpaceItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No spaces found.</Text>
            }
            style={styles.spaceList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
  spaceList: {
    maxHeight: 400,
  },
  spaceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  spaceItemPressed: {
    backgroundColor: '#F5F5F5',
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  spaceDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});