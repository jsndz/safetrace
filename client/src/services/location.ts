import axios from "axios";
import { LocationData } from "../types/location";
import { authService } from "./auth";

// const API_BASE = import.meta.env.VITE_CLIENT_API;
const API_BASE =
  import.meta.env.VITE_CLIENT_API || "http://localhost:8080/api/v1";

export const sendLocation = async (data: LocationData) => {
  const user = authService.getCurrentUser();

  const res = await axios.post(
    `${API_BASE}/location`,
    {
      ...data,
      userId: user?.ID,
    },
    {
      withCredentials: true,
    }
  );
};
