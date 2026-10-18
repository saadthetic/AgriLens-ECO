import React, { useCallback, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isMobile = Capacitor.isNativePlatform();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleUseCamera = async () => {
    try {
      const { Camera: CapCamera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      
      // Explicitly check and request camera permissions
      const permissionStatus = await CapCamera.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        const requestStatus = await CapCamera.requestPermissions({ permissions: ['camera'] });
        if (requestStatus.camera !== 'granted') {
          alert('Camera permission is required to take photos.');
          return;
        }
      }

      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        setPreviewUrl(image.dataUrl);
        const blob = await fetch(image.dataUrl).then(res => res.blob());
        const file = new File([blob], `crop-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onImageUpload(file);
      }
    } catch (e) {
      console.error('Error taking photo', e);
      if (e instanceof Error && e.message.includes('User cancelled photos app')) {
        return;
      }
      // Using a custom modal or toast would be better, but keeping it simple for now
      console.warn("Could not access the camera. Please ensure the app has camera permissions.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-3xl transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20' : 'border-gray-200 bg-gray-50/50 dark:border-gray-700/30 dark:bg-gray-800/20'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="relative group">
            <img 
                src={previewUrl} 
                alt="Crop preview" 
                className="h-28 w-28 object-cover rounded-2xl shadow-lg border-4 border-white dark:border-gray-900 transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                <ImageIcon className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-3">
                <Upload className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Drop image here</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG or WebP</p>
          </div>
        )}
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>
       {isMobile && (
          <button
            onClick={handleUseCamera}
            disabled={isLoading}
            className={`w-full mt-4 flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
            <Camera className="mr-2 h-5 w-5" />
            Open Camera
          </button>
        )}
    </div>
  );
};
