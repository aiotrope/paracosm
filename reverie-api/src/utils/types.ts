import { z } from 'zod'

import schema from './schema'

export type _Signup = z.infer<typeof schema.Signup>

export type SignupResponse = z.infer<typeof schema.SignupResponse>

export type _Login = z.infer<typeof schema.Login>

export type LoginResponse = z.infer<typeof schema.LoginResponse>

export type RefreshToken = z.infer<typeof schema.RefreshToken>

export type User = z.infer<typeof schema.User>

export type InitUser = z.infer<typeof schema.InitUser>

export type CreatePost = z.infer<typeof schema.CreatePost>

export type UpdatePost = z.infer<typeof schema.UpdatePost>

export type Post = z.infer<typeof schema.Post>
