
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCapturing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error('Unable to access camera. Please allow camera access or use file upload instead.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            setPreviewUrl(URL.createObjectURL(blob));
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isCapturing && !previewUrl && (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
            "bg-background hover:bg-secondary/50 transition-colors",
            "border-eco-primary/30 hover:border-eco-primary"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Upload className="h-12 w-12 mx-auto text-eco-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload an image</h3>
          <p className="text-muted-foreground mb-4">Drag and drop or click to browse</p>
          <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, WEBP</p>
        </div>
      )}

      {isCapturing && (
        <div className="relative border-2 border-eco-primary rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-full h-64 object-cover"
          ></video>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={stopCamera}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              onClick={captureImage}
              className="bg-white text-black hover:bg-white/90 rounded-full"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="relative border-2 border-eco-primary rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-80 hover:opacity-100"
            onClick={clearImage}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!isCapturing && !previewUrl && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={startCamera}
            className="border-eco-primary text-eco-primary hover:bg-eco-primary/10"
            disabled={isLoading}
          >
            <Camera className="h-5 w-5 mr-2" />
            Use Camera
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-eco-primary mb-2" />
            <p className="text-eco-primary font-medium">Analyzing image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
