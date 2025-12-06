import { theme } from '@/constants/theme';
import { X, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface CategorySelectModalProps {
  visible: boolean;
  categories: string[];
  onSelect: (category: string) => void;
  onClose: () => void;
}

const CategorySelectModal = ({
  visible,
  categories,
  onSelect,
  onClose,
}: CategorySelectModalProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSelectCategory = (category: string) => {
    onSelect(category);
    setIsAddingNew(false);
    setNewCategory('');
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      onSelect(newCategory.trim());
      setNewCategory('');
      setIsAddingNew(false);
    }
  };

  const handleClose = () => {
    setIsAddingNew(false);
    setNewCategory('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>資格を選択</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={24} color={theme.colors.secondary[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryItem}
                onPress={() => handleSelectCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}

            {isAddingNew ? (
              <View style={styles.newCategoryContainer}>
                <TextInput
                  style={styles.newCategoryInput}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="新しい資格名を入力"
                  placeholderTextColor={theme.colors.secondary[400]}
                  autoFocus
                  onSubmitEditing={handleAddNewCategory}
                />
                <View style={styles.newCategoryActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => {
                      setIsAddingNew(false);
                      setNewCategory('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.addButton]}
                    onPress={handleAddNewCategory}
                  >
                    <Text style={styles.addButtonText}>追加</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addNewButton}
                onPress={() => setIsAddingNew(true)}
                activeOpacity={0.7}
              >
                <Plus size={20} color={theme.colors.primary[600]} />
                <Text style={styles.addNewText}>新しい資格を追加</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary[200],
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.secondary[900],
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  categoryItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary[200],
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Medium',
    color: theme.colors.secondary[900],
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary[300],
    borderStyle: 'dashed',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  addNewText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Medium',
    color: theme.colors.primary[600],
  },
  newCategoryContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary[300],
  },
  newCategoryInput: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Regular',
    color: theme.colors.secondary[900],
    borderWidth: 1,
    borderColor: theme.colors.secondary[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.white,
    marginBottom: theme.spacing.md,
  },
  newCategoryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary[100],
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.secondary[700],
  },
  addButton: {
    backgroundColor: theme.colors.primary[600],
  },
  addButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.neutral.white,
  },
});

export default CategorySelectModal;
