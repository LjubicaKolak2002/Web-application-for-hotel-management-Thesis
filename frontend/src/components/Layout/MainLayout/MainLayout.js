import "./MainLayout.scss";

const MainLayout = ({ children, isDoubleForm, offsetTop = 0 }) => {
  return (
    <div
      className={`main-layout ${isDoubleForm ? "double-form" : ""}`}
      style={{ paddingTop: offsetTop }}
    >
      <div className="main-layout-border">{children}</div>
    </div>
  );
};

export default MainLayout;
