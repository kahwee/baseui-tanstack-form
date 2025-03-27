import { z } from 'zod'

export const personSchema = z.object({
  firstName: z
    .string()
    .min(3, 'You must have a length of at least 3'),
  lastName: z.string().min(3, 'You must have a length of at least 3'),
  bio: z.string().optional(),
  sex: z.enum(['male', 'female']),
  role: z.string().optional(),
  instruments: z.array(z.string()).optional(),
  isOriginalMember: z.boolean().optional(),
})

export type Person = z.infer<typeof personSchema>;