import React, { useEffect, useState } from 'react'
import MediasoupClient from '../services/MediasoupClient';

const Chatbox = () => {
    const [chats, setChats] = useState([]);
    const [peers, setPeers] = useState([]);
    const [form, setForm] = useState({message: ""});

    const changeHandler = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}))
    }

    const sendHandler = (e) => {
        e.preventDefault();
        if (form.message.trim() === "") return;
        MediasoupClient.sendChatMessage(form.message);
    }

    useEffect(()=>{
        MediasoupClient.onChatPeerJoined = (peerId, name, role) => {
            setPeers((prev) => ([...prev, {peerId, name, role}]))
        }
        MediasoupClient.onPeerClosed = (peerId) => {
            setPeers((prev) => prev.filter((peer) => peer.peerId !== peerId));
        }
        MediasoupClient.onChatMessage = ({text, sender, timestamp}) => {
            console.log("onChatMessage: ", text);
            setChats((prev)=> [...prev, {message: text, sender: sender}]);
        }
    },[])

    return (
        <div>
            <div>Chatbox</div>
            <div>
                {chats.length!==0 && chats.map((chat, i)=>
                    <div key={i}>
                        {`${chat.sender.name} -> ${chat.message}`}
                    </div>
                )}
            </div>
            <form onSubmit={sendHandler}>
                <input type='text' name='message' value={form.message} onChange={changeHandler}></input>
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default Chatbox