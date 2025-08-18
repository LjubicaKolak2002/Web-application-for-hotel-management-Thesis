import { emailRegex, passwordRegex, phoneRegex } from "./constants";

export function validateField(name, value, formData) {
  let error = "";

  switch (name) {
    case "name":
    case "surname":
    case "username":
      if (!value.trim()) error = "This field is required.";
      break;
    case "email":
      if (!emailRegex.test(value)) error = "Invalid email format.";
      break;
    case "phone":
      if (!phoneRegex.test(value)) error = "Phone must have 7-15 digits.";
      break;
    case "password":
      if (!passwordRegex.test(value))
        error = "At least 8 chars, 1 letter, 1 number.";
      break;
    case "password2":
      if (value !== formData.password) error = "Passwords do not match.";
      break;
    default:
      break;
  }

  return error;
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
