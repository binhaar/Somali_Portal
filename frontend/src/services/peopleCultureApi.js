import api from "./api";

// =====================================================
// PUBLIC — GET PEOPLE & CULTURE
// =====================================================

export const getPeopleCulture = async (language = "en") => {
  return await api.get(`/people-culture?lang=${language}`);
};

// =====================================================
// ADMIN — GET ALL
// =====================================================

export const getAllPeopleCulture = async () => {
  return await api.get("/people-culture/admin/all");
};

// =====================================================
// ADMIN — GET ONE BY ID
// =====================================================

export const getPeopleCultureById = async (id) => {
  if (!id) {
    throw new Error("People & Culture ID is required");
  }

  return await api.get(`/people-culture/admin/${id}`);
};

// =====================================================
// ADMIN — CREATE
// =====================================================

export const createPeopleCulture = async (data) => {
  if (!data) {
    throw new Error("People & Culture data is required");
  }

  return await api.post("/people-culture/admin", data);
};

// =====================================================
// ADMIN — UPDATE
// =====================================================

export const updatePeopleCulture = async (id, data) => {
  if (!id) {
    throw new Error("People & Culture ID is required");
  }

  if (!data) {
    throw new Error("People & Culture data is required");
  }

  return await api.put(`/people-culture/admin/${id}`, data);
};

// =====================================================
// ADMIN — DELETE
// =====================================================

export const deletePeopleCulture = async (id) => {
  if (!id) {
    throw new Error("People & Culture ID is required");
  }

  return await api.delete(`/people-culture/admin/${id}`);
};