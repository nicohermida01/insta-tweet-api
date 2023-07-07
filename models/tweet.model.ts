import { Document, Schema, model } from 'mongoose'
import { IUser } from './user.model'

export interface ITweet {
	content: string
	user: IUser
}

interface ITweetDocument extends ITweet, Document {}

const tweetSchema = new Schema<ITweet>(
	{
		content: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

tweetSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	},
})

/* interface ITweet {
	id: number
	username: string
	content: string
	createdAt: Date
	updatedAt?: Date
	likes: string[]
	responses: string[]
	retweets: string[]
} */

export const TweetModel = model<ITweetDocument>('Tweet', tweetSchema)
