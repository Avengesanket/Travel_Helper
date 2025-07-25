import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import CostEstimate from "@/models/CostEstimate";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = params; // Get the estimate ID from the URL

  if (!id) {
    return NextResponse.json({ message: "Estimate ID is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const estimate = await CostEstimate.findById(id);

    if (!estimate) {
      return NextResponse.json({ message: "Estimate not found" }, { status: 404 });
    }
    
    // Security Check: Ensure the user deleting the estimate is the one who created it
    if (estimate.userId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await CostEstimate.findByIdAndDelete(id);

    return NextResponse.json({ message: "Estimate deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting estimate:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}