import { NextFunction, Request, Response } from 'express'

const ERROR_HANLDERS = {
	CastError: (res: Response) =>
		res.status(400).send({ error: 'id used is malformed' }),

	ValidationError: (res: Response) =>
		res.status(400).send({ error: 'username is already taken' }),

	JsonWebTokenError: (res: Response) =>
		res.status(401).send({ error: 'token invalid ' }),

	TokenExpirerError: (res: Response) =>
		res.status(401).send({ error: 'token expired' }),

	defaultError: (res: Response) => res.status(500).end(),
}

export const errorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(error)
	const handler =
		ERROR_HANLDERS[error.name as keyof typeof ERROR_HANLDERS] ||
		ERROR_HANLDERS.defaultError

	handler(res)
}
