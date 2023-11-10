import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'
import moment from 'moment'

import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import httpService from '../services/http'
import { postKeys } from '../services/queryKeyFactory'
import { postsAtom } from '../atoms/store'

const Home: React.FC = () => {
  const [posts, setPosts] = useAtom(postsAtom)

  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const postsQuery = useQuery({
    queryKey: postKeys.details(),
    queryFn: httpService.getPosts,
  })

  useEffect(() => {
    const fetchPosts = async () => {
      if (postsQuery?.isSuccess && isMounted) {
        setPosts(postsQuery?.data)
      }
    }
    fetchPosts()
  }, [postsQuery?.data, postsQuery?.isSuccess, setPosts])

  const token = localStorage.getItem('jwtAtom')
  let ab = token ? JSON.parse(token) : null
  return (
    <Stack>
      {postsQuery.isSuccess ? (
        <>
          <h1>Posts</h1>
          <p>{ab?.access}</p>
          {posts.map(({ id, title, description, createdAt, slug }) => (
            <Row key={id}>
              <Col>
                <Link to={`/posts/slug/${slug}`}>{title}</Link>
                <p>{description}</p>
                created: {moment(createdAt).fromNow()}
              </Col>
            </Row>
          ))}
        </>
      ) : (
        ''
      )}
    </Stack>
  )
}

export default Home
