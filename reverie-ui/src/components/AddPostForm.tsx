import React, { SetStateAction } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useSetAtom, useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import FormControl from 'react-bootstrap/FormControl'

import httpService from '../services/http'
import { userKeys } from '../services/queryKeyFactory'
import { LoginType, LoginSchema } from '../schema/schema'

interface Props {
  show: boolean
  onHide: () => void
  setShow: React.Dispatch<SetStateAction<boolean>>
}

const AddPostForm = ({ show, onHide }: Props) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: httpService.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })

      toast.success(data?.message)
      reset()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
    },
  })

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
      title: '',
      description: '',
      entry: '',
    },
  })

  const onSubmit = (input: LoginType) => {
    mutation.mutate(input)
  }

  const fieldStateTitle = getFieldState('title')

  const fieldStateDescription = getFieldState('description')

  const fieldStateEntry = getFieldState('entry')

  return (
    <>
      <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                placeholder="Enter post title"
                {...register('title', { required: true })}
                aria-invalid={fieldStateTitle.invalid && fieldStateTitle.isDirty}
                className={`${errors.title?.message ? 'is-invalid' : ''} `}
              />
              <FormControl.Feedback type="invalid">
                {fieldStateTitle?.error?.message}
              </FormControl.Feedback>
            </label>
            <label htmlFor="description">
              Description
              <input
                type="text"
                id="description"
                placeholder="Enter description"
                {...register('description', { required: true })}
                aria-invalid={fieldStateDescription.isDirty && fieldStateDescription.invalid}
                className={`${errors.description?.message ? 'is-invalid' : ''} `}
              />
              <FormControl.Feedback type="invalid">
                {fieldStateDescription?.error?.message}
              </FormControl.Feedback>
            </label>
            <label htmlFor="entry">
              Enter Post
              <textarea
                id="description"
                placeholder="Enter your post..."
                {...register('entry', { required: true })}
                aria-invalid={fieldStateEntry.isDirty && fieldStateEntry.invalid}
                className={`${errors.entry?.message ? 'is-invalid' : ''} `}
              ></textarea>
              <FormControl.Feedback type="invalid">
                {fieldStateEntry?.error?.message}
              </FormControl.Feedback>
            </label>

            <button aria-busy={mutation.isPending}>Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddPostForm
