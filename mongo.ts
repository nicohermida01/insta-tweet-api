import mongoose from 'mongoose'
import { log } from './utils/log'

const connectionString = process.env.MONGODB_URI || ''

mongoose
	.connect(connectionString)
	.then(() => {
		log('Database connected')
	})
	.catch(err => {
		console.error(err)
	})

process.on('uncaughtException', error => {
	console.error(error)
	mongoose.disconnect()
})
