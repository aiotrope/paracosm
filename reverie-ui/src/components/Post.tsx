import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import moment from 'moment'
import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import httpService from '../services/http'
import { postKeys } from '../services/queryKeyFactory'
import { postAtom } from '../atoms/store'

// import { Post } from '../types/types'

const Post: React.FC = () => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const { slug } = useParams() as any
  /* eslint-enable-next-line @typescript-eslint/no-explicit-any */

  const [post, setPost] = useAtom(postAtom)
  const postQuery = useQuery({
    queryKey: [postKeys.detail(slug), slug],
    queryFn: () => httpService.getPostSlug(slug),
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

  return (
    <Stack>
      {postQuery.isSuccess ? (
        <>
          <Row>
            <Col>
              <h2>Post</h2>
              <p>{post?.title}</p>
              <p>by: {post.user.email}</p>
              <p>created: {moment(post.createdAt).format('LL')}</p>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[gfm]}>
                {post?.entry}
              </ReactMarkdown>
            </Col>
          </Row>
        </>
      ) : (
        ''
      )}
    </Stack>
  )
}

export default Post
