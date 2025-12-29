import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error); // This helps you see the REAL error in your terminal
    // Return an empty array so filteredImages.map() doesn't crash
    return NextResponse.json([], { status: 500 }); 
  }
}