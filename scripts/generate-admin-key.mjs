import { randomBytes } from "node:crypto";

const key = randomBytes(32).toString("hex");
console.log("\nGenerated ADMIN_API_KEY (add to .env.local and Vercel):\n");
console.log(key);
console.log("\n");
