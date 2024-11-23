import { getAllSessions } from '$lib/modules/api/sessions';
import type { Session } from '$lib/types';

export const load = async (): Promise<{ sessions: Session[] }> => {
	const data = await getAllSessions();

	return { sessions: data };
};
