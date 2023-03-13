import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
export function formatAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export async function fetchData(url: string) {
  const data = await axios.get(baseUrl + url).then(({ data }) => data);
  return data;
}
