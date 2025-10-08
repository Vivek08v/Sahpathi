import { setAuthenticated, setUser } from "../../redux/slices/userSlice";
import { apiConnector } from "../apiConnector";

const API_URL = 'http://localhost:4000/api/v1';

export const signUpAPI = (data, navigate) => {
    return async(dispatch) => {
        try{
            const {email, fullname, username, image, password} = data;
            console.log("hii: ",email, fullname, username, password, image)
            const signUpDetails = await apiConnector("POST", API_URL+`/signup`, data, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(signUpDetails);

            if(!signUpDetails.data.success){
                console.log("Error in log In")
                throw new Error("Error in log In")
            }

            dispatch(setUser(signUpDetails.data.data))
            dispatch(setAuthenticated(true));
            navigate("/classrooms")
        }
        catch(error){
          console.log("Error occured while logging In: ", error);
        }
    }
}


export const logInAPI = (data, navigate) => {
    return async(dispatch) => {
        try{
            const {email, password} = data;
            console.log(email, password)
            const logInDetails = await apiConnector("POST", API_URL+`/login`, data);
            console.log(logInDetails);

            if(!logInDetails.data.success){
                console.log("Error in log In")
                throw new Error("Error in log In")
            }

            dispatch(setUser(logInDetails.data.data))
            dispatch(setAuthenticated(true));
            navigate("/classrooms")
        }
        catch(error){
            console.log("Error occured while logging In: ", error);
        }
    }
}

// 1. Check at app startup
export const initAuth = () => {
  return async(dispatch) => {
    try {
      await apiConnector("POST", `${API_URL}/refresh`);
      // await api.post("/auth/refresh"); // refresh token comes from cookie
      dispatch(setAuthenticated(true));
    } catch {
      dispatch(setAuthenticated(false));
    }
  }
};
// 2. Axios interceptor for auto-refresh