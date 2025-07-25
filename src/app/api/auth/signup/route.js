import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = normalizedEmail === "admin@gmail.com";

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin, 
    });

    return NextResponse.json(
      { message: "User created successfully.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user signup:", error); 
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

