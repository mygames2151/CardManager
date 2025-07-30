import { Card, ExcelFile, MediaFile, InsertCard, InsertExcelFile, InsertMediaFile } from "@shared/schema";

const CARDS_KEY = 'app_cards';
const EXCEL_FILES_KEY = 'app_excel_files';
const MEDIA_FILES_KEY = 'app_media_files';
const PIN_KEY = 'app_pin';
const SETTINGS_KEY = 'app_settings';

export class LocalStorage {
  // Cards
  static getCards(): Card[] {
    const data = localStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveCards(cards: Card[]): void {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  }

  static addCard(card: InsertCard): Card {
    const cards = this.getCards();
    const newCard: Card = {
      ...card,
      id: this.generateId(),
      createdAt: new Date(),
    };
    cards.push(newCard);
    this.saveCards(cards);
    return newCard;
  }

  static updateCard(id: string, updates: Partial<Card>): Card | null {
    const cards = this.getCards();
    const index = cards.findIndex(card => card.id === id);
    if (index === -1) return null;
    
    cards[index] = { ...cards[index], ...updates };
    this.saveCards(cards);
    return cards[index];
  }

  static deleteCard(id: string): boolean {
    const cards = this.getCards();
    const filteredCards = cards.filter(card => card.id !== id);
    if (filteredCards.length === cards.length) return false;
    
    this.saveCards(filteredCards);
    
    // Also delete associated media files
    const mediaFiles = this.getMediaFiles();
    const filteredMedia = mediaFiles.filter(media => media.cardId !== id);
    this.saveMediaFiles(filteredMedia);
    
    return true;
  }

  static getCardById(id: string): Card | null {
    const cards = this.getCards();
    return cards.find(card => card.id === id) || null;
  }

  static isIdNumberUnique(idNumber: string, excludeId?: string): boolean {
    const cards = this.getCards();
    return !cards.some(card => card.idNumber === idNumber && card.id !== excludeId);
  }

  static isCodeUnique(code: string, excludeId?: string): boolean {
    const cards = this.getCards();
    return !cards.some(card => card.code === code && card.id !== excludeId);
  }

  // Excel Files
  static getExcelFiles(): ExcelFile[] {
    const data = localStorage.getItem(EXCEL_FILES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveExcelFiles(files: ExcelFile[]): void {
    localStorage.setItem(EXCEL_FILES_KEY, JSON.stringify(files));
  }

  static addExcelFile(file: InsertExcelFile): ExcelFile {
    const files = this.getExcelFiles();
    const newFile: ExcelFile = {
      ...file,
      id: this.generateId(),
      lastModified: new Date(),
    };
    files.push(newFile);
    this.saveExcelFiles(files);
    return newFile;
  }

  static updateExcelFile(id: string, updates: Partial<ExcelFile>): ExcelFile | null {
    const files = this.getExcelFiles();
    const index = files.findIndex(file => file.id === id);
    if (index === -1) return null;
    
    files[index] = { ...files[index], ...updates, lastModified: new Date() };
    this.saveExcelFiles(files);
    return files[index];
  }

  static deleteExcelFile(id: string): boolean {
    const files = this.getExcelFiles();
    const filteredFiles = files.filter(file => file.id !== id);
    if (filteredFiles.length === files.length) return false;
    
    this.saveExcelFiles(filteredFiles);
    return true;
  }

  // Media Files
  static getMediaFiles(): MediaFile[] {
    const data = localStorage.getItem(MEDIA_FILES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveMediaFiles(files: MediaFile[]): void {
    localStorage.setItem(MEDIA_FILES_KEY, JSON.stringify(files));
  }

  static addMediaFile(file: InsertMediaFile): MediaFile {
    const files = this.getMediaFiles();
    const newFile: MediaFile = {
      ...file,
      id: this.generateId(),
      createdAt: new Date(),
    };
    files.push(newFile);
    this.saveMediaFiles(files);
    return newFile;
  }

  static getMediaFilesByCardId(cardId: string): MediaFile[] {
    const files = this.getMediaFiles();
    return files.filter(file => file.cardId === cardId);
  }

  static deleteMediaFile(id: string): boolean {
    const files = this.getMediaFiles();
    const filteredFiles = files.filter(file => file.id !== id);
    if (filteredFiles.length === files.length) return false;
    
    this.saveMediaFiles(filteredFiles);
    return true;
  }

  // PIN and Settings
  static getPin(): string {
    return localStorage.getItem(PIN_KEY) || '2208';
  }

  static setPin(pin: string): void {
    localStorage.setItem(PIN_KEY, pin);
  }

  static getSettings(): any {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { darkMode: false };
  }

  static saveSettings(settings: any): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // Utility
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
