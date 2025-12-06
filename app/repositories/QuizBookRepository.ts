// repositories/QuizBookRepository.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizBook } from '@/types/QuizBook'; 

const STORAGE_KEY = '@quizbooks';

class QuizBookRepository {
  
  // ========== Public methods ==========
  
  /**
   * 全ての問題集を取得
   */
  async getAll(): Promise<QuizBook[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      
      const parsed = JSON.parse(stored);
      // ★ parsed は配列なので、map で各要素を deserialize
      return parsed.map((book: any) => this.deserialize(book));
    } catch (error) {
      console.error('Failed to load quiz books:', error);
      return [];
    }
  }
  
  /**
   * IDで問題集を取得
   */
  async getById(id: string): Promise<QuizBook | null> {
    const books = await this.getAll();
    return books.find(book => book.id === id) || null;
  }
  
  /**
   * 問題集を新規作成
   */
  async create(quizBook: QuizBook): Promise<QuizBook> {
    try {
      const books = await this.getAll();
      const newBooks = [...books, quizBook];
      await this.saveAll(newBooks);
      return quizBook;
    } catch (error) {
      console.error('Failed to create quiz book:', error);
      throw error;
    }
  }
  
  /**
   * 問題集を更新
   */
  async update(id: string, updates: Partial<QuizBook>): Promise<QuizBook | null> {
    try {
      const books = await this.getAll();
      const index = books.findIndex(book => book.id === id);
      
      if (index === -1) {
        console.warn(`Quiz book with id ${id} not found`);
        return null;
      }
      
      const updatedBook = {
        ...books[index],
        ...updates,
        updatedAt: new Date(),
      };
      
      books[index] = updatedBook;
      await this.saveAll(books);
      
      return updatedBook;
    } catch (error) {
      console.error('Failed to update quiz book:', error);
      throw error;
    }
  }
  
  /**
   * 問題集を削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      const books = await this.getAll();
      const newBooks = books.filter(book => book.id !== id);
      
      if (books.length === newBooks.length) {
        console.warn(`Quiz book with id ${id} not found`);
        return false;
      }
      
      await this.saveAll(newBooks);
      return true;
    } catch (error) {
      console.error('Failed to delete quiz book:', error);
      throw error;
    }
  }
  
  /**
   * 全データを削除（開発用）
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
  
  // ========== Private methods ==========
  
  /**
   * 全ての問題集を保存
   * ★ 引数は配列、戻り値はvoid
   */
  private async saveAll(books: QuizBook[]): Promise<void> {
    // ★ 配列の各要素をserialize
    const serialized = books.map(book => this.serialize(book));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
  
  /**
   * Date型をシリアライズ（保存用）
   */
  private serialize(book: QuizBook): any {
    return {
      ...book,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
    };
  }
  
  /**
   * Date型をデシリアライズ（読み込み用）
   */
  private deserialize(data: any): QuizBook {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}

export const quizBookRepository = new QuizBookRepository();