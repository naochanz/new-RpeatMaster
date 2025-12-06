// app/(tabs)/index.tsx
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import QuizBookCard from '../compornents/QuizBookCard';
import { router } from 'expo-router';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { theme } from '@/constants/Theme';
import { Plus, AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmDialog from '../compornents/ConfirmDialog';

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

  const displayData = [
    ...quizBooks,
    {
      id: 'addButton',
      title: '+ 問題集を追加',
      isAddButton: true,
    }
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      {item.isAddButton ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddQuiz}
          activeOpacity={0.7}
        >
          <Plus size={32} color={theme.colors.primary[600]} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>問題集を追加</Text>
        </TouchableOpacity>
      ) : (
        <QuizBookCard
          quizBook={item}
          onPress={() => { handleCardPress(item.id) }}
          onDelete={() => handleDelete(item.id)}
        />
      )}
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
              <AlertCircle size={20} color={theme.colors.warning[600]} />
              <Text style={styles.emptyText}>まだ問題集が登録されていません</Text>
            </View>
          </View>
        ) : null}
        <FlatList
          data={displayData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContainer}
        />
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
  addButton: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 2,
    borderColor: theme.colors.primary[300],
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeights.bold as any,
  }
});