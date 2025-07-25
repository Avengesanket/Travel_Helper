import dbConnect from "@/lib/dbConnect";
import FuelPrice from "@/models/FuelPrice";

export async function GET() {
  try {
    await dbConnect();

    const fuelPrices = await FuelPrice.find({}); // Fetch all fuel prices
    return new Response(JSON.stringify({ fuelPrices }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching fuel prices:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch fuel prices" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
