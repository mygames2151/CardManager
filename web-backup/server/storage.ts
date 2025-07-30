import { type Card, type ExcelFile, type MediaFile, type InsertCard, type InsertExcelFile, type InsertMediaFile } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for the Card Manager app
export interface IStorage {
  // Card operations
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<Card>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;
  
  // Excel file operations
  getExcelFiles(): Promise<ExcelFile[]>;
  getExcelFile(id: string): Promise<ExcelFile | undefined>;
  createExcelFile(file: InsertExcelFile): Promise<ExcelFile>;
  updateExcelFile(id: string, updates: Partial<ExcelFile>): Promise<ExcelFile | undefined>;
  deleteExcelFile(id: string): Promise<boolean>;
  
  // Media file operations
  getMediaFiles(): Promise<MediaFile[]>;
  getMediaFilesByCardId(cardId: string): Promise<MediaFile[]>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;
  private excelFiles: Map<string, ExcelFile>;
  private mediaFiles: Map<string, MediaFile>;

  constructor() {
    this.cards = new Map();
    this.excelFiles = new Map();
    this.mediaFiles = new Map();
  }

  // Card operations
  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { ...insertCard, id, createdAt: new Date() };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<Card | undefined> {
    const existing = this.cards.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.cards.set(id, updated);
    return updated;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  // Excel file operations
  async getExcelFiles(): Promise<ExcelFile[]> {
    return Array.from(this.excelFiles.values());
  }

  async getExcelFile(id: string): Promise<ExcelFile | undefined> {
    return this.excelFiles.get(id);
  }

  async createExcelFile(insertFile: InsertExcelFile): Promise<ExcelFile> {
    const id = randomUUID();
    const file: ExcelFile = { ...insertFile, id, lastModified: new Date() };
    this.excelFiles.set(id, file);
    return file;
  }

  async updateExcelFile(id: string, updates: Partial<ExcelFile>): Promise<ExcelFile | undefined> {
    const existing = this.excelFiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastModified: new Date() };
    this.excelFiles.set(id, updated);
    return updated;
  }

  async deleteExcelFile(id: string): Promise<boolean> {
    return this.excelFiles.delete(id);
  }

  // Media file operations
  async getMediaFiles(): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values());
  }

  async getMediaFilesByCardId(cardId: string): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values()).filter(file => file.cardId === cardId);
  }

  async createMediaFile(insertFile: InsertMediaFile): Promise<MediaFile> {
    const id = randomUUID();
    const file: MediaFile = { ...insertFile, id, createdAt: new Date() };
    this.mediaFiles.set(id, file);
    return file;
  }

  async deleteMediaFile(id: string): Promise<boolean> {
    return this.mediaFiles.delete(id);
  }
}

export const storage = new MemStorage();
