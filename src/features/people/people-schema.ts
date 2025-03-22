import { z } from 'zod'

export const PeopleSchema = z.object({
    firstName: z
        .string()
        .min(3, '[Zod] You must have a length of at least 3')
        .startsWith('A', "[Zod] First name must start with 'A'"),
    lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})