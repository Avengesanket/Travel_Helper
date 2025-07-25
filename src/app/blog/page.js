"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

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

    const getPreview = (content) => {
        const firstParagraph = content.find(block => block.type === 'paragraph');
        return firstParagraph ? firstParagraph.value.substring(0, 150) + '...' : 'No content preview available.';
    };

    const SkeletonCard = () => (
        <div className="formstyle rounded-lg overflow-hidden h-full flex flex-col animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 w-full h-48"></div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded mt-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-5/6 rounded mt-1"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/4 rounded mt-4"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">Travel Blogs</h1>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : blogs.length === 0 ? (
                 <div className="text-center py-16 px-6 formstyle rounded-lg">
                    <h3 className="text-xl font-semibold">No Blogs Published Yet</h3>
                    <p className="text-gray-500 mt-2">
                      Check back soon for new travel stories and guides!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <Link key={blog._id} href={`/blog/${blog.slug}`} legacyBehavior={false}> 
                            <div className="formstyle rounded-lg overflow-hidden h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-blue-500/20">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={blog.content.find(b => b.type === 'image')?.value || '/mountain.jpg'} 
                                        alt={blog.title} 
                                        fill 
                                        style={{ objectFit: 'cover' }} 
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold mb-2 break-words">{blog.title}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                                        {getPreview(blog.content)}
                                    </p>
                                    <p className="text-blue-500 dark:text-blue-400 mt-4 font-semibold self-start">
                                        Read More →
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogListPage;