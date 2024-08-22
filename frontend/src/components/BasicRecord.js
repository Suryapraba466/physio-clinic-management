import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/create-record.css";
import UpdateRecord from "./UpdateRecord";

import checklist from "./landing-page-imgs/checklist.png";
import errorimg from "./landing-page-imgs/error.png";
import createicon from "./images/creat-rec-img.png";

const BasicRecord = () => {
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [moveToUpdate, SetMoveToUpdate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [ShowMobExistErrorToast, setShowMobExistErrorToast] = useState(false);
  const [showFillDetailsErrorToast, setShowFillDetailsErrorToast] =
    useState(false);
  const [showValidateMobileNoToast, setShowValidateMobileNoToast] =
    useState(false);

  const [mobileNo, setMobileNo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appMessage, setAppMessage] = useState("");
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showServerNetworkErrorToast, setShowServerNetworkErrorToast] =
    useState(false);
  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [createoverlayVisible, setCreateOverlayVisible] = useState(false);
  const overlayClass = `loading-overlay${
    loading || isLoading ? " visible" : ""
  }`;
  const msgoverlay = `loading-overlay${
    !loading && appMessage ? " visible" : ""
  }`;

  const [inputValidation, setInputValidation] = useState({
    name: true,
    lastName: true,
    gender: true,
    age: true,
    mobileNo: true,
    occupation: true,
    address: true,
    bloodGroup: true,
    height: true,
    weight: true,
    uhid: true,
    // ... add other fields here
  });
  const [patient, setPatient] = useState({
    name: "",
    lastName: "",
    age: "",
    mobileNo: "",
    occupation: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
    uhid: "",
    doc: "",
    complaints: "", // Initialize with an empty complaint

    planTreatment: [
      {
        patientType: "choose type",
        startDate: "",
        endDate: "",
        days: "",
        ust: false,
        ift: false,
        swd: false,
        tr: false,
        wax: false,
        est: false,
        sht: false,
        laser: false,
        exs: false,
        rehab: false,
      },
    ],
    investigation: [
      {
        date: "",
        xray: "",
        mri: "",
        others: "",
        provisionalDiagnosis: "",
      },
    ],
    rangeOfMotion: {
      cervical: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      shoulder: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      elbow: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      wrist: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      hip: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      knee: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
      ankle: [
        { flexion: { rt: 0, lt: 0 } },
        { extension: { rt: 0, lt: 0 } },
        { abduction: { rt: 0, lt: 0 } },
        { adduction: { rt: 0, lt: 0 } },
        { eversion: { rt: 0, lt: 0 } },
        { inversion: { rt: 0, lt: 0 } },
        { externalRotation: { rt: 0, lt: 0 } },
        { internalRotation: { rt: 0, lt: 0 } },
        { dorsiFlexion: { rt: 0, lt: 0 } },
        { plantarFlexion: { rt: 0, lt: 0 } },
        { supination: { rt: 0, lt: 0 } },
        { pronation: { rt: 0, lt: 0 } },
        { lateralRotation: { rt: 0, lt: 0 } },
      ],
    },
    musclePower: {
      cervicalC1C2Flexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      cervicalC3SideFlexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      scapulaC4Elevation: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      shoulderC5Abduction: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      elbowC6FlexionWristExtension: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      elbowC7ExtensionWristFlexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      thumbC8Extension: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      hipL1L2Flexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      kneeL3Extension: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      ankleL4Dorsiflexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      bigToeL5Extension: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      ankleS1PlantarFlexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      kneeS2Flexion: {
        rt: { motor: 0, sensory: 0 },
        lt: { motor: 0, sensory: 0 },
      },
      // Add other properties as needed
    },

    outPatientBill: [
      {
        appointmentDate: "",
        serviceName: "",
        paymentMode: "",
        billAmount: "",
      },
    ],

    inPatientBill: [
      {
        roomNumber: "",
        admissionDate: "",
        dischargeDate: "",
        totalDays: "",
        visitingBill: "",
        physioBill: "",
        nursingBill: "",
        otherExpenses: "",
        paymentMode: "",
        billAmount: "",
      },
    ],
  });

  const clinicName = localStorage.getItem("clinicName");
  const doctorName = localStorage.getItem("doctorName");

  // Check if the values are not null or undefined before using them
  if (clinicName && doctorName) {
    // Do something with the values, such as displaying them on the UI
    console.log("Clinic Name in basic rec page:", clinicName);
    console.log("Doctor Name in basic rec page:", doctorName);
  } else {
    // Handle the case where the values are not found in localStorage
    console.log(
      "Clinic Name or Doctor Name not found in localStorage in basic rec page"
    );
  }

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

  const setInputClasses = (fieldName, isValid) => {
    setInputValidation((prevValidation) => ({
      ...prevValidation,
      [fieldName]: isValid,
    }));
  };
  /*
    const createPatientRecord = async () => {
  
      if (!navigator.onLine) {
        setShowNetworkErrorToast(true);
        setTimeout(() => {
          setShowNetworkErrorToast(false);
        }, 5300);
        return;
      }
  
      const dateAndTime = new Date().toLocaleString();
      patient.doc = dateAndTime;
  
      // Check all fields and update input classes
      setInputClasses("name", !!patient.name.trim());
      setInputClasses("gender", !!patient.gender.trim());
      setInputClasses("age", !!patient.age.trim());
      setInputClasses("mobileNo", !!patient.mobileNo.trim());
      setInputClasses("occupation", !!patient.occupation.trim());
      setInputClasses("address", !!patient.address.trim());
      setInputClasses("complaint", !!patient.complaint.trim());
      setInputClasses("uhid", !!patient.uhid.trim());
  
      // Add similar checks for other fields
  
      // // Check if any field is empty and show an alert
      // if (!Object.values(patient).every(value => !!value.trim())) {
      //     alert('Please fill all the fields');
      //     return;
      // }
  
      if (
        ![
          "name",
          "gender",
          "age",
          "mobileNo",
          "occupation",
          "address",
          "complaint",
          "uhid",
        ].every((key) => !!patient[key].trim())
      ) {
        setShowFillDetailsErrorToast(true);
        setTimeout(() => {
          setShowFillDetailsErrorToast(false);
        }, 5300);
        return;
      }
  
      // Validate the mobile number
      if (!validateMobileNumber(patient.mobileNo)) {
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost3000/api/create_basic_record",
          {
            patient: { ...patient },
          }
        );
  
        console.log("Server returned status code:", response.status);
  
        if (response.status === 201) {
          console.log("nnnnnnnnnn ffffffffff")
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 5300);
          // setAppMessage('Record updated successfully!');
          setTimeout(() => {
            setAppMessage("");
          }, 5000);
          setLoading(false);
        } 
        else if(response.status === 400){
          console.log("ppppppppppppppppppppp ffffffffff in 400")
          setShowMobExistErrorToast(true);
          setTimeout(() => {
            setShowMobExistErrorToast(false);
          }, 5300);
          setLoading(false);
        }
        else if (response.status === 500) {
          console.log("ppppppppppppppppppppp ffffffffff in 500")
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
          setLoading(false);
        }
        else {
          throw new Error("Failed to create record");
        }
      } catch (error) {
        console.error("Error creating patient record:", error);
          setLoading(false);
        
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
*/

  const confirmUpdateRecord = () => {
    // Hide the confirmation prompt
    SetMoveToUpdate(true);

    console.log(patient.mobileNo);
    setShowConfirmationPrompt(false);

    // navigate('./UpdateRecord', { mobileNumber: patient.mobileNo });
    //handleSearch();
  };

  const createPatientRecord = async () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    const dateAndTime = new Date().toLocaleString();
    patient.doc = dateAndTime;

    // Check all fields and update input classes
    setInputClasses("name", !!patient.name.trim());
    setInputClasses("lastName", !!patient.lastName.trim());
    setInputClasses("gender", !!patient.gender && !!patient.gender.trim());
    setInputClasses("age", !!patient.age.trim());
    setInputClasses("mobileNo", !!patient.mobileNo.trim());
    setInputClasses("occupation", !!patient.occupation.trim());
    setInputClasses("address", !!patient.address.trim());
    setInputClasses(
      "bloodGroup",
      !!patient.bloodGroup && !!patient.bloodGroup.trim()
    );
    setInputClasses("height", !!patient.height.trim());
    setInputClasses("weight", !!patient.weight.trim());
    setInputClasses("uhid", !!patient.uhid.trim());

    if (
      ![
        "name",
        "lastName",
        "gender",
        "age",
        "mobileNo",
        "occupation",
        "address",
        "bloodGroup",
        "height",
        "weight",
        "uhid",
      ].every((key) => patient[key] && !!patient[key].trim())
    ) {
      setShowFillDetailsErrorToast(true);
      setTimeout(() => {
        setShowFillDetailsErrorToast(false);
      }, 5300);
      return;
    }

    // Validate the mobile number
    if (!validateMobileNumber(patient.mobileNo)) {
      setShowValidateMobileNoToast(true);
      setTimeout(() => {
        setShowValidateMobileNoToast(false);
      }, 5300);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/create_basic_record",
        {
          patient: { ...patient },
          clinicName,
          doctorName,
        }
      );

      console.log("Server returned status code:", response.status);

      if (response.status === 201) {
        console.log("gfdcgfbhjnbhg", patient.mobileNo);
        setMobileNo(patient.mobileNo);
        setShowConfirmationPrompt(true);
      } else {
        throw new Error("Failed to create record");
      }
    } catch (error) {
      console.error("Error creating patient record:", error);
      if (error.response && error.response.status === 400) {
        console.log("in 400");
        setLoading(false);
        setShowMobExistErrorToast(true);
        setTimeout(() => {
          setShowMobExistErrorToast(false);
        }, 5300);
      } else {
        setLoading(false);
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(patient);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Specific validation based on the field name
    switch (name) {
      case "name":
        if (
          value === "" ||
          /^(?!.*\s{2})[a-zA-Z][a-zA-Z\s]{0,29}$/.test(value)
        ) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(
            name,
            /^(?!.*\s{2})[a-zA-Z][a-zA-Z\s]{0,29}$/.test(value.trim())
          );
        } else {
          // alert("Please enter only alphabets for the field, maximum 18 characters.");
        }
        break;

      case "lastName":
        // Check if the value consists of exactly 2 alphabetic characters
        if (/^[a-zA-Z]{0,29}$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(name, /^[a-zA-Z]{0,2}$/.test(value.trim()));
        } else {
          // Handle invalid input (e.g., show an error message)
          // alert("Please enter exactly 2 alphabetic characters for the field.");
        }
        break;

      case "occupation":
        if (
          value === "" ||
          /^(?!.*\s{2})[a-zA-Z][a-zA-Z\s]{0,19}$/.test(value)
        ) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(
            name,
            /^(?!.*\s{2})[a-zA-Z][a-zA-Z\s]{0,19}$/.test(value.trim())
          );
        } else {
          // alert("Please enter only alphabets for the occupation field, maximum 16 characters.");
        }
        break;

      case "complaint":
      case "address":
        if (/^(?! )(?!.*\s{2})[\w,'#@%&/:;\s-]{0,80}$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(name, true); // Assuming this function sets the input classes correctly
        } else {
          // alert("Please enter only alphanumeric characters and special characters for the field, maximum 50 characters.");
        }
        break;

      case "uhid":
        if (/^(?! )(?!.*\s{2})[a-zA-Z0-9\s-]{0,20}$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(
            name,
            /^(?! )(?!.*\s{2})[a-zA-Z0-9\s-]{0,20}$/.test(value.trim())
          );
        } else {
          // alert("Please enter only alphanumeric characters, spaces, and '-' symbol for the field, maximum 20 characters.");
        }
        break;

      case "age":
        // Validate and set the state
        if (/^\d*$/.test(value)) {
          const age = value === "" ? "" : parseInt(value, 10);
          if (age === "" || (age >= 0 && age <= 150)) {
            setPatient((prevPatient) => ({
              ...prevPatient,
              [name]: value,
            }));
            setInputClasses(name, true);
          } else {
            // alert("Please enter a valid age between 0 and 150.");
            setInputClasses(name, false);
          }
        } else {
          // alert("Please enter a valid numeric age.");
          setInputClasses(name, false);
        }
        break;

      case "mobileNo":
        // Check if the value contains only digits and is either exactly 10 digits long or empty
        if (/^\d{0,10}$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
          setInputClasses(name, /^\d{0,10}$/.test(value.trim()));
        } else {
          // Handle invalid input (e.g., show an error message)
          // alert("Please enter a valid mobile number with exactly 10 digits.");
        }
        break;

      case "gender":
      case "bloodGroup":
      case "onset":
        setPatient((prevPatient) => ({
          ...prevPatient,
          [name]: value,
        }));
        setInputClasses(name, !!value.trim());

        break;

      case "duration":
      case "planOfTreatment":
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          // Handle invalid input (e.g., show an error message)
          // alert("Please enter only numeric and alphabetic characters.");
        }
        setInputClasses(name, /^[a-zA-Z0-9\s]*$/.test(value.trim()));

        break;

      case "height":
        // Check if the value is empty or valid
        if (
          value === "" ||
          (/^\d+(\.\d{0,3})?$/.test(value) && parseFloat(value) <= 300)
        ) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          // Handle invalid input (e.g., show an error message)
          // alert("Please enter numeric characters less than or equal to 300 cm with up to 2 decimal places.");
        }
        setInputClasses(
          name,
          value === "" || /^\d+(\.\d{0,3})?$/.test(value.trim())
        );
        break;

      case "weight":
        // Check if the value is empty or valid
        if (
          value === "" ||
          (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) <= 1000)
        ) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          // Handle invalid input (e.g., show an error message)
          // alert("Please enter numeric characters less than or equal to 1000 kg.");
        }
        setInputClasses(
          name,
          value === "" || /^\d+(\.\d{0,2})?$/.test(value.trim())
        );
        break;
    }
  };

  const validateMobileNumber = (number) => {
    const digitCount = number.replace(/\D/g, "").length; // Count only digits

    // Check if the number of digits is 7 or 10
    if (digitCount === 10) {
      setMobileNo(true);
      return true;
    } else {
      setMobileNo(false);
      // alert("Please enter a valid mobile number of 10 digits and create record.");
      return false;
    }
  };

  const handleToastClose = () => {
    if (showToast) {
      setShowToast(false);
    } else if (showFillDetailsErrorToast) {
      setShowFillDetailsErrorToast(false);
    } else if (ShowMobExistErrorToast) {
      setShowMobExistErrorToast(false);
    } else if (showValidateMobileNoToast) {
      setShowValidateMobileNoToast(false);
    } else if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    } else if (showServerNetworkErrorToast) {
      setShowServerNetworkErrorToast(false);
    }
  };

  return (<>
    {moveToUpdate ? (<UpdateRecord mobileNumber={patient.mobileNo} />):(

    <div class="create-record-container">
      {!moveToUpdate && (
        <>
          {showToast && (
            <div className="toast toast-active">
              <div className="toast-content">
                <img src={checklist} alt="Success" className="toast-check" />
                <div className="toast-message">
                  <span className="toast-text toast-text-1">Success</span>
                  <span className="toast-text toast-text-2">
                    Patient Record Created successfully!
                  </span>
                </div>
                <div className="toast-close-image" onClick={handleToastClose}>
                  <img src="./uploads/success-close.png"></img>
                </div>
              </div>
              <div className="toast-progress toast-active"></div>
            </div>
          )}

          {(ShowMobExistErrorToast ||
            showFillDetailsErrorToast ||
            showNetworkErrorToast ||
            showServerNetworkErrorToast ||
            showValidateMobileNoToast) && (
            <div className="toast toast-active">
              {console.log("in shoe mob er")}
              <div className="toast-content">
                <img src={errorimg} alt="Error" className="toast-error-check" />
                <div className="toast-message">
                  {showFillDetailsErrorToast && (
                    <span className="toast-text toast-text-1">
                      Please fill all the details!
                    </span>
                  )}
                  {ShowMobExistErrorToast && (
                    <span className="toast-text toast-text-2">
                      The mobile number is already exists. Please enter a new
                      mobile Number!
                    </span>
                  )}
                  {showValidateMobileNoToast && (
                    <span className="-text toast-text-2">
                      Please Enter valid mobile number!
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
                </div>
                <div className="toast-close-image" onClick={handleToastClose}>
                  <img src="./uploads/close.png"></img>
                </div>
              </div>
              <div className="toast-error-progress toast-active"></div>
            </div>
          )}

          {
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
          }
          <img src={createicon} alt="" className="create-icon" />
          <div className="create-record-form-container">
            <h1 className="create-record-title">Create Record</h1>
            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-name${
                    !inputValidation.name ? "-abnormal" : ""
                  }`}
                >
                  <span>First Name&nbsp;&nbsp;&nbsp;</span>
                  <input
                    className={`create-record-form-field-name${
                      !inputValidation.name ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="name"
                    placeholder="Patient's first name"
                    value={patient.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-lastName${
                    !inputValidation.lastName ? "-abnormal" : ""
                  }`}
                >
                  <span>Last Name&nbsp;&nbsp;&nbsp;</span>
                  <input
                    className={`create-record-form-field-lastName${
                      !inputValidation.lastName ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="lastName"
                    placeholder="Patient's last name"
                    value={patient.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-age${
                    !inputValidation.age ? "-abnormal" : ""
                  }`}
                >
                  <span>Age</span>
                  <input
                    className={`create-record-form-field-age${
                      !inputValidation.age ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="age"
                    placeholder="Patient's age"
                    value={patient.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-bloodGroup${
                    !inputValidation.bloodGroup ? "-abnormal" : ""
                  }`}
                >
                  <span>Blood Group</span>
                  <select
                    className={`create-record-form-field-bloodGroup${
                      !inputValidation.bloodGroup ? "-abnormal" : ""
                    }`}
                    id="bloodGroup"
                    name="bloodGroup"
                    value={patient.bloodGroup}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="A1+">A1+</option>
                    <option value="A1-">A1-</option>
                    <option value="A2+">A2+</option>
                    <option value="A2-">A2-</option>
                    <option value="A1B+">A1B+</option>
                    <option value="A1B-">A1B-</option>
                    <option value="A2B+">A2B+</option>
                    <option value="A2B-">A2B-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Oh">Oh</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-gender${
                    !inputValidation.gender ? "-abnormal" : ""
                  }`}
                >
                  <span>Gender</span>
                  <select
                    className={`create-record-form-field-gender${
                      !inputValidation.gender ? "-abnormal" : ""
                    }`}
                    id="gender"
                    name="gender"
                    value={patient.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-address${
                    !inputValidation.address ? "-abnormal" : ""
                  }`}
                >
                  <span>Address</span>
                  <input
                    className={`create-record-form-field-address${
                      !inputValidation.address ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="address"
                    placeholder="Patient's address"
                    value={patient.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-occupation${
                    !inputValidation.occupation ? "-abnormal" : ""
                  }`}
                >
                  <span>Occupation</span>
                  <input
                    className={`create-record-form-field-occupation${
                      !inputValidation.occupation ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="occupation"
                    placeholder="Patient's occupation"
                    value={patient.occupation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-uhid${
                    !inputValidation.uhid ? "-abnormal" : ""
                  }`}
                >
                  <span>IP/UHID</span>
                  <input
                    className={`create-record-form-field-uhid${
                      !inputValidation.uhid ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="uhid"
                    placeholder="Patient's IP / UHID"
                    value={patient.uhid}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-height${
                    !inputValidation.height ? "-abnormal" : ""
                  }`}
                >
                  <span>Height</span>
                  <input
                    className={`create-record-form-field-height${
                      !inputValidation.height ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="height"
                    placeholder="Patient's height in cm"
                    value={patient.height}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-weight${
                    !inputValidation.weight ? "-abnormal" : ""
                  }`}
                >
                  <span>Weight</span>
                  <input
                    className={`create-record-form-field-weight${
                      !inputValidation.weight ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="weight"
                    placeholder="Patient's weight in kg"
                    value={patient.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="create-record-row">
              <div className="create-record-col">
                <div
                  className={`create-record-form-group-mobileNo${
                    !inputValidation.mobileNo ? "-abnormal" : ""
                  }`}
                >
                  <span>Mobile No</span>
                  <input
                    className={`create-record-form-field-mobileNo${
                      !inputValidation.mobileNo ? "-abnormal" : ""
                    }`}
                    type="text"
                    name="mobileNo"
                    placeholder="Patient's mobile no"
                    value={patient.mobileNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <input
              onClick={createPatientRecord}
              value="Proceed to Create Record"
              className="create-record-submit-btn"
              readOnly
            />
            {showConfirmationPrompt &&
              !showNetworkErrorToast &&
              !showFillDetailsErrorToast &&
              !showServerNetworkErrorToast && (
                <div className="logout-overlay">
                  <div className="confirmation-container">
                    <p>Patient record is created successfully.</p>
                    <p>Do you want to continue with the Update Record?</p>
                    <button
                      className="confirm-button"
                      onClick={confirmUpdateRecord}
                    >
                      Yes
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setShowConfirmationPrompt(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            {appMessage}
          </div>
        </>
      )}
    </div>)
}
    </>
  );
};

export default BasicRecord;
