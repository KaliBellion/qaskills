'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABELS: Record<string, string> = {
  all: 'all QASkills.sh emails',
  weekly: 'the weekly digest',
  alerts: 'new skill alerts',
};

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <CardTitle>Unsubscribe from Emails</CardTitle>
              <CardDescription>Processing your request...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'all';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your request...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. No token was provided.');
      return;
    }

    const unsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, type }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Failed to process your unsubscribe request.');
          return;
        }

        const label = TYPE_LABELS[type] || TYPE_LABELS.all;
        setStatus('success');
        setMessage(`You have been successfully unsubscribed from ${label}.`);
      } catch {
        setStatus('error');
        setMessage('Failed to process your unsubscribe request. Please try again later.');
      }
    };

    unsubscribe();
  }, [token, type]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          {status === 'loading' && (
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          )}
          {status === 'success' && (
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
          )}
          {status === 'error' && (
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          )}
          <CardTitle>Unsubscribe from Emails</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'success' && (
            <>
              <p className="text-sm text-muted-foreground">
                We're sorry to see you go. You will no longer receive marketing emails from
                QASkills.sh. You may still receive transactional emails related to your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/preferences">Manage Preferences</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="text-sm text-muted-foreground">
                If you continue to experience issues, please contact our support team at{' '}
                <a href="mailto:support@qaskills.sh" className="text-primary hover:underline">
                  support@qaskills.sh
                </a>
              </p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {status === 'success' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Why did you unsubscribe?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Help us improve by sharing your feedback (optional):
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Too many emails</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Content not relevant</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">No longer using QA skills</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Other reason</span>
              </label>
            </div>
            <Button className="mt-4" variant="outline" size="sm">
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

