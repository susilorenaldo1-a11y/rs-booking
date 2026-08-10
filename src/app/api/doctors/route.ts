import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const doctors = await prisma.doctor.findMany();
  return NextResponse.json(doctors);
}
