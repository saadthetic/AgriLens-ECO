import React, { useEffect, useState } from 'react';
import { Camera as CapCamera } from '@capacitor/camera';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { Camera, RefreshCcw, X, Zap, ZapOff, Focus } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion, AnimatePresence } from 'motion/react';
import { AgriLensLogoIcon } from './Icons';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFocusing] = useState(false);
  const [countdown] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Explicitly check and request camera permissions
        const permissionStatus = await CapCamera.checkPermissions();
        if (permissionStatus.camera !== 'granted') {
          const requestStatus = await CapCamera.requestPermissions({ permissions: ['camera'] });
          if (requestStatus.camera !== 'granted') {
            alert('Camera permission is required to scan crops.');
            onClose();
            return;
          }
        }

        const cameraPreviewOptions: CameraPreviewOptions = {
          position: 'rear',
          parent: 'camera-preview',
          className: 'camera-preview',
          toBack: true,
          disableAudio: true,
        };

        await CameraPreview.start(cameraPreviewOptions);
        setIsCameraReady(true);
        
        // Make body transparent to see camera preview
        document.body.style.backgroundColor = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';
      } catch (e) {
        console.error('Error starting camera preview', e);
        onClose();
      }
    };

    startCamera();

    return () => {
      CameraPreview.stop();
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [onClose]);

  const handleCapture = async () => {
    if (!isCameraReady) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      const result = await CameraPreview.capture({
        quality: 100
      });
      
      if (result.value) {
        onCapture(result.value);
      }
    } catch (e) {
      console.error('Error capturing image', e);
    }
  };

  const toggleFlash = async () => {
    try {
      const newFlashMode = isFlashOn ? 'off' : 'on';
      await CameraPreview.setFlashMode({ flashMode: newFlashMode });
      setIsFlashOn(!isFlashOn);
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.error('Error toggling flash', e);
    }
  };

  const flipCamera = async () => {
    try {
      await CameraPreview.flip();
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.error('Error flipping camera', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between pointer-events-none">
      {/* Camera Preview Container (Behind everything) */}
      <div id="camera-preview" className="absolute inset-0 -z-10" />

      {/* Top Controls */}
      <div className="p-6 flex justify-between items-start pointer-events-auto">
        <button 
          onClick={onClose}
          className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 transition-transform"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={toggleFlash}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 transition-transform"
          >
            {isFlashOn ? <Zap className="h-6 w-6 text-yellow-400" /> : <ZapOff className="h-6 w-6" />}
          </button>
          <button 
            onClick={flipCamera}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 transition-transform"
          >
            <RefreshCcw className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Center Feedback */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence>
          {isFocusing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="flex flex-col items-center"
            >
              <Focus className="h-16 w-16 text-emerald-400 animate-pulse" />
              <p className="text-emerald-400 font-black mt-4 tracking-widest uppercase text-sm">Focusing...</p>
            </motion.div>
          )}
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-8xl font-black text-white drop-shadow-2xl"
            >
              {countdown === 0 ? <AgriLensLogoIcon className="h-24 w-24 text-emerald-400" /> : countdown}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-10 flex flex-col items-center space-y-8 pointer-events-auto bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-white text-center mb-4">
          <p className="text-lg font-black drop-shadow-lg">AgriLens AI Vision</p>
          <p className="text-sm font-bold opacity-80 drop-shadow-md">Tap the button to analyze crop</p>
        </div>

        <button 
          onClick={handleCapture}
          className="relative flex items-center justify-center group active:scale-90 transition-transform"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full scale-125 blur-md group-hover:bg-white/30 transition-all" />
          <div className="h-24 w-24 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-2xl">
            <div className="h-20 w-20 rounded-full border-2 border-emerald-100" />
          </div>
          <Camera className="absolute h-10 w-10 text-emerald-600" />
        </button>
      </div>

      {/* Scanning Frame Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 border-2 border-emerald-400/30 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
          
          {/* Scanning line animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,1)] animate-scan" />
        </div>
      </div>
    </div>
  );
};
