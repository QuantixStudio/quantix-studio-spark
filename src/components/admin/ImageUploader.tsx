import { useState } from "react";
import { compressImage } from "@/lib/imageUtils";
import { toast } from "sonner";
import { Upload, X, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export interface ProjectImage {
  url: string;
  alt: string;
  is_main: boolean;
  order: number;
  file?: File;
}

interface ImageUploaderProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 2MB)`);
        continue;
      }

      validFiles.push(file);
    }

    try {
      const newImages: ProjectImage[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const compressed = await compressImage(file, 0.5);
        const url = URL.createObjectURL(compressed);

        newImages.push({
          url,
          alt: file.name.split(".")[0],
          is_main: images.length === 0 && i === 0,
          order: images.length + i,
          file: compressed,
        });
      }

      onChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) added`);
    } catch (error) {
      toast.error("Failed to process images");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const setMainImage = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_main: i === index,
    }));
    onChange(updated);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    updated.forEach((img, i) => {
      img.order = i;
    });

    onChange(updated);
  };

  const updateAlt = (index: number, alt: string) => {
    const updated = [...images];
    updated[index].alt = alt;
    onChange(updated);
  };

  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);

    if (updated.length > 0 && !updated.some((img) => img.is_main)) {
      updated[0].is_main = true;
    }

    updated.forEach((img, i) => {
      img.order = i;
    });

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-muted-foreground/25 hover:border-accent/50"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop images here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP • Max 2MB per image • Max {maxImages} images
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <Label>Images ({images.length})</Label>
          <div className="space-y-3">
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex gap-3 p-3 border rounded-lg ${
                  image.is_main ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {image.is_main && (
                    <Badge className="absolute top-1 left-1 text-xs bg-accent text-primary">
                      Main
                    </Badge>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={image.is_main}
                      onChange={() => setMainImage(index)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                      title="Set as main image"
                    />
                    <Label className="text-sm cursor-pointer" onClick={() => setMainImage(index)}>
                      Main Image
                    </Label>
                  </div>

                  <Input
                    placeholder="Alt text"
                    value={image.alt}
                    onChange={(e) => updateAlt(index, e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deleteImage(index)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
