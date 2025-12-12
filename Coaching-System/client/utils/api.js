import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error?.response?.data?.message || "Something went wrong");
    return Promise.reject(error);
  }
);

export default api;
const deleteStudent = async (id) => {
  if (!confirm("Are you sure?")) return;

  try {
    await api.delete(`/api/students/${id}`);
    toast.success("Deleted successfully");
    loadStudents();
  } catch (err) {}
};