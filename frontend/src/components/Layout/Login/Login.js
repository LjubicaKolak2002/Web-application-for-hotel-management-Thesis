import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";

const Login = () => {
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

    fetch("http://localhost:5200/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user_id,
              name: data.user_name,
              role: data.user_role,
            })
          );
          navigate("/");
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch(() => setError("Something went wrong. Please try again."));
  }

  return (
    <div className="outer">
      <div className="form">
        <div className="form-body">
          <header>Sign in</header>
          <br />

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={onChangeEmail}
              placeholder="Email"
              name="email"
            />
            <br />
            <PasswordInput
              value={password}
              onChange={onChangePassword}
              placeholder="Password"
              name="password"
            />
            <br />

            <SubmitBtn label="Login" />
            <br />

            <ErrorMessage message={error} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
