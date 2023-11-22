import { useState } from "react";

const Main = async () => {
    const [activeUsers, setActiveUsers] = useState([]);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000', {
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
                return data.users;
            })
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <div>
            <h1> welcome to the app</h1>
            {
                activeUsers.map((user)=>{
                    return <p>{user.email} has joined</p>
                })
            }
        </div>
    )
}

export default Main;