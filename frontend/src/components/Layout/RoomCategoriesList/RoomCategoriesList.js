import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import "./RoomCategoriesList.scss";

const RoomCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    fetch("http://localhost:5200/api/categories-list")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  const deleteCategory = async () => {
    if (!selectedCategory) return;

    const response = await fetch(
      `http://localhost:5200/api/delete-roomCategory/${selectedCategory._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const result = await response.json();

    if (response.ok && result.deletedCategory) {
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id)
      );
      setErrorMessage(""); // očisti poruku
      setShowModal(false);
    } else {
      setErrorMessage(result.error || "Error deleting category.");
    }
  };

  return (
    <div
      className={`categoriesContainer ${
        role === "admin" ? "admin-categoriesContainer" : ""
      }`}
    >
      <h2
        className={`categories-title ${
          role === "admin" ? "admin-categories-title" : ""
        }`}
      >
        Room Categories
      </h2>

      {!categories.length ? (
        <div className="no-data">
          <p>No categories found.</p>
          {isLoggedIn && role === "admin" && (
            <div className="addCategory">
              <Link to="/add-room-category">Add new category</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="categoriesTable">
            {categories.map((category) => (
              <div className="categoryCard" key={category._id}>
                <div className="categoryInfo">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>

                {role === "admin" && (
                  <Button
                    variant="red"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowModal(true);
                    }}
                    label={<i className="fa-solid fa-trash" />}
                  />
                )}
              </div>
            ))}
          </div>

          {role === "admin" && (
            <div className="addCategory">
              <Link to="/add-room-category">Add new category</Link>
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setErrorMessage(""); // reset pri zatvaranju
        }}
        handleConfirm={deleteCategory}
        title="Confirm Deletion"
        body={`Are you sure you want to delete ${selectedCategory?.name?.toUpperCase()} category?`}
        confirmLabel="Delete"
        closeLabel="Cancel"
        error={errorMessage}
      />
    </div>
  );
};

export default RoomCategoriesList;
