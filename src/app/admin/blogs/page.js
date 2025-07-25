"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs.');
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
    <div className="w-4/5 mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className="btn text-white font-bold py-2 px-4 rounded">
          + Create New Blog
        </Link>
      </div>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="formstyle p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => router.push(`/admin/blogs/${blog._id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </button>
              <button onClick={() => deleteBlog(blog._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogsPage;