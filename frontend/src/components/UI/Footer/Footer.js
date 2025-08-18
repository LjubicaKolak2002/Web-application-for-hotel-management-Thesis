import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <i className="fa-solid fa-phone">
          <span> +385 91 123 4567</span>
        </i>

        <i className="fa-solid fa-envelope">
          <span> hotelio.split@gmail.com</span>
        </i>

        <span>check-in: 2p.m.</span>
        <span>check-out: 10a.m.</span>
      </div>
      <div className="footer-copy-rights">
        <div className="footer-copy-rights-text">
          &copy; 2025 App Hotelio. All Rights Reserved
        </div>
        <div className="footer-right">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-facebook-messenger"></i>
        </div>
      </div>
    </div>
  );
};

export default Footer;
