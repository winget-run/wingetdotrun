import * as z from "zod"

export const packageModel = z.object({
  id: z.string(),
  wingetId: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  homepage: z.string().nullish(),
  license: z.string().nullish(),
  licenseUrl: z.string().nullish(),
  featured: z.boolean(),
  logoUrl: z.string().nullish(),
  bannerUrl: z.string().nullish(),
  publisherId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
})
