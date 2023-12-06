import { useEffect, useState } from "react"
import io from 'socket.io-client';

const Group = ({ groupId, groupName, socket }) => {
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [text, setText] = useState('');
    const [addWindowActive, setAddWindowActive] = useState(false);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [adminWindowActive, setAdminWindowActive] = useState(false);
    const [fetchedAdmins, setFetchedAdmins] = useState([]);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);

    //initialing socket
    // const socket = io("http://localhost:5000");

    // // Add a listener for incoming chat messages
    // useEffect(() => {
    //     socket.on('chat message', (msg) => {
    //         setMessage(msg);
    //     });

    //     // Clean up the listener when component unmounts
    //     return () => {
    //         socket.off('chat message');
    //     };
    // }, []);
    // useEffect(() => {
    //     const socket = io("http://localhost:5000");

    //     // Add a listener for incoming chat messages
    //     socket.on('chat message', (msg) => {
    //         setMessage(msg);
    //     });

    //     // Clean up the listener when component unmounts
    //     return () => {
    //         socket.off('chat message');
    //         socket.disconnect();
    //     };
    // }, []);  // Empty dependency array ensures it only runs once when component mounts

    useEffect(() => {
        socket.on('chat message', (data) => {
            setMessages((prev)=>{
                return [...prev, data];
            });
        })

        return () => {
            socket.off('chat message');
        }
    }, [socket]);

    useEffect(() => {
        fetchCurrentUser();
    }, []);
    // there is small bug in program that anyone can remove any member even to admin.
    useEffect(() => {
        // FUNCTION IS MOVED OUTSIDE SO THAT WE CAN USE IT OTHER PLACES AS WELL SEE BELOW
        // async function fetchAllMembers() {
        //     try {
        //         let response = await fetch('http://localhost:5000/get-all-users', {
        //             method: 'GET',
        //             headers: {
        //                 'authorization': localStorage.getItem('token'),
        //                 'Content-Type': 'application/json',
        //             }
        //         });
        //         let data = await response.json();
        //         if (!response.ok) {
        //             throw new Error(data.error);
        //         } else {
        //             setAllMembers(data.data);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        // // add appropriate logic
        // async function fetchCurrentMembers() {
        //     try {
        //         let response = await fetch(`http://localhost:5000/get-users/${groupId}`, {
        //             method: 'GET',
        //             headers: {
        //                 'authorization': localStorage.getItem('token'),
        //                 'Content-Type': 'application/json',
        //             }
        //         })
        //         let data = await response.json();
        //         if (!response.ok) {
        //             throw new Error(data.error);
        //         } else {
        //             setCurrentMembers(data.data);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

        fetchAllMembers();
        fetchCurrentMembers();
        // const socket = io("http://localhost:5000");

        // // Join Socket.IO room based on the group ID
        // socket.emit('join', { groupId });

        // // Clean up the socket connection and leave the room when component unmounts
        // return () => {
        //     socket.emit('leave', { groupId });
        //     socket.disconnect();
        // };
    }, [groupId]);

    useEffect(() => {
        const ids = currentMembers.map((member) => {
            return member.id;
        })
        setSelectedMembers(ids);
    }, [currentMembers]);

    useEffect(() => {
        const ids = fetchedAdmins.map((admin) => {
            return admin.id;
        });
        setSelectedAdmins(ids);
    }, [fetchedAdmins])

    useEffect(() => {
        async function fetchGroupChats() {
            try {
                const oldMessages = JSON.parse(localStorage.getItem(`oldMessages-${groupId}`)) || [];
                let lastMessageId;
                if (oldMessages.length > 0) {
                    lastMessageId = oldMessages[oldMessages.length - 1].id;
                } else {
                    lastMessageId = -1;
                }

                const response = await fetch(`http://localhost:5000/message/get-messages/${groupId}?messageId=${lastMessageId}`, {
                    method: 'GET',
                    headers: {
                        'authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('error in getting group chats');
                } else {
                    console.log('successfully got the group chats');
                    const updatedMessages = [...oldMessages, ...data.data].slice(-10);//get only latest 10 messages
                    localStorage.setItem(`oldMessages-${groupId}`, JSON.stringify(updatedMessages));
                    setChats(() => {
                        return updatedMessages;
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
        // let interval = setInterval(() => {
        //     fetchGroupChats();
        // }, 2000);

        // return () => {
        //     clearInterval(interval);
        // }
        fetchGroupChats();
    }, [groupId]);

    async function fetchCurrentUser() {
        try {
            const response = await fetch(`http://localhost:5000/get-current-user/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Contenty-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                console.log(data.data);
                setIsAdmin(data.data.UserGroups.isAdmin);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchAllMembers() {
        try {
            let response = await fetch('http://localhost:5000/get-all-users', {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                setAllMembers(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // add appropriate logic
    async function fetchCurrentMembers() {
        try {
            let response = await fetch(`http://localhost:5000/get-users/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            })
            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                setCurrentMembers(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSendMessage = async (event) => {
        event.preventDefault();
        // const socket = io("http://localhost:5000");

        try {
            const response = await fetch(`http://localhost:5000/message/add-message/${groupId}`, {
                method: 'POST',
                body: JSON.stringify({ text: text }),
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error('error in adding message');
            } else {
                // Emit the message to the server
                socket.emit('chat message', { groupId, text });
                setText('');
                // console.log(data);
                // alert('message sent successfully');
            }

            // setText('')
        } catch (err) {
            console.error(err);
        }

    }

    function handleCheckboxChange(filterId) {
        if (selectedMembers.includes(filterId)) {
            const updatedMembers = selectedMembers.filter((id) => {
                return id !== filterId;
            });
            console.log(["updatedMembers", updatedMembers]);
            setSelectedMembers(updatedMembers);
        } else {
            setSelectedMembers((prev) => {
                return [...prev, filterId];
            })
        }
    }

    // add appropriate logic here
    async function handeUpdateMembers(event) {
        event.preventDefault();
        // alert('add logic to call api');
        try {
            const response = await fetch(`http://localhost:5000/group/update-members/${groupId}`, {
                method: 'POST',
                body: JSON.stringify(selectedMembers),
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                alert('members updated');
                setAddWindowActive(false);
            }
        } catch (err) {
            console.log(err);
        }
    }
    async function handleAdminWindowActive() {
        try {
            await fetchCurrentMembers();
            const response = await fetch(`http://localhost:5000/group/get-admins/${groupId}`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                setFetchedAdmins(data.data);
                setAdminWindowActive(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleAdminCheckboxChange(memberId) {
        if (selectedAdmins.includes(memberId)) {
            const updatedAdmins = selectedAdmins.filter((id) => {
                return id !== memberId;
            });
            setSelectedAdmins(updatedAdmins);
        } else {
            setSelectedAdmins((prev) => {
                return [...prev, memberId];
            })
        }
    }
    async function handleUpdateAdmins(event) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/group/update-admins/${groupId}`, {
                method: 'POST',
                body: JSON.stringify(selectedAdmins),
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            } else {
                alert('admin updated successfully');
                setAdminWindowActive(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {/* for test */}
            {/* <pre>{JSON.stringify(allMembers)}</pre> */}
            {/* <pre>{JSON.stringify(fetchedAdmins)}</pre> */}
            {/* <pre>{JSON.stringify(selectedMembers)}</pre> */}
            {/* <pre>isAdmin: { JSON.stringify(isAdmin)}</pre> */}
            <h1>{groupName}</h1>
            {/* display chats */}
            {!addWindowActive && isAdmin && <button onClick={() => { setAddWindowActive(true) }}>add members</button>}
            {/* add window */}
            {addWindowActive && <div>
                <form onSubmit={handeUpdateMembers}>
                    {
                        allMembers.map((member) => {
                            return <li key={member.id}>{member.username} <input type="checkbox" checked={selectedMembers.includes(member.id)} value={member.id} onChange={() => { handleCheckboxChange(member.id) }} /></li>
                        })
                    }
                    <div><button type="submit">add</button></div>
                    <button onClick={() => { setAddWindowActive(false) }}>cancel</button>
                </form>
            </div>}
            {!adminWindowActive && isAdmin && <button onClick={handleAdminWindowActive}>manage admins</button>}
            {
                adminWindowActive && <div>
                    <form>
                        <p>select admins</p>
                        {
                            currentMembers.map((member) => {
                                return (
                                    <li key={member.id}>{member.username} <input type="checkbox" checked={selectedAdmins.includes(member.id)} value={member.id} onChange={() => { handleAdminCheckboxChange(member.id) }} /></li>
                                )
                            })
                        }
                        <button onClick={handleUpdateAdmins}>update Admins</button>
                        <button onClick={() => { setAdminWindowActive(false) }}>cancel</button>
                    </form>
                </div>
            }
            <div>
                {
                    chats.map((chat) => {
                        return <div>
                            <p>{chat.username}</p>
                            <p>{chat.text}</p>
                        </div>
                    })
                    
                }
                {
                    messages.map((message) => {
                        return <div>
                            <p>{message.username}</p>
                            <p>{message.text}</p>
                        </div>
                    })
                }
                {/* <p>this is message {message}</p> */}

            </div>
            {/* new chat */}
            <div>
                <form onSubmit={handleSendMessage}>
                    <input type="text" value={text} placeholder="type here" onChange={(e) => { setText(e.target.value) }} />
                    <button type="submit">send</button>
                </form>
            </div>
        </div>
    )
}

export default Group;