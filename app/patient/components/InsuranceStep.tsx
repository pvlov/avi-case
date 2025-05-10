import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, File, Upload } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

export default function InsuranceStep() {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 10) {
      alert("Maximum 10 files allowed");
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
        setFiles([...files, file as unknown as File]);
        stopCamera();
      })
      .catch((err) => {
        console.error("Error capturing photo:", err);
        setCameraError("Failed to capture photo");
      });
  }, [files]);

  const videoConstraints = {
    facingMode,
    width: { ideal: isMobile ? 1280 : 1920 },
    height: { ideal: isMobile ? 720 : 1080 },
    aspectRatio: isMobile && isPortrait ? 3 / 4 : 16 / 9,
  };

  return (
    <Tabs defaultValue="upload" className="flex h-full flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="upload" className="flex-1">
        <div className="border-muted-foreground flex h-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-4">
          {!isCameraActive ? (
            <>
              <Upload className="h-10 w-10" />
              <p className="text-muted-foreground text-sm">Upload your insurance card</p>
              <p className="text-muted-foreground text-xs">PDF, JPG, or PNG (max 10 files)</p>
              <div className="flex gap-2">
                <Input
                  id="insurance-file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  multiple
                />
                <Button
                  variant="outline"
                  className="w-fit gap-2"
                  onClick={() => document.getElementById("insurance-file")?.click()}
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
                <Button onClick={capturePhoto}>Capture</Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="manual"></TabsContent>
    </Tabs>
  );
}
