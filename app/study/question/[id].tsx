import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useQuizBookStore } from '@/stores/quizBookStore';
import { useLocalSearchParams, Stack } from 'expo-router'
import MemoModal from './compornent/MemoModal'
import { theme } from '@/constants/Theme'
import { Plus, Trash2 } from 'lucide-react-native'
import ConfirmDialog from '@/app/compornents/ConfirmDialog';

const QuestionList = () => {
    const { id } = useLocalSearchParams();
    const { quizBooks, fetchQuizBooks, getChapterById, getSectionById } = useQuizBookStore();
    const lastTap = useRef<number>(0);
    const saveAnswer = useQuizBookStore(state => state.saveAnswer);
    const toggleAnswerLock = useQuizBookStore(state => state.toggleAnswerLock);
    const saveMemo = useQuizBookStore(state => state.saveMemo);
    const getQuestionAnswers = useQuizBookStore(state => state.getQuestionAnswers);
    const updateLastAnswer = useQuizBookStore(state => state.updateLastAnswer);
    const deleteLastAnswer = useQuizBookStore(state => state.deleteLastAnswer);
    const addQuestionToTarget = useQuizBookStore(state => state.addQuestionToTarget);
    const deleteQuestionFromTarget = useQuizBookStore(state => state.deleteQuestionFromTarget);

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteTargetNumber, setDeleteTargetNumber] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
    const [memoText, setMemoText] = useState('');

    useEffect(() => {
        if (quizBooks.length === 0) {
            fetchQuizBooks();
        }
    }, []);

    const chapterData = getChapterById(String(id));
    const sectionData = getSectionById(String(id));
    const chapterId = chapterData?.chapter.id || sectionData?.chapter.id || '';
    const sectionId = sectionData?.section.id || null;

    const displayInfo = chapterData
        ? {
            type: 'chapter' as const,
            chapterNumber: chapterData.chapter.chapterNumber,
            title: chapterData.chapter.title,
            questionCount: chapterData.chapter.questionCount || 0
        }
        : sectionData
            ? {
                type: 'section' as const,
                chapterNumber: sectionData.chapter.chapterNumber,
                chapterTitle: sectionData.chapter.title,
                sectionNumber: sectionData.section.sectionNumber,
                title: sectionData.section.title,
                questionCount: sectionData.section.questionCount
            }
            : null;

    if (!displayInfo) {
        return (
            <View style={styles.container}>
                <Text>データが見つかりません</Text>
            </View>
        );
    }

    const addAnswer = async (questionNumber: number, answer: '○' | '×') => {
        await saveAnswer(chapterId, sectionId, questionNumber, answer);
    };

    const toggleAnswer = async (questionNumber: number) => {
        const questionData = getQuestionAnswers(chapterId, sectionId, questionNumber);
        if (!questionData) return;

        const lastAttempt = questionData.attempts[questionData.attempts.length - 1];
        if (!lastAttempt || lastAttempt.resultConfirmFlg) return;

        if (lastAttempt.result === '○') {
            // ○→× に変更（新しい×を追加して古い○を削除する形）
            await updateLastAnswer(chapterId, sectionId, questionNumber, '×');
        } else {
            // ×の場合は削除
            await deleteLastAnswer(chapterId, sectionId, questionNumber);
        }
    };

    const handleDoubleTap = async (questionNumber: number) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
            const questionData = getQuestionAnswers(chapterId, sectionId, questionNumber);

            if (!questionData) {
                // 未回答の場合は○から開始
                await addAnswer(questionNumber, '○');
            } else {
                const lastAttempt = questionData.attempts[questionData.attempts.length - 1];
                const isLocked = lastAttempt?.resultConfirmFlg;

                if (isLocked) {
                    // ロック済みの場合 → 新しいカードを追加
                    await addAnswer(questionNumber, '○');
                } else {
                    // 未ロック → 通常のトグル処理
                    await toggleAnswer(questionNumber);
                }
            }
        }
        lastTap.current = now;
    };

    const handleLongPress = (questionNumber: number) => {
        toggleAnswerLock(chapterId, sectionId, questionNumber);
    };

    const handleAddQuestion = async () => {
        await addQuestionToTarget(chapterId, sectionId);
    };

    const handleDeleteQuestion = (questionNumber: number) => {
        setDeleteTargetNumber(questionNumber);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = async () => {
        if (deleteTargetNumber !== null) {
            await deleteQuestionFromTarget(chapterId, sectionId, deleteTargetNumber);
            setDeleteDialogVisible(false);
            setDeleteTargetNumber(null);
        }
    };

    const handleSaveMemo = async (text: string) => {
        if (selectedQuestion !== null) {
            await saveMemo(chapterId, sectionId, selectedQuestion, text);
        }
    };

    const handleOpenMemo = (questionNumber: number) => {
        setSelectedQuestion(questionNumber);
        const questionData = getQuestionAnswers(chapterId, sectionId, questionNumber);
        const currentMemo = questionData?.memo || '';
        setMemoText(currentMemo);
        setModalVisible(true);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <Text style={styles.questionCount}>
                            全{displayInfo.questionCount}問
                        </Text>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                <View>
                    {Array.from({ length: displayInfo.questionCount }, (_, i) => i + 1).map((num) => {
                        const questionData = getQuestionAnswers(chapterId, sectionId, num);
                        const history = questionData?.attempts || [];
                        const actualCount = history.length;
                        const lastIsLocked = history[history.length - 1]?.resultConfirmFlg || false;
                        const displayCount = lastIsLocked ? actualCount + 1 : actualCount;

                        const getCardWidth = () => {
                            if (displayCount === 0) return undefined;
                            if (displayCount === 1) return undefined;
                            if (displayCount === 2) return '48%';
                            if (displayCount === 3) return '31%';
                            return 150;
                        };

                        const cardWidth = getCardWidth();
                        const needsScroll = displayCount >= 4;

                        return (
                            <View key={num} style={styles.questionGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.questionNumberLabel}>問題 {num}</Text>
                                    <View style={styles.buttonGroup}>
                                        <TouchableOpacity
                                            style={styles.memoButton}
                                            onPress={() => handleOpenMemo(num)}
                                        >
                                            <Text style={styles.memoText}>MEMO</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteQuestion(num)}
                                        >
                                            <Trash2 size={16} color={theme.colors.error[600]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {
                                    needsScroll ? (
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.cardRow}
                                        >
                                            {history.map((attempt, attemptIndex) => {
                                                const isLocked = attempt.resultConfirmFlg;
                                                const isLastAttempt = attemptIndex === history.length - 1;

                                                return (
                                                    <TouchableOpacity
                                                        key={`${num}-${attemptIndex}`}
                                                        style={[
                                                            styles.questionCard,
                                                            { width: 110 },
                                                            attempt.result === '○' && styles.correctCard,
                                                            attempt.result === '×' && styles.incorrectCard,
                                                            isLocked && styles.lockedCard,
                                                        ]}
                                                        onPress={isLastAttempt ? () => handleDoubleTap(num) : undefined}
                                                        onLongPress={isLastAttempt ? () => handleLongPress(num) : undefined}
                                                        delayLongPress={500}
                                                        disabled={!isLastAttempt}
                                                    >
                                                        {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
                                                        <Text style={styles.attemptNumber}>{attemptIndex + 1}周目</Text>
                                                        <Text style={[
                                                            styles.answerMark,
                                                            attempt.result === '○' ? styles.correctMark : styles.incorrectMark
                                                        ]}>
                                                            {attempt.result}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                            {lastIsLocked && (
                                                <TouchableOpacity
                                                    style={[styles.questionCard, styles.unattemptedCard, { width: 110 }]}
                                                    onPress={() => handleDoubleTap(num)}
                                                >
                                                    <Text style={styles.attemptNumber}>{actualCount + 1}周目</Text>
                                                </TouchableOpacity>
                                            )}
                                        </ScrollView>
                                    ) : (
                                        <View style={styles.cardRowNonScroll}>
                                            {history.length > 0 ? (
                                                <>
                                                    {history.map((attempt, attemptIndex) => {
                                                        const isLocked = attempt.resultConfirmFlg;
                                                        const isLastAttempt = attemptIndex === history.length - 1;

                                                        return (
                                                            <TouchableOpacity
                                                                key={`${num}-${attemptIndex}`}
                                                                style={[
                                                                    styles.questionCard,
                                                                    cardWidth ? { width: cardWidth } : { flex: 1 },
                                                                    attempt.result === '○' && styles.correctCard,
                                                                    attempt.result === '×' && styles.incorrectCard,
                                                                    isLocked && styles.lockedCard,
                                                                ]}
                                                                onPress={isLastAttempt ? () => handleDoubleTap(num) : undefined}
                                                                onLongPress={isLastAttempt ? () => handleLongPress(num) : undefined}
                                                                delayLongPress={500}
                                                                disabled={!isLastAttempt}
                                                            >
                                                                {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
                                                                <Text style={styles.attemptNumber}>{attemptIndex + 1}周目</Text>
                                                                <Text style={[
                                                                    styles.answerMark,
                                                                    attempt.result === '○' ? styles.correctMark : styles.incorrectMark
                                                                ]}>
                                                                    {attempt.result}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}

                                                    {lastIsLocked && (
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.questionCard,
                                                                styles.unattemptedCard,
                                                                cardWidth ? { width: cardWidth } : { flex: 1 }
                                                            ]}
                                                            onPress={() => handleDoubleTap(num)}
                                                        >
                                                            <Text style={styles.attemptNumber}>{actualCount + 1}周目</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[styles.questionCard, styles.unattemptedCard, { flex: 1 }]}
                                                    onPress={() => handleDoubleTap(num)}
                                                >
                                                    <Text style={styles.questionNumber}>{num}</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )
                                }
                            </View>
                        );
                    })}

                    <TouchableOpacity
                        style={styles.addQuestionButton}
                        onPress={handleAddQuestion}
                        activeOpacity={0.7}
                    >
                        <Plus size={24} color={theme.colors.primary[600]} strokeWidth={2.5} />
                        <Text style={styles.addQuestionButtonText}>問題を追加</Text>
                    </TouchableOpacity>
                </View>

                <MemoModal
                    visible={modalVisible}
                    questionNumber={selectedQuestion}
                    memoText={memoText}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSaveMemo}
                    onChangeText={setMemoText}
                />

                <ConfirmDialog
                    visible={deleteDialogVisible}
                    title="問題を削除"
                    message="この問題を削除してもよろしいですか？この操作は取り消せません。"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogVisible(false)}
                />
            </ScrollView >
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral[50],
    },
    titleContainer: {
        backgroundColor: theme.colors.neutral.white,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.secondary[200],
    },
    breadcrumb: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.secondary[600],
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.fontFamilies.regular,
    },
    title: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.secondary[900],
        fontFamily: theme.typography.fontFamilies.bold,
    },
    questionCount: {
        fontSize: theme.typography.fontSizes.lg,
        color: theme.colors.secondary[600],
        fontWeight: 'bold',
        fontFamily: theme.typography.fontFamilies.regular,
    },
    correctCard: {
        backgroundColor: theme.colors.success[50],
        borderColor: theme.colors.success[500],
        borderWidth: 2,
    },
    incorrectCard: {
        backgroundColor: theme.colors.error[50],
        borderColor: theme.colors.error[500],
        borderWidth: 2,
    },
    masteredCard: {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
    },
    unattemptedCard: {
        backgroundColor: theme.colors.warning[50],
        borderWidth: 2,
        borderColor: theme.colors.warning[300],
        borderStyle: 'dashed',
    },
    lockedCard: {
        borderWidth: 4,
        opacity: 0.75,
        transform: [{ scale: 0.97 }],
    },
    questionNumber: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.secondary[900],
        fontFamily: theme.typography.fontFamilies.bold,
    },
    answerMark: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.bold,
    },
    correctMark: {
        color: theme.colors.success[600],
    },
    incorrectMark: {
        color: theme.colors.error[600],
    },
    lockIcon: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        fontSize: 16,
    },
    questionGroup: {
        marginTop: theme.spacing.lg,
    },
    questionNumberLabel: {
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.secondary[900],
        fontFamily: theme.typography.fontFamilies.bold,
    },
    cardRow: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    questionCard: {
        backgroundColor: theme.colors.neutral.white,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        marginVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.md,
        minHeight: 80,
    },
    attemptNumber: {
        position: 'absolute',
        top: theme.spacing.sm,
        left: theme.spacing.sm,
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: theme.typography.fontWeights.semibold,
        color: theme.colors.secondary[600],
        fontFamily: theme.typography.fontFamilies.medium,
    },
    cardRowNonScroll: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'center',
    },
    memoButton: {
        backgroundColor: theme.colors.neutral.white,
        borderColor: theme.colors.primary[600],
        borderWidth: 1.5,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    memoText: {
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: theme.typography.fontWeights.semibold,
        color: theme.colors.primary[600],
        fontFamily: theme.typography.fontFamilies.bold,
    },
    deleteButton: {
        backgroundColor: theme.colors.neutral.white,
        borderColor: theme.colors.error[600],
        borderWidth: 1.5,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    addQuestionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.lg,
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.primary[300],
        borderStyle: 'dashed',
        gap: theme.spacing.sm,
    },
    addQuestionButtonText: {
        fontSize: theme.typography.fontSizes.base,
        color: theme.colors.primary[600],
        fontWeight: theme.typography.fontWeights.bold as any,
        fontFamily: theme.typography.fontFamilies.bold,
    },
    // モーダル関連のスタイル
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        height: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeIcon: {
        padding: 4,
    },
    closeIconText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    memoInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4caf50',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default QuestionList;