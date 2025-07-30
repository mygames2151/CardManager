import { useState, useEffect } from 'react';
import { LocalStorage } from '@/lib/storage';
import { Card, ExcelFile, MediaFile } from '@shared/schema';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    setCards(LocalStorage.getCards());
  }, []);

  const refreshCards = () => {
    setCards(LocalStorage.getCards());
  };

  return { cards, refreshCards };
}

export function useExcelFiles() {
  const [files, setFiles] = useState<ExcelFile[]>([]);

  useEffect(() => {
    setFiles(LocalStorage.getExcelFiles());
  }, []);

  const refreshFiles = () => {
    setFiles(LocalStorage.getExcelFiles());
  };

  return { files, refreshFiles };
}

export function useMediaFiles(cardId?: string) {
  const [files, setFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (cardId) {
      setFiles(LocalStorage.getMediaFilesByCardId(cardId));
    } else {
      setFiles(LocalStorage.getMediaFiles());
    }
  }, [cardId]);

  const refreshFiles = () => {
    if (cardId) {
      setFiles(LocalStorage.getMediaFilesByCardId(cardId));
    } else {
      setFiles(LocalStorage.getMediaFiles());
    }
  };

  return { files, refreshFiles };
}

export function useSettings() {
  const [settings, setSettings] = useState(() => LocalStorage.getSettings());

  const updateSettings = (newSettings: any) => {
    LocalStorage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  return { settings, updateSettings };
}
