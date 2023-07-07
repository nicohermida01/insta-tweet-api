import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../routes/login/login.controller'

export const userExtractor = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authorization = req.get('authorization')
		let decodedToken: any = null

		if (authorization && authorization.toLowerCase().startsWith('bearer')) {
			const token = authorization.substring(7)
			decodedToken = jwt.verify(token, JWT_SECRET)
		}

		if (!decodedToken || !decodedToken.id) {
			return res.status(401).send({ error: 'token missing or invalid ' })
		}

		const { id: userId } = decodedToken
		req.userId = userId

		next()
	} catch (error) {
		next(error)
	}
}
