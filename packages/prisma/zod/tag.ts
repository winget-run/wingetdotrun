import * as z from "zod"

export const tagModel = z.object({
  id: z.string(),
  name: z.string(),
})
