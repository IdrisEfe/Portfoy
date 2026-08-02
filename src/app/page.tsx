import { getRepositories } from "@/lib/github";
import { HomeExperience } from "@/components/home-experience";

export default async function Home() {
  const repositories = await getRepositories();
  return <HomeExperience repositories={repositories} />;
}
