import { ErrorMessageOptions } from 'zod-error'
import { z } from 'zod'

const errorMessageOptions: ErrorMessageOptions = {
  delimiter: {
    error: ' 🔥 ',
  },
  transform: ({ errorMessage, index }) =>
    `Error #${index + 1}: ${errorMessage}`,
}

const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#%^&*+-])[a-zA-Z0-9!@#%^&*+-=]{8,30}$/

const usernameRegex = /^[a-zA-Z0-9!@#%^&*+-=]{4,}$/

const signupSchema = z
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

export default {
  errorMessageOptions,
  signupSchema,
}
