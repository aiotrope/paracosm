import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

import httpService from '../services/http'
import { SignupType, SignupSchema } from '../schema/schema'

const Signup: React.FC = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: httpService.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid, isSubmitSuccessful },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
    mode: 'all',
  })

  const onSubmit = async (input: SignupType) => {
    try {
      const result = await mutateAsync(input)
      if (isSuccess && isSubmitSuccessful) {
        reset()
        toast.success(`${input.email} registered!`, { theme: 'colored' })
        return result
      }
    } catch (err) {
      // console.error(err)
      if (err instanceof Error) {
        toast.error(err.message, { theme: 'colored' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate={true}>
      <div className="grid">
        <label htmlFor="username">
          Username
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            {...register('username')}
            aria-invalid={!isValid && !isSubmitSuccessful}
          />
        </label>

        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            {...register('email')}
            aria-invalid={!isValid && !isSubmitSuccessful}
          />
        </label>
      </div>
      <div className="grid">
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            {...register('password')}
            aria-invalid={!isValid && !isSubmitSuccessful}
          />
        </label>

        <label htmlFor="confirm">
          Password confirmation
          <input
            type="confirm"
            id="confirm"
            placeholder="Repeat password"
            {...register('confirm')}
            aria-invalid={!isValid && !isSubmitSuccessful}
          />
        </label>
      </div>
      <button aria-busy={isPending}>Submit</button>
    </form>
  )
}

export default Signup
