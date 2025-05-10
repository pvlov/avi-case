import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CameraIcon, File, Upload } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

interface FilePhotoUploadProps {
  onFilesChange?: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  containerClassName?: string;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

export function FilePhotoUpload({
  onFilesChange,
  title = "Upload your file",
  subtitle = "PDF, JPG, or PNG (max 10 files)",
  containerClassName = "border-muted-foreground flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-4",
  maxFiles = 10,
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png",
}: FilePhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isPortrait, setIsPortrait] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    setIsPortrait(mediaQuery.matches);

    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    mediaQuery.addEventListener("change", handleOrientationChange);
    return () => mediaQuery.removeEventListener("change", handleOrientationChange);
  }, []);

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files);
    }
  }, [files, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    setFiles(newFiles);
  };

  const startCamera = () => {
    setCameraError(null);
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setCameraError(null);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new Blob([blob], { type: "image/jpeg" });
        setFiles((prevFiles) => [...prevFiles, file as unknown as File]);
        stopCamera();
      })
      .catch((err) => {
        console.error("Error capturing photo:", err);
        setCameraError("Failed to capture photo");
      });
  }, []);

  const videoConstraints = {
    facingMode,
    width: { ideal: isMobile ? 1280 : 1920 },
    height: { ideal: isMobile ? 720 : 1080 },
    aspectRatio: isMobile && isPortrait ? 3 / 4 : 16 / 9,
  };

  return (
    <div className={containerClassName}>
      {!isCameraActive ? (
        <>
          <Upload className="h-10 w-10" />
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={handleFileChange}
              multiple
            />
            <Button
              variant="outline"
              className="w-fit gap-2"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <File className="h-4 w-4" />
              Select Files
            </Button>
            <Button variant="outline" className="w-fit gap-2" onClick={startCamera}>
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
          </div>
          {files.length > 0 && (
            <p className="text-muted-foreground text-sm">{files.length} files selected</p>
          )}
        </>
      ) : (
        <div className="flex w-full flex-col items-center gap-2">
          <div
            className={`relative w-full ${isMobile && isPortrait ? "aspect-[3/4]" : "aspect-video"} max-h-[50vh] overflow-hidden rounded-lg bg-black`}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="absolute inset-0 h-full w-full object-cover"
              onUserMediaError={() => setCameraError("Could not access camera")}
              mirrored={facingMode === "user"}
            />
          </div>
          {cameraError && <p className="text-destructive text-sm">{cameraError}</p>}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            {isMobile && (
              <Button variant="outline" onClick={toggleCamera}>
                Switch Camera
              </Button>
            )}
            <Button onClick={capturePhoto}>
              <CameraIcon className="h-4 w-4" /> Capture
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
