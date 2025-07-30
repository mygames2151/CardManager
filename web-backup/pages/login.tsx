import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [pin, setPin] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetAnswer, setResetAnswer] = useState('');
  const [newPin, setNewPin] = useState('');
  const { login, resetPin } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    if (login(pin)) {
      toast({
        title: "Welcome!",
        description: "Successfully logged in",
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

  const handleReset = () => {
    if (!resetAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer to the security question",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    if (resetPin(resetAnswer, newPin)) {
      toast({
        title: "PIN Reset Successful",
        description: "Your PIN has been reset successfully",
      });
      setShowReset(false);
      setResetAnswer('');
      setNewPin('');
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Please try again",
        variant: "destructive",
      });
      setResetAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <HelpCircle className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold">Security Question</h2>
              <p className="text-muted-foreground mt-2">What use of app?</p>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter answer"
                value={resetAnswer}
                onChange={(e) => setResetAnswer(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleReset)}
                className="text-center"
              />
              
              <Input
                type="password"
                placeholder="Enter new PIN"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                onKeyPress={(e) => handleKeyPress(e, handleReset)}
                className="text-center text-2xl"
              />
              
              <Button onClick={handleReset} className="w-full bg-pink-500 hover:bg-pink-600">
                Verify & Reset
              </Button>
              
              <Button 
                onClick={() => setShowReset(false)} 
                variant="ghost" 
                className="w-full"
              >
                Back to PIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Enter PIN</h2>
            <p className="text-muted-foreground mt-2">Please enter your 4-digit PIN</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyPress={(e) => handleKeyPress(e, handleLogin)}
              className="text-center text-2xl"
            />
            
            <Button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600">
              Unlock
            </Button>
            
            <Button 
              onClick={() => setShowReset(true)} 
              variant="ghost" 
              className="w-full text-blue-500"
            >
              Reset PIN
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
