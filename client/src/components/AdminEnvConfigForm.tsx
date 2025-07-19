import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card } from './ui/card';
import { getAuthHeaders } from '@/lib/auth';

interface EnvConfig {
  GITHUB_TOKEN: string;
}

export default function AdminEnvConfigForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: envConfig, isLoading } = useQuery<EnvConfig>({
    queryKey: ['env-config'],
    queryFn: async () => {
      const response = await fetch('/api/env-config', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch environment configuration');
      }
      return response.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (config: Partial<EnvConfig>) => {
      const response = await fetch('/api/env-config', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update environment configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Environment configuration updated successfully',
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const config: Partial<EnvConfig> = {
      GITHUB_TOKEN: formData.get('GITHUB_TOKEN') as string,
    };

    updateMutation.mutate(config);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Environment Variables</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Configuration
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="GITHUB_TOKEN">GitHub Token</Label>
            <Input
              id="GITHUB_TOKEN"
              name="GITHUB_TOKEN"
              type="password"
              defaultValue={envConfig?.GITHUB_TOKEN}
              placeholder="Enter GitHub token"
              required
            />
            <p className="text-sm text-stone-600">
              Personal access token for GitHub API access. Create one at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub Settings
              </a>
            </p>
          </div>

          <div className="flex space-x-2">
            <Button type="submit">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>GitHub Token</Label>
                <span className="text-sm text-stone-600">
                  {envConfig?.GITHUB_TOKEN ? '••••••••' : 'Not set'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 