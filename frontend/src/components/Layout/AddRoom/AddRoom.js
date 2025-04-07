import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import Checkbox from "../../UI/Checkbox/Checkbox";

const AddRoom = () => {
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    category: "",
    type: "",
    features: [],
    price: "",
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  async function getCategories() {
    const response = await fetch(
      "http://localhost:5200/api/categories-list",
      options
    );
    const categoriesData = await response.json();
    setCategories(categoriesData);
  }

  async function getTypes() {
    const response = await fetch(
      "http://localhost:5200/api/room-types-list",
      options
    );
    const typesDate = await response.json();
    setTypes(typesDate);
  }

  async function getFeatures() {
    const response = await fetch(
      "http://localhost:5200/api/room-features-list",
      options
    );
    const featuresData = await response.json();
    setFeatures(featuresData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFeatureChange(e) {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, value]
        : prev.features.filter((f) => f !== value),
    }));
  }

  function addRoom(e) {
    e.preventDefault();
    setError("");

    if (
      !formData.number ||
      !formData.capacity ||
      !formData.category ||
      !formData.type ||
      !formData.price
    ) {
      setError("All fields are required!");
      return;
    }

    fetch("http://localhost:5200/api/add-newRoom", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options.headers,
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        navigate("/room-list");
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getCategories();
    getTypes();
    getFeatures();
  }, []);

  return (
    <div className="outer">
      <div className="form">
        <div className="form-body">
          <header>Add New Room</header>
          <br />

          <form onSubmit={addRoom}>
            <Input
              value={formData.number}
              onChange={handleChange}
              placeholder="Room Number"
              name="number"
            />
            <Input
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              name="capacity"
            />
            <Select
              value={formData.category}
              onChange={handleChange}
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
              name="category"
            />

            <Select
              value={formData.type}
              onChange={handleChange}
              options={types.map((type) => ({
                value: type._id,
                label: type.name,
              }))}
              name="type"
            />

            <Checkbox
              options={features.map((feat) => ({
                value: feat._id,
                label: feat.name,
              }))}
              value={formData.features}
              onChange={handleFeatureChange}
            />

            <Input
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              name="price"
            />
            <SubmitBtn label="Add Room" />
            <ErrorMessage message={error} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
