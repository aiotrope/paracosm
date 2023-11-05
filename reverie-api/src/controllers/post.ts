import 'express-async-errors'
import { Request, Response } from 'express'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'
import PostModel, { IPost } from '../models/post'
import UserModel from '../models/user'
import postService from '../services/post'
import { cacheMethodCalls } from '../utils/cache'

const cachedPostService = cacheMethodCalls(postService, [
  'create',
  'deletePost',
  'update',
])

const getPosts = async (req: Request, res: Response) => {
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

const create = async (req: Request, res: Response) => {
  try {
    const result = await cachedPostService.create(req, req.body)

    const user = req.currentUser

    const post: IPost | null = await PostModel.findOne({
      id: result?.id,
    }).populate('user', {
      id: 1,
      username: 1,
      email: 1,
      posts: 1,
      createdAt: 1,
      updatedAt: 1,
    })

    return res.status(201).json({
      message: `${user.username} created new post: ${post?.title}`,
      post: post,
    })
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}
const update = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.currentUser
  try {
    const result = await cachedPostService.update(req, req.body, id)

    const post: IPost | null = await PostModel.findOne({
      id: result?.id,
    }).populate('user', {
      id: 1,
      username: 1,
      email: 1,
      posts: 1,
      createdAt: 1,
      updatedAt: 1,
    })

    return res.status(200).json({
      message: `${user.username} updated post: ${post?.title}`,
      post: post,
    })
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = req.currentUser

  const post: IPost | null = await PostModel.findById(id).populate('user', {
    id: 1,
  })

  if (post?.user !== user.id)
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
  update,
}

export default userController
