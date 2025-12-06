// app/(tabs)/index.tsx
import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { router } from 'expo-router';
import { AlertCircle, Plus } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddItemModal from '../compornents/AddItemModal';
import CategorySelectModal from '../compornents/CategorySelectModal';
import ConfirmDialog from '../compornents/ConfirmDialog';
import QuizBookCard from '../compornents/QuizBookCard';

export default function HomeScreen() {
  const quizBooks = useQuizBookStore(state => state.quizBooks);
  const addQuizBook = useQuizBookStore(state => state.addQuizBook);
  const deleteQuizBook = useQuizBookStore(state => state.deleteQuizBook);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const groupedQuizBooks = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    quizBooks.forEach((book) => {
      const category = book.category || '未分類';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(book);
    });
    return groups;
  }, [quizBooks]);

  const existingCategories = useMemo(() => {
    return Array.from(new Set(quizBooks.map(book => book.category).filter(Boolean)));
  }, [quizBooks]);

  const handleAddQuiz = () => {
    setAddItemModalVisible(true);
  };

  const handleAddCategory = () => {
    setAddItemModalVisible(false);
    setIsAddingCategory(true);
    setCategoryModalVisible(true);
  };

  const handleAddQuizBook = () => {
    if (existingCategories.length === 0) {
      setAddItemModalVisible(false);
      setIsAddingCategory(true);
      setCategoryModalVisible(true);
      return;
    }
    setAddItemModalVisible(false);
    setIsAddingCategory(false);
    setCategoryModalVisible(true);
  };

  const handleCategorySelect = async (category: string) => {
    const newQuizBook = {
      id: `quiz-${Date.now()}`,
      title: '',
      category: category,
      chapterCount: 0,
      chapters: [],
      currentRate: 0,
      useSections: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await addQuizBook(newQuizBook);
    setCategoryModalVisible(false);
    setIsAddingCategory(false);
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

  return (
    <View style={styles.safeArea}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>登録済み問題集</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quizBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyContent}>
              <AlertCircle size={20} color={theme.colors.warning[600] as string} />
              <Text style={styles.emptyText}>まだ問題集が登録されていません</Text>
            </View>
          </View>
        ) : (
          Object.entries(groupedQuizBooks).map(([category, books]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.cardsGrid}>
                {books.map((book) => (
                  <View key={book.id} style={styles.cardWrapper}>
                    <QuizBookCard
                      quizBook={book}
                      onPress={() => handleCardPress(book.id)}
                      onDelete={() => handleDelete(book.id)}
                      existingCategories={existingCategories}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddQuiz}
        activeOpacity={0.8}
      >
        <Plus size={28} color={theme.colors.neutral.white as string} strokeWidth={2.5} />
      </TouchableOpacity>

      <AddItemModal
        visible={addItemModalVisible}
        onAddCategory={handleAddCategory}
        onAddQuizBook={handleAddQuizBook}
        onClose={() => setAddItemModalVisible(false)}
      />

      <CategorySelectModal
        visible={categoryModalVisible}
        categories={existingCategories}
        onSelect={handleCategorySelect}
        onClose={() => {
          setCategoryModalVisible(false);
          setIsAddingCategory(false);
        }}
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
    fontFamily: 'ZenKaku-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  categorySection: {
    marginBottom: theme.spacing.xl,
  },
  categoryTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
    color: theme.colors.secondary[900],
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[400],
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  cardWrapper: {
    width: '33.333%',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
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