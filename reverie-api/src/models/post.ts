import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import slugify from 'slugify'

import { User } from './user'

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
export class Post {
  @prop({ unique: true, trim: true })
  public title!: string

  @prop({ trim: true })
  public description?: string

  @prop({ trim: true })
  public entry?: string

  @prop()
  public user: User

  public get slug() {
    return slugify(this.title, { lower: true, trim: true })
  }
}

export const PostModel = getModelForClass(Post)
