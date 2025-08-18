import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import Checkbox from "../../UI/Checkbox/Checkbox";
import MainLayout from "../MainLayout/MainLayout";
import "./AddRoom.scss";

const AddRoom = () => {
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    image: "",
    category: "",
    type: "",
    features: [],
    price: "",
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [features, setFeatures] = useState([]);

  const [imagePreview, setImagePreview] = useState("");
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
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const localImageUrl = URL.createObjectURL(file); //privremeni url slike
    setImagePreview(localImageUrl);

    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:5200/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.imageUrl) {
          setFormData((prev) => ({ ...prev, image: data.imageUrl }));
        }
      })
      .catch((err) => console.error("Greška prilikom upload-a", err));
  }

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
      !formData.price ||
      !formData.image
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
    <div className="add-room-main-container">
      <MainLayout isDoubleForm={true} offsetTop={30}>
        <div className="add-room">
          <header className="add-room-header">Add New Room</header>

          <form onSubmit={addRoom} className="add-room-form-wrapper">
            <div className="add-room-form">
              <div className="add-room-column">
                <Input
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Room Number"
                  name="number"
                  iconClass="fa-solid fa-bed"
                />
                <Input
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  name="capacity"
                  iconClass="fa-solid fa-user-group"
                />
                <label>Category:</label>
                <Select
                  value={formData.category}
                  onChange={handleChange}
                  options={categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  name="category"
                  placeholder="Select category"
                />

                <label>Type:</label>
                <Select
                  value={formData.type}
                  onChange={handleChange}
                  options={types.map((type) => ({
                    value: type._id,
                    label: type.name,
                  }))}
                  name="type"
                  placeholder="Select type"
                />
              </div>
              <div className="add-room-column">
                <Input
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  name="price"
                  iconClass="fa-solid fa-money-check-dollar"
                />

                <div className="feature-group">
                  <span>Select features:</span>
                  <Checkbox
                    options={features.map((feat) => ({
                      value: feat._id,
                      label: feat.name,
                    }))}
                    value={formData.features}
                    onChange={handleFeatureChange}
                  />
                </div>

                <div className="picture-div">
                  <span>Picture:</span>

                  <div className="file-group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "250px",
                        marginTop: "20px",
                        borderRadius: "4px",
                        height: "140px",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <ErrorMessage message={error} />
            <SubmitBtn label="Add Room" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddRoom;
