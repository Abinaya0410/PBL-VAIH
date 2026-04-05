import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${API}/register`, data);
  return response.data;
};
