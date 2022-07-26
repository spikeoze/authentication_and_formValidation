// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Axios from "axios"

export async function getData() {
  const { data } = await Axios.get("http://localhost:8000/user", {
    withCredentials: true,
  });
  return data;
}

export default async function handler(req, res) {
  const data = await getData();
  console.log(data);
  res.status(200).json(data)
}
