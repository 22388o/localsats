import clientPromise from '../../lib/mongodb'
const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp

export const getMessages = async (userId: string, pgpPrivateKey: string) => {
	if (!userId || !pgpPrivateKey) {
		return []
	}
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const messages = await db
		.collection('messages')
		.find({
			$or: [{ toUserId: userId }, { fromUserId: userId }]
		})
		.sort({ sentDate: 1 })
		.toArray()

	const privateKey = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
		passphrase: 'test'
	})

	const finalMessages = []
	for await (const m of messages) {
		const message = await openpgp.readMessage({
			armoredMessage: m.body // parse armored message
		})

		const { data: decrypted, signatures } = await openpgp.decrypt({
			message,
			decryptionKeys: privateKey
		})
		m.body = decrypted
		finalMessages.push(m)
	}

	return finalMessages
}

export default async function handler(req, res) {
	try {
		const messages = await getMessages(req.body.userId, req.body.pgpPrivateKey)
		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
