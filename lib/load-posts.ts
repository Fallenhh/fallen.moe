
import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

export type Post = {
  slug: string
  title: string
  content: string
  date?: string
  [key: string]: unknown
}

export function getAllPostSlugs(): string[] {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)
  
  // Filter markdown files and remove .md extension
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''))
}
export function getAllPosts(): Array<{ slug: string; title: string; date: string }> {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const slugs = getAllPostSlugs()
  
  return slugs
    .map(slug => {
      try {
        const fullPath = path.join(postsDirectory, `${slug}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        return {
          slug,
          title: data.title,
          date: data.date,
        }
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error)
        return null
      }
    })
    .filter((post): post is { slug: string; title: string; date: string } => post !== null)
    // Sort by date in descending order (newest first)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}


export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    // Read and parse the post file
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    // Convert markdown to HTML using remark
    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()
    
    
    return {
      slug,
      content: contentHtml,
      title: data.title,
      date: data.date,
      ...data // Include any other frontmatter data
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}
