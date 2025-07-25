import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET a single blog by ID
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching blog', error }, { status: 500 });
  }
}

// PUT (update) a blog by ID (admin only)
export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    try {
        const body = await req.json();
        const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedBlog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating blog', error }, { status: 500 });
    }
}

// DELETE a blog by ID (admin only)
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    try {
        const deletedBlog = await Blog.findByIdAndDelete(params.id);
        if (!deletedBlog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting blog', error }, { status: 500 });
    }
}