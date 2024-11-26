import Link from 'next/link'
import { getAllPosts } from '@/lib/load-posts'


const posts = getAllPosts()

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8">
      <main className="container mx-auto max-w-4xl md:px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          My Recipes
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-600"
          >
            <path d="M12 3v18M19 14l-7 7-7-7"/>
          </svg>
        </h1>
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
