// import { addFollower, addFollowing, addToFollowBackList } from "../../redux/slices/followSlice";
import { addFollower, addFollowing, addToFollowBackList } from "../../redux/slices/userSlice";
import { apiConnector } from "../apiConnector";

const API_URL = 'http://localhost:4000/api/v1';

export const followAPI = (data, navigate) => {
    return async(dispatch) => {
        try{
            const response = await apiConnector("PATCH", `${API_URL}/follow-or-unfollow-request`, data);
            console.log(response);

            if(!response.data.success){
                console.log("Error in following from server")
                throw new Error("Error in following from server")
            }

            dispatch(addFollowing(response.data.data));
        }
        catch(error){
            console.log("Error in following from server: ", error);
        }
    }
}