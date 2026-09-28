import api from "./api";

export const getTourism = async () => {
  return api.get("/tourism");
};

export const getAllTourism = async () => {
  return api.get("/tourism/admin/all");
};

export const getTourismById = async (id) => {
  return api.get(`/tourism/admin/${id}`);
};

export const createTourism = async (data) => {
  return api.post("/tourism/admin", data);
};

export const updateTourism = async (id, data) => {
  return api.put(`/tourism/admin/${id}`, data);
};

export const deleteTourism = async (id) => {
  return api.delete(`/tourism/admin/${id}`);
};