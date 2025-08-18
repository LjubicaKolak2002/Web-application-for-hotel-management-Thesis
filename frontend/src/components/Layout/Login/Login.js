import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import MainLayout from "../MainLayout/MainLayout";
import "./Login.scss";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    fetch("http://192.168.56.1:5200/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    })
      .then((resp) => {
        console.log("Response status:", resp.status);
        return resp.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          const userObj = {
            id: data.user_id,
            name: data.user_name,
            role: data.user_role,
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          if (onLogin) {
            onLogin(userObj);
          }

          if (data.accessToken) {
            localStorage.setItem("token", data.accessToken);
            const userObj = {
              id: data.user_id,
              name: data.user_name,
              role: data.user_role,
            };
            localStorage.setItem("user", JSON.stringify(userObj));

            if (onLogin) {
              onLogin(userObj);
            }

            switch (data.user_role) {
              case "maid":
                navigate("/maids-assigned-rooms");
                break;
              case "admin":
                navigate("/room-list");
                break;
              case "user":
                navigate("/search-rooms-by-date");
                break;
              case "head maid":
                navigate("/maids-checkList");
                break;
              case "receptionist":
                navigate("/arrivals-departures");
                break;
              default:
                navigate("/search-rooms-by-date");
            }
          } else {
            setError("Invalid email or password.");
          }
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch((err) => {
        setError("Something went wrong. Please try again.");
      });
  }

  return (
    <MainLayout>
      <div className="login">
        <header className="login-header">Sign in</header>

        <form onSubmit={handleLogin} className="login-form">
          <Input
            value={email}
            onChange={onChangeEmail}
            placeholder="Email"
            name="email"
            iconClass="fa-solid fa-user"
          />
          <PasswordInput
            value={password}
            onChange={onChangePassword}
            placeholder="Password"
            name="password"
            iconClass="fa-solid fa-lock"
          />

          <ErrorMessage message={error} />

          <SubmitBtn label="Login" />

          <p className="register-paragraph">
            <i className="fa-solid fa-circle-user"></i> Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
};

export default Login;
