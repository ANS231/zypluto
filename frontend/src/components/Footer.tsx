import { useNavigate } from "react-router-dom";
import logo from "../assets/Capture.Expert_logo.png";
import "./footer.css";

const Footer = () => {

  const navigate = useNavigate();

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (

    <footer className="footer">

      <div className="footer-container">

        {/* LEFT */}

        <div className="footer-brand">

          {/* LOGO */}

          <div
            className="footer-logo-wrapper"
            onClick={() => {
              navigate("/");
              goTop();
            }}
          >

            <img
              src={logo}
              alt="Capture.Expert Logo"
              className="footer-logo-img"
            />

            <h3 className="footer-logo">
              Capture<span>.Expert</span>
            </h3>

          </div>

          <p>
            Capture.Expert helps businesses collect,
            process, enhance, and integrate
            high-quality datasets with AI-powered
            automation, intelligent workflows,
            analytics, and scalable enterprise
            solutions.
          </p>

          <div className="footer-company-details">

            <p>
              🇺🇸 United States Address:
              1301 Presidential Dr #200,
              Richardson, TX 75081,
              United States
            </p>

            <p>
              🇮🇳 India Address:
              5 Baikuntha Ghosh Road,
              Kasba, Kolkata, Pincode - 700042, West Bengal, India
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="footer-right">

          <div className="footer-right-container">

            <div className="footer-grid">

              {/* PRODUCT */}

              <div className="footer-col">

                <h4>Product</h4>

                <p
                  onClick={() => {
                    navigate("/");
                    setTimeout(goTop, 100);
                  }}
                >
                  Home
                </p>

                <p
                  onClick={() => {
                    navigate("/about");
                    setTimeout(goTop, 100);
                  }}
                >
                  About
                </p>

              </div>

              {/* SUPPORT */}

              <div className="footer-col">

                <h4>Support</h4>

                <p>
                  📞 US:
                  +1 (214) 794-7760
                </p>

                <p>
                  📞 India:
                  +91 9123745946
                </p>


                {/* HELP SECTION */}

                <div className="footer-help-box">

                  <h5>Need Help Assistance?</h5>

                  <p>Support@capture.expert</p>

                  <p>Sales@capture.expert</p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        © {new Date().getFullYear()}
        {" "}
        Capture.Expert.
        All rights reserved.

      </div>

    </footer>

  );
};

export default Footer;