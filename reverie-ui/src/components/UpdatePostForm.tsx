import React, { SetStateAction, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import schema from '../types/schema'
import { UpdatePost, UpdatePostResponse, PartialUser } from '../types/types'

interface Props {
  show: boolean
  onHide: () => void
  postId: string
  postTitle: string
  postDescription: string
  postEntry: string
  user: PartialUser
  setShow: React.Dispatch<SetStateAction<boolean>>
}

const UpdatePostForm = ({
  show,
  onHide,
  postId,
  postTitle,
  postDescription,
  postEntry,
  user,
}: Props) => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (formData: UpdatePost) => {
      // const access = httpService.getAccessToken()

      const { data: response } = await httpService.http<UpdatePostResponse>({
        method: 'PATCH',
        url: `/api/posts/${postId}`,
        data: formData,
      })

      return response
    },
    onSuccess: (data: UpdatePostResponse) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.details() })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })

      toast.success(data.message)
      reset()

      navigate('/')
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
    },
    /* eslint-enable-next-line @typescript-eslint/no-explicit-any */
  })

  const {
    register,
    reset,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<UpdatePost>({
    resolver: zodResolver(schema.UpdatePost),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      entry: '',
    },
  })

  useEffect(() => {
    let defaultValues: UpdatePost = {
      title: '',
      description: '',
      entry: '',
    }
    defaultValues.title = postTitle
    defaultValues.description = postDescription
    defaultValues.entry = postEntry
    reset({ ...defaultValues })
  }, [postDescription, postEntry, postTitle, reset])

  const onSubmit = async (input: UpdatePost) => {
    mutation.mutateAsync({
      title: input.title,
      description: input.description,
      entry: input.entry,
    })
  }

  const fieldStateTitle = getFieldState('title')

  const fieldStateDescription = getFieldState('description')

  const fieldStateEntry = getFieldState('entry')

  return (
    <>
      <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Post: {postTitle} by: {user.email}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder={postTitle}
              {...register('title', { required: true })}
              aria-invalid={fieldStateTitle.invalid && fieldStateTitle.isDirty}
              className={`${errors.title?.message ? 'is-invalid' : ''} `}
            />
            <FormControl.Feedback type="invalid">
              {fieldStateTitle?.error?.message}
            </FormControl.Feedback>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder={postDescription}
              {...register('description', { required: true })}
              aria-invalid={fieldStateDescription.isDirty && fieldStateDescription.invalid}
              className={`${errors.description?.message ? 'is-invalid' : ''} `}
            ></textarea>
            <FormControl.Feedback type="invalid">
              {fieldStateDescription?.error?.message}
            </FormControl.Feedback>
            <label htmlFor="entry">Enter Post</label>
            <textarea
              id="description"
              rows={7}
              placeholder={postEntry}
              {...register('entry', { required: true })}
              aria-invalid={fieldStateEntry.isDirty && fieldStateEntry.invalid}
              className={`${errors.entry?.message ? 'is-invalid' : ''} `}
            ></textarea>
            <FormControl.Feedback type="invalid">
              {fieldStateEntry?.error?.message}
            </FormControl.Feedback>

            <div className="my-3">
              <button aria-busy={mutation.isPending}>UPDATE</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UpdatePostForm
