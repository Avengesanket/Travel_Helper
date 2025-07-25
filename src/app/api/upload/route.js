import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  
  const fileBuffer = await file.arrayBuffer();
  var mime = file.type; 
  var encoding = 'base64'; 
  var base64Data = Buffer.from(fileBuffer).toString('base64');
  var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
  
  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(fileUri, {
            invalidate: true
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    const result = await uploadToCloudinary();
    
    return NextResponse.json({ url: result.secure_url }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}