import { z } from 'zod'

const passwordRegex = /^(?=.*[0-9])(?=.*[!~#%{}^&*+=-?<>€$@])[a-zA-Z0-9!~#%{}^&*+=-?<>€$@]{8,30}$/gm

const usernameRegex = /^[a-zA-Z0-9!~#%{}^&*+=-?<>€$@]{4,}$/gm

export const UserSchema = z.object({
  id: z.string().min(24),
  username: z.string().trim().regex(usernameRegex),
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const SignupSchema = z
  .object({
    username: z.string().trim().regex(usernameRegex),
    email: z.string().email(),
    password: z.string().trim().regex(passwordRegex),
    confirm: z.string().trim().min(8),
  })
  .superRefine(({ confirm, password }, ctx) => {
    if (confirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords unmatch!',
      })
    }
  })
export type User = z.infer<typeof UserSchema>

export type SignupType = z.infer<typeof SignupSchema>
