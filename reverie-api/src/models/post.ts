import { Schema, model, Document, Types } from 'mongoose'

export type TPost = {
  title: string
  description: string
  entry: string
  user: Types.ObjectId
}

export interface IPost extends TPost, Document {}

const PostSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      min: 5,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      min: 10,
      required: true,
    },
    entry: {
      type: String,
      min: 10,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
)

PostSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
    delete retObject.password
  },
})

const PostModel = model<IPost>('PostModel', PostSchema)

export default PostModel
