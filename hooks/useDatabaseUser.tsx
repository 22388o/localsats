import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useDatabaseUser = ({ userId }: { userId: string }) => {
	const userQuery = useQuery(
		['databaseUser', userId],
		() => {
			return axios.post('/api/get_user', {
				userId
			})
		},
		{
			enabled: !!userId
		}
	)

	return userQuery
}
