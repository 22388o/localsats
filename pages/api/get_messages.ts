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
	//	console.log(pgpPrivateKey)

	// const privateKey = await openpgp.decryptKey({
	// 	privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey })
	// 	//	passphrase
	// })

	messages.map(async (m) => {
		const message = await openpgp.readMessage({
			armoredMessage: m.body // parse armored message
		})

		const { data: decrypted, signatures } = await openpgp.decrypt({
			message,
			config: {
				allowInsecureDecryptionWithSigningKeys: true
			},
			//	verificationKeys: publicKey, // optional
			decryptionKeys: await openpgp.readPrivateKey({
				armoredKey: pgpPrivateKey
			})
		})

		m.body = decrypted
		//		console.log(message)
		//		console.log(message.message)
		//		console.log(message.message)
		return m
	})
	return messages
}

export default async function handler(req, res) {
	try {
		const messages = await getMessages(req.body.userId, req.body.pgpPrivateKey)
		//		console.log('messages', messages)
		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
