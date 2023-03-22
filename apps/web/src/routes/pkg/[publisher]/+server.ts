import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	throw redirect(308, `/search?publisher=${params.publisher}`);
};
