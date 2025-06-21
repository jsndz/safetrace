import axios from "axios";
import { LocationData } from "../types/location";
const apiUrl = process.env.VITE_API;
export const sendLocation = async (data: LocationData) => {
  const res = await axios.post(`${apiUrl}/location`, data);
  console.log(res);
};
