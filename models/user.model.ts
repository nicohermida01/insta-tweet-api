import { Document, Schema, Types, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { ITweet } from './tweet.model'

export interface IUser {
	username: string
	name?: string
	passwordHash: string
	tweets: Types.ObjectId[]
}

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		name: String,
		passwordHash: {
			type: String,
			required: true,
		},
		tweets: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tweet',
			},
		],
	},
	{ timestamps: true }
)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v

		delete returnedObject.passwordHash
	},
})

userSchema.plugin(uniqueValidator)

export const UserModel = model<IUserDocument>('User', userSchema)
