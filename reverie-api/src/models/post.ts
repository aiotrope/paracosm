import { Schema, model, Types, Document } from 'mongoose'
import slugify from 'slugify'

export interface IPost extends Document {
  title: string
  description: string
  entry: string
  user?: Types.ObjectId
}

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
      ref: 'UserModel',
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
  },
})

PostSchema.virtual('slug').get(function () {
  return slugify(this.name, { lower: true, trim: true })
})

const PostModel = model<IPost>('PostModel', PostSchema)

export default PostModel
