import * as z from "zod"

export const packageTagModel = z.object({
  packageId: z.string(),
  tagId: z.string(),
})
