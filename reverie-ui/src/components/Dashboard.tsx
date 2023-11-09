import React, { lazy } from 'react'
import { useAtomValue } from 'jotai'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { postsAtom, jwtAtom } from '../atoms/store'
import { Post, User } from '../types/types'
// import httpService from '../services/http'
// import { postKeys } from '../services/queryKeyFactory'

const AddPostForm = lazy(() => import('./AddPostForm'))
const UpdatePostForm = lazy(() => import('./UpdatePostForm'))

const Dashboard: React.FC = () => {
  const [show, setShow] = React.useState(false)
  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const posts = useAtomValue(postsAtom)

  const jwt = useAtomValue(jwtAtom)

  const decoded: User = jwtDecode(jwt.access)

  const userPosts: Post[] = posts.filter((post) => post.user.id === decoded?.id)

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
      {userPosts.map(({ id, title, description, createdAt, slug, entry, user }) => (
        <div className="grid" key={id}>
          <div>
            <Link to={`/posts/slug/${slug}`}>{title}</Link>
            <p>{description}</p>
            created:
            {moment(createdAt.toString()).format('LL')}
          </div>
          <div>
            <button onClick={handleShow} className="outline">
              UPDATE POST
            </button>
            <UpdatePostForm
              show={show}
              onHide={handleClose}
              setShow={setShow}
              postId={id}
              postTitle={title}
              postDescription={description}
              postEntry={entry}
              user={user}
            />
          </div>
          <div>
            <button onClick={handleShow} className="outline">
              DELETE POST
            </button>
            <UpdatePostForm
              show={show}
              onHide={handleClose}
              setShow={setShow}
              postId={id}
              postTitle={title}
              postDescription={description}
              postEntry={entry}
              user={user}
            />
          </div>
        </div>
      ))}
    </Stack>
  )
}

export default Dashboard
