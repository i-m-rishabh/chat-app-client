import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Group from "./Group";

const Main = () => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [activeGroups, setActiveGroups] = useState([]);
    const [groupId, setGroupId] = useState(null);
    const [groupName, setGroupName] = useState(null);
    // const [textMessage, setTextMessage] = useState('');
    // const [messages, setMessages] = useState([]);
    const [intervalId, setIntervalId] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

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
        // THIS LOGIC IS FOR UNIVERSAL GROUP
        // async function createGroup() {
        //     await fetch('http://localhost:5000/group/create-group', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             groupName: 'universal',
        //         }),
        //         headers: {
        //             'authorization': token,
        //             'Content-type': 'application/json',
        //         }
        //     })
        // }

        fetchActiveUsers();
        fetchActiveGroups();
        // createGroup();
        var intervalId = setInterval(() => {
            fetchActiveGroups();
        }, 10000);
        setIntervalId(intervalId);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [token]);

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
            localStorage.removeItem('token');
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
    const handleGroupChange = (event) => {
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
                                <button key={group.id} data-group-id={group.id} data-group-name={group.groupName} onClick={handleGroupChange}>{group.groupName}</button>
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
                    return <p key={user.id}>{user.email} has joined</p>
                })
            }
            {groupId && <Group groupId={groupId} groupName={groupName} />}

        </div>
    )
}

export default Main;