import { setUser } from "../../redux/slices/userSlice";
import { apiConnector } from "../apiConnector";

const API_URL = 'http://localhost:4000/api/v1';

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
            navigate("/classrooms")
        }
        catch(error){
            console.log("Error occured while logging In: ", error);
        }
    }
}