import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RoomService from '../services/RoomService';

const CreateClass = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {user} = useSelector((state)=> state.userSlice);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        classtype: "",
        tags: "",
    });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.title.trim()){
          setError('Please enter room title');
          return;
        }

        setLoading(true);
        try{
          console.log("hii1", user);
          const room = await RoomService.createRoomAPI({...formData, user});
          console.log(room);
          setLoading(false);
          navigate(`/room/${room.classId}`);
        }
        catch(error){
          console.log('Error creating room: ', error);
          setError('failed to create room, please try again!!');
          setLoading(false);
        }
    }
    return (
      <div>
          <div>CreateClass</div>
          <div>
            {error ?? 'Error'}
            <form onSubmit={handleSubmit}>

              <label> Title: </label>
              <input type='text' id='title' name='title' placeholder='roomName'
                value={formData.title}
                onChange={(e)=> changeHandler(e)}
                required
              />

              <label> Category: </label>
              <input type='text' id='category' name='category' placeholder='category'
                value={formData.category}
                onChange={(e)=> changeHandler(e)}
                required
              />

              <label> ClassType: </label>
              <input type='text' id='classtype' name='classtype' placeholder='classtype'
                value={formData.classtype}
                onChange={(e)=> changeHandler(e)}
                required
              />

              <label> Tags: </label>
              <input type='text' id='tags' name='tags' placeholder='tags'
                value={formData.tags}
                onChange={(e)=> changeHandler(e)}
                required
              />
              <button
                type='submit'>
                {loading ? 'Creating Room': 'Create Room'}
              </button>
            </form>
          </div>
      </div>
    )
}

export default CreateClass