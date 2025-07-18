import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { insertSkillSchema, type InsertSkill, type Skill } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";

interface AdminSkillFormProps {
  skill?: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminSkillForm({ skill, onClose, onSuccess }: AdminSkillFormProps) {
  const { toast } = useToast();
  const isEditing = !!skill;

  const form = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: skill?.name || "",
      icon: skill?.icon || "Code",
      color: skill?.color || "bg-blue-600",
      category: skill?.category || "data",
      isActive: skill?.isActive || true,
      order: skill?.order || 0,
    },
  });

  const skillMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const url = isEditing ? `/api/skills/${skill.id}` : "/api/skills";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to save skill");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Skill updated" : "Skill created",
        description: `The skill has been successfully ${isEditing ? "updated" : "created"}.`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error saving skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSkill) => {
    skillMutation.mutate(data);
  };

  const iconOptions = [
    { value: "Code", label: "Code" },
    { value: "Cloud", label: "Cloud" },
    { value: "Database", label: "Database" },
    { value: "Server", label: "Server" },
    { value: "GitBranch", label: "Git Branch" },
    { value: "Zap", label: "Zap" },
    { value: "BarChart3", label: "Bar Chart" },
    { value: "Snowflake", label: "Snowflake" },
    { value: "Globe", label: "Globe" },
    { value: "Cpu", label: "CPU" },
  ];

  const colorOptions = [
    { value: "bg-blue-600", label: "Blue" },
    { value: "bg-emerald-600", label: "Emerald" },
    { value: "bg-amber-600", label: "Amber" },
    { value: "bg-red-600", label: "Red" },
    { value: "bg-purple-600", label: "Purple" },
    { value: "bg-pink-600", label: "Pink" },
    { value: "bg-gray-800", label: "Gray" },
    { value: "bg-green-600", label: "Green" },
    { value: "bg-indigo-600", label: "Indigo" },
    { value: "bg-orange-600", label: "Orange" },
  ];

  const categoryOptions = [
    { value: "data", label: "Data Engineering" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "devops", label: "DevOps" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isEditing ? "Edit Skill" : "Add New Skill"}
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Skill name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    {...form.register("order", { valueAsNumber: true })}
                    placeholder="Display order"
                  />
                  {form.formState.errors.order && (
                    <p className="text-red-500 text-sm">{form.formState.errors.order.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={form.watch("icon")}
                    onValueChange={(value) => form.setValue("icon", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.icon && (
                    <p className="text-red-500 text-sm">{form.formState.errors.icon.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={form.watch("color")}
                    onValueChange={(value) => form.setValue("color", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded ${color.value} mr-2`}></div>
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.color && (
                    <p className="text-red-500 text-sm">{form.formState.errors.color.message}</p>
                  )}
                </div>
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
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) => form.setValue("isActive", !!checked)}
                />
                <Label htmlFor="isActive">Active skill</Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={skillMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {skillMutation.isPending 
                    ? (isEditing ? "Updating..." : "Creating...") 
                    : (isEditing ? "Update Skill" : "Create Skill")
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