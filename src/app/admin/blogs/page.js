"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/blogs');
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`/api/blogs/${id}`);
        toast.success('Blog deleted!');
        fetchBlogs(); 
      } catch (error) {
        toast.error('Failed to delete blog.');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Manage Blogs
        </h1>
        <Link href="/admin/blogs/new" className="btn text-white font-bold py-2 px-4 rounded w-full sm:w-auto text-center">
          + Create New Blog
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 px-6 formstyle rounded-lg">
            <h3 className="text-xl font-semibold">No Blogs Found</h3>
            <p className="text-gray-500 mt-2">
              Ready to share your first story?
            </p>
            <Link href="/admin/blogs/new" className="btn text-white font-bold py-2 px-5 rounded mt-4 inline-block">
              Create Your First Blog
            </Link>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="formstyle p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* Info Section */}
              <div className="w-full sm:w-auto">
                <h2 className="text-xl font-semibold break-words">{blog.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </p>
              </div>
              
              {/* Action Buttons Section */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => router.push(`/admin/blogs/${blog._id}`)} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 sm:w-auto"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteBlog(blog._id)} 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-1/2 sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBlogsPage;