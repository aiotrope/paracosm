import 'express-async-errors'
import { Request } from 'express'
import { HydratedDocument } from 'mongoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import { sanitize } from 'isomorphic-dompurify'

import PostModel, { IPost } from '../models/post'
import schema from '../utils/schema'
import { CreatePost, UpdatePost, Post } from '../utils/types'

const create = async (req: Request, input: CreatePost) => {
  const validData = await schema.CreatePost.spa(input)

  const user = req.currentUser

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const foundPost = await PostModel.findOne({ title: validData.data.title })

  if (foundPost) throw Error('Cannot use the post title provided')

  const sanitzedData = {
    title: sanitize(validData.data.title),
    description: sanitize(validData.data.description),
    entry: sanitize(validData.data.entry),
    user: user,
  }

  const post: HydratedDocument<IPost> = new PostModel(sanitzedData)

  await post.save

  if (post) {
    user.post = user.post.concat(post)
    await user.save

    return post
  }
}
const update = async (req: Request, input: UpdatePost, id: string) => {
  const validData = await schema.UpdatePost.spa(input)

  const user = req.currentUser

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const foundPost: Post | null = await PostModel.findOne({
    title: validData?.data?.title,
  })

  if (foundPost) throw Error('Cannot use the post title provided')

  const post: Post | null = await PostModel.findById(id).populate('user', {
    id: 1,
    username: 1,
    email: 1,
    posts: 1,
    createdAt: 1,
    updatedAt: 1,
  })

  if (post?.user !== user.id) throw Error('Not allowed to update post')

  const filter = { id: id }

  const options = validData

  const updatePost: IPost | null = await PostModel.findOneAndUpdate(
    filter,
    options
  ).populate('user', {
    id: 1,
    username: 1,
    email: 1,
    posts: 1,
    createdAt: 1,
    updatedAt: 1,
  })

  return updatePost
}

const getById = async (id: string) => {
  const post: Post | null = await PostModel.findById(id).populate('user', {
    id: 1,
    username: 1,
    email: 1,
    posts: 1,
    createdAt: 1,
    updatedAt: 1,
  })
  if (!post) throw Error('Post not found!')
  return post
}

const getPosts = async () => {
  const posts: Post[] | null = await PostModel.find({}).populate('user', {
    id: 1,
    username: 1,
    email: 1,
    createdAt: 1,
    updatedAt: 1,
    posts: 1,
  })
  if (!posts) throw Error('Cannot fetch all posts!')
  return posts
}

const deletePost = async (id: string) => {
  await PostModel.findByIdAndDelete(id)
}

const postService = {
  create,
  getPosts,
  getById,
  deletePost,
  update,
}

export default postService
