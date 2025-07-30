import axios from "axios";
import { LocationData } from "../types/location";
import { authService } from "./auth";

const apiUrl = import.meta.env.CLIENT_VITE_API;

export const sendLocation = async (data: LocationData) => {
  const user = authService.getCurrentUser();

  const res = await axios.post(
    `${apiUrl}/location`,
    {
      ...data,
      userId: user?.ID,
    },
    {
      withCredentials: true,
    }
  );
};
