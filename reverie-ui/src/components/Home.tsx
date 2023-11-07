import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import httpService from '../services/http'
import { postKeys } from '../services/queryKeyFactory'
import { postsAtom } from '../atoms/store'
// import { User } from '../types/types'

const Home: React.FC = () => {
  const [posts, setPosts] = useAtom(postsAtom)

  const postsQuery = useQuery({
    queryKey: postKeys.details(),
    queryFn: httpService.getPosts,
  })

  if (postsQuery.isSuccess) {
    setPosts(postsQuery.data)
  }

  return (
    <Stack>
      <h1>Posts</h1>
      {posts.map(({ id, title, description }) => (
        <Row key={id}>
          <Col>
            <p>{title}</p>
            <small>{description}</small>
            <br />
            by:
          </Col>
        </Row>
      ))}
    </Stack>
  )
}

export default Home
