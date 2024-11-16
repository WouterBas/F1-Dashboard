type Session = {
	name: string;
	sessionKey: string;
};

export const load = async (): Promise<{ sessions: Session[] }> => {
	const res = await fetch(`http://localhost:4000/api/v1/session/all`);
	const data = await res.json();

	return { sessions: data };
};
