'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LinkIcon } from 'lucide-react'

type Item = { title: string; href?: string; description?: string; internalSlug?: string }
type Category = { id: string; title: string; items: Item[] }

export default function ResourcesList({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(i =>
        i.title.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
      )
    })).filter(cat => cat.items.length)
  }, [categories, query])

  return (
    <div className="space-y-8">
      <div className="max-w-xl">
        <Input placeholder="Search resources (e.g. gsoc, leetcode, docker)" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {filtered.map(cat => (
        <section key={cat.id}>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{cat.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.items.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {item.href ? (
                      <a href={item.href} target="_blank" className="inline-flex items-center gap-2 hover:underline">
                        {item.title}
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    ) : item.internalSlug ? (
                      <Link href={`/resources/articles/${item.internalSlug}`} className="hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </CardTitle>
                  {item.description ? <CardDescription>{item.description}</CardDescription> : null}
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No matches. Try a different keyword.</p>
      ) : null}
    </div>
  )
}


