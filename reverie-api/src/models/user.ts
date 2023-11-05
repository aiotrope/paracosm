import mongoose, { Schema, Document, Types, Model, model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  id: string
  email: string
  username: string
  password: string
  posts: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  /* eslint-disable-next-line no-unused-vars */
  comparePassword(password: string): Promise<boolean>
  /* eslint-enable-next-line no-unused-vars */
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: false, default: null },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PostModel',
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

UserSchema.pre<IUser>('save', async function (next) {
  const user = this as IUser

  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(user.password, salt)

  user.password = hash

  return next()
})

UserSchema.methods.comparePassword = async function (password: string) {
  const user = this as IUser
  return bcrypt.compare(password, user.password)
}

UserSchema.pre<IUser>(
  'deleteMany',
  { document: true, query: false },
  function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const target: any = this
    target?.model('PostModel').deleteMany({ user: target._id }, next)
  }
)

const UserModel =
  (mongoose.models.UserModel as Model<IUser>) ||
  model<IUser>('UserModel', UserSchema)

export default UserModel
