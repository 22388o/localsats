import clientPromise from '../../lib/mongodb'
const openpgp = require('openpgp')

export default async function handler(req, res) {
	try {
		//generate pgp keys
		console.log('creat user')
		const { privateKey, publicKey, revocationCertificate } =
			await openpgp.generateKey({
				config: {
					allowInsecureDecryptionWithSigningKeys: true
				},
				userIDs: [{ name: 'localsats', email: 'localsatsuser@localsats.org' }]
			})

		//	console.log(privateKey)
		//	console.log(publicKey)
		//	console.log(revocationCertificate)

		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const user = await db.collection('users').insertOne({
			userId: req.body.userId,
			createDate: new Date(),
			email: null,
			pgpPublicKey: publicKey
		})
		res.json({ ...user, pgpPrivateKey: privateKey })
	} catch (e) {
		console.error(e)
	}
}
