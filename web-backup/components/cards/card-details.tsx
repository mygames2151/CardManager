import { useState } from 'react';
import { Card } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { LocalStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, ExternalLink, Plus } from 'lucide-react';

interface CardDetailsProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onAddMedia: (cardId: string) => void;
}

export function CardDetails({ card, isOpen, onClose, onAddMedia }: CardDetailsProps) {
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState('');
  const [pendingLink, setPendingLink] = useState('');
  const { toast } = useToast();

  if (!card) return null;

  const handleLinkClick = (link: string) => {
    setPendingLink(link);
    setShowPinPrompt(true);
  };

  const verifyPinForLink = () => {
    const savedPin = LocalStorage.getPin();
    
    if (pin === savedPin) {
      window.open(pendingLink, '_blank');
      setShowPinPrompt(false);
      setPin('');
      setPendingLink('');
      toast({
        title: "Link Access Granted",
        description: "Opening link in new tab",
      });
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again",
        variant: "destructive",
      });
      setPin('');
    }
  };

  const detailRows = [
    { label: 'Code', value: card.code },
    { label: 'City', value: card.city },
    { label: 'Identity', value: card.identity },
    { label: 'Gender', value: card.gender },
    { label: 'Status', value: card.maritalStatus },
    { label: 'Social', value: card.socialPlatform },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              {card.profilePicture ? (
                <img
                  src={card.profilePicture}
                  alt={`${card.firstName} ${card.surname}`}
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <h3 className="text-xl font-semibold">{card.firstName} {card.surname}</h3>
              <p className="text-muted-foreground">ID: {card.idNumber}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              {detailRows.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-muted-foreground">{row.label}:</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
              
              {card.socialId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Social Link:</span>
                  <button
                    onClick={() => handleLinkClick(card.socialId!)}
                    className="text-blue-500 hover:underline font-medium flex items-center"
                  >
                    View Link <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </div>
              )}
              
              {card.driveLink && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drive:</span>
                  <button
                    onClick={() => handleLinkClick(card.driveLink!)}
                    className="text-blue-500 hover:underline font-medium flex items-center"
                  >
                    View Drive <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => onAddMedia(card.id)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Media
              </Button>
            </div>

            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Prompt Dialog */}
      <Dialog open={showPinPrompt} onOpenChange={setShowPinPrompt}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter PIN</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your PIN to access the link
            </p>
            
            <Input
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyPress={(e) => e.key === 'Enter' && verifyPinForLink()}
              className="text-center text-2xl"
            />
            
            <div className="flex space-x-2">
              <Button onClick={() => setShowPinPrompt(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={verifyPinForLink} className="flex-1">
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
