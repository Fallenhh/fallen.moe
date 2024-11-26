import Link from 'next/link'
import { getAllPosts } from '@/lib/load-posts'


const posts = getAllPosts()

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8 md:p-20">
      <main className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-100 pb-8 last:border-0">
              <Link 
                href={`/posts/${post.slug}`}
                className="block hover:text-blue-500 transition-all"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {post.title}
                </h2>
                {post.date && (
                  <time 
                    dateTime={post.date}
                    className="text-sm text-gray-500"
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </Link>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-600">No posts found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
