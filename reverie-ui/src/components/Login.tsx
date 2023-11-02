import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import Stack from 'react-bootstrap/Stack'
import FormControl from 'react-bootstrap/FormControl'
// import axios from 'axios'

import httpService from '../services/http'
import { userKeys } from '../services/queryKeyFactory'
import { LoginType, LoginSchema } from '../schema/schema'

const Login: React.FC = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: httpService.login,
    onSuccess: (data, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      toast.success(data?.message)
      reset()
      console.log('LOGIN', data)
      console.log('LOGIN', context)
    },
    onError: (error, context) => {
      toast.error(`${error.message}: ${context}`)
    },
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    mode: 'all',
  })

  const onSubmit = (input: LoginType) => {
    mutation.mutate(input)
  }

  return (
    <Stack>
      <h2>Signup for an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
        <div className="grid">
          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register('email')}
              aria-invalid={!errors.email?.message && isDirty ? 'false' : 'true'}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.email?.message && (
              <FormControl.Feedback type="invalid">{errors.email?.message}</FormControl.Feedback>
            )}
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register('password')}
              aria-invalid={!errors.password?.message && isDirty ? 'false' : 'true'}
              className={`${errors.password?.message ? 'is-invalid' : ''} `}
              required
            />
            {errors.password?.message && (
              <FormControl.Feedback type="invalid">{errors.password?.message}</FormControl.Feedback>
            )}
          </label>
        </div>

        <button aria-busy={mutation.isPending}>Submit</button>
      </form>
    </Stack>
  )
}

export default Login
