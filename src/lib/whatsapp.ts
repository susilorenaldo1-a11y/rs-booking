import { prisma } from "./prisma";

let waClient: any = null;
let qrCode: string | null = null;
let connectionStatus: "disconnected" | "connecting" | "connected" = "disconnected";

export function getQRCode(): string | null {
  return qrCode;
}

export function getConnectionStatus(): string {
  return connectionStatus;
}

export async function initializeWhatsApp(sessionId: string): Promise<void> {
  connectionStatus = "connecting";
  qrCode = null;

  try {
    const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = await import("@whiskeysockets/baileys");
    const { state, saveCreds } = await useMultiFileAuthState(`./whatsapp-auth/${sessionId}`);

    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      browser: ["RS Booking", "Chrome", "1.0.0"],
    });

    sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        qrCode = qr;
      }
      if (connection === "open") {
        connectionStatus = "connected";
        qrCode = null;
        await prisma.whatsAppSession.upsert({
          where: { sessionId },
          update: { status: "connected", credentials: JSON.stringify(state) },
          create: { sessionId, status: "connected", credentials: JSON.stringify(state) },
        });
      }
      if (connection === "close") {
        connectionStatus = "disconnected";
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          await initializeWhatsApp(sessionId);
        }
      }
    });

    sock.ev.on("creds.update", saveCreds);
    waClient = sock;
  } catch (error) {
    connectionStatus = "disconnected";
    console.error("WhatsApp init error:", error);
    throw error;
  }
}

export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  if (!waClient || connectionStatus !== "connected") {
    console.error("WhatsApp not connected");
    return false;
  }
  try {
    const jid = `${phone.replace(/[^0-9]/g, "")}@s.whatsapp.net`;
    await waClient.sendMessage(jid, { text: message });
    return true;
  } catch (error) {
    console.error("Send message error:", error);
    return false;
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  if (waClient) {
    await waClient.logout();
    waClient = null;
    connectionStatus = "disconnected";
    qrCode = null;
  }
}
