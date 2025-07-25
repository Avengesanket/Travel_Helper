// src/app/blog/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/blogs')
            .then(res => setBlogs(res.data))
            .catch(err => console.error("Failed to fetch blogs", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center">Loading posts...</div>;

    // Function to get the first paragraph as a preview
    const getPreview = (content) => {
        const firstParagraph = content.find(block => block.type === 'paragraph');
        return firstParagraph ? firstParagraph.value.substring(0, 150) + '...' : 'No content preview available.';
    };

    return (
        <div className="w-4/5 mx-auto">
            <h1 className="text-4xl font-bold text-center mb-10">Travel Blogs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <Link key={blog._id} href={`/blog/${blog.slug}`}>
                        <div className="formstyle rounded-lg overflow-hidden h-full flex flex-col">
                            {/* Find first image for the card */}
                            <img 
                                src={blog.content.find(b => b.type === 'image')?.value || '/mountain.jpg'} 
                                alt={blog.title} 
                                className="w-full h-48 object-cover" 
                            />
                            <div className="p-4 flex-grow flex flex-col">
                                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                                    {getPreview(blog.content)}
                                </p>
                                <p className="text-blue-500 mt-4 font-semibold self-start">Read More →</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogListPage;