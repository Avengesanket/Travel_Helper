// src/app/admin/blogs/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogEditorPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [blog, setBlog] = useState({ title: '', slug: '', content: [] });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      axios.get(`/api/blogs/${id}`)
        .then(res => setBlog(res.data))
        .catch(err => toast.error('Failed to load blog post.'))
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setBlog({ ...blog, title: value, slug: slug });
    } else {
      setBlog({ ...blog, [name]: value });
    }
  };

  const handleContentChange = (index, value) => {
    const newContent = [...blog.content];
    newContent[index].value = value;
    setBlog({ ...blog, content: newContent });
  };
  
  const addContentBlock = (type) => {
    const newContent = [...blog.content, { type, value: '' }];
    setBlog({ ...blog, content: newContent });
  };

  const removeContentBlock = (index) => {
    const newContent = blog.content.filter((_, i) => i !== index);
    setBlog({ ...blog, content: newContent });
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Add a new image block with the returned URL
      const newContent = [...blog.content, { type: 'image', value: res.data.url }];
      setBlog({ ...blog, content: newContent });
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (id === 'new') {
        res = await axios.post('/api/blogs', blog);
      } else {
        res = await axios.put(`/api/blogs/${id}`, blog);
      }
      toast.success('Blog saved successfully!');
      router.push('/admin/blogs');
    } catch (err) {
      toast.error('Failed to save blog.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && id !== 'new') return <div>Loading...</div>;

  return (
    <div className="w-4/5 mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6">{id === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input type="text" name="title" id="title" value={blog.title} onChange={handleInputChange} className="w-full form-input py-2 px-3 bg-gray-100 border border-gray-500 rounded-lg" required/>
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">URL Slug</label>
          <input type="text" name="slug" id="slug" value={blog.slug} onChange={handleInputChange} className="w-full form-input py-2 px-3 bg-gray-100 border border-gray-500 rounded-lg" required/>
        </div>

        <hr />
        
        <h2 className="text-2xl font-semibold">Content</h2>
        <div className="space-y-4">
          {blog.content.map((block, index) => (
            <div key={index} className="relative p-4 border rounded-md">
              {block.type === 'paragraph' ? (
                <textarea
                  value={block.value}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  rows="5"
                  className="w-full form-textarea bg-gray-100 border border-gray-400 rounded-lg p-2"
                  placeholder="Write your paragraph here..."
                />
              ) : (
                <img src={block.value} alt="Blog content" className="w-full h-auto rounded-md object-cover" />
              )}
              <button type="button" onClick={() => removeContentBlock(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
                X
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="button" onClick={() => addContentBlock('paragraph')} className="btn text-white font-bold py-2 px-4 rounded">
            + Add Paragraph
          </button>
          
          <label className={`btn text-white font-bold py-2 px-4 rounded cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
            {isUploading ? 'Uploading...' : '+ Add Image'}
            <input type="file" onChange={handleImageUpload} className="hidden" disabled={isUploading} accept="image/*" />
          </label>
        </div>

        <hr />

        <button type="submit" disabled={loading} className="btn text-white text-lg font-bold py-3 px-8 rounded-lg">
          {loading ? 'Saving...' : 'Save Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogEditorPage;