import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CSS/in-patient-billing.css";
import checklist from "./landing-page-imgs/checklist.png";
import errorimg from "./landing-page-imgs/error.png";
import searchicon from "./images/magnifying-glass.png";

const InPatientBill = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNo, setMobileNo] = useState(false);
  const [showbill, setShowBill] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBillFillErrorToast, setShowBillFillErrorToast] = useState(false);
  const [showMobNotFillErrorToast, setShowMobNotFillErrorToast] =
    useState(false);
  const [showInvalidMobErrorToast, setShowInvalidMobErrorToast] =
    useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [appMessage, setAppMessage] = useState("");
  const [showServerNetworkErrorToast, setShowServerNetworkErrorToast] =
    useState(false);
  const [showUnexpectedErrorToast, setShowUnexpectedErrorToast] =
    useState(false);
  const searchInputRef = useRef(null); // Ref for the search input field

  useEffect(() => {
    // Focus on the search input field when the component mounts
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    const button = document.querySelector("button");
    const toast = document.querySelector(".toast");
    const closeIcon = document.querySelector(".toast-close");
    const progress = document.querySelector(".toast-progress");

    if (button && toast && closeIcon && progress) {
      let timer1, timer2;

      const handleButtonClick = () => {
        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
          toast.classList.remove("active");
        }, 5000);

        timer2 = setTimeout(() => {
          progress.classList.remove("active");
        }, 5300);
      };

      const handleCloseClick = () => {
        toast.classList.remove("active");

        setTimeout(() => {
          progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
      };

      button.addEventListener("click", handleButtonClick);
      closeIcon.addEventListener("click", handleCloseClick);

      return () => {
        button.removeEventListener("click", handleButtonClick);
        closeIcon.removeEventListener("click", handleCloseClick);
      };
    }
  }, []);

  const overlayClass = `loading-overlay${
    loading || isLoading ? " visible" : ""
  }`;
  const msgoverlay = `loading-overlay${
    !loading && appMessage ? " visible" : ""
  }`;

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    pid: "",
    gender: "",
    age: "",
  });

  const [patient, setPatient] = useState({
    mobileNumber: "",
    roomNumber: "",
    admissionDate: "",
    dischargeDate: "",
    totalDays: "",
    visitingBill: "",
    physioBill: "",
    nursingBill: "",
    otherExpenses: "",
    amountPerDay: "",
    paymentMode: "",
  });
  console.log(patient);
  const isBillDetailsInPatientFilled = () => {
    return (
      patient.roomNumber &&
      patient.admissionDate &&
      patient.dischargeDate &&
      patient.totalDays &&
      patient.visitingBill &&
      patient.physioBill &&
      patient.nursingBill &&
      patient.otherExpenses &&
      patient.paymentMode &&
      patient.amountPerDay &&
      patient.billAmount
    );
  };

  const clinicName = localStorage.getItem("clinicName");
  const doctorName = localStorage.getItem("doctorName");

  // Check if the values are not null or undefined before using them
  if (clinicName && doctorName) {
    // Do something with the values, such as displaying them on the UI
    console.log("Clinic Name in inbill page:", clinicName);
    console.log("Doctor Name in inbill page:", doctorName);
  } else {
    // Handle the case where the values are not found in localStorage
    console.log(
      "Clinic Name or Doctor Name not found in localStorage in inbill page"
    );
  }

  const continueToBill = () => {
    const billfill = isBillDetailsInPatientFilled();
    console.log("billfill", billfill);

    if (billfill) {
      console.log("jjjj");
      createInPatientBill();
    } else {
      setShowBillFillErrorToast(true);

      setTimeout(() => {
        setShowBillFillErrorToast(false);
      }, 5300);
    }
  };

  const validateMobileNumber = async () => {
    setLoading(false);

    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    const digitCount = patient.mobileNumber.replace(/\D/g, "").length; // Count only digits

    // Check if the number of digits is between 6 and 11
    if (digitCount > 5 && digitCount < 12) {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://rehab-rythm-ti17.vercel.app/api/get_patient_details",
          {
            params: {
              mobileNumber: patient.mobileNumber, // Filter by institute_name
              clinicName: clinicName,
              doctorName: doctorName,
            },
          }
        );
        if (response.status === 200) {
          const foundPatientRecord = response.data;
          console.log("Found Patient Record:", foundPatientRecord);
          setPatientDetails(foundPatientRecord);
          setMobileNo(true);
          setShowBill(true);
        } else if (response.status === 404) {
          setShowInvalidMobErrorToast(true);
          setTimeout(() => {
            setShowInvalidMobErrorToast(false);
          }, 5000);
        } else if (response.status === 500) {
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } catch (error) {
        setShowBill(false);
        setLoading(false);
        console.error("Error fetching patient details:", error);
        setMobileNo(false);
        setPatientDetails({ name: "", pid: "" }); // Clear patient details on error

        if (error.response && error.response.status === 404) {
          setShowInvalidMobErrorToast(true);
          setTimeout(() => {
            setShowInvalidMobErrorToast(false);
          }, 5000);
        } else if (error.message === "Network Error") {
          // Handle network errors separately
          setShowNetworkErrorToast(true);
          setTimeout(() => {
            setShowNetworkErrorToast(false);
          }, 5300);
        } else {
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }

        setAppMessage("Error fetching patient details. Please try again.");
        setTimeout(() => {
          setAppMessage("");
        }, 5000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    } else {
      setMobileNo(false);
      setShowBill(false);
      setPatientDetails({ name: "", pid: "" }); // Clear patient details if mobile number is not valid
      setShowMobNotFillErrorToast(true);
      setTimeout(() => {
        setShowMobNotFillErrorToast(false);
      }, 5300);
    }
  };

  console.log("pa", patientDetails);

  const createInPatientBill = async () => {
    // await new Promise((resolve) =>
    //   setTimeout(() => {
    //     validateMobileNumber(patient.mobileNumber);
    //     resolve();
    //   }, 1000)
    // );

    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    if (mobileNo) {
      const dateAndTime = new Date().toLocaleString();
      console.log("Patient Object:", patient);

      try {
        setLoading(true);
        const response = await axios.post(
          "https://rehab-rythm-ti17.vercel.app/api/create_new_inpatient_bill",
          {
            patient: {
              ...patient,
              dateAndTime,
            },
            clinicName,
            doctorName,
          }
        );

        const { message, inPatientBill } = response.data;
        console.log("In-Patient Bill Details message:", message);

        setAppMessage(message);
        // setTimeout(() => {
        //   setAppMessage("");
        // }, 5000);

        if (response.status === 201) {
          console.log("In-Patient Bill Details message:", message);
          setPatient({
            mobileNumber: "",
            roomNumber: "",
            admissionDate: "",
            dischargeDate: "",
            totalDays: "",
            visitingBill: "",
            physioBill: "",
            nursingBill: "",
            otherExpenses: "",
            amountPerDay: "",
            paymentMode: "",
          });
          setPatientDetails({
            name: "",
            pid: "",
            gender: "",
            age: "",
          });
          setShowBill(false);
          setLoading(false);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 5300);
        } else if (response.status === 500) {
          setLoading(false);
          console.log("eeeeeeeeeeeerrrrrrrrrrrrrrrrr");
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } catch (error) {
        setLoading(false);
        setShowUnexpectedErrorToast(true);
        setTimeout(() => {
          setShowUnexpectedErrorToast(false);
        }, 5300);

        // if (error.response && error.response.status === 404) {
        //   setAppMessage(
        //     "Patient not found.Only Basic details are present  Do update the patient treamtment details in update record."
        //   );
        //   setTimeout(() => {
        //     setAppMessage("");
        //   }, 5000);
        //   alert(
        //     "Patient not found.Only Basic details are present  Do update the patient treamtment details in update record."
        //   );
        // } else {
        //   setShowBill(false);
        //   console.error("Error creating in-patient bill:", error);
        //   alert("Error creating in-patient bill");
        //   setAppMessage(
        //     `An error occurred while creating the in-patient bill: ${error.message}`
        //   );
        //   setTimeout(() => {
        //     setAppMessage("");
        //   }, 5000);
        // }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedPatient = { ...patient };

    // Helper function to calculate the sum of bills
    const getSumOfBills = () => {
      let sum = 0;

      for (const billName in updatedPatient) {
        if (billName.endsWith("Bill") || billName === "otherExpenses") {
          sum += parseFloat(updatedPatient[billName]) || 0;
        }
      }

      return sum;
    };

    switch (name) {
      case "mobileNumber":
        if (/^\d{0,10}$/.test(value)) {
          updatedPatient = {
            ...updatedPatient,
            [name]: value,
          };
        } else {
          alert(
            "Please enter a valid mobile number with a maximum of 10 digits."
          );
        }
        break;

      case "roomNumber":
        if (/^\d{0,5}$/.test(value)) {
          updatedPatient = {
            ...updatedPatient,
            [name]: value,
          };
        } else {
          alert("Please enter a valid room number with a maximum of 5 digits.");
        }
        break;

      case "admissionDate":
      case "dischargeDate":
        updatedPatient = {
          ...patient,
          [name]: value,
        };

        const admissionDate = new Date(updatedPatient.admissionDate);
        const dischargeDate = new Date(updatedPatient.dischargeDate);

        if (
          !isNaN(admissionDate.getTime()) &&
          !isNaN(dischargeDate.getTime())
        ) {
          const timeDifference =
            dischargeDate.getTime() - admissionDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 3600 * 24)
          );

          updatedPatient = {
            ...updatedPatient,
            totalDays: daysDifference.toString(),
          };
        }
        break;

      case "totalDays":
        if (/^\d{0,5}$/.test(value)) {
          updatedPatient = {
            ...patient,
            [name]: value,
          };
        } else {
          alert("Please enter a valid total days (maximum 5 digits).");
        }
        break;

      case "visitingBill":
      case "physioBill":
      case "nursingBill":
      case "otherExpenses":
        if (/^\d{0,10}$/.test(value)) {
          updatedPatient = {
            ...patient,
            [name]: value,
          };
        } else {
          alert(`Please enter a valid amount`);
        }
        break;

      default:
        updatedPatient = {
          ...patient,
          [name]: value,
        };
        break;
    }

    const sumOfBills = getSumOfBills(updatedPatient);
    const totalDays = parseFloat(updatedPatient.totalDays) || 0;
    const amountPerDay = sumOfBills.toFixed(2);

    updatedPatient = {
      ...updatedPatient,
      amountPerDay: amountPerDay, // Round to 2 decimal places

      billAmount: (sumOfBills * totalDays).toFixed(2),
    };

    setPatient(updatedPatient);
  };

  const handleToastClose = () => {
    if (showToast) {
      setShowToast(false);
    } else if (showMobNotFillErrorToast) {
      setShowMobNotFillErrorToast(false);
    } else if (showInvalidMobErrorToast) {
      setShowInvalidMobErrorToast(false);
    } else if (showBillFillErrorToast) {
      setShowBillFillErrorToast(false);
    } else if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    } else if (showServerNetworkErrorToast) {
      setShowServerNetworkErrorToast(false);
    } else if (showUnexpectedErrorToast) {
      setShowUnexpectedErrorToast(false);
    }
  };

  return (
    <div className="main-container-in-bill">
      <div className="sub-main-container-in-bill">
        <div>
          {(loading || isLoading) && (
            <div className={overlayClass}>
              <div class="loading-dots-container">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
            </div>
          )}
        </div>
        {/* Show toast notification when showToast state is true */}
        {showToast && (
          <div className="toast toast-active">
            <div className="toast-content">
              <img src={checklist} alt="Success" className="toast-check" />
              <div className="toast-message">
                <span className="toast-text toast-text-1">Success</span>
                <span className="toast-text toast-text-2">
                  In patient bill created successfully!
                </span>
              </div>
              <div className="toast-close-image" onClick={handleToastClose}>
                <img src="./uploads/success-close.png"></img>
              </div>
            </div>
            <div className="toast-progress toast-active"></div>
          </div>
        )}

        {(showMobNotFillErrorToast ||
          showInvalidMobErrorToast ||
          showBillFillErrorToast ||
          showNetworkErrorToast ||
          showServerNetworkErrorToast ||
          showUnexpectedErrorToast) && (
          <div className="toast toast-active">
            <div className="toast-content">
              <img src={errorimg} alt="Error" className="toast-error-check" />
              <div className="toast-message">
                {showMobNotFillErrorToast && (
                  <span className="toast-text toast-text-1">
                    Please enter a valid mobile number!
                  </span>
                )}
                {showInvalidMobErrorToast && (
                  <span className="toast-text toast-text-2">
                    Patient not found. Enter a valid mobile number!
                  </span>
                )}
                {showBillFillErrorToast && (
                  <span className="toast-text toast-text-2">
                    Please fill all the bill details
                  </span>
                )}
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
                {showUnexpectedErrorToast && (
                  <span className="toast-text toast-text-2">
                    Unexpected Error Occurred.
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
        {/* {showToast && (
        <div className="toast toast-active">
          <div className="toast-content">
          <img src={checklist} alt="Success" className="toast-check" />
            <div className="toast-message">
              <span className="toast-text toast-text-1">Success</span>
              <span className="toast-text toast-text-2">
                Your login has been successfull!
              </span>
              <span className="toast-text toast-text-notification">{textNotification}</span>
            </div>
          </div>
          <i
            className="fa-solid fa-xmark toast-close"
            onClick={() => setShowToast(false)}
          ></i>
          <div className="toast-progress toast-active"></div>
        </div>
      )} */}

        {/* <div>
        {(!loading && appMessage) && (
          <div className={msgoverlay}>
                {appMessage}
              </div>
        
        )}
      </div> */}
        <div className="in-patient-billing-container">
          <div className="form-in-patient-billing-container">
            <div className="in-patient-billing-row">
              <div className="in-patient-billing-col">
                <h3 className="in-patient-billing-title">In Patient Billing</h3>
                {patientDetails.name === "" && !showbill && (
                  <>
                    <div className="in-patient-billing-inputBox mobile-number">
                      <span>Mobile Number</span>
                      <input
                        ref={searchInputRef}
                        type="text"
                        name="mobileNumber"
                        pattern="[0-9]{10}"
                        value={patient.mobileNumber}
                        onChange={handleInputChange}
                        className="in-patient-billing-input mobile-input"
                      />

                      <img
                        value="Search"
                        className="in-patient-billing-btn-search"
                        onClick={validateMobileNumber}
                        disabled={loading}
                        src={searchicon}
                        alt=""
                      />
                    </div>
                  </>
                )}
                {showbill && (
                  <>
                    {patientDetails.name !== "" && (
                      <>
                        <p className="in-patient-billing-patient-details">
                          <span className="in-patient-billing-patient-name">
                            {patientDetails.name}-{patientDetails.age}
                          </span>{" "}
                          <span className="in-patient-billing-patient-status">
                            IP
                          </span>
                        </p>
                        <div className="in-patient-billing-inputBox">
                          <span>Room Number</span>
                          <input
                            type="text"
                            placeholder="21"
                            className="input"
                            name="roomNumber"
                            value={patient.roomNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="in-patient-billing-inputBox">
                          <span>Admission Date</span>
                          <input
                            type="date"
                            className="input"
                            name="admissionDate"
                            value={patient.admissionDate}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="in-patient-billing-inputBox">
                          <span>Discharge Date</span>
                          <input
                            type="date"
                            className="input"
                            name="dischargeDate"
                            value={patient.dischargeDate}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex">
                          <div className="in-patient-billing-inputBox">
                            <span>Total Days</span>
                            <input
                              type="text"
                              placeholder="35"
                              className="input"
                              name="totalDays"
                              value={patient.totalDays}
                              onChange={handleInputChange}
                              readOnly
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              {showbill && (
                <>
                  {patientDetails.name !== "" && (
                    <>
                      <div className="in-patient-billing-col">
                        <h3 className="in-patient-billing-title">
                          Amount Details
                        </h3>
                        <div className="in-patient-billing-inputBox">
                          <span>Payment Option</span>
                          <div className="in-patient-billing-dropdown">
                            <div className="in-patient-billing-input-box">
                              <ul className="in-patient-billing-nav">
                                <li className="in-patient-billing-button-dropdown">
                                  <select
                                    className="in-patient-billing-dropdown-menu"
                                    name="paymentMode"
                                    value={patient.paymentMode}
                                    onChange={handleInputChange}
                                  >
                                    <option
                                      className="in-patient-billing-dropdown-toggle"
                                      value=""
                                    >
                                      Select Payment Mode
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      value="Cash"
                                    >
                                      Cash
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      value="UPI"
                                    >
                                      UPI
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      value="Credit Card"
                                    >
                                      Credit Card
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      value="Debit Card"
                                    >
                                      Debit Card
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      value="Net Banking"
                                    >
                                      Net Banking
                                    </option>
                                  </select>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="in-patient-billing-flex-in-billing">
                          <div className="in-patient-billing-inputBox">
                            <span>Visiting Bill</span>
                            <input
                              type="text"
                              placeholder="250"
                              className="input"
                              name="visitingBill"
                              value={patient.visitingBill}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="in-patient-billing-inputBox">
                            <span>Physio Bill</span>
                            <input
                              type="text"
                              placeholder="25"
                              className="input"
                              name="physioBill"
                              value={patient.physioBill}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="in-patient-billing-inputBox">
                            <span>Nursing Bill</span>
                            <input
                              type="text"
                              placeholder="250"
                              className="input"
                              name="nursingBill"
                              value={patient.nursingBill}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="in-patient-billing-inputBox">
                            <span>Other Expenses</span>
                            <input
                              type="text"
                              placeholder="20"
                              className="input"
                              name="otherExpenses"
                              value={patient.otherExpenses}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="in-patient-billing-inputBox">
                          <span>Amount Per Day</span>
                          <input
                            type="text"
                            placeholder="1234"
                            className="input"
                            name="amountPerDay"
                            value={patient.amountPerDay}
                            readOnly
                          />
                        </div>
                        <div className="in-patient-billing-total-amount-check">
                          <h2>Total Amount</h2>
                          <div
                            className="in-patient-billing-total-amount-display"
                            name="billAmount"
                            value={patient.billAmount}
                            readOnly
                          >
                            <h4>{patient.billAmount}&#8377;</h4>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="wrap-in-pat-btn">
              {showbill && (
                <div className="wrap-in-pat-btn">
                  {patientDetails.name !== "" && (
                    <>
                      <button
                        className="in-patient-billing-submit-btn"
                        onClick={continueToBill}
                        disabled={loading}
                      >
                        {loading ? "Creating Bill..." : "Confirm"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* {appMessage && <div className="app-message">{appMessage}</div>} */}
        </div>
      </div>
    </div>
  );
};
export default InPatientBill;
