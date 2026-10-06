import NlpLab from "@/components/NlpLab";

export default function Home() {
  const repoUrl =
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
    "https://github.com/USERNAME/nlp-preprocessing-lab";

  return <NlpLab repoUrl={repoUrl} />;
}
