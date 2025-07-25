import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();
    const { fullName, email, password } = await req.json();

    // Validate inputs
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if the user already exists
    if (await User.findOne({ email: normalizedEmail })) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email is `admin@gmail.com` and assign the admin role
    const isAdmin = normalizedEmail === "admin@gmail.com";

    // Create and save the new user
    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin, // Set admin role if the email matches
    });

    return NextResponse.json(
      { message: "User created successfully.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user signup:", error); // Log error for debugging
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

