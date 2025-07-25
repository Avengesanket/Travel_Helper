

import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Image from "next/image";
import { notFound } from "next/navigation";

// Fetch data on the server
async function getBlog(slug) {
    await dbConnect();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
        return null;
    }
    // Mongoose ObjectIDs are not serializable, so we convert them
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
        notFound(); // This will render the not-found.js file
    }

    return (
        <article className="w-full md:w-3/4 lg:w-2/3 mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center my-8 leading-tight">{blog.title}</h1>
            
            {/* --- CHANGE HERE: Added dark mode text color for the date --- */}
            <p className="text-center text-gray-500 dark:text-gray-200 mb-8">
                Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            {/* --- ENSURE THIS IS CORRECT: The 'dark:prose-invert' class is crucial --- */}
            <div className="max-w-none text-lg leading-relaxed text-gray-700 dark:text-white">
                {blog.content.map((block, index) => {
                    if (block.type === 'paragraph') {
                        return <p key={index}>{block.value}</p>;
                    }
                    if (block.type === 'image') {
                        return (
                            <div key={index} className="my-8">
                                <Image
                                    src={block.value}
                                    alt={`Blog image ${index + 1}`}
                                    width={800}
                                    height={450}
                                    className="rounded-lg shadow-lg object-cover w-full"
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </article>
    );
};

export default BlogPostPage;