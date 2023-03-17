import * as z from "zod"

export const packageModel = z.object({
  id: z.string(),
  wingetId: z.string(),
  name: z.string(),
  description: z.string(),
  homepage: z.string(),
  license: z.string(),
  licenseUrl: z.string(),
  featured: z.boolean(),
  publisherId: z.string(),
})
