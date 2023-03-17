import * as z from "zod"

export const publisherModel = z.object({
  id: z.string(),
  name: z.string(),
})
