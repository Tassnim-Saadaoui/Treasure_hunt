import type { IScannerControls } from '@zxing/browser';
import { useEffect, useRef, useState } from 'react';
import { Camera, QrCode, X } from 'lucide-react';

interface QRCodeScannerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDetected: (value: string) => void;
}

export function QRCodeScanner({ isOpen, onOpen, onClose, onDetected }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let controls: IScannerControls | undefined;
    let detected = false;
    setCameraError(null);

    const scan = async () => {
      if (!window.isSecureContext) {
        setCameraError('Le scanner nécessite une connexion HTTPS.');
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('La caméra n’est pas disponible dans ce navigateur.');
        return;
      }

      const video = videoRef.current;
      if (!video) {
        setCameraError('Le lecteur vidéo du scanner est indisponible.');
        return;
      }

      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        if (cancelled) return;
        const reader = new BrowserQRCodeReader();
        const scannerControls = await reader.decodeFromVideoDevice(
          undefined,
          video,
          (result) => {
            if (!result || cancelled || detected) return;
            const value = result.getText().trim();
            if (!value) return;
            detected = true;
            controls?.stop();
            onDetected(value);
          }
        );

        if (cancelled) scannerControls.stop();
        else controls = scannerControls;
      } catch (error) {
        if (cancelled) return;
        const errorName = error instanceof Error ? error.name : '';
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setCameraError('Accès à la caméra refusé. Autorisez la caméra puis réessayez.');
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          setCameraError('Aucune caméra n’est disponible sur cet appareil.');
        } else {
          setCameraError('Impossible de démarrer le scanner. Vérifiez les autorisations de la caméra.');
        }
      }
    };

    void scan();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [isOpen, onDetected]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-[9rem] w-full flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#00aaff] bg-[#082456]/65 px-4 py-5 text-center transition-colors hover:bg-[#0a2b61]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        aria-label="Ouvrir le scanner QR code"
      >
        <QrCode className="mb-2 h-10 w-10 text-white" strokeWidth={2.3} aria-hidden="true" />
        <span className="text-lg font-bold text-white">
          Scannez le <span className="text-[#f3294a]">QR code</span>
        </span>
        <span className="text-sm text-slate-200">pour découvrir l&apos;indice</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/85 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-scanner-title"
            className="w-full max-w-sm rounded-3xl border border-[#008fff] bg-[#071a40] p-5 shadow-[0_0_32px_rgba(0,137,255,0.25)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="qr-scanner-title" className="flex items-center gap-2 text-lg font-bold text-white">
                <Camera className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                Scanner le QR code
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Fermer le scanner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-cyan-400/40 bg-black">
              <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
            </div>
            <p className="mt-3 min-h-10 text-center text-sm text-slate-300" role="status">
              {cameraError ?? 'Placez le QR code dans le cadre. Le scan est automatique.'}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
