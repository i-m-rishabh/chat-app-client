import { useEffect, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom';

const Main = () => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [textMessage, setTextMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [intervalId, setIntervalId] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    //to focus text input on every render
    useEffect(()=>{
        inputRef.current.focus();
    });

    //fetch active users
    useEffect(() => {
        async function fetchActiveUsers(){
            try {
                const token = localStorage.getItem('token');
                setToken(token);
                const response = await fetch('http://localhost:5000/', {
                    method: 'GET',
                    headers: {
                        'authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
        
                if(!response.ok){
                    throw new Error('something went wrong');
                }else{
                    setActiveUsers((activeUsers)=>{
                        return data.data;
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
        async function fetchAllMessages(){
            try{
                const oldMessages = JSON.parse(localStorage.getItem('oldMessages')) || [];
                let lastMessageId;
                if(oldMessages.length>0){
                    lastMessageId = oldMessages[oldMessages.length-1].id;
                }else{
                    lastMessageId = -1;
                }
                const response = await fetch(`http://localhost:5000/message/get-messages?messageId=${lastMessageId}`, {
                method: 'GET', 
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json(); 
            if(!response.ok){
                throw new Error(messages.error);
            }else{
                //add appropriate logic here
                const updatedMessages =  [...oldMessages, ...data.data];
                console.log(updatedMessages);
                localStorage.setItem('oldMessages', JSON.stringify(updatedMessages));
                setMessages(()=>{
                    return updatedMessages;
                })
                console.log(messages);
            }
            }catch(err){
                console.error(err);
            }
        }
        fetchActiveUsers();
        // fetchAllMessages();
        var intervalId = setInterval(() => {
            fetchAllMessages();
        }, 10000);
        setIntervalId(intervalId);

        return ()=>{
            if(intervalId){
                clearInterval(intervalId);
            }
        }
    },[token]);

   

    const sendMessage = async(event) => {
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/message/add-message', {
            method: 'POST', 
            body: JSON.stringify({text: textMessage}),
            headers: {
                'authorization': token,
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error('error in adding message');
        }else{
            setTextMessage('');
            // console.log(data);
            // alert('message sent successfully');
        }

        }catch(err){
            console.error(err);
        }
    }
    const handleLogout = async() => {

        const response = await fetch('http://localhost:5000/logout',{
            method:'GET',
            headers:{
                'authorization': token,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if(!response.ok){
            console.log(data.message);
        }else{
            if(intervalId){
                clearInterval(intervalId);
            }
            alert('logged out successfully');
            navigate('/login');
        }
    }

    return (
        <div>
            <h1> welcome to the app</h1>
            <button onClick={handleLogout}>logout</button>
            {
                activeUsers &&  activeUsers.map((user)=>{
                    return <p>{user.email} has joined</p>
                })
            }
            {
                messages && messages.map((message)=>{
                    return <div>
                        <p style={{fontWeight:"bold"}}>{message.username}</p>
                        <p>{message.text}</p>
                    </div>
                })
            }
            <div>
                <form onSubmit={sendMessage}>
                    <input ref={inputRef} type="text" name="message" value={textMessage} onChange={(event)=>{setTextMessage(event.target.value)}}/>
                    <button type="submit">send</button>
                </form>
            </div>
        </div>
    )
}

export default Main;