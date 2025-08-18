import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import { validateField } from "../../../utils/validation";
import "./Register.scss";
import CountrySelect from "../../UI/CountrySelect/CountrySelect";
import MainLayout from "../MainLayout/MainLayout";

const Register = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }

  function handleRegister(e) {
    e.preventDefault();

    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) newErrors[key] = error;
    });

    if (Object.values(newErrors).some((err) => err !== "")) {
      setErrors(newErrors);
      return;
    }

    fetch("http://localhost:5200/api/register", {
      method: "POST",
      body: JSON.stringify({ ...formData, role: "user" }),
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((resp) => resp.json())
      .then(() => {
        console.log("Registration successful!");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  }

  return (
    <MainLayout isDoubleForm={true}>
      <div className="register">
        <header className="register-header">Sign up</header>

        <form onSubmit={handleRegister} className="register-form-wrapper">
          <div className="register-form">
            <div className="register-column">
              <h3>Personal data</h3>
              <Input
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Name"
                name="name"
                iconClass="fa-solid fa-user"
              />
              <ErrorMessage message={errors.name} />

              <Input
                value={formData.surname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Surname"
                name="surname"
                iconClass="fa-solid fa-user"
              />
              <ErrorMessage message={errors.surname} />

              <Input
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone"
                name="phone"
                iconClass="fa-solid fa-phone"
              />
              <ErrorMessage message={errors.phone} />

              <CountrySelect
                onSelect={(country) =>
                  setFormData((prev) => ({ ...prev, country }))
                }
              />
            </div>

            <div className="register-column">
              <h3>User data</h3>
              <Input
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Username"
                name="username"
                iconClass="fa-solid fa-user"
              />
              <ErrorMessage message={errors.username} />

              <Input
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                name="email"
                className="input"
                iconClass="fa-solid fa-envelope"
              />
              <ErrorMessage message={errors.email} />

              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                name="password"
                iconClass="fa-solid fa-lock"
              />
              <ErrorMessage message={errors.password} />

              <PasswordInput
                value={formData.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat password"
                name="password2"
                iconClass="fa-solid fa-lock"
              />
              <ErrorMessage message={errors.password2} />
            </div>
          </div>

          <SubmitBtn label="Register" />
        </form>
      </div>
    </MainLayout>
  );
};

export default Register;
