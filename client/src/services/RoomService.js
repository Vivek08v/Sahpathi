import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

const RoomService = {
  getRooms: async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all-rooms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  createRoom: async (title, creatorId, creatorName) => {
    console.log("hii2")
    try {
      const response = await axios.post(`${API_URL}/create-room`, {
        title,
        creatorId,
        creatorName
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }
};

export default RoomService; 