import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import Checkbox from "../../UI/Checkbox/Checkbox";

const EditRoom = () => {
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    category: "",
    features: [],
    price: "",
    blocked: false,
    blockReason: "",
  });

  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
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
      features: Array.isArray(roomResult.features)
        ? roomResult.features.map((feat) => String(feat)) //tip string zbog faze -> FK
        : [],
      price: roomResult.price?.$numberDecimal
        ? parseFloat(roomResult.price.$numberDecimal)
        : parseFloat(roomResult.price) || 0,
      blocked: roomResult.blocked ?? false,
      blockReason: roomResult.blockReason || "",
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    //promijeni samo bool vrijednost
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
      !formData.price
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.blocked && !formData.blockReason) {
      setError("Block reason is required when blocked is true.");
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

  useEffect(() => {
    getRoom();
    getCategories();
    getFeatures();
  }, []);

  return (
    <div className="edit-room-container">
      <h3>Edit Room</h3>
      <form onSubmit={updateData}>
        <Input
          value={formData.number}
          onChange={handleChange}
          placeholder="Room Number"
          name="number"
        />
        <ErrorMessage
          message={error && !formData.number ? "Room number is required" : ""}
        />
        <br />

        <Input
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          name="capacity"
        />
        <ErrorMessage
          message={error && !formData.capacity ? "Capacity is required" : ""}
        />
        <br />

        <Checkbox
          name="features"
          value={formData.features}
          onChange={handleFeaturesChange}
          options={features.map((feat) => ({
            value: feat._id,
            label: feat.name,
            checked: formData.features.includes(String(feat._id)), // 🔹 Provjera ID-a kao stringa
          }))}
        />

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
          message={error && !formData.category ? "Category is required" : ""}
        />
        <br />

        <Input
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          name="price"
        />
        <ErrorMessage
          message={error && !formData.price ? "Price is required" : ""}
        />

        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.blocked}
              onChange={handleChange}
              name="blocked"
            />
            Blocked
          </label>
        </div>

        {formData.blocked && (
          <>
            <Input
              value={formData.blockReason}
              onChange={handleChange}
              placeholder="Block Reason"
              name="blockReason"
            />
            <ErrorMessage
              message={
                error && !formData.blockReason ? "Block reason is required" : ""
              }
            />
          </>
        )}
        <SubmitBtn label="Save" />
      </form>
    </div>
  );
};

export default EditRoom;
