import axios from "axios";
import auth from "../authentication/auth";

const baseURL = "http://localhost:3333/";
const objAxios = axios.create({ baseURL });

auth.setAxiosInstance(objAxios);
export default objAxios;
