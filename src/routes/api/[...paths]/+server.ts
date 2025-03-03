import { api } from "$lib/api/server";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request }) => api.fetch(request);
