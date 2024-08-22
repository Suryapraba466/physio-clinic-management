import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/login-page.css";
import bvambient from "./bvambient.js";
import "./CSS/flower.css";
import "./CSS/power-button.css";
import powerButtonImg from "./power-button.png";
import errorimg from "./landing-page-imgs/error.png";
import logoimg from "../components/images/yoga.png";

const Login = () => {
  const [login_id, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [handleSubmitPressed, setHandleSubmitPressed] = useState(false);
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);

  const overlayClass = `loading-overlay${loading ? " visible" : ""}`;
  const handleLoginIDChange = (e) => {
    setLoginID(e.target.value);
  };

  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(false); // Define navVisible state

  const handleToggleNav = () => {
    setNavVisible(!navVisible); // Toggle navVisible state
  };

  // const handleGoToHome = () => {
  //   console.log("home button is pressed");
  //   navigate("/");
  // }

  const handleCallClick = (event) => {
    event.preventDefault();
    const phoneNumber = event.currentTarget.getAttribute("data-phone");
    copyToClipboard(phoneNumber);
    // Optionally, you can provide feedback to the user
    alert("Phone number copied to clipboard: " + phoneNumber);
  };

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  // useEffect(() => {
  //     // Detect device type and set the state
  //     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //     isMobile ? setMobile(true) : setMobile(false);

  //     // Initialize BVAmbient object
  //     const demo1 = new bvambient({
  //         selector: "#ambient",
  //         fps: 60,
  //         max_transition_speed: 12000,
  //         min_transition_speed: 8000,
  //         particle_number: 30,
  //         particle_maxwidth: 60,
  //         particle_minwidth: 10,
  //         particle_radius: 50,
  //         particle_opacity: true,
  //         particle_colision_change: true,
  //         particle_background: "#48cae4",
  //         refresh_onfocus: true,
  //         particle_image: {
  //             image: false,
  //             src: ""
  //         },
  //         responsive: [
  //             {
  //                 breakpoint: 768,
  //                 settings: {
  //                     particle_number: "15"
  //                 }
  //             },
  //             {
  //                 breakpoint: 480,
  //                 settings: {
  //                     particle_number: "10"
  //                 }
  //             }
  //         ]
  //     });
  // }, []); // Empty dependency array to run only once when the component mounts

  const handleLoginPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    // Detect device type and set the state
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    isMobile ? setMobile(true) : setMobile(false);
  }, []);

  const handleSubmit = async (e) => {
    if (!navigator.onLine) {
      console.log("in upp date reccccccccccccccccc");
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setHandleSubmitPressed(true);
    e.preventDefault();
    setLoading(true); // Set loading to true when the submit button is clicked

    try {
      const response = await axios.post(
        `https://rehab-rythm-ti17.vercel.app/api/admin-login`,
        {
          login_id: login_id,
          password: password,
        }
      );
      if (response.data.success) {
        console.log("Login successful. Admin data:", response.data.admin);
        localStorage.setItem("clinicName", response.data.admin.clinicName);
        localStorage.setItem("doctorName", response.data.admin.doctorName);

        navigate("/AdminMenu", { state: { login_id: login_id } });
      } else {
        setLoginError("Invalid Login ID or password");
        setTimeout(() => {
          setLoginError("");
        }, 5000);
      }
    } catch (error) {
      setLoginError("Invalid login ID or password");
      setTimeout(() => {
        setLoginError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleToastClose = () => {
    if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    }
  };

  return (
    <div>
      {showNetworkErrorToast && (
        <div className="toast toast-active">
          <div className="toast-content">
            <img src={errorimg} alt="Error" className="toast-error-check" />
            <div className="toast-message">
              {showNetworkErrorToast && (
                <span className="toast-text toast-text-2">
                  Network disconnected. Please check your network!
                </span>
              )}
            </div>
            <div className="toast-close-image" onClick={handleToastClose}>
              <img src="./uploads/close.png"></img>
            </div>
          </div>
          <div className="toast-error-progress toast-active"></div>
        </div>
      )}
      {/* <div id="ambient" style={{ overflow: 'hidden', position: 'absolute', width: '100vw', height: '100vh' }}></div>*/}
      <div className="user-login-signup-container">
        <div className={`nav-back ${scrolled ? "scrolled" : ""}`}>
          <div className="logo-home">
            <img src={logoimg} alt="Logo" className="login-logo" />
            <h1 className="clinic-name">RehabRythm</h1>
          </div>
          <nav className={`nav-menu ${navVisible ? "" : "open"}`}>
            <div>
              <a href="/" className="nav-link" data-target="lp-container">
                Home
              </a>
              <a href="#" className="nav-link" data-target="home-patient-cards">
                Our &nbsp;Specialities
              </a>
              <a href="#" className="nav-link" data-target="about-us">
                About Us
              </a>
              <a href="#" className="nav-link" data-target="footer">
                Contact Us
              </a>
            </div>
          </nav>
          <div className="call-us">
            <a
              href="#"
              className="call-name"
              data-phone="9486405778"
              onClick={handleCallClick}
            >
              Call Us
            </a>
          </div>
          <div className={`min-width-toggler`}>
            <input type="checkbox" id="checkbox" onClick={handleToggleNav} />
            <label for="checkbox" class="toggle">
              <div class="bars" id="bar1"></div>
              <div class="bars" id="bar2"></div>
              <div class="bars" id="bar3"></div>
            </label>
          </div>
        </div>
        <div className="min-width-heading">Welcome to RehabRythm</div>

        <div className="container" id="container">
          <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleSubmit}>
              <h1>Log in</h1>

              {loginError && <p className="login-error">{loginError}</p>}
              {loginSuccess && (
                <p className="login-success">Login successful!</p>
              )}
              <div className="form-control">
                <input
                  className="input-field"
                  type="text"
                  required
                  value={login_id}
                  onChange={handleLoginIDChange}
                />
                <label>
                  <span style={{ transitionDelay: "0ms" }}>L</span>
                  <span style={{ transitionDelay: "50ms" }}>o</span>
                  <span style={{ transitionDelay: "100ms" }}>g</span>
                  <span style={{ transitionDelay: "150ms" }}>i</span>
                  <span style={{ transitionDelay: "200ms" }}>n</span>
                  <span style={{ transitionDelay: "200ms" }}> </span>
                  <span style={{ transitionDelay: "200ms" }}>i</span>
                  <span style={{ transitionDelay: "200ms" }}>d</span>
                </label>
              </div>
              <div className="form-control">
                <input
                  className="input-field"
                  type="password"
                  required
                  value={password}
                  onChange={handleLoginPasswordChange}
                />
                <label>
                  <span style={{ transitionDelay: "0ms" }}>P</span>
                  <span style={{ transitionDelay: "50ms" }}>a</span>
                  <span style={{ transitionDelay: "100ms" }}>s</span>
                  <span style={{ transitionDelay: "150ms" }}>s</span>
                  <span style={{ transitionDelay: "200ms" }}>w</span>
                  <span style={{ transitionDelay: "250ms" }}>o</span>
                  <span style={{ transitionDelay: "300ms" }}>r</span>
                  <span style={{ transitionDelay: "350ms" }}>d</span>
                </label>
              </div>
              <div className="login-btn-wrap">
                <button type="button" className="gohome">
                  <a href="/">Home</a>
                </button>
                <button
                  type="submit"
                  className="action-button color-btn"
                  disabled={loading}
                >
                  {loading
                    ? "loading..." // Display the loading symbol when loading is true
                    : "Log in"}
                </button>
              </div>
            </form>
          </div>
          <div className="right-container">
            <div className="right-container-content">
              <div className="right-container-content-panel right-container-content-right">
                <h1>Welcome to Physicare</h1>
                <p>Enter your personal details and start the journey with us</p>
              </div>
            </div>
          </div>
        </div>
        <div className="login-image1-container">
          <img src="./uploads/login-image1.jpg" alt="" />
        </div>
      </div>
      {/*  <a class="flower-btn">
                <div class="flower-wrapper">

                    <div class="flower flower1">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                    <div class="flower flower2">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                    <div class="flower flower3">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                    <div class="flower flower4">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                    <div class="flower flower5">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                    <div class="flower flower6">
                        <div class="petal one"></div>
                        <div class="petal two"></div>
                        <div class="petal three"></div>
                        <div class="petal four"></div>
                    </div>
                </div>
            </a>
            */}
    </div>
  );
};

export default Login;
