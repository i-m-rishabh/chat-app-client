import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Group from "./Group";

const Main = () => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [activeGroups, setActiveGroups] = useState([]);
    const [groupId, setGroupId] = useState(1);
    const [groupName, setGroupName] = useState('universal');
    // const [textMessage, setTextMessage] = useState('');
    // const [messages, setMessages] = useState([]);
    const [intervalId, setIntervalId] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    // const inputRef = useRef(null);



    //to focus text input on every render
    // useEffect(() => {
    //     inputRef.current.focus();
    // });

    //fetch active users
    useEffect(()=>{
        // setGroupId(1);
        // setGroupName('universal');
    },[])
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        async function fetchActiveGroups() {
            const response = await fetch('http://localhost:5000/group/get-all-groups/', {
                method: 'GET',
                headers: {
                    'authorization': token,
                    'Content-Type': 'applicaton/json',
                }
            })
            const data = await response.json();
            setActiveGroups(data.data);
        }

        async function fetchActiveUsers() {
            try {
                // const token = localStorage.getItem('token');
                // setToken(token);
                const response = await fetch('http://localhost:5000/', {
                    method: 'GET',
                    headers: {
                        'authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error('something went wrong');
                } else {
                    setActiveUsers((activeUsers) => {
                        return data.data;
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
        async function createGroup() {
            await fetch('http://localhost:5000/group/create-group', {
                method: 'POST',
                body: JSON.stringify({
                    groupName: 'universal',
                }),
                headers: {
                    'authorization': token,
                    'Content-type': 'application/json',
                }
            })
        }
        // async function fetchAllMessages() {
        //     try {
        //         const oldMessages = JSON.parse(localStorage.getItem('oldMessages')) || [];
        //         let lastMessageId;
        //         if (oldMessages.length > 0) {
        //             lastMessageId = oldMessages[oldMessages.length - 1].id;
        //         } else {
        //             lastMessageId = -1;
        //         }
        //         const response = await fetch(`http://localhost:5000/message/get-messages/1?messageId=${lastMessageId}`, {
        //             method: 'GET',
        //             headers: {
        //                 'authorization': token,
        //                 'Content-Type': 'application/json'
        //             }
        //         });
        //         const data = await response.json();
        //         if (!response.ok) {
        //             throw new Error(messages.error);
        //         } else {
        //             //add appropriate logic here
        //             const updatedMessages = [...oldMessages, ...data.data].slice(-10);//get only latest 10 messages
        //             console.log(updatedMessages);
        //             localStorage.setItem('oldMessages', JSON.stringify(updatedMessages));
        //             setMessages(() => {
        //                 return updatedMessages;
        //             })
        //             console.log(messages);
        //         }
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }
        fetchActiveUsers();
        createGroup();
        // fetchAllMessages();
        var intervalId = setInterval(() => {
            // fetchAllMessages();
            fetchActiveGroups();
        }, 10000);
        setIntervalId(intervalId);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [token]);



    // const sendMessage = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const response = await fetch('http://localhost:5000/message/add-message/1', {
    //             method: 'POST',
    //             body: JSON.stringify({ text: textMessage }),
    //             headers: {
    //                 'authorization': token,
    //                 'Content-Type': 'application/json',
    //             }
    //         })
    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error('error in adding message');
    //         } else {
    //             setTextMessage('');
    //             // console.log(data);
    //             // alert('message sent successfully');
    //         }

    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
    const handleLogout = async () => {

        const response = await fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
                'authorization': token,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.message);
        } else {
            localStorage.removeItem('oldMessages');
            if (intervalId) {
                clearInterval(intervalId);
            }
            alert('logged out successfully');
            navigate('/login');
        }
    }
    const handleCreateGroup = async (event) => {
        event.preventDefault();
        const groupName = event.target.group.value;
        try {
            const response = await fetch('http://localhost:5000/group/create-group', {
                method: 'POST',
                body: JSON.stringify({
                    groupName: groupName,
                }),
                headers: {
                    'authorization': token,
                    'Content-type': 'application/json',
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error('erro in in creating group');
            } else {
                console.log(data);
                alert('group created');
            }

        } catch (error) {
            console.error(error);
        }
    }
    const handleGroupChange = (event) =>{
        //transforming to cammel case it convetion
        setGroupId(event.target.dataset.groupId);
        setGroupName(event.target.dataset.groupName);
    }

    return (
        <div>
            <h1> welcome to the app</h1>
            <button onClick={handleLogout}>logout</button>

            <div>
                <div>
                    <h2>groups</h2>
                    {
                        activeGroups.map((group) => {
                            return (
                                //using dataset property
                                <button data-group-id={group.id} data-group-name={group.groupName} onClick={handleGroupChange}>{group.groupName}</button>
                            )
                        })
                    }
                </div>
                <div>
                    <h2>create new group</h2>
                    <form onSubmit={handleCreateGroup}>
                        <label>group name</label>
                        <input name='group' type="text" />
                        <button>create</button>
                    </form>
                </div>
            </div>
            {
                activeUsers && activeUsers.map((user) => {
                    return <p>{user.email} has joined</p>
                })
            }
            <Group groupId={groupId} groupName={groupName}/>
            {/* {
                messages && messages.map((message) => {
                    return <div>
                        <p style={{ fontWeight: "bold" }}>{message.username}</p>
                        <p>{message.text}</p>
                    </div>
                })
            } */}
            {/* <div>
                <form onSubmit={sendMessage}>
                    <input ref={inputRef} type="text" name="message" value={textMessage} onChange={(event) => { setTextMessage(event.target.value) }} />
                    <button type="submit">send</button>
                </form>
            </div> */}
        </div>
    )
}

export default Main;