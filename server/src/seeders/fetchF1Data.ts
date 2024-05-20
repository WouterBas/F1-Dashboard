import { Schedule, Session } from "../types";

// get session info from f1
async function getF1Data(schedule: Schedule, session: Session, type: string) {
  const name = schedule.name.replaceAll(" ", "_");
  const date = Object.values(session);
  const raceDate = schedule.sessions[4].Race;
  const sessionKey = Object.keys(session);

  const url = `https://livetiming.formula1.com/static/${schedule.year}/${raceDate}_${name}/${date}_${sessionKey}/${type}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", url, error);
    process.exit(1);
  }
}

export async function getF1DataWithUrl(url: string, type: string) {
  const fullUrl = `https://livetiming.formula1.com/static/${url}${type}.json`;
  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", fullUrl, error);
    process.exit(1);
  }
}

export default getF1Data;
