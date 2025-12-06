import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { router } from 'expo-router';
import { AlertCircle, BookOpen, ChevronRight } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QualificationStats {
  category: string;
  totalBooks: number;
  avgCorrectRate: number;
  totalRounds: number;
  books: any[];
}

export default function DashboardScreen() {
  const quizBooks = useQuizBookStore(state => state.quizBooks);

  const qualificationStats = useMemo(() => {
    const statsMap: { [key: string]: QualificationStats } = {};

    quizBooks.forEach(book => {
      const category = book.category || '未分類';
      if (!statsMap[category]) {
        statsMap[category] = {
          category,
          totalBooks: 0,
          avgCorrectRate: 0,
          totalRounds: 0,
          books: [],
        };
      }

      statsMap[category].totalBooks += 1;
      statsMap[category].totalRounds += (book.currentRound || 0);
      statsMap[category].books.push(book);
    });

    Object.keys(statsMap).forEach(category => {
      const books = statsMap[category].books;
      const totalCorrectRate = books.reduce((sum, book) => sum + (book.correctRate || 0), 0);
      statsMap[category].avgCorrectRate = books.length > 0
        ? Math.round(totalCorrectRate / books.length)
        : 0;
    });

    return Object.values(statsMap).sort((a, b) => b.avgCorrectRate - a.avgCorrectRate);
  }, [quizBooks]);

  const handleQualificationPress = (category: string) => {
    router.push({
      pathname: '/dashboard/qualification/[category]',
      params: { category },
    });
  };

  const handleNavigateToLibrary = () => {
    router.push('/(tabs)/library');
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {qualificationStats.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={64} color={theme.colors.primary[300]} />
            <Text style={styles.emptyTitle}>まだ資格が登録されていません</Text>
            <Text style={styles.emptyDescription}>
              ライブラリから資格と問題集を追加して{'\n'}学習を始めましょう
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleNavigateToLibrary}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyButtonText}>ライブラリへ移動</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.qualificationList}>
            {qualificationStats.map((qual) => (
              <TouchableOpacity
                key={qual.category}
                style={styles.qualificationCard}
                onPress={() => handleQualificationPress(qual.category)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{qual.category}</Text>
                    <View style={styles.bookCountBadge}>
                      <BookOpen size={14} color={theme.colors.primary[600]} />
                      <Text style={styles.bookCountText}>{qual.totalBooks}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={theme.colors.secondary[400]} />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.statRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>平均正答率</Text>
                      <View style={[
                        styles.correctRateBadge,
                        { backgroundColor: getCorrectRateBackground(qual.avgCorrectRate) }
                      ]}>
                        <Text style={[
                          styles.correctRateValue,
                          { color: getCorrectRateColor(qual.avgCorrectRate) }
                        ]}>
                          {qual.avgCorrectRate}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>総周回数</Text>
                      <Text style={styles.roundValue}>{qual.totalRounds}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 3,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  emptyButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.neutral.white,
    fontFamily: 'ZenKaku-Bold',
  },
  qualificationList: {
    gap: theme.spacing.md,
  },
  qualificationCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary[50],
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[200],
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
  },
  bookCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary[300],
  },
  bookCountText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.primary[700],
    fontFamily: 'ZenKaku-Bold',
  },
  cardBody: {
    padding: theme.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
    marginBottom: theme.spacing.sm,
  },
  correctRateBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  correctRateValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.secondary[200],
    marginHorizontal: theme.spacing.md,
  },
  roundValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
  },
});
