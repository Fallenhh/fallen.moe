import Link from 'next/link'
import { getAllPosts } from '@/lib/load-posts'


const posts = getAllPosts()

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8 md:p-20">
      <main className="container mx-auto max-w-4xl">
        <h4 className="text-2xl font-extrabold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">My Recipes</h4>
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="group"
            >
              <Link 
                href={`/posts/${post.slug}`}
                className="block p-6 h-full rounded-lg border border-gray-200 bg-white 
                         transition-all duration-300 ease-in-out
                         hover:shadow-lg hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold mb-3 group-hover:text-gray-900">
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
