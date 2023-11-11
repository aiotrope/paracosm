/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { lazy } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { postsAtom, jwtAtom } from '../atoms/store'
import { Post, User } from '../types/types'
import httpService from '../services/http'
import { postKeys, userKeys } from '../services/queryKeyFactory'

const AddPostForm = lazy(() => import('./AddPostForm'))
const UpdatePostForm = lazy(() => import('./UpdatePostForm'))

const Dashboard: React.FC = () => {
  const [show, setShow] = React.useState(false)
  const [showUpdate, setShowUpdate] = React.useState(false)
  const [postId, setPostId] = React.useState('')
  const [postToUpdate, setPostToUpdate] = React.useState('')
  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)
  const handleCloseUpdate = (): void => setShowUpdate(false)
  const handleShowUpdate = (event: any) => {
    event.preventDefault()
    setShowUpdate(true)
    const target = event.target.id

    if (typeof target === 'string') {
      setPostToUpdate(target)
    }
  }

  const queryClient = useQueryClient()

  const posts = useAtomValue(postsAtom)

  const jwt = useAtomValue(jwtAtom)

  const decoded: User = jwtDecode(jwt.access)

  // const access = httpService.getAccessToken()

  const navigate = useNavigate()

  const userPosts: Post[] = posts.filter((post) => post.user.id === decoded?.id)

  const deleteMutation: any = useMutation({
    mutationFn: async () =>
      await httpService.http({ method: 'DELETE', url: `/api/posts/${postId}` }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.details() })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success(`${postId} successfully deleted`)

      navigate('/')
    },

    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
    },
  })

  const handleClickDelete = async (event: any) => {
    event.preventDefault()

    const target = event.target.id

    if (typeof target === 'string') {
      setPostId(target)
      await deleteMutation.mutateAsync(postId)
    }
  }
  return (
    <Stack>
      <Row className="mb-2">
        <Col>
          <h2>Posts by {decoded.username} </h2>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col md={6}>
          <button onClick={handleShow}>ADD NEW POST</button>
          <AddPostForm show={show} onHide={handleClose} setShow={setShow} />
        </Col>
      </Row>
      {userPosts.map(({ id, title, description, createdAt, slug, user }) => (
        <div className="grid" key={slug}>
          <div>
            <p>
              <a href={`/posts/slug/${slug}`}>{title}</a>
            </p>
            <p>{description}</p>
            created:
            {moment(createdAt).format('LL')}
          </div>
          <div>
            <button onClick={handleShowUpdate} className="secondary" id={id}>
              UPDATE POST
            </button>
            <UpdatePostForm
              show={showUpdate}
              onHide={handleCloseUpdate}
              setShow={setShowUpdate}
              postId={postToUpdate}
              user={user}
            />
          </div>
          <div>
            <button onClick={handleClickDelete} id={id} className="secondary outline">
              DELETE POST
            </button>
          </div>
        </div>
      ))}
    </Stack>
  )
}

export default Dashboard
