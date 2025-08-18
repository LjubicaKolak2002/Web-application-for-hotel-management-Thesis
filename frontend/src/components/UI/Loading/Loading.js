import React from "react";
import { BeatLoader } from "react-spinners";
import "./Loading.scss";

const LoadingComponent = () => {
  const loaderStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  return (
    <div style={loaderStyles}>
      <BeatLoader color="#5c5470" size={20} />
    </div>
  );
};

export default LoadingComponent;
