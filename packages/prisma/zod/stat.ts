import * as z from "zod"

export const statModel = z.object({
  id: z.string(),
  date: z.date(),
  packageId: z.string(),
})
