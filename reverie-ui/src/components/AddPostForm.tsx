import React, { SetStateAction } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import { sanitize } from 'isomorphic-dompurify'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import schema from '../types/schema'
import { CreatePost } from '../types/types'
// import { postsAtom } from '../atoms/store'

interface Props {
  show: boolean
  onHide: () => void
  setShow: React.Dispatch<SetStateAction<boolean>>
}

const AddPostForm = ({ show, onHide }: Props) => {
  const queryClient = useQueryClient()

  // const [posts, setPosts] = useAtom(postsAtom)

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: httpService.createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.details() })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })

      toast.success(data?.message)
      // setPosts(posts.concat(data?.post))
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
  } = useForm<CreatePost>({
    resolver: zodResolver(schema.CreatePost),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      entry: '',
    },
  })

  const onSubmit = async (input: CreatePost) => {
    const sanitizedData = {
      title: sanitize(input.title),
      description: sanitize(input.description),
      entry: sanitize(input.entry),
    }
    mutation.mutateAsync(sanitizedData)
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
            <label htmlFor="title">Title</label>
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter description"
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
              placeholder="Enter your post..."
              {...register('entry', { required: true })}
              aria-invalid={fieldStateEntry.isDirty && fieldStateEntry.invalid}
              className={`${errors.entry?.message ? 'is-invalid' : ''} `}
            ></textarea>
            <FormControl.Feedback type="invalid">
              {fieldStateEntry?.error?.message}
            </FormControl.Feedback>

            <div className="my-3">
              <button aria-busy={mutation.isPending}>Submit</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddPostForm
