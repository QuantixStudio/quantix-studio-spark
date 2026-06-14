export async function compressImage(
  file: File,
  maxSizeMB: number = 3
): Promise<File> {
  // If image is already small enough, return as-is to preserve quality
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Increased maxDimension from 800px to 2400px for high-res displays
        const maxDimension = 2400;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        // Use high-quality image smoothing
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Preserve original image format
        const mimeType = file.type || "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Compression failed"));
            }
          },
          mimeType,
          0.95 // Increased quality from 0.85 to 0.95 (95%)
        );
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}
