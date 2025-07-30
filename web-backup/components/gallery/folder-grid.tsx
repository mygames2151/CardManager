import { Card } from '@shared/schema';
import { useMediaFiles } from '@/hooks/use-storage';
import { Folder } from 'lucide-react';

interface FolderGridProps {
  cards: Card[];
  onFolderClick: (card: Card) => void;
}

export function FolderGrid({ cards, onFolderClick }: FolderGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No card folders yet</h3>
        <p className="text-gray-500 dark:text-gray-500">Add cards first to create media folders</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const FolderItem = ({ card }: { card: Card }) => {
          const { files } = useMediaFiles(card.id);
          
          return (
            <div
              key={card.id}
              className="bg-card rounded-lg p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onFolderClick(card)}
            >
              <div className="text-center">
                <Folder className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">{card.idNumber} - {card.firstName} {card.surname}</h3>
                <p className="text-xs text-muted-foreground">
                  {files.length} media files
                </p>
              </div>
            </div>
          );
        };
        
        return <FolderItem key={card.id} card={card} />;
      })}
    </div>
  );
}
