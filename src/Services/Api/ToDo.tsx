import axios from "axios";

const API_URL = "http://localhost:3333/api/todos";
const LABELS_API_URL = "http://localhost:3333/api/labels";

export const getTodos = async () => {
  return await axios.get(API_URL);
};

export const getTodosByLabel = async (label: string) => {
  return await axios.get(`${API_URL}/label/${label}`);
};

export const createTodo = async (todo: any) => {
  return await axios.post(API_URL, todo);
};

export const deleteTodo = async (id: any) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateTodo = async (id: string, todo: any) => {
  return await axios.put(`${API_URL}/${id}`, todo);
};

export const getLabels = async () => {
  return await axios.get(LABELS_API_URL);
};

export const createLabel = async (label: any) => {
  return await axios.post(LABELS_API_URL, label);
};

export const deleteLabel = async (id: string) => {
  return await axios.delete(`${LABELS_API_URL}/${id}`);
};