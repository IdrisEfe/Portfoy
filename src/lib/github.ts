export type Repository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  size: number;
  pushed_at: string;
  topics?: string[];
};

const fallback: Repository[] = [
  {
    id: 0,
    name: "The next repository",
    description: "Live GitHub projects will appear here when the API is available.",
    html_url: "https://github.com/IdrisEfe",
    homepage: null,
    language: null,
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    archived: false,
    size: 1,
    pushed_at: new Date(0).toISOString(),
  },
];

export async function getRepositories(): Promise<Repository[]> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch("https://api.github.com/users/IdrisEfe/repos?per_page=100&sort=pushed", {
      headers,
      next: { revalidate: 600 },
    });
    if (!response.ok) return fallback;
    const repos = (await response.json()) as Repository[];
    return repos.filter((repo) => !repo.archived && repo.size > 0 && !/config|dotfiles/i.test(repo.name));
  } catch {
    return fallback;
  }
}
