import { Schema, model, Document, Types } from 'mongoose'

export type TUser = {
  email: string
  username: string
  password: string
  posts: Types.ObjectId
}

export interface IUser extends TUser, Document {}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: { type: String, required: false, default: null },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
)

UserSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
    delete retObject.password
  },
})

const UserModel = model<IUser>('UserModel', UserSchema)

export default UserModel
