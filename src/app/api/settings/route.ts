import { NextResponse } from "next/server";
import {
  getDemoIsOpen,
  getDemoWaitingTimeMinutes,
  isDemoMode,
} from "@/lib/data/demo-store";
import { MOCK_SETTINGS, MOCK_WAITING_TIME } from "@/lib/data/menu-mock";
import { fetchRestaurantSettings, fetchWaitingTime } from "@/lib/data/queries";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({
      settings: { ...MOCK_SETTINGS, is_open: getDemoIsOpen() },
      waitingTime: { ...MOCK_WAITING_TIME, minutes: getDemoWaitingTimeMinutes() },
    });
  }

  const [settings, waitingTime] = await Promise.all([
    fetchRestaurantSettings(),
    fetchWaitingTime(),
  ]);

  return NextResponse.json({ settings, waitingTime });
}
