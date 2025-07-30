import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCardSchema, InsertCard } from '@shared/schema';
import { LocalStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCard?: any;
}

export function CardForm({ isOpen, onClose, onSuccess, editCard }: CardFormProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>(editCard?.profilePicture || null);
  const { toast } = useToast();

  const form = useForm<InsertCard>({
    resolver: zodResolver(insertCardSchema),
    defaultValues: editCard || {
      idNumber: '',
      code: '',
      firstName: '',
      surname: '',
      city: '',
      identity: '',
      gender: 'male',
      maritalStatus: 'single',
      socialPlatform: '',
      socialId: '',
      driveLink: '',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertCard) => {
    // Validation for unique ID and Code
    if (!LocalStorage.isIdNumberUnique(data.idNumber, editCard?.id)) {
      form.setError('idNumber', { message: 'ID number already exists' });
      return;
    }

    if (!LocalStorage.isCodeUnique(data.code, editCard?.id)) {
      form.setError('code', { message: 'Code already exists' });
      return;
    }

    try {
      const cardData = { ...data, profilePicture: profilePicture || undefined };
      
      if (editCard) {
        LocalStorage.updateCard(editCard.id, cardData);
        toast({
          title: "Card Updated",
          description: "Card has been updated successfully",
        });
      } else {
        LocalStorage.addCard(cardData);
        toast({
          title: "Card Added",
          description: "New card has been added successfully",
        });
      }
      
      onSuccess();
      onClose();
      form.reset();
      setProfilePicture(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save card",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCard ? 'Edit Card' : 'Add New Card'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors relative overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-sm text-muted-foreground">Tap to upload photo</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={3}
                        placeholder="001"
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={3}
                        placeholder="ABC"
                        className="uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="New York" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Passport" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="socialPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Platform</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Facebook, Instagram, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social ID (Link)</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://facebook.com/username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drive Link</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://drive.google.com/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                {editCard ? 'Update' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
