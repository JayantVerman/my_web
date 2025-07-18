import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";

interface AdminProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminProjectForm({ project, onClose, onSuccess }: AdminProjectFormProps) {
  const { toast } = useToast();
  const isEditing = !!project;

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      longDescription: project?.longDescription || "",
      imageUrl: project?.imageUrl || "",
      technologies: project?.technologies || [],
      githubUrl: project?.githubUrl || "",
      liveUrl: project?.liveUrl || "",
      category: project?.category || "regular",
      featured: project?.featured || false,
    },
  });

  const projectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const url = isEditing ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to save project");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Project updated" : "Project created",
        description: `The project has been successfully ${isEditing ? "updated" : "created"}.`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    // Convert technologies string to array
    const technologiesArray = typeof data.technologies === 'string' 
      ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : data.technologies;
    
    projectMutation.mutate({
      ...data,
      technologies: technologiesArray,
    });
  };

  const technologiesValue = Array.isArray(form.watch("technologies")) 
    ? form.watch("technologies").join(", ")
    : form.watch("technologies") || "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isEditing ? "Edit Project" : "Add New Project"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Project title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Brief project description"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  {...form.register("longDescription")}
                  placeholder="Detailed project description"
                  rows={5}
                />
                {form.formState.errors.longDescription && (
                  <p className="text-red-500 text-sm">{form.formState.errors.longDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  {...form.register("imageUrl")}
                  placeholder="https://example.com/image.jpg"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={technologiesValue}
                  onChange={(e) => form.setValue("technologies", e.target.value)}
                  placeholder="Python, AWS, PostgreSQL (comma-separated)"
                />
                <p className="text-sm text-stone-600">Separate multiple technologies with commas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    {...form.register("githubUrl")}
                    placeholder="https://github.com/username/repo"
                  />
                  {form.formState.errors.githubUrl && (
                    <p className="text-red-500 text-sm">{form.formState.errors.githubUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    {...form.register("liveUrl")}
                    placeholder="https://example.com"
                  />
                  {form.formState.errors.liveUrl && (
                    <p className="text-red-500 text-sm">{form.formState.errors.liveUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", !!checked)}
                />
                <Label htmlFor="featured">Featured project</Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={projectMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {projectMutation.isPending 
                    ? (isEditing ? "Updating..." : "Creating...") 
                    : (isEditing ? "Update Project" : "Create Project")
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
