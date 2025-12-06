import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { BookOpen, Check, Edit, MoreVertical, RotateCw, Trash2, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface QuizBook {
  id: string;
  title: string;
  chapterCount: number;
  currentRate: number;
  useSections?: boolean;
  correctRate?: number;
  currentRound?: number;
}

interface QuizBookCardProps {
  quizBook: QuizBook;
  onPress: () => void;
  onDelete: () => void;
}

const QuizBookCard = ({ quizBook, onPress, onDelete }: QuizBookCardProps) => {
  const updateQuizBook = useQuizBookStore(state => state.updateQuizBook);
  const [showMenu, setShowMenu] = useState(quizBook.title === '');
  const [editedTitle, setEditedTitle] = useState(quizBook.title);
  const [useSections, setUseSections] = useState(quizBook.useSections ?? undefined);
  const correctRate = quizBook.correctRate || 0;

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    setEditedTitle(quizBook.title);
    setShowMenu(true);
  };

  const handleSaveAndClose = async () => {
    if (editedTitle.trim() === '') {
      return;
    }
    await updateQuizBook(quizBook.id, { title: editedTitle });
    setShowMenu(false);
  };

  const handleCloseMenu = () => {
    setEditedTitle(quizBook.title);
    setShowMenu(false);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete();
  };

  const handleToggleSections = async (value: boolean) => {
    setUseSections(value);
    await updateQuizBook(quizBook.id, { useSections: value });
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={20} color={theme.colors.secondary[600]} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <BookOpen size={32} color={theme.colors.primary[600]} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {quizBook.title || '未設定'}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TrendingUp size={14} color={theme.colors.secondary[600]} />
              <Text style={styles.statLabel}>正答率</Text>
              <Text style={[styles.statValue, {
                color: correctRate >= 80
                  ? theme.colors.success[600]
                  : correctRate >= 60
                    ? theme.colors.warning[600]
                    : theme.colors.error[600]
              }]}>{correctRate}%</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <RotateCw size={14} color={theme.colors.secondary[600]} />
              <Text style={styles.statLabel}>周回</Text>
              <Text style={styles.statValue}>{quizBook.currentRound || 0}回</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseMenu}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>問題集の設定</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>タイトル</Text>
                <TextInput
                  style={styles.titleInput}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="問題集名を入力"
                  placeholderTextColor={theme.colors.secondary[400]}
                  multiline
                />
              </View>

              <View style={styles.menuDivider} />

              <View style={styles.menuItem}>
                <Text style={styles.menuText}>節を使用</Text>
                <Switch
                  value={useSections ?? false}
                  onValueChange={handleToggleSections}
                  trackColor={{
                    false: theme.colors.secondary[300],
                    true: theme.colors.primary[400]
                  }}
                  thumbColor={useSections ? theme.colors.primary[600] : theme.colors.neutral.white}
                />
              </View>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Trash2 size={20} color={theme.colors.error[600]} />
                <Text style={styles.deleteButtonText}>問題集を削除</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={handleCloseMenu}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.saveButton]}
                onPress={handleSaveAndClose}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: theme.colors.secondary[200],
    ...theme.shadows.md,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 10,
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    textAlign: 'center',
    fontFamily: 'ZenKaku-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  statValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.secondary[200],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary[200],
  },
  modalHeaderText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.secondary[900],
    textAlign: 'center',
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  inputSection: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: 'ZenKaku-Medium',
    color: theme.colors.secondary[700],
    marginBottom: theme.spacing.xs,
  },
  titleInput: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Regular',
    color: theme.colors.secondary[900],
    borderWidth: 1,
    borderColor: theme.colors.secondary[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.white,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.secondary[200],
    marginVertical: theme.spacing.md,
  },
  menuText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Medium',
    color: theme.colors.secondary[900],
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  deleteButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Medium',
    color: theme.colors.error[600],
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary[200],
  },
  footerButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary[100],
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.secondary[700],
  },
  saveButton: {
    backgroundColor: theme.colors.primary[600],
  },
  saveButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.neutral.white,
  },
});

export default QuizBookCard
