import { RequestHandler, Router } from 'express'
import * as tweetsController from './tweets.controller'
import { userExtractor } from '../../middlewares/userExtractor.middleware'

const tweetsRouter = Router()

tweetsRouter.get('/', tweetsController.getAllTweets)
tweetsRouter.get('/:id', tweetsController.getTweetById)
tweetsRouter.post('/', userExtractor, tweetsController.createTweet)
tweetsRouter.put('/:id', userExtractor, tweetsController.updateTweetById)
tweetsRouter.delete('/:id', userExtractor, tweetsController.deleteTweetById)

export default tweetsRouter
