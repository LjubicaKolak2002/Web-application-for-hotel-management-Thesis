import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    function onChangeEmail(e) {
        setEmail(e.target.value);
    }
    
    function onChangePassword(e) {
        setPassword(e.target.value);
    }

    
    function handleLogin(e) {
        e.preventDefault();

        if (password === "" || email === ""){
            setError("All fields are required to be entered")
        }

        
        fetch("http://localhost:5200/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {"Content-type": "application/json;charset=UTF-8"}
            
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                const myuser = JSON.stringify({
                    id: data.user_id,
                    name: data.user_name, 
                    role: data.user_role
                });
                localStorage.setItem("user", myuser);
                navigate("/");
            }
            else {
                setError("Login failed")
            }
        })
    }

    return (
        <>
            <div className="login-container">
                <h3 className="loginTitle">Login</h3>
                <form className="login-form" onSubmit={(e) => {handleLogin(e);}}>
                    <label htmlFor="email">Email</label>
                    <input type="text" value={email} onChange={onChangeEmail} onBlur={onChangeEmail} />
      
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={onChangePassword} onBlur={onChangePassword}/>
      
                    <button type="submit">Login</button>
      
                    {error && <p className="error-message">{error}</p>}
                </form>
           
            </div>

            <div className="loginText">Don't have an account? Create it here<br/>
                <Link to="/register"><span className="registerLogin"><strong>Register</strong></span></Link>
            </div>
        </>
      );
}


export default Login;