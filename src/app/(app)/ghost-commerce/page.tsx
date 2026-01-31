'use client';

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GhostCommercePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
          setIsScanning(false);
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isScanning, toast]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            setScannedData(code.data);
            setIsScanning(false);
            toast({
              title: 'QR Code Scanned!',
              description: 'Transaction recorded on the Ghost Ledger.',
            });
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
          }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning && hasCameraPermission) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, hasCameraPermission, toast]);

  const handleStartScan = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ghost Commerce</h1>
        <p className="text-muted-foreground">
          An invisible payment layer for the unbanked, powered by QR codes and a shared community ledger.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ghost className="text-accent" />
            Community Ledger Scanner
          </CardTitle>
          <CardDescription>
            Scan a physical object's QR code to process a transaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <Button onClick={handleStartScan} className="w-full">
              Start Scanning
            </Button>
          ) : (
            <Button onClick={() => setIsScanning(false)} variant="destructive" className="w-full">
              Stop Scanning
            </Button>
          )}

          {isScanning && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                autoPlay
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              {hasCameraPermission === false && (
                 <Alert variant="destructive" className="absolute bottom-4 left-4 right-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {scannedData && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900/30 border-green-400">
              <AlertTitle>Transaction Recorded</AlertTitle>
              <AlertDescription>
                <p>The following data was sent to the Ghost Ledger:</p>
                <pre className="mt-2 w-full rounded-md bg-muted p-2 text-xs">
                  <code>{scannedData}</code>
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
