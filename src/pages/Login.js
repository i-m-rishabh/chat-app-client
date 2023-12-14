import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import classes from './Login.module.css';
const Login = () => {

    const navigate = useNavigate();

    const [credential, setCredential] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setCredential((credential) => {
            return {
                ...credential,
                [event.target.name]: event.target.value,
            }
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credential)
            })
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message);
            }else{
                // 
                // console.log(data);
                const {token} = data;
                localStorage.setItem("token", token);
                navigate('/chat-app');            
            }
        }
        catch(err){
            alert(err);
            console.error(err);
        }

    }
    return (
        <div>
            <h1 className={classes.heading}>login</h1>
            <form onSubmit={handleSubmit} className={classes.loginform}>
                <div className={classes.inputdiv}>
                    <label>email: </label>
                    <input type='email' name="email" value={credential.email} onChange={handleChange} />
                </div>
                <div className={classes.inputdiv}>
                    <label>password: </label>
                    <input type="password" name='password' value={credential.password} onChange={handleChange} />
                </div>
                <div>
                    <button type="submit" > login </button>
                    <p className={classes.message}>don't have an account <Link to={'/signup'}>signup</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Login;