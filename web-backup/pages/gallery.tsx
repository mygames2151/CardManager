import { useState } from 'react';
import { Card } from '@shared/schema';
import { useCards, useMediaFiles } from '@/hooks/use-storage';
import { FolderGrid } from '@/components/gallery/folder-grid';
import { MediaViewer } from '@/components/gallery/media-viewer';

export default function GalleryPage() {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { files: mediaFiles, refreshFiles } = useMediaFiles(selectedCard?.id);

  const handleFolderClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCloseViewer = () => {
    setSelectedCard(null);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Card Folders</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each card has its own dedicated folder for storing media files
        </p>
      </div>

      <FolderGrid cards={cards} onFolderClick={handleFolderClick} />

      <MediaViewer
        cardId={selectedCard?.id || null}
        cardName={selectedCard ? `${selectedCard.idNumber} - ${selectedCard.firstName} ${selectedCard.surname}` : ''}
        isOpen={!!selectedCard}
        onClose={handleCloseViewer}
        mediaFiles={mediaFiles}
        onRefresh={refreshFiles}
      />
    </div>
  );
}
