import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QualificationDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const quizBooks = useQuizBookStore(state => state.quizBooks);

  const categoryBooks = useMemo(() => {
    return quizBooks
      .filter(book => book.category === category)
      .sort((a, b) => (b.correctRate || 0) - (a.correctRate || 0));
  }, [quizBooks, category]);

  const stats = useMemo(() => {
    const totalBooks = categoryBooks.length;
    const avgCorrectRate = categoryBooks.length > 0
      ? Math.round(categoryBooks.reduce((sum, book) => sum + (book.correctRate || 0), 0) / categoryBooks.length)
      : 0;
    const totalRounds = categoryBooks.reduce((sum, book) => sum + (book.currentRound || 0), 0);

    const strongBooks = categoryBooks.filter(book => (book.correctRate || 0) >= 80);
    const weakBooks = categoryBooks.filter(book => (book.correctRate || 0) < 60);

    return {
      totalBooks,
      avgCorrectRate,
      totalRounds,
      strongBooks,
      weakBooks,
    };
  }, [categoryBooks]);

  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: '/dashboard/book/[id]',
      params: { id: bookId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const getCorrectRateColor = (rate: number) => {
    if (rate >= 80) return theme.colors.success[600];
    if (rate >= 60) return theme.colors.warning[600];
    return theme.colors.error[600];
  };

  const getCorrectRateBackground = (rate: number) => {
    if (rate >= 80) return theme.colors.success[50];
    if (rate >= 60) return theme.colors.warning[50];
    return theme.colors.error[50];
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.colors.secondary[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>平均正答率</Text>
                <View style={[
                  styles.summaryBadge,
                  { backgroundColor: getCorrectRateBackground(stats.avgCorrectRate) }
                ]}>
                  <Text style={[
                    styles.summaryValue,
                    { color: getCorrectRateColor(stats.avgCorrectRate) }
                  ]}>
                    {stats.avgCorrectRate}%
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>問題集数</Text>
                <Text style={styles.summaryValue}>{stats.totalBooks}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>総周回数</Text>
                <Text style={styles.summaryValue}>{stats.totalRounds}</Text>
              </View>
            </View>
          </View>

          {stats.weakBooks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <AlertTriangle size={20} color={theme.colors.error[600]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.error[700] }]}>
                    弱点 ({stats.weakBooks.length})
                  </Text>
                </View>
                <Text style={styles.sectionSubtitle}>60%未満の問題集</Text>
              </View>

              <View style={styles.bookList}>
                {stats.weakBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={[styles.bookCard, styles.bookCardWeak]}
                    onPress={() => handleBookPress(book.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bookCardLeft}>
                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {book.title || '未設定'}
                      </Text>
                      <View style={styles.bookMeta}>
                        <Text style={styles.bookMetaText}>周回: {book.currentRound || 0}</Text>
                      </View>
                    </View>
                    <View style={styles.bookCardRight}>
                      <View style={[
                        styles.correctRateBadge,
                        { backgroundColor: getCorrectRateBackground(book.correctRate || 0) }
                      ]}>
                        <Text style={[
                          styles.correctRateText,
                          { color: getCorrectRateColor(book.correctRate || 0) }
                        ]}>
                          {book.correctRate || 0}%
                        </Text>
                      </View>
                      <ChevronRight size={20} color={theme.colors.secondary[400]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>全問題集</Text>
            </View>

            <View style={styles.bookList}>
              {categoryBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.bookCard}
                  onPress={() => handleBookPress(book.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.bookCardLeft}>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                      {book.title || '未設定'}
                    </Text>
                    <View style={styles.bookMeta}>
                      <Text style={styles.bookMetaText}>周回: {book.currentRound || 0}</Text>
                    </View>
                  </View>
                  <View style={styles.bookCardRight}>
                    <View style={[
                      styles.correctRateBadge,
                      { backgroundColor: getCorrectRateBackground(book.correctRate || 0) }
                    ]}>
                      <Text style={[
                        styles.correctRateText,
                        { color: getCorrectRateColor(book.correctRate || 0) }
                      ]}>
                        {book.correctRate || 0}%
                      </Text>
                    </View>
                    <ChevronRight size={20} color={theme.colors.secondary[400]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {stats.strongBooks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <CheckCircle2 size={20} color={theme.colors.success[600]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.success[700] }]}>
                    得意分野 ({stats.strongBooks.length})
                  </Text>
                </View>
                <Text style={styles.sectionSubtitle}>80%以上の問題集</Text>
              </View>

              <View style={styles.bookList}>
                {stats.strongBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={[styles.bookCard, styles.bookCardStrong]}
                    onPress={() => handleBookPress(book.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bookCardLeft}>
                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {book.title || '未設定'}
                      </Text>
                      <View style={styles.bookMeta}>
                        <Text style={styles.bookMetaText}>周回: {book.currentRound || 0}</Text>
                      </View>
                    </View>
                    <View style={styles.bookCardRight}>
                      <View style={[
                        styles.correctRateBadge,
                        { backgroundColor: getCorrectRateBackground(book.correctRate || 0) }
                      ]}>
                        <Text style={[
                          styles.correctRateText,
                          { color: getCorrectRateColor(book.correctRate || 0) }
                        ]}>
                          {book.correctRate || 0}%
                        </Text>
                      </View>
                      <ChevronRight size={20} color={theme.colors.secondary[400]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary[50],
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
    ...theme.shadows.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
    marginBottom: theme.spacing.sm,
  },
  summaryBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 70,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.secondary[200],
    marginHorizontal: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  bookList: {
    gap: theme.spacing.md,
  },
  bookCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
    ...theme.shadows.sm,
  },
  bookCardWeak: {
    borderColor: theme.colors.error[300],
    backgroundColor: theme.colors.error[50],
  },
  bookCardStrong: {
    borderColor: theme.colors.success[300],
    backgroundColor: theme.colors.success[50],
  },
  bookCardLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  bookTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginBottom: theme.spacing.xs,
  },
  bookMeta: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  bookMetaText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  bookCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  correctRateBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  correctRateText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
  },
});
