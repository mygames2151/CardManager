import { useState } from 'react';
import { MediaFile } from '@shared/schema';
import { LocalStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Play, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface MediaViewerProps {
  cardId: string | null;
  cardName: string;
  isOpen: boolean;
  onClose: () => void;
  mediaFiles: MediaFile[];
  onRefresh: () => void;
}

export function MediaViewer({ 
  cardId, 
  cardName, 
  isOpen, 
  onClose, 
  mediaFiles, 
  onRefresh 
}: MediaViewerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [showAddMedia, setShowAddMedia] = useState(false);
  const { toast } = useToast();

  const handleAddMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !cardId) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaFile = {
        cardId,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        data: e.target?.result as string,
      };

      try {
        LocalStorage.addMediaFile(mediaFile);
        onRefresh();
        setShowAddMedia(false);
        toast({
          title: "Media Added",
          description: "Media file has been added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add media file",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = (media: MediaFile) => {
    if (confirm(`Are you sure you want to delete ${media.name}?`)) {
      LocalStorage.deleteMediaFile(media.id);
      onRefresh();
      toast({
        title: "Media Deleted",
        description: "Media file has been deleted successfully",
      });
    }
  };

  const renderMediaThumbnail = (media: MediaFile) => {
    if (media.type === 'image') {
      return (
        <img
          src={media.data}
          alt={media.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setSelectedMedia(media)}
        />
      );
    } else {
      return (
        <div 
          className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedMedia(media)}
        >
          <Play className="h-8 w-8 text-gray-400" />
        </div>
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{cardName} Media</DialogTitle>
              <Button
                onClick={() => setShowAddMedia(true)}
                size="sm"
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Media
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {mediaFiles.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No media files</h3>
                <p className="text-gray-500 dark:text-gray-500">Add photos or videos for this card</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {mediaFiles.map((media) => (
                  <div key={media.id} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative group">
                    {renderMediaThumbnail(media)}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(media);
                      }}
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Media Dialog */}
      <Dialog open={showAddMedia} onOpenChange={setShowAddMedia}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Media</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select an image or video file to add to this card's folder
            </p>
            
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleAddMedia}
              className="cursor-pointer"
            />
            
            <div className="flex space-x-2">
              <Button onClick={() => setShowAddMedia(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Preview Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedMedia?.name}</DialogTitle>
              <Button onClick={() => setSelectedMedia(null)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="max-h-96 flex items-center justify-center">
            {selectedMedia?.type === 'image' ? (
              <img
                src={selectedMedia.data}
                alt={selectedMedia.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : selectedMedia ? (
              <video
                src={selectedMedia.data}
                controls
                className="max-w-full max-h-full"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
