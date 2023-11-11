import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { sanitize } from 'isomorphic-dompurify'
import Stack from 'react-bootstrap/Stack'
import FormControl from 'react-bootstrap/FormControl'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import schema from '../types/schema'
import { _Signup, SignupResponse } from '../types/types'

const Signup: React.FC = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const mutate = useMutation({
    mutationFn: httpService.signup,
    onSuccess: (data: SignupResponse) => {
      reset()
      toast.success(`${data?.message}`)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })

      navigate('/login')
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onError: (error: any) => {
      // error handling needs refactoring
      if (error instanceof Error) toast.error(`${error.message}`)
    },
    /* eslint-enable-next-line @typescript-eslint/no-explicit-any */
  })

  const {
    register,
    reset,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<_Signup>({
    resolver: zodResolver(schema.Signup),
    mode: 'all',
  })

  const onSubmit = async (input: _Signup) => {
    const sanitizedData = {
      username: sanitize(input.username),
      email: sanitize(input.email),
      password: input.password,
      confirm: input.confirm,
    }
    const result = await mutate.mutateAsync(sanitizedData)

    return result
  }

  const fieldStateUsername = getFieldState('username')
  const fieldStateEmail = getFieldState('email')
  const fieldStatePassword = getFieldState('password')
  const fieldStateConfirm = getFieldState('confirm')

  return (
    <Stack>
      <h2>Signup for an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
        <div className="grid">
          <label htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              {...register('username')}
              aria-invalid={fieldStateUsername?.error !== undefined && fieldStateUsername.isDirty}
              className={`${errors.username?.message ? 'is-invalid' : ''} `}
              required
            />
            <FormControl.Feedback type="invalid">
              {fieldStateUsername?.error?.message}
            </FormControl.Feedback>
          </label>

          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register('email')}
              aria-invalid={fieldStateEmail?.error !== undefined && fieldStateEmail.isDirty}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
              required
            />
            <FormControl.Feedback type="invalid">
              {fieldStateEmail?.error?.message}
            </FormControl.Feedback>
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
              aria-invalid={fieldStatePassword.isDirty && fieldStatePassword?.error !== undefined}
              className={`${errors.password?.message ? 'is-invalid' : ''} `}
              required
            />
            <FormControl.Feedback type="invalid">
              {fieldStatePassword?.error?.message}
            </FormControl.Feedback>
          </label>

          <label htmlFor="confirm">
            Password confirmation
            <input
              type="password"
              id="confirm"
              placeholder="Repeat password"
              {...register('confirm')}
              aria-invalid={fieldStateConfirm.isDirty && fieldStateConfirm?.error !== undefined}
              className={`${errors.confirm?.message ? 'is-invalid' : ''} `}
              required
            />
            <FormControl.Feedback type="invalid">
              {fieldStateConfirm?.error?.message}
            </FormControl.Feedback>
          </label>
        </div>
        <button aria-busy={mutate.isPending}>Submit</button>
      </form>
      <small>
        Already have an account? <Link to={'/login'}>Login to Reverie</Link>
      </small>
    </Stack>
  )
}

export default Signup
