import 'express-async-errors'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import { sanitize } from 'isomorphic-dompurify'
import mongoose from 'mongoose'

import PostModel from '../models/post'
import UserModel from '../models/user'
import schema from '../utils/schema'
import { CreatePost, UpdatePost } from '../utils/types'

const create = async (input: CreatePost, userId: string) => {
  const validData = await schema.CreatePost.spa(input)

  const user = await UserModel.findById(userId)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const foundPost = await PostModel.findOne({ title: validData.data.title })

  if (foundPost) throw Error('Cannot use the post title provided')

  const sanitizedData = {
    title: sanitize(validData.data.title),
    description: sanitize(validData.data.description),
    entry: sanitize(validData.data.entry),
    user: new mongoose.Types.ObjectId(userId),
  }

  const newPost = await PostModel.create(sanitizedData)

  if (newPost) {
    user!.posts = user!.posts.concat(new mongoose.Types.ObjectId(newPost?.id))

    await user?.save()

    return newPost
  }
}
const updatePost = async (input: UpdatePost, id: string) => {
  const validData = await schema.UpdatePost.spa(input)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const foundPost = await PostModel.findOne({
    title: validData?.data?.title,
  })

  if (foundPost) throw Error('Cannot use the post title provided')

  let updatePost = await PostModel.findById(id)

  updatePost!.title = sanitize(validData?.data?.title)
  updatePost!.description = sanitize(validData?.data?.description)
  updatePost!.entry = sanitize(validData?.data?.entry)

  await updatePost?.save()

  return updatePost
}

const getById = async (id: string) => {
  const post = await PostModel.findById(id).populate('user', {
    id: 1,
    email: 1,
  })
  if (!post) throw Error('Post not found!')

  return {
    post,
    slug: post.slug,
  }
}

const getPosts = async () => {
  const posts = await PostModel.find({})
    .populate('user')
    .sort({ updatedAt: -1 })
  if (!posts) throw Error('Cannot fetch all posts!')

  return posts
}

const deletePost = async (id: string) => {
  await PostModel.findByIdAndDelete(id)
}

const getSlug = async (id: string) => {
  const post = await PostModel.findById(id)
  if (!post) throw Error('Post not found!')

  const slug = post?.slug

  return slug
}

const postService = {
  create,
  getPosts,
  getById,
  deletePost,
  updatePost,
  getSlug,
}

export default postService
