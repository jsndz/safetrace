import axios from "axios";
import { LocationData } from "../types/location";

const apiUrl = import.meta.env.VITE_API;

export const sendLocation = async (data: LocationData) => {
  console.log("Sending location data to server:", data);

  const res = await axios.post(`${apiUrl}/location`, data);
  console.log(res);
};
