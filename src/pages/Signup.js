import React, { useState } from "react"
import {Link, useNavigate} from 'react-router-dom';

const Signup = () => {
    const initialState = {
        username : '',
        email: '',
        phone: '',
        password: '',
    }
    const [user, setUser] = useState(initialState)
    const navigate = useNavigate();
    const handleChange = (e) => {
        // console.log([e.target.name, e.target.value]);

        setUser((user)=>{
            return {
                ...user,
                [e.target.name]:e.target.value,
            }
        })
    }
    const handleSubmit = async (event) =>{
        event.preventDefault();
        // console.log(user);
        const response = await fetch('http://localhost:5000/signup',{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // console.log(data);
        setUser('');
        alert(data.message);
        navigate('/login');
    }
    return (
        <div>
            <h1>signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>username: </label>
                    <input 
                        type='text' 
                        name='username' 
                        value={user.username}
                        onChange={handleChange}    
                    />
                </div>
                <div>
                    <label>email: </label>
                    <input 
                        type='text' 
                        name='email' 
                        value={user.email} 
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>phone: </label>
                    <input 
                        type='text' 
                        name='phone' 
                        value={user.phone} 
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>password: </label>
                    <input 
                        type='text' 
                        name='password' 
                        value={user.password} 
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">create</button>
                    <p>Already have an account <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Signup;