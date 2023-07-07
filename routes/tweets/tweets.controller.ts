import { NextFunction, Request, RequestHandler, Response } from 'express'
import mongoose, { ClientSession } from 'mongoose'
import jwt from 'jsonwebtoken'
import { TweetModel } from '../../models/tweet.model'
import { ICreateTweetDTO } from './dtos/create-tweet.dto'
import { UserModel } from '../../models/user.model'
import { IUpdateTweetDTO } from './dtos/update-tweet.dto'

export const getAllTweets: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const tweets = await TweetModel.find()
			.sort({ createdAt: -1 })
			.populate('user', {
				username: 1,
				name: 1,
			})

		res.json(tweets)
	} catch (error) {
		next(error)
	}
}

export const getTweetById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		const tweet = await TweetModel.findById(id).populate('user', {
			username: 1,
			name: 1,
		})

		if (!tweet) {
			return res.status(404).send({ error: 'tweet not found' })
		}

		res.json(tweet)
	} catch (error) {
		next(error)
	}
}

export const createTweet = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const dto: ICreateTweetDTO = req.body
		if (!dto || !dto.content) {
			return res.status(400).end() // 400 Bad Request
		}

		const { userId } = req

		const user = await UserModel.findById(userId)
		if (!user) {
			return res.status(404).send({ error: 'user not found' })
		}

		const newTweet = new TweetModel({
			content: dto.content,
			user: user?._id,
		})

		const savedTweet = await newTweet.save()

		user.tweets = user?.tweets.concat(savedTweet._id)
		await user?.save()

		res.status(201).json(savedTweet)
	} catch (error) {
		next(error)
	}
}

export const updateTweetById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const dto: IUpdateTweetDTO = req.body
	if (!dto || !dto.content) {
		return res.status(400).end() // 400 Bad Request
	}

	try {
		const updatedTweet = await TweetModel.findByIdAndUpdate(
			id,
			{ content: dto.content },
			{ new: true }
		)

		if (!updatedTweet) {
			return res.status(404).send({ error: 'tweet not found' })
		}

		res.json(updatedTweet)
	} catch (error) {
		next(error)
	}
}

export const deleteTweetById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const session: ClientSession = await mongoose.startSession()
	session.startTransaction()

	try {
		const { id } = req.params

		const deletedTweet = await TweetModel.findByIdAndDelete(id, { session })

		if (!deletedTweet) {
			await session.abortTransaction()
			session.endSession()
			return res.status(404).send({ error: 'tweet not found' })
		}

		const user = await UserModel.findById(deletedTweet.user, {}, { session })

		if (!user) {
			await session.abortTransaction()
			session.endSession()
			return res.status(404).send({ error: 'user not found' })
		}

		user.tweets = user.tweets.filter(tweet => !tweet.equals(deletedTweet._id))
		await user.save({ session })

		await session.commitTransaction()
		session.endSession()

		res.status(204).end() // 204 === No Content
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		next(error)
	}
}
