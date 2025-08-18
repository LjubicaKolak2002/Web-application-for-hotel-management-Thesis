import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import Textarea from "../../UI/Textarea/Textarea";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import DatetimeInput from "../../UI/Datetime/Datetime";
import MainLayout from "../MainLayout/MainLayout";
import "./AddEvent.scss";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    organizer: "",
    datetime: "",
    location: "",
    capacity: "",
    image: "",
  });

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

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "datetime") {
      const localDate = new Date(value + ":00");

      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );

      setFormData((prev) => ({ ...prev, [name]: utcDate.toISOString() })); // UTC format
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

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

  function addEvent(e) {
    e.preventDefault();
    setError("");

    const eventToSend = {
      ...formData,
      datetime: new Date(formData.datetime).toISOString(), // UTC
    };

    fetch("http://localhost:5200/api/add-event", {
      method: "POST",
      body: JSON.stringify(eventToSend),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options.headers,
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        navigate("/events-list");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="add-event-main-container">
      <MainLayout isDoubleForm={true}>
        <div className="add-event">
          <header className="add-event-header">Add event</header>

          <form onSubmit={addEvent} className="add-event-form-wrapper">
            <div className="add-event-form">
              <div className="add-event-column">
                <Input
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  name="name"
                />

                <Input
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Organizer"
                  name="organizer"
                />

                <Input
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  name="capacity"
                />

                <DatetimeInput
                  value={
                    formData.datetime
                      ? new Date(formData.datetime).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleChange}
                  placeholder="Datetime"
                  name="datetime"
                />

                <Input
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  name="location"
                />
              </div>
              <div className="add-event-column">
                <Textarea
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  name="description"
                />
                <div className="add-event-add-picture">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "250px",
                        height: "170px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>

                <ErrorMessage message={error} />
              </div>
            </div>
            <SubmitBtn label="Add event" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddEvent;
