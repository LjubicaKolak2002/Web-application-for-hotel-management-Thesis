import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const EditStaff = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const params = useParams();
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
    }

    const options = {headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
    }};

    async function getRoles() {
        const response = await fetch("http://localhost:5200/api/user-roles", options);
        const rolesData = await response.json();
        setRoles(rolesData); 
    }

    async function getStaff() {
        const staff = await fetch(`http://localhost:5200/api/staff-details/${params.staff_id}`, options);
        const staffJson = await staff.json();
        const staffResult = await staffJson;

        setName(staffResult.name);
        setSurname(staffResult.surname);
        setUsername(staffResult.username);
        setEmail(staffResult.email);
        setPhone(staffResult.phone);
        setRole(staffResult.role);
    }

    async function updateData (e) {
        e.preventDefault();

        if (name === "" || surname === "" || username === "" || email === "" || phone ==="" || role === "") {
            setError("All fields are required to be entered");
            return;
        }

        fetch(`http://localhost:5200/api/edit-staff/${params.staff_id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: name,
                surname: surname,
                username: username, 
                email: email, 
                phone: phone, 
                role: role
            }),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                navigate("/staff-list");
            } else {
                setError("Update error");
            }
        });
    }

    useEffect(() => {
        getStaff();
        getRoles();
    }, [])

    return (
        <>
            <h3>Edit staff</h3>
            <form>
                <span>Name: </span><input type="text" defaultValue={name}  onChange={(e) => setName(e.target.value)} required/><br/>
                <span>Surname: </span><input type="text" defaultValue={surname}  onChange={(e) => setSurname(e.target.value)} required/><br/>
                <span>Username: </span><input type="text" defaultValue={username}  onChange={(e) => setUsername(e.target.value)} required/><br/>
                <span>Email: </span><input type="text" defaultValue={email}  onChange={(e) => setEmail(e.target.value)} required/><br/>
                <span>Phone: </span><input type="text" defaultValue={phone}  onChange={(e) => setPhone(e.target.value)} required/><br/>
                <span>Role: </span>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select><br />

                <button type="submit" onClick={updateData}>Save</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </>
    )
}

export default EditStaff;