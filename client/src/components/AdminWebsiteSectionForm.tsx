import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertWebsiteSectionSchema, type WebsiteSection, type InsertWebsiteSection } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Layout, Type, Image, MousePointer, Hash, Eye, EyeOff } from "lucide-react";

interface AdminWebsiteSectionFormProps {
  section?: WebsiteSection;
  onClose: () => void;
}

export default function AdminWebsiteSectionForm({ section, onClose }: AdminWebsiteSectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertWebsiteSection>({
    resolver: zodResolver(insertWebsiteSectionSchema),
    defaultValues: section ? {
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle || "",
      content: section.content || "",
      imageUrl: section.imageUrl || "",
      buttonText: section.buttonText || "",
      buttonUrl: section.buttonUrl || "",
      order: section.order || 0,
      isActive: section.isActive ?? true,
      sectionType: section.sectionType,
      customData: section.customData || "",
    } : {
      sectionKey: "",
      title: "",
      subtitle: "",
      content: "",
      imageUrl: "",
      buttonText: "",
      buttonUrl: "",
      order: 0,
      isActive: true,
      sectionType: "custom",
      customData: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWebsiteSection) => {
      const method = section ? "PUT" : "POST";
      const url = section ? `/api/website-sections/${section.id}` : "/api/website-sections";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Website section ${section ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/website-sections"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${section ? "update" : "create"} website section`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertWebsiteSection) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTypes = [
    { value: "hero", label: "Hero Section" },
    { value: "about", label: "About Section" },
    { value: "services", label: "Services Section" },
    { value: "cta", label: "Call to Action" },
    { value: "custom", label: "Custom Section" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          {section ? "Edit Website Section" : "Add Website Section"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="sectionKey">Section Key</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="sectionKey"
                    {...form.register("sectionKey")}
                    placeholder="unique-section-key"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.sectionKey && (
                  <p className="text-sm text-red-500">{form.formState.errors.sectionKey.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Section title"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  {...form.register("subtitle")}
                  placeholder="Section subtitle (optional)"
                />
              </div>

              <div>
                <Label htmlFor="sectionType">Section Type</Label>
                <Select
                  value={form.watch("sectionType")}
                  onValueChange={(value) => form.setValue("sectionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.sectionType && (
                  <p className="text-sm text-red-500">{form.formState.errors.sectionType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...form.register("order", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) => form.setValue("isActive", checked)}
                />
                <Label htmlFor="isActive" className="flex items-center gap-2">
                  {form.watch("isActive") ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Inactive
                    </>
                  )}
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="imageUrl"
                    {...form.register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <div className="relative">
                  <MousePointer className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="buttonText"
                    {...form.register("buttonText")}
                    placeholder="Click me"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonUrl">Button URL</Label>
                <Input
                  id="buttonUrl"
                  {...form.register("buttonUrl")}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="customData">Custom Data (JSON)</Label>
                <Textarea
                  id="customData"
                  {...form.register("customData")}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Section content..."
              rows={6}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : section ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}