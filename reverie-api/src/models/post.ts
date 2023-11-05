import mongoose, { Schema, model, Types, Document, Model } from 'mongoose'
import slugify from 'slugify'

export interface IPost extends Document {
  id: string
  title: string
  description: string
  entry: string
  user: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    entry: {
      type: String,
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
  return slugify(this.title, { lower: true, trim: true })
})

PostSchema.pre('deleteMany', { document: true, query: false }, function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const target: any = this
  target?.model('UserModel').deleteMany({ posts: target._id }, next)
})

const PostModel =
  (mongoose.models.UserModel as Model<IPost>) ||
  model<IPost>('PostModel', PostSchema)

export default PostModel
