import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  FileText, 
  Mail, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut,
  Eye,
  EyeOff,
  Settings,
  Layout,
  User,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { verifyToken, logout, getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import AdminProjectForm from "@/components/AdminProjectForm";
import AdminSkillForm from "@/components/AdminSkillForm";
import AdminPersonalInfoForm from "@/components/AdminPersonalInfoForm";
import AdminWebsiteSectionForm from "@/components/AdminWebsiteSectionForm";
import type { Project, Contact, Skill, AuthUser, WebsiteSection, PersonalInfo } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [showWebsiteSectionForm, setShowWebsiteSectionForm] = useState(false);
  const [editingWebsiteSection, setEditingWebsiteSection] = useState<WebsiteSection | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const verifiedUser = await verifyToken();
      if (!verifiedUser || !verifiedUser.isAdmin) {
        console.log("Authentication failed, redirecting to login");
        setLocation("/admin");
      } else {
        console.log("Authentication successful, user:", verifiedUser);
        setUser(verifiedUser);
      }
    };
    checkAuth();
  }, [setLocation]);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/contacts", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    enabled: !!user,
  });

  const { data: websiteSections, isLoading: websiteSectionsLoading } = useQuery<WebsiteSection[]>({
    queryKey: ["/api/website-sections"],
    enabled: !!user,
  });

  const { data: personalInfo, isLoading: personalInfoLoading } = useQuery<PersonalInfo>({
    queryKey: ["/api/personal-info"],
    enabled: !!user,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markContactReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contacts/${id}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to mark contact as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact marked as read",
        description: "The contact has been marked as read.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact deleted",
        description: "The contact has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete skill");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill deleted",
        description: "The skill has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWebsiteSectionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/website-sections/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete website section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/website-sections"] });
      toast({
        title: "Website section deleted",
        description: "The website section has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting website section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setShowSkillForm(true);
  };

  const handleCloseSkillForm = () => {
    setShowSkillForm(false);
    setEditingSkill(null);
  };

  const handleEditWebsiteSection = (section: WebsiteSection) => {
    setEditingWebsiteSection(section);
    setShowWebsiteSectionForm(true);
  };

  const handleCloseWebsiteSectionForm = () => {
    setShowWebsiteSectionForm(false);
    setEditingWebsiteSection(null);
  };

  const handleClosePersonalInfoForm = () => {
    setShowPersonalInfoForm(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalProjects: projects?.length || 0,
    contactMessages: contacts?.length || 0,
    freelanceProjects: projects?.filter(p => p.category === 'freelance').length || 0,
    unreadContacts: contacts?.filter(c => !c.isRead).length || 0,
    totalSkills: skills?.length || 0,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-stone-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-stone-600">Welcome, {user.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total Projects</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalProjects}</p>
                </div>
                <FileText className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Contact Messages</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.contactMessages}</p>
                </div>
                <Mail className="text-emerald-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Freelance Projects</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.freelanceProjects}</p>
                </div>
                <Briefcase className="text-amber-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Skills</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalSkills}</p>
                </div>
                <Settings className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unreadContacts}</p>
                </div>
                <Mail className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projects Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {projects?.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{project.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{project.category}</Badge>
                          <span className="text-sm text-stone-600">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button
                  onClick={() => setShowSkillForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {skillsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {skills?.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${skill.color} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-xs font-semibold">{skill.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-stone-800">{skill.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{skill.category}</Badge>
                            <span className="text-sm text-stone-600">Order: {skill.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSkillMutation.mutate(skill.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacts Management */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {contacts?.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-lg border ${
                        contact.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-stone-800">{contact.name}</h4>
                            {!contact.isRead && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-stone-600 mb-1">{contact.email}</p>
                          <p className="text-sm text-stone-600 mb-1">{contact.subject}</p>
                          <p className="text-sm text-stone-600 line-clamp-2">{contact.message}</p>
                          <p className="text-xs text-stone-500 mt-1">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markContactReadMutation.mutate(contact.id)}
                          >
                            {contact.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Management Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Personal Info Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Info
                </CardTitle>
                <Button
                  onClick={() => setShowPersonalInfoForm(true)}
                  className="flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  {personalInfo ? "Edit" : "Add"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {personalInfoLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : personalInfo ? (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <h4 className="font-medium text-stone-800 mb-1">{personalInfo.fullName}</h4>
                    <p className="text-sm text-stone-600 mb-1">{personalInfo.title}</p>
                    <p className="text-sm text-stone-600 mb-1">{personalInfo.email}</p>
                    <p className="text-sm text-stone-600">{personalInfo.location}</p>
                  </div>
                </div>
              ) : (
                <p className="text-stone-600 text-center py-8">
                  No personal information added yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Website Sections Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Website Sections
                </CardTitle>
                <Button
                  onClick={() => setShowWebsiteSectionForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {websiteSectionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {websiteSections?.length === 0 ? (
                    <p className="text-stone-600 text-center py-8">
                      No website sections yet.
                    </p>
                  ) : (
                    websiteSections?.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-stone-800">{section.title}</h4>
                            <Badge variant={section.isActive ? "default" : "secondary"} className="text-xs">
                              {section.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-600 mb-1">{section.sectionType}</p>
                          <p className="text-sm text-stone-600">{section.sectionKey}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditWebsiteSection(section)}
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteWebsiteSectionMutation.mutate(section.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <AdminProjectForm
          project={editingProject}
          onClose={handleCloseProjectForm}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            handleCloseProjectForm();
          }}
        />
      )}

      {/* Skill Form Modal */}
      {showSkillForm && (
        <AdminSkillForm
          skill={editingSkill}
          onClose={handleCloseSkillForm}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
            handleCloseSkillForm();
          }}
        />
      )}

      {/* Personal Info Form Modal */}
      {showPersonalInfoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminPersonalInfoForm
              personalInfo={personalInfo}
              onClose={handleClosePersonalInfoForm}
            />
          </div>
        </div>
      )}

      {/* Website Section Form Modal */}
      {showWebsiteSectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminWebsiteSectionForm
              section={editingWebsiteSection}
              onClose={handleCloseWebsiteSectionForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
