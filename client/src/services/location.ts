import axios from "axios";
import { LocationData } from "../types/location";
import { authService } from "./auth";

const apiUrl = import.meta.env.VITE_API;

export const sendLocation = async (data: LocationData) => {
  console.log("Sending location data to server:", data);
  const user = authService.getCurrentUser();

  const res = await axios.post(`${apiUrl}/location`, {
    ...data,
    userId: user?.id,
  });
  console.log(res);
};
