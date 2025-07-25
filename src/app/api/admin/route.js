
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FuelPrice from '@/models/FuelPrice'; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { type, price } = await req.json();

    if (!type || typeof price !== 'number' || isNaN(price)) {
      return NextResponse.json({ message: "Invalid 'type' or 'price' provided." }, { status: 400 });
    }

    const updatedFuelPrice = await FuelPrice.findOneAndUpdate(
      { type: type },
      { $set: { price: price } },
      {
        new: true,
        upsert: true
      }
    );

    return NextResponse.json(
      { message: `${type} price updated successfully.`, data: updatedFuelPrice },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating fuel price:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}