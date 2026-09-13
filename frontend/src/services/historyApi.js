import api from "./api";

export const getHistory = async () => {
  return await api.get("/history");
};