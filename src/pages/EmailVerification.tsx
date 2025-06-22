import { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmailVerification = () => {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Extract token from URL search params if not in path params
      const searchParams = new URLSearchParams(location.search);
      const tokenFromUrl = token || searchParams.get('token');
      const emailFromUrl = searchParams.get('email');

      if (emailFromUrl) {
        setEmail(emailFromUrl);
      }

      if (!tokenFromUrl) {
        setStatus('error');
        setMessage('Invalid verification link. No verification token found.');
        return;
      }

      try {
        // Use our custom auth verifyEmail function
        const result = await verifyEmail(tokenFromUrl);

        if (result?.verified) {
          setStatus('success');
          setMessage(result.message || 'Your email has been verified successfully!');

          toast({
            title: 'Email Verified!',
            description: 'Your account has been successfully verified. You can now log in.',
            variant: 'default',
          });
        } else {
          setStatus('error');
          setMessage('Failed to verify your email. The verification link may have expired.');

          toast({
            title: 'Verification Failed',
            description: 'There was a problem verifying your email.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may be expired or invalid.');

        toast({
          title: 'Verification Failed',
          description: error.message || 'There was a problem verifying your email.',
          variant: 'destructive',
        });
      }
    };

    verifyEmailToken();
  }, [token, location.search, toast, verifyEmail]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to resend the verification link.',
        variant: 'destructive',
      });
      return;
    }

    setResendLoading(true);
    try {
      await resendVerificationEmail(email);
      setResendSuccess(true);
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification email has been sent to your inbox.',
        variant: 'default',
      });
    } catch (err: any) {
      toast({
        title: 'Failed to Resend',
        description: err.message || 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      });
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
              <CheckCircle className="h-4 w-4 text-green-600" />
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

          {status === 'error' && (
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
};

export default EmailVerification;
