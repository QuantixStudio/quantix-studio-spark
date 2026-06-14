import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvatarUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
  existingAvatarUrl?: string | null;
}

export default function AvatarUploader({
  value,
  onChange,
  existingAvatarUrl,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingAvatarUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Image must be less than 2MB");
      return false;
    }

    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreview(null);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent"
          }`}
        >
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drag & drop avatar here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP • Max 2MB
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Avatar preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
