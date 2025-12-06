import { Text, View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router, Stack } from 'expo-router'
import { useQuizBookStore } from '@/stores/quizBookStore';
import { theme } from '@/constants/Theme';
import Card from '@/components/ui/Card';
import { Plus, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react-native';
import ConfirmDialog from '@/app/compornents/ConfirmDialog';

const StudyHome = () => {
    const { id } = useLocalSearchParams();
    const {
        quizBooks,
        fetchQuizBooks,
        getQuizBookById,
        addChapterToQuizBook,
        deleteChapterFromQuizBook,
        updateChapterInQuizBook
    } = useQuizBookStore();

    const [showAddModal, setShowAddModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [editingChapter, setEditingChapter] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedChapterTitle, setEditedChapterTitle] = useState('');
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        if (quizBooks.length === 0) {
            fetchQuizBooks();
        }
    }, []);

    const quizBook = getQuizBookById(id as string);

    if (!quizBook) {
        return (
            <ScrollView style={styles.container}>
                <Text>問題集が存在しません</Text>
            </ScrollView>
        )
    }

    const getChapterTotalQuestions = (chapter: typeof quizBook.chapters[0]) => {
        if (chapter.sections && chapter.sections.length > 0) {
            return chapter.sections.reduce((sum, section) => {
                return sum + section.questionCount;
            }, 0);
        } else {
            return chapter.questionCount || 0;
        };
    }

    const handleChapterPress = (chapter: typeof quizBook.chapters[0]) => {
        if (activeMenu) return;

        if (quizBook.useSections === true) {
            router.push({
                pathname: '/study/section/[chapterId]',
                params: { chapterId: chapter.id }
            });
        } else if (quizBook.useSections === false) {
            router.push({
                pathname: '/study/question/[id]',
                params: { id: chapter.id }
            });
        } else {
            // 初回のみsection画面へ遷移して選択
            router.push({
                pathname: '/study/section/[chapterId]',
                params: { chapterId: chapter.id }
            });
        }
    };

    const handleAddChapter = async () => {
        await addChapterToQuizBook(quizBook.id, newChapterTitle);
        setNewChapterTitle('');
        setShowAddModal(false);
    };

    const handleEditChapter = (chapter: any, e: any) => {
        e.stopPropagation();
        setEditingChapter(chapter);
        setEditedChapterTitle(chapter.title);
        setShowEditModal(true);
        setActiveMenu(null);
    };

    const handleSaveEdit = async () => {
        if (editingChapter && editedChapterTitle.trim() !== '') {
            await updateChapterInQuizBook(quizBook.id, editingChapter.id, {
                title: editedChapterTitle
            });
            setShowEditModal(false);
            setEditingChapter(null);
        }
    };

    const handleDeleteChapter = (chapterId: string, e: any) => {
        e.stopPropagation();
        setDeleteTargetId(chapterId);
        setDeleteDialogVisible(true);
        setActiveMenu(null);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            await deleteChapterFromQuizBook(quizBook.id, deleteTargetId);
            setDeleteDialogVisible(false);
            setDeleteTargetId(null);
        }
    };

    const toggleMenu = (chapterId: string, e: any) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === chapterId ? null : chapterId);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View style={{ maxWidth: 280 }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ fontSize: 16, fontWeight: "bold", textAlign: 'center' }}
                            >
                                {quizBook.title}
                            </Text>
                        </View>
                    ),
                }}
            />

            <View style={styles.wrapper}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {quizBook.chapters.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyContent}>
                                <AlertCircle size={20} color={theme.colors.warning[600]} />
                                <Text style={styles.emptyText}>章を追加してください</Text>
                            </View>
                        </View>
                    ) : (
                        quizBook.chapters.map((chapter) => (
                            <View key={chapter.id} style={styles.cardWrapper}>
                                <TouchableOpacity
                                    onPress={() => handleChapterPress(chapter)}
                                    activeOpacity={0.7}
                                >
                                    <Card style={styles.chapterCard}>
                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={(e) => toggleMenu(chapter.id, e)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <MoreVertical size={20} color={theme.colors.secondary[600]} />
                                        </TouchableOpacity>

                                        <View style={styles.chapterHeader}>
                                            <Text style={styles.chapterTitle}>
                                                第{chapter.chapterNumber}章 {chapter.title}
                                            </Text>
                                        </View>
                                        <View style={styles.chapterStats}>
                                            <View style={styles.statItem}>
                                                <Text style={styles.statLabel}>正答率</Text>
                                                <Text style={[styles.statValue, {
                                                    color: chapter.chapterRate >= 80
                                                        ? theme.colors.success[600]
                                                        : chapter.chapterRate >= 60
                                                            ? theme.colors.warning[600]
                                                            : theme.colors.error[600]
                                                }]}>
                                                    {chapter.chapterRate}%
                                                </Text>
                                            </View>
                                            <View style={styles.divider} />
                                            <View style={styles.statItem}>
                                                <Text style={styles.statLabel}>問題数</Text>
                                                <Text style={styles.statValue}>
                                                    {getChapterTotalQuestions(chapter)}問
                                                </Text>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableOpacity>

                                {activeMenu === chapter.id && (
                                    <View style={styles.menu}>
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={(e) => handleEditChapter(chapter, e)}
                                        >
                                            <Edit size={16} color={theme.colors.primary[600]} />
                                            <Text style={styles.menuText}>編集</Text>
                                        </TouchableOpacity>
                                        <View style={styles.menuDivider} />
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={(e) => handleDeleteChapter(chapter.id, e)}
                                        >
                                            <Trash2 size={16} color={theme.colors.error[600]} />
                                            <Text style={[styles.menuText, { color: theme.colors.error[600] }]}>削除</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))
                    )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowAddModal(true)}
                        activeOpacity={0.7}
                    >
                        <Plus size={24} color={theme.colors.primary[600]} strokeWidth={2.5} />
                        <Text style={styles.addButtonText}>章を追加</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* 章追加モーダル */}
                <Modal
                    visible={showAddModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowAddModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>章を追加</Text>
                            <TextInput
                                style={styles.input}
                                value={newChapterTitle}
                                onChangeText={setNewChapterTitle}
                                placeholder="章名を入力（任意）"
                                placeholderTextColor={theme.colors.secondary[400]}
                                autoFocus
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowAddModal(false);
                                        setNewChapterTitle('');
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={handleAddChapter}
                                >
                                    <Text style={styles.confirmButtonText}>追加</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 章編集モーダル */}
                <Modal
                    visible={showEditModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowEditModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>章を編集</Text>
                            <TextInput
                                style={styles.input}
                                value={editedChapterTitle}
                                onChangeText={setEditedChapterTitle}
                                placeholder="章名を入力"
                                placeholderTextColor={theme.colors.secondary[400]}
                                autoFocus
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowEditModal(false);
                                        setEditingChapter(null);
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={handleSaveEdit}
                                >
                                    <Text style={styles.confirmButtonText}>保存</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 削除確認ダイアログ */}
                <ConfirmDialog
                    visible={deleteDialogVisible}
                    title="章を削除"
                    message="この章を削除してもよろしいですか？この操作は取り消せません。"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogVisible(false)}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.colors.neutral[50],
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.white,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.secondary[200],
    },
    title: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold as any,
        color: theme.colors.secondary[900],
        fontFamily: 'ZenKaku-Bold',
    },
    subtitle: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.secondary[600],
        fontFamily: 'ZenKaku-Regular',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.md,
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
        fontFamily: 'ZenKaku-Regular',
    },
    cardWrapper: {
        marginBottom: theme.spacing.sm,
        position: 'relative',
    },
    chapterCard: {
        padding: theme.spacing.md,
        position: 'relative',
    },
    menuButton: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        zIndex: 10,
        padding: 4,
    },
    chapterHeader: {
        marginBottom: theme.spacing.sm,
    },
    chapterTitle: {
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.bold as any,
        color: theme.colors.secondary[900],
        fontFamily: 'ZenKaku-Bold',
    },
    chapterStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.secondary[200],
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: theme.typography.fontSizes.xs,
        color: theme.colors.secondary[600],
        marginBottom: 2,
        fontFamily: 'ZenKaku-Regular',
    },
    statValue: {
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.bold as any,
        color: theme.colors.secondary[900],
        fontFamily: 'ZenKaku-Bold',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: theme.colors.secondary[200],
    },
    menu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: theme.spacing.xs,
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.secondary[200],
        ...theme.shadows.lg,
        overflow: 'hidden',
        zIndex: 100,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    menuDivider: {
        height: 1,
        backgroundColor: theme.colors.secondary[200],
    },
    menuText: {
        fontSize: theme.typography.fontSizes.base,
        fontFamily: 'ZenKaku-Medium',
        color: theme.colors.secondary[900],
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.primary[300],
        borderStyle: 'dashed',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    addButtonText: {
        fontSize: theme.typography.fontSizes.base,
        color: theme.colors.primary[600],
        fontWeight: theme.typography.fontWeights.bold as any,
        fontFamily: 'ZenKaku-Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold as any,
        color: theme.colors.secondary[900],
        marginBottom: theme.spacing.lg,
        fontFamily: 'ZenKaku-Bold',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.secondary[300],
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSizes.base,
        fontFamily: 'ZenKaku-Regular',
        marginBottom: theme.spacing.lg,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing.md,
    },
    modalButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: theme.colors.secondary[100],
    },
    cancelButtonText: {
        color: theme.colors.secondary[700],
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.semibold as any,
        fontFamily: 'ZenKaku-Medium',
    },
    confirmButton: {
        backgroundColor: theme.colors.primary[600],
    },
    confirmButtonText: {
        color: theme.colors.neutral.white,
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.semibold as any,
        fontFamily: 'ZenKaku-Medium',
    },
});

export default StudyHome
