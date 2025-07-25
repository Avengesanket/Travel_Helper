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
  
  if (loading && id !== 'new') return <div className="text-center p-8">Loading editor...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        {id === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Title and Slug Section --- */}
        <div className="p-6 formstyle rounded-lg space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Post Details</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2 dark:text-gray-300">Title</label>
            <input 
              type="text" name="title" id="title" value={blog.title} onChange={handleInputChange} 
              className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2 dark:text-gray-300">URL Slug</label>
            <input 
              type="text" name="slug" id="slug" value={blog.slug} onChange={handleInputChange} 
              className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
          </div>
        </div>

        {/* --- Content Editor Section --- */}
        <div className="p-6 formstyle rounded-lg space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Content Editor</h2>
          <div className="space-y-4">
            {blog.content.map((block, index) => (
              <div key={index} className="relative p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                {block.type === 'paragraph' ? (
                  <textarea
                    value={block.value}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    rows="6"
                    className="w-full form-textarea border-gray-400 rounded-lg p-2 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Write your paragraph here..."
                  />
                ) : (
                  <div className="relative w-full aspect-video">
                    <Image
                        src={block.value}
                        alt="Blog content preview"
                        fill 
                        style={{ objectFit: 'cover' }} 
                        className="rounded-md"
                    />
                  </div>
                )}
                <button type="button" onClick={() => removeContentBlock(index)} className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg text-sm">
                  ✕
                </button>
              </div>
            ))}
            {blog.content.length === 0 && <p className="text-center text-gray-500 py-4">Add your first content block below.</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button type="button" onClick={() => addContentBlock('paragraph')} className="btn w-full sm:w-auto text-white font-bold py-2 px-4 rounded">
              + Add Paragraph
            </button>
            <label className={`btn w-full sm:w-auto text-white font-bold py-2 px-4 rounded cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? 'Uploading...' : '+ Add Image'}
              <input type="file" onChange={handleImageUpload} className="hidden" disabled={isUploading} accept="image/*" />
            </label>
          </div>
        </div>

        {/* --- Final Save Button --- */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading || isUploading} className="btn text-white text-lg font-bold py-3 px-8 rounded-lg disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditorPage;