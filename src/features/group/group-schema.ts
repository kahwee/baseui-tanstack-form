import { z } from 'zod'

export const GroupSchema = z.object({
  name: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
})