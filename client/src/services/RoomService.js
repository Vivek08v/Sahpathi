import axios from 'axios';
import { apiConnector } from './apiConnector';

const API_URL = 'http://localhost:4000/api/v1';

const RoomService = {
  getRoomAPI: async (roomId) => {
    try {
      const response = await apiConnector("GET", `${API_URL}/get-room/${roomId}`);
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

  createRoomAPI: async (formData) => {
    console.log("hii2")
    try {
      const response = await apiConnector("POST", `${API_URL}/create-room`, formData);

      console.log("response from API: ", response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  scheduleRoomAPI: async(data) => {
    try{
      const response = await apiConnector("PATCH", `${API_URL}/schedule-room`, data);

      console.log("response from API: ", response.data);
      return response.data.data;
    }
    catch(error){
      console.error('Error scheduling room:', error);
      throw error;
    }
  }
};

export default RoomService; 