import { NextResponse } from "next/server";
import {
  getDemoPauseUntil,
  getDemoSoldOutIds,
  getDemoWaitingTimeMinutes,
  isDemoMode,
} from "@/lib/data/demo-store";
import { MOCK_SETTINGS, MOCK_WAITING_TIME } from "@/lib/data/menu-mock";
import { fetchRestaurantSettings, fetchWaitingTime } from "@/lib/data/queries";
import { isOrderingDisabled } from "@/lib/utils";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({
      settings: {
        ...MOCK_SETTINGS,
        pause_until: getDemoPauseUntil(),
        sold_out_item_ids: getDemoSoldOutIds(),
      },
      waitingTime: { ...MOCK_WAITING_TIME, minutes: getDemoWaitingTimeMinutes() },
      orderingDisabled: isOrderingDisabled(),
    });
  }

  const [settings, waitingTime] = await Promise.all([
    fetchRestaurantSettings(),
    fetchWaitingTime(),
  ]);

  return NextResponse.json({ settings, waitingTime, orderingDisabled: isOrderingDisabled() });
}
