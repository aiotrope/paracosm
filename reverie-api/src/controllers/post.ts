import 'express-async-errors'
import { Request, Response } from 'express'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'
import { Request as JWTRequest } from 'express-jwt'

// import PostModel from '../models/post'
import UserModel from '../models/user'
import postService from '../services/post'
import userService from '../services/user'

import { cacheMethodCalls } from '../utils/cache'

const cachedPostService = cacheMethodCalls(postService, [
  'deletePost',
  'updatePost',
  'create',
])

const cachedUserService = cacheMethodCalls(userService, [
  'create',
  'authenticateUser',
  'deleteUser',
])

const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await cachedPostService.getPosts()

    return res.status(200).json(posts)
  } catch (err) {
    if (err instanceof Error) {
      // onsole.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const getById = async (req: Request, res: Response) => {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `${id} is not valid post id!` })
  }

  try {
    const post = await cachedPostService.getById(id)

    return res.status(200).json(post)
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const create = async (req: JWTRequest, res: Response) => {
  let user = await cachedUserService.getById(req?.auth?.aud)

  try {
    let post = await cachedPostService.create(req.body, user?.id)

    return res.status(201).json({
      message: `${user?.username} created new post: ${post?.title}`,
      post: post,
    })
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const updatePost = async (req: JWTRequest, res: Response) => {
  const { id } = req.params

  const post = await cachedPostService.getById(id)

  if (post?.user?.id !== req?.auth?.aud)
    throw Error(`Not allowed to update post by ${req?.auth?.aud}`)

  if (post?.title === req.body.title)
    throw Error('Cannot use the post title provided')

  try {
    const result = await cachedPostService.updatePost(req.body, id)
    if (result) {
      const updatedPost = await cachedPostService.getById(result?.id)

      return res.status(200).json({
        message: `${req.auth?.username} updated post: ${updatedPost?.title}`,
        post: updatedPost,
      })
    }
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const deletePost = async (req: JWTRequest, res: Response) => {
  const { id } = req.params

  // const user = await UserModel.findById(req?.auth?.aud)

  const post = await cachedPostService.getById(id)

  if (post?.user?.id !== req?.auth?.aud)
    return res
      .status(403)
      .json({ error: `Not allowed to delete ${post?.title}` })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `${id} is not valid user id!` })
  }
  try {
    await cachedPostService.deletePost(id)

    await UserModel.updateOne(
      { posts: id },
      { $pull: { posts: id } },
      { multi: true, new: true }
    )

    res.status(204).end()
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
      throw createHttpError.Unauthorized(err.message)
    }
  }
}

const userController = {
  create,
  getPosts,
  getById,
  deletePost,
  updatePost,
}

export default userController
