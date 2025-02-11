import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    let navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState("");

    function handleChange(setter) {
        return (e) => setter(e.target.value);
    }

    function handleRegister(e) {
        e.preventDefault();
        setIsValid(true);
        setMessage("");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^\+?\d{7,15}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!name || !surname || !username || !email || !phone || !password || !password2) {
            setIsValid(false);
            setMessage("All fields are required!");
            return;
        }

        if (!emailRegex.test(email)) {
            setIsValid(false);
            setMessage("Invalid email format.");
            return;
        }

        if (!phoneRegex.test(phone)) {
            setIsValid(false);
            setMessage("Phone number must contain 7-15 digits.");
            return;
        }

        if (!passwordRegex.test(password)) {
            setIsValid(false);
            setMessage("Password must have at least 8 characters, 1 letter, and 1 number.");
            return;
        }

        if (password !== password2) {
            setIsValid(false);
            setMessage("Passwords do not match!");
            return;
        }

       
        fetch("http://localhost:5200/api/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                surname,
                username,
                email,
                password,
                phone,
                role: "user"
            }),
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log("Registration successful!");
            navigate("/login"); 
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className="outer">
            <div className="form">
                <div className="form-body">
                    <header>Signup</header><br />

                    <form onSubmit={handleRegister}>
                        <input type="text" value={name} onChange={handleChange(setName)} placeholder="Name" required /><br /><br />
                        <input type="text" value={surname} onChange={handleChange(setSurname)} placeholder="Surname" required /><br /><br />
                        <input type="text" value={username} onChange={handleChange(setUsername)} placeholder="Username" required /><br /><br />
                        <input type="text" value={email} onChange={handleChange(setEmail)} placeholder="Email" required /><br /><br />
                        <input type="text" value={phone} onChange={handleChange(setPhone)} placeholder="Phone" required /><br /><br />
                        <input type="password" value={password} onChange={handleChange(setPassword)} placeholder="Password" required /><br /><br />
                        <input type="password" value={password2} onChange={handleChange(setPassword2)} placeholder="Repeat Password" required /><br /><br />

                        <input type="submit" value="Register" /><br /><br />
                        {!isValid && <div className="alert alert-danger">Error: {message}!</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
