import clientPromise from '../../lib/mongodb'

export const getPosts = async () => {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)

	// get posts and the post's author
	const posts = await db
		.collection('posts')
		.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: 'userId',
					as: 'author'
				}
			}
		])
		.toArray()

	//const posts = await db.collection('posts').find({}).toArray()
	return posts
}

export default async function handler(req, res) {
	try {
		const posts = await getPosts()

		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
