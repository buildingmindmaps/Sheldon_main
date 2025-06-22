import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ResendVerification = () => {
  const { resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await resendVerificationEmail(email);
      setIsSuccess(true);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send verification email');
      toast({
        title: 'Error',
        description: error.message || 'There was a problem sending the verification email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">Resend Verification Email</h2>

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1"
              />
              {errorMessage && (
                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Email Sent!</h3>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please check your inbox and follow the instructions to verify your account.
            </p>
            <Link to="/login">
              <Button variant="outline">Return to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
