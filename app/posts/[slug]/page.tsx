import { getAllPostSlugs, getPostBySlug } from '@/lib/load-posts'

export default async function Page(props : {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)
if (!post) {
  return (
    <div>
      <h1>Post not found</h1>
      <p>{"The post you're looking for doesn't exist."}</p>
    </div>
  )
}

return (
  <article className="prose lg:prose-xl mx-auto px-4">
    <h1>{post.title}</h1>
    {post.date && (
      <div className="text-gray-600 mb-4">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
    )}
    <div 
      className="mt-8"
      dangerouslySetInnerHTML={{ __html: post.content }} 
    />
  </article>
)

}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs() 
 
  return slugs.map((slug) => ({
    slug: slug,
  }))
}


