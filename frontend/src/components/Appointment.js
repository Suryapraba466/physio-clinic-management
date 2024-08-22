import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/create-record.css";

import checklist from "./landing-page-imgs/checklist.png";
import errorimg from "./landing-page-imgs/error.png";

const Appointment = () => {
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showServerNetworkErrorToast, setShowServerNetworkErrorToast] =
    useState(false);
  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);
  const [showAppointmentFail1, setShowAppointmentFail1] = useState(false);
  const [showAppointmentFail2, setShowAppointmentFail2] = useState(false);
  const [tokenid, setTokenid] = useState("");

  const [inputValidation, setInputValidation] = useState({
    name: true,
    date: true,
    mobileNo: true,

    // ... add other fields here
  });
  const [appointments, setAppointments] = useState({
    patients: [
      {
        name: "",
        pid: "",
        mobileNo: "",
        date: "",
      },
    ],
  });

  console.log("appo", appointments);

  const clinicName = localStorage.getItem("clinicName");
  const doctorName = localStorage.getItem("doctorName");

  // Check if the values are not null or undefined before using them
  if (clinicName && doctorName) {
    // Do something with the values, such as displaying them on the UI
    console.log("Clinic Name in appointment page:", clinicName);
    console.log("Doctor Name in appointment page:", doctorName);
  } else {
    // Handle the case where the values are not found in localStorage
    console.log(
      "Clinic Name or Doctor Name not found in localStorage in appointment page"
    );
  }
  const setInputClasses = (fieldName, isValid) => {
    setInputValidation((prevValidation) => ({
      ...prevValidation,
      [fieldName]: isValid,
    }));
  };
  const bookAppointment = async () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    try {
      setInputClasses("name", !!appointments.patients[0].name.trim());

      setInputClasses("mobileNo", !!appointments.patients[0].mobileNo.trim());
      setInputClasses("date", !!appointments.patients[0].date.trim());

      // Check all fields and update input classes
      const { name, mobileNo, date } = appointments.patients[0]; // Extract individual fields from appointments

      // Check if all input fields are valid
      if (
        inputValidation.name &&
        inputValidation.mobileNo &&
        inputValidation.date
      ) {
        // Execute only if input validation is successful
        const response = await axios.post(
          "https://rehab-rythm-ti17.vercel.app/api/book_appointment",
          {
            name,
            mobileNo,
            date: date, // Send client-side date and time
            clinicName,
            doctorName,
          }
        );

        console.log("Server returned status code:", response.status);

        if (response.status === 201) {
          console.log("success");
          // alert("Appointment Booked Successfully");
          setShowAppointmentSuccess(true);
          setTimeout(() => {
            setShowAppointmentSuccess(false);
          }, 5300);
        } else {
          throw new Error("Failed to create record");
        }
      } else {
        // Handle case where input validation fails
        console.log("Input validation failed.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log(error.response.data.message); // Print the message from the server
          console.log("Token ID:", error.response.data.tokenid); // Print the token ID from the server
          // alert(`${error.response.data.message}\nToken ID: ${error.response.data.tokenid}`);
          setTokenid(error.response.data.tokenid);
          if (
            error.response.data.message === "Patient is waiting in the clinic"
          ) {
            setShowAppointmentFail1(true);
            setTimeout(() => {
              setShowAppointmentFail1(false);
            }, 5300);
          } else if (
            error.response.data.message === "Appointment already exists"
          ) {
            setShowAppointmentFail2(true);
            setTimeout(() => {
              setShowAppointmentFail2(false);
            }, 5300);
          }
        } else {
          console.log("Server error:", error.response.status);
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } else {
        console.log("Network error:", error.message);
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Specific validation based on the field name
    switch (name) {
      case "name":
        if (/^[a-zA-Z ]*$/.test(value)) {
          setAppointments((prevAppointments) => ({
            ...prevAppointments,
            patients: [
              {
                ...prevAppointments.patients[0], // Keep other fields unchanged
                [name]: value,
              },
            ],
          }));
          setInputClasses(name, /^[a-zA-Z ]*$/.test(value.trim()));
        } else {
          alert("Please enter only alphabets for the field.");
        }
        break;

      // case "pid":
      //     if (/^[a-zA-Z0-9 ]*$/.test(value)) {
      //         setAppointments((prevAppointments) => ({
      //             ...prevAppointments,
      //             patients: [
      //                 {
      //                     ...prevAppointments.patients[0], // Keep other fields unchanged
      //                     [name]: value,
      //                 }
      //             ]
      //         }));

      //     } else {
      //         alert("Please enter only alphabets and numbers for the field.");
      //     }
      //     break;
      case "mobileNo":
        // Allow only numeric values with a maximum length of 13
        if (/^\d{0,10}$/.test(value)) {
          setAppointments((prevAppointments) => ({
            ...prevAppointments,
            patients: [
              {
                ...prevAppointments.patients[0], // Keep other fields unchanged
                [name]: value,
              },
            ],
          }));
          setInputClasses(name, /^\d{0,10}$/.test(value.trim()));
        } else {
          alert("Please enter a valid mobile number with maximum 10 digits.");
        }
        break;

      case "date":
        // Validate if date is not empty
        if (value.trim()) {
          setAppointments((prevAppointments) => ({
            ...prevAppointments,
            patients: [
              {
                ...prevAppointments.patients[0], // Keep other fields unchanged
                [name]: value,
              },
            ],
          }));
          setInputClasses(name, true);
        } else {
          setInputClasses(name, false);
        }
        break;

      default:
        break;
    }
  };

  const handleToastClose = () => {
    if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    } else if (showServerNetworkErrorToast) {
      setShowServerNetworkErrorToast(false);
    } else if (showAppointmentFail1) {
      setShowAppointmentFail1(false);
    } else if (showAppointmentFail2) {
      setShowAppointmentFail2(false);
    } else if (showAppointmentSuccess) {
      setShowAppointmentSuccess(false);
    }
  };

  return (
    <div>
      {showAppointmentSuccess && (
        <div className="toast toast-active">
          <div className="toast-content">
            <img src={checklist} alt="Success" className="toast-check" />
            <div className="toast-message">
              {showAppointmentSuccess && (
                <>
                  <span className="toast-text toast-text-1">Success</span>
                  <span className="toast-text toast-text-2">
                    Appointment Booked Successfully!
                  </span>
                </>
              )}
            </div>
            <div className="toast-close-image" onClick={handleToastClose}>
              <img src="./uploads/success-close.png"></img>
            </div>
          </div>
          <div className="toast-progress toast-active"></div>
        </div>
      )}

      {(showNetworkErrorToast ||
        showAppointmentFail1 ||
        showAppointmentFail2) && (
        <div className="toast toast-active">
          <div className="toast-content">
            <img src={errorimg} alt="Error" className="toast-error-check" />
            <div className="toast-message">
              {showNetworkErrorToast && (
                <span className="toast-text toast-text-2">
                  Network disconnected. Please check your network!
                </span>
              )}
              {showServerNetworkErrorToast && (
                <span className="toast-text toast-text-2">
                  Internal Server Error! Try after some time.
                </span>
              )}
              {showAppointmentFail1 && (
                <span className="toast-text toast-text-2">
                  The patient is currently awaiting consultation in the clinic
                  Token ID: {tokenid}
                </span>
              )}
              {showAppointmentFail2 && (
                <span className="toast-text toast-text-2">
                  Appointment already exists Token ID: {tokenid}
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
      <div className="appointment-super-container">
        <div class="appointment-record-container">
          <div class="create-record-form-container-12">
            <h1 class="create-record-title">Create Appointment</h1>
            <div class="create-record-row-12">
              <div class="create-record-col">
                {/* <div
                            class={`create-record-form-group-name-normal"`}
                        >
                            <span>Patient Id&nbsp;&nbsp;&nbsp;</span>
                            <input

                                type="text"
                                name="pid"
                                placeholder="Patient's id"
                                value={appointments.patients[0].pid}
                                onChange={handleInputChange}
                                required
                                className={`create-record-form-field-gender${!inputValidation.gender ? "-abnormal" : ""
                            }`}
                            />
                        </div> */}
                <div
                  className={`create-record-form-group-age${
                    !inputValidation.name ? "-abnormal" : ""
                  }`}
                >
                  <span>Name&nbsp;&nbsp;&nbsp;</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Patient's name"
                    value={appointments.patients[0].name}
                    onChange={handleInputChange}
                    required
                    className={`create-record-form-field-gender${
                      !inputValidation.name ? "-abnormal" : ""
                    }`}
                  />
                </div>
                <div
                  className={`create-record-form-group-age${
                    !inputValidation.mobileNo ? "-abnormal" : ""
                  }`}
                >
                  <span>Mobile Number&nbsp;&nbsp;&nbsp;</span>
                  <input
                    type="text"
                    name="mobileNo"
                    placeholder="Patient's mobile no"
                    value={appointments.patients[0].mobileNo}
                    onChange={handleInputChange}
                    required
                    className={`create-record-form-field-gender${
                      !inputValidation.mobileNo ? "-abnormal" : ""
                    }`}
                  />
                </div>
                <div className="appointment-date-book-flex">
                  <div
                    className={`create-record-form-group-age${
                      !inputValidation.date ? "-abnormal" : ""
                    }`}
                  >
                    <span>Date&nbsp;&nbsp;&nbsp;</span>
                    <input
                      type="date"
                      name="date"
                      placeholder="Appointment Date"
                      value={appointments.patients[0].date}
                      onChange={handleInputChange}
                      required
                      className={`create-record-form-field-gender${
                        !inputValidation.date ? "-abnormal" : ""
                      }`}
                    />
                  </div>

                  <input
                    onClick={bookAppointment}
                    value="Book Appointment"
                    class="create-record-submit-btn"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-img-container">
          <img
            src="./uploads/appointment-image.png"
            className="appointment-image"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
