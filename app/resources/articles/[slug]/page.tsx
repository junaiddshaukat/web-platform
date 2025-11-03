import { notFound } from "next/navigation";
import { resourcesArticles } from "@/lib/resources-articles";

export default function ResourceArticlePage({ params }: { params: { slug: string } }) {
  const article = resourcesArticles[params.slug];
  if (!article) return notFound();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="text-muted-foreground">Interview experience</p>
      </div>

      {/* Render provided HTML from the sheet export */}
      <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.html }} />
    </div>
  );
}


