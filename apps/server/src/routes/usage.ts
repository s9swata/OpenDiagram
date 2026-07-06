import { Hono } from "hono";
import {
  applyCreationQuotaHeaders,
  getCreationQuotaActor,
  getCreationQuotaSnapshot,
} from "../lib/creation-quota";

export const usageRoute = new Hono();

usageRoute.get("/creation-quota", async (c) => {
  const actor = await getCreationQuotaActor(c);
  const quota = await getCreationQuotaSnapshot(actor);
  applyCreationQuotaHeaders(c, quota);
  return c.json({ quota });
});
