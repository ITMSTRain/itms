import { NextResponse } from "next/server";
import { networkInterfaces } from "os";

export async function GET() {
  try {
    const nets = networkInterfaces();
    let macAddresses: string[] = [];

    // Extract MAC addresses from network interfaces
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.mac && net.mac !== "00:00:00:00:00:00") {
          macAddresses.push(net.mac);
        }
      }
    }

    return NextResponse.json({ macs: macAddresses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch MAC address" },
      { status: 500 }
    );
  }
}
