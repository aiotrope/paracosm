import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom, useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Stack from 'react-bootstrap/Stack'
import FormControl from 'react-bootstrap/FormControl'

import httpService from '../services/http'
import { userKeys } from '../services/queryKeyFactory'
import { LoginType, LoginSchema } from '../schema/schema'
import { jwtAtom } from '../atoms/user'

const Login: React.FC = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const setJwt = useSetAtom(jwtAtom)

  const jwt = useAtomValue(jwtAtom)

  const mutation = useMutation({
    mutationFn: httpService.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      setJwt((currentValue) => ({
        ...currentValue,
        access: data.access,
        refresh: data.refresh,
      }))
      toast.success(data?.message)
      reset()
      navigate('/dashboard')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
    },
  })

  console.log(jwt.access)

  const {
    register,
    reset,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (input: LoginType) => {
    mutation.mutate(input)
  }

  const fieldStateEmail = getFieldState('email')

  const fieldStatePassword = getFieldState('password')

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
              {...register('email', { required: true })}
              aria-invalid={fieldStateEmail.invalid && fieldStateEmail.isDirty}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
            />
            <FormControl.Feedback type="invalid">
              {fieldStateEmail?.error?.message}
            </FormControl.Feedback>
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register('password', { required: true })}
              aria-invalid={fieldStatePassword.isDirty && fieldStatePassword.invalid}
              className={`${errors.password?.message ? 'is-invalid' : ''} `}
            />
            <FormControl.Feedback type="invalid">
              {fieldStatePassword?.error?.message}
            </FormControl.Feedback>
          </label>
        </div>

        <button aria-busy={mutation.isPending}>Submit</button>
      </form>
      <small>
        Need an account? <Link to={'/signup'}>Signup to Reverie</Link>
      </small>
    </Stack>
  )
}

export default Login
