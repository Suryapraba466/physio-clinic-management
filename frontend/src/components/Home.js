import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/home.css";
import Login from "./Login";

import logoimg from "../components/images/yoga.png";

import stomachache from "./content icons/stomachache.png";
import Orthopedic from "./content icons/Orthopedic 2.png";
import neuron from "./content icons/neuron.png";
import Cardio from "./content icons/Cardio.png";
import Respiratory from "./content icons/Respiratory.png";
import sports from "./content icons/sports 1.png";
import Geriatric from "./content icons/Geriatric 1.png";
import Paediatric from "./content icons/Paediatric 1.png";
import counseling from "./content icons/counseling.png";
import Orthopedicrehabilitationwide2 from "./imagecontent/Orthopedicrehabilitationwide2.jpg";
import Neurologicalrehabilitationwide from "./imagecontent/Neurological rehabilitation wide.jpg";
import cardiorehabilitationwide from "./imagecontent/cardio rehabilitation wide.jpg";
import Respiratoryrehabilitationwide from "./imagecontent/Respiratoryrehabilitationwide.jpg";
import Sportswide from "./imagecontent/Sports wide.jpg";
import Geriatricrehabilitationwide from "./imagecontent/Geriatric rehabilitation wide 1.jpg";
import Paediatricrehabilitationwide from "./imagecontent/Paediatric rehabilitation wide.jpg";
import Fitnessandpsychologicalcounselingwide from "./imagecontent/Fitness and psychological counseling wide 1.jpg";
import Fitnessandpsychologicalcounseling from "./imagecontent/Fitness and psychological counseling -1.jpg";
import location from "./images/location.png";
import call from "./images/telephone.png";
import whatsapp from "./images/whatsapp.png";
import mail from "./images/gmail.png";
import facebook from "./images/facebook.png";
import instagram from "./images/instagram.png";
import back from "./images/back.png";
import lpimage from "./images/lp-image.png";
import painwide from "./imagecontent/pain-wide.jpg";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  useEffect(() => {
    const textContainers = document.querySelectorAll(
      ".specialities-desc .text-container"
    );

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"; // Make the text visible when it intersects with the viewport
          }
        });
      },
      { threshold: 0.5 }
    ); // Trigger when 50% of the element is visible

    textContainers.forEach((textContainer) => {
      observer.observe(textContainer);
    });

    for (let i = 1; i <= 9; i++) {
      const button = document.getElementById(`button${i}`);
      const container = document.getElementById(`container${i}`);

      button.addEventListener("click", function () {
        container.scrollIntoView({ behavior: "smooth" });
      });
    }

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const target = this.getAttribute("data-target");
        const targetElement = document.querySelector("." + target);
        targetElement.scrollIntoView({ behavior: "smooth" });
      });
    });

    const aboutButton = document.querySelector(".about-button");
    const patientCards = document.querySelector(".home-patient-cards");

    aboutButton.addEventListener("click", function () {
      patientCards.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(false); // Define navVisible state

  const handleToggleNav = () => {
    setNavVisible(!navVisible); // Toggle navVisible state
  };

  const handleClick = (event) => {
    event.preventDefault();
    const phoneNumber = "9486405778"; // Replace "YOUR_PHONE_NUMBER" with the desired phone number
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(url, "_blank");
  };

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div class="home-root-element">
      {!showLogin && (
        <>
          <div className={`nav-back ${scrolled ? "scrolled" : ""}`}>
            <div className="logo-home">
              <img src={logoimg} alt="Logo" />
              <h1>RehabRythm</h1>
            </div>
            <nav className={`nav-menu ${navVisible ? "" : "open"}`}>
              <div>
                <a href="#" className="nav-link" data-target="lp-container" onClick={handleToggleNav}>
                  Home
                </a>
                <a
                  href="#"
                  className="nav-link"
                  data-target="home-patient-cards" onClick={handleToggleNav}
                >
                  Our &nbsp;Specialities
                </a>
                <a href="#" className="nav-link" data-target="about-us" onClick={handleToggleNav}>
                  About Us
                </a>
                <a href="#" className="nav-link" data-target="footer" onClick={handleToggleNav}>
                  Contact Us
                </a>
                <a
                  href="#"
                  className="nav-link"
                  data-target="footer"
                  onClick={() => {
                    handleLoginClick();
                    handleToggleNav();
                  }}                  
                >
                  Login
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

          <div className="lp-container">
            <div className="left-container-lp">
              <div className="main-heading">
                <h1>Saai Physiotheraphy Clinic</h1>
                <div className="sub-main-heading">
                  <h2>
                    Restoring movement, enhancing well-being. Your path to
                    optimal health through personalized care and expert
                    physiotherapy services.
                  </h2>
                  <a
                    href="#"
                    className="nav-link"
                    data-target="footer"
                    onClick={handleLoginClick}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
            <div className="image-container-lp">
              {/*<img
            src="./images/lp-image.png"
            alt=""
  />*/}
              <img src={lpimage} alt="lp" />
            </div>
          </div>
          <div className="home-patient-cards">
            <div className="our-specialities-heading">
              <h5>Our &nbsp; Specialities</h5>
            </div>

            <div className="list-of-cards-container">
              <div className="list-of-cards-1">
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card pain">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/* <img src="./content icons/stomachache.png" />*/}
                              <img src={stomachache} alt="Image" />
                            </div>
                          </div>
                          <p>Pain</p>
                          <button id="button1">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card orthopedic">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle2">
                              {/*} <img src="./home-patient-content icons/Orthopedic 2.png" />*/}
                              <img src={Orthopedic} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Orthopedic <br></br> Rehabilitation
                          </p>
                          <button id="button2">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card neurological">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle3">
                              {/*<img src="./home-patient-content home-patient-icons/neuron.png" />*/}
                              <img src={neuron} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Neurological <br></br> Rehabilitation
                          </p>
                          <button id="button3">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card cardio">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle4">
                              {/*<img src="./home-patient-content home-patient-icons/Cardio.png" />*/}
                              <img src={Cardio} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Cardio <br></br> Rehabilitation
                          </p>
                          <button id="button4">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card respiratory">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/*<img src="./home-patient-content home-patient-icons/Respiratory.png" />*/}
                              <img src={Respiratory} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Respiratory <br></br> Rehabilitation
                          </p>
                          <button id="button5">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card sports">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/*<img src="./home-patient-content home-patient-icons/sports 1.png" />*/}
                              <img src={sports} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Sports <br></br> Rehabilitation
                          </p>
                          <button id="button6">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card geriatric">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/*<img src="./home-patient-content home-patient-icons/Geriatric 1.png" />*/}
                              <img src={Geriatric} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Geriatric <br></br> Rehabilitation
                          </p>
                          <button id="button7">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card pediatric">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/*<img src="./home-patient-content home-patient-icons/Paediatric 1.png" />*/}
                              <img src={Paediatric} alt="Image" />
                            </div>
                          </div>
                          <p>
                            Pediatric <br></br> Rehabilitation
                          </p>
                          <button id="button8">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-patient-card1">
                  <div className="home-patient-slide home-patient-slide1">
                    <div className="home-patient-content">
                      <div className="home-patient-icon">
                        <div className="home-patient-card fitness">
                          <div className="overlay-wrap-con">
                            <div className="home-patient-overlay"></div>
                            <div className="circle1">
                              {/*<img src="./home-patient-content home-patient-icons/counseling.png" />*/}
                              <img src={counseling} alt="Image" />
                            </div>
                          </div>
                          <p>Fitness and Psychological Counseling</p>
                          <button id="button9">
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="specialities-desc">
            <div className="image-container1" id="container1">
              {/*<img src="./imagehome-patient-content/pain-wide.jpg" alt="Image" />*/}
              <img src={painwide} alt="Image" />

              <div className="left-transition-container">
                <div className="desc-overlay"></div>
                <div className="text-container">
                  <h2>Pain</h2>
                  <p>
                    Experience compassionate care at our hospital, where we
                    specialize in orthopedic rehabilitation. Pain is thoroughly
                    assessed, and our expert team implements evidence-based
                    approaches for effective treatment. From diagnosis to
                    personalized plans, we prioritize your well-being. Our
                    commitment to excellence ensures a comprehensive and
                    efficient solution to orthopedic challenges.
                  </p>
                </div>
              </div>
            </div>
            <div className="image-container2" id="container2">
              {/*<img
            src="./imagecontent/Orthopedicrehabilitationwide2.jpg"
            alt="Image"
  />*/}
              <img src={Orthopedicrehabilitationwide2} alt="Image" />
              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Orthopedic Rehabilitation</h2>
                <p>
                  Discover optimal recovery at our hospital with expert
                  Orthopedic Rehabilitation. We specialize in comprehensive care
                  for musculoskeletal issues, crafting personalized treatment
                  plans for each patient. Our dedicated team, including
                  orthopedic surgeons and skilled therapists, collaborates to
                  enhance strength, flexibility, and function. From assessing
                  pain to post-surgical recovery, we prioritize your well-being.
                </p>
              </div>
            </div>
            <div className="image-container3" id="container3">
              {/*<img
            src="./imagecontent/Neurological rehabilitation wide.jpg"
            alt="Image"
/>*/}
              <img src={Neurologicalrehabilitationwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Neurological Rehabilitation</h2>
                <p>
                  Embark on a transformative journey with our Neurological
                  Rehabilitation program at Saai Physiotheraphy Clinic.
                  Specializing in personalized care, our expert team, comprising
                  neurologists and skilled therapists, collaborates to address a
                  spectrum of neurological issues. From tailored treatment plans
                  to cutting-edge therapies, we prioritize your well-being at
                  every step.
                </p>
              </div>
            </div>
            <div className="image-container4" id="container4">
              {/*<img src="./imagecontent/cardio rehabilitation wide.jpg" alt="Image" />*/}
              <img src={cardiorehabilitationwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Cardio Rehabilitation</h2>
                <p>
                  Revitalize your heart's strength through our leading-edge
                  Cardio Rehabilitation program at Saai- Physiotheraphy clinic.
                  At the forefront of our team are accomplished cardiologists
                  and skilled therapists who meticulously customize
                  rehabilitation plans to cater to your unique cardiovascular
                  requirements. Prioritizing heart health, we offer personalized
                  exercise routines and pragmatic lifestyle advice. Within our
                  hospital, we adeptly navigate cardiac concerns by seamlessly
                  integrating advanced techniques with a compassionate and
                  patient-focused approach.
                </p>
              </div>
            </div>
            <div className="image-container5" id="container5">
              {/*<img
            src="./imagecontent/Respiratoryrehabilitationwide.jpg"
            alt="Image"
/>*/}
              <img src={Respiratoryrehabilitationwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Respiratory Rehabilitation</h2>
                <p>
                  Revitalize your respiratory health with our expert
                  physiotherapy clinic services. Tailored rehabilitation
                  programs ensure optimal lung function and overall well-being.
                  Breathe easier, live better.
                </p>
              </div>
            </div>
            <div className="image-container6" id="container6">
              {/*<img src="./imagecontent/Sports wide.jpg" alt="Image" />*/}
              <img src={Sportswide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Sports Rehabilitation</h2>
                <p>
                  Unlock your full athletic potential with our Sports
                  Rehabilitation program at Saai-Physiotheraphy Clinic. Our
                  specialized approach to Orthopedic rehabilitation focuses on
                  addressing musculoskeletal issues common in sports injuries.
                  Our experienced team utilizes advanced techniques and
                  evidence-based practices to accelerate recovery and restore
                  optimal function. From personalized exercise plans to targeted
                  interventions, we prioritize your return to peak performance.
                </p>
              </div>
            </div>
            <div className="image-container7" id="container7">
              {/*<img
            src="./imagecontent/Geriatric rehabilitation wide 1.jpg"
            alt="Image"
/>*/}
              <img src={Geriatricrehabilitationwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Geriatric Rehabilitation</h2>
                <p>
                  In the realm of Orthopedic Rehabilitation, our clinic
                  prioritizes the unique needs of our elderly patients through
                  Geriatric Rehabilitation. With a focus on musculoskeletal
                  health, our experienced team employs evidence-based strategies
                  to address orthopedic issues commonly faced by seniors. From
                  targeted exercises to specialized interventions, we provide
                  comprehensive care aimed at enhancing mobility and restoring
                  function.
                </p>
              </div>
            </div>
            <div className="image-container8" id="container8">
              {/*<img
            src="./imagecontent/Paediatric rehabilitation wide.jpg"
            alt="Image"
/>*/}
              <img src={Paediatricrehabilitationwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Paediatric Rehabilitation</h2>
                <p>
                  Specializing in Pediatric Rehabilitation, our clinic
                  prioritizes the unique needs of young patients facing
                  Orthopedic challenges. Our expert team employs evidence-based
                  strategies to address musculoskeletal issues in children. From
                  age-appropriate exercises to individualized interventions, we
                  provide comprehensive care focused on enhancing mobility and
                  restoring function.
                </p>
              </div>
            </div>
            <div className="image-container9" id="container9">
              {/*<img
            src="./imagecontent/Fitness and psychological counseling wide 1.jpg"
            alt="Image"
/>*/}
              <img src={Fitnessandpsychologicalcounselingwide} alt="Image" />

              <div className="desc-overlay"></div>
              <div className="text-container">
                <h2>Fitness and Psychological Counseling</h2>
                <p>
                  In addressing Orthopedic rehabilitation, our clinic takes a
                  comprehensive approach by integrating fitness and
                  psychological counseling. We recognize the interconnected
                  nature of physical and mental well-being in the recovery
                  process. Our experienced team focuses on evidence-based
                  strategies, incorporating targeted exercises for
                  musculoskeletal health and providing psychological support to
                  enhance overall rehabilitation.
                </p>
              </div>
            </div>
          </div>
          <div className="about-us">
            <div className="our-specialities-heading">
              <span style={{ "--i": 1 }}>A</span>
              <span style={{ "--i": 2 }}>b</span>
              <span style={{ "--i": 3 }}>o</span>
              <span style={{ "--i": 4 }}>u</span>
              <span style={{ "--i": 5 }}>t</span>
              <span style={{ "--i": 6 }}>&nbsp;</span>
              <span style={{ "--i": 7 }}>U</span>
              <span style={{ "--i": 8 }}>s</span>
            </div>
            <div className="about-p">
              <p>
                Experience compassionate care at our hospital, where we
                specialize in orthopedic rehabilitation. Pain is thoroughly
                assessed, and our expert team implements evidence-based
                approaches for effective treatment. From diagnosis to
                personalized plans, we prioritize your well-being. Our
                commitment to excellence ensures a comprehensive and efficient
                solution to orthopedic challenges. At our hospital, expect a
                dedicated team working tirelessly to alleviate pain and restore
                functionality, tailored to your unique needs. Your journey to
                recovery starts here, where we focus on your health with
                expertise and compassion.
              </p>
              <button className="about-button">Explore Our Specialities</button>
            </div>
            <div className="about-image">
              {/*<img src="./imagecontent/Fitness and psychological counseling -1.jpg" />*/}
              <img src={Fitnessandpsychologicalcounseling} alt="Image" />
            </div>
          </div>
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-row">
                <div className="footer-col">
                  <h4>Opening Hours</h4>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>Saturday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                      <tr>
                        <td>Sunday</td>
                        <td>Closed</td>
                      </tr>
                      <tr>
                        <td>Monday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                      <tr>
                        <td>Tuesday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                      <tr>
                        <td>Wednesday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                      <tr>
                        <td>Thursday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                      <tr>
                        <td>Friday</td>
                        <td>09:30am - 08:30pm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="footer-col">
                  <h4>Nav Bar</h4>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="nav-link"
                        data-target="lp-container"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="nav-link"
                        data-target="home-patient-cards"
                      >
                        Our Specialities
                      </a>
                    </li>
                    <li>
                      <a href="#" className="nav-link" data-target="about-us">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="nav-link" data-target="footer">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Location</h4>
                  <ul>
                    <li>
                      {/*<img
                    src="./images/location.png"
                    alt="Location Icon"
                    width="20"
                    height="20"
/>*/}
                      <img src={location} alt="Image" />

                      <p>Sakthi Nagar, Thindal, Tamil Nadu, India.</p>
                    </li>
                  </ul>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3912.2203305633284!2d77.6818250748133!3d11.318599988865035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDE5JzA3LjAiTiA3N8KwNDEnMDMuOCJF!5e0!3m2!1sen!2sin!4v1710318588731!5m2!1sen!2sin"
                    width="400"
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="footer-col">
                  <h4>follow us</h4>
                  <div className="social-links">
                    <a href="tel:9486405778">
                      <img src={call} alt="Call" />
                    </a>
                    <a href="#" onClick={handleClick}>
                      <img src={whatsapp} alt="Whatsapp" />
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=suryapraba466@gmail.com">
                      <img src={mail} alt="Mail" />
                    </a>
                    <a href="https://www.facebook.com/your-profile">
                      <img src={facebook} alt="Facebook" />
                    </a>
                    <a href="https://www.instagram.com/your-profile">
                      <img src={instagram} alt="Instagram" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {showLogin && <Login />}
    </div>
  );
};

export default Home;
