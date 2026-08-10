import { NextResponse } from "next/server";
import { getQRCode, getConnectionStatus, initializeWhatsApp, disconnectWhatsApp } from "@/lib/whatsapp";

export async function POST() {
  try {
    const sessionId = process.env.WHATSAPP_SESSION_ID || "default";
    await initializeWhatsApp(sessionId);
    const qr = getQRCode();
    return NextResponse.json({ status: getConnectionStatus(), qr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await disconnectWhatsApp();
    return NextResponse.json({ status: "disconnected" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
