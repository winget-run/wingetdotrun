import * as z from "zod"

export const versionModel = z.object({
  id: z.string(),
  name: z.string(),
  packageId: z.string(),
})
