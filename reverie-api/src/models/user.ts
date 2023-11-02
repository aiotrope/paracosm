import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  pre,
  DocumentType,
} from '@typegoose/typegoose'
import bcrypt from 'bcryptjs'
import environ from '../environ'

@index({ username: 1, email: 1 })
@pre<User>('save', async function (next) {
  let user = this as unknown as DocumentType<User>

  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSaltSync(environ.SALTWORKFACTOR)

  const hash = await bcrypt.hashSync(user.password, salt)

  user.password = hash

  return next()
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
})
export class User {
  @prop({
    required: true,
    trim: true,
    unique: true,
  })
  public email!: string

  @prop({ required: true, trim: true, unique: true })
  public username!: string

  @prop({ required: true, trim: true })
  public password!: string

  public comparePassword(password: string): Promise<boolean> {
    const user = this as unknown as DocumentType<User>

    return bcrypt.compare(password, user.password)
  }
}

export const UserModel = getModelForClass(User)
