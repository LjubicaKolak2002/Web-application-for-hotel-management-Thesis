import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import Checkbox from "../../UI/Checkbox/Checkbox";
import MainLayout from "../MainLayout/MainLayout";
import "./EditRoom.scss";

const EditRoom = () => {
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    category: "",
    type: "",
    features: [],
    price: "",
    status: "",
    blockReason: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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

    if (!response.ok) {
      setError("Error while fetching categories");
      return;
    }
    const categoriesData = await response.json();
    setCategories(categoriesData);
  }

  async function getTypes() {
    const response = await fetch(
      "http://localhost:5200/api/room-types-list",
      options
    );

    if (!response.ok) {
      setError("Error while fetching categories");
      return;
    }
    const typesData = await response.json();
    setTypes(typesData);
  }

  async function getFeatures() {
    const response = await fetch(
      "http://localhost:5200/api/room-features-list",
      options
    );

    if (!response.ok) {
      setError("Error while fetching features");
      return;
    }
    const featuresData = await response.json();
    //console.log("features:", featuresData);
    setFeatures(featuresData);
  }

  async function getRoom() {
    const response = await fetch(
      `http://localhost:5200/api/rooms/${params.room_id}`,
      options
    );
    if (!response.ok) {
      setError("Error");
      return;
    }
    const roomResult = await response.json();

    console.log("room data:", roomResult);

    setFormData({
      number: roomResult.number || "",
      capacity: roomResult.capacity || "",
      category: roomResult.category || "",
      type: roomResult.type || "",
      features: Array.isArray(roomResult.features)
        ? roomResult.features.map((feat) => String(feat)) //tip string zbog faze -> FK
        : [],
      price: roomResult.price?.$numberDecimal
        ? parseFloat(roomResult.price.$numberDecimal)
        : parseFloat(roomResult.price) || 0,
      status: roomResult.status || "free",
      blockReason: roomResult.blockReason || "",
      image: roomResult.image || "",
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    //ako status nije blokiran brisi razlog
    if (name === "status" && value !== "blocked") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        blockReason: "",
      }));
    } else {
      // ostale podatke samo promijeni
      if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  }

  function handleFeaturesChange(e) {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedFeatures = checked
        ? [...prev.features, String(value)]
        : prev.features.filter((feat) => String(feat) !== String(value));

      console.log("updated features:", updatedFeatures);
      return { ...prev, features: updatedFeatures };
    });
  }

  async function updateData(e) {
    e.preventDefault();

    if (
      !formData.number ||
      !formData.capacity ||
      !formData.category ||
      !formData.type ||
      !formData.price
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.status === "blocked" && !formData.blockReason) {
      setError("Block reason is required when room is blocked.");
      return;
    }

    const formattedData = {
      ...formData,
      features: formData.features.map((feat) => String(feat)),
    };

    fetch(`http://localhost:5200/api/edit-room/${params.room_id}`, {
      method: "PUT",
      body: JSON.stringify(formattedData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          navigate("/room-list");
        } else {
          setError("Update error");
        }
      })
      .catch(() => {
        setError("Failed to update room");
      });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append("image", file);

    fetch("http://localhost:5200/api/upload-image", {
      method: "POST",
      body: data,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.imageUrl) {
          setFormData((prev) => ({ ...prev, image: d.imageUrl }));
        }
      })
      .catch((err) => console.error("Upload error", err));
  }

  useEffect(() => {
    getRoom();
    getCategories();
    getTypes();
    getFeatures();
  }, []);

  return (
    <div className="edit-room-main-container">
      <MainLayout isDoubleForm={true} offsetTop={60}>
        <div className="edit-room">
          <header className="edit-room-header">Edit Room</header>
          <form onSubmit={updateData} className="edit-room-form-wrapper">
            <div className="edit-room-form">
              <div className="edit-room-column">
                <Input
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Room Number"
                  name="number"
                  iconClass="fa-solid fa-bed"
                />
                <ErrorMessage
                  message={
                    error && !formData.number ? "Room number is required" : ""
                  }
                />

                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  name="capacity"
                  iconClass="fa-solid fa-user-group"
                />
                <ErrorMessage
                  message={
                    error && !formData.capacity ? "Capacity is required" : ""
                  }
                />

                <label>Category:</label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  placeholder="Select Category"
                />
                <ErrorMessage
                  message={
                    error && !formData.category ? "Category is required" : ""
                  }
                />
                <label>Type:</label>

                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={types.map((type) => ({
                    value: type._id,
                    label: type.name,
                  }))}
                  placeholder="Select type"
                />
                <ErrorMessage
                  message={error && !formData.type ? "Type is required" : ""}
                />

                <Input
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  name="price"
                  iconClass="fa-solid fa-money-check-dollar"
                />
                <ErrorMessage
                  message={error && !formData.price ? "Price is required" : ""}
                />
              </div>

              <div className="edit-room-column">
                <div className="edit-room-features">
                  <span>Room features:</span>
                  <Checkbox
                    name="features"
                    value={formData.features}
                    onChange={handleFeaturesChange}
                    options={features.map((feat) => ({
                      value: feat._id,
                      label: feat.name,
                      checked: formData.features.includes(String(feat._id)),
                    }))}
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="edit-room-file-upload"
                />
                {(imagePreview || formData.image) && (
                  <img
                    src={imagePreview || formData.image}
                    alt="Room"
                    className="room-image-preview"
                  />
                )}

                <div className="edit-room-status">
                  <label>Room status:</label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { value: "free", label: "Free" },
                      { value: "occupied", label: "Occupied" },

                      { value: "clean", label: "Clean" },
                      { value: "dirty", label: "Dirty" },
                      { value: "blocked", label: "Blocked" },
                    ]}
                  />
                </div>
                {formData.status === "blocked" && (
                  <>
                    <Input
                      value={formData.blockReason}
                      onChange={handleChange}
                      placeholder="Block Reason"
                      name="blockReason"
                      iconClass="fa-solid fa-note-sticky"
                    />
                    <ErrorMessage
                      message={
                        error && !formData.blockReason
                          ? "Block reason is required when room is blocked"
                          : ""
                      }
                    />
                  </>
                )}
              </div>
            </div>
            <SubmitBtn label="Save" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default EditRoom;
