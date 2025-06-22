import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Check, AlertCircle, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

export function EmailVerificationPage() {
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (email) {
      setEmail(email);
    }

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No verification token found.');
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const result = await verifyEmail(token);

        if (result?.verified) {
          setStatus('success');
          setMessage(result.message || 'Your email has been verified successfully!');

          // Check if it was already verified
          if (result.alreadyVerified) {
            setAlreadyVerified(true);
          }

          toast({
            title: 'Email Verified!',
            description: result.message || 'Your account has been verified. You can now log in.',
            variant: 'default',
          });
        } else {
          setStatus('error');
          setMessage(result?.message || 'Failed to verify your email. The verification link may have expired.');

          toast({
            title: 'Verification Failed',
            description: result?.message || 'There was a problem verifying your email.',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'An error occurred during email verification.');
      }
    };

    verifyUserEmail();
  }, [searchParams, verifyEmail, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address to resend the verification link.');
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to resend the verification link.',
        variant: 'destructive',
      });
      return;
    }

    setResendLoading(true);
    try {
      const result = await resendVerificationEmail(email);
      setResendSuccess(true);
      toast({
        title: 'Verification Email Sent',
        description: result.message || 'A new verification email has been sent to your inbox.',
        variant: 'default',
      });
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to resend verification email. Please try again.';
      setMessage(errorMsg);

      // Special handling for "already verified" error
      if (errorMsg.toLowerCase().includes('already verified')) {
        setStatus('success');
        setAlreadyVerified(true);
        setMessage('Your email has already been verified. You can log in to your account now.');

        toast({
          title: 'Already Verified',
          description: 'Your email is already verified. You can now log in to your account.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to Resend',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Email Verification</CardTitle>
          <CardDescription>Verify your email to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-center text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Verification Failed</AlertTitle>
              <AlertDescription className="text-red-700">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && !alreadyVerified && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-4">
                If you need a new verification link, enter your email address below:
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <Button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              </div>
            </div>
          )}

          {resendSuccess && (
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Email Sent</AlertTitle>
              <AlertDescription className="text-blue-700">
                A new verification email has been sent. Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === 'success' ? (
            <Button onClick={() => navigate('/login')}>
              Log In Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
