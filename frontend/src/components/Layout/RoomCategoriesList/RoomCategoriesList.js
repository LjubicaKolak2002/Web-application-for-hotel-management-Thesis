import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";

const RoomCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  async function getCategories() {
    const response = await fetch(
      "http://localhost:5200/api/categories-list",
      options
    );
    const json = await response.json();
    setCategories(json);
  }

  async function deleteCategory() {
    if (!selectedCategory) return;

    const response = await fetch(
      `http://localhost:5200/api/delete-roomCategory/${selectedCategory._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const result = await response.json();

    if (result.deletedCategory) {
      setCategories(
        categories.filter((category) => category._id !== selectedCategory._id)
      );
    }
    setShowModal(false);
  }

  useEffect(() => {
    getCategories();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <>
      <h1>Room categories</h1>
      {role === "admin" && <Link to="/add-room-category">+New category</Link>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              {role === "admin" && (
                <td>
                  <>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={deleteCategory}
        title="Confirm Deletion"
        body={`Are you sure you want to delete ${selectedCategory?.name.toUpperCase()} category?`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </>
  );
};

export default RoomCategoriesList;
