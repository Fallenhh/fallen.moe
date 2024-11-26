import { getAllPosts } from '@/lib/load-posts'
import Link from 'next/link'

type PostsByYear = {
  [year: string]: {
    title: string
    date: string
    slug: string
  }[]
}

export default async function ArchivePage() {
  const posts = await getAllPosts()
  
  // Sort posts by date and group by year
  const postsByYear = posts.reduce((acc: PostsByYear, post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push({
      title: post.title,
      date: post.date,
      slug: post.slug,
    })
    return acc
  }, {})

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Archive</h1>
      
      {sortedYears.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{year}</h2>
          <ul className="space-y-3">
            {postsByYear[year].map((post) => (
              <li key={post.slug} className="flex gap-4">
                <time className="text-gray-500 min-w-[100px]">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                <Link 
                  href={`/posts/${post.slug}`}
                  className="hover:text-gray-600 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

