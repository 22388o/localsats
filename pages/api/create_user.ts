import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(database)
		const user = await db.collection('users').insertOne({
			userId: req.body.userId,
			createDate: new Date(),
			email: null
		})
		res.json(user)
	} catch (e) {
		console.error(e)
	}
}