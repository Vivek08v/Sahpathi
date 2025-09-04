import axios from 'axios';
import { apiConnector } from './apiConnector';

const API_URL = 'http://localhost:4000/api/v1';

const RoomService = {
  getRoomsAPI: async () => {
    try {
      const response = await apiConnector("GET", `${API_URL}/get-all-rooms`);
      console.log(response);

      if(!response.data.success){
        throw new Error("Rooms fetch failed");
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  createRoomAPI: async (title, createdBy) => {
    console.log("hii2")
    try {
      const response = await axios.post(`${API_URL}/create-room`, {
        title,
        createdBy,
        category: "Maths",   // need to be corrected
        classtype: "TUTOR"
      });

      console.log("response from API: ", response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }
};

export default RoomService; 