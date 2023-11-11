import React, { SetStateAction, useEffect, useRef } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import schema from '../types/schema'
import { UpdatePost, UpdatePostResponse, PartialUser } from '../types/types'
import { postAtom } from '../atoms/store'

interface Props {
  show: boolean
  onHide: () => void
  postId: string
  user: PartialUser
  setShow: React.Dispatch<SetStateAction<boolean>>
}

const UpdatePostForm = ({ show, onHide, postId, user }: Props) => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const [post, setPost] = useAtom(postAtom)

  const postQuery = useQuery({
    queryKey: [postKeys.detail(postId), postId],
    queryFn: () => httpService.getPost(postId),
  })

  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      if (postQuery?.isSuccess && isMounted) {
        setPost(postQuery?.data)
      }
    }
    fetchPost()
  }, [postQuery?.data, postQuery?.isSuccess, setPost])

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
    defaultValues.title = post.title
    defaultValues.description = post.description
    defaultValues.entry = post.entry
    reset({ ...defaultValues })
  }, [post.description, post.entry, post.title, reset])

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
            Update Post: {post.title} by: {user.email}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} spellCheck="false" noValidate>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder={post.title}
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
              placeholder={post.description}
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
              placeholder={post.entry}
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
