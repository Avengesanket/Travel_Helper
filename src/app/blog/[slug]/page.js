import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogContent from '@/components/BlogContent';

async function getBlog(slug) {
    await dbConnect();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
        return null;
    }
    return JSON.parse(JSON.stringify(blog));
}

export async function generateMetadata({ params }) {
    const blog = await getBlog(params.slug);
    if (!blog) return { title: "Not Found" };
    return {
        title: blog.title,
        description: blog.content.find(b => b.type === 'paragraph')?.value.substring(0, 160) || "A travel blog post."
    };
}

const BlogPostPage = async ({ params }) => {
    const blog = await getBlog(params.slug);

    if (!blog) {
        notFound();
    }
    const headerImage = blog.content.find(block => block.type === 'image');
    const mainContent = headerImage 
        ? blog.content.filter(block => block.value !== headerImage.value) 
        : blog.content;

    return (
        <article className="w-full max-w-3xl mx-auto px-4 py-8">
            
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                    {blog.title}
                </h1>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </header>

            {/* Display the header image */}
            {headerImage && (
                <div className="mb-8">
                    <Image
                        src={headerImage.value}
                        alt={`Header image for ${blog.title}`}
                        width={1200}
                        height={675}
                        priority 
                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                    />
                </div>
            )}
            
            <BlogContent content={mainContent} />
        </article>
    );
};

export default BlogPostPage;