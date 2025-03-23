import { z } from 'zod'

export const PersonSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3'),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
  sex: z.enum(["male", "female"]),
})

export type Person = z.infer<typeof PersonSchema>;