import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import { validateField } from "../../../utils/validation";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    role: "",
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
      [name]: error, // Ažuriraj grešku za polje
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
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((resp) => resp.json())
      .then(() => {
        console.log("Staff added successfully!");
        navigate("/staff-list");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="outer">
      <div className="form">
        <div className="form-body">
          <header>Add Staff</header>
          <br />

          <form onSubmit={handleRegister}>
            <Input
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              name="name"
            />
            <ErrorMessage message={errors.name} />
            <br />

            <Input
              value={formData.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Surname"
              name="surname"
            />
            <ErrorMessage message={errors.surname} />
            <br />

            <Input
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username"
              name="username"
            />
            <ErrorMessage message={errors.username} />
            <br />

            <Input
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              name="email"
              className={errors.email ? "error-input" : ""}
            />
            <ErrorMessage message={errors.email} />
            <br />

            <Input
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone"
              name="phone"
            />
            <ErrorMessage message={errors.phone} />
            <br />

            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              name="password"
            />
            <ErrorMessage message={errors.password} />
            <br />

            <PasswordInput
              value={formData.password2}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Repeat password"
              name="password2"
            />
            <ErrorMessage message={errors.password2} />
            <br />
            {/* TODO nova komponenta */}
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "recepcionist", label: "Recepcionist" },
                { value: "maid", label: "Maid" },
                { value: "head maid", label: "Head maid" },
              ]}
            />

            <ErrorMessage message={errors.role} />
            <br />
            <br />

            <SubmitBtn label="Add Staff" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
