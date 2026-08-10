import { NextResponse } from "next/server";
import { processReminders } from "@/lib/scheduler";

export async function POST() {
  try {
    const result = await processReminders();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await processReminders();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
