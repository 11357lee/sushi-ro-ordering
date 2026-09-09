/**
 * Ordering + admin smoke tests — run against local or production.
 * Usage: node scripts/order-smoke-tests.mjs [baseUrl]
 * Env: ADMIN_API_KEY (required for admin tests)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

function loadAdminKey() {
  if (process.env.ADMIN_API_KEY) return process.env.ADMIN_API_KEY.trim();
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const raw = readFileSync(envPath, "utf8");
    const match = raw.match(/^ADMIN_API_KEY=(.*)$/m);
    if (match) return match[1].trim();
  } catch {
    /* ignore */
  }
  return "";
}

const ADMIN_KEY = loadAdminKey();
const results = [];
let failCount = 0;

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  failCount++;
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function timedFetch(url, opts = {}, label = "") {
  const start = performance.now();
  let res;
  let body;
  try {
    res = await fetch(url, opts);
    const text = await res.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    return { ok: false, status: 0, body: null, ms, error: err.message, label };
  }
  const ms = Math.round(performance.now() - start);
  return { ok: res.ok, status: res.status, body, ms, error: null, label };
}

function defaultExtras(overrides = {}) {
  return {
    cutlery: false,
    cutleryQuantity: 0,
    extraWasabi: false,
    extraGinger: false,
    extraSoySauce: false,
    noWasabi: false,
    noGinger: false,
    noSoySauce: false,
    specialInstructions: "",
    ...overrides,
  };
}

function makeItem(menuItem, overrides = {}) {
  return {
    cartId: crypto.randomUUID(),
    menuItemId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    quantity: overrides.quantity ?? 1,
    sectionSlug: menuItem.section?.slug ?? menuItem.sectionSlug ?? "menu",
    sectionName: menuItem.section?.name ?? "Menu",
    accentColor: menuItem.section?.accent_color ?? "#1a1a1a",
    selectedOptions: overrides.selectedOptions ?? [],
    specialRequest: overrides.specialRequest ?? "",
  };
}

async function fetchMenu() {
  const r = await timedFetch(`${BASE}/api/menu`);
  if (!r.ok) throw new Error(`menu fetch failed: ${r.status}`);
  return r.body;
}

async function createOrder(payload) {
  return timedFetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function run() {
  console.log(`\nSushi-Ro smoke tests → ${BASE}\n`);

  // ── Health / read APIs ──
  console.log("Read APIs");
  const settingsR = await timedFetch(`${BASE}/api/settings`);
  if (settingsR.ok && settingsR.body?.settings) {
    pass("GET /api/settings", `${settingsR.ms}ms`);
  } else {
    fail("GET /api/settings", `${settingsR.status} ${settingsR.error ?? ""}`);
  }

  const menuR = await timedFetch(`${BASE}/api/menu`);
  let menu;
  if (menuR.ok && menuR.body?.items?.length) {
    pass("GET /api/menu", `${menuR.body.items.length} items, ${menuR.ms}ms`);
    menu = menuR.body;
  } else {
    fail("GET /api/menu", `${menuR.status}`);
    console.log("\nCannot continue without menu.");
    process.exit(1);
  }

  const orderingDisabled = settingsR.body?.orderingDisabled;
  const settings = settingsR.body?.settings ?? {};

  // ── Validation errors ──
  console.log("\nValidation");
  const missing = await createOrder({
    firstName: "",
    lastName: "Test",
    phone: "6135550100",
    pickupType: "asap",
    pickupTime: null,
    allergyNotes: "",
    items: [],
    extras: defaultExtras(),
  });
  if (missing.status === 400) pass("reject empty required fields", "400");
  else fail("reject empty required fields", `got ${missing.status}`);

  const badJson = await timedFetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json",
  });
  if (badJson.status === 500 || badJson.status === 400) pass("reject invalid JSON", `${badJson.status}`);
  else fail("reject invalid JSON", `got ${badJson.status}`);

  // Pick sample items across menu
  const simple = menu.items.find((i) => !i.has_roll_options && (i.options?.length ?? 0) === 0);
  const withOpt = menu.items.find((i) => (i.options?.length ?? 0) > 0);
  const roll = menu.items.find((i) => i.has_roll_options);
  const gf = menu.items.find((i) => i.section?.slug === "gluten-free");
  const pricey = [...menu.items].sort((a, b) => b.price - a.price)[0];

  if (!simple) {
    fail("find simple menu item");
    process.exit(1);
  }

  const phoneBase = `613555${String(Math.floor(Math.random() * 9000) + 1000)}`;

  // ── Order scenarios ──
  console.log("\nOrder creation");

  const asapPayload = {
    firstName: "Smoke",
    lastName: "Test",
    phone: phoneBase,
    pickupType: "asap",
    pickupTime: null,
    allergyNotes: "",
    items: [makeItem(simple)],
    extras: defaultExtras(),
    saveHistory: false,
  };

  let asapOrder;
  if (orderingDisabled) {
    const disabled = await createOrder(asapPayload);
    if (disabled.status === 400) pass("ASAP blocked when ordering disabled", disabled.body?.error ?? "");
    else fail("ASAP when ordering disabled", `expected 400, got ${disabled.status}`);
  } else {
    const asap = await createOrder(asapPayload);
    if (asap.ok && asap.body?.order?.id) {
      asapOrder = asap.body.order;
      pass("ASAP single item", `order ${asapOrder.id.slice(0, 8)}… ${asap.ms}ms`);
    } else {
      fail("ASAP single item", `${asap.status} ${asap.body?.error ?? asap.error ?? ""}`);
    }
  }

  // Scheduled pickup (tomorrow 6pm Toronto approx — use ISO)
  const scheduledTime = new Date();
  scheduledTime.setDate(scheduledTime.getDate() + 1);
  scheduledTime.setHours(18, 0, 0, 0);

  const scheduled = await createOrder({
    firstName: "Scheduled",
    lastName: "Guest",
    phone: `613555${String(Math.floor(Math.random() * 9000) + 1000)}`,
    pickupType: "scheduled",
    pickupTime: scheduledTime.toISOString(),
    allergyNotes: "No sesame",
    items: [makeItem(simple, { quantity: 2 })],
    extras: defaultExtras({ cutlery: true, cutleryQuantity: 2 }),
    saveHistory: true,
  });
  if (scheduled.ok) pass("scheduled order + extras", `${scheduled.ms}ms`);
  else fail("scheduled order", `${scheduled.status} ${scheduled.body?.error ?? ""}`);

  if (withOpt) {
    const opt = withOpt.options[0];
    const optOrder = await createOrder({
      firstName: "Options",
      lastName: "Test",
      phone: `613555${String(Math.floor(Math.random() * 9000) + 1000)}`,
      pickupType: "scheduled",
      pickupTime: scheduledTime.toISOString(),
      allergyNotes: "",
      items: [
        makeItem(withOpt, {
          selectedOptions: [
            { id: opt.id, name: opt.name, price_modifier: opt.price_modifier },
          ],
          specialRequest: "Extra sauce please",
        }),
      ],
      extras: defaultExtras(),
    });
    if (optOrder.ok) pass("item with option + special request", `${optOrder.ms}ms`);
    else fail("item with option", `${optOrder.status} ${optOrder.body?.error ?? ""}`);
  }

  if (roll && roll.options?.length) {
    const rollOpt = roll.options[0];
    const rollOrder = await createOrder({
      firstName: "Roll",
      lastName: "Test",
      phone: `613555${String(Math.floor(Math.random() * 9000) + 1000)}`,
      pickupType: "scheduled",
      pickupTime: scheduledTime.toISOString(),
      allergyNotes: "",
      items: [
        makeItem(roll, {
          selectedOptions: [
            { id: rollOpt.id, name: rollOpt.name, price_modifier: rollOpt.price_modifier },
          ],
        }),
      ],
      extras: defaultExtras(),
    });
    if (rollOrder.ok) pass("roll with roll option", `${rollOrder.ms}ms`);
    else fail("roll with option", `${rollOrder.status} ${rollOrder.body?.error ?? ""}`);
  }

  // Multi-item cart
  const multiItems = [simple, gf ?? simple, pricey].map((i) => makeItem(i));
  const multi = await createOrder({
    firstName: "Multi",
    lastName: "Cart",
    phone: `613555${String(Math.floor(Math.random() * 9000) + 1000)}`,
    pickupType: "scheduled",
    pickupTime: scheduledTime.toISOString(),
    allergyNotes: "Shellfish allergy — please separate",
    items: multiItems,
    extras: defaultExtras({
      extraWasabi: true,
      extraGinger: true,
      noSoySauce: true,
      specialInstructions: "Bag separately",
    }),
    saveHistory: false,
  });
  if (multi.ok) pass("multi-item + allergy + extras", `${multiItems.length} items ${multi.ms}ms`);
  else fail("multi-item order", `${multi.status} ${multi.body?.error ?? ""}`);

  // Phone formats
  const phoneFormats = ["(613) 555-1234", "+1 613-555-1234", "6135551234"];
  for (const fmt of phoneFormats) {
    const p = await createOrder({
      firstName: "Phone",
      lastName: "Fmt",
      phone: fmt,
      pickupType: "scheduled",
      pickupTime: scheduledTime.toISOString(),
      allergyNotes: "",
      items: [makeItem(simple)],
      extras: defaultExtras(),
    });
    if (p.ok) pass(`phone format "${fmt}"`, `${p.ms}ms`);
    else fail(`phone format "${fmt}"`, `${p.status}`);
  }

  // ── Order read / track ──
  console.log("\nOrder retrieval");
  if (asapOrder) {
    const getR = await timedFetch(`${BASE}/api/orders/${asapOrder.id}`);
    if (getR.ok && getR.body?.order?.id === asapOrder.id) {
      pass("GET /api/orders/[id]", `${getR.ms}ms`);
    } else {
      fail("GET /api/orders/[id]", `${getR.status}`);
    }

    const trackR = await timedFetch(`${BASE}/api/orders/track?phone=${phoneBase}`);
    if (trackR.ok && Array.isArray(trackR.body?.orders)) {
      pass("GET /api/orders/track", `${trackR.body.orders.length} orders ${trackR.ms}ms`);
    } else {
      fail("GET /api/orders/track", `${trackR.status}`);
    }
  }

  const fakeId = await timedFetch(`${BASE}/api/orders/00000000-0000-0000-0000-000000000099`);
  if (fakeId.status === 404) pass("GET unknown order → 404");
  else fail("GET unknown order", `got ${fakeId.status}`);

  // ── Customer login ──
  console.log("\nCustomer APIs");
  const loginR = await timedFetch(`${BASE}/api/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName: "Nobody", phone: "6130000000" }),
  });
  if (loginR.status === 404 || loginR.status === 200) pass("POST /api/customers/login", `${loginR.status}`);
  else fail("POST /api/customers/login", `${loginR.status}`);

  // ── Concurrent orders (network stress) ──
  console.log("\nConcurrent orders (5 parallel)");
  const concurrent = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      createOrder({
        firstName: `Concurrent${i}`,
        lastName: "Test",
        phone: `613555${String(2000 + i)}`,
        pickupType: "scheduled",
        pickupTime: scheduledTime.toISOString(),
        allergyNotes: "",
        items: [makeItem(simple)],
        extras: defaultExtras(),
      })
    )
  );
  const concurrentOk = concurrent.filter((r) => r.ok).length;
  if (concurrentOk === 5) {
    const maxMs = Math.max(...concurrent.map((r) => r.ms));
    pass("5 parallel orders", `max ${maxMs}ms`);
  } else {
    fail("5 parallel orders", `${concurrentOk}/5 succeeded`);
  }

  // ── Admin API ──
  console.log("\nAdmin API");
  const noKey = await timedFetch(`${BASE}/api/admin`);
  if (noKey.status === 401) pass("admin without key → 401", `${noKey.ms}ms`);
  else fail("admin without key", `got ${noKey.status}`);

  if (!ADMIN_KEY) {
    fail("admin with key", "ADMIN_API_KEY not set — skip");
  } else {
    const adminGet = await timedFetch(`${BASE}/api/admin`, {
      headers: { "x-admin-key": ADMIN_KEY },
    });
    if (adminGet.ok) {
      pass("admin GET with key", `${(adminGet.body?.orders ?? []).length} orders ${adminGet.ms}ms`);
      if (adminGet.ms > 5000) {
        fail("admin GET latency", `slow: ${adminGet.ms}ms (>5s) — iPad may timeout`);
      }
    } else {
      fail("admin GET with key", `${adminGet.status} — wrong ADMIN_API_KEY on server?`);
    }

    const wrongKey = await timedFetch(`${BASE}/api/admin`, {
      headers: { "x-admin-key": "wrong-key-on-purpose" },
    });
    if (wrongKey.status === 401) pass("admin wrong key → 401");
    else fail("admin wrong key", `got ${wrongKey.status}`);

    // Accept ASAP order if we have one
    if (asapOrder && adminGet.ok) {
      const accept = await timedFetch(`${BASE}/api/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({
          action: "update_order",
          orderId: asapOrder.id,
          status: "accepted",
          prepMinutes: 15,
        }),
      });
      if (accept.ok) pass("admin accept order", `${accept.ms}ms`);
      else fail("admin accept order", `${accept.status} ${accept.body?.error ?? ""}`);

      const rejectOrder = concurrent.find((r) => r.ok)?.body?.order;
      if (rejectOrder) {
        const reject = await timedFetch(`${BASE}/api/admin`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
          body: JSON.stringify({
            action: "update_order",
            orderId: rejectOrder.id,
            status: "rejected",
            statusReason: "Smoke test reject",
          }),
        });
        if (reject.ok) pass("admin reject order", `${reject.ms}ms`);
        else fail("admin reject order", `${reject.status}`);
      }
    }

    const waitPatch = await timedFetch(`${BASE}/api/admin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ action: "update_waiting_time", waitingMinutes: 30 }),
    });
    if (waitPatch.ok) pass("admin update waiting time", `${waitPatch.ms}ms`);
    else fail("admin update waiting time", `${waitPatch.status}`);

    // Restore 15 min
    await timedFetch(`${BASE}/api/admin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ action: "update_waiting_time", waitingMinutes: 15 }),
    });
  }

  // ── Admin page HTML ──
  console.log("\nPages");
  const adminPage = await timedFetch(`${BASE}/admin`);
  if (adminPage.status === 200) pass("GET /admin page", `${adminPage.ms}ms`);
  else fail("GET /admin page", `${adminPage.status}`);

  const home = await timedFetch(`${BASE}/`);
  if (home.status === 200) pass("GET / menu page", `${home.ms}ms`);
  else fail("GET / menu page", `${home.status}`);

  // ── Summary ──
  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  console.log(`\n${"─".repeat(50)}`);
  console.log(`${passed}/${total} passed, ${failCount} failed`);
  if (failCount > 0) {
    console.log("\nFailures:");
    results.filter((r) => !r.ok).forEach((r) => console.log(`  • ${r.name}: ${r.detail}`));
    process.exit(1);
  }
  console.log("All smoke tests passed.\n");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
