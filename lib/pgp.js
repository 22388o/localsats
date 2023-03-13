import openpgp from 'openpgp'

export const encryptMessage = async ({ publicKey1, publicKey2, message }) => {
	const publicKey = await openpgp.readKey({
		armoredKey: publicKey1
	})
	const myPublicKey = await openpgp.readKey({
		armoredKey: publicKey2
	})
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: message }),
		encryptionKeys: [publicKey, myPublicKey]
	})

	return encrypted
}
