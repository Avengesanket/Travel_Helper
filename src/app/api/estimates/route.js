import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import CostEstimate from "@/models/CostEstimate";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const estimates = await CostEstimate.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ estimates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching estimates:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const newEstimate = new CostEstimate({
      ...body,
      userId: session.user.id,
    });
    
    await newEstimate.save();
    return NextResponse.json({ message: "Estimate saved successfully", estimate: newEstimate }, { status: 201 });

  } catch (error) {
    console.error("Error saving estimate:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}