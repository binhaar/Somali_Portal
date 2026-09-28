import api from "./api";

export const getTourism = async (
  language = "en"
) => {
  return await api.get(
    `/tourism?lang=${language}`
  );
};

export const getAllTourism = async () => {
  return await api.get(
    "/tourism/admin/all"
  );
};

export const getTourismById = async (id) => {
  return await api.get(
    `/tourism/admin/${id}`
  );
};

export const createTourism = async (data) => {
  return await api.post(
    "/tourism/admin",
    data
  );
};

export const updateTourism = async (
  id,
  data
) => {
  return await api.put(
    `/tourism/admin/${id}`,
    data
  );
};

export const deleteTourism = async (id) => {
  return await api.delete(
    `/tourism/admin/${id}`
  );
};