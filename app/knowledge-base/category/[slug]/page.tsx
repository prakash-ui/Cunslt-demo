import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { ArticleCard } from "@/components/knowledge-base/article-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getKBCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: "Category Not Found | Knowledge Base",
    }
  }

  return {
    title: `${category.name} | Knowledge Base`,
    description: category.description || `Browse articles in the ${category.name} category`,
  }
}

// Define the KBArticle interface
interface KBArticle {
  id: number
  title: string
  categoryId: number
  published: boolean
  slug: string
  is_featured: boolean
  content: string
  author_name: string
  created_at: string
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getKBCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const articles = await getKBArticles({
    categoryId: category.id,
    published: true,
  }) as KBArticle[]

  return (
    <div className="container py-8">
      <Link href="/knowledge-base">
        <Button variant="ghost" size="sm" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Base
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} showCategory={false} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-xl font-medium">No articles found</h2>
          <p className="mb-4 text-muted-foreground">There are no articles in this category yet.</p>
          <Link href="/knowledge-base">
            <Button>Browse other categories</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
async function getKBCategoryBySlug(slug: string) {
  // Simulate fetching category data from a database or API
  const categories = [
    { id: 1, slug: "technology", name: "Technology", description: "Articles about technology." },
    { id: 2, slug: "health", name: "Health", description: "Articles about health and wellness." },
    { id: 3, slug: "finance", name: "Finance", description: "Articles about financial topics." },
  ]

  // Find the category by slug
  return categories.find((category) => category.slug === slug) || null
}
async function getKBArticles({ categoryId, published }: { categoryId: number; published: boolean }) {
  // Simulate fetching articles from a database or API
  const articles = [
    { id: 1, title: "The Future of AI", categoryId: 1, published: true, slug: "future-of-ai", is_featured: false, content: "Content about AI", author_name: "John Doe", created_at: "2023-01-01" },
    { id: 2, title: "Understanding Cloud Computing", categoryId: 1, published: true, slug: "cloud-computing", is_featured: false, content: "Content about Cloud Computing", author_name: "Jane Smith", created_at: "2023-02-01" },
    { id: 3, title: "10 Tips for Healthy Living", categoryId: 2, published: true, slug: "healthy-living", is_featured: false, content: "Content about Healthy Living", author_name: "Alice Johnson", created_at: "2023-03-01" },
    { id: 4, title: "Investing for Beginners", categoryId: 3, published: true, slug: "investing-beginners", is_featured: false, content: "Content about Investing", author_name: "Bob Brown", created_at: "2023-04-01" },
    { id: 5, title: "The Rise of Quantum Computing", categoryId: 1, published: false, slug: "quantum-computing", is_featured: false, content: "Content about Quantum Computing", author_name: "Charlie Davis", created_at: "2023-05-01" },
  ]

  // Filter articles by categoryId and published status
  return articles.filter(article => article.categoryId === categoryId && article.published === published)
}

