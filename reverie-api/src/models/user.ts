import { Schema, model, Types, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  username: string
  password: string
  posts: Types.ObjectId
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
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hashSync(this.password, salt)
  next()
})

const UserModel = model<IUser>('UserModel', UserSchema)

export default UserModel
