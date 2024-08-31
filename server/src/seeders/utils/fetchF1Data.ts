import { F1Meeting, Schedule, Session } from "../../types";

// get session info from f1
async function getF1Data(schedule: Schedule, session: Session, type: string) {
  const name = schedule.name.replaceAll(" ", "_");
  const date = session.date;
  const raceDate = schedule.date;
  const sessionKey = session.type;

  const url = `https://livetiming.formula1.com/static/${schedule.year}/${raceDate}_${name}/${date}_${sessionKey}/${type}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", url);
    return null;
  }
}

export async function getF1DataWithUrl(url: string, feed: string) {
  const fullUrl = `${url}${feed}.json`;
  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", fullUrl, error);
    process.exit(1);
  }
}
export async function getF1StreamData(url: string, feed: string) {
  const fullUrl = `${url}${feed}.jsonStream`;
  try {
    const response = await fetch(fullUrl);
    if (response.status !== 200) {
      console.error("Error fetching data:", response.status, fullUrl);
      return null;
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching data:", fullUrl, error);
    process.exit(1);
  }
}

export default getF1Data;
