import React from "react";

export const Logout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};
export default Logout;