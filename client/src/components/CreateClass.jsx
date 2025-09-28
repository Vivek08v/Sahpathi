import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoomService from "../services/RoomService";

const CreateClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.userSlice);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    classtype: "GROUP_STUDY",
    tags: "",
  });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter room title");
      return;
    }

    setLoading(true);
    try {
      const room = await RoomService.createRoomAPI({ ...formData, user });
      setLoading(false);
      navigate(`/room/preview/${room.classId}`);
    } catch (error) {
      console.log("Error creating room: ", error);
      setError("Failed to create room, please try again!");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create a New Class
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter class title"
              value={formData.title}
              onChange={changeHandler}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g. Math, Science"
              value={formData.category}
              onChange={changeHandler}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Class Type */}
          <div>
            <label
              htmlFor="classtype"
              className="block text-sm font-medium text-gray-700"
            >
              Class Type
            </label>
            <select
              id="classtype"
              name="classtype"
              value={formData.classtype}
              onChange={changeHandler}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="GROUP_STUDY">Group Study</option>
              <option value="TUTOR">Tutor</option>
            </select>
            {/* <input
              type="text"
              id="classtype"
              name="classtype"
              placeholder="Online / Offline"
              value={formData.classtype}
              onChange={changeHandler}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            /> */}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Comma separated tags"
              value={formData.tags}
              onChange={changeHandler}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
          >
            {loading ? "Creating..." : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;





























// import React, {useState} from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import RoomService from '../services/RoomService';

// const CreateClass = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const {user} = useSelector((state)=> state.userSlice);
//     const [formData, setFormData] = useState({
//         title: "",
//         category: "",
//         classtype: "",
//         tags: "",
//     });
//     const navigate = useNavigate();

//     const changeHandler = (e) => {
//         const {name, value} = e.target;
//         setFormData((prev) => ({...prev, [name]: value}));
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if(!formData.title.trim()){
//           setError('Please enter room title');
//           return;
//         }

//         setLoading(true);
//         try{
//           console.log("hii1", user);
//           const room = await RoomService.createRoomAPI({...formData, user});
//           console.log(room);
//           setLoading(false);
//           navigate(`/room/preview/${room.classId}`);
//         }
//         catch(error){
//           console.log('Error creating room: ', error);
//           setError('failed to create room, please try again!!');
//           setLoading(false);
//         }
//     }
//     return (
//       <div>
//           <div>CreateClass</div>
//           <div>
//             {error ?? 'Error'}
//             <form onSubmit={handleSubmit}>

//               <label> Title: </label>
//               <input type='text' id='title' name='title' placeholder='roomName'
//                 value={formData.title}
//                 onChange={(e)=> changeHandler(e)}
//                 required
//               />

//               <label> Category: </label>
//               <input type='text' id='category' name='category' placeholder='category'
//                 value={formData.category}
//                 onChange={(e)=> changeHandler(e)}
//                 required
//               />

//               <label> ClassType: </label>
//               <input type='text' id='classtype' name='classtype' placeholder='classtype'
//                 value={formData.classtype}
//                 onChange={(e)=> changeHandler(e)}
//                 required
//               />

//               <label> Tags: </label>
//               <input type='text' id='tags' name='tags' placeholder='tags'
//                 value={formData.tags}
//                 onChange={(e)=> changeHandler(e)}
//                 required
//               />
//               <button
//                 type='submit'>
//                 {loading ? 'Creating Room': 'Create Room'}
//               </button>
//             </form>
//           </div>
//       </div>
//     )
// }

// export default CreateClass