import { useState, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onChange(data.imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex items-center gap-2 mb-2">
        <Button
          type="button"
          variant={useUrl ? "outline" : "default"}
          onClick={() => setUseUrl(false)}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload
        </Button>
        <Button
          type="button"
          variant={useUrl ? "default" : "outline"}
          onClick={() => setUseUrl(true)}
          className="flex items-center gap-2"
        >
          <Link size={16} />
          URL
        </Button>
      </div>

      {useUrl ? (
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>
            {value && (
              <img
                src={value}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            )}
          </div>
        </div>
      )}

      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview"
            className="max-w-xs rounded shadow-sm"
          />
        </div>
      )}
    </div>
  );
} 