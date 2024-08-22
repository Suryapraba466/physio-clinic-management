import React, { useState, useEffect } from "react";
import axios from "axios";

const InOutBillRow = ({ patientReco }) => {
  const [mobileNumber, setMobileNumber] = useState(patientReco.mobileNo);
  const [patientRecord, setPatientRecord] = useState(patientReco);
  const [error, setError] = useState("");
  const [closeDetails, setCloseDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nextRowPatientType, setNextRowPatientType] = useState("");
  const [currentRowPatientType, setCurrentRowPatientType] = useState("");
  const [viewoverlayVisible, setviewOverlayVisible] = useState(false);
  const [viewoverlayContent, setviewOverlayContent] = useState(null);
  const [createoverlayVisible, setCreateOverlayVisible] = useState(false);
  const [isBillSaved, setIsBillSaved] = useState(false);
  const inPatientBilling = [patientRecord.inPatientBill];
  const outPatientBilling = [patientRecord.outPatientBill];
  const [selectedRowEndDate, setSelectedRowEndDate] = useState("");
  const [selectedRowStartDate, setSelectedRowStartDate] = useState("");


  const [inPatientBillDetails, setInPatientBillDetails] = useState({
    inBill: [
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
  const [outPatientBillDetails, setOutPatientBillDetails] = useState({
    outBill: [
      {
        appointmentDate: "",
        serviceName: "",
        paymentMode: "",
        billAmount: "",
      },
    ],
  });

  useEffect(() => {
    const startDate = new Date(selectedRowStartDate);
    const endDate = new Date(selectedRowEndDate);
  
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const timeDifference = endDate - startDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  
      setInPatientBillDetails((prevPatient) => ({
        ...prevPatient,
        inBill: [
          {
            ...prevPatient.inBill[0],
            totalDays: daysDifference.toString(),
            admissionDate: startDate,
            dischargeDate: endDate,
          },
        ],
      }));
    }
    setOutPatientBillDetails((prevPatient)=>({
      ...prevPatient,
        outBill: [
          {
            ...prevPatient.outBill[0],
            appointmentDate: startDate,
          },
        ],
    }))
  }, [selectedRowStartDate, selectedRowEndDate]);

  const handleInOutCheckboxChange = (index, field) => {
    // Update the patient record in the state immediately
    setPatientRecord((prevPatientRecord) => ({
      ...prevPatientRecord,
      planTreatment: prevPatientRecord.planTreatment.map((item, i) =>
        i === index && item.isNewRow ? { ...item, [field]: !item[field] } : item
      ),
    }));
  };

  const handleInOutInputChange = (index, field, value) => {
    // Update the patient record in the state immediately


    setPatientRecord((prevPatientRecord) => {
      console.log("Handling Input Change - isNewRow:", prevPatientRecord.planTreatment[index].isNewRow); // Add this line
      const updatedPlanTreatment = prevPatientRecord.planTreatment.map((item, i) =>
        i === index && item.isNewRow
          ? { ...item, [field]: value }
          : item
      );

      return {
        ...prevPatientRecord,
        planTreatment: updatedPlanTreatment,
      };
    });
  };

  const handleAddRow = () => {
    setPatientRecord((prevPatientRecord) => {

      const newPlan = {
        date: "",
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
        isNewRow: true,
        patientType: nextRowPatientType,
      };

      const updatedRecord = {
        planTreatment: [...prevPatientRecord.planTreatment, newPlan],
      };

      // Update the backend immediately when a new row is added

      return { ...prevPatientRecord, ...updatedRecord };
    });
  };


  const handleAddInvestRow = () => {
    setPatientRecord((prevPatientRecord) => {
      const newInvest = {
        date: "",
        xray: "",
        mri: "",
        others: "",
        provisionalDiagnosis: "",
        isNewInvestRow: true,
      };

      const updatedRecord = {
        investigation: [...prevPatientRecord.investigation, newInvest],
      };

      // Update the backend immediately when a new row is added

      return { ...prevPatientRecord, ...updatedRecord };
    });
  };

  const handleDeleteRow = (index) => {

    setOutPatientBillDetails({
      outBill: [
        {
          appointmentDate: "",
          serviceName: "",
          paymentMode: "",
          billAmount: "",
        },
      ],
    });

    setInPatientBillDetails({
      inBill: [
        {
          roomNumber: "",
          admissionDate: "",
          dischargeDate: "",
          totalDays: "",
          visitingBill: "",
          physioBill: "",
          nursingBill: "",
          otherExpenses: "",
          billAmount: "",
        },
      ],
    });
    setPatientRecord((prevPatientRecord) => {
      const updatedRecord = {
        planTreatment: prevPatientRecord.planTreatment.filter(
          (item, i) => i !== index
        ),
      };

      //updateBackend(updatedRecord);

      return { ...prevPatientRecord, ...updatedRecord };
    });
  };

  const handleDeleteInvestRow = (index) => {
    setPatientRecord((prevPatientRecord) => {
      const updatedRecord = {
        investigation: prevPatientRecord.investigation.filter(
          (item, i) => i !== index
        ),
      };

      //updateBackend(updatedRecord);

      return { ...prevPatientRecord, ...updatedRecord };
    });
  };

  const handleIOOutPatientInputChange = (e) => {
    const { name, value } = e.target;
  
    const updatedOutPatientBill = [...outPatientBillDetails.outBill];
  
    switch (name) {
      case "billAmount":
        if (/^\d{0,8}$/.test(value)) {
          updatedOutPatientBill[0] = {
            ...updatedOutPatientBill[0],
            [name]: value,
          };
        } else {
          alert("Please enter a valid amount with a maximum of 8 digits.");
          // Revert to the previous valid value
          const previousValue = updatedOutPatientBill[0][name];
          e.target.value = previousValue;
        }
        break;
  
      case "serviceName":
        if (/^[a-zA-Z ]*$/.test(value)) {
          updatedOutPatientBill[0] = {
            ...updatedOutPatientBill[0],
            [name]: value,
          };
        } else {
          alert("Please enter only alphabets for the name field.");
          // Revert to the previous valid value
          const previousValue = updatedOutPatientBill[0][name];
          e.target.value = previousValue;
        }
        break;
  
      // Add more cases as needed
  
      default:
        updatedOutPatientBill[0] = {
          ...updatedOutPatientBill[0],
          [name]: value,
        };
        break;
    }
  
    setOutPatientBillDetails((prevPatient) => ({
      ...prevPatient,
      outBill: updatedOutPatientBill,
    }));
  };
  
  const handleIOInPatientInputChange = (e) => {
    const { name, value } = e.target;

    let updatedInPatientBill = [...inPatientBillDetails.inBill];

    // Helper function to calculate the sum of bills
    const getSumOfBills = () => {
      let sum = 0;

      for (const billName in updatedInPatientBill[0]) {
        if (billName.endsWith("Bill") || billName === "otherExpenses") {
          sum += parseFloat(updatedInPatientBill[0][billName]) || 0;
        }
      }

      return sum;
    };

    switch (name) {
      case "roomNumber":
        if (/^\d{0,5}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert("Please enter a valid room number with a maximum of 5 digits.");
        }
        break;

      case "admissionDate":
      case "dischargeDate":
        updatedInPatientBill[0] = {
          ...updatedInPatientBill[0],
          [name]: value,
        };

        const admissionDate = new Date(updatedInPatientBill[0].admissionDate);
        const dischargeDate = new Date(updatedInPatientBill[0].dischargeDate);

        if (
          !isNaN(admissionDate.getTime()) &&
          !isNaN(dischargeDate.getTime())
        ) {
          const timeDifference =
            dischargeDate.getTime() - admissionDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 3600 * 24)
          );

          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            totalDays: daysDifference.toString(),
          };
        }
        break;

      case "totalDays":
        if (/^\d{0,5}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
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
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert(`Please enter a valid amount`);
        }
        break;

      default:
        updatedInPatientBill[0] = {
          ...updatedInPatientBill[0],
          [name]: value,
        };
        break;
    }

    const sumOfBills = getSumOfBills(updatedInPatientBill[0]);
    const totalDays = parseFloat(updatedInPatientBill[0].totalDays) || 0;
    updatedInPatientBill[0] = {
      ...updatedInPatientBill[0],
      billAmount: (sumOfBills * totalDays).toFixed(2),
    };

    setInPatientBillDetails((prevPatient) => ({
      ...prevPatient,
      inBill: updatedInPatientBill,
    }));
  };
  const handleNewInPatientInputChange = (e) => {
    console.log("function called");
    const { name, value } = e.target;

    let updatedInPatientBill = [...inPatientBillDetails.inBill];

    // Helper function to calculate the sum of bills
    const getSumOfBills = () => {
      let sum = 0;

      for (const billName in updatedInPatientBill[0]) {
        if (billName.endsWith("Bill") || billName === "otherExpenses") {
          sum += parseFloat(updatedInPatientBill[0][billName]) || 0;
        }
      }

      return sum;
    };

    switch (name) {
      case "roomNumber":
        if (/^\d{0,5}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert("Please enter a valid room number with a maximum of 5 digits.");
        }
        break;



      case "totalDays":
        if (/^\d{0,5}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
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
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert(`Please enter a valid amount`);
        }
        break;

      default:
        updatedInPatientBill[0] = {
          ...updatedInPatientBill[0],
          [name]: value,
        };
        break;
    }

    const sumOfBills = getSumOfBills(updatedInPatientBill[0]);
    const totalDays = parseFloat(updatedInPatientBill[0].totalDays) || 0;
    updatedInPatientBill[0] = {
      ...updatedInPatientBill[0],
      billAmount: (sumOfBills * totalDays).toFixed(2),
    };

    setInPatientBillDetails((prevPatient) => ({
      ...prevPatient,
      inBill: updatedInPatientBill,
    }));
  };
  const isBillDetailsInOutInPatientFilled = () => {
    const inBillDetails = inPatientBillDetails.inBill[0];
    return (
      inBillDetails.roomNumber &&
      inBillDetails.admissionDate &&
      inBillDetails.dischargeDate &&
      inBillDetails.totalDays &&
      inBillDetails.visitingBill &&
      inBillDetails.physioBill &&
      inBillDetails.nursingBill &&
      inBillDetails.otherExpenses &&
      inBillDetails.paymentMode &&
      inBillDetails.billAmount
    );
  };

  const isBillDetailsInOutOutPatientFilled = () => {
    const outBillDetails = outPatientBillDetails.outBill[0];
    return (
      outBillDetails.appointmentDate &&
      outBillDetails.serviceName &&
      outBillDetails.paymentMode &&
      outBillDetails.billAmount
    );
  };
  const handleInOutUpdate = async () => {
    console.log("update");
  
    const selectedPlanTreatment = patientRecord.planTreatment.find(
      (plan) => plan.isNewRow
    );
  
    if (!selectedPlanTreatment) {
      console.error("Error: No selected plan treatment found.");
      return;
    }
  
    // Check if bill details are filled
  
    try {
      const newRows = patientRecord.planTreatment
        .filter((item) => item.isNewRow)
        .map((row) => {
          // Ensure each row has the appropriate date value
          return {
            ...row,
            startDate:
              nextRowPatientType === "inpatient"
                ? inPatientBillDetails.inBill[0].admissionDate
                : outPatientBillDetails.outBill[0].appointmentDate,
            endDate:
              nextRowPatientType === "inpatient"
              && inPatientBillDetails.inBill[0].dischargeDate,
            days:
              nextRowPatientType === "inpatient"
                ? inPatientBillDetails.inBill[0].totalDays
                : 1, // Set days to 1 for outpatient
            patientType: nextRowPatientType,
          };
        });
  
      console.log(newRows);
  
      const inBillDetails =
        (nextRowPatientType === "inpatient" && isBillDetailsInOutInPatientFilled())
          ? inPatientBillDetails.inBill[0]
          : undefined;
  
      const outBillDetails =
        (nextRowPatientType === "outpatient" && isBillDetailsInOutOutPatientFilled())
          ? outPatientBillDetails.outBill[0] 
          : undefined;
  
      console.log(outBillDetails);
  
      if (
        (nextRowPatientType === "inpatient" && inBillDetails === undefined) ||
        (nextRowPatientType === "outpatient" && outBillDetails === undefined)
      ) {
        // Display confirmation dialog
        const userConfirmation = window.confirm(
          "Bill details are not filled. Do you want to continue your update?"
        );
  
        if (!userConfirmation) {
          // User clicked "No", do not continue with the update
          return;
        }
      }
  
      const updateData = {
        mobileNumber: mobileNumber,
        updatedData: newRows,
        inBillDetails: inBillDetails,
        outBillDetails: outBillDetails,
      };
  
      const response = await fetch(
        "https://saai-physio-api.vercel.app/api/update_bill_plantreatment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data updated successfully:", data);
        alert("Data updated successfully");
        // Handle any UI updates or redirection after successful update
      } else {
        console.error("Error updating data:", response.statusText);
        alert("Data update failed");
        // Handle error, display error message, etc.
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
      // Handle error, display error message, etc.
    }
  };
  const handleRowSelection = (index) => {
    setSelectedRowStartDate(sortedRows[index].startDate);
    setSelectedRowEndDate(sortedRows[index].endDate);
  };
  const handleInOutUpdateOutBill = async () => {
    const isBillDetailsFilled = isBillDetailsInOutOutPatientFilled();
    console.log(inPatientBillDetails.inBill);
    if (isBillDetailsFilled) {
      try {
        // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update
        console.log(outPatientBillDetails.outBill[0]);

        const updatedBill = {
          mobileNumber: mobileNumber,
          appointmentDate: selectedRowStartDate, // Assuming selectedRowDate is correctly set
          serviceName: outPatientBillDetails.outBill[0].serviceName,
          paymentMode: outPatientBillDetails.outBill[0].paymentMode,
          billAmount: outPatientBillDetails.outBill[0].billAmount,
        };

        console.log(updatedBill);

        // Send a PUT request to update the outpatient bill
        const response = await fetch('https://saai-physio-api.vercel.app/api/create_new_outpatient_bill', {
          method: 'POST', // Change this to POST if your server expects a POST request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patient: updatedBill }),
        });

        if (response.ok) {
          const updatedBillData = await response.json();
          console.log('Outpatient Bill updated successfully:', updatedBillData);
          alert("Out Patient Bill updated successfully");
          // Handle any additional logic or UI updates if needed
        } else {
          console.error('Failed to update outpatient bill:', response.statusText);
          // Handle error scenarios
          alert("Failed to update Out Patient Bill");
        }
      } catch (error) {
        console.error('Error updating outpatient bill:', error);
        // Handle error scenarios
      }
    }
    else {
      // Handle case where bill details are not filled
      console.error("Error: Bill details not filled.");
      alert("Bill details not filled");
    }
  };
  const handleInOutUpdateInBill = async () => {
    const isBillDetailsFilled = isBillDetailsInOutInPatientFilled();
    console.log(inPatientBillDetails.inBill);
    if (isBillDetailsFilled) {
      try {
        // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update

        const updatedBill = {
          mobileNumber: mobileNumber,
          roomNumber: inPatientBillDetails.inBill[0].roomNumber,
          admissionDate: selectedRowStartDate,
          dischargeDate: selectedRowEndDate,
          totalDays: inPatientBillDetails.inBill[0].totalDays,
          visitingBill: inPatientBillDetails.inBill[0].visitingBill,
          physioBill: inPatientBillDetails.inBill[0].physioBill,
          nursingBill: inPatientBillDetails.inBill[0].nursingBill,
          otherExpenses: inPatientBillDetails.inBill[0].otherExpenses,
          paymentMode: inPatientBillDetails.inBill[0].paymentMode,
          billAmount: inPatientBillDetails.inBill[0].billAmount,
        };


        // Send a PUT request to update the outpatient bill
        const response = await fetch('https://saai-physio-api.vercel.app/api/create_new_inpatient_bill', {
          method: 'POST', // Change this to POST if your server expects a POST request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patient: updatedBill }),
        });

        if (response.ok) {
          const updatedBillData = await response.json();
          console.log('Outpatient Bill updated successfully:', updatedBillData);
          alert("In Patient Bill updated successfully");
          // Handle any additional logic or UI updates if needed
        } else {
          console.error('Failed to update outpatient bill:', response.statusText);
          // Handle error scenarios
          alert("Failed to update In Patient Bill");
        }
      } catch (error) {
        console.error('Error updating inpatient bill:', error);
        // Handle error scenarios
      }
    }
    else {
      // Handle case where bill details are not filled
      console.error("Error: Bill details not filled.");
      alert("Bill details not filled");
    }

  };
  const handleViewBill = (index) => {
    // Get the selected planTreatment
    const selectedPlanTreatment = patientRecord.planTreatment[index];

    // Find all relevant bills for the selected date
    const relevantInPatientBills = patientRecord.inPatientBill.filter((inPatient) => {
      return (
        new Date(inPatient.admissionDate).toLocaleDateString() ===
        new Date(selectedPlanTreatment.startDate).toLocaleDateString()
      );
    });

    const relevantOutPatientBills = patientRecord.outPatientBill.filter((outPatient) => {
      return (
        new Date(outPatient.appointmentDate).toLocaleDateString() ===
        new Date(selectedPlanTreatment.startDate).toLocaleDateString()
      );
    });

    if (relevantInPatientBills.length > 0 || relevantOutPatientBills.length > 0) {
      // Set overlay content
      setviewOverlayContent(
        <div>
          <h3>Billing Details:</h3>
          <div style={{ display: "flex" }}>
            {/* Render Inpatient Bills on the Left Side */}
            <div style={{ flex: 1, marginRight: "30px" }}>
              <h4>In Patient Bill</h4>
              {relevantInPatientBills.map((bill, billIndex) => (
                <div key={billIndex}>
                  {/* Inpatient bill details rendering */}
                  <strong>Bill {billIndex + 1}:</strong>
                  {/* Display other inpatient details */}
                  <br />
                  <strong>Room Number</strong> {bill.roomNumber || "N/A"}
                  <br></br>
                  {/* Check if admissionDate is defined before using it */}
                  <strong>Admission Date</strong>{" "}
                  {bill.admissionDate
                    ? new Date(bill.admissionDate).toLocaleDateString()
                    : "N/A"}
                  <br></br>
                  {/* Check if dischargeDate is defined before using it */}
                  <strong>Discharge Date</strong>{" "}
                  {bill.dischargeDate
                    ? new Date(bill.dischargeDate).toLocaleDateString()
                    : "N/A"}
                  <br></br>
                  <strong>Total Days</strong> {bill.totalDays || "N/A"}
                  <br></br>
                  <strong>Visiting Bill</strong> {bill.visitingBill || "N/A"}
                  <br></br>
                  <strong>Physio Bill</strong> {bill.physioBill || "N/A"}
                  <br></br>
                  <strong>Nursing Bill</strong> {bill.nursingBill || "N/A"}
                  <br></br>
                  <strong>Other Expenses</strong> {bill.otherExpenses || "N/A"}
                  <br></br>
                  <strong>Payment Mode</strong> {bill.paymentMode || "N/A"}
                  <br></br>
                  <strong>Bill Amount</strong> {bill.billAmount || "N/A"}
                </div>
              ))}
            </div>

            {/* Render Outpatient Bills on the Right Side */}
            <div>
              <h4>Out Patient Bill</h4>
              {relevantOutPatientBills.map((bill, billIndex) => (
                <div key={billIndex}>
                  {/* Outpatient bill details rendering */}
                  <strong>Bill {billIndex + 1}:</strong>
                  {/* Display other outpatient details */}
                  <br />
                  <strong>Appointment Date</strong> {bill.appointmentDate || "N/A"}
                  <br></br>
                  <strong>Service Name</strong> {bill.serviceName || "N/A"}
                  <br></br>
                  <strong>Payment Mode</strong> {bill.paymentMode || "N/A"}
                  <br></br>
                  <strong>Bill Amount</strong> {bill.billAmount || "N/A"}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      // Show the overlay
      setviewOverlayVisible(true);
    } else {
      alert("No matching bills found for the selected plan treatment.");
    }
  };

  const handleInOutPatientTypeChange = (newPatientType) => {
    // Update the state with the modified patient type for the next newly added row
    setNextRowPatientType(newPatientType);
  };

  const handleInOutInvestigationChange = (index, field, value) => {
    // Update the patient record in the state immediately
    setPatientRecord((prevPatientRecord) => ({
      ...prevPatientRecord,
      investigation: prevPatientRecord.investigation.map((item, i) =>
        i === index && item.isNewInvestRow ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleInOutUpdateInvestigation = () => {
    // Extract only the new rows from the patient record
    const newRows = patientRecord.investigation.filter(
      (item) => item.isNewInvestRow
    );

    // Update the backend immediately when a change is made to a new row
    axios
      .post("https://saai-physio-api.vercel.app/api/edit_invest_record", {
        mobileNumber,
        updatedData: newRows,
      })
      .then(() => {
        console.log("Changes saved to the backend.");
        alert("Ivestigation updated successfully");
      })
      .catch((error) => {
        console.error("Error saving changes to the backend:", error);
        alert("Failed to update");
      });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInOutTextareaChange = (field, value) => {
    setPatientRecord((prevPatientRecord) => ({
      ...prevPatientRecord,
      investigation: prevPatientRecord.investigation.map((entry, index) =>
        index === prevPatientRecord.investigation.length - 1
          ? { ...entry, [field]: value }
          : entry
      ),
    }));
  };

  const handleInOutCreateBill = () => {
    if (nextRowPatientType === "outpatient") {
      console.log("out");
      setCreateOverlayVisible(true);
    } else {
      console.log("in");
      setCreateOverlayVisible(true);
    }
  };


  const handleInOutCreateNewInBill = (ptype) => {
    setCurrentRowPatientType(ptype);
    setCreateOverlayVisible(true);
  }

  const handleInOutCreateNewOutBill = (ptype) => {
    setCurrentRowPatientType(ptype);
    setCreateOverlayVisible(true);
  }

  useEffect(() => {
    console.log(currentRowPatientType);
  }, [createoverlayVisible]);


  const closeOverlay = () => {
    /*setCreateOverlayVisible(false);
  
    setOutPatientBillDetails({
      outBill: [
        {
          appointmentDate: "",
          serviceName: "",
          paymentMode: "",
          billAmount: "",
        },
      ],
    });
  
    setInPatientBillDetails({
      inBill: [
        {
          roomNumber: "",
          admissionDate: "",
          dischargeDate: "",
          totalDays: "",
          visitingBill: "",
          physioBill: "",
          nursingBill: "",
          otherExpenses: "",
          billAmount: "",
        },
      ],
    });
  
    setPatientRecord((prevPatientRecord) => ({
      ...prevPatientRecord,
      planTreatment: prevPatientRecord.planTreatment.map((plan) => ({
        ...plan,
        isNewRow: false,
      })),
    }));*/

    // Close the overlay
    setviewOverlayVisible(false);
    // Clear the overlay content
    setviewOverlayContent(null);
  };

  const closeBill = () => {
    setCreateOverlayVisible(false);

    setOutPatientBillDetails({
      outBill: [
        {
          appointmentDate: "",
          serviceName: "",
          paymentMode: "",
          billAmount: "",
        },
      ],
    });

    setInPatientBillDetails({
      inBill: [
        {
          roomNumber: "",
          admissionDate: "",
          dischargeDate: "",
          totalDays: "",
          visitingBill: "",
          physioBill: "",
          nursingBill: "",
          otherExpenses: "",
          billAmount: "",
        },
      ],
    });

    /*{
      isBillSaved &&
        setPatientRecord((prevPatientRecord) => ({
          ...prevPatientRecord,
          planTreatment: prevPatientRecord.planTreatment.map((plan) => ({
            ...plan,
            isNewRow: false,
          })),
        }));
    }*/
  };
  const sortedRows = patientRecord.planTreatment
    .filter((plan) => !plan.isNewRow) // Exclude the new row from sorting
    .sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate > b.startDate ? 1 : -1;
      }
      // If dates are the same, sort by patient type
      return a.patientType.localeCompare(b.patientType);
    });

  // Add the new row at the end
  const newRow = patientRecord.planTreatment.find((plan) => plan.isNewRow);
  if (newRow) {
    sortedRows.push(newRow);
  }

  console.log(patientRecord.planTreatment);
  console.log(inPatientBillDetails.inBill);
  console.log(outPatientBillDetails.outBill);

  return (
    <>
      <h4>Plan Of Treatment</h4>
      <button onClick={handleEditClick}>
        {isEditing ? "Done Editing" : "Edit"}
      </button>

      {/*{isEditing && (
        <div>
          <label>
            Patient Type:
            <select
              value={nextRowPatientType}
              onChange={(e) => handleInOutPatientTypeChange(e.target.value)}
            >
              <option value="">Select Patient Type</option>
              <option value="outpatient">Out-Patient</option>
              <option value="inpatient">In-Patient</option>
            </select>
          </label>
        </div>
      )}*/}


      <div>
        {isEditing &&
          <button onClick={handleAddRow}>Add Row</button>
        }
        {patientRecord && (
          <table className="planed-treatment">
            <caption>Planned Treatment</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>No of Days</th>
                <th>Patient Type</th>
                <th>UST</th>
                <th>IFT</th>
                <th>SWD</th>
                <th>TR</th>
                <th>Wax</th>
                <th>EST</th>
                <th>SHT</th>
                <th>LASER</th>
                <th>EXS</th>
                <th>REHAB</th>
              </tr>
            </thead>

            <tbody>
              {sortedRows.map((plan, index) => (
                <tr key={index}>
                  <td>
                    {/*console.log("Rendering - isNewRow:", plan.isNewRow)*/}
                    {!plan.isNewRow && plan.patientType === 'inpatient' && (
                      <div>
                        <label>
                          Admission Date:
                          <input
                            type="date"
                            value={plan.startDate}
                            onChange={(e) =>
                              handleInOutInputChange(index, "date", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Discharge Date:
                          <input
                            type="date"
                            value={plan.endDate}
                            onChange={(e) =>
                              handleInOutInputChange(index, "date", e.target.value)
                            }
                          />
                        </label>
                      </div>
                    )}
                    {!plan.isNewRow && plan.patientType === 'outpatient' && (
                      <label>
                        Appointment Date:
                        <input
                          type="date"
                          value={plan.startDate}
                          onChange={(e) =>
                            handleInOutInputChange(index, "date", e.target.value)
                          }
                        />
                      </label>
                    )}
                    {nextRowPatientType !== "inpatient" && plan.isNewRow && (
                      <label>
                        Appointment Date:
                        <input
                          type="date"
                          name="appointmentDate"
                          value={outPatientBillDetails.outBill[0].appointmentDate}
                          onChange={handleIOOutPatientInputChange}
                        />
                      </label>
                    )}
                    {nextRowPatientType === "inpatient" && plan.isNewRow && (
                      <div>
                        <label>
                          Admission Date:
                          <input
                            type="date"
                            name="admissionDate"
                            value={inPatientBillDetails.inBill[0].admissionDate}
                            onChange={handleIOInPatientInputChange}
                          />
                        </label>
                        <label>
                          Discharge Date:
                          <input
                            type="date"
                            name="dischargeDate"
                            value={inPatientBillDetails.inBill[0].dischargeDate}
                            onChange={handleIOInPatientInputChange}
                          />
                        </label>
                      </div>
                    )}
                  </td>
                  <td>
                    {!plan.isNewRow && (
                      <input
                        type="text"
                        value={plan.days}
                        onChange={(e) => handleInOutInputChange(index, "days", e.target.value)}
                      />
                    )}
                    {nextRowPatientType !== "inpatient" && plan.isNewRow && (
                      <input
                        type="text"
                        value={1}
                      // onChange={(e) => handleInOutInputChange(index, "days", 1)}
                      />
                    )}
                    {nextRowPatientType === "inpatient" && plan.isNewRow && (
                      <input
                        type="text"
                        value={inPatientBillDetails.inBill[0].totalDays}
                        onChange={handleIOInPatientInputChange}
                      />
                    )}
                  </td>
                  <td>
                    {!plan.isNewRow &&
                      plan.patientType}
                    {plan.isNewRow &&
                      <select
                        value={nextRowPatientType}
                        onChange={(e) => handleInOutPatientTypeChange(e.target.value)}
                      >
                        <option value="">Select Patient Type</option>
                        <option value="outpatient">Out-Patient</option>
                        <option value="inpatient">In-Patient</option>
                      </select>
                    }

                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.ust}
                      onChange={() => handleInOutCheckboxChange(index, "ust")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.ift}
                      onChange={() => handleInOutCheckboxChange(index, "ift")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.swd}
                      onChange={() => handleInOutCheckboxChange(index, "swd")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.tr}
                      onChange={() => handleInOutCheckboxChange(index, "tr")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.wax}
                      onChange={() => handleInOutCheckboxChange(index, "wax")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.est}
                      onChange={() => handleInOutCheckboxChange(index, "est")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.sht}
                      onChange={() => handleInOutCheckboxChange(index, "sht")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.laser}
                      onChange={() => handleInOutCheckboxChange(index, "laser")}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={plan.exs}
                      onChange={() => handleInOutCheckboxChange(index, "exs")}
                    />
                  </td>

                  {nextRowPatientType === "inpatient" || plan.patientType === "inpatient" ? (
                    <>
                      <td>
                        <input
                          type="checkbox"
                          checked={plan.rehab}
                          onChange={() => handleInOutCheckboxChange(index, "rehab")}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>

                      </td>
                    </>
                  )}
                  <td>
                    {/*console.log("isEditing:", isEditing, "isNewRow:", plan.isNewRow)*/}
                    {!plan.isNewRow && index > 0 &&
                      sortedRows[index - 1].startDate === plan.startDate
                      ? null
                      : (
                        <>
                          {!plan.isNewRow && (
                            <>
                              <button onClick={() => handleViewBill(index)}>
                                View Bill
                              </button>
                              <button onClick={() => { handleRowSelection(index); handleInOutCreateNewInBill("inpatient"); }}>
                                Create New Inpatient Bill
                              </button>
                              <button onClick={() => { handleRowSelection(index); handleInOutCreateNewOutBill("outpatient"); }}>
                                Create New Outpatient Bill
                              </button>

                            </>
                          )}
                        </>
                      )}
                    {isEditing && plan.isNewRow && (
                      <div>
                        <button onClick={() => handleDeleteRow(index)}>
                          Delete
                        </button>
                        <button onClick={handleInOutCreateBill}>
                          Create Bill
                        </button>
                        <button onClick={handleInOutUpdate}>
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {createoverlayVisible && (
        <>
          {(nextRowPatientType === "outpatient" || currentRowPatientType === "outpatient") && (
            <div>
              <div className="in-patient-bill-container">
                <h2>Out-Patient Billing</h2>

                {/* Patient Details */}
                <div className="patient-details"></div>

                {/* Out-Patient Specific Information */}
                <div className="out-patient-info">
                  {/*<label>
                    Appointment Date:
                    <input
                      type="date"
                      name="appointmentDate"
                      value={outPatientBillDetails.outBill.appointmentDate}
                      onChange={handleIOOutPatientInputChange}
                    />
          </label>*/}
                  <label>
                    Service Name:
                    <input
                      type="text"
                      name="serviceName"
                      value={outPatientBillDetails.outBill.serviceName}
                      onChange={handleIOOutPatientInputChange}
                    />
                  </label>
                </div>

                {/* Billing Information */}
                <div className="billing-info">
                  <label>
                    Payment Mode:
                    <select
                      name="paymentMode"
                      value={outPatientBillDetails.outBill.paymentMode}
                      onChange={handleIOOutPatientInputChange}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </label>
                  <label>
                    Bill Amount:
                    <input
                      type="text"
                      name="billAmount"
                      value={outPatientBillDetails.outBill.billAmount}
                      onChange={handleIOOutPatientInputChange}
                    />
                  </label>
                </div>
              </div>
              {currentRowPatientType && (
                <button onClick={handleInOutUpdateOutBill}>Update Out Bill</button>
              )}
              <button onClick={closeBill}>Close Bill</button>
            </div>
          )}

          {(nextRowPatientType === "inpatient" || currentRowPatientType === "inpatient") && (
            <div>
              <div className="in-patient-bill-container">
                <h2>In-Patient Billing</h2>
                {/* Patient Details */}

                {/* In-Patient Specific Information */}
                <div className="in-patient-info">
                  <div className="patient-details">
                    <label>
                      Room Number:
                      <input
                        type="text"
                        name="roomNumber"
                        value={inPatientBillDetails.inBill[0].roomNumber}
                        onChange={handleIOInPatientInputChange}
                      />
                    </label>
                  </div>
                  {currentRowPatientType && (
                    <div className="billing-info">
                      <label>
                        Admission Date:
                        <input
                          type="date"
                          name="admissionDate"
                          value={selectedRowStartDate}
                          onChange={handleNewInPatientInputChange}

                        />
                      </label>
                      <label>
                        Discharge Date:
                        <input
                          type="date"
                          name="dischargeDate"
                          value={selectedRowEndDate}
                          onChange={handleNewInPatientInputChange}
                        />
                      </label>
                      <label>
                        Total Days:
                        <input
                          type="text"
                          name="totalDays"
                          value={inPatientBillDetails.inBill[0].totalDays}
                          onChange={handleNewInPatientInputChange}
                          readOnly
                        />
                      </label>
                    </div>
                  )}

                  <label className="amount-per-day-label">
                    Amount Per Day:
                    <div className="bill-section">
                      <div>
                        <p>Visiting Bill</p>
                        <input
                          type="text"
                          name="visitingBill"
                          value={inPatientBillDetails.inBill[0].visitingBill}
                          onChange={handleIOInPatientInputChange}
                        />
                      </div>
                      <div>
                        <p>Physio Bill</p>
                        <input
                          type="text"
                          name="physioBill"
                          value={inPatientBillDetails.inBill[0].physioBill}
                          onChange={handleIOInPatientInputChange}
                        />
                      </div>
                      <div>
                        <p>Nursing Bill</p>
                        <input
                          type="text"
                          name="nursingBill"
                          value={inPatientBillDetails.inBill[0].nursingBill}
                          onChange={handleIOInPatientInputChange}
                        />
                      </div>
                      <div>
                        <p>Other Expenses</p>
                        <input
                          type="text"
                          name="otherExpenses"
                          value={inPatientBillDetails.inBill[0].otherExpenses}
                          onChange={handleIOInPatientInputChange}
                        />
                      </div>
                    </div>
                  </label>
                </div>
                {/* Billing Information */}
                <div>
                  <label className="billing-info">
                    <p>Payment Mode:</p>
                    <select
                      name="paymentMode"
                      value={inPatientBillDetails.inBill[0].paymentMode}
                      onChange={handleIOInPatientInputChange}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Net Banking">Net Banking</option>

                      {/* Add more options as needed */}
                    </select>
                  </label>
                  <label>
                    Bill Amount:
                    <input
                      type="text"
                      name="billAmount"
                      value={inPatientBillDetails.inBill[0].billAmount}
                      readOnly
                    />
                  </label>
                </div>
              </div>
              {currentRowPatientType && (
                <button onClick={handleInOutUpdateInBill}>Update In Bill</button>
              )}
              <button onClick={closeBill}>Close Bill</button>
            </div>
          )}
        </>
      )}
      {viewoverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            {viewoverlayContent}
            <button onClick={closeOverlay}>Close</button>
          </div>
        </div>
      )}

      {isEditing && (
        <button onClick={handleAddInvestRow}>Add new investigation Row</button>
      )}

      {patientRecord && (
        <table className="investigation-treatment">
          <caption>Investigation Treatment</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>X-ray</th>
              <th>MRI</th>
              <th>Others</th>
              <th>Provisional Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {patientRecord.investigation.map((invest, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="date"
                    value={invest.date}
                    onChange={(e) =>
                      handleInOutInvestigationChange(index, "date", e.target.value)
                    }
                    readOnly={!invest.isNewInvestRow} // Read-only for existing rows
                  />
                </td>
                <td>
                  <textarea
                    maxLength={50}
                    name="xray"
                    value={invest.xray}
                    onChange={(e) =>
                      handleInOutTextareaChange("xray", e.target.value)
                    }
                    readOnly={!invest.isNewInvestRow} // Read-only for existing rows
                  ></textarea>
                </td>
                <td>
                  <textarea
                    maxLength={50}
                    name="mri"
                    value={invest.mri}
                    onChange={(e) =>
                      handleInOutTextareaChange("mri", e.target.value)
                    }
                    readOnly={!invest.isNewInvestRow} // Read-only for existing rows
                  ></textarea>
                </td>
                <td>
                  <textarea
                    maxLength={50}
                    name="others"
                    value={invest.others}
                    onChange={(e) =>
                      handleInOutTextareaChange("others", e.target.value)
                    }
                    readOnly={!invest.isNewInvestRow} // Read-only for existing rows
                  ></textarea>
                </td>
                <td>
                  <textarea
                    maxLength={50}
                    name="provisionalDiagnosis"
                    value={invest.provisionalDiagnosis}
                    onChange={(e) =>
                      handleInOutTextareaChange(
                        "provisionalDiagnosis",
                        e.target.value
                      )
                    }
                    readOnly={!invest.isNewInvestRow} // Read-only for existing rows
                  ></textarea>
                </td>
                <td>
                  {isEditing && invest.isNewInvestRow && (
                    <button onClick={() => handleDeleteInvestRow(index)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditing && (
        <div>
          <button onClick={handleInOutUpdateInvestigation}>
            Update Investigation
          </button>
        </div>
      )}

    </>
  );
};
export default InOutBillRow;
