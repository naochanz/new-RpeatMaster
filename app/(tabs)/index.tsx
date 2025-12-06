import { theme } from '@/constants/theme';
import { useQuizBookStore } from '@/stores/quizBookStore';
import { router } from 'expo-router';
import { AlertCircle, BookOpen, TrendingUp } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const quizBooks = useQuizBookStore(state => state.quizBooks);

  const stats = useMemo(() => {
    const totalBooks = quizBooks.length;
    const totalRounds = quizBooks.reduce((sum, book) => sum + (book.currentRound || 0), 0);
    const avgCorrectRate = quizBooks.length > 0
      ? Math.round(quizBooks.reduce((sum, book) => sum + (book.correctRate || 0), 0) / quizBooks.length)
      : 0;

    return { totalBooks, totalRounds, avgCorrectRate };
  }, [quizBooks]);

  const sortedByRounds = useMemo(() => {
    return [...quizBooks]
      .filter(book => book.title)
      .sort((a, b) => (b.currentRound || 0) - (a.currentRound || 0))
      .slice(0, 5);
  }, [quizBooks]);

  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: '/study/[id]',
      params: { id: bookId },
    });
  };

  const handleNavigateToLibrary = () => {
    router.push('/(tabs)/library');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ダッシュボード</Text>
        <Text style={styles.headerSubtitle}>学習の進捗を確認しましょう</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <BookOpen size={24} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.statValue}>{stats.totalBooks}</Text>
            <Text style={styles.statLabel}>登録問題集</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSecondary]}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.statValue}>{stats.totalRounds}</Text>
            <Text style={styles.statLabel}>総周回数</Text>
          </View>

          <View style={[styles.statCard, styles.statCardAccent]}>
            <View style={styles.statIconContainer}>
              <View style={styles.percentageIcon}>
                <Text style={styles.percentageText}>%</Text>
              </View>
            </View>
            <Text style={[styles.statValue, {
              color: stats.avgCorrectRate >= 80
                ? theme.colors.success[600]
                : stats.avgCorrectRate >= 60
                  ? theme.colors.warning[600]
                  : theme.colors.error[600]
            }]}>{stats.avgCorrectRate}%</Text>
            <Text style={styles.statLabel}>平均正答率</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>周回数ランキング</Text>
          </View>

          {sortedByRounds.length === 0 ? (
            <View style={styles.emptyState}>
              <AlertCircle size={40} color={theme.colors.primary[300]} />
              <Text style={styles.emptyTitle}>問題集がありません</Text>
              <Text style={styles.emptyDescription}>
                ライブラリから問題集を追加して学習を始めましょう
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
            <View style={styles.rankingList}>
              {sortedByRounds.map((book, index) => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.rankingItem}
                  onPress={() => handleBookPress(book.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.rankingLeft}>
                    <View style={[
                      styles.rankBadge,
                      index === 0 && styles.rankBadgeGold,
                      index === 1 && styles.rankBadgeSilver,
                      index === 2 && styles.rankBadgeBronze,
                    ]}>
                      <Text style={[
                        styles.rankNumber,
                        index < 3 && styles.rankNumberMedal,
                      ]}>{index + 1}</Text>
                    </View>
                    <View style={styles.rankingInfo}>
                      <Text style={styles.rankingTitle} numberOfLines={1}>
                        {book.title || '未設定'}
                      </Text>
                      <Text style={styles.rankingCategory} numberOfLines={1}>
                        {book.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <Text style={styles.rankingRounds}>{book.currentRound || 0}</Text>
                    <Text style={styles.rankingRoundsLabel}>周回</Text>
                    <View style={styles.rankingDivider} />
                    <Text style={[styles.rankingCorrect, {
                      color: (book.correctRate || 0) >= 80
                        ? theme.colors.success[600]
                        : (book.correctRate || 0) >= 60
                          ? theme.colors.warning[600]
                          : theme.colors.error[600]
                    }]}>{book.correctRate || 0}%</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  header: {
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary[200],
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    ...theme.shadows.sm,
  },
  statCardPrimary: {
    borderColor: theme.colors.primary[300],
  },
  statCardSecondary: {
    borderColor: theme.colors.primary[200],
  },
  statCardAccent: {
    borderColor: theme.colors.primary[400],
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  percentageIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.primary[600],
    fontFamily: 'ZenKaku-Bold',
  },
  statValue: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
  },
  emptyState: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.neutral.white,
    fontFamily: 'ZenKaku-Bold',
  },
  rankingList: {
    gap: theme.spacing.md,
  },
  rankingItem: {
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
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rankBadgeGold: {
    backgroundColor: '#ffd700',
  },
  rankBadgeSilver: {
    backgroundColor: '#c0c0c0',
  },
  rankBadgeBronze: {
    backgroundColor: '#cd7f32',
  },
  rankNumber: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[700],
    fontFamily: 'ZenKaku-Bold',
  },
  rankNumberMedal: {
    color: theme.colors.neutral.white,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    marginBottom: theme.spacing.xs,
  },
  rankingCategory: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
  },
  rankingRight: {
    alignItems: 'center',
    minWidth: 60,
  },
  rankingRounds: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.primary[600],
    fontFamily: 'ZenKaku-Bold',
  },
  rankingRoundsLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondary[600],
    fontFamily: 'ZenKaku-Regular',
    marginBottom: theme.spacing.xs,
  },
  rankingDivider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.secondary[200],
    marginVertical: theme.spacing.xs,
  },
  rankingCorrect: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold as any,
    fontFamily: 'ZenKaku-Bold',
  },
});
