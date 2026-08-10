import { NextResponse } from "next/server";
import { getQRCode, getConnectionStatus } from "@/lib/whatsapp";

export async function GET() {
  return NextResponse.json({
    status: getConnectionStatus(),
    qr: getQRCode(),
  });
}
