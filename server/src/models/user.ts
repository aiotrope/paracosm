import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id
        delete ret._id
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
})
export class UserClass {
  @prop({
    required: true,
    trim: true,
    unique: true,
  })
  public email!: string

  @prop({ required: true, trim: true, unique: true })
  public username!: string

  @prop({ required: true, trim: true })
  public hashedPassword?: string
}

export const UserModel = getModelForClass(UserClass)
