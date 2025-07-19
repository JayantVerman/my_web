import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAuthHeaders } from '@/lib/auth';
import { Star, GitFork, Code, ExternalLink, Search, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import RepoDetails from '@/components/RepoDetails';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  open_issues_count: number;
  // Custom fields from our configuration
  isEnabled?: boolean;
  displayName?: string | null;
  customDescription?: string | null;
}

export default function GitHubProjects() {
  const [searchType, setSearchType] = useState<'user' | 'repository'>('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  // Fetch configured repositories
  const { data: configs = [], isLoading: isLoadingConfigs } = useQuery<GithubConfig[]>({
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

  // Fetch repositories based on configurations
  const { data: configuredRepos = [], isLoading: isLoadingConfigured } = useQuery<GitHubRepo[]>({
    queryKey: ['github-configured-repos', configs],
    queryFn: async () => {
      // Get all configs, not just enabled ones
      if (configs.length === 0) return [];

      const repoPromises = configs.map(async (config) => {
        try {
          if (config.type === 'user') {
            const response = await fetch(`/api/github/user/${config.value}/repos`, {
              headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch user repositories');
            const repos = await response.json();
            return repos.map((repo: GitHubRepo) => ({
              ...repo,
              isEnabled: config.isEnabled,
              displayName: config.displayName,
              customDescription: config.description,
            }));
          } else {
            const [owner, repo] = config.value.split('/');
            const response = await fetch(`/api/github/repos/${owner}/${repo}`, {
              headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch repository');
            const repoData = await response.json();
            return [{
              ...repoData,
              isEnabled: config.isEnabled,
              displayName: config.displayName,
              customDescription: config.description,
            }];
          }
        } catch (error) {
          console.error(`Failed to fetch repo for config ${config.id}:`, error);
          return [];
        }
      });

      const results = await Promise.all(repoPromises);
      return results.flat().sort((a, b) => b.stargazers_count - a.stargazers_count);
    },
    enabled: configs.length > 0,
  });

  // Search results
  const { data: searchResults = [], isLoading: isLoadingSearch, error } = useQuery<GitHubRepo[]>({
    queryKey: ['github-search', searchType, searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      try {
        if (searchType === 'user') {
          const response = await fetch(`/api/github/user/${searchQuery}/repos`, {
            headers: getAuthHeaders(),
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch repositories');
          }
          return response.json();
        } else {
          const [owner, repo] = searchQuery.split('/');
          if (!owner || !repo) return [];
          
          const response = await fetch(`/api/github/repos/${owner}/${repo}`, {
            headers: getAuthHeaders(),
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch repository');
          }
          return [await response.json()];
        }
      } catch (error) {
        console.error('GitHub API error:', error);
        throw error;
      }
    },
    enabled: !!searchQuery,
    retry: 2,
    retryDelay: 1000
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <Header />
      <div className="container mx-auto py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-12 w-12 text-stone-800" />
            <h1 className="text-4xl font-bold text-stone-800">GitHub Projects</h1>
          </div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Explore my featured projects and discover more repositories from the GitHub community.
          </p>
        </div>
        
        {/* Featured Projects */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-blue-500 rounded-full" />
            <h2 className="text-2xl font-bold text-stone-800">Featured Projects</h2>
          </div>
          
          {isLoadingConfigured ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-stone-200 rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : configuredRepos.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
              <Github className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600">No featured projects configured yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configuredRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`group p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedRepo?.id === repo.id ? 'ring-2 ring-blue-500' : ''
                    } ${!repo.isEnabled ? 'opacity-60' : ''}`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          {repo.displayName || repo.name}
                        </h3>
                        {!repo.isEnabled && (
                          <Badge variant="secondary" className="mt-1">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <ExternalLink 
                        className="h-5 w-5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(repo.html_url, '_blank');
                        }}
                      />
                    </div>
                    
                    <p className="text-stone-600 line-clamp-2 mb-4 min-h-[3rem]">
                      {repo.customDescription || repo.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-stone-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forks_count}</span>
                      </div>
                      {repo.language && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Code className="h-4 w-4" />
                          <span>{repo.language}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-purple-500 rounded-full" />
            <h2 className="text-2xl font-bold text-stone-800">Search Projects</h2>
          </div>
          
          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <Select
                value={searchType}
                onValueChange={(value: 'user' | 'repository') => setSearchType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repository">Repository</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  className="pl-10"
                  placeholder={
                    searchType === 'user'
                      ? 'Enter GitHub username'
                      : 'Enter repository (owner/repo)'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{(error as Error).message}</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setSearchQuery(searchQuery)}
                >
                  Retry
                </Button>
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="text-center py-8 bg-stone-50 rounded-lg">
                <Search className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600">No repositories found for "{searchQuery}"</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="group p-6 cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => setSelectedRepo(repo)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          {repo.name}
                        </h3>
                        <ExternalLink 
                          className="h-5 w-5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(repo.html_url, '_blank');
                          }}
                        />
                      </div>
                      
                      <p className="text-stone-600 line-clamp-2 mb-4 min-h-[3rem]">
                        {repo.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-stone-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>{repo.forks_count}</span>
                        </div>
                        {repo.language && (
                          <div className="flex items-center gap-1 ml-auto">
                            <Code className="h-4 w-4" />
                            <span>{repo.language}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </Card>
        </div>

        {/* Repository Details */}
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-green-500 rounded-full" />
              <h2 className="text-2xl font-bold text-stone-800">Repository Details</h2>
            </div>
            
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 mb-2">{selectedRepo.name}</h2>
                  <p className="text-stone-600">{selectedRepo.description}</p>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open(selectedRepo.html_url, '_blank')}
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="bg-stone-50 p-4 rounded-lg">
                  <h4 className="text-sm text-stone-500 mb-1">Stars</h4>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <p className="text-xl font-semibold">{selectedRepo.stargazers_count}</p>
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <h4 className="text-sm text-stone-500 mb-1">Forks</h4>
                  <div className="flex items-center gap-2">
                    <GitFork className="h-5 w-5 text-blue-500" />
                    <p className="text-xl font-semibold">{selectedRepo.forks_count}</p>
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <h4 className="text-sm text-stone-500 mb-1">Issues</h4>
                  <p className="text-xl font-semibold">{selectedRepo.open_issues_count}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <h4 className="text-sm text-stone-500 mb-1">Language</h4>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-500" />
                    <p className="text-xl font-semibold">{selectedRepo.language}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Repository Details Query Component */}
            <RepoDetails repoFullName={selectedRepo.full_name} />
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
} 