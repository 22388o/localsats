import clientPromise from '../../lib/mongodb'
const openpgp = require('openpgp')
const PGP = require('pgp-simple')

export default async function handler(req, res) {
	try {
		const { privateKey, publicKey, revocationCertificate } =
			await openpgp.generateKey({
				type: 'ecc', // Type of the key, defaults to ECC
				curve: 'curve25519', // ECC curve name, defaults to curve25519
				userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
				passphrase: 'test', // protects the private key
				format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
			})

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
