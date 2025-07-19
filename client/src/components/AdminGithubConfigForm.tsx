import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card } from './ui/card';
import { getAuthHeaders } from '@/lib/auth';

interface GithubConfig {
  id: number;
  type: 'user' | 'repository';
  value: string;
  displayName: string | null;
  description: string | null;
  isEnabled: boolean;
  order: number;
}

export default function AdminGithubConfigForm() {
  const [editingConfig, setEditingConfig] = useState<GithubConfig | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: configs = [], isLoading } = useQuery<GithubConfig[]>({
    queryKey: ['github-configs'],
    queryFn: async () => {
      const response = await fetch('/api/github-configs', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch GitHub configurations');
      }
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (config: Omit<GithubConfig, 'id'>) => {
      const response = await fetch('/api/github-configs', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create GitHub configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-configs'] });
      resetForm();
      toast({
        title: 'Success',
        description: 'GitHub configuration created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (config: GithubConfig) => {
      const response = await fetch(`/api/github-configs/${config.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update GitHub configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-configs'] });
      resetForm();
      toast({
        title: 'Success',
        description: 'GitHub configuration updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/github-configs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete GitHub configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-configs'] });
      toast({
        title: 'Success',
        description: 'GitHub configuration deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setEditingConfig(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const config = {
      type: formData.get('type') as 'user' | 'repository',
      value: formData.get('value') as string,
      displayName: formData.get('displayName') as string,
      description: formData.get('description') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isEnabled: formData.get('isEnabled') === 'true',
    };

    if (editingConfig) {
      updateMutation.mutate({ ...config, id: editingConfig.id });
    } else {
      createMutation.mutate(config);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={editingConfig?.type || 'repository'}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repository">Single Repository</SelectItem>
              <SelectItem value="user">User's Repositories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            {editingConfig?.type === 'user' ? 'GitHub Username' : 'Repository (owner/repo)'}
          </Label>
          <Input
            id="value"
            name="value"
            placeholder={editingConfig?.type === 'user' ? 'username' : 'owner/repo'}
            defaultValue={editingConfig?.value}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name (optional)</Label>
          <Input
            id="displayName"
            name="displayName"
            placeholder="Custom display name"
            defaultValue={editingConfig?.displayName || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Custom description"
            defaultValue={editingConfig?.description || ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={editingConfig?.order || 0}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isEnabled"
            name="isEnabled"
            defaultChecked={editingConfig?.isEnabled ?? true}
          />
          <Label htmlFor="isEnabled">Enabled</Label>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            {editingConfig ? 'Update' : 'Add'} Configuration
          </Button>
          {editingConfig && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Configurations</h3>
        {isLoading ? (
          <div>Loading...</div>
        ) : configs.length === 0 ? (
          <div className="text-stone-600">No configurations yet</div>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {config.displayName || config.value}
                      {!config.isEnabled && (
                        <span className="ml-2 text-stone-500">(Disabled)</span>
                      )}
                    </h4>
                    <p className="text-sm text-stone-600">
                      Type: {config.type === 'user' ? 'User Repositories' : 'Single Repository'}
                    </p>
                    {config.description && (
                      <p className="text-sm mt-1">{config.description}</p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingConfig(config)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this configuration?')) {
                          deleteMutation.mutate(config.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 