import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all blogs (for public view)
export async function GET() {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching blogs', error }, { status: 500 });
  }
}

// POST a new blog (admin only)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newBlog = new Blog({ ...body, author: session.user.id });
    await newBlog.save();
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating blog', error }, { status: 500 });
  }
}