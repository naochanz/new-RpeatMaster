// app/(tabs)/index.tsx
import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { router } from 'expo-router';
import { AlertCircle, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfirmDialog from '../compornents/ConfirmDialog';
import QuizBookCard from '../compornents/QuizBookCard';

export default function HomeScreen() {
  const quizBooks = useQuizBookStore(state => state.quizBooks);
  const addQuizBook = useQuizBookStore(state => state.addQuizBook);
  const deleteQuizBook = useQuizBookStore(state => state.deleteQuizBook);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAddQuiz = async () => {
    const newQuizBook = {
      id: `quiz-${Date.now()}`,
      title: '',
      chapterCount: 0,
      chapters: [],
      currentRate: 0,
      useSections: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await addQuizBook(newQuizBook);
  };

  const handleCardPress = (quizBookId: string) => {
    router.push({
      pathname: '/study/[id]',
      params: { id: quizBookId },
    });
  };

  const handleDelete = async (quizBookId: string) => {
    setDeleteTargetId(quizBookId);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteQuizBook(deleteTargetId);
      setDeleteDialogVisible(false);
      setDeleteTargetId(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <QuizBookCard
        quizBook={item}
        onPress={() => { handleCardPress(item.id) }}
        onDelete={() => handleDelete(item.id)}
      />
    </View>
  )

  return (
    <View style={styles.safeArea}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>登録済み問題集</Text>
      </View>
      {quizBooks.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyContent}>
            <AlertCircle size={20} color={theme.colors.warning[600] as string} />
            <Text style={styles.emptyText}>まだ問題集が登録されていません</Text>
          </View>
        </View>
      ) : null}
      <FlatList
        data={quizBooks}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={quizBooks.length > 1 ? styles.row : undefined}
        contentContainerStyle={styles.flatListContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddQuiz}
        activeOpacity={0.8}
      >
        <Plus size={28} color={theme.colors.neutral.white as string} strokeWidth={2.5} />
      </TouchableOpacity>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="問題集を削除"
        message="この問題集を削除してもよろしいですか？この操作は取り消せません。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary[200],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    // fontFamily: 'ZenKaku-Bold', // 一旦コメントアウト
  },
  flatListContainer: {
    padding: theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    width: '48%',
    aspectRatio: 1,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.secondary[600],
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    elevation: 8,
  },
});