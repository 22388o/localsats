export const CHAT_PAYWALL_SATOSHIS = 20

export const rqKeys = {
	messagesKey: () => ['messagesKey'] as const,
	postsKey: () => ['postsKey'] as const,
	chatPaywallsKey: () => ['chatPaywallsKey'] as const
}
