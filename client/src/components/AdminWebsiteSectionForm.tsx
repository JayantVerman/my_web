import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertWebsiteSectionSchema, type WebsiteSection, type InsertWebsiteSection } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminWebsiteSectionFormProps {
  websiteSection?: WebsiteSection;
  onClose: () => void;
}

export default function AdminWebsiteSectionForm({ websiteSection, onClose }: AdminWebsiteSectionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertWebsiteSection>({
    resolver: zodResolver(insertWebsiteSectionSchema),
    defaultValues: websiteSection ? {
      sectionKey: websiteSection.sectionKey,
      title: websiteSection.title,
      subtitle: websiteSection.subtitle || "",
      content: websiteSection.content || "",
      imageUrl: websiteSection.imageUrl || "",
      buttonText: websiteSection.buttonText || "",
      buttonUrl: websiteSection.buttonUrl || "",
      order: websiteSection.order || 0,
      isActive: websiteSection.isActive ?? true,
      sectionType: websiteSection.sectionType,
      layout: websiteSection.layout || "vertical",
      targetPage: websiteSection.targetPage || "regular",
      columns: websiteSection.columns || 1,
      gap: websiteSection.gap || "medium",
      customData: websiteSection.customData || "",
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
      layout: "vertical",
      targetPage: "regular",
      columns: 1,
      gap: "medium",
      customData: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWebsiteSection) => {
      const method = websiteSection ? "PUT" : "POST";
      const url = websiteSection ? `/api/website-sections/${websiteSection.id}` : "/api/website-sections";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Website section ${websiteSection ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/website-sections"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${websiteSection ? "update" : "create"} website section`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertWebsiteSection) => {
    await mutation.mutateAsync(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {websiteSection ? "Edit Website Section" : "Add Website Section"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sectionKey">Section Key</Label>
              <Input
                id="sectionKey"
                {...form.register("sectionKey")}
                placeholder="unique-section-key"
              />
              {form.formState.errors.sectionKey && (
                <p className="text-sm text-red-500">{form.formState.errors.sectionKey.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Section Title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                {...form.register("subtitle")}
                placeholder="Section Subtitle"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                {...form.register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                {...form.register("buttonText")}
                placeholder="Click Me"
              />
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
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                {...form.register("order", { valueAsNumber: true })}
                placeholder="0"
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
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetPage">Target Page</Label>
              <Select
                value={form.watch("targetPage")}
                onValueChange={(value) => form.setValue("targetPage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={form.watch("layout")}
                onValueChange={(value) => form.setValue("layout", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.watch("layout") === "grid" && (
              <div>
                <Label htmlFor="columns">Grid Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="4"
                  {...form.register("columns", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="gap">Gap Size</Label>
              <Select
                value={form.watch("gap")}
                onValueChange={(value) => form.setValue("gap", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gap size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="<p>Your content here...</p>"
                className="h-32"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="customData">Custom Data (JSON)</Label>
              <Textarea
                id="customData"
                {...form.register("customData")}
                placeholder="{}"
                className="h-32 font-mono"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) => form.setValue("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {websiteSection ? "Update" : "Create"} Section
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}