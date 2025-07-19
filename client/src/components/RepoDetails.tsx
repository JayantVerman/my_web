import { useQuery } from '@tanstack/react-query';
import { Card } from './ui/card';
import { getAuthHeaders } from '@/lib/auth';
import { Code, Users, Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface RepoDetailsProps {
  repoFullName: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export default function RepoDetails({ repoFullName }: RepoDetailsProps) {
  const [owner, repo] = repoFullName.split('/');

  const { data: readme, isLoading: isLoadingReadme } = useQuery({
    queryKey: ['github-readme', repoFullName],
    queryFn: async () => {
      const response = await fetch(`/api/github/repos/${owner}/${repo}/readme`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return 'No README available';
      const data = await response.json();
      return atob(data.content);
    },
  });

  const { data: contributors = [], isLoading: isLoadingContributors } = useQuery<Contributor[]>({
    queryKey: ['github-contributors', repoFullName],
    queryFn: async () => {
      const response = await fetch(`/api/github/repos/${owner}/${repo}/contributors`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: languages = {}, isLoading: isLoadingLanguages } = useQuery<Record<string, number>>({
    queryKey: ['github-languages', repoFullName],
    queryFn: async () => {
      const response = await fetch(`/api/github/repos/${owner}/${repo}/languages`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return {};
      return response.json();
    },
  });

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 h-full">
          <div className="flex items-center gap-2 mb-6">
            <Code className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Languages</h3>
          </div>
          
          {isLoadingLanguages ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : Object.keys(languages).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(languages).map(([language, bytes]) => {
                const percentage = (bytes / totalBytes) * 100;
                return (
                  <div key={language}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{language}</span>
                      <span className="text-stone-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-stone-600">No language information available</div>
          )}
        </Card>
      </motion.div>

      {/* Contributors */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 h-full">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Top Contributors</h3>
          </div>
          
          {isLoadingContributors ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full" />
                  <div>
                    <div className="h-4 bg-stone-200 rounded w-20 mb-1" />
                    <div className="h-3 bg-stone-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : contributors.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {contributors.slice(0, 6).map((contributor) => (
                <a
                  key={contributor.login}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{contributor.login}</div>
                    <div className="text-xs text-stone-600">
                      {contributor.contributions} contributions
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-stone-600">No contributor information available</div>
          )}
        </Card>
      </motion.div>

      {/* README */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2"
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Book className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">README</h3>
          </div>
          
          {isLoadingReadme ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-4 bg-stone-200 rounded w-5/6" />
            </div>
          ) : readme ? (
            <div className="prose prose-stone max-w-none">
              <div className="bg-stone-50 p-6 rounded-lg overflow-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap font-mono text-sm text-stone-800">
                  {readme}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-stone-600">No README available</div>
          )}
        </Card>
      </motion.div>
    </div>
  );
} 