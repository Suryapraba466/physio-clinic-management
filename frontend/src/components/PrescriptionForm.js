import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import ReactDOM from "react-dom";
import axios from "axios";
import "./CSS/PrescriptionForm.css"; // Import your CSS file

import checklist from "./landing-page-imgs/checklist.png";
import errorimg from "./landing-page-imgs/error.png";

function PrescriptionForm({ patient }) {
  const [currentDate, setCurrentDate] = useState("");
  const [showPrintOverlay, setShowPrintOverlay] = useState(false);
  const printRef = useRef();
  const [deletingMedicationIndex, setDeletingMedicationIndex] = useState(null);
  const [deletingExerciseIndex, setDeletingExerciseIndex] = useState(null);
  const [
    showMedicationConfirmationPrompt,
    setShowMedicationConfirmationPrompt,
  ] = useState(false);
  const [showExerciseConfirmationPrompt, setShowExerciseConfirmationPrompt] =
    useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showRowDeletedToast, setShowRowDeletedToast] = useState(false);
  const [showRowDeleteCancelledToast, setShowRowDeleteCancelledToast] =
    useState(false);
  const [showFailedToUpdateToast, setShowFailedToUpdateToast] = useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [fillAllFieldsToast, setFillAllFieldsToast] = useState(false);
  const [showFieldNotFilledErrorToast, setShowFieldNotFilledErrorToast] =
    useState(false);
  const [medicationRows, setMedicationRows] = useState([
    {
      id: 1,
      medicineName: "",
      duration: "",
      morning: false,
      afternoon: false,
      night: false,
      foodPreference: "",
    },
  ]);

  const [exerciseRows, setExerciseRows] = useState([
    {
      id: 1,
      exerciseName: "",
      equipmentNeeded: "",
      frequency: "",
      duration: "",
      timesRepeated: "",
    },
  ]);

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

  const getCurrentDate = () => {
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  };

  // Call getCurrentDate function once when the component mounts
  useEffect(() => {
    getCurrentDate();
  }, []);

  useEffect(() => {
    console.log("Fetching prescription data...");
    // Fetch prescription data from backend when component mounts
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get(
          `https://rehab-rythm-ti17.vercel.app/api/fetch_prescription`,
          {
            params: {
              mobileNo: patient.mobileNo,
              clinicName,
              doctorName,
            },
          }
        );

        if (response.status === 200) {
          const { medication, exercise } = response.data;
          setMedicationRows(medication);
          setExerciseRows(exercise);
        } else {
          console.error("Failed to fetch prescription data.");
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    fetchPrescriptionData();
  }, []);

  const handleMedicationChange = (index, fieldName, value) => {
    // Input validation for numeric fields
    if (fieldName === "duration") {
      // Check if the entered value is not a number
      if (isNaN(value)) {
        return; // Exit early if not a number
      }
    }

    if (fieldName === "medicineName") {
      // Check if the entered value contains only alphanumeric characters
      if (value === "" || !/^(?!.*\s{2})[a-zA-Z0-9\s]{0,25}$/.test(value)) {
        return; // Exit early if not alphanumeric
      }
    }

    setMedicationRows((prevState) => {
      const updatedRows = prevState.map((row, i) => {
        if (i === index) {
          return { ...row, [fieldName]: value };
        }
        return row;
      });
      return updatedRows;
    });
  };

  const handleExerciseChange = (index, fieldName, value) => {

    if (
      fieldName === "exerciseName" ||
      fieldName === "equipmentNeeded" ||
      fieldName === "frequency"
    ) {
      // Check if the entered value contains only alphanumeric characters
      if (value === "" || !/^(?!.*\s{2})[a-zA-Z0-9\s]{0,25}$/.test(value)) {
        return; // Exit early if not alphanumeric
      }
    }
    // Input validation for numeric fields
    if (fieldName === "duration" || fieldName === "timesRepeated") {
      // Check if the entered value is not a number
      if (isNaN(value)) {
        return; // Exit early if not a number
      }
    }

    setExerciseRows((prevState) => {
      const updatedRows = prevState.map((row, i) => {
        if (i === index) {
          return { ...row, [fieldName]: value };
        }
        return row;
      });
      return updatedRows;
    });
  };

  const handleMedicationDeleteButtonClick = (index) => {
    setShowMedicationConfirmationPrompt(true);
    setDeletingMedicationIndex(index);
  };

  const handleMedicationDeleteConfirmed = (index) => {
    let updatedRows = [...medicationRows];

    // If deleting the first row and there's only one row, replace it with an empty row
    if (index === 0 && updatedRows.length === 1) {
      updatedRows = [
        {
          id: 1,
          medicineName: "",
          duration: "",
          morning: false,
          afternoon: false,
          night: false,
          foodPreference: "",
        },
      ];
    } else {
      // Remove the row at the specified index
      updatedRows.splice(index, 1);

      // Update IDs of the remaining rows
      updatedRows = updatedRows.map((row, idx) => {
        return { ...row, id: idx + 1 }; // Assuming IDs start from 1
      });
    }

    setMedicationRows(updatedRows);
    setShowMedicationConfirmationPrompt(false);
    setShowRowDeletedToast(true);

    setTimeout(() => {
      setShowRowDeletedToast(false);
    }, 5100);
  };

  const handleMedicationDeleteCanceled = () => {
    setShowMedicationConfirmationPrompt(false);
  };

  const handleExerciseDeleteButtonClick = (index) => {
    setShowExerciseConfirmationPrompt(true);
    setDeletingExerciseIndex(index);
  };

  const handleExerciseDeleteConfirmed = (index) => {
    let updatedRows = [...exerciseRows];

    // If deleting the first row and there's only one row, replace it with an empty row
    if (index === 0 && updatedRows.length === 1) {
      updatedRows = [
        {
          id: 1,
          exerciseName: "",
          equipmentNeeded: "",
          frequency: "",
          duration: "",
          timesRepeated: "",
        },
      ];
    } else {
      // Remove the row at the specified index
      updatedRows.splice(index, 1);

      // Update IDs of the remaining rows
      updatedRows = updatedRows.map((row, idx) => {
        return { ...row, id: idx + 1 }; // Assuming IDs start from 1
      });
    }

    setExerciseRows(updatedRows);
    setShowExerciseConfirmationPrompt(false);
    setShowRowDeletedToast(true);

    setTimeout(() => {
      setShowRowDeletedToast(false);
    }, 5100);
  };

  const handleExerciseDeleteCanceled = () => {
    setShowExerciseConfirmationPrompt(false);
  };

  const handleAddMedicationRow = () => {
    const isAnyFieldEmpty = medicationRows.some(
      (row) =>
        row.medicineName === "" ||
        row.duration === "" ||
        row.foodPreference === ""
    );

    // If any required field is empty, don't add a new row
    if (isAnyFieldEmpty) {
      // alert("Fill all the input fields to add a new row!");
      setFillAllFieldsToast(true);
      setTimeout(() => {
        setFillAllFieldsToast(false);
      }, 5300);
      // You can add some error handling or notification here if needed
      return;
    }
    setMedicationRows((prevState) => [
      ...prevState,
      {
        id: prevState.length > 0 ? prevState[prevState.length - 1].id + 1 : 1,
        medicineName: "",
        duration: "",
        morning: false,
        afternoon: false,
        night: false,
        foodPreference: "",
        isNew: true, // Marking the row as newly added
      },
    ]);
  };

  const handleAddExerciseRow = () => {
    // Check if any of the required fields are empty
    const isAnyFieldEmpty = exerciseRows.some(
      (row) =>
        row.exerciseName === "" ||
        row.equipmentNeeded === "" ||
        row.frequency === "" ||
        row.duration === "" ||
        row.timesRepeated === ""
    );

    // If any required field is empty, don't add a new row
    if (isAnyFieldEmpty) {
      // alert("Fill all the input fields to add a new row!");
      setFillAllFieldsToast(true);
      setTimeout(() => {
        setFillAllFieldsToast(false);
      }, 5300);
      // You can add some error handling or notification here if needed
      return;
    }
    setExerciseRows((prevState) => [
      ...prevState,
      {
        id: prevState.length > 0 ? prevState[prevState.length - 1].id + 1 : 1,
        exerciseName: "",
        equipmentNeeded: "",
        frequency: "",
        duration: "",
        timesRepeated: "",
      },
    ]);
  };

  const handleUpdatePrescription = async () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5100);
      return;
    }

    try {
      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/update_prescription",
        {
          mobileNo: patient.mobileNo,
          medication: medicationRows,
          exercise: exerciseRows,
          clinicName,
          doctorName,
        }
      );

      if (response.status === 202) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5100);
        setTimeout(() => {
          // Refresh the admin menu
          window.location.reload();
          // Navigate to the admin menu
          window.location.href = "/AdminMenu";
        }, 5300);
      } else {
        setShowFailedToUpdateToast(true);
        setTimeout(() => {
          setShowFailedToUpdateToast(false);
        }, 5100);
      }
    } catch (error) {
      setShowFailedToUpdateToast(true);
      setTimeout(() => {
        setShowFailedToUpdateToast(false);
      }, 5100);
    }
  };
  const overlayRef = useRef(null);
  console.log(medicationRows, "gggggggggggggggggggggg");
  console.log(exerciseRows, "ertyukilkjhgfd");

  const handlePrintOverlay = () => {
    setShowPrintOverlay(true);
  };

  const handlePrintClose = () => {
    setShowPrintOverlay(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // const showOverlay = (index) => {
  //   // Update medicationRows and exerciseRows with the latest state
  //   const updatedPrescriptionRows = [...medicationRows];
  //   const updatedExerciseRows = [...exerciseRows];

  //   // Update the overlay content with the current state values
  //   const overlayContent = (

  //   );

  //   // Render the overlay content
  //   ReactDOM.render(overlayContent, overlayRef.current);

  //   // Display the overlay
  //   overlayRef.current.style.display = "flex";
  // };

  // const printPrescription = () => {
  //   window.print();
  // };

  // const hideOverlay = () => {
  //   overlayRef.current.style.display = "none";
  // };

  const handleCheckboxChange = (fieldName, isChecked, rowIndex) => {
    console.log(fieldName, isChecked);
    // Update only the specific row that corresponds to the checkbox being changed
    const updatedRows = medicationRows.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [fieldName]: isChecked,
        };
      }
      return row;
    });
    setMedicationRows(updatedRows);
  };

  const handleToastClose = () => {
    if (showToast) {
      setShowToast(false);
    } else if (showRowDeletedToast) {
      setShowRowDeletedToast(false);
    } else if (showFailedToUpdateToast) {
      setShowFailedToUpdateToast(false);
    } else if (fillAllFieldsToast) {
      setFillAllFieldsToast(false);
    } else if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    }
  };

  return (
    <div>
      {(showToast || showRowDeletedToast) && (
        <div className="toast toast-active">
          <div className="toast-content">
            <img src={checklist} alt="Success" className="toast-check" />
            <div className="toast-message">
              {showToast && (
                <span className="toast-text toast-text-2">
                  Prescription Form Updated successfully!
                </span>
              )}
              {showRowDeletedToast && (
                <span className="toast-text toast-text-2">
                  Row Deleted successfully!
                </span>
              )}
              {/* {showRowDeleteCancelledToast && (
                <span className="toast-text toast-text-2">
                  Row Deletion Cancelled!
                </span>
              )} */}
            </div>
            <div className="toast-close-image" onClick={handleToastClose}>
              <img src="./uploads/success-close.png"></img>
            </div>
          </div>
          <div className="toast-progress toast-active"></div>
        </div>
      )}
      {(showNetworkErrorToast ||
        showFailedToUpdateToast ||
        fillAllFieldsToast) && (
        <div className="toast toast-active">
          <div className="toast-content">
            <img src={errorimg} alt="Error" className="toast-error-check" />
            <div className="toast-message">
              {showFailedToUpdateToast && (
                <span className="toast-text toast-text-2">
                  Failed to update prescription. Try again please!
                </span>
              )}
              {fillAllFieldsToast && (
                <span className="toast-text toast-text-2">
                  Fill all the input fields to add a new row!
                </span>
              )}
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
      <div id="prescriptionBody" className="prescription-body">
        <div className="patient-information" id="patientInformation">
          <h2>Patient Information</h2>
          <div className="patient-details">
            <div className="sub-patient-details">
              <label htmlFor="patientName">Name:</label>
              <h3 className="update-record-patient">{patient.name}</h3>
            </div>
            <div className="sub-patient-details">
              <label htmlFor="patientGender">Gender:</label>
              <h3 className="update-record-patient">
                {patient.gender === "male"
                  ? "Male"
                  : patient.gender === "female"
                  ? "Female"
                  : "Other"}
              </h3>
            </div>
            <div className="sub-patient-details">
              <label htmlFor="patientAge">Age:</label>
              <h3 className="update-record-patient">{patient.age}</h3>
            </div>
            <div className="sub-patient-details">
              <label htmlFor="patientPhone">Phone:</label>
              <h3 className="update-record-patient">{patient.mobileNo}</h3>
            </div>
          </div>
        </div>
        <div className="whole-wrap-treatment">
          <div className="img-wrap-plan">
            <img src="./uploads/4564431.jpg" alt="" className="ex-img" />
          </div>
          <div className="wrap-plan-details">
            <div className="inhegiblation-treatment-row">
              <div className="inhegiblation-treatment-header">
                <h2 className="inhegiblation-treatment-title">
                  Exercise treatment
                </h2>
                <div className="button-wrap">
                  {/* <button
                id="addExerciseRowButton"
                className="add-button"
                onClick={handleAddExerciseRow}
              >
                &#x2713;
              </button> */}
                  <div
                    class="king-tooltip add-button"
                    onClick={handleAddExerciseRow}
                  >
                    <span className="tooltip-icon">&#x2713;</span>
                    <span class="saveprescription-tooltiptext">Save</span>
                  </div>
                </div>
              </div>
              <div className="hospital-table-container">
                <table className="hospital-table">
                  <thead>
                    <tr>
                      <th className="prescription-header">S.No</th>
                      <th className="prescription-header">Exercise Name</th>
                      <th className="prescription-header">Equipment Needed</th>
                      <th className="prescription-header">
                        Frequency (Daily or Weekly)
                      </th>
                      <th className="prescription-header">
                        Duration (Minutes)
                      </th>
                      <th className="prescription-header">Times Repeated</th>
                      <th
                        className="prescription-header"
                        id="change-buttons-header"
                      >
                        Action button
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exerciseRows.length === 0 && (
                      <tr>
                        <td colSpan="7">No exercises added yet.</td>
                      </tr>
                    )}
                    {exerciseRows.map((row, index) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>
                          <input
                            type="text"
                            className="exercise-name"
                            name={`exerciseName${index}`}
                            value={row.exerciseName}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "exerciseName",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="equipment-needed"
                            name={`equipmentNeeded${index}`}
                            value={row.equipmentNeeded}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "equipmentNeeded",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="frequency"
                            name={`frequency${index}`}
                            value={row.frequency}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="duration-minutes"
                            name={`duration${index}`}
                            value={row.duration}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="times-repeated"
                            name={`timesRepeated${index}`}
                            value={row.timesRepeated}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "timesRepeated",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <>
                          <td className="action-buttons">
                            {/* <button
                          onClick={() => handleExerciseDeleteButtonClick(index)}
                        >
                          Delete
                        </button> */}
                            <div
                              class="king-tooltip add-button"
                              onClick={() =>
                                handleExerciseDeleteButtonClick(index)
                              }
                            >
                              <span className="delete-tooltip-icon">
                                <img src="./uploads/delete.png" />
                              </span>
                              <span class="saveprescription-tooltiptext">
                                Delete
                              </span>
                            </div>
                          </td>
                          {showExerciseConfirmationPrompt &&
                            deletingExerciseIndex === index && (
                              <div className="logout-overlay">
                                <div className="confirmation-container">
                                  <p>
                                    Are you sure you want to delete this
                                    exercise row?
                                  </p>
                                  <button
                                    className="confirm-button"
                                    onClick={() =>
                                      handleExerciseDeleteConfirmed(index)
                                    }
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="cancel-button"
                                    onClick={handleExerciseDeleteCanceled}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            )}
                        </>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="plantreatment-row">
              <div className="header-section-plan">
                <h2 className="plan-treatment-title">Medication Treatment</h2>
                <div className="button-wrap">
                  {/* <button
                id="addRowButton"
                className="add-button"
                onClick={handleAddMedicationRow}
              >
                &#x2713;
              </button> */}
                  <div
                    class="king-tooltip add-button"
                    onClick={handleAddMedicationRow}
                  >
                    <span className="tooltip-icon">&#x2713;</span>
                    <span class="saveprescription-tooltiptext">Save</span>
                  </div>
                </div>
              </div>
              <table className="hospital-table" id="prescriptionTable">
                <thead>
                  <tr>
                    <th className="prescription-header">S.No</th>
                    <th className="prescription-header">Medicine Name</th>
                    <th className="prescription-header">Duration (Days)</th>
                    <th className="prescription-header">
                      Morning/Afternoon/Night
                    </th>
                    <th className="prescription-header">Before/After Food</th>
                    <th
                      className="prescription-header"
                      id="change-buttons-header"
                    >
                      Action button
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicationRows.length === 0 && (
                    <tr>
                      <td colSpan="6">No medication added yet.</td>
                    </tr>
                  )}
                  {medicationRows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <input
                          type="text"
                          className="medicine-name"
                          name={`medicineName${index}`}
                          value={row.medicineName}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "medicineName",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="duration-days"
                          name={`duration${index}`}
                          value={row.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            checked={row.morning}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "morning",
                                e.target.checked,
                                index
                              )
                            }
                          />
                          Morning
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={row.afternoon}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "afternoon",
                                e.target.checked,
                                index
                              )
                            }
                          />
                          Afternoon
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={row.night}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "night",
                                e.target.checked,
                                index
                              )
                            }
                          />
                          Night
                        </label>
                      </td>

                      <td>
                        <label>
                          <input
                            type="radio"
                            name={`foodPreference${index}`}
                            value="before"
                            checked={row.foodPreference === "before"}
                            onChange={() =>
                              handleMedicationChange(
                                index,
                                "foodPreference",
                                "before"
                              )
                            }
                          />
                          Before
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`foodPreference${index}`}
                            value="after"
                            checked={row.foodPreference === "after"}
                            onChange={() =>
                              handleMedicationChange(
                                index,
                                "foodPreference",
                                "after"
                              )
                            }
                          />
                          After
                        </label>
                      </td>

                      <td className="action-buttons">
                        {/* <button
                      onClick={() => handleMedicationDeleteButtonClick(index)}
                    >
                      Delete
                    </button> */}
                        <div
                          class="king-tooltip add-button"
                          onClick={() =>
                            handleMedicationDeleteButtonClick(index)
                          }
                        >
                          <span className="delete-tooltip-icon">
                            <img src="./uploads/delete.png" />
                          </span>
                          <span class="saveprescription-tooltiptext">
                            Delete
                          </span>
                        </div>
                      </td>
                      {showMedicationConfirmationPrompt &&
                        deletingMedicationIndex === index && (
                          <div className="logout-overlay">
                            <div className="confirmation-container">
                              <p>
                                Are you sure you want to delete this medication
                                row?
                              </p>
                              <button
                                className="confirm-button"
                                onClick={() =>
                                  handleMedicationDeleteConfirmed(index)
                                }
                              >
                                Yes
                              </button>
                              <button
                                className="cancel-button"
                                onClick={handleMedicationDeleteCanceled}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <a className="update-button-record">
              {/* <img
            className="prescription-update-image"
            src="./uploads/update-icon.png"
          /> */}
              <div class="icon controls" onClick={handleUpdatePrescription}>
                <span className="update-tooltip-icon">
                  <div className="update-tooltip-icon-inside-btn-container">
                    <img src="./uploads/update-icon.png" />
                    <p>Update</p>
                  </div>
                </span>
              </div>
            </a>
            <a className="ur-print-button">
              {/* <img src="./uploads/ur-print.png" /> */}
              <div class="king-tooltip" onClick={handlePrintOverlay}>
                <span className="print-tooltip-icon">
                  <img src="./uploads/ur-print.png" />
                </span>
                <span class="print-tooltiptext">Print</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {showPrintOverlay && (
        <>
          <div ref={printRef} className="print-overlay">
            <div class="overlay-container-print" id="overlay-container">
              <div className="print-buttons">
                <div className="king-tooltip">
                  <a className="print-button-close" onClick={handlePrintClose}>
                    <img src="./uploads/left-arrow.png" />
                    <span class="print-overlay-goback-tooltiptext">
                      Go Back
                    </span>
                  </a>
                </div>
                <div className="king-tooltip">
                  <a className="print-button-print" onClick={handlePrint}>
                    <img src="./uploads/print.png" />
                    <span class="print-overlay-tooltiptext">Print</span>
                  </a>
                </div>
              </div>
              <div class="overlay-print">
                <div class="overlay-content-print">
                  <h1 class="clinic-name">Saai physio therapy clinic</h1>
                  <h3 class="clinic-address">
                    thindal, erode , 638183 , 9344904008
                  </h3>
                  <div class="doctor-details-print">
                    <div class="line1">
                      <label for="" class="doctor-name-label label">
                        Doctor :{" "}
                        <span class="doctor-name">{patient.doctorName}</span>
                      </label>
                    </div>
                    <div class="line2">
                      <label for="" class="doctor-name-label label">
                        Date : <span class="doctor-name">{currentDate}</span>
                      </label>
                    </div>
                  </div>
                  <div class="patient-details-print">
                    <div class="line1">
                      <label for="" class="patient-pid-label label">
                        Patient Id :{" "}
                        <span class="patient-pid">{patient.pid}</span>
                      </label>
                      <label for="" class="patient-weight-label label">
                        Weight :{" "}
                        <span class="patient-weight">{patient.weight} kg</span>
                      </label>
                    </div>
                    <div class="line1">
                      <label for="" class="patient-name-label label">
                        Name : <span class="patient-name">{patient.name}</span>
                      </label>
                      <label for="" class="patient-height-label label">
                        Height :{" "}
                        <span class="patient-height">{patient.height} cm</span>
                      </label>
                    </div>
                    <div class="line1">
                      <label for="" class="patient-gender-label label">
                        Gender :{" "}
                        <span class="patient-gender">
                          {patient.gender === "male"
                            ? "Male"
                            : patient.gender === "female"
                            ? "Female"
                            : "Other"}
                        </span>
                      </label>
                      <label for="" class="patient-blood-label label">
                        Blood :{" "}
                        <span class="patient-blood">{patient.bloodGroup}</span>
                      </label>
                    </div>

                    <div class="line1">
                      <label for="" class="patient-age-label label">
                        Age : <span class="patient-age">{patient.age} </span>
                      </label>
                      <label for="" class="patient-phone-label label">
                        Phone :{" "}
                        <span class="patient-phone">{patient.mobileNo} </span>
                      </label>
                    </div>
                  </div>
                </div>
                {exerciseRows.length !== 0 && (
                  <>
                    <div class="h1-investigation-table">Exercise Treatment</div>

                    <table class="investigation-treatment-table-print">
                      <thead>
                        <tr>
                          <th class="planned-date-header">S.No</th>
                          <th class="planned-xray-header">Exercise Name</th>
                          <th class="planned-mri-header">Equipment Needed</th>
                          <th class="planned-others-header">
                            Frequency (Daily or Weekly)
                          </th>
                          <th class="planned-diagnosis-header">
                            Duration (Minutes)
                          </th>
                          <th class="planned-diagnosis-header">
                            Times Repeated
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {exerciseRows.length === 0 ? (
                          <tr>
                            <td colSpan="6">No exercises added yet.</td>
                          </tr>
                        ) : (
                          exerciseRows.map(
                            (row, index) =>
                              row.exerciseName && (
                                <tr key={row.id}>
                                  <td>{row.id}</td>
                                  <td className="remark">
                                    <input
                                      type="text"
                                      className="exercise-name"
                                      name={`exerciseName${index}`}
                                      value={row.exerciseName}
                                      onChange={(e) =>
                                        handleExerciseChange(
                                          index,
                                          "exerciseName",
                                          e.target.value
                                        )
                                      }
                                      disabled
                                    />
                                  </td>
                                  <td className="remark">
                                    <input
                                      type="text"
                                      className="equipment-needed"
                                      name={`equipmentNeeded${index}`}
                                      value={row.equipmentNeeded}
                                      onChange={(e) =>
                                        handleExerciseChange(
                                          index,
                                          "equipmentNeeded",
                                          e.target.value
                                        )
                                      }
                                      disabled
                                    />
                                  </td>
                                  <td className="remark">
                                    <input
                                      type="text"
                                      className="frequency"
                                      name={`frequency${index}`}
                                      value={row.frequency}
                                      onChange={(e) =>
                                        handleExerciseChange(
                                          index,
                                          "frequency",
                                          e.target.value
                                        )
                                      }
                                      disabled
                                    />
                                  </td>
                                  <td className="remark">
                                    <input
                                      type="text"
                                      className="duration-minutes"
                                      name={`duration${index}`}
                                      value={row.duration}
                                      onChange={(e) =>
                                        handleExerciseChange(
                                          index,
                                          "duration",
                                          e.target.value
                                        )
                                      }
                                      disabled
                                    />
                                  </td>
                                  <td className="remark">
                                    <input
                                      type="text"
                                      className="times-repeated"
                                      name={`timesRepeated${index}`}
                                      value={row.timesRepeated}
                                      onChange={(e) =>
                                        handleExerciseChange(
                                          index,
                                          "timesRepeated",
                                          e.target.value
                                        )
                                      }
                                      disabled
                                    />
                                  </td>
                                  <></>
                                </tr>
                              )
                          )
                        )}
                      </tbody>
                    </table>
                  </>
                )}
                {medicationRows.length !== 0 && (
                  <>
                    <div class="h1-investigation-table">
                      Medication Treatment
                    </div>
                    <table class="investigation-treatment-table-print">
                      <thead>
                        <tr>
                          <th class="planned-date-header">S.No</th>
                          <th class="planned-xray-header">Medicine Name</th>
                          <th class="planned-mri-header">Duration (Days)</th>
                          <th class="planned-others-header">
                            Morning/Afternoon/Night
                          </th>
                          <th class="planned-diagnosis-header">
                            Before/After Food
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicationRows.length === 0 && (
                          <tr>
                            <td colSpan="6">No medication added yet.</td>
                          </tr>
                        )}
                        {medicationRows.map((row, index) => (
                          row.medicineName &&(
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                              <input
                                type="text"
                                className="medicine-name"
                                name={`medicineName${index}`}
                                value={row.medicineName}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "medicineName",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="duration-days"
                                name={`duration${index}`}
                                value={row.duration}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </td>
                            <td>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={row.morning}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "morning",
                                      e.target.checked,
                                      index
                                    )
                                  }
                                  disabled
                                />
                                Morning
                              </label>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={row.afternoon}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "afternoon",
                                      e.target.checked,
                                      index
                                    )
                                  }
                                  disabled
                                />
                                Afternoon
                              </label>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={row.night}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "night",
                                      e.target.checked,
                                      index
                                    )
                                  }
                                  disabled
                                />
                                Night
                              </label>
                            </td>

                            <td>
                              <label>
                                <input
                                  type="radio"
                                  name={`foodPreference${index}`}
                                  value="before"
                                  checked={row.foodPreference === "before"}
                                  onChange={() =>
                                    handleMedicationChange(
                                      index,
                                      "foodPreference",
                                      "before"
                                    )
                                  }
                                  disabled
                                />
                                Before
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name={`foodPreference${index}`}
                                  value="after"
                                  checked={row.foodPreference === "after"}
                                  onChange={() =>
                                    handleMedicationChange(
                                      index,
                                      "foodPreference",
                                      "after"
                                    )
                                  }
                                  disabled
                                />
                                After
                              </label>
                            </td>
                          </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PrescriptionForm;
