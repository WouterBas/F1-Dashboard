import client from '../db';

import type { Session } from '$lib/types/types';

export const getAllSessions = async () => {
	const result = await client
		.db('f1dashboard')
		.collection('sessions')
		.find(
			{},
			{
				projection: {
					name: 1,
					type: 1,
					sessionKey: 1,
					slug: 1,
					_id: 0,
					year: { $year: '$startDate' }
				}
			}
		)
		.sort({ startDate: -1 })
		.toArray();
	return result as unknown as Session[];
};
