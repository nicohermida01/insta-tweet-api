import { NextFunction, Request, Response } from 'express'

export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(404).end()
}
