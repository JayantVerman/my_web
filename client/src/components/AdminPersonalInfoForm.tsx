import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPersonalInfoSchema, type PersonalInfo, type InsertPersonalInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2 } from "lucide-react";

interface AdminPersonalInfoFormProps {
  personalInfo?: PersonalInfo;
  onClose: () => void;
}

export default function AdminPersonalInfoForm({ personalInfo, onClose }: AdminPersonalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPersonalInfo>({
    resolver: zodResolver(insertPersonalInfoSchema),
    defaultValues: personalInfo ? {
      fullName: personalInfo.fullName,
      title: personalInfo.title,
      bio: personalInfo.bio || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      location: personalInfo.location || "",
      profileImage: personalInfo.profileImage || "",
      resumeUrl: personalInfo.resumeUrl || "",
      linkedinUrl: personalInfo.linkedinUrl || "",
      githubUrl: personalInfo.githubUrl || "",
      twitterUrl: personalInfo.twitterUrl || "",
      websiteUrl: personalInfo.websiteUrl || "",
      yearsOfExperience: personalInfo.yearsOfExperience || 0,
      currentRole: personalInfo.currentRole || "",
      company: personalInfo.company || "",
    } : {
      fullName: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      profileImage: "",
      resumeUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      yearsOfExperience: 0,
      currentRole: "",
      company: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertPersonalInfo) => {
      const response = await apiRequest("PUT", "/api/personal-info", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Personal information updated successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/personal-info"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error saving personal info:", error);
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertPersonalInfo) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to save personal info:", error);
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {personalInfo ? "Edit Personal Information" : "Add Personal Information"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  placeholder="Your full name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="e.g., Senior Data Engineer"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="your@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  {...form.register("profileImage")}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentRole">Current Role</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentRole"
                    {...form.register("currentRole")}
                    placeholder="Your current position"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    {...form.register("company")}
                    placeholder="Your company name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  {...form.register("yearsOfExperience", { valueAsNumber: true })}
                  placeholder="5"
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  {...form.register("linkedinUrl")}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  {...form.register("githubUrl")}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  {...form.register("twitterUrl")}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                {...form.register("resumeUrl")}
                placeholder="https://example.com/resume.pdf"
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                {...form.register("websiteUrl")}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : personalInfo ? "Update" : "Create"}
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