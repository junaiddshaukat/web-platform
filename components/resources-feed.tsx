'use client'

import { useEffect, useState } from 'react'
import ResourcesList from '@/components/resources-list'

export default function ResourcesFeed() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/resources', { cache: 'no-store' })
      const data = await res.json()
      setCategories(Array.isArray(data?.categories) ? data.categories : [])
    } catch (e: any) {
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div>Loading resources…</div>
  if (error) return <div className="text-red-600">{error}</div>

  return <ResourcesList categories={categories} />
}


