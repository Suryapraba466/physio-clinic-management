import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

import checklist from "./landing-page-imgs/checklist.png";
import errorimg from "./landing-page-imgs/error.png";
import "./CSS/patientdetailsoverlay.css";

const OverlayRecord = (mobileNumber) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(()=>{

    if(isMobile){ 
   handlePrint();
  }
  }, [])

  const [showToast, setShowToast] = useState(false);
  const [mobileNo, setMobileNo] = useState(mobileNumber.mobileNumber || "");
  const [page1, setPage1] = useState(true);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [page6, setPage6] = useState(false);
  const [page7, setPage7] = useState(false);
  const [page8, setPage8] = useState(false);

  const [addRowPressed, setAddRowPressed] = useState(false);
  const [addInvestRowPressed, setAddInvestRowPressed] = useState(false);
  const [showPrintOverlay, setShowPrintOverlay] = useState(true);
  let foundPatientBasicRecord;
  const [selectedRowTotVal, setSelectedRowTotVal] = useState("");
  const [sortedRows, setSortedRows] = useState([]);
  const [newNextRow, setNewNextRow] = useState(false);
  const [recordButtonClicked, setRecordButtonClicked] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [verifiedMobileNo, setVerifiedMobileNo] = useState(false);
  const [founded, setFounded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nextRowPatientType, setNextRowPatientType] = useState("");
  const [currentRowPatientType, setCurrentRowPatientType] = useState("");
  const [viewoverlayVisible, setviewOverlayVisible] = useState(false);
  const [viewoverlayContent, setviewOverlayContent] = useState(null);
  const [isBillSaved, setIsBillSaved] = useState(false);
  const [selectedRowEndDate, setSelectedRowEndDate] = useState("");
  const [selectedRowStartDate, setSelectedRowStartDate] = useState("");
  const [patientBasicRecord, setPatientBasicRecord] = useState({});
  const [patientFound, setPatientFound] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");
  const [closeDetails, setCloseDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appMessage, setAppMessage] = useState("");
  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [createoverlayVisible, setCreateOverlayVisible] = useState(false);
  const [createFreshOverlayVisible, setCreateFreshOverlayVisible] =
    useState(false);
  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showServerNetworkErrorToast, setShowServerNetworkErrorToast] =
    useState(false);
  const [showUnexpectedErrorToast, setShowUnexpectedErrorToast] =
    useState(false);
  const [firstRow, setFirstRow] = useState(false);

  const overlayClass = `loading-overlay${
    loading || isLoading ? " visible" : ""
  }`;
  const msgoverlay = `loading-overlay${
    !loading && appMessage ? " visible" : ""
  }`;

  const [isNeuroSectionEntered, setIsNeuroSectionEntered] = useState(false);
  const [isCardioSectionEntered, setIsCardioSectionEntered] = useState(false);
  const [isPlanTreatmentSectionEntered, setIsPlanTreatmentSectionEntered] =
    useState(false);

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
  const [manualEntry, setManualEntry] = useState(false);

  const [patient, setPatient] = useState({
    mobileNo: "",
    painRegion: {
      Neck: false,
      Wrist: false,
      LowerBack: false,
      Ankle: false,
      Shoulder: false,
      Elbow: false,
      UpperBack: false,
      Knee: false,
    },
    radiatesThrough: {
      Arms: false,
      LegsToKnee: false,
    },
    feelsLike: {
      Numbness: false,
      Tingling: false,
      WeakGrip: false,
    },
    postMedicalHistory: {
      dm: false,
      htn: false,
      cad: false,
      cvd: false,
      asthma: false,
      smoking: false,
      alcohol: false,
      surgicalHistory: false,
    },
    painAssessment: {
      beforeTreatment: {
        level: 0, // Initialize with a default value
      },
    },
    complaint: "",
    complaints: "", // Initialize with an empty complaint
    aggFactor: "", // Add other properties as needed
    relFactor: "",
    duration: "",
    onset: "",
    vitalSign: {
      BP: "",
      RR: "",
      HR: "",
      SPO2: "",
      TEMP: "",
    },
    observation: {
      onObservation: {
        SkinColor: { normal: false, abnormal: false },
        Deformity: { normal: false, abnormal: false },
        Redness: { normal: false, abnormal: false },
        ShinySkin: { normal: false, abnormal: false },
        OpenWounds: { normal: false, abnormal: false },
      },
      onPalpation: {
        Tenderness: { normal: false, abnormal: false },
        Warmth: { normal: false, abnormal: false },
        Swelling: { normal: false, abnormal: false },
        Odema: { normal: false, abnormal: false },
      },
    },
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
    coordination: {
      fingerToNose: { normal: false, abnormal: false, remarks: "" },
      fingerOpposition: { normal: false, abnormal: false, remarks: "" },
      grip: { normal: false, abnormal: false, remarks: "" },
      pronationSupination: { normal: false, abnormal: false, remarks: "" },
      reboundTest: { normal: false, abnormal: false, remarks: "" },
      tappingHand: { normal: false, abnormal: false, remarks: "" },
      tappingFoot: { normal: false, abnormal: false, remarks: "" },
      heelToKnee: { normal: false, abnormal: false, remarks: "" },
      drawingCircleHand: { normal: false, abnormal: false, remarks: "" },
      drawingCircleFoot: { normal: false, abnormal: false, remarks: "" },
      // Add other properties as needed
    },
    standingWalking: {
      normalPosture: { normal: false, abnormal: false, remarks: "" },
      tandonWalking: { normal: false, abnormal: false, remarks: "" },
      // Add other properties as needed
    },
    balance: {
      sitting: { normal: false, abnormal: false, remarks: "" },
      standing: { normal: false, abnormal: false, remarks: "" },
      posture: { normal: false, abnormal: false, remarks: "" },
      gait: { normal: false, abnormal: false, remarks: "" },
      // Add other properties as needed
    },
    handFunction: {
      grip: { normal: false, abnormal: false, remarks: "" },
      grasp: { normal: false, abnormal: false, remarks: "" },
      release: { normal: false, abnormal: false, remarks: "" },
      // Add other properties as needed
    },
    prehension: {
      tipToTip: { normal: false, abnormal: false, remarks: "" },
      padToPad: { normal: false, abnormal: false, remarks: "" },
      tipToPad: { normal: false, abnormal: false, remarks: "" },
      // Add other properties as needed
    },
    subjectiveAssessment: {
      breathlessness: {
        duration: "",
        severity: "",
        pattern: "",
        associatedFactors: "",
      },
      cough: { duration: "", severity: "", pattern: "", associatedFactors: "" },
      sputumHemoptysis: {
        duration: "",
        severity: "",
        pattern: "",
        associatedFactors: "",
        hemoptysisType: "",
      },
      wheeze: {
        duration: "",
        severity: "",
        pattern: "",
        associatedFactors: "",
      },
      chestPain: {
        duration: "",
        severity: "",
        pattern: "",
        associatedFactors: "",
      },
      // Add other properties as needed
    },
    rpe: {
      point6: false,
      point7: false,
      point8: false,
      point9: false,
      point10: false,
      point11: false,
      point12: false,
      point13: false,
      point14: false,
      point15: false,
      point16: false,
      point17: false,
    },
    brpe: {
      rating6: false,
      rating7: false,
      rating8: false,
      rating9: false,
      rating10: false,
      rating11: false,
      rating12: false,
      rating13: false,
      rating14: false,
      rating15: false,
      rating16: false,
      rating17: false,
      rating18: false,
      rating19: false,
      rating20: false,
    },
    generalObservation: {
      bodyBuilt: { normal: false, abnormal: false, remarks: "" },
      handsAndFingertips: { normal: false, abnormal: false, remarks: "" },
      eyes: { normal: false, abnormal: false, remarks: "" },
      cyanosis: { normal: false, abnormal: false, remarks: "" },
      jugularVenousPressure: { normal: false, abnormal: false, remarks: "" },
    },
    chestObservation: {
      breathingPattern: { normal: false, abnormal: false, remarks: "" },
      chestMovement: { normal: false, abnormal: false, remarks: "" },
      palpationOfChest: { normal: false, abnormal: false, remarks: "" },
      chestExpansion: { normal: false, abnormal: false, remarks: "" },
      // ... other properties
    },
    barthelIndex: {
      feeding: { score: 0, activity: "Feeding", maxScore: 10 },
      bathing: { score: 0, activity: "Bathing", maxScore: 5 },
      grooming: { score: 0, activity: "Grooming", maxScore: 5 },
      dressing: { score: 0, activity: "Dressing", maxScore: 10 },
      bowels: { score: 0, activity: "Bowels", maxScore: 10 },
      bladder: { score: 0, activity: "Bladder", maxScore: 10 },
      toiletUse: { score: 0, activity: "Toilet Use", maxScore: 10 },
      transfer: {
        score: 0,
        activity: "Transfer (Bed to Chair and Back)",
        maxScore: 15,
      },
      mobility: {
        score: 0,
        activity: "Mobility (On level surfaces)",
        maxScore: 15,
      },
      stairs: { score: 0, activity: "Stairs", maxScore: 10 },
    },

    chestShapeObservation: {
      chestShape: {
        normal: false,
        barrelChest: false,
        kyphosis: false,
        pectusExcavatum: false,
        pectusCarinatum: false,
      },
    },
    chestMotionObservation: {
      middleLobeLingulaMotion: {
        normal: false,
        abnormal: false,
        remarks: "",
      },
      upperLobeMotion: {
        normal: false,
        abnormal: false,
        remarks: "",
      },
      lowerLobeMotion: {
        normal: false,
        abnormal: false,
        remarks: "",
      },
    },
    planOfTreatment: "",

    planTreatment: [
      {
        patientType: "outpatient",
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
        amountPerDay: "",
      },
    ],
  });

  const clinicName = localStorage.getItem("clinicName");
  const doctorName = localStorage.getItem("doctorName");

  // Check if the values are not null or undefined before using them
  if (clinicName && doctorName) {
    // Do something with the values, such as displaying them on the UI
    console.log("Clinic Name in overlayrecord page:", clinicName);
    console.log("Doctor Name in overlayrecord page:", doctorName);
  } else {
    // Handle the case where the values are not found in localStorage
    console.log(
      "Clinic Name or Doctor Name not found in localStorage in overlayrecord page"
    );
  }

  const handleChestShapeChange = (shape) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      chestShapeObservation: {
        ...prevPatient.chestShapeObservation,
        chestShape: {
          ...prevPatient.chestShapeObservation.chestShape,
          [shape]: !prevPatient.chestShapeObservation.chestShape[shape], // Toggle the value
        },
      },
    }));
  };
  const createPatientRecord = async () => {
    const dateAndTime = new Date().toLocaleString();

    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    try {
      setRecordButtonClicked(true);

      if (firstRow) {
        if (patient.planTreatment[0].patientType === "choose type") {
          alert("Please select a patient type from plan treament");
          setLoading(false);
          return;
        } else if (
          !patient.outPatientBill[0].appointmentDate &&
          (!patient.inPatientBill[0].admissionDate ||
            !patient.inPatientBill[0].dischargeDate)
        ) {
          alert("Please select date from plan treament");
          setLoading(false);
          return;
        }
      }

      if (firstRow) {
        const startedDate =
          patient.planTreatment[0].patientType === "inpatient"
            ? patient.inPatientBill[0].admissionDate
            : patient.outPatientBill[0].appointmentDate;

        const endedDate =
          patient.planTreatment[0].patientType === "inpatient"
            ? patient.inPatientBill[0].dischargeDate
            : null; // Set to null for outpatient

        const tDays =
          patient.planTreatment[0].patientType === "inpatient"
            ? patient.inPatientBill[0].totalDays
            : 1; // Set days to 1 for outpatient
        if (patient.planTreatment[0].patientType === "inpatient") {
          patient.planTreatment[0].startDate = startedDate;
          patient.planTreatment[0].endDate = endedDate;
          patient.planTreatment[0].days = tDays;
        } else {
          patient.planTreatment[0].startDate = startedDate;
          patient.planTreatment[0].endDate = "";
          patient.planTreatment[0].days = 1;
        }

        const inBillDetails =
          patient.planTreatment[0].patientType === "inpatient" &&
          isBillDetailsInPatientFilled()
            ? patient.inPatientBill[0]
            : undefined;

        const outBillDetails =
          patient.planTreatment[0].patientType === "outpatient" &&
          isBillDetailsOutPatientFilled()
            ? patient.outPatientBill[0]
            : undefined;

        if (
          (patient.planTreatment[0].patientType === "inpatient" &&
            inBillDetails === undefined) ||
          (patient.planTreatment[0].patientType === "outpatient" &&
            outBillDetails === undefined)
        ) {
          // Display confirmation dialog
          const userConfirmation = window.confirm(
            "Bill details are not filled. Do you want to continue your update?"
          );

          if (!userConfirmation) {
            // User clicked "No", do not continue with the update
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);

      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/create_record",
        {
          patient: {
            ...patient,
          },
          clinicName,
          doctorName,
        }
      );

      const { message, inPatientBill } = response.data;
      if (response.status === 200) {
        setMobileNo("");
        setPatient({
          mobileNo: "",
          painRegion: {
            Neck: false,
            Wrist: false,
            LowerBack: false,
            Ankle: false,
            Shoulder: false,
            Elbow: false,
            UpperBack: false,
            Knee: false,
          },
          radiatesThrough: {
            Arms: false,
            LegsToKnee: false,
          },
          feelsLike: {
            Numbness: false,
            Tingling: false,
            WeakGrip: false,
          },
          postMedicalHistory: {
            dm: false,
            htn: false,
            cad: false,
            cvd: false,
            asthma: false,
            smoking: false,
            alcohol: false,
            surgicalHistory: false,
          },
          painAssessment: {
            beforeTreatment: {
              level: 0, // Initialize with a default value
            },
          },
          complaints: "", // Initialize with an empty complaint
          aggFactor: "", // Add other properties as needed
          relFactor: "",
          duration: "",
          onset: "",
          vitalSign: {
            BP: "",
            RR: "",
            HR: "",
            SPO2: "",
            TEMP: "",
          },
          observation: {
            onObservation: {
              SkinColor: { normal: false, abnormal: false },
              Deformity: { normal: false, abnormal: false },
              Redness: { normal: false, abnormal: false },
              ShinySkin: { normal: false, abnormal: false },
              OpenWounds: { normal: false, abnormal: false },
            },
            onPalpation: {
              Tenderness: { normal: false, abnormal: false },
              Warmth: { normal: false, abnormal: false },
              Swelling: { normal: false, abnormal: false },
              Odema: { normal: false, abnormal: false },
            },
          },
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
          coordination: {
            fingerToNose: { normal: false, abnormal: false, remarks: "" },
            fingerOpposition: { normal: false, abnormal: false, remarks: "" },
            grip: { normal: false, abnormal: false, remarks: "" },
            pronationSupination: {
              normal: false,
              abnormal: false,
              remarks: "",
            },
            reboundTest: { normal: false, abnormal: false, remarks: "" },
            tappingHand: { normal: false, abnormal: false, remarks: "" },
            tappingFoot: { normal: false, abnormal: false, remarks: "" },
            heelToKnee: { normal: false, abnormal: false, remarks: "" },
            drawingCircleHand: { normal: false, abnormal: false, remarks: "" },
            drawingCircleFoot: { normal: false, abnormal: false, remarks: "" },
            // Add other properties as needed
          },
          standingWalking: {
            normalPosture: { normal: false, abnormal: false, remarks: "" },
            tandonWalking: { normal: false, abnormal: false, remarks: "" },
            // Add other properties as needed
          },
          balance: {
            sitting: { normal: false, abnormal: false, remarks: "" },
            standing: { normal: false, abnormal: false, remarks: "" },
            posture: { normal: false, abnormal: false, remarks: "" },
            gait: { normal: false, abnormal: false, remarks: "" },
            // Add other properties as needed
          },
          handFunction: {
            grip: { normal: false, abnormal: false, remarks: "" },
            grasp: { normal: false, abnormal: false, remarks: "" },
            release: { normal: false, abnormal: false, remarks: "" },
            // Add other properties as needed
          },
          prehension: {
            tipToTip: { normal: false, abnormal: false, remarks: "" },
            padToPad: { normal: false, abnormal: false, remarks: "" },
            tipToPad: { normal: false, abnormal: false, remarks: "" },
            // Add other properties as needed
          },
          subjectiveAssessment: {
            breathlessness: {
              duration: "",
              severity: "",
              pattern: "",
              associatedFactors: "",
            },
            cough: {
              duration: "",
              severity: "",
              pattern: "",
              associatedFactors: "",
            },
            sputumHemoptysis: {
              duration: "",
              severity: "",
              pattern: "",
              associatedFactors: "",
              hemoptysisType: "",
            },
            wheeze: {
              duration: "",
              severity: "",
              pattern: "",
              associatedFactors: "",
            },
            chestPain: {
              duration: "",
              severity: "",
              pattern: "",
              associatedFactors: "",
            },
            // Add other properties as needed
          },
          rpe: {
            point6: false,
            point7: false,
            point8: false,
            point9: false,
            point10: false,
            point11: false,
            point12: false,
            point13: false,
            point14: false,
            point15: false,
            point16: false,
            point17: false,
          },
          brpe: {
            rating6: false,
            rating7: false,
            rating8: false,
            rating9: false,
            rating10: false,
            rating11: false,
            rating12: false,
            rating13: false,
            rating14: false,
            rating15: false,
            rating16: false,
            rating17: false,
            rating18: false,
            rating19: false,
            rating20: false,
          },
          generalObservation: {
            bodyBuilt: { normal: false, abnormal: false, remarks: "" },
            handsAndFingertips: { normal: false, abnormal: false, remarks: "" },
            eyes: { normal: false, abnormal: false, remarks: "" },
            cyanosis: { normal: false, abnormal: false, remarks: "" },
            jugularVenousPressure: {
              normal: false,
              abnormal: false,
              remarks: "",
            },
          },
          chestObservation: {
            breathingPattern: { normal: false, abnormal: false, remarks: "" },
            chestMovement: { normal: false, abnormal: false, remarks: "" },
            palpationOfChest: { normal: false, abnormal: false, remarks: "" },
            chestExpansion: { normal: false, abnormal: false, remarks: "" },
            // ... other properties
          },
          barthelIndex: {
            feeding: { score: 0, activity: "Feeding", maxScore: 10 },
            bathing: { score: 0, activity: "Bathing", maxScore: 5 },
            grooming: { score: 0, activity: "Grooming", maxScore: 5 },
            dressing: { score: 0, activity: "Dressing", maxScore: 10 },
            bowels: { score: 0, activity: "Bowels", maxScore: 10 },
            bladder: { score: 0, activity: "Bladder", maxScore: 10 },
            toiletUse: { score: 0, activity: "Toilet Use", maxScore: 10 },
            transfer: {
              score: 0,
              activity: "Transfer (Bed to Chair and Back)",
              maxScore: 15,
            },
            mobility: {
              score: 0,
              activity: "Mobility (On level surfaces)",
              maxScore: 15,
            },
            stairs: { score: 0, activity: "Stairs", maxScore: 10 },
          },

          chestShapeObservation: {
            chestShape: {
              normal: false,
              barrelChest: false,
              kyphosis: false,
              pectusExcavatum: false,
              pectusCarinatum: false,
            },
          },
          chestMotionObservation: {
            middleLobeLingulaMotion: {
              normal: false,
              abnormal: false,
              remarks: "",
            },
            upperLobeMotion: {
              normal: false,
              abnormal: false,
              remarks: "",
            },
            lowerLobeMotion: {
              normal: false,
              abnormal: false,
              remarks: "",
            },
          },
          planOfTreatment: "",

          planTreatment: [
            {
              patientType: "outpatient",
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
              amountPerDay: "",
            },
          ],
        });
        setLoading(false);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5300);
        console.log("messageeeeeeeeeeeeeeeeeeeeeee", message);
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
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

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
    handleDateChange();
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
    setOutPatientBillDetails((prevPatient) => ({
      ...prevPatient,
      outBill: [
        {
          ...prevPatient.outBill[0],
          appointmentDate: startDate,
        },
      ],
    }));
  }, [selectedRowStartDate, selectedRowEndDate]);

  //  useEffect(() => {
  //     if (foundPatientBasicRecord.planTreatment[0].patientType!=='') {
  //         const sort = patient.planTreatment
  //             .filter((plan) => !plan.isNewRow)
  //             .sort((a, b) => {
  //                 if (a.startDate !== b.startDate) {
  //                     return a.startDate > b.startDate ? 1 : -1;
  //                 }
  //                 return a.patientType.localeCompare(b.patientType);
  //             });

  //         const newRow = patient.planTreatment.find((plan) => plan.isNewRow);
  //         if (newRow) {
  //             sort.push(newRow);
  //         }

  //         setSortedRows(sort);
  //         setPatient((prevPatient) => ({
  //             ...prevPatient,
  //             planTreatment: sort,
  //         }));
  //     }
  // }, [founded, newNextRow]);

  const handleInOutCheckboxChange = (index, field) => {
    setPatient((prevpatient) => ({
      ...prevpatient,
      planTreatment: prevpatient.planTreatment.map((item, i) =>
        i === index && item.isNewRow ? { ...item, [field]: !item[field] } : item
      ),
    }));
  };
  const handleInOutInputChange = (index, field, value) => {
    // Update the patient record in the state immediately
    setPatient((prevpatient) => {
      // console.log("Handling Input Change - isNewRow:", prevpatient.planTreatment[index].isNewRow); // Add this line
      const updatedPlanTreatment = prevpatient.planTreatment.map((item, i) =>
        i === index && item.isNewRow ? { ...item, [field]: value } : item
      );

      return {
        ...prevpatient,
        planTreatment: updatedPlanTreatment,
      };
    });
  };
  const handleAddRow = () => {
    if (addRowPressed) {
      setAddRowPressed(false);
    } else {
      setAddRowPressed(true);
    }

    setNewNextRow(true);
    setPatient((prevPatient) => {
      const newPlan = {
        startDate: "", // You might want to provide default values here
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
        isNewRow: true,
        patientType: nextRowPatientType, // Update patientType directly
      };

      const updatedRecord = {
        planTreatment: [...prevPatient.planTreatment, newPlan],
      };

      // Update the backend immediately when a new row is added

      return { ...prevPatient, ...updatedRecord };
    });
  };

  console.log("added rowwwww", patient.planTreatment);
  const handleAddInvestRow = () => {
    if (!addInvestRowPressed) {
      setAddInvestRowPressed(true);
    } else {
      setAddInvestRowPressed(false);
    }
    setPatient((prevpatient) => {
      const newInvest = {
        date: "",
        xray: "",
        mri: "",
        others: "",
        provisionalDiagnosis: "",
        isNewInvestRow: true,
      };

      const updatedRecord = {
        investigation: [...prevpatient.investigation, newInvest],
      };

      // Update the backend immediately when a new row is added

      return { ...prevpatient, ...updatedRecord };
    });
  };
  const handleDeleteRow = () => {
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
    setAddRowPressed(false);
    setPatient((prevpatient) => {
      const updatedRecord = {
        planTreatment: prevpatient.planTreatment.slice(0, -1), // Remove the last item
      };

      //updateBackend(updatedRecord);

      return { ...prevpatient, ...updatedRecord };
    });
  };

  const handleDeleteInvestRow = () => {
    setAddInvestRowPressed(false);
    setPatient((prevpatient) => {
      const lastIndex = prevpatient.investigation.length - 1;
      const updatedRecord = {
        investigation: prevpatient.investigation.filter(
          (item, i) => i !== lastIndex
        ),
      };

      //updateBackend(updatedRecord);

      return { ...prevpatient, ...updatedRecord };
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
    const amountPerDay = sumOfBills.toFixed(2);

    updatedInPatientBill[0] = {
      ...updatedInPatientBill[0],
      amountPerDay: amountPerDay,
      billAmount: (sumOfBills * totalDays).toFixed(2),
    };

    setInPatientBillDetails((prevPatient) => ({
      ...prevPatient,
      inBill: updatedInPatientBill,
    }));
  };
  const handleNewInPatientInputChange = (e) => {
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
  const handleInOutUpdate = () => {
    console.log("update");
    const selectedPlanTreatment = patient.planTreatment.find(
      (plan) => plan.isNewRow
    );

    console.log("sel row:;;;", selectedPlanTreatment);
    if (!selectedPlanTreatment) {
      console.error("Error: No selected plan treatment found.");
      setAddRowPressed(false);
      return;
    }

    // Extract relevant information
    // const ptype = nextRowPatientType;
    console.log("iiiiiiiiiiiiiiiiiiiii", nextRowPatientType);

    console.log("inbill ", inPatientBillDetails.inBill[0]);
    console.log("outbill ", outPatientBillDetails.outBill[0]);
    // Ensure each row has the appropriate date value
    const newRows = patient.planTreatment
      .filter((item) => item.isNewRow)
      .map((row) => {
        return {
          ...row,
          patientType: nextRowPatientType,

          startDate:
            nextRowPatientType === "inpatient"
              ? inPatientBillDetails.inBill[0].admissionDate
              : outPatientBillDetails.outBill[0].appointmentDate,
          endDate:
            nextRowPatientType === "inpatient" &&
            inPatientBillDetails.inBill[0].dischargeDate,
          days:
            nextRowPatientType === "inpatient"
              ? inPatientBillDetails.inBill[0].totalDays
              : 1, // Set days to 1 for outpatient
        };
      });

    console.log(newRows);

    const inBillDetails =
      nextRowPatientType === "inpatient" && isBillDetailsInOutInPatientFilled()
        ? inPatientBillDetails.inBill[0]
        : undefined;

    const outBillDetails =
      nextRowPatientType === "outpatient" &&
      isBillDetailsInOutOutPatientFilled()
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
    alert("saved successfully");
    setAddRowPressed(false);
    // Update the patient state with new data
    setPatient((prevPatient) => ({
      ...prevPatient,
      planTreatment: prevPatient.planTreatment.map((plan) =>
        plan.isNewRow ? newRows.find((newRow) => newRow.id === plan.id) : plan
      ),
    }));

    // Additional UI updates or error handling if needed
  };

  const handleRowSelection = (index) => {
    setSelectedRowStartDate(sortedRows[index].startDate);
    setSelectedRowEndDate(sortedRows[index].endDate);
  };
  const handleInOutFreshUpdateOutBill = async () => {
    setCreateOverlayVisible(false);
    setCreateFreshOverlayVisible(false);
  };

  const handleInOutUpdateOutBill = async () => {
    const isBillDetailsFilled = isBillDetailsInOutOutPatientFilled();
    if (isBillDetailsFilled) {
      try {
        // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update

        let updatedBill;
        if (selectedRowStartDate) {
          updatedBill = {
            mobileNumber: mobileNo,
            appointmentDate: selectedRowStartDate,
            serviceName: outPatientBillDetails.outBill[0].serviceName,
            paymentMode: outPatientBillDetails.outBill[0].paymentMode,
            billAmount: outPatientBillDetails.outBill[0].billAmount,
          };
        } else {
          updatedBill = {
            mobileNumber: mobileNo,
            appointmentDate: outPatientBillDetails.outBill[0].appointmentDate,
            serviceName: outPatientBillDetails.outBill[0].serviceName,
            paymentMode: outPatientBillDetails.outBill[0].paymentMode,
            billAmount: outPatientBillDetails.outBill[0].billAmount,
          };
        }

        patient.outPatientBill.push(updatedBill);
        alert("Bill saves successfully!");
        setCreateOverlayVisible(false);
      } catch (error) {
        console.error("Error updating outpatient bill:", error);
        // Handle error scenarios
      }
    } else {
      // Handle case where bill details are not filled
      console.error("Error: Bill details not filled.");
      alert("Bill details not filled");
    }
  };

  //console.log("currentrow",currentRowPatientType);
  const handleInOutUpdateInBill = async () => {
    const isBillDetailsFilled = isBillDetailsInOutInPatientFilled();
    if (isBillDetailsFilled) {
      try {
        // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update

        let updatedBill;
        if (selectedRowStartDate && selectedRowEndDate) {
          updatedBill = {
            mobileNumber: mobileNo,
            roomNumber: inPatientBillDetails.inBill[0].roomNumber,
            admissionDate: selectedRowStartDate,
            dischargeDate: selectedRowEndDate,
            totalDays: selectedRowTotVal,
            visitingBill: inPatientBillDetails.inBill[0].visitingBill,
            physioBill: inPatientBillDetails.inBill[0].physioBill,
            nursingBill: inPatientBillDetails.inBill[0].nursingBill,
            otherExpenses: inPatientBillDetails.inBill[0].otherExpenses,
            paymentMode: inPatientBillDetails.inBill[0].paymentMode,
            amountPerDay: inPatientBillDetails.inBill[0].amountPerDay,
            billAmount: inPatientBillDetails.inBill[0].billAmount,
          };
        } else {
          updatedBill = {
            mobileNumber: mobileNo,
            roomNumber: inPatientBillDetails.inBill[0].roomNumber,
            admissionDate: inPatientBillDetails.inBill[0].admissionDate,
            dischargeDate: inPatientBillDetails.inBill[0].dischargeDate,
            totalDays: inPatientBillDetails.inBill[0].totalDays,
            visitingBill: inPatientBillDetails.inBill[0].visitingBill,
            physioBill: inPatientBillDetails.inBill[0].physioBill,
            nursingBill: inPatientBillDetails.inBill[0].nursingBill,
            otherExpenses: inPatientBillDetails.inBill[0].otherExpenses,
            paymentMode: inPatientBillDetails.inBill[0].paymentMode,
            amountPerDay: inPatientBillDetails.inBill[0].amountPerDay,
            billAmount: inPatientBillDetails.inBill[0].billAmount,
          };
        }

        patient.inPatientBill.push(updatedBill);
        alert("Bill saves successfully!");
        setCreateOverlayVisible(false);
      } catch (error) {
        console.error("Error updating inpatient bill:", error);
        // Handle error scenarios
      }
    } else {
      // Handle case where bill details are not filled
      console.error("Error: Bill details not filled.");
      alert("Bill details not filled");
    }
  };
  const handleViewBill = (index, ptype) => {
    // if (ptype === "inpatient") {
    //   const selectedbill = patient.inPatientBill[index];
    //   if (selectedbill.roomNumber === "") {
    //     alert("bill not avaiable");
    //     return;
    //   }
    // }

    // if (ptype === "outpatient") {
    //   const selectedbill = patient.outPatientBill[index];
    //   if (selectedbill.serviceName === "") {
    //     alert("bill not avaiable");
    //     return;
    //   }
    // }
    // Get the selected planTreatment
    const selectedPlanTreatment = patient.planTreatment[index];

    // Find all relevant bills for the selected date
    const relevantInPatientBills = patient.inPatientBill.filter((inPatient) => {
      return (
        new Date(inPatient.admissionDate).toLocaleDateString() ===
        new Date(selectedPlanTreatment.startDate).toLocaleDateString()
      );
    });

    const relevantOutPatientBills = patient.outPatientBill.filter(
      (outPatient) => {
        return (
          new Date(outPatient.appointmentDate).toLocaleDateString() ===
          new Date(selectedPlanTreatment.startDate).toLocaleDateString()
        );
      }
    );
    console.log(relevantInPatientBills, "juuuuuuuuuuuuuuuuuu");
    if (
      relevantInPatientBills.length > 0 ||
      relevantOutPatientBills.length > 0
    ) {
      // Set overlay content
      setviewOverlayContent(
        <div className="billing-details-container123">
          <h3 className="billing-heading123">Billing Details:</h3>
          <div className="billing-flex-container123">
            {/* Render Inpatient Bills on the Left Side */}
            {relevantInPatientBills.length > 0 && (
              <div className="billing-left-side123">
                <h4 className="billing-inpatient-heading123">
                  In Patient Bill
                </h4>
                {relevantInPatientBills.map(
                  (bill, billIndex) =>
                    bill.roomNumber !== "" && (
                      <div className="billing-inpatient-item" key={billIndex}>
                        <strong className="billing-inpatient-title123">
                          Bill {billIndex + 1}:
                        </strong>
                        <div className="billing-inpatient-details123">
                          <div
                            className={
                              bill.roomNumber
                                ? "billing-inpatient-data"
                                : "billing-na"
                            }
                          >
                            <strong>Room Number:</strong>{" "}
                            {bill.roomNumber || "N/A"}
                          </div>
                          <div
                            className={
                              bill.admissionDate
                                ? "billing-inpatient-data"
                                : "billing-na"
                            }
                          >
                            <strong>Admission Date:</strong>{" "}
                            {bill.admissionDate
                              ? new Date(
                                  bill.admissionDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div
                            className={
                              bill.dischargeDate
                                ? "billing-inpatient-data"
                                : "billing-na"
                            }
                          >
                            <strong>Discharge Date:</strong>{" "}
                            {bill.dischargeDate
                              ? new Date(
                                  bill.dischargeDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Total Days:</strong>{" "}
                            {bill.totalDays || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Visiting Bill:</strong>{" "}
                            {bill.visitingBill || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Physio Bill:</strong>{" "}
                            {bill.physioBill || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Nursing Bill:</strong>{" "}
                            {bill.nursingBill || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Other Expenses:</strong>{" "}
                            {bill.otherExpenses || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Payment Mode:</strong>{" "}
                            {bill.paymentMode || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Amount Per Day:</strong>{" "}
                            {bill.amountPerDay || "N/A"}
                          </div>
                          <div className="billing-inpatient-data123">
                            <strong>Bill Amount:</strong>{" "}
                            {bill.billAmount || "N/A"}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
            {/* Render Outpatient Bills on the Right Side */}
            {relevantOutPatientBills.length > 0 && (
              <div className="billing-right-side123">
                <h4 className="billing-outpatient-heading123">
                  Out Patient Bill
                </h4>
                {relevantOutPatientBills.map(
                  (bill, billIndex) =>
                    bill.serviceName !== "" && (
                      <div className="billing-outpatient-item" key={billIndex}>
                        <strong className="billing-outpatient-title123">
                          Bill {billIndex + 1}:
                        </strong>
                        <div className="billing-outpatient-details123">
                          <div
                            className={
                              bill.appointmentDate
                                ? "billing-outpatient-data"
                                : "billing-na"
                            }
                          >
                            <strong>Appointment Date:</strong>{" "}
                            {bill.appointmentDate || "N/A"}
                          </div>
                          <div className="billing-outpatient-data123">
                            <strong>Service Name:</strong>{" "}
                            {bill.serviceName || "N/A"}
                          </div>
                          <div className="billing-outpatient-data123">
                            <strong>Payment Mode:</strong>{" "}
                            {bill.paymentMode || "N/A"}
                          </div>
                          <div className="billing-outpatient-data123">
                            <strong>Bill Amount:</strong>{" "}
                            {bill.billAmount || "N/A"}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
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
    setNextRowPatientType(newPatientType);
  };
  console.log("pppppppprptttttttttttt", nextRowPatientType);

  const handleInOutInvestigationChange = (index, field, value) => {
    // Update the patient record in the state immediately
    setPatient((prevpatient) => ({
      ...prevpatient,
      investigation: prevpatient.investigation.map((item, i) =>
        i === index && item.isNewInvestRow ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleInOutUpdateInvestigation = () => {
    // Extract only the new rows from the patient record
    const newRows = patient.investigation.filter((item) => item.isNewInvestRow);

    if (!newRows || newRows.length === 0) {
      console.error("Error: No selected investigation found.");
      setAddInvestRowPressed(false);
      return;
    }

    // Update the patient state with new data
    setPatient((prevPatient) => ({
      ...prevPatient,
      investigation: prevPatient.investigation.map((investRow) =>
        investRow.isNewInvestRow
          ? newRows.find((newRow) => newRow.id === investRow.id)
          : investRow
      ),
    }));

    alert("Investigation updated successfully");
    setAddInvestRowPressed(false);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInOutTextareaChange = (field, value) => {
    setPatient((prevpatient) => ({
      ...prevpatient,
      investigation: prevpatient.investigation.map((entry, index) =>
        index === prevpatient.investigation.length - 1
          ? { ...entry, [field]: value }
          : entry
      ),
    }));
  };

  const handleInOutCreateBill = () => {
    handleDateChange();
    if (nextRowPatientType === "outpatient") {
      setSelectedPatientType(nextRowPatientType);
      console.log("out");
      setCreateOverlayVisible(true);
    } else {
      console.log("in");
      setSelectedPatientType(nextRowPatientType);

      setCreateOverlayVisible(true);
    }
  };

  const handleInOutCreateNewInBill = (ptype, sdate, edate) => {
    setCurrentRowPatientType(ptype);
    setSelectedRowStartDate(sdate);
    setSelectedPatientType(ptype);
    setSelectedRowEndDate(edate);
    setCreateOverlayVisible(true);
  };

  const handleInOutCreateNewOutBill = (ptype, sdate) => {
    setCurrentRowPatientType(ptype);
    setSelectedRowStartDate(sdate);
    setSelectedPatientType(ptype);
    setCreateOverlayVisible(true);
  };

  useEffect(() => {
    console.log("currentRowPatientType", currentRowPatientType);
  }, [createoverlayVisible]);
  console.log("recobtn", recordButtonClicked, founded, firstRow);

  // useEffect(() => {
  //     if(founded){

  //     }
  // }, [patient]);

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
      
        setPatient((prevpatient) => ({
          ...prevpatient,
          planTreatment: prevpatient.planTreatment.map((plan) => ({
            ...plan,
            isNewRow: false,
          })),
        }));*/

    // Close the overlay
    setviewOverlayVisible(false);
    // Clear the overlay content
    setviewOverlayContent(null);
  };

  const confirmFreshBill = () => {
    setCreateOverlayVisible(false);
    setCreateFreshOverlayVisible(false);
    alert("Bill saves successfully!");
  };
  const closeBill = () => {
    setCreateOverlayVisible(false);
    setCreateFreshOverlayVisible(false);
    setSelectedRowStartDate("");
    setSelectedRowEndDate("");
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
    // setPatient((prevPatient) => ({
    //     ...prevPatient,
    //     inPatientBill: [
    //         {
    //             roomNumber: '',
    //             admissionDate: '',
    //             dischargeDate: '',
    //             totalDays: '',
    //             visitingBill: '',
    //             physioBill: '',
    //             nursingBill: '',
    //             otherExpenses: '',
    //             paymentMode: '',
    //             billAmount: '',
    //             amountPerDay: '',
    //         },
    //     ],
    //     outPatientBill: [
    //         {
    //             appointmentDate: '',
    //             serviceName: '',
    //             paymentMode: '',
    //             billAmount: '',
    //         },
    //     ],

    // }));
  };
  const isBillDetailsInPatientFilled = () => {
    const inBillDetails = patient.inPatientBill[0];
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
      inBillDetails.amountPerDay &&
      inBillDetails.billAmount
    );
  };
  const isBillDetailsOutPatientFilled = () => {
    const outBillDetails = patient.outPatientBill[0];
    return (
      outBillDetails.appointmentDate &&
      outBillDetails.serviceName &&
      outBillDetails.paymentMode &&
      outBillDetails.billAmount
    );
  };
  const rangeOfMotionJoints = [
    "cervical",
    "shoulder",
    "elbow",
    "wrist",
    "hip",
    "knee",
    "ankle",
  ];
  const severityOptions = ["Critical", "High", "Medium", "Low", "None"];
  const hemoptysisOptions = [
    "Red: Blood",
    "Rust: Pneumonia",
    "Purple: Neoplasm",
    "Yellow: Infected",
    "Green: Pus",
    "Pink: Pulmonary Oedema",
  ];
  const rangeOfMotionItems = [
    { label: "FLEXION", name: "flexion" },
    { label: "EXTENSION", name: "extension" },
    { label: "ABDUCTION", name: "abduction" },
    { label: "ADDUCTION", name: "adduction" },
    { label: "EVERSION", name: "eversion" },
    { label: "INVERSION", name: "inversion" },
    { label: "EXTERNAL ROTATION", name: "externalRotation" },
    { label: "INTERNAL ROTATION", name: "internalRotation" },
    { label: "DORSI FLEXION", name: "dorsiFlexion" },
    { label: "PLANTAR FLEXION", name: "plantarFlexion" },
    { label: "SUPINATION", name: "supination" },
    { label: "PRONATION", name: "pronation" },
    { label: "LATERAL ROTATION", name: "lateralRotation" },
  ];
  const musclePowerItems = [
    { label: "C1-C2 – CERVICAL FLEXION", name: "cervicalC1C2Flexion" },
    { label: "C3 – CERVICAL SIDE FLEXION", name: "cervicalC3SideFlexion" },
    { label: "C4-SCAPULA ELEVATION", name: "scapulaC4Elevation" },
    { label: "C5-SHOULDER ABDUCTION", name: "shoulderC5Abduction" },
    {
      label: "C6-ELBOW FLEXION AND WRIST EXTENSION",
      name: "elbowC6FlexionWristExtension",
    },
    {
      label: "C7-ELBOW EXTENSION AND WRIST FLEXION",
      name: "elbowC7ExtensionWristFlexion",
    },
    { label: "C8-THUMB EXTENSION", name: "thumbC8Extension" },
    { label: "L1- L2 –HIP FLEXION", name: "hipL1L2Flexion" },
    { label: "L3 –KNEE EXTENSION", name: "kneeL3Extension" },
    { label: "L4 –ANKLE DORSIFLEXION", name: "ankleL4Dorsiflexion" },
    { label: "L5 –BIG TOE EXTENSION", name: "bigToeL5Extension" },
    { label: "S1 –ANKLE PLANTAR FLEXION", name: "ankleS1PlantarFlexion" },
    { label: "S2 –KNEE FLEXION", name: "kneeS2Flexion" },
    // Add more items as needed
  ];
  const coordinationItems = [
    { label: "FINGER TO NOSE", name: "fingerToNose" },
    { label: "FINGER OPPOSITION", name: "fingerOpposition" },
    { label: "GRIP", name: "grip" },
    { label: "PRONATION/SUPINATION", name: "pronationSupination" },
    { label: "REBOUND TEST", name: "reboundTest" },
    { label: "TAPPING(HAND)", name: "tappingHand" },
    { label: "TAPPING(FOOT)", name: "tappingFoot" },
    { label: "HEEL TO KNEE", name: "heelToKnee" },
    { label: "DRAWING A CIRCLE (HAND)", name: "drawingCircleHand" },
    { label: "DRAWING A CIRCLE (FOOT)", name: "drawingCircleFoot" },
    // Add more items as needed
  ];
  const standingWalkingItems = [
    { label: "STANDING: NORMAL POSTURE", name: "normalPosture" },
    { label: "TANDON WALKING", name: "tandonWalking" },
    // Add more items as needed
  ];
  const onObservation = [
    { label: "SKINCOLOR", name: "SkinColor" },
    { label: "DEFORMITY", name: "Deformity" },
    { label: "REDNESS", name: "Redness" },
    { label: "SHINYSKIN", name: "ShinySkin" },
    { label: "OPENWOUNDS", name: "OpenWounds" },
  ];

  const onPalpation = [
    { label: "TENDERNESS", name: "Tenderness" },
    { label: "WARMTH", name: "Warmth" },
    { label: "SWELLING", name: "Swelling" },
    { label: "ODEMA", name: "Odema" },
  ];
  const balanceItems = [
    { label: "SITTING", name: "sitting" },
    { label: "STANDING", name: "standing" },
    { label: "POSTURE", name: "posture" },
    { label: "GAIT", name: "gait" },
    // Add more items as needed
  ];
  const handFunctionItems = [
    { label: "GRIP", name: "grip" },
    { label: "GRASP", name: "grasp" },
    { label: "RELEASE", name: "release" },
    // Add more items as needed
  ];
  const prehensionItems = [
    { label: "TIP TO TIP", name: "tipToTip" },
    { label: "PAD TO PAD", name: "padToPad" },
    { label: "TIP TO PAD", name: "tipToPad" },
    // Add more items as needed
  ];
  const rpeData = [
    {
      point: 6,
      effort: "No Exertion",
      description: "Little to no movement, very relaxed",
      maxHRPercentage: "20%",
    },
    {
      point: 7,
      effort: "Extremely Light",
      description: "Able to maintain pace",
      maxHRPercentage: "30%",
    },
    { point: 8, effort: "", description: "", maxHRPercentage: "40%" },
    {
      point: 9,
      effort: "Very Light",
      description: "Comfortable and breathing harder",
      maxHRPercentage: "50%",
    },
    { point: 10, effort: "", description: "", maxHRPercentage: "55%" },
    {
      point: 11,
      effort: "Light",
      description: "Minimal sweating, can talk easily",
      maxHRPercentage: "60%",
    },
    { point: 12, effort: "", description: "", maxHRPercentage: "65%" },
    {
      point: 13,
      effort: "Somewhat Hard",
      description: "Slight breathlessness, can talk",
      maxHRPercentage: "70%",
    },
    {
      point: 14,
      effort: "",
      description:
        "Increased sweating, still able to hold conversation but with difficulty",
      maxHRPercentage: "75%",
    },
    {
      point: 15,
      effort: "Hard",
      description: "Sweating, able to push and still maintain proper form",
      maxHRPercentage: "80%",
    },
    { point: 16, effort: "", description: "", maxHRPercentage: "85%" },
    {
      point: 17,
      effort: "Very Hard",
      description: "Can keep a fast pace for a short",
      maxHRPercentage: "90%",
    },
  ];
  const brpeData = [
    {
      rating: 6,
      description: "Very, Very Light (REST)",
      effortPercentage: "20%",
    },
    { rating: 7, description: "", effortPercentage: "30%" },
    { rating: 8, description: "", effortPercentage: "40%" },
    {
      rating: 9,
      description: "Very Light, Gentle Walk",
      effortPercentage: "50%",
    },
    { rating: 10, description: "", effortPercentage: "55%" },
    { rating: 11, description: "Fairly Light", effortPercentage: "60%" },
    { rating: 12, description: "", effortPercentage: "65%" },
    {
      rating: 13,
      description: "Moderately Hard, Steady Pace",
      effortPercentage: "70%",
    },
    { rating: 14, description: "", effortPercentage: "75%" },
    { rating: 15, description: "Hard", effortPercentage: "80%" },
    { rating: 16, description: "", effortPercentage: "85%" },
    { rating: 17, description: "Very Hard", effortPercentage: "90%" },
    { rating: 18, description: "", effortPercentage: "95%" },
    { rating: 19, description: "Very, Very Hard", effortPercentage: "100%" },
    { rating: 20, description: "EXHAUSTION", effortPercentage: "" },
  ];
  const generalObservationItems = [
    { label: "Body built", name: "bodyBuilt" },
    { label: "Hands and fingertips", name: "handsAndFingertips" },
    { label: "Eyes", name: "eyes" },
    { label: "Cyanosis", name: "cyanosis" },
    { label: "Jugular venous pressure", name: "jugularVenousPressure" },
    // ... other items
  ];
  const chestObservationItems = [
    { label: "Breathing pattern", name: "breathingPattern" },
    { label: "Chest movement", name: "chestMovement" },
    { label: "Palpation of chest", name: "palpationOfChest" },
    { label: "Chest expansion", name: "chestExpansion" },
    // ... other items
  ];
  const barthelIndexItems = [
    {
      label: "Feeding",
      name: "feeding",
      range: "0 = unable, 5 = needs help, 10 = independent",
    },
    {
      label: "Bathing",
      name: "bathing",
      range: "0 = dependent, 5 = independent (or in shower)",
    },
    {
      label: "Grooming",
      name: "grooming",
      range: "0 = needs help, 5 = independent with face/hair/teeth/shaving",
    },
    {
      label: "Dressing",
      name: "dressing",
      range:
        "0 = dependent, 5 = needs help, 10 = independent (including buttons, zips, laces, etc.)",
    },
    {
      label: "Bowels",
      name: "bowels",
      range: "0 = incontinent, 5 = occasional accident, 10 = continent",
    },
    {
      label: "Bladder",
      name: "bladder",
      range:
        "0 = incontinent or catheterized, 5 = occasional accident, 10 = continent",
    },
    {
      label: "Toilet Use",
      name: "toiletUse",
      range:
        "0 = dependent, 5 = needs some help, 10 = independent (on and off, dressing, wiping)",
    },
    {
      label: "Transfer",
      name: "transfer",
      range: "0 = unable, 5 = major help, 10 = minor help, 15 = independent",
    },
    {
      label: "Mobility",
      name: "mobility",
      range:
        "0 = immobile, 5 = wheelchair independent, 10 = walks with help, 15 = independent",
    },
    {
      label: "Stairs",
      name: "stairs",
      range: "0 = unable, 5 = needs help, 10 = independent",
    },
  ];
  const chestShapeObservationItems = [
    { label: "Normal", name: "normal" },
    { label: "Barrel Chest", name: "barrelChest" },
    { label: "Kyphosis", name: "kyphosis" },
    { label: "Pectus Excavatum", name: "pectusExcavatum" },
    { label: "Pectus Carinatum", name: "pectusCarinatum" },
  ];
  const chestMotionItems = [
    { label: "A", name: "a" },
    { label: "B", name: "b" },
  ];
  const allowedMotions = {
    cervical: ["flexion", "extension", "lateralRotation"],
    shoulder: [
      "flexion",
      "extension",
      "abduction",
      "adduction",
      "externalRotation",
      "internalRotation",
    ],
    elbow: ["flexion", "extension", "supination", "pronation"],
    wrist: ["flexion", "extension"],
    hip: [
      "flexion",
      "extension",
      "abduction",
      "adduction",
      "externalRotation",
      "internalRotation",
    ],
    knee: ["flexion", "extension"],
    ankle: ["dorsiFlexion", "plantarFlexion", "inversion", "eversion"],
  };

  const handleInputComplaintChange = (e, index) => {
    const { name, value } = e.target;
    const updatedComplaints = [...patient.complaints];
    updatedComplaints[index][name] = value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      complaints: updatedComplaints,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Specific validation based on the field name
    switch (name) {
      case "name":
      case "aggFactor":
      case "relFactor":
      case "complaints":
        if (value === "other") {
          toggleManualEntry();
          return;
        }
        if (/^[a-zA-Z ]*$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          alert("Please enter only alphabets for the field.");
        }
        break;
      case "occupation":
        if (/^[a-zA-Z]*$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          alert("Please enter only alphabets for the occupation field.");
        }
        break;
      case "uhid":
      case "address":
      case "complaint":
        if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          alert(
            "Please enter only alphanumeric characters and special characters for the field."
          );
        }
        break;

      case "xray":
      case "mri":
      case "others":
      case "provisionalDiagnosis":
        setPatient((prevPatient) => ({
          ...prevPatient,
          investigation: [
            {
              ...prevPatient.investigation[0],
              [name]: value,
            },
          ],
        }));
        break;

      case "age":
        // Allow only numeric values within a specific range or empty string
        if (value.trim() === "" || !isNaN(value)) {
          const age = value.trim() === "" ? "" : parseInt(value, 10);
          if (age === "" || (age >= 0 && age <= 150)) {
            setPatient((prevPatient) => ({
              ...prevPatient,
              [name]: age,
            }));
          } else {
            alert("Please enter a valid age between 0 and 150.");
          }
        } else {
          alert("Please enter a valid numeric age.");
        }
        break;

      case "mobileNo":
        // Allow only numeric values with a maximum length of 13
        if (/^\d{0,12}$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
          }));
        } else {
          alert("Please enter a valid mobile number with maximum 12 digits.");
        }
        break;
      // Add more cases for additional fields with specific validation requirements

      case "gender":
      case "onset":
        setPatient((prevPatient) => ({
          ...prevPatient,
          [name]: value,
        }));

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
          alert("Please enter only numeric and alphabetic characters.");
        }

        break;
    }
  };

  const addComplaint = () => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      complaints: [
        ...prevPatient.complaints,
        { complaint: "", id: Date.now() },
      ],
    }));
  };

  const removeComplaint = (id) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      complaints: prevPatient.complaints.filter(
        (complaint) => complaint.id !== id
      ),
    }));
  };

  const handleOutPatientInputChange = (e) => {
    const { name, value } = e.target;

    const updatedOutPatientBill = [...patient.outPatientBill];

    switch (name) {
      case "mobileNo":
        if (/^\d{0,12}$/.test(value)) {
          updatedOutPatientBill[0] = {
            ...updatedOutPatientBill[0],
            [name]: value,
          };
        } else {
          alert(
            "Please enter a valid mobile number with a maximum of 12 digits."
          );
        }
        break;

      case "billAmount":
        if (/^\d{0,8}$/.test(value)) {
          updatedOutPatientBill[0] = {
            ...updatedOutPatientBill[0],
            [name]: value,
          };
        } else {
          alert("Please enter a valid amount with a maximum of 8 digits.");
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

    setPatient((prevPatient) => ({
      ...prevPatient,
      outPatientBill: updatedOutPatientBill,
    }));
  };
  /*
        const handleInPatientInputChange = (e) => {
            const { name, value } = e.target;
    
            setPatient((prevPatient) => {
                // Create a copy of the outPatientBill array
                let updatedInPatientBill = [...prevPatient.inPatientBill];
    
                const getSumOfBills = () => {
                    let sum = 0;
    
                    for (const billName in updatedInPatientBill) {
                        if (billName.endsWith('Bill') || billName === 'otherExpenses') {
                            sum += parseFloat(updatedInPatientBill[billName]) || 0;
                        }
                    }
    
                    return sum;
                };
    
                switch (name) {
                    case 'mobileNo':
                        if (/^\d{0,12}$/.test(value)) {
                            updatedInPatientBill[0] = {
                                ...updatedInPatientBill[0],
                                [name]: value,
                            };
                        } else {
                            alert("Please enter a valid mobile number with a maximum of 12 digits.");                       
                        }
                        break;
    
                    case 'roomNumber':
                        if (/^\d{0,5}$/.test(value)) {
                            updatedInPatientBill[0] = {
                                ...updatedInPatientBill[0],
                                [name]: value,
                            };
                        } else {
                            alert("Please enter a valid room number with a maximum of 5 digits.");
                        }
                        break;
    
                    case 'admissionDate':
                    case 'dischargeDate':
                        updatedInPatientBill[0] = {
                            ...updatedInPatientBill[0],
                            [name]: value,
                        };
    
                        const admissionDate = new Date(updatedInPatientBill.admissionDate);
                        const dischargeDate = new Date(updatedInPatientBill.dischargeDate);
    
                        if (!isNaN(admissionDate.getTime()) && !isNaN(dischargeDate.getTime())) {
                            const timeDifference = dischargeDate.getTime() - admissionDate.getTime();
                            const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    
                            updatedInPatientBill[0] = {
                                ...updatedInPatientBill[0],
                                [name]: value,
                            };
                        }
                        break;
    
                    case 'totalDays':
                        if (/^\d{0,5}$/.test(value)) {
                            updatedInPatientBill[0] = {
                                ...updatedInPatientBill[0],
                                [name]: value,
                            };
                        } else {
                            alert("Please enter a valid total days (maximum 5 digits).");
                        }
                        break;
    
                    case 'visitingBill':
                    case 'physioBill':
                    case 'nursingBill':
                    case 'otherExpenses':
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
    
                const sumOfBills = getSumOfBills(updatedInPatientBill);
                const totalDays = parseFloat(updatedInPatientBill.totalDays) || 0;
                updatedInPatientBill = {
                    ...updatedInPatientBill,
                    billAmount: (sumOfBills * totalDays).toFixed(2),
                };
    
                return {
                    ...prevPatient,
                    inPatientBill: updatedInPatientBill,  // Fix the key name here
                };
                
            });  
        };*/

  const handleInPatientInputChange = (e) => {
    const { name, value } = e.target;

    // Create a copy of the inPatientBill array
    let updatedInPatientBill = [...patient.inPatientBill];

    const getSumOfBills = () => {
      let sum = 0;

      for (const propertyName in updatedInPatientBill[0]) {
        if (propertyName.endsWith("Bill") || propertyName === "otherExpenses") {
          sum += parseFloat(updatedInPatientBill[0][propertyName]) || 0;
        }
      }

      return sum;
    };

    switch (name) {
      case "mobileNo":
        if (/^\d{0,12}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert(
            "Please enter a valid mobile number with a maximum of 12 digits."
          );
        }
        break;

      case "roomNumber":
        if (/^\d{0,5}$/.test(value)) {
          updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
            [name]: value,
          };
        } else {
          alert(`Please enter a valid ${name} with a maximum of 5 digits.`);
        }
        break;
      case "admissionDate":
      case "dischargeDate":
        updatedInPatientBill[0] = {
          ...updatedInPatientBill[0],
          [name]: value,
        };

        const admissionDateString = updatedInPatientBill[0].admissionDate;
        const dischargeDateString = updatedInPatientBill[0].dischargeDate;

        if (admissionDateString && dischargeDateString) {
          const admissionDate = new Date(admissionDateString);
          const dischargeDate = new Date(dischargeDateString);

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
          alert(`Please enter a valid ${name}`);
        }
        break;

      default:
        updatedInPatientBill[0] = {
          ...updatedInPatientBill[0],
          [name]: value,
        };
        break;
    }

    const sumOfBills = getSumOfBills(updatedInPatientBill);
    const totalDays = parseFloat(updatedInPatientBill[0].totalDays) || 0;
    const amountPerDay = sumOfBills.toFixed(2);
    console.log("fghjmmmmmmmmmmm", totalDays);
    console.log("fghjmmmmmmmmmmm", totalDays * sumOfBills);

    updatedInPatientBill[0] = {
      ...updatedInPatientBill[0],
      amountPerDay: amountPerDay,
      billAmount: (sumOfBills * totalDays).toFixed(2),
    };

    // Now, update the patient state
    setPatient((prevPatient) => ({
      ...prevPatient,
      inPatientBill: updatedInPatientBill,
    }));
  };

  const handleCreateBill = (ptype) => {
    if (ptype === "outpatient") {
      setCreateOverlayVisible(true);
    } else {
      setCreateOverlayVisible(true);
    }
  };

  const handleCreateFreshBill = (ptype) => {
    if (
      ptype === "inpatient" &&
      patient.inPatientBill[0].admissionDate &&
      patient.inPatientBill[0].dischargeDate
    ) {
      setCreateFreshOverlayVisible(true);
    } else if (
      ptype === "outpatient" &&
      patient.outPatientBill[0].appointmentDate
    ) {
      setCreateFreshOverlayVisible(true);
    } else {
      // If conditions are not met, display an error message or take appropriate action
      alert("Please select both date and patient type for billing.");
    }
  };

  const validatemobileNo = (number) => {
    const digitCount = number.replace(/\D/g, "").length; // Count only digits

    // Check if the number of digits is between 6 and 11
    if (digitCount > 5 && digitCount < 12) {
      setVerifiedMobileNo(true);
    } else {
      setVerifiedMobileNo(false);
      alert("Please enter the valid mobile number and create record.");
    }
    return verifiedMobileNo;
  };
  const handleObservationCheckboxChange = (itemName, type) => {
    setPatient((prevPatient) => {
      const updatedPatient = {
        ...prevPatient,
        observation: {
          ...prevPatient.observation,
          onObservation: {
            ...(prevPatient.observation && prevPatient.observation.onObservation
              ? prevPatient.observation.onObservation
              : {}), // Ensure onObservation is initialized
            [itemName]: {
              ...(prevPatient.observation &&
              prevPatient.observation.onObservation &&
              prevPatient.observation.onObservation[itemName]
                ? prevPatient.observation.onObservation[itemName]
                : {}), // Ensure the specific item is initialized
              [type]: true,
              [type === "normal" ? "abnormal" : "normal"]: false,
            },
          },
        },
      };
      return updatedPatient;
    });
  };

  const handlePalpationCheckboxChange = (itemName, type) => {
    setPatient((prevPatient) => {
      const updatedPatient = {
        ...prevPatient,
        observation: {
          ...prevPatient.observation,
          onPalpation: {
            ...(prevPatient.observation && prevPatient.observation.onPalpation
              ? prevPatient.observation.onPalpation
              : {}), // Ensure onObservation is initialized
            [itemName]: {
              ...(prevPatient.observation &&
              prevPatient.observation.onPalpation &&
              prevPatient.observation.onPalpation[itemName]
                ? prevPatient.observation.onPalpation[itemName]
                : {}), // Ensure the specific item is initialized
              [type]: true,
              [type === "normal" ? "abnormal" : "normal"]: false,
            },
          },
        },
      };
      return updatedPatient;
    });
  };

  const handlePainLevelChange = (event) => {
    const level = parseInt(event.target.value, 10);

    setPatient((prevPatient) => ({
      ...prevPatient,
      painAssessment: {
        ...prevPatient.painAssessment,
        beforeTreatment: {
          ...prevPatient.painAssessment.beforeTreatment,
          level: level,
        },
      },
    }));
  };
  const handleCheckboxChange = (area) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      painRegion: {
        ...prevPatient.painRegion,
        [area]: !prevPatient.painRegion[area],
      },
    }));
  };
  const handleThroughCheckboxChange = (area) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      radiatesThrough: {
        ...prevPatient.radiatesThrough,
        [area]: !prevPatient.radiatesThrough[area],
      },
    }));
  };
  const handleFeelsLikeCheckboxChange = (area) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      feelsLike: {
        ...prevPatient.feelsLike,
        [area]: !prevPatient.feelsLike[area],
      },
    }));
  };
  const handlePostMedicalHistoryCheckboxChange = (area) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      postMedicalHistory: {
        ...prevPatient.postMedicalHistory,
        [area]: !prevPatient.postMedicalHistory[area],
      },
    }));
  };
  const handleRangeOfMotionChange = (joint, motion, side, value) => {
    console.log("jndfjnv", joint, motion, side, value);
    setPatient((prevPatient) => {
      const updatedRangeOfMotion = { ...prevPatient.rangeOfMotion };
      const jointIndex = rangeOfMotionJoints.indexOf(joint);
      const motionIndex = rangeOfMotionItems.findIndex(
        (item) => item.name === motion
      );

      if (
        jointIndex !== -1 &&
        motionIndex !== -1 &&
        value >= 0 &&
        value <= 1000
      ) {
        updatedRangeOfMotion[joint][motionIndex][motion][side] = value;
      }

      return {
        ...prevPatient,
        rangeOfMotion: updatedRangeOfMotion,
      };
    });
  };
  const handleMusclePowerChange = (muscleType, side, category, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      musclePower: {
        ...prevPatient.musclePower,
        [muscleType]: {
          ...prevPatient.musclePower[muscleType],
          [side]: {
            ...prevPatient.musclePower[muscleType][side],
            [category]: value, // Update the value
          },
        },
      },
    }));
  };
  const handleCoordinationCheckboxChange = (coordinationType, column) => {
    setPatient((prevPatient) => {
      const updatedCoordination = {
        ...prevPatient.coordination,
        [coordinationType]: {
          ...prevPatient.coordination[coordinationType],
          [column]: !prevPatient.coordination[coordinationType][column],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (column === "normal") {
        updatedCoordination[coordinationType].abnormal = false;
      } else if (column === "abnormal") {
        updatedCoordination[coordinationType].normal = false;
      }

      return {
        ...prevPatient,
        coordination: updatedCoordination,
      };
    });
  };

  const handleRemarksChange = (coordinationType, event) => {
    const remarksValue = event.target.value;

    // Regular expression to allow only alphabets and numbers
    // const isValidInput = /^[a-zA-Z0-9\s]*$/.test(remarksValue);

    // If the input is valid, update the state

    setPatient((prevPatient) => ({
      ...prevPatient,
      coordination: {
        ...prevPatient.coordination,
        [coordinationType]: {
          ...prevPatient.coordination[coordinationType],
          remarks: remarksValue,
        },
      },
    }));
  };

  const handleVitalInputChange = (event) => {
    const { name, value } = event.target;
    setPatient((prevPatient) => ({
      ...prevPatient,
      vitalSign: {
        ...prevPatient.vitalSign,
        [name]: value,
      },
    }));
  };
  const handleStandingWalkingCheckboxChange = (standingWalkingType, column) => {
    setPatient((prevPatient) => {
      const updatedStandingWalking = {
        ...prevPatient.standingWalking,
        [standingWalkingType]: {
          ...prevPatient.standingWalking[standingWalkingType],
          [column]: !prevPatient.standingWalking[standingWalkingType][column],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (column === "normal") {
        updatedStandingWalking[standingWalkingType].abnormal = false;
      } else if (column === "abnormal") {
        updatedStandingWalking[standingWalkingType].normal = false;
      }

      return {
        ...prevPatient,
        standingWalking: updatedStandingWalking,
      };
    });
  };

  const handleEquilibriumRemarksChange = (standingWalkingType, event) => {
    const remarksValue = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      standingWalking: {
        ...prevPatient.standingWalking,
        [standingWalkingType]: {
          ...prevPatient.standingWalking[standingWalkingType],
          remarks: remarksValue,
        },
      },
    }));
  };
  const handleBalanceCheckboxChange = (functionType, column) => {
    setPatient((prevPatient) => {
      const updatedBalance = {
        ...prevPatient.balance,
        [functionType]: {
          ...prevPatient.balance[functionType],
          [column]: !prevPatient.balance[functionType][column],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (column === "normal") {
        updatedBalance[functionType].abnormal = false;
      } else if (column === "abnormal") {
        updatedBalance[functionType].normal = false;
      }

      return {
        ...prevPatient,
        balance: updatedBalance,
      };
    });
  };

  const handleBalanceRemarksChange = (balanceType, event) => {
    const remarksValue = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      balance: {
        ...prevPatient.balance,
        [balanceType]: {
          ...prevPatient.balance[balanceType],
          remarks: remarksValue,
        },
      },
    }));
  };
  const handleHandFunctionCheckboxChange = (functionType, column) => {
    setPatient((prevPatient) => {
      const updatedHandFunction = {
        ...prevPatient.handFunction,
        [functionType]: {
          ...prevPatient.handFunction[functionType],
          [column]: !prevPatient.handFunction[functionType][column],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (column === "normal") {
        updatedHandFunction[functionType].abnormal = false;
      } else if (column === "abnormal") {
        updatedHandFunction[functionType].normal = false;
      }

      return {
        ...prevPatient,
        handFunction: updatedHandFunction,
      };
    });
  };

  const handleHandFunctionRemarksChange = (functionType, event) => {
    const remarksValue = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      handFunction: {
        ...prevPatient.handFunction,
        [functionType]: {
          ...prevPatient.handFunction[functionType],
          remarks: remarksValue,
        },
      },
    }));
  };
  const handlePrehensionCheckboxChange = (prehensionType, column) => {
    setPatient((prevPatient) => {
      const updatedPrehension = {
        ...prevPatient.prehension,
        [prehensionType]: {
          ...prevPatient.prehension[prehensionType],
          [column]: !prevPatient.prehension[prehensionType][column],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (column === "normal") {
        updatedPrehension[prehensionType].abnormal = false;
      } else if (column === "abnormal") {
        updatedPrehension[prehensionType].normal = false;
      }

      return {
        ...prevPatient,
        prehension: updatedPrehension,
      };
    });
  };

  const handlePrehensionRemarksChange = (prehensionType, event) => {
    const remarksValue = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      prehension: {
        ...prevPatient.prehension,
        [prehensionType]: {
          ...prevPatient.prehension[prehensionType],
          remarks: remarksValue,
        },
      },
    }));
  };
  const handleTextChange = (symptom, field, event) => {
    const value = event.target.value;

    switch (field) {
      case "duration":
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
          setPatient((prevPatient) => ({
            ...prevPatient,
            subjectiveAssessment: {
              ...prevPatient.subjectiveAssessment,
              [symptom]: {
                ...prevPatient.subjectiveAssessment[symptom],
                [field]: value,
              },
            },
          }));
        } else {
          // Handle invalid input (e.g., show an error message)
          alert("Please enter only alphanumeric characters for the duration.");
        }

        break;

      default:
        setPatient((prevPatient) => ({
          ...prevPatient,
          subjectiveAssessment: {
            ...prevPatient.subjectiveAssessment,
            [symptom]: {
              ...prevPatient.subjectiveAssessment[symptom],
              [field]: value,
            },
          },
        }));
        break;
    }
  };
  const handleSeverityChange = (symptom, event) => {
    const value = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      subjectiveAssessment: {
        ...prevPatient.subjectiveAssessment,
        [symptom]: {
          ...prevPatient.subjectiveAssessment[symptom],
          severity: value,
        },
      },
    }));
  };
  const handleHemoptysisTypeChange = (symptom, event) => {
    const value = event.target.value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      subjectiveAssessment: {
        ...prevPatient.subjectiveAssessment,
        [symptom]: {
          ...prevPatient.subjectiveAssessment[symptom],
          hemoptysisType: value,
        },
      },
    }));
  };
  const handlePointCheckboxChange = (point) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      rpe: {
        ...Object.fromEntries(
          Object.entries(prevPatient.rpe).map(([key, value]) => [
            key,
            key === point,
          ])
        ),
      },
    }));
  };
  const handleBordRatingCheckboxChange = (rating) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      brpe: {
        ...Object.fromEntries(
          Object.entries(prevPatient.brpe).map(([key, value]) => [
            key,
            key === rating,
          ])
        ),
      },
    }));
  };
  const handleGeneralObservationCheckboxChange = (observation, category) => {
    setPatient((prevPatient) => {
      const updatedGeneralObservation = {
        ...prevPatient.generalObservation,
        [observation]: {
          ...prevPatient.generalObservation[observation],
          [category]: !prevPatient.generalObservation[observation][category],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (category === "normal") {
        updatedGeneralObservation[observation].abnormal = false;
      } else if (category === "abnormal") {
        updatedGeneralObservation[observation].normal = false;
      }

      return {
        ...prevPatient,
        generalObservation: updatedGeneralObservation,
      };
    });
  };

  const handleChestObservationCheckboxChange = (observation, category) => {
    setPatient((prevPatient) => {
      const updatedChestObservation = {
        ...prevPatient.chestObservation,
        [observation]: {
          ...prevPatient.chestObservation[observation],
          [category]: !prevPatient.chestObservation[observation][category],
        },
      };

      // If one checkbox is checked, uncheck the other in the same row
      if (category === "normal") {
        updatedChestObservation[observation].abnormal = false;
      } else if (category === "abnormal") {
        updatedChestObservation[observation].normal = false;
      }

      return {
        ...prevPatient,
        chestObservation: updatedChestObservation,
      };
    });
  };

  const handleScoreChange = (activity, score) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      barthelIndex: {
        ...prevPatient.barthelIndex,
        [activity]: {
          ...prevPatient.barthelIndex[activity],
          score: score,
        },
      },
    }));
  };
  const handleChestShapeObservationCheckboxChange = (selectedObservation) => {
    setPatient((prevPatient) => {
      const updatedChestShape = {
        ...prevPatient.chestShapeObservation.chestShape,
      };

      // Uncheck all other checkboxes
      Object.keys(updatedChestShape).forEach((observation) => {
        updatedChestShape[observation] = observation === selectedObservation;
      });

      return {
        ...prevPatient,
        chestShapeObservation: {
          ...prevPatient.chestShapeObservation,
          chestShape: updatedChestShape,
        },
      };
    });
  };

  const handleChestMotionCheckboxChange = (field, motion) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      chestMotionObservation: {
        ...prevPatient.chestMotionObservation,
        [field]: motion,
      },
    }));
  };

  const handlePlanChange = (index, field, value) => {
    switch (field) {
      case "days":
        if (/^\d*$/.test(value)) {
          setPatient((prevPatient) => {
            const updatedPlanTreatment = [...prevPatient.planTreatment];
            updatedPlanTreatment[index] = {
              ...updatedPlanTreatment[index],
              [field]: value,
            };

            return {
              ...prevPatient,
              planTreatment: updatedPlanTreatment,
            };
          });
        } else {
          alert("Please enter numbers only.");
        }
        break;

      // Add more cases for other fields if needed

      default:
        setPatient((prevPatient) => {
          const updatedPlanTreatment = [...prevPatient.planTreatment];
          updatedPlanTreatment[index] = {
            ...updatedPlanTreatment[index],
            [field]: value,
          };

          return {
            ...prevPatient,
            planTreatment: updatedPlanTreatment,
          };
        });
        break;
    }
  };

  const handleInvestigationChange = (index, field, value) => {
    switch (field) {
      case "date":
        setPatient((prevPatient) => {
          const updatedInvestigation = [...prevPatient.investigation];
          updatedInvestigation[index] = {
            ...updatedInvestigation[index],
            [field]: value,
          };

          return {
            ...prevPatient,
            investigation: updatedInvestigation,
          };
        });
        break;
      // Add more cases if needed
      default:
        break;
    }
  };

  const handlePlanCheckboxChange = (index, category) => {
    setPatient((prevPatient) => {
      const updatedPlanTreatment = [...prevPatient.planTreatment];
      updatedPlanTreatment[index] = {
        ...updatedPlanTreatment[index],
        [category]: !updatedPlanTreatment[index][category],
      };

      return {
        ...prevPatient,
        planTreatment: updatedPlanTreatment,
      };
    });
  };

  /*const handlePatientTypeChange = (type) => {
        setPatient((prevPatient) => ({
            ...prevPatient,
            planTreatment: [
                {
                    ...prevPatient.planTreatment[0],
                    patientType: type,
                },
            ],
        }));
    };*/

  const handlePatientTypeChange = (type) => {
    const defaultPlanTreatment = {
      patientType: type,
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
    };

    setPatient((prevPatient) => {
      // Update only when toggling between in-patient and out-patient
      return {
        ...prevPatient,
        planTreatment: [defaultPlanTreatment],
      };
    });
  };
  const handleImageClick = (shape) => {
    setPatient((prevPatient) => {
      const updatedChestShape = {};
      // Iterate over each shape option and set it to false except for the clicked shape
      Object.keys(prevPatient.chestShapeObservation.chestShape).forEach(
        (key) => {
          updatedChestShape[key] = key === shape ? true : false;
        }
      );

      return {
        ...prevPatient,
        chestShapeObservation: {
          ...prevPatient.chestShapeObservation,
          chestShape: updatedChestShape,
        },
      };
    });
  };

  const handleLobeInputChange = (motionType, inputType) => {
    setPatient((prevPatient) => {
      // Make a copy of the previous patient state
      const updatedPatient = { ...prevPatient };

      // Update the corresponding motion type and input type based on the parameters
      updatedPatient.chestMotionObservation = {
        ...updatedPatient.chestMotionObservation,
        [motionType]: {
          ...updatedPatient.chestMotionObservation[motionType],
          [inputType]:
            !updatedPatient.chestMotionObservation[motionType][inputType], // Toggle the value
        },
      };

      // Return the updated patient state
      return updatedPatient;
    });
  };

  const handleLobeRemarkInputChange = (motionType, inputType, value) => {
    setPatient((prevPatient) => {
      // Make a copy of the previous patient state
      const updatedPatient = { ...prevPatient };

      // Update the corresponding motion type and input type based on the parameters
      updatedPatient.chestMotionObservation = {
        ...updatedPatient.chestMotionObservation,
        [motionType]: {
          ...updatedPatient.chestMotionObservation[motionType],
          [inputType]: value, // Update the remarks value directly
        },
      };

      // Return the updated patient state
      return updatedPatient;
    });
  };

  const handleChestMotionInputChange = (field, value) => {
    switch (field) {
      case "middleLobeLingulaValues":
      case "upperLobeValues":
      case "lowerLobeValues":
        if (/^\d*$/.test(value)) {
          // If the input is a valid number, update the state
          setPatient((prevPatient) => ({
            ...prevPatient,
            chestMotionObservation: {
              ...prevPatient.chestMotionObservation,
              [field]: value,
            },
          }));
        } else {
          alert("Please enter numbers only.");
        }

        break;

      default:
        setPatient((prevPatient) => ({
          ...prevPatient,
          chestMotionObservation: {
            ...prevPatient.chestMotionObservation,
            [field]: value,
          },
        }));

        break;
    }
  };
  const handleMobileNumberChange = (event) => {
    // Validate if the entered value is a number
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value)) {
      // Only set the mobile number if it contains only numbers
      setMobileNo(value);
    } else {
      // If the entered value contains non-numeric characters, alert the user
      alert("Please enter a valid mobile number with maximum 10 digits.");
    }
  };

  const handleThermometerClick = (level) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      painAssessment: {
        ...prevPatient.painAssessment,
        beforeTreatment: {
          ...prevPatient.painAssessment.beforeTreatment,
          level: level,
        },
      },
    }));
  };

  const handleSearch = async () => {
    setCloseDetails(false);

    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }

    if (mobileNo) {
      try {
        setLoading(true);
        // Replace 'https://saai-physio-api.vercel.app/api/find_record' with your actual endpoint
        // Assuming the backend returns the patient record
        const response = await axios.get(
          "https://rehab-rythm-ti17.vercel.app/api/find_basic_record",
          {
            params: {
              mobileNo, // Filter by institute_name
              clinicName,
              doctorName,
            },
          }
        );
        foundPatientBasicRecord = response.data;

        patient.mobileNo = foundPatientBasicRecord.mobileNo;
        setFirstRow(
          foundPatientBasicRecord.planTreatment[0].patientType === "choose type"
        );
        console.log("patient ::::", foundPatientBasicRecord);
        setFounded(true);
        console.log("foundddddddddddddddddd ::::", founded);

        setPatient(foundPatientBasicRecord);

        // Introduce a delay of 500 milliseconds (adjust as needed)
        await delay(500);
        // fetchPatienRecord(foundPatientBasicRecord.mobileNo);
        setError("");
      } catch (error) {
        setLoading(false);
        setMobileNo("");
        setPatientBasicRecord(null);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    }
  };

  // const fetchPatienRecord = async (mobileNo) => {
  //     try {
  //         console.log("fetching rec");

  //         const response = await axios.get('https://saai-physio-api.vercel.app/api/find_record', {
  //             params: {
  //                 mobileNo// Filter by institute_name
  //             }
  //         });
  //         const foundPatientBasicRecord = response.data;
  //         if (foundPatientBasicRecord !== "kulukulu") {
  //             setPatient(foundPatientBasicRecord);
  //             console.log("rec fou : ", foundPatientBasicRecord);

  //             // Introduce a delay of 500 milliseconds (adjust as needed)
  //             await delay(500);

  //             setFirstRow(foundPatientBasicRecord.planTreatment[0].patientType === "");
  //             console.log("rec fr : ", firstRow);
  //             setFounded(true);
  //             setError('');
  //         } else {
  //             patient.mobileNo = mobileNo;
  //             setFirstRow(patient.planTreatment[0].patientType === "");
  //             console.log("not working");
  //         }

  //     } catch (error) {
  //         setPatientBasicRecord(null);
  //         setError('Patient record not found. Please check the mobile number.');
  //     }
  // };

  // Utility function to introduce delays using Promise

  useEffect(() => {
    if (patient.planTreatment[0].patientType !== "") {
      const sort = patient.planTreatment
        .filter((plan) => !plan.isNewRow)
        .sort((a, b) => {
          if (a.startDate !== b.startDate) {
            return a.startDate > b.startDate ? 1 : -1;
          }
          return a.patientType.localeCompare(b.patientType);
        });

      const newRow = patient.planTreatment.find((plan) => plan.isNewRow);
      if (newRow) {
        sort.push(newRow);
      }

      setSortedRows(sort);
      setPatient((prevPatient) => ({
        ...prevPatient,
        planTreatment: sort,
      }));
    }
  }, [founded, newNextRow]);

  console.log("in patient billlllllllll", patient, firstRow);
  const handleContinue = () => {
    if (page1) {
      setPage1(false);
      setPage2(true);
    } else if (page2) {
      setPage2(false);
      setPage3(true);
    } else if (page3) {
      setPage3(false);
      setPage4(true);
    } else if (page4) {
      setPage4(false);
      setPage5(true);
    } else if (page5) {
      setPage5(false);
      setPage6(true);
    } else if (page6) {
      setPage6(false);
      setPage7(true);
    } else if (page7) {
      setPage7(false);
      setPage8(true);
    }
  };
  const handlePrevious = () => {
    if (page8) {
      setPage8(false);
      setPage7(true);
    } else if (page7) {
      setPage7(false);
      setPage6(true);
    } else if (page6) {
      setPage6(false);
      setPage5(true);
    } else if (page5) {
      setPage5(false);
      setPage4(true);
    } else if (page4) {
      setPage4(false);
      setPage3(true);
    } else if (page3) {
      setPage3(false);
      setPage2(true);
    } else if (page2) {
      setPage2(false);
      setPage1(true);
    }
  };
  const handleDateChange = () => {
    // Assuming e.target.value contains the new date value

    // Assuming selectedRowStartDate and selectedRowEndDate are Date objects
    const startDate = new Date(selectedRowStartDate);
    const endDate = new Date(selectedRowEndDate);

    // Calculate the difference in milliseconds
    const differenceInTime = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    setSelectedRowTotVal(differenceInDays);
    // Now differenceInDays contains the total number of days between the two dates
    console.log("Total days between dates:", differenceInDays);
  };

  const toggleManualEntry = () => {
    setManualEntry(!manualEntry);
    setPatient((prevPatient) => ({
      ...prevPatient,
      complaints: "", // Reset manually entered data
    }));
  };

  const handleDiscardManualEntry = () => {
    setManualEntry(false);
    setPatient((prevPatient) => ({
      ...prevPatient,
      complaints: "", // Reset manually entered data
    }));
  };

  useEffect(() => {
    if (mobileNo) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (!firstRow) {
      const sort = patient.planTreatment
        .filter((plan) => !plan.isNewRow)
        .sort((a, b) => {
          if (a.startDate !== b.startDate) {
            return a.startDate > b.startDate ? 1 : -1;
          }
          return a.patientType.localeCompare(b.patientType);
        });

      const newRow = patient.planTreatment.find((plan) => plan.isNewRow);
      if (newRow) {
        sort.push(newRow);
      }

      setSortedRows(sort);
      setPatient((prevPatient) => ({
        ...prevPatient,
        planTreatment: sort,
      }));
    }
  }, [founded, newNextRow]);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrintClose = () => {
    setShowPrintOverlay(false);
  };

  useEffect(() => {
    const isAnyInputSelectedInNeuroSection = () => {
      // Check if any input field in the balance table is selected
      const balanceTableSelected = balanceItems.some((item) => {
        const { normal, abnormal, remarks } = patient.balance[item.name];
        return normal || abnormal || remarks;
      });

      // Check if any input field in the standing and walking table is selected
      const standingWalkingTableSelected = Object.values(
        patient.standingWalking
      ).some((activity) => {
        const { normal, abnormal, remarks } = activity;
        return normal || abnormal || remarks;
      });

      // Check if any input field in the coordination table is selected
      const coordinationTableSelected = coordinationItems.some((item) => {
        const { normal, abnormal, remarks } = patient.coordination[item.name];
        return normal || abnormal || remarks;
      });

      // Check if any input field in the hand function and prehension table is selected
      const handFunctionTableSelected = handFunctionItems.some((item) => {
        const { normal, abnormal, remarks } = patient.handFunction[item.name];
        return normal || abnormal || remarks;
      });

      // Check if any input field in the prehension table is selected
      const prehensionTableSelected = prehensionItems.some((item) => {
        const { normal, abnormal, remarks } = patient.prehension[item.name];
        return normal || abnormal || remarks;
      });

      // Return true if any input field in any of the tables is selected
      return (
        balanceTableSelected ||
        standingWalkingTableSelected ||
        coordinationTableSelected ||
        handFunctionTableSelected ||
        prehensionTableSelected
      );
    };

    setIsNeuroSectionEntered(isAnyInputSelectedInNeuroSection());
  }, [
    balanceItems,
    patient.balance,
    patient.standingWalking,
    coordinationItems,
    patient.coordination,
    handFunctionItems,
    patient.handFunction,
    prehensionItems,
    patient.prehension,
  ]);

  // Logic to determine if any input field is selected in Cardio Section
  useEffect(() => {
    const isAnyInputSelectedInCardioSection = () => {
      // Check if any input field in the Observation of Chest table is selected
      const chestObservationSelected = chestObservationItems.some((item) => {
        const { normal, abnormal, remarks } =
          patient.chestObservation[item.name];
        return normal || abnormal || remarks;
      });

      // Check if any input field in the Observation of Chest Motion table is selected
      const chestMotionObservationSelected = Object.keys(
        patient.chestMotionObservation
      ).some((motion) => {
        const { normal, abnormal, remarks } =
          patient.chestMotionObservation[motion];
        return normal || abnormal || remarks;
      });

      // Check if any input field in the Subjective Assessment table is selected
      const subjectiveAssessmentSelected = Object.keys(
        patient.subjectiveAssessment
      ).some((symptom) => {
        const { duration, severity, pattern, associatedFactors } =
          patient.subjectiveAssessment[symptom];
        return duration || severity || pattern || associatedFactors;
      });

      const chestTypeSelected = Object.values(
        patient.chestShapeObservation.chestShape
      ).some((selected) => selected);

      // Return true if any input field in any of the tables is selected
      return (
        chestObservationSelected ||
        chestMotionObservationSelected ||
        subjectiveAssessmentSelected ||
        chestTypeSelected
      );
    };

    setIsCardioSectionEntered(isAnyInputSelectedInCardioSection());
  }, [
    chestObservationItems,
    patient.chestObservation,
    patient.chestMotionObservation,
    patient.subjectiveAssessment,
    patient.chestShapeObservation,
  ]);

  useEffect(() => {
    const isAnyInputSelectedInPlanTreatment = () => {
      const selectedInPlanTreatment = patient.planTreatment.some((plan) => {
        return (
          plan.patientType !== "choose type" || // Check if patient type is selected
          plan.startDate || // Check if start date is entered
          plan.endDate || // Check if end date is entered
          plan.days || // Check if days are entered
          plan.ust || // Check if ultrasound therapy checkbox is checked
          plan.ift || // Check if interferential therapy checkbox is checked
          plan.swd || // Check if shortwave diathermy checkbox is checked
          plan.tr || // Check if traction checkbox is checked
          plan.wax || // Check if wax therapy checkbox is checked
          plan.est || // Check if electrical stimulation therapy checkbox is checked
          plan.sht || // Check if shockwave therapy checkbox is checked
          plan.laser || // Check if laser therapy checkbox is checked
          plan.exs ||
          plan.rehab
        );
      });
      return selectedInPlanTreatment;
    };

    const isAnyInputSelectedInInvestigation = () => {
      const selectedInInvestigation = patient.investigation.some((invest) => {
        return (
          invest.date || // Check if date is entered
          invest.xray || // Check if X-ray input is entered
          invest.mri || // Check if MRI input is entered
          invest.others || // Check if Others input is entered
          invest.provisionalDiagnosis // Check if Provisional Diagnosis input is entered
        );
      });
      return selectedInInvestigation;
    };

    const isPlanTreatmentSectionEntered =
      isAnyInputSelectedInPlanTreatment() ||
      isAnyInputSelectedInInvestigation();

    setIsPlanTreatmentSectionEntered(isPlanTreatmentSectionEntered);
  }, [patient.planTreatment, patient.investigation]);

  return (


    //   <div className="update-record-body">
    //   <div>
    //         {(loading || isLoading) && (
    //           <div className={overlayClass}>
    //             <div class="adminmenu-wrapper">
    //               <div class="adminmenu-box-wrap">
    //                 <div class="adminmenu-box one"></div>
    //                 <div class="adminmenu-box two"></div>
    //                 <div class="adminmenu-box three"></div>
    //                 <div class="adminmenu-box four"></div>
    //                 <div class="adminmenu-box five"></div>
    //                 <div class="adminmenu-box six"></div>
    //               </div>
    //             </div>
    //             <div class="adminmenu-load-wrapp">
    //               <div class="adminmenu-load-6">
    //                 <div class="adminmenu-letter-holder">
    //                   <div class="l-1 letter">L</div>
    //                   <div class="l-2 letter">O</div>
    //                   <div class="l-3 letter">A</div>
    //                   <div class="l-4 letter">D</div>
    //                   <div class="l-5 letter">I</div>
    //                   <div class="l-6 letter">N</div>
    //                   <div class="l-7 letter">G</div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </div>

    //     {showToast && (
    //       <div className="toast toast-active">
    //         <div className="toast-content">
    //           <img src={checklist} alt="Success" className="toast-check" />
    //           <div className="toast-message">
    //             <span className="toast-text toast-text-1">Success</span>
    //             <span className="toast-text toast-text-2">
    //               Patient Record Updated successfully!
    //             </span>
    //           </div>
    //         </div>
    //         <div className="toast-progress toast-active"></div>
    //       </div>
    //     )}

    //     {(showNetworkErrorToast || showServerNetworkErrorToast || showUnexpectedErrorToast) && (
    //       <div className="toast toast-active">
    //         <div className="toast-content">
    //           <img src={errorimg} alt="Error" className="toast-error-check" />
    //           <div className="toast-message">
    //             {showNetworkErrorToast && (
    //               <span className="toast-text toast-text-2">
    //                 Network disconnected. Please check your network!
    //               </span>
    //             )}
    //             {showServerNetworkErrorToast && (
    //               <span className="toast-text toast-text-2">
    //                 Internal Server Error! Try after some time.
    //               </span>
    //             )}
    //             {showUnexpectedErrorToast && (
    //                 <span className="toast-text toast-text-2">
    //                   Unexpected Error Occurred.
    //                 </span>
    //               )}
    //           </div>
    //         </div>
    //         <div className="toast-error-progress toast-active"></div>
    //      </div>
    //     )}

    //   <div class="update-record-container">

    //     {page1 && (
    //       <>
    //         <header class="update-record-header">
    //           {founded && page1 && (
    //             <div class="update-record-patient-details">
    //               <h3 class="update-record-patient">{patient.name}</h3>
    //               <h3 class="update-record-patient">
    //                 {patient.gender === "male"
    //                   ? "M"
    //                   : patient.gender === "female"
    //                     ? "F"
    //                     : "O"}
    //               </h3>

    //               <h3 class="update-record-patient">{patient.age}</h3>
    //             </div>
    //           )}
    //         </header>

    //         {founded && page1  && (
    //           <div class="update-record-checking-checkbox">
    //             <div class="update-record-checkbox-container">
    //               <div className="update-record-checkbox-group">
    //                 <h2 className="update-record-checkbox-title">
    //                   Post Medical History
    //                 </h2>
    //                 {Object.keys(patient.postMedicalHistory).map((area) => (
    //                   <div
    //                     key={area}
    //                     className="update-record-checkbox-wrapper-46"
    //                   >
    //                     <input
    //                       type="checkbox"
    //                       id={area}
    //                       className="update-record-inp-cbx"
    //                       checked={patient.postMedicalHistory[area]}
    //                       onChange={() =>
    //                         handlePostMedicalHistoryCheckboxChange(area)
    //                       }
    //                     />
    //                     <label htmlFor={area} className="update-record-cbx">
    //                       <span>
    //                         <svg viewBox="0 0 12 10" height="10px" width="12px">
    //                           <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                         </svg>
    //                       </span>

    //                       <span>&nbsp;{area.toUpperCase()}</span>
    //                     </label>
    //                   </div>
    //                 ))}
    //               </div>
    //               <div className="update-record-checkbox-group update-record-vital-sign">
    //                 <h2 className="update-record-checkbox-title">Vital Sign</h2>
    //                 <div className="update-record-col">
    //                   <div className="update-record-form-group">
    //                     <span>BP</span>
    //                     <input
    //                       className="update-record-form-field"
    //                       type="text"
    //                       name="BP"
    //                       placeholder="Enter your BP"
    //                       value={patient.vitalSign.BP}
    //                       onChange={handleVitalInputChange}
    //                     />
    //                   </div>
    //                   <div className="update-record-form-group">
    //                     <span>RR</span>
    //                     <input
    //                       className="update-record-form-field"
    //                       type="text"
    //                       name="RR"
    //                       placeholder="Enter your RR"
    //                       value={patient.vitalSign.RR}
    //                       onChange={handleVitalInputChange}
    //                     />
    //                   </div>
    //                   <div className="update-record-form-group">
    //                     <span>HR</span>
    //                     <input
    //                       className="update-record-form-field"
    //                       type="text"
    //                       name="HR"
    //                       placeholder="Enter your HR"
    //                       value={patient.vitalSign.HR}
    //                       onChange={handleVitalInputChange}
    //                     />
    //                   </div>
    //                   <div className="update-record-form-group">
    //                     <span>SPO2</span>
    //                     <input
    //                       className="update-record-form-field"
    //                       type="text"
    //                       name="SPO2"
    //                       placeholder="Enter your SPO2"
    //                       value={patient.vitalSign.SPO2}
    //                       onChange={handleVitalInputChange}
    //                     />
    //                   </div>
    //                   <div className="update-record-form-group">
    //                     <span>TEMP</span>
    //                     <input
    //                       className="update-record-form-field"
    //                       type="text"
    //                       name="TEMP"
    //                       placeholder="Enter your TEMP"
    //                       value={patient.vitalSign.TEMP}
    //                       onChange={handleVitalInputChange}
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //               <div class="update-record-checkbox-group update-record-pain-region">

    //                 <div class="update-record-row update-record-pain-region-content">
    //                   <div class="complaint-left-update-record-col">
    //                     <h2 class="update-record-checkbox-title">Complaint</h2>
    //                     <div className="update-record-form-group-factors">
    //                       <span>Complaint</span>
    //                       {manualEntry ? (
    //                         <>
    //                           <input
    //                             className="update-record-form-field"
    //                             type="text"
    //                             placeholder="Enter your complaint"
    //                             value={patient.complaints}
    //                             onChange={(e) => handleInputChange(e)}
    //                             name="complaints"
    //                             required
    //                           />
    //                           <button onClick={handleDiscardManualEntry} className="complaint-cancel-button">X</button>
    //                         </>
    //                       ) : (
    //                         <select
    //                           className="update-record-form-field"
    //                           value={patient.complaints}
    //                           onChange={(e) => handleInputChange(e)}
    //                           name="complaints"
    //                           required
    //                         >
    //                           <option value="">Select or enter manually</option>
    //                           <option value="Difficult to lift hands over head">
    //                             Difficult to lift hands over head
    //                           </option>
    //                           <option value="Difficult to the ADL">Difficult to the ADL</option>
    //                           <option value="Unable to walk while morning wake up">
    //                             Unable to walk while morning wake up
    //                           </option>
    //                           <option value="Difficult to sit to standing">
    //                             Difficult to sit to standing
    //                           </option>
    //                           <option value="Pain increase while walking">
    //                             Pain increase while walking
    //                           </option>
    //                           <option value="other">
    //                             Enter manually
    //                           </option>
    //                         </select>
    //                       )}
    //                     </div>

    //                     <h2 class="update-record-checkbox-title">Pain Over</h2>

    //                     <div class="pain-over-update-record-col">

    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Neck"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Neck}
    //                             onChange={() => handleCheckboxChange("Neck")}
    //                           />
    //                           <label for="Neck" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Neck</span>
    //                           </label>
    //                         </div>
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Wrist"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Wrist}
    //                             onChange={() => handleCheckboxChange("Wrist")}
    //                           />
    //                           <label for="Wrist" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Wrist</span>
    //                           </label>
    //                         </div>

    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Ankle"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Ankle}
    //                             onChange={() => handleCheckboxChange("Ankle")}
    //                           />
    //                           <label for="Ankle" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Ankle</span>
    //                           </label>
    //                         </div>

    //                       </div>
    //                       <div class="update-record-col">

    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Elbow"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Elbow}
    //                             onChange={() => handleCheckboxChange("Elbow")}
    //                           />
    //                           <label for="Elbow" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Elbow</span>
    //                           </label>
    //                         </div>
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="UpperBack"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.UpperBack}
    //                             onChange={() => handleCheckboxChange("UpperBack")}
    //                           />
    //                           <label for="UpperBack" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;UpperBack</span>
    //                           </label>
    //                         </div>
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="LowerBack"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.LowerBack}
    //                             onChange={() => handleCheckboxChange("LowerBack")}
    //                           />
    //                           <label for="LowerBack" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;LowerBack</span>
    //                           </label>
    //                         </div>
    //                       </div>
    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Shoulder"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Shoulder}
    //                             onChange={() => handleCheckboxChange("Shoulder")}
    //                           />
    //                           <label for="Shoulder" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Shoulder</span>
    //                           </label>
    //                         </div>
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Knee"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.painRegion.Knee}
    //                             onChange={() => handleCheckboxChange("Knee")}
    //                           />
    //                           <label for="Knee" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Knee</span>
    //                           </label>
    //                         </div>
    //                       </div>
    //                     </div>
    //                     <h2 class="update-record-checkbox-title">Radiates through</h2>

    //                     <div class="pain-over-update-record-col">

    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Arms"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.radiatesThrough.Arms}
    //                             onChange={() => handleThroughCheckboxChange("Arms")}
    //                           />
    //                           <label for="Arms" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Arms</span>
    //                           </label>
    //                         </div>

    //                       </div>
    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="LegsToKnee"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.radiatesThrough.LegsToKnee}
    //                             onChange={() => handleThroughCheckboxChange("LegsToKnee")}
    //                           />
    //                           <label for="LegsToKnee" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Legs to Knee</span>
    //                           </label>
    //                         </div>

    //                       </div>
    //                     </div>

    //                     <h2 class="update-record-checkbox-title">Feels Like</h2>

    //                     <div class="pain-over-update-record-col">

    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Numbness"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.feelsLike.Numbness}
    //                             onChange={() => handleFeelsLikeCheckboxChange("Numbness")}
    //                           />
    //                           <label for="Numbness" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Numbness</span>
    //                           </label>
    //                         </div>
    //                       </div>
    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="Tingling"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.feelsLike.Tingling}
    //                             onChange={() => handleFeelsLikeCheckboxChange("Tingling")}
    //                           />
    //                           <label for="Tingling" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Tingling</span>
    //                           </label>
    //                         </div>

    //                       </div>
    //                       <div class="update-record-col">
    //                         <div class="update-record-checkbox-wrapper-46">
    //                           <input
    //                             type="checkbox"
    //                             id="WeakGrip"
    //                             class="update-record-inp-cbx"
    //                             checked={patient.feelsLike.WeakGrip}
    //                             onChange={() => handleFeelsLikeCheckboxChange("WeakGrip")}
    //                           />
    //                           <label for="WeakGrip" class="update-record-cbx">
    //                             <span>
    //                               <svg
    //                                 viewBox="0 0 12 10"
    //                                 height="10px"
    //                                 width="12px"
    //                               >
    //                                 <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    //                               </svg>
    //                             </span>
    //                             <span>&nbsp;Weak Grip</span>
    //                           </label>
    //                         </div>
    //                       </div>
    //                     </div>

    //                   </div>
    //                   <div class="update-record-col" id="factor-col">
    //                     <h2 class="update-record-checkbox-title">Additional Details</h2>
    //                     <div class="update-record-form-group-factors">
    //                       <span>Onset</span>
    //                       <select
    //                         id="onset"
    //                         className="onset-select"
    //                         name="onset"
    //                         value={patient.onset}
    //                         onChange={(e) => handleInputChange(e)}
    //                         required
    //                       >
    //                         <option value="choose">Choose</option>
    //                         <option value="sudden">Sudden</option>
    //                         <option value="gradual">Gradual</option>
    //                       </select>
    //                     </div>
    //                     <div class="update-record-form-group-factors">
    //                       <span>Duration</span>
    //                       <input
    //                         class="update-record-form-field"
    //                         type="text"
    //                         placeholder="Enter your duration of pain"
    //                         value={patient.duration}
    //                         onChange={(e) => handleInputChange(e)}
    //                         name="duration"
    //                         required
    //                       />
    //                     </div>
    //                     <div class="update-record-form-group-factors">
    //                       <span>Aggrivating Factor</span>
    //                       <input
    //                         class="update-record-form-field"
    //                         type="text"
    //                         placeholder="Enter your Aggrivating Factor"
    //                         value={patient.aggFactor}
    //                         onChange={(e) => handleInputChange(e)}
    //                         name="aggFactor"
    //                         required
    //                       />
    //                     </div>
    //                     <div class="update-record-form-group-factors">
    //                       <span>Relieving Factor</span>
    //                       <input
    //                         class="update-record-form-field"
    //                         type="text"
    //                         placeholder="Enter your Relieving Factor"
    //                         value={patient.relFactor}
    //                         onChange={(e) => handleInputChange(e)}
    //                         name="relFactor"
    //                         required
    //                       />
    //                     </div>

    //                   </div>
    //                 </div>

    //               </div>

    //             </div>
    //           </div>
    //         )}

    //         {founded && page1  && (
    //           <div class="update-record-checkbox-group update-record-pain-level">
    //             <h2 class="update-record-checkbox-title">Pain Level</h2>
    //             {/* <div class="thermometer-meter">
    //            <div
    //              class="level"
    //              id="level1"
    //              onClick={() => handleThermometerClick(1)}
    //              className={
    //                patient.painAssessment.beforeTreatment.level === 1
    //                  ? "selected"
    //                  : ""
    //              }
    //            >
    //              1
    //            </div>
    //            <div
    //              class="level"
    //              id="level2"
    //              onClick={() => handleThermometerClick(2)}
    //              className={
    //                patient.painAssessment.beforeTreatment.level === 2
    //                  ? "selected"
    //                  : ""
    //              }
    //            >
    //              2
    //            </div>
    //            <div
    //              class="level"
    //              id="level3"
    //              onClick={() => handleThermometerClick(3)}
    //              className={
    //                patient.painAssessment.beforeTreatment.level === 3
    //                  ? "selected"
    //                  : ""
    //              }
    //            >
    //              3
    //            </div>
    //            <div
    //              class="level"
    //              id="level4"
    //              onClick={() => handleThermometerClick(4)}
    //              className={
    //                patient.painAssessment.beforeTreatment.level === 4
    //                  ? "selected"
    //                  : ""
    //              }
    //            >
    //              4
    //            </div>
    //            <div
    //              class="level"
    //              id="level5"
    //              onClick={() => handleThermometerClick(5)}
    //              className={
    //                patient.painAssessment.beforeTreatment.level === 5
    //                  ? "selected"
    //                  : ""
    //              }
    //            >
    //              5
    //            </div>
    //          </div> */}
    //             <form>
    //               <div className="range-value-container">
    //                 <input
    //                   type="range"
    //                   name="painLevel"
    //                   min="0"
    //                   max="10"
    //                   value={patient.painAssessment.beforeTreatment.level}
    //                   step="1"
    //                   onChange={handlePainLevelChange}
    //                 />                        <div className="scale">
    //                   <div className="scale-value" style={{ "--value": 0 }}>
    //                     <p>0</p>
    //                     <img src="./uploads/pain-level-0.png" />
    //                     <p>no pain</p>
    //                   </div>

    //                   <div className="scale-value" style={{ "--value": 1 }}>1</div>
    //                   <div className="scale-value" style={{ "--value": 2 }}>
    //                     <p>2</p>
    //                     <img src="./uploads/pain-level-2.png" />
    //                     <p>mild</p>

    //                   </div>
    //                   <div className="scale-value" style={{ "--value": 3 }}>3</div>
    //                   <div className="scale-value" style={{ "--value": 4 }}>
    //                     <p>4</p>
    //                     <img src="./uploads/pain-level-4.png" />
    //                     <p>moderate</p>

    //                   </div>
    //                   <div className="scale-value" style={{ "--value": 5 }}>5</div>
    //                   <div className="scale-value" style={{ "--value": 6 }}>
    //                     <p>6</p>
    //                     <img src="./uploads/pain-level-6.png" />
    //                     <p>severe</p>

    //                   </div>
    //                   <div className="scale-value" style={{ "--value": 7 }}>7</div>
    //                   <div className="scale-value" style={{ "--value": 8 }}>
    //                     <p>8</p>
    //                     <img src="./uploads/pain-level-8.png" />
    //                     <p>very severe</p>

    //                   </div>
    //                   <div className="scale-value" style={{ "--value": 9 }}>9</div>
    //                   <div className="scale-value" style={{ "--value": 10 }}>
    //                     <p>10</p>
    //                     <img src="./uploads/pain-level-10.png" />
    //                     <p>worst pain</p>

    //                   </div>
    //                 </div>
    //               </div>
    //               <div id="result"></div>
    //             </form>

    //           </div>
    //         )}
    //       </>
    //     )}
    //     {page2  && (
    //       <>
    //         <div class="ur-page2-container">
    //           <div class="ur-page2-checking-checkbox">
    //             <div class="ur-page2-checkbox-container">
    //               <div class="page-2-left-container">
    //                 <div className="page-2-left-top-container">
    //                   <div className="ur-page2-checkbox-group balance">
    //                     <h2 className="ur-page2-checkbox-title">On Observation</h2>
    //                     <div className="ur-page2-col">
    //                       <table>
    //                         <thead>
    //                           <tr>
    //                             <th></th>
    //                             <th>Nor</th>
    //                             <th>Abnor</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {onObservation.map((item) => (
    //                             <tr key={item.label}>
    //                               <td>{item.label}</td>
    //                               <td>
    //                                 <input
    //                                   type="radio"
    //                                   id={item.name + "1"}
    //                                   name={item.name}
    //                                   className="ur-page2-inp-cbx"
    //                                   checked={
    //                                     patient.observation &&
    //                                       patient.observation.onObservation &&
    //                                       patient.observation.onObservation[item.name]
    //                                       ? patient.observation.onObservation[item.name].normal
    //                                       : false
    //                                   }
    //                                   onChange={() => handleObservationCheckboxChange(item.name, "normal")}
    //                                 />
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="radio"
    //                                   id={item.name + "2"}
    //                                   name={item.name}
    //                                   className="ur-page2-inp-cbx"
    //                                   checked={
    //                                     patient.observation &&
    //                                       patient.observation.onObservation &&
    //                                       patient.observation.onObservation[item.name]
    //                                       ? patient.observation.onObservation[item.name].abnormal
    //                                       : false
    //                                   }
    //                                   onChange={() => handleObservationCheckboxChange(item.name, "abnormal")}
    //                                 />
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </div>

    //                   <div className="ur-page2-checkbox-group-1 on-palpation">
    //                     <h2 className="ur-page2-checkbox-title">
    //                       On Palpation
    //                     </h2>
    //                     <div className="ur-page2-col">
    //                       <table>
    //                         <thead>
    //                           <tr>
    //                             <th></th>
    //                             <th>Nor</th>
    //                             <th>Abnor</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {onPalpation.map((item) => (
    //                             <tr key={item.label}>
    //                               <td>{item.label}</td>
    //                               <td>
    //                                 <input
    //                                   type="radio"
    //                                   id={item.name + "1"}
    //                                   name={item.name}
    //                                   className="ur-page2-inp-cbx"
    //                                   checked={
    //                                     patient.observation &&
    //                                       patient.observation.onPalpation &&
    //                                       patient.observation.onPalpation[item.name]
    //                                       ? patient.observation.onPalpation[item.name].normal
    //                                       : false
    //                                   }
    //                                   onChange={() =>
    //                                     handlePalpationCheckboxChange(item.name, "normal")
    //                                   }
    //                                 />
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="radio"
    //                                   id={item.name + "2"}
    //                                   name={item.name}
    //                                   className="ur-page2-inp-cbx"
    //                                   checked={
    //                                     patient.observation &&
    //                                       patient.observation.onPalpation &&
    //                                       patient.observation.onPalpation[item.name]
    //                                       ? patient.observation.onPalpation[item.name].abnormal
    //                                       : false
    //                                   }
    //                                   onChange={() =>
    //                                     handlePalpationCheckboxChange(item.name, "abnormal")
    //                                   }
    //                                 />
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </div>
    //                 </div>

    //                 <div class="ur-page2-checkbox-group balance">
    //                   <h2 class="ur-page2-checkbox-title">Balance</h2>
    //                   <div class="ur-page2-col">
    //                     <table>
    //                       <thead>
    //                         <tr>
    //                           <th></th>
    //                           <th>Normal</th>
    //                           <th>Abnormal</th>
    //                           <th>Remarks</th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         {balanceItems.map((item) => (
    //                           <tr key={item.label}>
    //                             <td>{item.label}</td>
    //                             <td>
    //                               <input
    //                                 type="radio"
    //                                 id={item.name + "1"}
    //                                 name={item.name}
    //                                 class="ur-page2-inp-cbx"
    //                                 checked={patient.balance[item.name].normal}
    //                                 onChange={() =>
    //                                   handleBalanceCheckboxChange(
    //                                     item.name,
    //                                     "normal"
    //                                   )
    //                                 }
    //                               />
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="radio"
    //                                 id={item.name + "2"}
    //                                 name={item.name}
    //                                 class="ur-page2-inp-cbx"
    //                                 checked={
    //                                   patient.balance[item.name].abnormal
    //                                 }
    //                                 onChange={() =>
    //                                   handleBalanceCheckboxChange(
    //                                     item.name,
    //                                     "abnormal"
    //                                   )
    //                                 }
    //                               />
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="text"
    //                                 placeholder="Enter remarks"
    //                                 class="remark-input"
    //                                 value={patient.balance[item.name].remarks}
    //                                 onChange={(event) =>
    //                                   handleBalanceRemarksChange(
    //                                     item.name,
    //                                     event
    //                                   )
    //                                 }
    //                               />
    //                             </td>
    //                           </tr>
    //                         ))}
    //                       </tbody>
    //                     </table>
    //                   </div>
    //                 </div>
    //               </div>

    //               <div class="ur-page2-checkbox-group motion-of-range">
    //                 <h2 class="ur-page2-checkbox-title">Range of Motion</h2>
    //                 <div class="ur-page2-col">
    //                   <table className="mor-table">
    //                     <thead>
    //                       <tr>
    //                         <th></th>
    //                         {rangeOfMotionJoints.map((joint) => (
    //                           <React.Fragment key={joint}>
    //                             <th colSpan="2">{joint.toUpperCase()}</th>
    //                           </React.Fragment>
    //                         ))}
    //                       </tr>
    //                       <tr>
    //                         <th></th>
    //                         {rangeOfMotionJoints.map((joint) => (
    //                           <React.Fragment key={joint}>
    //                             <th>RT</th>
    //                             <th>LT</th>
    //                           </React.Fragment>
    //                         ))}
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       {[
    //                         "flexion",
    //                         "extension",
    //                         "abduction",
    //                         "adduction",
    //                         "eversion",
    //                         "inversion",
    //                         "externalRotation",
    //                         "internalRotation",
    //                         "dorsiFlexion",
    //                         "plantarFlexion",
    //                         "supination",
    //                         "pronation",
    //                         "lateralRotation",
    //                       ].map((motion, index) => (
    //                         <tr key={motion}>
    //                           <td>{motion.toUpperCase()}</td>
    //                           {rangeOfMotionJoints.map((joint) => (
    //                             <React.Fragment key={joint}>
    //                               {["rt", "lt"].map((side) => (
    //                                 <React.Fragment key={side}>
    //                                   <td>
    //                                     {founded && (
    //                                       <>
    //                                         <input
    //                                           type="text"
    //                                           placeholder="0"
    //                                           className="ur-rom-custom-input"
    //                                           name={
    //                                             joint +
    //                                             "-" +
    //                                             motion +
    //                                             "-" +
    //                                             side
    //                                           }
    //                                           value={
    //                                             patient.rangeOfMotion[joint][
    //                                             index
    //                                             ][motion][side] || ""
    //                                           }
    //                                           onChange={(e) =>
    //                                             handleRangeOfMotionChange(
    //                                               joint,
    //                                               motion,
    //                                               side,
    //                                               parseInt(e.target.value) || 0
    //                                             )
    //                                           }
    //                                           disabled={
    //                                             !allowedMotions[joint] ||
    //                                             !allowedMotions[joint].includes(
    //                                               motion
    //                                             )
    //                                           }
    //                                         />
    //                                       </>
    //                                     )}
    //                                     {!founded && (
    //                                       <input
    //                                         type="text"
    //                                         className="ur-rom-custom-input"
    //                                         name={
    //                                           joint + "-" + motion + "-" + side
    //                                         }
    //                                         placeholder="0"
    //                                         onChange={(e) =>
    //                                           handleRangeOfMotionChange(
    //                                             joint,
    //                                             motion,
    //                                             side,
    //                                             parseInt(e.target.value) || 0
    //                                           )
    //                                         }
    //                                         disabled={
    //                                           !allowedMotions[joint] ||
    //                                           !allowedMotions[joint].includes(
    //                                             motion
    //                                           )
    //                                         }
    //                                       />
    //                                     )}

    //                                   </td>
    //                                 </React.Fragment>
    //                               ))}
    //                             </React.Fragment>
    //                           ))}
    //                         </tr>
    //                       ))}
    //                     </tbody>
    //                   </table>
    //                 </div>
    //               </div>

    //               {/*htttt */}
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     )}
    //     {page3 && (
    //       <div className="main-container-page-3">
    //         <div class="ur-page3-container">
    //           <div className="ur-page3-left-container">
    //             <h2 className="ur-page3-left-container-title">Muscle Power</h2>
    //             <table className="muscle-power-table">
    //               <thead>
    //                 <tr>
    //                   <th></th>
    //                   <th colSpan="2">MOTOR</th>
    //                   <th colSpan="2">SENSORY</th>
    //                 </tr>
    //                 <tr>
    //                   <th></th>
    //                   <th>RT</th>
    //                   <th>LT</th>
    //                   <th>RT</th>
    //                   <th>LT</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {musclePowerItems.map((item) => (
    //                   <tr key={item.name}>
    //                     <td>{item.label}</td>
    //                     {["motor", "sensory"].map((category) =>
    //                       ["rt", "lt"].map((side) => (
    //                         <React.Fragment key={item.name + side + category}>
    //                           <td>
    //                             <input
    //                               class="mp-custom-input"
    //                               type="text"
    //                               value={
    //                                 patient.musclePower[item.name][side][
    //                                 category
    //                                 ]
    //                               }
    //                               onChange={(e) =>
    //                                 handleMusclePowerChange(
    //                                   item.name,
    //                                   side,
    //                                   category,
    //                                   parseInt(e.target.value) || 0
    //                                 )
    //                               }
    //                             />
    //                           </td>
    //                         </React.Fragment>
    //                       ))
    //                     )}
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //           <div class="ur-page3-right-container">
    //             <div class="co-ordination-table">
    //               <h2 class="ur-page3-right-container-tb1-title">
    //                 Co-Ordination
    //               </h2>
    //               <table>
    //                 <thead>
    //                   <tr>
    //                     <th></th>
    //                     <th>Normal</th>
    //                     <th>Abnormal</th>
    //                     <th>Remarks</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {coordinationItems.map((item) => (
    //                     <tr key={item.label}>
    //                       <td>{item.label}</td>
    //                       {["normal", "abnormal"].map((column) => (
    //                         <td key={column}>
    //                           <input
    //                             type="radio"
    //                             checked={
    //                               patient.coordination[item.name][column]
    //                             }
    //                             onChange={() =>
    //                               handleCoordinationCheckboxChange(
    //                                 item.name,
    //                                 column
    //                               )
    //                             }
    //                           />
    //                         </td>
    //                       ))}
    //                       <td>
    //                         <input
    //                           type="text"
    //                           value={patient.coordination[item.name].remarks}
    //                           onChange={(event) =>
    //                             handleRemarksChange(item.name, event)
    //                           }
    //                         />
    //                       </td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>

    //             <div class="saw-table">
    //               <h2 class="ur-page3-right-container-tb2-title">
    //                 Standing and Walking
    //               </h2>
    //               <table>
    //                 <thead>
    //                   <tr>
    //                     <th></th>
    //                     <th>Normal</th>
    //                     <th>Abnormal</th>
    //                     <th>Remarks</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   <tr>
    //                     <td>STANDING: NORMAL POSTURE</td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         id="sitting-normal"
    //                         name="sitting-normal"
    //                         class="ur-page2-inp-cbx"
    //                         checked={
    //                           patient.standingWalking.normalPosture.normal
    //                         }
    //                         onChange={() =>
    //                           handleStandingWalkingCheckboxChange(
    //                             "normalPosture",
    //                             "normal"
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         id="sitting-abnormal"
    //                         name="sitting-abnormal"
    //                         class="ur-page2-inp-cbx"
    //                         checked={
    //                           patient.standingWalking.normalPosture.abnormal
    //                         }
    //                         onChange={() =>
    //                           handleStandingWalkingCheckboxChange(
    //                             "normalPosture",
    //                             "abnormal"
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         placeholder="Enter remarks"
    //                         class="remark-input"
    //                         value={
    //                           patient.standingWalking.normalPosture.remarks
    //                         }
    //                         onChange={(event) =>
    //                           handleEquilibriumRemarksChange(
    //                             "normalPosture",
    //                             event
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <td>TANDON WALKING</td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         id="standing-normal"
    //                         name="standing-normal"
    //                         class="ur-page2-inp-cbx"
    //                         checked={
    //                           patient.standingWalking.tandonWalking.normal
    //                         }
    //                         onChange={() =>
    //                           handleStandingWalkingCheckboxChange(
    //                             "tandonWalking",
    //                             "normal"
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         id="standing-abnormal"
    //                         name="standing-abnormal"
    //                         class="ur-page2-inp-cbx"
    //                         checked={
    //                           patient.standingWalking.tandonWalking.abnormal
    //                         }
    //                         onChange={() =>
    //                           handleStandingWalkingCheckboxChange(
    //                             "tandonWalking",
    //                             "abnormal"
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         placeholder="Enter remarks"
    //                         class="remark-input"
    //                         value={
    //                           patient.standingWalking.tandonWalking.remarks
    //                         }
    //                         onChange={(event) =>
    //                           handleEquilibriumRemarksChange(
    //                             "tandonWalking",
    //                             event
    //                           )
    //                         }
    //                       />
    //                     </td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //     {page4  && (
    //       <>
    //         <div class="page-4-container">
    //           <div class="page-4-content">
    //             <div class="page-4-form-top">
    //               <div className="section-hand-function">
    //                 <h2 className="ur-page2-checkbox-title">Hand Function</h2>

    //                 <table className="content-table">
    //                   <thead className="content-head">
    //                     <tr>
    //                       <th></th>
    //                       <th>Normal</th>
    //                       <th>Abnormal</th>
    //                       <th>Remarks</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {handFunctionItems.map((item) => (
    //                       <tr key={item.label}>
    //                         <td>{item.label}</td>
    //                         {["normal", "abnormal"].map((column) => (
    //                           <React.Fragment key={column}>
    //                             <td>
    //                               <input
    //                                 type="radio"
    //                                 id={`${item.name}-${column}`}
    //                                 checked={
    //                                   patient.handFunction[item.name][column]
    //                                 }
    //                                 onChange={() =>
    //                                   handleHandFunctionCheckboxChange(
    //                                     item.name,
    //                                     column
    //                                   )
    //                                 }
    //                                 className="radio-input"
    //                               />
    //                             </td>
    //                           </React.Fragment>
    //                         ))}
    //                         <td className="remark">
    //                           <input
    //                             type="text"
    //                             value={patient.handFunction[item.name].remarks}
    //                             onChange={(event) =>
    //                               handleHandFunctionRemarksChange(
    //                                 item.name,
    //                                 event
    //                               )
    //                             }
    //                             className="remark-input"
    //                           />
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>

    //               <div className="Breathing-Pattern-table">
    //                 <h2 className="ur-page2-checkbox-title">
    //                   Observation of chest
    //                 </h2>
    //                 <table className="content-table">
    //                   <thead className="content-head">
    //                     <tr>
    //                       <th></th>
    //                       <th>Normal</th>
    //                       <th>Abnormal</th>
    //                       <th>Remarks</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {chestObservationItems.map((item) => (
    //                       <tr key={item.label}>
    //                         <td>{item.label}</td>
    //                         <td>
    //                           <input
    //                             class="radio-input"
    //                             type="radio"
    //                             checked={
    //                               patient.chestObservation[item.name].normal
    //                             }
    //                             onChange={() =>
    //                               handleChestObservationCheckboxChange(
    //                                 item.name,
    //                                 "normal"
    //                               )
    //                             }
    //                           />
    //                         </td>
    //                         <td>
    //                           <input
    //                             class="radio-input"
    //                             type="radio"
    //                             checked={
    //                               patient.chestObservation[item.name].abnormal
    //                             }
    //                             onChange={() =>
    //                               handleChestObservationCheckboxChange(
    //                                 item.name,
    //                                 "abnormal"
    //                               )
    //                             }
    //                           />
    //                         </td>
    //                         <td>
    //                           <input
    //                             class="remark-input"
    //                             type="text"
    //                             value={
    //                               patient.chestObservation[item.name].remarks
    //                             }
    //                             onChange={(e) =>
    //                               setPatient((prevPatient) => ({
    //                                 ...prevPatient,
    //                                 chestObservation: {
    //                                   ...prevPatient.chestObservation,
    //                                   [item.name]: {
    //                                     ...prevPatient.chestObservation[
    //                                     item.name
    //                                     ],
    //                                     remarks: e.target.value,
    //                                   },
    //                                 },
    //                               }))
    //                             }
    //                           />
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //               <div className="Prehension-table">
    //                 <h2 className="ur-page2-checkbox-title">
    //                   Prehension Table
    //                 </h2>
    //                 <table className="content-table">
    //                   <thead className="content-head">
    //                     <tr>
    //                       <th></th>
    //                       <th>Normal</th>
    //                       <th>Abnormal</th>
    //                       <th>Remarks</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {prehensionItems.map((item) => (
    //                       <tr key={item.label}>
    //                         <td>{item.label}</td>
    //                         {["normal", "abnormal"].map((column) => (
    //                           <td key={column}>
    //                             <input
    //                               class="radio-input"
    //                               type="radio"
    //                               checked={
    //                                 patient.prehension[item.name][column]
    //                               }
    //                               onChange={() =>
    //                                 handlePrehensionCheckboxChange(
    //                                   item.name,
    //                                   column
    //                                 )
    //                               }
    //                             />
    //                           </td>
    //                         ))}
    //                         <td>
    //                           <input
    //                             class="remark-input"
    //                             type="text"
    //                             value={patient.prehension[item.name].remarks}
    //                             onChange={(event) =>
    //                               setPatient((prevPatient) => ({
    //                                 ...prevPatient,
    //                                 prehension: {
    //                                   ...prevPatient.prehension,
    //                                   [item.name]: {
    //                                     ...prevPatient.prehension[item.name],
    //                                     remarks: event.target.value,
    //                                   },
    //                                 },
    //                               }))
    //                             }
    //                           />
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //             <div class="page-4-form-bottom">
    //               <div className="co-ordination-table">
    //                 <h2 className="ur-page2-checkbox-title">
    //                   Co-Ordination Table
    //                 </h2>
    //                 <table className="content-table">
    //                   <thead className="content-head">
    //                     <tr>
    //                       <th></th>
    //                       <th>Normal</th>
    //                       <th>Abnor</th>
    //                       <th>Remarks</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {coordinationItems.map((item) => (
    //                       <tr key={item.label}>
    //                         <td>{item.label}</td>
    //                         {["normal", "abnormal"].map((column) => (
    //                           <td key={column}>
    //                             <input
    //                               class="radio-input"
    //                               type="radio"
    //                               name={item.name + "-" + column}
    //                               checked={
    //                                 patient.coordination[item.name][column]
    //                               }
    //                               onChange={() =>
    //                                 handleCoordinationCheckboxChange(
    //                                   item.name,
    //                                   column
    //                                 )
    //                               }
    //                             />
    //                           </td>
    //                         ))}
    //                         <td>
    //                           <input
    //                             type="text"
    //                             class="remark-input"
    //                             value={patient.coordination[item.name].remarks}
    //                             onChange={(event) =>
    //                               handleRemarksChange(item.name, event)
    //                             }
    //                           />
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //               <div className="section-subjective-Assessment">
    //                 <h2 className="ur-page2-checkbox-title">
    //                   Subjective Assessment
    //                 </h2>
    //                 <table className="content-table">
    //                   <thead className="content-head">
    //                     <tr>
    //                       <th></th>
    //                       <th>Duration</th>
    //                       <th>Severity</th>
    //                       <th>Pattern</th>
    //                       <th>Associated Factor</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {Object.keys(patient.subjectiveAssessment).map(
    //                       (symptom) => (
    //                         <tr key={symptom}>
    //                           <td>{symptom}</td>
    //                           {[
    //                             "duration",
    //                             "severity",
    //                             "pattern",
    //                             "associatedFactors",
    //                           ].map((field) => (
    //                             <td key={field} className="remark">
    //                               {field === "severity" ? (
    //                                 <select
    //                                   value={
    //                                     patient.subjectiveAssessment[symptom][
    //                                     field
    //                                     ]
    //                                   }
    //                                   onChange={(event) =>
    //                                     handleSeverityChange(symptom, event)
    //                                   }
    //                                   name={`${symptom}-${field}`}
    //                                 >
    //                                   <option value="">Severity</option>
    //                                   {severityOptions.map((option) => (
    //                                     <option
    //                                       key={option}
    //                                       value={option.toLowerCase()}
    //                                     >
    //                                       {option}
    //                                     </option>
    //                                   ))}
    //                                 </select>
    //                               ) : field === "associatedFactors" &&
    //                                 symptom === "sputumHemoptysis" ? (
    //                                 <select
    //                                   value={
    //                                     patient.subjectiveAssessment[symptom]
    //                                       .hemoptysisType
    //                                   }
    //                                   onChange={(event) =>
    //                                     handleHemoptysisTypeChange(
    //                                       symptom,
    //                                       event
    //                                     )
    //                                   }
    //                                   name={`${symptom}-${field}`}
    //                                 >
    //                                   <option value="">Type</option>
    //                                   {hemoptysisOptions.map((option) => (
    //                                     <option
    //                                       key={option}
    //                                       value={option.toLowerCase()}
    //                                     >
    //                                       {option}
    //                                     </option>
    //                                   ))}
    //                                 </select>
    //                               ) : (
    //                                 <input
    //                                   type="text"
    //                                   value={
    //                                     patient.subjectiveAssessment[symptom][
    //                                     field
    //                                     ]
    //                                   }
    //                                   onChange={(event) =>
    //                                     handleTextChange(symptom, field, event)
    //                                   }
    //                                   className="remark-input"
    //                                 />
    //                               )}
    //                             </td>
    //                           ))}
    //                         </tr>
    //                       )
    //                     )}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     )}
    //     {page5  && (
    //       <div className="ur-page5-main-container">
    //         <div class="ur-page5-container">
    //           <div class="ur-page5-left-container">
    //             <div className="barthel-index-container">
    //               <div className="ur-page5-left-container-title">
    //                 The Barthel Index
    //               </div>
    //               <table className="barthel-index-table">
    //                 <thead>
    //                   <tr>
    //                     <th>Activity</th>
    //                     <th>Range</th>
    //                     <th>Score</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {barthelIndexItems.map((item) => (
    //                     <tr key={item.label}>
    //                       <td>{item.label}</td>

    //                       <td>{item.range}</td>
    //                       <td>
    //                         <select
    //                           value={patient.barthelIndex[item.name].score}
    //                           onChange={(e) =>
    //                             handleScoreChange(
    //                               item.name,
    //                               parseInt(e.target.value)
    //                             )
    //                           }
    //                         >
    //                           {Array.from(
    //                             {
    //                               length:
    //                                 patient.barthelIndex[item.name].maxScore +
    //                                 1,
    //                             },
    //                             (_, index) => index
    //                           ).map((score) => (
    //                             <option key={score} value={score}>
    //                               {score}
    //                             </option>
    //                           ))}
    //                         </select>
    //                       </td>
    //                     </tr>
    //                   ))}
    //                   <tr>
    //                     <td></td>
    //                     <td>Total Scores</td>
    //                     <td>
    //                       {Object.values(patient.barthelIndex).reduce(
    //                         (total, activity) => total + activity.score,
    //                         0
    //                       )}
    //                     </td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //           <div class="ur-page5-right-container">
    //             <div class="brpe-table">
    //               <h2 class="ur-page5-right-container-tb1-title">
    //                 Borg Rate of Perceived Exertion(BRPE)
    //               </h2>
    //               <table>
    //                 <thead>
    //                   <tr>
    //                     <th>Rating</th>
    //                     <th>Description</th>
    //                     <th>Effort%</th>
    //                     <th>Rating Got</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {brpeData.map((data) => (
    //                     <tr key={data.rating}>
    //                       <td>{data.rating}</td>
    //                       <td>{data.description}</td>
    //                       <td>{data.effortPercentage}</td>
    //                       <td>
    //                         <input
    //                           type="radio"
    //                           name={`rating${data.rating}`}
    //                           checked={patient.brpe[`rating${data.rating}`]}
    //                           onChange={() =>
    //                             handleBordRatingCheckboxChange(
    //                               `rating${data.rating}`
    //                             )
    //                           }
    //                         />
    //                       </td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //     {page6  && (
    //       <div className="ur-page6-main-container">
    //         <div class="ur-page6-container">
    //           <div className="page-6-upper-container">
    //             <h2 class="ur-page2-checkbox-title">Choose Chest Type</h2>

    //             <div className="page-6-form-container">
    //               <img
    //                 src="./uploads/normal.PNG"
    //                 alt="Normal Chest"
    //                 onClick={() => handleImageClick("normal")}
    //                 className={
    //                   patient.chestShapeObservation.chestShape["normal"]
    //                     ? "selected"
    //                     : ""
    //                 }
    //               />
    //               <img
    //                 src="./uploads/barrel-chest.PNG"
    //                 alt="Barrel Chest"
    //                 onClick={() => handleImageClick("barrelChest")}
    //                 className={
    //                   patient.chestShapeObservation.chestShape["barrelChest"]
    //                     ? "selected"
    //                     : ""
    //                 }
    //               />
    //               <img
    //                 src="./uploads/kyphosis.PNG"
    //                 alt="Kyphosis"
    //                 onClick={() => handleImageClick("kyphosis")}
    //                 className={
    //                   patient.chestShapeObservation.chestShape["kyphosis"]
    //                     ? "selected"
    //                     : ""
    //                 }
    //               />
    //               <img
    //                 src="./uploads/pectus-excavatum.PNG"
    //                 alt="Pectus Excavatum"
    //                 onClick={() => handleImageClick("pectusExcavatum")}
    //                 className={
    //                   patient.chestShapeObservation.chestShape[
    //                     "pectusExcavatum"
    //                   ]
    //                     ? "selected"
    //                     : ""
    //                 }
    //               />
    //               <img
    //                 src="./uploads/pectus-carinatum.PNG"
    //                 alt="Pectus Carinatum"
    //                 onClick={() => handleImageClick("pectusCarinatum")}
    //                 className={
    //                   patient.chestShapeObservation.chestShape[
    //                     "pectusCarinatum"
    //                   ]
    //                     ? "selected"
    //                     : ""
    //                 }
    //               />
    //             </div>
    //           </div>

    //           <div class="page-6-lower-container">
    //             <div class="page-6-left-container">
    //               <img src="./uploads/lobe.PNG" alt="Image" />
    //             </div>
    //             <div className="page-6-right-container">
    //               <h2 className="ur-page2-checkbox-title">
    //                 Observation of Chest Motion
    //               </h2>
    //               <table>
    //                 <thead>
    //                   <tr>
    //                     <th>Motion Type</th>
    //                     <th>Normal A</th>
    //                     <th>Abnormal B</th>
    //                     <th>Remarks</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   <tr>
    //                     <td>Middle Lobe & Lingula Motion</td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="middleLobeLingulaMotion"
    //                         checked={patient.chestMotionObservation.middleLobeLingulaMotion.normal}
    //                         onChange={() => handleLobeInputChange("middleLobeLingulaMotion", "normal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="middleLobeLingulaMotion"
    //                         checked={patient.chestMotionObservation.middleLobeLingulaMotion.abnormal}
    //                         onChange={() => handleLobeInputChange("middleLobeLingulaMotion", "abnormal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         value={patient.chestMotionObservation.middleLobeLingulaMotion.remarks}
    //                         onChange={(e) =>
    //                           handleLobeRemarkInputChange("middleLobeLingulaMotion", "remarks", e.target.value)
    //                         }
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <td>Upper Lobe Motion</td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="upperLobeMotion"
    //                         checked={patient.chestMotionObservation.upperLobeMotion.normal}
    //                         onChange={() => handleLobeInputChange("upperLobeMotion", "normal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="upperLobeMotion"
    //                         checked={patient.chestMotionObservation.upperLobeMotion.abnormal}
    //                         onChange={() => handleLobeInputChange("upperLobeMotion", "abnormal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         value={patient.chestMotionObservation.upperLobeMotion.remarks}
    //                         onChange={(e) =>
    //                           handleLobeRemarkInputChange("upperLobeMotion", "remarks", e.target.value)
    //                         }
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                   </tr>
    //                   <tr>
    //                     <td>Lower Lobe Motion</td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="lowerLobeMotion"
    //                         checked={patient.chestMotionObservation.lowerLobeMotion.normal}
    //                         onChange={() => handleLobeInputChange("lowerLobeMotion", "normal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="radio"
    //                         name="lowerLobeMotion"
    //                         checked={patient.chestMotionObservation.lowerLobeMotion.abnormal}
    //                         onChange={() => handleLobeInputChange("lowerLobeMotion", "abnormal")}
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         value={patient.chestMotionObservation.lowerLobeMotion.remarks}
    //                         onChange={(e) =>
    //                           handleLobeRemarkInputChange("lowerLobeMotion", "remarks", e.target.value)
    //                         }
    //                         className="remark-input"
    //                       />
    //                     </td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //     {page7  && (
    //       <div className="page-7-super-container">
    //         <div className="page-7-main-container">
    //           <div>
    //             {patient && (
    //               <>
    //                 {firstRow ? (
    //                   <>
    //                     <h2 class="ur-page3-right-container-tb1-title">
    //                       Plan Treatment
    //                     </h2>
    //                     <table className="treatment-table">
    //                       <thead>
    //                         <tr>
    //                           {console.log("first ")}
    //                           <th>Patient Type</th>
    //                           <th>Date</th>
    //                           <th>No. of Days</th>

    //                           {patient.planTreatment[0].patientType ===
    //                             "inpatient"
    //                             ? Object.keys(patient.planTreatment[0])
    //                               .slice(4)
    //                               .map((category, index) => (
    //                                 <th key={index}>{category}</th>
    //                               ))
    //                             : Object.keys(patient.planTreatment[0])
    //                               .slice(4, -1)
    //                               .map((category, index) => (
    //                                 <th key={index}>{category}</th>
    //                               ))}
    //                           <th>Billing</th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         {patient.planTreatment.map((plan, index) => (
    //                           <tr key={index}>
    //                             <td>
    //                               <select
    //                                 value={plan.patientType}
    //                                 onChange={(e) =>
    //                                   handlePatientTypeChange(e.target.value)
    //                                 }
    //                               >
    //                                 <option value="">
    //                                   Select Patient Type
    //                                 </option>
    //                                 <option value="outpatient">
    //                                   Out-Patient
    //                                 </option>
    //                                 <option value="inpatient">
    //                                   In-Patient
    //                                 </option>
    //                               </select>
    //                             </td>
    //                             <td>
    //                               {/*<input
    //                                             type="date"
    //                                             name={`date_${index}`}
    //                                             value={plan.date}
    //                                             onChange={(e) => handlePlanChange(index, 'date', e.target.value)}
    //                                         />*/}
    //                               {plan.patientType === "outpatient" && (
    //                                 <div className="fresh-bill-admis-dis-date">
    //                                   <label>
    //                                     Appointment Date:
    //                                     <input
    //                                       type="date"
    //                                       name="appointmentDate"
    //                                       value={
    //                                         patient.outPatientBill[0]
    //                                           .appointmentDate
    //                                       }
    //                                       onChange={
    //                                         handleOutPatientInputChange
    //                                       }
    //                                     />
    //                                   </label>
    //                                 </div>
    //                               )}
    //                               {plan.patientType === "inpatient" && (
    //                                 <div className="fresh-bill-admis-dis-date">
    //                                   <label>
    //                                     Admission :
    //                                     <input
    //                                       type="date"
    //                                       name="admissionDate"
    //                                       value={
    //                                         patient.inPatientBill[0]
    //                                           .admissionDate
    //                                       }
    //                                       onChange={handleInPatientInputChange}
    //                                     />
    //                                   </label>
    //                                   <label>
    //                                     Discharge :
    //                                     <input
    //                                       type="date"
    //                                       name="dischargeDate"
    //                                       value={
    //                                         patient.inPatientBill[0]
    //                                           .dischargeDate
    //                                       }
    //                                       onChange={handleInPatientInputChange}
    //                                     />
    //                                   </label>
    //                                 </div>
    //                               )}
    //                             </td>
    //                             <td>
    //                               {/*<input
    //                                             type="text"
    //                                             name={`days${index}`}
    //                                             value={plan.days}
    //                                             onChange={(e) => handlePlanChange(index, 'days', e.target.value)}
    //                                         />*/}
    //                               {plan.patientType === "outpatient" && (
    //                                 <input
    //                                   type="text"
    //                                   value={1}
    //                                 // onChange={(e) => handleInputChange(index, "days", 1)}
    //                                 />
    //                               )}
    //                               {plan.patientType === "inpatient" && (
    //                                 <input
    //                                   type="text"
    //                                   value={patient.inPatientBill[0].totalDays}
    //                                   onChange={handleInPatientInputChange}
    //                                 />
    //                               )}
    //                             </td>

    //                             {patient.planTreatment[0].patientType === "inpatient" &&
    //                               Object.keys(plan).slice(4).map((category, colIndex) => (
    //                                 <td key={colIndex}>
    //                                   <input
    //                                     type="checkbox"
    //                                     name={`${category}_${index}`}
    //                                     checked={plan[category]}
    //                                     onChange={() => handlePlanCheckboxChange(index, category)}
    //                                   />
    //                                 </td>
    //                               ))
    //                             }
    //                             {patient.planTreatment[0].patientType === "outpatient" &&
    //                               Object.keys(plan).slice(4, -1).map((category, colIndex) => (
    //                                 <td key={colIndex}>
    //                                   <input
    //                                     type="checkbox"
    //                                     name={`${category}_${index}`}
    //                                     checked={plan[category]}
    //                                     onChange={() => handlePlanCheckboxChange(index, category)}
    //                                   />
    //                                 </td>
    //                               ))
    //                             }
    //                             <td>
    //                               {(patient.planTreatment[0].patientType === "outpatient" || patient.planTreatment[0].patientType === "inpatient") &&
    //                                 <div class="icon billings">
    //                                   <span class="tooltip">Add Bill</span>
    //                                   <span>
    //                                     <img
    //                                       src="./uploads/icons8-billing-90.png"
    //                                       alt=""
    //                                       class="icon-over"
    //                                       onClick={() =>
    //                                         handleCreateFreshBill(
    //                                           plan.patientType
    //                                         )
    //                                       }
    //                                     />
    //                                   </span>
    //                                 </div>
    //                               }
    //                             </td>
    //                           </tr>
    //                         ))}
    //                       </tbody>
    //                     </table>
    //                   </>
    //                 ) : (
    //                   <>
    //                     <div className="page-6-plan-invest-edit">
    //                       <h2 class="ur-page3-right-container-tb1-title">
    //                         Plan Treatment
    //                       </h2>
    //                       <div className="all-wrap-button">
    //                       <div onClick={handleEditClick}>
    //                         {isEditing ? (
    //                           <div class=" billings">
    //                             <span class="tooltip">Edit</span>
    //                             <span>
    //                               <img
    //                                 src="./uploads/pen.png"
    //                                 alt=""
    //                                 class="icon-over"
    //                               />
    //                             </span>
    //                           </div>
    //                         ) : (
    //                           <div class=" billings">
    //                             <span class="tooltip">Edit</span>
    //                             <span>
    //                               <img
    //                                 src="./uploads/pen.png"
    //                                 alt=""
    //                                 class="icon-over"
    //                               />
    //                             </span>
    //                           </div>
    //                         )}
    //                       </div>
    //                       {isEditing && (
    //                         <div className="page-7-add-discard-btn-class">
    //                           {!addRowPressed && (
    //                             <div
    //                               class="icon controls "
    //                               onClick={handleAddRow}
    //                             >
    //                               <span class="tooltip">Add A Plan</span>
    //                               <span>
    //                                 <img
    //                                   src="./uploads/multiply.png"
    //                                   alt=""
    //                                   class="icon-over plusIcon"
    //                                 />
    //                               </span>
    //                             </div>
    //                           )}
    //                           {addRowPressed && (
    //                             <>
    //                               <div
    //                                 class="icon controls"
    //                                 onClick={handleInOutUpdate}
    //                               >
    //                                 <span class="tooltip">Save</span>
    //                                 <span>
    //                                   <img
    //                                     src="./uploads/checked.png"
    //                                     alt=""
    //                                     class="icon-over"
    //                                   />
    //                                 </span>
    //                               </div>
    //                               <div
    //                                 class="icon controls "
    //                                 onClick={handleDeleteRow}
    //                               >
    //                                 <span class="tooltip">Discard</span>
    //                                 <span>
    //                                   <img
    //                                     src="./uploads/multiply.png"
    //                                     alt=""
    //                                     class="icon-over multiIcon"
    //                                   />
    //                                 </span>
    //                               </div>
    //                             </>
    //                           )}
    //                         </div>
    //                       )}
    //                       </div>
    //                     </div>

    //                     <div className="planed-treatment">
    //                       <table className="planned-treatment-table">
    //                         {console.log("fetched rows", patient.planTreatment)}
    //                         <thead>
    //                           <tr>
    //                             <th>Patient Type</th>
    //                             <th>Date</th>
    //                             <th>No of Days</th>
    //                             <th>UST</th>
    //                             <th>IFT</th>
    //                             <th>SWD</th>
    //                             <th>TR</th>
    //                             <th>Wax</th>
    //                             <th>EST</th>
    //                             <th>SHT</th>
    //                             <th>LASER</th>
    //                             <th>EXS</th>
    //                             <th>REHAB</th>
    //                             <th>BILLING</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {patient.planTreatment.map((plan, index) => (
    //                             <tr key={index}>
    //                               <td>
    //                                 {!plan.isNewRow && plan.patientType}
    //                                 {plan.isNewRow && (
    //                                   <select
    //                                     value={nextRowPatientType}
    //                                     onChange={(e) =>
    //                                       handleInOutPatientTypeChange(
    //                                         e.target.value
    //                                       )
    //                                     }
    //                                   >
    //                                     <option value="choose type">
    //                                       Select Patient Type
    //                                     </option>
    //                                     <option value="outpatient">
    //                                       Out-Patient
    //                                     </option>
    //                                     <option value="inpatient">
    //                                       In-Patient
    //                                     </option>
    //                                   </select>
    //                                 )}
    //                               </td>
    //                               <td>
    //                                 {/*console.log("Rendering - isNewRow:", plan.isNewRow)*/}
    //                                 {!plan.isNewRow &&
    //                                   plan.patientType === "inpatient" && (
    //                                     <div className="admis-dis-flexer">
    //                                       <label>
    //                                         Admission Date:
    //                                         <input
    //                                           type="date"
    //                                           value={plan.startDate}
    //                                           onChange={(e) =>
    //                                             handleInOutInputChange(
    //                                               index,
    //                                               "date",
    //                                               e.target.value
    //                                             )
    //                                           }
    //                                         />
    //                                       </label>
    //                                       <label>
    //                                         Discharge Date:
    //                                         <input
    //                                           type="date"
    //                                           value={plan.endDate}
    //                                           onChange={(e) =>
    //                                             handleInOutInputChange(
    //                                               index,
    //                                               "date",
    //                                               e.target.value
    //                                             )
    //                                           }
    //                                         />
    //                                       </label>
    //                                     </div>
    //                                   )}
    //                                 {!plan.isNewRow &&
    //                                   plan.patientType === "outpatient" && (
    //                                     <label>
    //                                       Appointment Date:
    //                                       <input
    //                                         type="date"
    //                                         value={plan.startDate}
    //                                         onChange={(e) =>
    //                                           handleInOutInputChange(
    //                                             index,
    //                                             "date",
    //                                             e.target.value
    //                                           )
    //                                         }
    //                                       />
    //                                     </label>
    //                                   )}

    //                                 {nextRowPatientType !== "inpatient" &&
    //                                   nextRowPatientType === "outpatient" &&
    //                                   plan.isNewRow && (
    //                                     <label>
    //                                       Appointment Date:
    //                                       <input
    //                                         type="date"
    //                                         name="appointmentDate"
    //                                         value={
    //                                           outPatientBillDetails.outBill[0]
    //                                             .appointmentDate
    //                                         }
    //                                         onChange={
    //                                           handleIOOutPatientInputChange
    //                                         }
    //                                       />
    //                                     </label>
    //                                   )}

    //                                 {nextRowPatientType === "inpatient" &&
    //                                   plan.isNewRow &&
    //                                   plan.patientType !== "choose type" && (
    //                                     <div className="admis-dis-flexer">
    //                                       <label>
    //                                         Admission Date:
    //                                         <input
    //                                           type="date"
    //                                           name="admissionDate"
    //                                           value={
    //                                             inPatientBillDetails.inBill[0]
    //                                               .admissionDate
    //                                           }
    //                                           onChange={
    //                                             handleIOInPatientInputChange
    //                                           }
    //                                         />
    //                                       </label>
    //                                       <label>
    //                                         Discharge Date:
    //                                         <input
    //                                           type="date"
    //                                           name="dischargeDate"
    //                                           value={
    //                                             inPatientBillDetails.inBill[0]
    //                                               .dischargeDate
    //                                           }
    //                                           onChange={
    //                                             handleIOInPatientInputChange
    //                                           }
    //                                         />
    //                                       </label>
    //                                     </div>
    //                                   )}
    //                               </td>
    //                               <td className="total-days-page7">
    //                                 {!plan.isNewRow && (
    //                                   <input
    //                                     type="text"
    //                                     value={plan.days}
    //                                     onChange={(e) =>
    //                                       handleInOutInputChange(
    //                                         index,
    //                                         "days",
    //                                         e.target.value
    //                                       )
    //                                     }
    //                                   />
    //                                 )}
    //                                 {nextRowPatientType === "outpatient" &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="text"
    //                                       value={1}
    //                                     // onChange={(e) => handleInOutInputChange(index, "days", 1)}
    //                                     />
    //                                   )}
    //                                 {nextRowPatientType === "inpatient" &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="text"
    //                                       value={
    //                                         inPatientBillDetails.inBill[0]
    //                                           .totalDays
    //                                       }
    //                                       onChange={
    //                                         handleIOInPatientInputChange
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>

    //                               <td>

    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ust}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ust")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ust}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ust")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ust}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ust")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ust}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ust")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ift}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ift")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ift}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ift")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ift}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ift")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.ift}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "ift")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.swd}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "swd")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.swd}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "swd")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.swd}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "swd")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.swd}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "swd")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.tr}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "tr")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.tr}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "tr")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.tr}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "tr")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.tr}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "tr")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.wax}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "wax")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.wax}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "wax")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.wax}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "wax")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.wax}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "wax")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.est}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "est")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.est}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "est")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.est}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "est")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.est}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "est")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>

    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.sht}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "sht")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.sht}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "sht")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.sht}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "sht")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.sht}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "sht")
    //                                       }
    //                                     />
    //                                   )}

    //                               </td>
    //                               <td>

    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.laser}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "laser"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.laser}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "laser"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.laser}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "laser"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.laser}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "laser"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.exs}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "exs")
    //                                       }
    //                                     />
    //                                   )}

    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.exs}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "exs")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {(nextRowPatientType === "outpatient" ||
    //                                   plan.patientType === "outpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.exs}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "exs")
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "outpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.exs}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(index, "exs")
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>
    //                               <td>
    //                                 {(nextRowPatientType === "inpatient" ||
    //                                   plan.patientType === "inpatient") &&
    //                                   plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.rehab}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "rehab"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}
    //                                 {plan.patientType === "inpatient" &&
    //                                   !plan.isNewRow && (
    //                                     <input
    //                                       type="checkbox"
    //                                       checked={plan.rehab}
    //                                       onChange={() =>
    //                                         handleInOutCheckboxChange(
    //                                           index,
    //                                           "rehab"
    //                                         )
    //                                       }
    //                                     />
    //                                   )}
    //                               </td>

    //                               <td>
    //                                 {/*console.log("isEditing:", isEditing, "isNewRow:", plan.isNewRow)*/}
    //                                 {!plan.isNewRow && (
    //                                   <>
    //                                     {plan.patientType === "inpatient" &&
    //                                       !plan.isNewRow && (
    //                                         <div className="view-add-flexer-page-7">
    //                                           <div class="icon billings">
    //                                             <span class="tooltip">
    //                                               View Bill
    //                                             </span>
    //                                             <span>
    //                                               <img
    //                                                 src="./uploads/vision.png"
    //                                                 alt=""
    //                                                 class="icon"
    //                                                 onClick={() =>
    //                                                   handleViewBill(
    //                                                     index,
    //                                                     plan.patientType
    //                                                   )
    //                                                 }
    //                                               />
    //                                             </span>
    //                                           </div>
    //                                           {/* <div class="icon billings">
    //                                                                                                 <span class="tooltip">Add Outpatient Bill</span>
    //                                                                                                 <span>
    //                                                                                                     <img src="./uploads/icons8-billing-90.png" alt="" class="icon"
    //                                                                                                         onClick={() => { handleInOutCreateNewOutBill("outpatient", plan.startDate) }}
    //                                                                                                     />
    //                                                                                                 </span>
    //                                                                                             </div> */}
    //                                           <div class="icon billings">
    //                                             <span class="tooltip">
    //                                               Add Bill
    //                                             </span>
    //                                             <span>
    //                                               <img
    //                                                 src="./uploads/icons8-billing-90.png"
    //                                                 alt=""
    //                                                 class="icon"
    //                                                 onClick={() => {
    //                                                   handleInOutCreateNewInBill(
    //                                                     "inpatient",
    //                                                     plan.startDate,
    //                                                     plan.endDate
    //                                                   );
    //                                                 }}
    //                                               />
    //                                             </span>
    //                                           </div>
    //                                         </div>
    //                                       )}

    //                                     {plan.patientType === "outpatient" &&
    //                                       !plan.isNewRow && (
    //                                         <div className="view-add-flexer-page-7">
    //                                           <div class="icon billings">
    //                                             {console.log("p[]aaatttyyyyeen type", plan.patientType)}
    //                                             <span class="tooltip">
    //                                               View Bill
    //                                             </span>
    //                                             <span>
    //                                               <img
    //                                                 src="./uploads/vision.png"
    //                                                 alt=""
    //                                                 class="icon"
    //                                                 onClick={() =>
    //                                                   handleViewBill(
    //                                                     index,
    //                                                     plan.patientType
    //                                                   )
    //                                                 }
    //                                               />
    //                                             </span>
    //                                           </div>
    //                                           <div class="icon billings">
    //                                             <span class="tooltip">
    //                                               Add Bill
    //                                             </span>
    //                                             <span>
    //                                               <img
    //                                                 src="./uploads/icons8-billing-90.png"
    //                                                 alt=""
    //                                                 class="icon"
    //                                                 onClick={() => {
    //                                                   handleInOutCreateNewOutBill(
    //                                                     "outpatient",
    //                                                     plan.startDate
    //                                                   );
    //                                                 }}
    //                                               />
    //                                             </span>
    //                                           </div>
    //                                           {/* <div class="icon billings">
    //                                                                                                 <span class="tooltip">Add Inpatient Bill</span>
    //                                                                                                 <span>
    //                                                                                                     <img src="./uploads/icons8-billing-90.png" alt="" class="icon"
    //                                                                                                         onClick={() => { handleInOutCreateNewInBill("outpatient", plan.startDate,plan.endDate) }}
    //                                                                                                     />
    //                                                                                                 </span>
    //                                                                                             </div> */}
    //                                         </div>
    //                                       )}
    //                                   </>
    //                                 )}
    //                                 {isEditing && plan.isNewRow && (nextRowPatientType === "outpatient" || nextRowPatientType === "inpatient") &&(
    //                                   <div>
    //                                     <div class="icon billings">
    //                                       <span class="tooltip">Add Bill</span>
    //                                       <span>
    //                                         <img
    //                                           src="./uploads/icons8-billing-90.png"
    //                                           alt=""
    //                                           class="icon"
    //                                           onClick={handleInOutCreateBill}
    //                                         />
    //                                       </span>
    //                                     </div>
    //                                   </div>
    //                                 )}
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </>
    //                 )}
    //               </>
    //             )}
    //           </div>
    //           <div>
    //             {patient && (
    //               <>
    //                 <div className="page-7-invest-add-discard-container">
    //                   <h2 class="ur-page3-right-container-tb1-title">
    //                     Investigation Treatment
    //                   </h2>
    //                   {isEditing && !addInvestRowPressed && (
    //                     <div
    //                       class="icon controls "
    //                       onClick={handleAddInvestRow}
    //                     >
    //                       <span class="tooltip">Add A Investigation</span>
    //                       <span>
    //                         <img
    //                           src="./uploads/multiply.png"
    //                           alt=""
    //                           class="icon plusIcon"
    //                         />
    //                       </span>
    //                     </div>
    //                   )}
    //                   {addInvestRowPressed && (
    //                     <div className="icons-flexer">
    //                       <div
    //                         class="icon controls"
    //                         onClick={handleInOutUpdateInvestigation}
    //                       >
    //                         <span class="tooltip">Save</span>
    //                         <span>
    //                           <img
    //                             src="./uploads/checked.png"
    //                             alt=""
    //                             class="icon"
    //                           />
    //                         </span>
    //                       </div>
    //                       <div
    //                         class="icon controls "
    //                         onClick={handleDeleteInvestRow}
    //                       >
    //                         <span class="tooltip">Discard</span>
    //                         <span>
    //                           <img
    //                             src="./uploads/multiply.png"
    //                             alt=""
    //                             class="icon multiIcon"
    //                           />
    //                         </span>
    //                       </div>
    //                     </div>
    //                   )}
    //                 </div>
    //                 {firstRow ? (
    //                   <div className="planed-treatment">
    //                     <table className="planned-treatment-table">
    //                       {console.log("firstrowinvets", patient.investigation)}
    //                       <thead>
    //                         <tr>
    //                           <th>Date</th>
    //                           <th>X-ray</th>
    //                           <th>MRI</th>
    //                           <th>Others</th>
    //                           <th>Provisional Diagnosis</th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         {patient.investigation.map((invest, index) => (
    //                           <tr key={index}>
    //                             <td>
    //                               <input
    //                                 type="date"
    //                                 name={`date_${index}`}
    //                                 value={invest.date}
    //                                 onChange={(e) =>
    //                                   handleInvestigationChange(
    //                                     index,
    //                                     "date",
    //                                     e.target.value
    //                                   )
    //                                 }
    //                               />
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="text"
    //                                 name="xray"
    //                                 value={invest.xray}
    //                                 onChange={handleInputChange}
    //                               ></input>
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="text"
    //                                 name="mri"
    //                                 value={invest.mri}
    //                                 onChange={handleInputChange}
    //                               ></input>
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="text"
    //                                 name="others"
    //                                 value={invest.others}
    //                                 onChange={handleInputChange}
    //                               ></input>
    //                             </td>
    //                             <td>
    //                               <input
    //                                 type="text"
    //                                 name="provisionalDiagnosis"
    //                                 value={invest.provisionalDiagnosis}
    //                                 onChange={handleInputChange}
    //                               ></input>
    //                             </td>
    //                           </tr>
    //                         ))}
    //                       </tbody>
    //                     </table>
    //                   </div>
    //                 ) : (
    //                   <>
    //                     <div className="planed-treatment">
    //                       <table className="investigation-treatment">
    //                         {console.log("newrowinvets", patient.investigation)}

    //                         <thead>
    //                           <tr>
    //                             <th>Date</th>
    //                             <th>X-ray</th>
    //                             <th>MRI</th>
    //                             <th>Others</th>
    //                             <th>Provisional Diagnosis</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {patient.investigation.map((invest, index) => (
    //                             <tr key={index}>
    //                               <td>
    //                                 <input
    //                                   type="date"
    //                                   value={invest.date}
    //                                   onChange={(e) =>
    //                                     handleInOutInvestigationChange(
    //                                       index,
    //                                       "date",
    //                                       e.target.value
    //                                     )
    //                                   }
    //                                   readOnly={!invest.isNewInvestRow} // Read-only for existing rows
    //                                 />
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="text"
    //                                   maxLength={50}
    //                                   name="xray"
    //                                   value={invest.xray}
    //                                   onChange={(e) =>
    //                                     handleInOutTextareaChange(
    //                                       "xray",
    //                                       e.target.value
    //                                     )
    //                                   }
    //                                   readOnly={!invest.isNewInvestRow} // Read-only for existing rows
    //                                 ></input>
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="text"
    //                                   maxLength={50}
    //                                   name="mri"
    //                                   value={invest.mri}
    //                                   onChange={(e) =>
    //                                     handleInOutTextareaChange(
    //                                       "mri",
    //                                       e.target.value
    //                                     )
    //                                   }
    //                                   readOnly={!invest.isNewInvestRow} // Read-only for existing rows
    //                                 ></input>
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="text"
    //                                   maxLength={50}
    //                                   name="others"
    //                                   value={invest.others}
    //                                   onChange={(e) =>
    //                                     handleInOutTextareaChange(
    //                                       "others",
    //                                       e.target.value
    //                                     )
    //                                   }
    //                                   readOnly={!invest.isNewInvestRow} // Read-only for existing rows
    //                                 ></input>
    //                               </td>
    //                               <td>
    //                                 <input
    //                                   type="text"
    //                                   maxLength={50}
    //                                   name="provisionalDiagnosis"
    //                                   value={invest.provisionalDiagnosis}
    //                                   onChange={(e) =>
    //                                     handleInOutTextareaChange(
    //                                       "provisionalDiagnosis",
    //                                       e.target.value
    //                                     )
    //                                   }
    //                                   readOnly={!invest.isNewInvestRow} // Read-only for existing rows
    //                                 ></input>
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </>
    //                 )}
    //               </>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {!page1 && founded  && (
    //       <button class="update-record-prev-btn" onClick={handlePrevious}>
    //         <img src="./uploads/r-arrow-prev.png" alt="" />
    //         Previous
    //       </button>
    //     )}
    //     {console.log("7 f c", page7, founded)}
    //     {!page7 && founded  && (
    //       <button class="update-record-next-btn" onClick={handleContinue}>
    //         Continue
    //         <img src="./uploads/r-arrow.png" alt="" />
    //       </button>
    //     )}
    //     {page7  && (
    //       <button class="update-record-next-btn" onClick={createPatientRecord}>
    //         Update Record
    //         <img src="./uploads/r-arrow.png" alt="" />
    //       </button>
    //     )}
    //   </div>

    //   <div>
    //     {createoverlayVisible && (
    //       <>
    //         {selectedPatientType === "outpatient" && (
    //           <div>
    //             <div className="overlay">
    //               <div className="overlay-content">
    //                 {console.log("newxtrowoverlay")}
    //                 <div class="out-patient-billing-container">
    //                   <div class="out-patient-billing-form-container">
    //                     <div class="out-patient-billing-row">
    //                       <div class="out-patient-billing-col">
    //                         <h3 class="out-patient-billing-title">
    //                           Out-Patient Billing
    //                         </h3>
    //                         {patient.name !== "" && (
    //                           <>
    //                             <p className="in-patient-billing-patient-details">
    //                               <span className="in-patient-billing-patient-name">
    //                                 {patient.name}-{patient.age}
    //                               </span>{" "}
    //                               <span className="in-patient-billing-patient-status">
    //                                 Out-Patient
    //                               </span>
    //                             </p>
    //                             {selectedRowStartDate && (
    //                               <div class="out-patient-billing-input-box">
    //                                 {console.log(
    //                                   "not new not bill date",
    //                                   newNextRow
    //                                 )}
    //                                 <span>Appointment Date</span>
    //                                 <input
    //                                   type="date"
    //                                   class="out-patient-billing-input"
    //                                   name="appointmentDate"
    //                                   value={selectedRowStartDate}
    //                                   readOnly
    //                                 />
    //                               </div>
    //                             )}
    //                             {!selectedRowStartDate && (
    //                               <div class="out-patient-billing-input-box">
    //                                 {console.log(
    //                                   "new not bill date",
    //                                   outPatientBillDetails.outBill[0]
    //                                     .appointmentDate
    //                                 )}
    //                                 <span>Appointment Date</span>
    //                                 <input
    //                                   type="date"
    //                                   class="out-patient-billing-input"
    //                                   name="appointmentDate"
    //                                   value={
    //                                     outPatientBillDetails.outBill[0]
    //                                       .appointmentDate
    //                                   }
    //                                   readOnly
    //                                 />
    //                               </div>
    //                             )}
    //                             <div class="out-patient-billing-flex">
    //                               <div class="out-patient-billing-input-box">
    //                                 <span>Service Name</span>
    //                                 <input
    //                                   placeholder="check-up"
    //                                   class="out-patient-billing-input"
    //                                   type="text"
    //                                   name="serviceName"
    //                                   value={
    //                                     outPatientBillDetails.outBill[0]
    //                                       .serviceName
    //                                   }
    //                                   onChange={handleIOOutPatientInputChange}
    //                                 />
    //                               </div>
    //                               <div class="in-patient-billing-inputBox">
    //                                 <span>Payment Option</span>
    //                                 <div class="in-patient-billing-dropdown">
    //                                   <div class="in-patient-billing-input-box">
    //                                     <ul class="in-patient-billing-nav">
    //                                       <li class="in-patient-billing-button-dropdown">
    //                                         <select
    //                                           class="in-patient-billing-dropdown-menu"
    //                                           name="paymentMode"
    //                                           value={
    //                                             outPatientBillDetails.outBill[0]
    //                                               .paymentMode
    //                                           }
    //                                           onChange={
    //                                             handleIOOutPatientInputChange
    //                                           }
    //                                         >
    //                                           <option
    //                                             class="in-patient-billing-dropdown-toggle"
    //                                             value=""
    //                                           >
    //                                             Select Payment Mode
    //                                           </option>
    //                                           <option
    //                                             class="dropdown-item"
    //                                             value="Cash"
    //                                           >
    //                                             Cash
    //                                           </option>
    //                                           <option
    //                                             class="dropdown-item"
    //                                             value="UPI"
    //                                           >
    //                                             UPI
    //                                           </option>
    //                                           <option
    //                                             class="dropdown-item"
    //                                             value="Credit Card"
    //                                           >
    //                                             Credit Card
    //                                           </option>
    //                                           <option
    //                                             class="dropdown-item"
    //                                             value="Debit Card"
    //                                           >
    //                                             Debit Card
    //                                           </option>
    //                                           <option
    //                                             class="dropdown-item"
    //                                             value="Net Banking"
    //                                           >
    //                                             Net Banking
    //                                           </option>
    //                                         </select>
    //                                       </li>
    //                                     </ul>
    //                                   </div>
    //                                 </div>
    //                               </div>

    //                               <div class="out-patient-billing-input-box">
    //                                 <span>Bill Amount</span>
    //                                 <input
    //                                   placeholder="0"
    //                                   class="out-patient-billing-input"
    //                                   type="text"
    //                                   name="billAmount"
    //                                   value={
    //                                     outPatientBillDetails.outBill[0]
    //                                       .billAmount
    //                                   }
    //                                   onChange={handleIOOutPatientInputChange}
    //                                 />
    //                               </div>
    //                             </div>
    //                           </>
    //                         )}
    //                       </div>
    //                     </div>
    //                     {patient.name !== "" && (
    //                       <>
    //                         <button
    //                           onClick={handleInOutUpdateOutBill}
    //                           disabled={loading}
    //                           class="out-patient-billing-submit-btn"
    //                         >
    //                           {loading
    //                             ? "Creating Bill..."
    //                             : "Create Out-Patient Bill"}
    //                         </button><br></br>
    //                         <button class="out-patient-billing-submit-btn" onClick={closeBill}>Close Bill</button>
    //                         {/* {appMessage && <div className="app-message">{appMessage}</div>} */}
    //                       </>
    //                     )}
    //                   </div>
    //                 </div>

    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {selectedPatientType === "inpatient" && (
    //           <div>
    //             <div className="overlay">
    //               {console.log("hhhhhhhhhhhttttttttttttttrrrr")}
    //               {console.log("selectedRowStartDate", selectedRowStartDate)}
    //               {console.log("selectedRowEndDate", selectedRowEndDate)}
    //               {/* {console.log("selectedRowEndDate", selectedRowEndDate-selectedRowStartDate)} */}
    //               <div className="overlay-content">
    //                 {console.log("newxtrowoverlay")}
    //                 <div className="in-patient-billing-container">
    //                   <div className="form-in-patient-billing-container">
    //                     <div className="in-patient-billing-row">
    //                       <div className="in-patient-billing-col">
    //                         <h3 className="in-patient-billing-title">
    //                           Billing Details
    //                         </h3>
    //                         {patient.name !== "" && (
    //                           <>
    //                             <p className="in-patient-billing-patient-details">
    //                               <span className="in-patient-billing-patient-name">
    //                                 {patient.name}-{patient.age}
    //                               </span>{" "}
    //                               <span className="in-patient-billing-patient-status">
    //                                 In-Patient
    //                               </span>
    //                             </p>
    //                             <div className="in-patient-billing-inputBox">
    //                               <span>Room Number</span>
    //                               <input
    //                                 type="text"
    //                                 placeholder="21"
    //                                 className="input"
    //                                 name="roomNumber"
    //                                 value={patient.roomNumber}
    //                                 onChange={handleIOInPatientInputChange}
    //                               />
    //                             </div>
    //                             {selectedRowStartDate && selectedRowEndDate && (
    //                               <>
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Admission Date</span>
    //                                   <input
    //                                     type="date"
    //                                     className="input"
    //                                     name="admissionDate"
    //                                     value={selectedRowStartDate}
    //                                     readOnly
    //                                   />
    //                                 </div>
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Discharge Date</span>
    //                                   <input
    //                                     type="date"
    //                                     className="input"
    //                                     name="dischargeDate"
    //                                     value={selectedRowEndDate}
    //                                     readOnly
    //                                   />
    //                                 </div>
    //                                 <div className="flex">
    //                                   <div className="in-patient-billing-inputBox">
    //                                     <span>Total Days</span>
    //                                     <input
    //                                       type="text"
    //                                       placeholder="35"
    //                                       className="input"
    //                                       name="totalDays"
    //                                       value={selectedRowTotVal}
    //                                       readOnly
    //                                     />
    //                                   </div>
    //                                 </div>
    //                               </>
    //                             )}
    //                             {!selectedRowStartDate &&
    //                               !selectedRowEndDate && (
    //                                 <>
    //                                   <div className="in-patient-billing-inputBox">
    //                                     <span>Admission Date</span>
    //                                     <input
    //                                       type="date"
    //                                       className="input"
    //                                       name="admissionDate"
    //                                       value={
    //                                         inPatientBillDetails.inBill[0]
    //                                           .admissionDate
    //                                       }
    //                                       readOnly
    //                                     />
    //                                   </div>
    //                                   <div className="in-patient-billing-inputBox">
    //                                     <span>Discharge Date</span>
    //                                     <input
    //                                       type="date"
    //                                       className="input"
    //                                       name="dischargeDate"
    //                                       value={
    //                                         inPatientBillDetails.inBill[0]
    //                                           .dischargeDate
    //                                       }
    //                                       readOnly
    //                                     />
    //                                   </div>
    //                                   <div className="flex">
    //                                     <div className="in-patient-billing-inputBox">
    //                                       <span>Total Days</span>
    //                                       <input
    //                                         type="text"
    //                                         placeholder="35"
    //                                         className="input"
    //                                         name="totalDays"
    //                                         value={
    //                                           inPatientBillDetails.inBill[0]
    //                                             .totalDays
    //                                         }
    //                                         onChange={
    //                                           handleIOInPatientInputChange
    //                                         }
    //                                         readOnly
    //                                       />
    //                                     </div>
    //                                   </div>
    //                                 </>
    //                               )}
    //                           </>
    //                         )}
    //                       </div>
    //                       {patient.name !== "" && (
    //                         <>
    //                           <div className="in-patient-billing-col">
    //                             <h3 className="in-patient-billing-title">
    //                               Amount Details
    //                             </h3>
    //                             <div className="in-patient-billing-inputBox">
    //                               <span>Payment Option</span>
    //                               <div className="in-patient-billing-dropdown">
    //                                 <div className="in-patient-billing-input-box">
    //                                   <ul className="in-patient-billing-nav">
    //                                     <li className="in-patient-billing-button-dropdown">
    //                                       <select
    //                                         className="in-patient-billing-dropdown-menu"
    //                                         name="paymentMode"
    //                                         value={patient.paymentMode}
    //                                         onChange={
    //                                           handleIOInPatientInputChange
    //                                         }
    //                                       >
    //                                         <option
    //                                           className="in-patient-billing-dropdown-toggle"
    //                                           value=""
    //                                         >
    //                                           Select Payment Mode
    //                                         </option>
    //                                         <option
    //                                           className="dropdown-item"
    //                                           value="Cash"
    //                                         >
    //                                           Cash
    //                                         </option>
    //                                         <option
    //                                           className="dropdown-item"
    //                                           value="UPI"
    //                                         >
    //                                           UPI
    //                                         </option>
    //                                         <option
    //                                           className="dropdown-item"
    //                                           value="Credit Card"
    //                                         >
    //                                           Credit Card
    //                                         </option>
    //                                         <option
    //                                           className="dropdown-item"
    //                                           value="Debit Card"
    //                                         >
    //                                           Debit Card
    //                                         </option>
    //                                         <option
    //                                           className="dropdown-item"
    //                                           value="Net Banking"
    //                                         >
    //                                           Net Banking
    //                                         </option>
    //                                       </select>
    //                                     </li>
    //                                   </ul>
    //                                 </div>
    //                               </div>
    //                             </div>
    //                             <div className="in-patient-billing-flex-in-billing">
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Visiting Bill</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="250"
    //                                   className="input"
    //                                   name="visitingBill"
    //                                   value={
    //                                     inPatientBillDetails.inBill[0]
    //                                       .visitingBill
    //                                   }
    //                                   onChange={handleIOInPatientInputChange}
    //                                 />
    //                               </div>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Physio Bill</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="25"
    //                                   className="input"
    //                                   name="physioBill"
    //                                   value={
    //                                     inPatientBillDetails.inBill[0]
    //                                       .physioBill
    //                                   }
    //                                   onChange={handleIOInPatientInputChange}
    //                                 />
    //                               </div>
    //                             </div>
    //                             <div className="in-patient-billing-flex-in-billing">
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Nursing Bill</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="250"
    //                                   className="input"
    //                                   name="nursingBill"
    //                                   value={
    //                                     inPatientBillDetails.inBill[0]
    //                                       .nursingBill
    //                                   }
    //                                   onChange={handleIOInPatientInputChange}
    //                                 />
    //                               </div>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Other Expenses</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="20"
    //                                   className="input"
    //                                   name="otherExpenses"
    //                                   value={
    //                                     inPatientBillDetails.inBill[0]
    //                                       .otherExpenses
    //                                   }
    //                                   onChange={handleIOInPatientInputChange}
    //                                 />
    //                               </div>
    //                             </div>
    //                             <div className="in-patient-billing-inputBox">
    //                               <span>Amount Per Day</span>
    //                               <input
    //                                 type="text"
    //                                 placeholder="1234"
    //                                 className="input"
    //                                 name="amountPerDay"
    //                                 value={
    //                                   inPatientBillDetails.inBill[0]
    //                                     .amountPerDay
    //                                 }
    //                                 readOnly
    //                               />
    //                             </div>
    //                             <div className="in-patient-billing-total-amount-check">
    //                               <h2>Total Amount</h2>
    //                               <div
    //                                 className="in-patient-billing-total-amount-display"
    //                                 name="billAmount"
    //                                 value={
    //                                   inPatientBillDetails.inBill[0].billAmount
    //                                 }
    //                                 readOnly
    //                               >
    //                                 <h4>
    //                                   {
    //                                     inPatientBillDetails.inBill[0]
    //                                       .billAmount
    //                                   }
    //                                   &#8377;
    //                                 </h4>
    //                               </div>
    //                             </div>
    //                           </div>
    //                         </>
    //                       )}
    //                     </div>
    //                     {patient.name !== "" && (
    //                       <>
    //                         <button
    //                           className="in-patient-billing-submit-btn"
    //                           onClick={handleInOutUpdateInBill}
    //                           disabled={loading}
    //                         >
    //                           {loading ? "Creating Bill..." : "Confirm"}
    //                         </button>
    //                         <button className="in-patient-billing-submit-btn" onClick={closeBill}>Close Bill</button>
    //                       </>
    //                     )}
    //                   </div>

    //                   {appMessage && (
    //                     <div className="app-message">{appMessage}</div>
    //                   )}
    //                 </div>

    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </>
    //     )}
    //     {createFreshOverlayVisible && (
    //       <>
    //         {patient.planTreatment[0].patientType === "outpatient" &&
    //           patient.planTreatment.length == 1 &&
    //           !patient.planTreatment.isNewRow && (
    //             <div>
    //               {console.log("eeeeeeeppppppp")}
    //               <div className="overlay">
    //                 <div className="overlay-content">
    //                   {console.log("patienttype overlay")}
    //                   {console.log("newxtrowoverlay")}
    //                   <div class="out-patient-billing-container">
    //                     <div class="out-patient-billing-form-container">
    //                       <div class="out-patient-billing-row">
    //                         <div class="out-patient-billing-col">
    //                           <h3 class="out-patient-billing-title">
    //                             Out-Patient Billing
    //                           </h3>
    //                           {patient.name !== "" && (
    //                             <>
    //                               <p className="in-patient-billing-patient-details">
    //                                 <span className="in-patient-billing-patient-name">
    //                                   {patient.name}-{patient.age}
    //                                 </span>{" "}
    //                                 <span className="in-patient-billing-patient-status">
    //                                   Out-Patient
    //                                 </span>
    //                               </p>
    //                               <div class="out-patient-billing-input-box">
    //                                 <span>Appointment Date</span>
    //                                 <input
    //                                   type="date"
    //                                   class="out-patient-billing-input"
    //                                   name="appointmentDate"
    //                                   value={
    //                                     patient.outPatientBill[0]
    //                                       .appointmentDate
    //                                   }
    //                                   readOnly
    //                                 />
    //                               </div>
    //                               <div class="out-patient-billing-flex">
    //                                 <div class="out-patient-billing-input-box">
    //                                   <span>Service Name</span>
    //                                   <input
    //                                     placeholder="check-up"
    //                                     class="out-patient-billing-input"
    //                                     type="text"
    //                                     name="serviceName"
    //                                     value={
    //                                       patient.outPatientBill[0].serviceName
    //                                     }
    //                                     onChange={handleOutPatientInputChange}
    //                                   />
    //                                 </div>
    //                                 <div class="in-patient-billing-inputBox">
    //                                   <span>Payment Option</span>
    //                                   <div class="in-patient-billing-dropdown">
    //                                     <div class="in-patient-billing-input-box">
    //                                       <ul class="in-patient-billing-nav">
    //                                         <li class="in-patient-billing-button-dropdown">
    //                                           <select
    //                                             class="in-patient-billing-dropdown-menu"
    //                                             name="paymentMode"
    //                                             value={
    //                                               patient.outPatientBill[0]
    //                                                 .paymentMode
    //                                             }
    //                                             onChange={
    //                                               handleOutPatientInputChange
    //                                             }
    //                                           >
    //                                             <option
    //                                               class="in-patient-billing-dropdown-toggle"
    //                                               value=""
    //                                             >
    //                                               Select Payment Mode
    //                                             </option>
    //                                             <option
    //                                               class="dropdown-item"
    //                                               value="Cash"
    //                                             >
    //                                               Cash
    //                                             </option>
    //                                             <option
    //                                               class="dropdown-item"
    //                                               value="UPI"
    //                                             >
    //                                               UPI
    //                                             </option>
    //                                             <option
    //                                               class="dropdown-item"
    //                                               value="Credit Card"
    //                                             >
    //                                               Credit Card
    //                                             </option>
    //                                             <option
    //                                               class="dropdown-item"
    //                                               value="Debit Card"
    //                                             >
    //                                               Debit Card
    //                                             </option>
    //                                             <option
    //                                               class="dropdown-item"
    //                                               value="Net Banking"
    //                                             >
    //                                               Net Banking
    //                                             </option>
    //                                           </select>
    //                                         </li>
    //                                       </ul>
    //                                     </div>
    //                                   </div>
    //                                 </div>

    //                                 <div class="out-patient-billing-input-box">
    //                                   <span>Bill Amount</span>
    //                                   <input
    //                                     placeholder="0"
    //                                     class="out-patient-billing-input"
    //                                     type="text"
    //                                     name="billAmount"
    //                                     value={
    //                                       patient.outPatientBill[0].billAmount
    //                                     }
    //                                     onChange={handleOutPatientInputChange}
    //                                   />
    //                                 </div>
    //                               </div>
    //                             </>
    //                           )}
    //                         </div>
    //                       </div>
    //                       {patient.name !== "" && (
    //                         <>
    //                           <br />
    //                           <button
    //                             onClick={confirmFreshBill}
    //                             disabled={loading}
    //                             class="out-patient-billing-submit-btn"
    //                           >
    //                             {loading
    //                               ? "Creating Bill..."
    //                               : "Create Out-Patient Bill"}
    //                           </button><br></br>

    //                           <button class="out-patient-billing-submit-btn" onClick={closeBill}>Discard</button>
    //                           {/* Display Application Messages */}
    //                           {appMessage && (
    //                             <div className="app-message">{appMessage}</div>
    //                           )}
    //                         </>
    //                       )}
    //                     </div>
    //                   </div>

    //                 </div>
    //               </div>
    //             </div>
    //           )}

    //         {patient.planTreatment[0].patientType === "inpatient" &&
    //           patient.planTreatment.length == 1 &&
    //           !patient.planTreatment[0].isNewRow && (
    //             <div>
    //               {console.log("patienttype overlay")}
    //               <div className="overlay">
    //                 <div className="overlay-content">
    //                   <div className="in-patient-billing-container">
    //                     <div className="form-in-patient-billing-container">
    //                       <div className="in-patient-billing-row">
    //                         <div className="in-patient-billing-col">
    //                           <h3 className="in-patient-billing-title">
    //                             Billing Details
    //                           </h3>
    //                           {patient.name !== "" && (
    //                             <>
    //                               <p className="in-patient-billing-patient-details">
    //                                 <span className="in-patient-billing-patient-name">
    //                                   {patient.name}-{patient.age}
    //                                 </span>{" "}
    //                                 <span className="in-patient-billing-patient-status">
    //                                   In-Patient
    //                                 </span>
    //                               </p>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Room Number</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="21"
    //                                   className="input"
    //                                   name="roomNumber"
    //                                   value={
    //                                     patient.inPatientBill[0].roomNumber
    //                                   }
    //                                   onChange={handleInPatientInputChange}
    //                                 />
    //                               </div>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Admission Date</span>
    //                                 <input
    //                                   type="date"
    //                                   className="input"
    //                                   name="admissionDate"
    //                                   value={
    //                                     patient.inPatientBill[0].admissionDate
    //                                   }
    //                                   readOnly
    //                                 />
    //                               </div>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Discharge Date</span>
    //                                 <input
    //                                   type="date"
    //                                   className="input"
    //                                   name="dischargeDate"
    //                                   value={
    //                                     patient.inPatientBill[0].dischargeDate
    //                                   }
    //                                   readOnly
    //                                 />
    //                               </div>
    //                               <div className="flex">
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Total Days</span>
    //                                   <input
    //                                     type="text"
    //                                     placeholder="35"
    //                                     className="input"
    //                                     name="totalDays"
    //                                     value={
    //                                       patient.inPatientBill[0].totalDays
    //                                     }
    //                                     onChange={handleIOInPatientInputChange}
    //                                     readOnly
    //                                   />
    //                                 </div>
    //                               </div>
    //                             </>
    //                           )}
    //                         </div>
    //                         {patient.name !== "" && (
    //                           <>
    //                             <div className="in-patient-billing-col">
    //                               <h3 className="in-patient-billing-title">
    //                                 Amount Details
    //                               </h3>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Payment Option</span>
    //                                 <div className="in-patient-billing-dropdown">
    //                                   <div className="in-patient-billing-input-box">
    //                                     <ul className="in-patient-billing-nav">
    //                                       <li className="in-patient-billing-button-dropdown">
    //                                         <select
    //                                           className="in-patient-billing-dropdown-menu"
    //                                           name="paymentMode"
    //                                           value={
    //                                             patient.inPatientBill[0]
    //                                               .paymentMode
    //                                           }
    //                                           onChange={
    //                                             handleInPatientInputChange
    //                                           }
    //                                         >
    //                                           <option
    //                                             className="in-patient-billing-dropdown-toggle"
    //                                             value=""
    //                                           >
    //                                             Select Payment Mode
    //                                           </option>
    //                                           <option
    //                                             className="dropdown-item"
    //                                             value="Cash"
    //                                           >
    //                                             Cash
    //                                           </option>
    //                                           <option
    //                                             className="dropdown-item"
    //                                             value="UPI"
    //                                           >
    //                                             UPI
    //                                           </option>
    //                                           <option
    //                                             className="dropdown-item"
    //                                             value="Credit Card"
    //                                           >
    //                                             Credit Card
    //                                           </option>
    //                                           <option
    //                                             className="dropdown-item"
    //                                             value="Debit Card"
    //                                           >
    //                                             Debit Card
    //                                           </option>
    //                                           <option
    //                                             className="dropdown-item"
    //                                             value="Net Banking"
    //                                           >
    //                                             Net Banking
    //                                           </option>
    //                                         </select>
    //                                       </li>
    //                                     </ul>
    //                                   </div>
    //                                 </div>
    //                               </div>
    //                               <div className="in-patient-billing-flex-in-billing">
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Visiting Bill</span>
    //                                   <input
    //                                     type="text"
    //                                     name="visitingBill"
    //                                     className="input"
    //                                     value={
    //                                       patient.inPatientBill[0].visitingBill
    //                                     }
    //                                     onChange={handleInPatientInputChange}
    //                                   />
    //                                 </div>
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Physio Bill</span>
    //                                   <input
    //                                     type="text"
    //                                     name="physioBill"
    //                                     className="input"
    //                                     value={
    //                                       patient.inPatientBill[0].physioBill
    //                                     }
    //                                     onChange={handleInPatientInputChange}
    //                                   />
    //                                 </div>
    //                               </div>
    //                               <div className="in-patient-billing-flex-in-billing">
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Nursing Bill</span>
    //                                   <input
    //                                     type="text"
    //                                     name="nursingBill"
    //                                     className="input"
    //                                     value={
    //                                       patient.inPatientBill[0].nursingBill
    //                                     }
    //                                     onChange={handleInPatientInputChange}
    //                                   />
    //                                 </div>
    //                                 <div className="in-patient-billing-inputBox">
    //                                   <span>Other Expenses</span>
    //                                   <input
    //                                     type="text"
    //                                     name="otherExpenses"
    //                                     className="input"
    //                                     value={
    //                                       patient.inPatientBill[0].otherExpenses
    //                                     }
    //                                     onChange={handleInPatientInputChange}
    //                                   />
    //                                 </div>
    //                               </div>
    //                               <div className="in-patient-billing-inputBox">
    //                                 <span>Amount Per Day</span>
    //                                 <input
    //                                   type="text"
    //                                   placeholder="1234"
    //                                   className="input"
    //                                   name="amountPerDay"
    //                                   value={
    //                                     patient.inPatientBill[0].amountPerDay
    //                                   }
    //                                   readOnly
    //                                 />
    //                               </div>
    //                               <div className="in-patient-billing-total-amount-check">
    //                                 <h2>Total Amount</h2>
    //                                 <div
    //                                   className="in-patient-billing-total-amount-display"
    //                                   name="billAmount"
    //                                   value={
    //                                     patient.inPatientBill[0].billAmount
    //                                   }
    //                                   readOnly
    //                                 >
    //                                   <h4>
    //                                     {patient.inPatientBill[0].billAmount}
    //                                     &#8377;
    //                                   </h4>
    //                                 </div>
    //                               </div>
    //                             </div>
    //                           </>
    //                         )}
    //                       </div>
    //                       {patient.name !== "" && (
    //                         <>

    //                           <button
    //                             className="in-patient-billing-submit-btn"
    //                             onClick={confirmFreshBill}
    //                             disabled={loading}
    //                           >
    //                             {loading ? "Creating Bill..." : "Confirm"}
    //                           </button>

    //                           <button className="in-patient-billing-submit-btn" onClick={closeBill}>Discard</button>

    //                         </>
    //                       )}
    //                     </div>

    //                     {appMessage && (
    //                       <div className="app-message">{appMessage}</div>
    //                     )}
    //                   </div>

    //                   {currentRowPatientType && (
    //                     <button onClick={handleInOutUpdateInBill}>
    //                       Update In Bill
    //                     </button>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //       </>
    //     )}
    //     {viewoverlayVisible && (
    //       <div className="overlay">
    //         <div className="overlay-content">
    //           {viewoverlayContent}
    //           <button onClick={closeOverlay}>Close</button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>

    <>
        !isMobile ? ( 
      <>
        <div ref={printRef} className="print-overlay">
          <div class="overlay-container-print" id="overlay-container">
            <div className="print-buttons">
              <div className="king-tooltip">
                <a className="print-button-close" onClick={handlePrintClose}>
                  <img src="./uploads/left-arrow.png" />
                  <span class="print-overlay-goback-tooltiptext">Go Back</span>
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
                      <span class="patient-height">{patient.height}cm </span>
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

                <div class="basic-assessment">
                  <div className="pain-section-heading">
                    <h1>Pain Section</h1>
                  </div>
                  <div class="vital-complaint-heading">
                    <h2 class="update-record-checkbox-title">Vital Sign</h2>
                    <h2 class="update-record-checkbox-title">Complaint</h2>
                  </div>

                  <div class="update-record-checkbox-container-print">
                    <div class="update-record-checkbox">
                      <div class="vital-sign-and-other-details-container-row">
                        <div class="vital-sign-and-other-details-container-col">
                          <div class="vital-sign-bp">
                            BP :{" "}
                            <span class="vital-sign-bp-patient">
                              {patient.vitalSign.BP}
                            </span>
                          </div>
                          <div class="vital-sign-rr">
                            RR :{" "}
                            <span class="vital-sign-rr-patient">
                              {patient.vitalSign.RR}
                            </span>
                          </div>
                          <div class="vital-sign-hr">
                            HR :{" "}
                            <span class="vital-sign-hr-patient">
                              {patient.vitalSign.HR}
                            </span>
                          </div>
                        </div>
                        <div class="vital-sign-and-other-details-container-col">
                          <div class="vital-sign-spo2">
                            SPO2 :{" "}
                            <span class="vital-sign-spo2-patient">
                              {patient.vitalSign.SPO2}
                            </span>
                          </div>
                          <div class="vital-sign-temperature">
                            Temperature :{" "}
                            <span class="vital-sign-hr-patient">
                              {patient.vitalSign.TEMP}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h2 class="update-record-checkbox-title">
                        Post Medical History
                      </h2>
                      <div class="pre-his">
                        <div class="update-record-checkbox-col1">
                          {Object.keys(patient.postMedicalHistory)
                            .slice(0, 4)
                            .map((area) => (
                              <div
                                key={area}
                                class="update-record-checkbox-wrapper"
                              >
                                <input
                                  type="checkbox"
                                  id={area}
                                  class="update-record-inp-cbx"
                                  checked={patient.postMedicalHistory[area]}
                                  disabled
                                  onChange={() =>
                                    handlePostMedicalHistoryCheckboxChange(area)
                                  }
                                />
                                <label htmlFor={area} class="update-record-cbx">
                                  <span>&nbsp;{area.toUpperCase()}</span>
                                </label>
                              </div>
                            ))}
                        </div>

                        <div class="update-record-checkbox-col1">
                          {Object.keys(patient.postMedicalHistory)
                            .slice(4)
                            .map((area) => (
                              <div
                                key={area}
                                class="update-record-checkbox-wrapper"
                              >
                                <input
                                  type="checkbox"
                                  id={area}
                                  class="update-record-inp-cbx"
                                  checked={patient.postMedicalHistory[area]}
                                  disabled
                                  onChange={() =>
                                    handlePostMedicalHistoryCheckboxChange(area)
                                  }
                                />
                                <label htmlFor={area} class="update-record-cbx">
                                  <span>
                                    &nbsp;
                                    {area === "surgicalHistory"
                                      ? "SURGICAL HISTORY"
                                      : area.toUpperCase()}
                                  </span>
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div class="update-record-checkbox update-record-pain-region">
                      <div class="vital-sign-and-other-details-container-row">
                        <div class="vital-sign-and-other-details-container-col">
                          <div class="complaint-basic-assessment">
                            complaint :
                            <span class="complaint-basic-assessment-value">
                              {manualEntry
                                ? patient.complaints
                                : patient.complaints === "other"
                                ? "Enter manually"
                                : patient.complaints}
                            </span>
                          </div>
                          <div class="onset-basic-assessment">
                            Onset :{" "}
                            <span class="onset-basic-assessment-value">
                              {patient.onset}
                            </span>
                          </div>
                          <div class="duration-basic-assessment">
                            duration :{" "}
                            <span class="duration-basic-assessment-value">
                              {patient.duration}
                            </span>
                          </div>
                        </div>
                        <div class="vital-sign-and-other-details-container-col">
                          <div class="aggrigate-value-basic-assessment">
                            Aggrivating Factor :{" "}
                            <span class="aggrigate-value-basic-assessment-value">
                              {patient.aggFactor}
                            </span>
                          </div>
                          <div class="releaf-value-basic-assessment">
                            Relieving Factor :{" "}
                            <span class="releaf-value-basic-assessment-value">
                              {patient.relFactor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h2 class="update-record-checkbox-title">Pain Over</h2>
                      <div class="update-record-row update-record-pain-region-content">
                        <div class="update-record-col">
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="Neck"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Neck}
                              disabled
                              onChange={() => handleCheckboxChange("Neck")}
                            />
                            <label for="Neck" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;Neck</span>
                            </label>
                          </div>
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="
                        Wrist"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Wrist}
                              disabled
                              onChange={() => handleCheckboxChange("Wrist")}
                            />
                            <label
                              for="
                        Wrist"
                              class="update-record-cbx"
                            >
                              <span> </span>

                              <span>&nbsp;Wrist</span>
                            </label>
                          </div>
                        </div>
                        <div class="update-record-col">
                          {/* <div class="update-record-checkbox-wrapper">
                              <input
                                type="checkbox"
                                id="
                        LowerBack"
                                class="update-record-inp-cbx"
                              />
                              <label
                                for="
                        LowerBack"
                                class="update-record-cbx"
                                checked={patient.painRegion.LowerBack}
                                disabled
                              >
                                <span> </span>

                                <span>&nbsp;LowerBack</span>
                              </label>
                            </div> */}
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="LowerBack"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.LowerBack}
                              disabled
                              onChange={() => handleCheckboxChange("LowerBack")}
                            />
                            <label for="LowerBack" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;LowerBack</span>
                            </label>
                          </div>
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="Ankle"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Ankle}
                              disabled
                              onChange={() => handleCheckboxChange("Ankle")}
                            />
                            <label for="Ankle" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;Ankle</span>
                            </label>
                          </div>
                        </div>
                        <div class="update-record-col">
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="Shoulder"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Shoulder}
                              disabled
                              onChange={() => handleCheckboxChange("Shoulder")}
                            />
                            <label for="Shoulder" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;Shoulder</span>
                            </label>
                          </div>

                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="Elbow"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Elbow}
                              disabled
                              onChange={() => handleCheckboxChange("Elbow")}
                            />
                            <label for="Elbow" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;Elbow</span>
                            </label>
                          </div>
                        </div>
                        <div class="update-record-col">
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="UpperBack"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.UpperBack}
                              disabled
                              onChange={() => handleCheckboxChange("UpperBack")}
                            />
                            <label for="UpperBack" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;UpperBack</span>
                            </label>
                          </div>
                          <div class="update-record-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id="Knee"
                              class="update-record-inp-cbx"
                              checked={patient.painRegion.Knee}
                              disabled
                              onChange={() => handleCheckboxChange("Knee")}
                            />
                            <label for="Knee" class="update-record-cbx">
                              <span> </span>

                              <span>&nbsp;Knee</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="wrap-1">
                        <div class="radiates">
                          <h2 class="update-record-checkbox-title radiates-title">
                            Radiates Through
                          </h2>
                          <div class="update-record-row-update-record-radiates-content">
                            <div class="update-record-col">
                              <div class="update-record-checkbox-wrapper">
                                <input
                                  type="checkbox"
                                  id="arms"
                                  class="update-record-inp-cbx"
                                  checked={patient.radiatesThrough.Arms}
                                  disabled
                                  onChange={() =>
                                    handleThroughCheckboxChange("Arms")
                                  }
                                />
                                <label for="arms" class="update-record-cbx">
                                  <span> </span>

                                  <span>&nbsp;arms</span>
                                </label>
                              </div>
                            </div>
                            <div class="update-record-col">
                              <div class="update-record-checkbox-wrapper">
                                <input
                                  type="checkbox"
                                  id="
                        legs-to-knees"
                                  class="update-record-inp-cbx"
                                  checked={patient.radiatesThrough.LegsToKnee}
                                  disabled
                                  onChange={() =>
                                    handleThroughCheckboxChange("LegsToKnee")
                                  }
                                />
                                <label
                                  for="
                        legs-to-knees"
                                  class="update-record-cbx"
                                >
                                  <span> </span>

                                  <span>&nbsp;legs to knees</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="feel-like">
                          <h2 class="update-record-checkbox-title">
                            Feels Like
                          </h2>
                          <div class="update-record-row-update-record-feel-like-content">
                            <div class="feel-like-content-row">
                              <div class="update-record-col">
                                <div class="update-record-checkbox-wrapper">
                                  <input
                                    type="checkbox"
                                    id="numbness"
                                    class="update-record-inp-cbx"
                                    checked={patient.feelsLike.Numbness}
                                    disabled
                                    onChange={() =>
                                      handleFeelsLikeCheckboxChange("Numbness")
                                    }
                                  />
                                  <label
                                    for="numbness"
                                    class="update-record-cbx"
                                  >
                                    <span> </span>

                                    <span>&nbsp;Numbness</span>
                                  </label>
                                </div>
                              </div>
                              <div class="update-record-col">
                                <div class="update-record-checkbox-wrapper">
                                  <input
                                    type="checkbox"
                                    id="tingling"
                                    class="update-record-inp-cbx"
                                    checked={patient.feelsLike.Tingling}
                                    disabled
                                    onChange={() =>
                                      handleFeelsLikeCheckboxChange("Tingling")
                                    }
                                  />
                                  <label
                                    for="tingling"
                                    class="update-record-cbx"
                                  >
                                    <span> </span>

                                    <span>&nbsp;Tingling</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="feel-like-content-row">
                              <div class="update-record-col">
                                <div class="update-record-checkbox-wrapper">
                                  <input
                                    type="checkbox"
                                    id="weak-grip"
                                    class="update-record-inp-cbx"
                                    checked={patient.feelsLike.WeakGrip}
                                    disabled
                                    onChange={() =>
                                      handleFeelsLikeCheckboxChange("WeakGrip")
                                    }
                                  />
                                  <label
                                    for="weak-grip"
                                    class="update-record-cbx"
                                  >
                                    <span> </span>

                                    <span>&nbsp;weak grip</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="update-record-pain-level-print">
                  <div class="pain-level-title">Pain Level</div>
                  <form>
                    <div class="print-range-value-container">
                      <input
                        type="range"
                        name="painLevel"
                        min="0"
                        max="10"
                        value={patient.painAssessment.beforeTreatment.level}
                        step="1"
                        onchange={handlePainLevelChange}
                        disabled
                      />
                      <div class="scale">
                        <div class="scale-value" style={{ "--value": 0 }}>
                          <p>0</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-0.png"
                            alt="Pain Level 0"
                          />
                          <p>no pain</p>
                        </div>
                        <div class="scale-value" style={{ "--value": 1 }}>
                          1
                        </div>
                        <div class="scale-value" style={{ "--value": 2 }}>
                          <p>2</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-2.png"
                            alt="Pain Level 2"
                          />
                          <p>mild</p>
                        </div>
                        <div class="scale-value" style={{ "--value": 3 }}>
                          3
                        </div>
                        <div class="scale-value" style={{ "--value": 4 }}>
                          <p>4</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-4.png"
                            alt="Pain Level 4"
                          />
                          <p>moderate</p>
                        </div>
                        <div class="scale-value" style={{ "--value": 5 }}>
                          5
                        </div>
                        <div class="scale-value" style={{ "--value": 6 }}>
                          <p>6</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-6.png"
                            alt="Pain Level 6"
                          />
                          <p>severe</p>
                        </div>
                        <div class="scale-value" style={{ "--value": 7 }}>
                          7
                        </div>
                        <div class="scale-value" style={{ "--value": 8 }}>
                          <p>8</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-8.png"
                            alt="Pain Level 8"
                          />
                          <p>very severe</p>
                        </div>
                        <div class="scale-value" style={{ "--value": 9 }}>
                          9
                        </div>
                        <div class="scale-value" style={{ "--value": 10 }}>
                          <p>10</p>
                          <img
                            class="scale-value-img"
                            src="./uploads/pain-level-10.png"
                            alt="Pain Level 10"
                          />
                          <p>worst pain</p>
                        </div>
                      </div>
                    </div>
                    <div id="result"></div>
                  </form>
                </div>
                <div class="patient-diagnosis-headiing">
                  <h2>On Observation</h2>
                  <h2>On palpation</h2>
                </div>
                <div class="patient-diagnosis">
                  <table class="observation-table-print">
                    <thead>
                      <tr>
                        <th class="observation-column"></th>
                        <th class="observation-normal-column">Nor</th>
                        <th class="observation-abnormal-column">Abnor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onObservation.map((item) => (
                        <tr key={item.label}>
                          <td>{item.label}</td>
                          <td>
                            <input
                              type="radio"
                              id={item.name + "1"}
                              name={item.name}
                              className="ur-page2-inp-cbx"
                              checked={
                                patient.observation &&
                                patient.observation.onObservation &&
                                patient.observation.onObservation[item.name]
                                  ? patient.observation.onObservation[item.name]
                                      .normal
                                  : false
                              }
                              disabled
                              onChange={() =>
                                handleObservationCheckboxChange(
                                  item.name,
                                  "normal"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="radio"
                              id={item.name + "2"}
                              name={item.name}
                              className="ur-page2-inp-cbx"
                              checked={
                                patient.observation &&
                                patient.observation.onObservation &&
                                patient.observation.onObservation[item.name]
                                  ? patient.observation.onObservation[item.name]
                                      .abnormal
                                  : false
                              }
                              disabled
                              onChange={() =>
                                handleObservationCheckboxChange(
                                  item.name,
                                  "abnormal"
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table class="on-palpation-table-print">
                    <thead>
                      <tr>
                        <th class="on-palpation-column"></th>
                        <th class="on-palpation-normal-column">Nor</th>
                        <th class="on-palpation-abnormal-column">Abnor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onPalpation.map((item) => (
                        <tr
                          key={item.label}
                          className="on-palpation-table-trow-print"
                        >
                          <td>{item.label}</td>
                          <td>
                            <input
                              type="radio"
                              id={item.name + "1"}
                              name={item.name}
                              className="ur-page2-inp-cbx"
                              checked={
                                patient.observation &&
                                patient.observation.onPalpation &&
                                patient.observation.onPalpation[item.name]
                                  ? patient.observation.onPalpation[item.name]
                                      .normal
                                  : false
                              }
                              disabled
                              onChange={() =>
                                handlePalpationCheckboxChange(
                                  item.name,
                                  "normal"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="radio"
                              id={item.name + "2"}
                              name={item.name}
                              className="ur-page2-inp-cbx"
                              checked={
                                patient.observation &&
                                patient.observation.onPalpation &&
                                patient.observation.onPalpation[item.name]
                                  ? patient.observation.onPalpation[item.name]
                                      .abnormal
                                  : false
                              }
                              disabled
                              onChange={() =>
                                handlePalpationCheckboxChange(
                                  item.name,
                                  "abnormal"
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div class="patient-range-of-motion">
                  <>
                    {[
                      "flexion",
                      "extension",
                      "abduction",
                      "adduction",
                      "eversion",
                      "inversion",
                      "externalRotation",
                      "internalRotation",
                      "dorsiFlexion",
                      "plantarFlexion",
                      "supination",
                      "pronation",
                      "lateralRotation",
                    ].some((motion, index) => {
                      const showRow = rangeOfMotionJoints.some((joint) =>
                        ["rt", "lt"].some(
                          (side) =>
                            (patient.rangeOfMotion[joint][index][motion][
                              side
                            ] || "") !== ""
                        )
                      );
                      return showRow;
                    }) ? (
                      <div className="motion-of-range-print">
                        <h2 className="motion-of-range-print-print-heading">
                          Range of Motion
                        </h2>
                        <div className="motion-of-range-print-print-table">
                          <table className="mor-table-print">
                            <thead>
                              <tr>
                                <th className="column-header"></th>
                                <th className="joint-header" colSpan="2">
                                  CERVICAL
                                </th>
                                <th className="joint-header" colSpan="2">
                                  SHOULDER
                                </th>
                                <th className="joint-header" colSpan="2">
                                  ELBOW
                                </th>
                                <th className="joint-header" colSpan="2">
                                  WRIST
                                </th>
                                <th className="joint-header" colSpan="2">
                                  HIP
                                </th>
                                <th className="joint-header" colSpan="2">
                                  KNEE
                                </th>
                                <th className="joint-header" colSpan="2">
                                  ANKLE
                                </th>
                              </tr>
                              <tr>
                                <th className="column-header"></th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                                <th className="side-header">RT</th>
                                <th className="side-header">LT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                "flexion",
                                "extension",
                                "abduction",
                                "adduction",
                                "eversion",
                                "inversion",
                                "externalRotation",
                                "internalRotation",
                                "dorsiFlexion",
                                "plantarFlexion",
                                "supination",
                                "pronation",
                                "lateralRotation",
                              ].map((motion, index) => {
                                const showRow = rangeOfMotionJoints.some(
                                  (joint) =>
                                    ["rt", "lt"].some(
                                      (side) =>
                                        (patient.rangeOfMotion[joint][index][
                                          motion
                                        ][side] || "") !== ""
                                    )
                                );
                                return showRow ? (
                                  <tr key={motion} className="motion-row">
                                    <td>
                                      {motion === "externalRotation"
                                        ? "EXTERNAL ROTATION"
                                        : motion === "internalRotation"
                                        ? "INTERNAL ROTATION"
                                        : motion === "dorsiFlexion"
                                        ? "DORSI FLEXION"
                                        : motion === "plantarFlexion"
                                        ? "PLANTAR FLEXION"
                                        : motion === "lateralRotation"
                                        ? "LATERAL ROTATION"
                                        : motion.toUpperCase()}
                                    </td>
                                    {rangeOfMotionJoints.map((joint) => (
                                      <React.Fragment
                                        key={`${motion}-${joint}`}
                                      >
                                        {["rt", "lt"].map((side) => (
                                          <td
                                            key={`${motion}-${joint}-${side}`}
                                          >
                                            <input
                                              type="text"
                                              className="print-ur-rom-custom-input"
                                              name={`${joint}-${motion}-${side}`}
                                              value={
                                                patient.rangeOfMotion[joint][
                                                  index
                                                ][motion][side] || ""
                                              }
                                              disabled={
                                                !allowedMotions[joint] ||
                                                !allowedMotions[joint].includes(
                                                  motion,
                                                  side
                                                )
                                              }
                                            />
                                          </td>
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </tr>
                                ) : null;
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </>
                </div>
              </div>

              <div className="table-container-2">
                {musclePowerItems.some((item) =>
                  ["rt", "lt"].some((side) =>
                    ["motor", "sensory"].some((category) =>
                      Boolean(patient.musclePower[item.name][side][category])
                    )
                  )
                ) ? (
                  <>
                    <h2 className="print-muscle-power-title">Muscle Power</h2>
                    <table className="print-muscle-power-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th colSpan="2">MOTOR</th>
                          <th colSpan="2">SENSORY</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th>RT</th>
                          <th>LT</th>
                          <th>RT</th>
                          <th>LT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {musclePowerItems.map((item) => {
                          // Check if any cell in the current row is filled
                          const isRowFilled = ["rt", "lt"].some((side) =>
                            ["motor", "sensory"].some((category) =>
                              Boolean(
                                patient.musclePower[item.name][side][category]
                              )
                            )
                          );

                          // If the row is not filled, return null to skip rendering
                          if (!isRowFilled) {
                            return null;
                          }
                          // Otherwise, render the row
                          return (
                            <tr key={item.name}>
                              <td>{item.label}</td>
                              {["motor", "sensory"].map((category) =>
                                ["rt", "lt"].map((side) => (
                                  <React.Fragment
                                    key={item.name + side + category}
                                  >
                                    <td>
                                      <input
                                        className="print-mp-custom-input"
                                        type="text"
                                        value={
                                          patient.musclePower[item.name][side][
                                            category
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleMusclePowerChange(
                                            item.name,
                                            side,
                                            category,
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        disabled
                                      />
                                    </td>
                                  </React.Fragment>
                                ))
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : null}
              </div>

              <div
                class="print-neuro-section-container"
                style={{
                  display: isNeuroSectionEntered ? "block" : "none",
                }}
              >
                <div className="neuro-section-heading">
                  <h1>Neuro Section</h1>
                </div>
                <div class="table-container-print">
                  <div className="balance-container-print">
                    <div className="balance-print">
                      <h6>Balance</h6>
                      <table class="balance-table-print">
                        <thead>
                          <tr>
                            <th class="balance-column"></th>
                            <th class="balance-normal-column">Nor</th>
                            <th class="balance-abnormal-column">Abnor</th>
                            <th class="balance-remark-column">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {balanceItems.map((item) => (
                            <tr key={item.label}>
                              <td>{item.label}</td>
                              <td>
                                <input
                                  type="radio"
                                  id={item.name + "1"}
                                  name={item.name}
                                  class="ur-page2-inp-cbx"
                                  checked={patient.balance[item.name].normal}
                                  disabled
                                  onChange={() => {
                                    handleBalanceCheckboxChange(
                                      item.name,
                                      "normal"
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="radio"
                                  id={item.name + "2"}
                                  name={item.name}
                                  class="ur-page2-inp-cbx"
                                  checked={patient.balance[item.name].abnormal}
                                  disabled
                                  onChange={() => {
                                    handleBalanceCheckboxChange(
                                      item.name,
                                      "abnormal"
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  class="remark-input"
                                  value={patient.balance[item.name].remarks}
                                  onChange={(event) => {
                                    handleBalanceRemarksChange(
                                      item.name,
                                      event
                                    );
                                  }}
                                  disabled
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div class="top-table">
                      <h2 class="print-standing-walking-title">
                        Standing and Walking
                      </h2>
                      <table class="saw-table-print">
                        <thead>
                          <tr>
                            <th id="saw-th1"></th>
                            <th id="saw-th2">Normal</th>
                            <th id="saw-th3">Abnormal</th>
                            <th id="saw-th4">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td id="saw-td1">STANDING: NORMAL POSTURE</td>
                            <td>
                              <span id="standingNormal">
                                <input
                                  type="radio"
                                  id="sitting-normal"
                                  name="sitting-normal"
                                  class="ur-page2-inp-cbx"
                                  checked={
                                    patient.standingWalking.normalPosture.normal
                                  }
                                  disabled
                                  onChange={() => {
                                    handleStandingWalkingCheckboxChange(
                                      "normalPosture",
                                      "normal"
                                    );
                                  }}
                                />
                              </span>
                            </td>
                            <td>
                              <span id="standingAbnormal">
                                <input
                                  type="radio"
                                  id="sitting-abnormal"
                                  name="sitting-abnormal"
                                  class="ur-page2-inp-cbx"
                                  checked={
                                    patient.standingWalking.normalPosture
                                      .abnormal
                                  }
                                  disabled
                                  onChange={() => {
                                    handleStandingWalkingCheckboxChange(
                                      "normalPosture",
                                      "abnormal"
                                    );
                                  }}
                                />
                              </span>
                            </td>
                            <td>
                              <span class="remark-input" id="standingRemarks">
                                <input
                                  type="text"
                                  class="remark-input"
                                  value={
                                    patient.standingWalking.normalPosture
                                      .remarks
                                  }
                                  onChange={(event) => {
                                    handleEquilibriumRemarksChange(
                                      "normalPosture",
                                      event
                                    );
                                  }}
                                  disabled
                                />
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td id="saw-td2">TANDON WALKING</td>
                            <td>
                              <span id="tandonWalkingNormal">
                                <input
                                  type="radio"
                                  id="standing-normal"
                                  name="standing-normal"
                                  class="ur-page2-inp-cbx"
                                  checked={
                                    patient.standingWalking.tandonWalking.normal
                                  }
                                  onChange={() => {
                                    handleStandingWalkingCheckboxChange(
                                      "tandonWalking",
                                      "normal"
                                    );
                                  }}
                                  disabled
                                />
                              </span>
                            </td>
                            <td>
                              <span id="tandonWalkingAbnormal">
                                <input
                                  type="radio"
                                  id="standing-abnormal"
                                  name="standing-abnormal"
                                  class="ur-page2-inp-cbx"
                                  checked={
                                    patient.standingWalking.tandonWalking
                                      .abnormal
                                  }
                                  onChange={() => {
                                    handleStandingWalkingCheckboxChange(
                                      "tandonWalking",
                                      "abnormal"
                                    );
                                  }}
                                  disabled
                                />
                              </span>
                            </td>
                            <td>
                              <span
                                class="remark-input"
                                id="tandonWalkingRemarks"
                              >
                                <input
                                  type="text"
                                  class="remark-input"
                                  value={
                                    patient.standingWalking.tandonWalking
                                      .remarks
                                  }
                                  onChange={(event) => {
                                    handleEquilibriumRemarksChange(
                                      "tandonWalking",
                                      event
                                    );
                                  }}
                                  disabled
                                />
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="table-1-container">
                    <div class="co-ordination">
                      <h2 class="co-ordination-heading">Co-Ordination</h2>
                      <div className="table-co-wrap">
                      <table class="co-ordination-table-print">
                        <thead>
                          <tr>
                            <th id="coordination-th"></th>
                            <th id="coordination-th-normal">Normal</th>
                            <th id="coordination-th-abnormal">Abnormal</th>
                            <th id="coordination-th-remarks">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coordinationItems.map((item) => (
                            <tr key={item.label}>
                              <td>{item.label}</td>
                              {["normal", "abnormal"].map((column) => (
                                <td key={column}>
                                  <input
                                    type="radio"
                                    checked={
                                      patient.coordination[item.name][column]
                                    }
                                    disabled
                                    onChange={() =>
                                      handleCoordinationCheckboxChange(
                                        item.name,
                                        column
                                      )
                                    }
                                  />
                                </td>
                              ))}
                              <td className="remark">
                                <input
                                  type="text"
                                  value={
                                    patient.coordination[item.name].remarks
                                  }
                                  onChange={(event) =>
                                    handleRemarksChange(item.name, event)
                                  }
                                  disabled
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="table-2-container">
                  <div class="print-section-hand-function">
                    <h2 class="ur-page2-checkbox-title">
                      Hand Function and Prehension
                    </h2>

                    <table class="section-hand-function-table">
                      <thead class="content-head">
                        <tr>
                          <th></th>
                          <th>Normal</th>
                          <th>Abnormal</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {handFunctionItems.map((item) => (
                          <tr key={item.label}>
                            <td>{item.label}</td>
                            {["normal", "abnormal"].map((column) => (
                              <React.Fragment key={column}>
                                <td>
                                  <input
                                    type="radio"
                                    id={`${item.name}-${column}`}
                                    checked={
                                      patient.handFunction[item.name][column]
                                    }
                                    disabled
                                    onChange={() =>
                                      handleHandFunctionCheckboxChange(
                                        item.name,
                                        column
                                      )
                                    }
                                    className="radio-input"
                                  />
                                </td>
                              </React.Fragment>
                            ))}
                            <td className="remark">
                              <input
                                type="text"
                                value={patient.handFunction[item.name].remarks}
                                onChange={(event) =>
                                  handleHandFunctionRemarksChange(
                                    item.name,
                                    event
                                  )
                                }
                                disabled
                              />
                            </td>
                          </tr>
                        ))}
                        {prehensionItems.map((item) => (
                          <tr key={item.label}>
                            <td>{item.label}</td>
                            {["normal", "abnormal"].map((column) => (
                              <td key={column}>
                                <input
                                  class="radio-input"
                                  type="radio"
                                  checked={
                                    patient.prehension[item.name][column]
                                  }
                                  disabled
                                  onChange={() =>
                                    handlePrehensionCheckboxChange(
                                      item.name,
                                      column
                                    )
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              <input
                                class="remark-input"
                                type="text"
                                value={patient.prehension[item.name].remarks}
                                onChange={(event) => {
                                  const { value } = event.target;
                                  const isValid =
                                    /^(?!.*\s{2})[^\s].{0,12}$/.test(value); //13 characters

                                  if (isValid || value === "") {
                                    setPatient((prevPatient) => ({
                                      ...prevPatient,
                                      prehension: {
                                        ...prevPatient.prehension,
                                        [item.name]: {
                                          ...prevPatient.prehension[item.name],
                                          remarks: value,
                                        },
                                      },
                                    }));
                                  }
                                }}
                                disabled
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="print-barthel-index-container">
                    <h1 class="print-barthel-index-title">
                      {" "}
                      The Barthel Index
                    </h1>
                    <table className="print-barthel-index-table">
                      <tr>
                        <td>
                          <span>Total Scores : </span>
                        </td>
                        <td>
                          {Object.values(patient.barthelIndex).reduce(
                            (total, activity) => total + activity.score,
                            0
                          )}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div
                class="table-container-3"
                style={{ display: isCardioSectionEntered ? "block" : "none" }}
              >
                <div className="neuro-section-heading">
                  <h1>Cardio Section</h1>
                </div>
                <div class="table-container-3-row-1">
                  <div class="Breathing-Pattern">
                    <h2 class="ur-page2-checkbox-title">
                      Observation of Chest
                    </h2>
                    <table class="Breathing-Pattern-table-print">
                      <thead class="content-head">
                        <tr>
                          <th></th>
                          <th>Normal</th>
                          <th>Abnormal</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chestObservationItems.map((item) => (
                          <tr key={item.label}>
                            <td>{item.label}</td>
                            <td>
                              <input
                                class="radio-input"
                                type="radio"
                                checked={
                                  patient.chestObservation[item.name].normal
                                }
                                disabled
                                onChange={() =>
                                  handleChestObservationCheckboxChange(
                                    item.name,
                                    "normal"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                class="radio-input"
                                type="radio"
                                checked={
                                  patient.chestObservation[item.name].abnormal
                                }
                                disabled
                                onChange={() =>
                                  handleChestObservationCheckboxChange(
                                    item.name,
                                    "abnormal"
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                class="remark-input"
                                type="text"
                                value={
                                  patient.chestObservation[item.name].remarks
                                }
                                onChange={(event) => {
                                  const { value } = event.target;

                                  const isValid =
                                    /^(?!.*\s{2})[^\s].{0,13}$/.test(value);

                                  if (isValid || value === "") {
                                    setPatient((prevPatient) => ({
                                      ...prevPatient,
                                      chestObservation: {
                                        ...prevPatient.chestObservation,
                                        [item.name]: {
                                          ...prevPatient.chestObservation[
                                            item.name
                                          ],
                                          remarks: value,
                                        },
                                      },
                                    }));
                                  }
                                }}
                                disabled
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div class="observation-of-chest-motion">
                    <h2 class="ur-page2-checkbox-title">
                      Observation of Chest Motion
                    </h2>
                    <table class="observation-of-chest-motion-table">
                      <thead>
                        <tr>
                          <th>Motion Type</th>
                          <th>Nor</th>
                          <th>Abnormal</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Middle Lobe & Lingula Motion</td>
                          <td>
                            <span class="normal-span">
                              <input
                                type="radio"
                                name="middleLobeLingulaMotion"
                                checked={
                                  patient.chestMotionObservation
                                    .middleLobeLingulaMotion.normal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "middleLobeLingulaMotion",
                                    "normal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="abnormal-span">
                              <input
                                type="radio"
                                name="middleLobeLingulaMotion"
                                checked={
                                  patient.chestMotionObservation
                                    .middleLobeLingulaMotion.abnormal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "middleLobeLingulaMotion",
                                    "abnormal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="remark-span">
                              <input
                                type="text"
                                value={
                                  patient.chestMotionObservation
                                    .middleLobeLingulaMotion.remarks
                                }
                                onChange={(e) =>
                                  handleLobeRemarkInputChange(
                                    "middleLobeLingulaMotion",
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Upper Lobe Motion</td>
                          <td>
                            <span class="normal-span">
                              <input
                                type="radio"
                                name="upperLobeMotion"
                                checked={
                                  patient.chestMotionObservation.upperLobeMotion
                                    .normal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "upperLobeMotion",
                                    "normal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="abnormal-span">
                              <input
                                type="radio"
                                name="upperLobeMotion"
                                checked={
                                  patient.chestMotionObservation.upperLobeMotion
                                    .abnormal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "upperLobeMotion",
                                    "abnormal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="remark-span">
                              <input
                                type="text"
                                value={
                                  patient.chestMotionObservation.upperLobeMotion
                                    .remarks
                                }
                                onChange={(e) =>
                                  handleLobeRemarkInputChange(
                                    "upperLobeMotion",
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Lower Lobe Motion</td>
                          <td>
                            <span class="normal-span">
                              <input
                                type="radio"
                                name="lowerLobeMotion"
                                checked={
                                  patient.chestMotionObservation.lowerLobeMotion
                                    .normal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "lowerLobeMotion",
                                    "normal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="abnormal-span">
                              <input
                                type="radio"
                                name="lowerLobeMotion"
                                checked={
                                  patient.chestMotionObservation.lowerLobeMotion
                                    .abnormal
                                }
                                disabled
                                onChange={() =>
                                  handleLobeInputChange(
                                    "lowerLobeMotion",
                                    "abnormal"
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td>
                            <span class="remark-span">
                              <input
                                type="text"
                                value={
                                  patient.chestMotionObservation.lowerLobeMotion
                                    .remarks
                                }
                                onChange={(e) =>
                                  handleLobeRemarkInputChange(
                                    "lowerLobeMotion",
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                disabled
                              />
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="table-container-3-row">
                  <div class="print-section-subjective-Assessment">
                    <h2 class="ur-page2-checkbox-title">
                      Subjective Assessment
                    </h2>
                    <table
                      class="section-subjective-Assessment-table"
                      id="subjectiveAssessmentTable"
                    >
                      <thead class="content-head">
                        <tr>
                          <th></th>
                          <th>Duration</th>
                          <th>Severity</th>
                          <th>Pattern</th>
                          <th>Associated Factor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(patient.subjectiveAssessment).map(
                          (symptom) => (
                            <tr key={symptom}>
                              <td>
                                {symptom === "sputumHemoptysis"
                                  ? "SPUTUM HEOPTYSIS"
                                  : symptom === "chestPain"
                                  ? "CHEST PAIN"
                                  : symptom.toUpperCase()}
                              </td>
                              {[
                                "duration",
                                "severity",
                                "pattern",
                                "associatedFactors",
                              ].map((field) => (
                                <td key={field} className="remark">
                                  {field === "severity" ? (
                                    <select
                                      value={
                                        patient.subjectiveAssessment[symptom][
                                          field
                                        ]
                                      }
                                      onChange={(event) =>
                                        handleSeverityChange(symptom, event)
                                      }
                                      name={`${symptom}-${field}`}
                                      disabled
                                    >
                                      <option value="">Severity</option>
                                      {severityOptions.map((option) => (
                                        <option
                                          key={option}
                                          value={option.toLowerCase()}
                                        >
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : field === "associatedFactors" &&
                                    symptom === "sputumHemoptysis" ? (
                                    <select
                                      value={
                                        patient.subjectiveAssessment[symptom]
                                          .hemoptysisType
                                      }
                                      onChange={(event) =>
                                        handleHemoptysisTypeChange(
                                          symptom,
                                          event
                                        )
                                      }
                                      name={`${symptom}-${field}`}
                                      disabled
                                    >
                                      <option value="">Type</option>
                                      {hemoptysisOptions.map((option) => (
                                        <option
                                          key={option}
                                          value={option.toLowerCase()}
                                        >
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      value={
                                        patient.subjectiveAssessment[symptom][
                                          field
                                        ]
                                      }
                                      onChange={(event) =>
                                        handleTextChange(symptom, field, event)
                                      }
                                      disabled
                                    />
                                  )}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="print-page-6-upper-container">
                    <h2 class="print-ur-page2-checkbox-title">
                      Choose Chest Type
                    </h2>

                    <div className="print-page-6-form-container">
                      {Object.entries(
                        patient.chestShapeObservation.chestShape
                      ).map(
                        ([shape, selected]) =>
                          selected && (
                            <img
                              key={shape}
                              src={`./uploads/${shape}.png`}
                              alt={shape}
                              onClick={() => handleImageClick(shape)}
                              className="selected"
                            />
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="print-plantreatment-section"
                style={{
                  display: isPlanTreatmentSectionEntered ? "block" : "none",
                }}
              >
                <div class="h1-plan-treatment-table">Treatment Plan</div>
                <table class="physio-treatment-table">
                  <thead>
                    <tr class="physio-table-row">
                      <th class="physio-table-header">Patient Type</th>
                      <th class="physio-table-header">Date</th>
                      <th class="physio-table-header">No. of Days</th>
                      {patient.planTreatment[0].patientType === "inpatient"
                        ? Object.keys(patient.planTreatment[0])
                            .slice(4)
                            .map((category, index) => (
                              <th key={index}>{category}</th>
                            ))
                        : Object.keys(patient.planTreatment[0])
                            .slice(4, -1)
                            .map((category, index) => (
                              <th key={index}>{category}</th>
                            ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patient.planTreatment.map((plan, index) => (
                      <tr key={index}>
                        <td>
                          {!plan.isNewRow && plan.patientType}

                          {plan.isNewRow &&
                            !(
                              !nextRowPatientType ||
                              nextRowPatientType === "choose type"
                            ) && (
                              <select
                                value={nextRowPatientType}
                                onChange={(e) =>
                                  handleInOutPatientTypeChange(e.target.value)
                                }
                                disabled
                              >
                                <option value="choose type">
                                  Select Patient Type
                                </option>
                                <option value="outpatient">Out-Patient</option>
                                <option value="inpatient">In-Patient</option>
                              </select>
                            )}
                        </td>
                        <td class="remark">
                          {/*console.log("Rendering - isNewRow:", plan.isNewRow)*/}
                          {!plan.isNewRow &&
                            plan.patientType === "inpatient" && (
                              <div className="admis-dis-flexer">
                                <label>
                                  Admission Date:
                                  <input
                                    type="date"
                                    value={plan.startDate}
                                    onChange={(e) =>
                                      handleInOutInputChange(
                                        index,
                                        "date",
                                        e.target.value
                                      )
                                    }
                                    disabled
                                  />
                                </label>
                                <label>
                                  Discharge Date:
                                  <input
                                    type="date"
                                    value={plan.endDate}
                                    onChange={(e) =>
                                      handleInOutInputChange(
                                        index,
                                        "date",
                                        e.target.value
                                      )
                                    }
                                    disabled
                                  />
                                </label>
                              </div>
                            )}
                          {!plan.isNewRow &&
                            plan.patientType === "outpatient" && (
                              <label>
                                Appointment Date :{" "}
                                <input
                                  type="date"
                                  value={plan.startDate}
                                  onChange={(e) =>
                                    handleInOutInputChange(
                                      index,
                                      "date",
                                      e.target.value
                                    )
                                  }
                                  disabled
                                />
                              </label>
                            )}

                          {nextRowPatientType !== "inpatient" &&
                            nextRowPatientType === "outpatient" &&
                            plan.isNewRow && (
                              <label>
                                Appointment Date:
                                <input
                                  type="date"
                                  name="appointmentDate"
                                  value={
                                    outPatientBillDetails.outBill[0]
                                      .appointmentDate
                                  }
                                  onChange={handleIOOutPatientInputChange}
                                  disabled
                                />
                              </label>
                            )}

                          {nextRowPatientType === "inpatient" &&
                            plan.isNewRow &&
                            plan.patientType !== "choose type" && (
                              <div className="admis-dis-flexer">
                                <label>
                                  Admission Date:
                                  <input
                                    type="date"
                                    name="admissionDate"
                                    value={
                                      inPatientBillDetails.inBill[0]
                                        .admissionDate
                                    }
                                    onChange={handleIOInPatientInputChange}
                                    disabled
                                  />
                                </label>
                                <label>
                                  Discharge Date:
                                  <input
                                    type="date"
                                    name="dischargeDate"
                                    value={
                                      inPatientBillDetails.inBill[0]
                                        .dischargeDate
                                    }
                                    onChange={handleIOInPatientInputChange}
                                    disabled
                                  />
                                </label>
                              </div>
                            )}
                        </td>
                        <td className="total-days-page7">
                          {!plan.isNewRow && (
                            <input
                              type="text"
                              value={plan.days}
                              onChange={(e) =>
                                handleInOutInputChange(
                                  index,
                                  "days",
                                  e.target.value
                                )
                              }
                              disabled
                            />
                          )}
                          {nextRowPatientType === "outpatient" &&
                            plan.isNewRow && (
                              <input
                                type="text"
                                value={plan.days}
                                onChange={(e) =>
                                  handleInOutInputChange(
                                    index,
                                    "days",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          {nextRowPatientType === "inpatient" &&
                            plan.isNewRow && (
                              <input
                                type="text"
                                value={inPatientBillDetails.inBill[0].totalDays}
                                onChange={handleIOInPatientInputChange}
                                disabled
                              />
                            )}
                        </td>

                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ust}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ust")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ust}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ust")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ust}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ust")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ust}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ust")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ift}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ift")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ift}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ift")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ift}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ift")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.ift}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "ift")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.swd}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "swd")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.swd}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "swd")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.swd}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "swd")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.swd}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "swd")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.tr}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "tr")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.tr}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "tr")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.tr}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "tr")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.tr}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "tr")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.wax}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "wax")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.wax}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "wax")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.wax}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "wax")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.wax}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "wax")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.est}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "est")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.est}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "est")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.est}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "est")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.est}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "est")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.sht}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "sht")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.sht}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "sht")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.sht}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "sht")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.sht}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "sht")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.laser}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "laser")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.laser}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "laser")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.laser}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "laser")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.laser}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "laser")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.exs}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "exs")
                                }
                                disabled
                              />
                            )}

                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.exs}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "exs")
                                }
                                disabled
                              />
                            )}
                          {(nextRowPatientType === "outpatient" ||
                            plan.patientType === "outpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.exs}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "exs")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "outpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.exs}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "exs")
                                }
                                disabled
                              />
                            )}
                        </td>
                        <td>
                          {(nextRowPatientType === "inpatient" ||
                            plan.patientType === "inpatient") &&
                            plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.rehab}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "rehab")
                                }
                                disabled
                              />
                            )}
                          {plan.patientType === "inpatient" &&
                            !plan.isNewRow && (
                              <input
                                type="checkbox"
                                checked={plan.rehab}
                                onChange={() =>
                                  handleInOutCheckboxChange(index, "rehab")
                                }
                                disabled
                              />
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div class="h1-investigation-table">
                  Investigation Treatment
                </div>
                <table class="investigation-treatment-table-print">
                  <thead>
                    <tr>
                      <th class="planned-date-header">Date</th>
                      <th class="planned-xray-header">X-ray</th>
                      <th class="planned-mri-header">MRI</th>
                      <th class="planned-others-header">Others</th>
                      <th class="planned-diagnosis-header">
                        Provisional Diagnosis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.investigation.map((invest, index) => (
                      <tr key={index}>
                        {invest.date !== "" && (
                          <>
                            <td class="remark">
                              <input
                                type="date"
                                value={invest.date}
                                onChange={(e) =>
                                  handleInOutInvestigationChange(
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                readOnly={!invest.isNewInvestRow}
                                disabled
                              />
                            </td>
                            <td class="remark">
                              <input
                                type="text"
                                maxLength={50}
                                name="xray"
                                value={invest.xray}
                                onChange={(e) =>
                                  handleInOutTextareaChange(
                                    "xray",
                                    e.target.value
                                  )
                                }
                                readOnly={!invest.isNewInvestRow}
                                disabled
                              ></input>
                            </td>
                            <td class="remark">
                              <input
                                type="text"
                                maxLength={50}
                                name="mri"
                                value={invest.mri}
                                onChange={(e) =>
                                  handleInOutTextareaChange(
                                    "mri",
                                    e.target.value
                                  )
                                }
                                readOnly={!invest.isNewInvestRow}
                                disabled
                              ></input>
                            </td>
                            <td class="remark">
                              <input
                                type="text"
                                maxLength={50}
                                name="others"
                                value={invest.others}
                                onChange={(e) =>
                                  handleInOutTextareaChange(
                                    "others",
                                    e.target.value
                                  )
                                }
                                readOnly={!invest.isNewInvestRow}
                                disabled
                              ></input>
                            </td>
                            <td class="remark">
                              <input
                                type="text"
                                maxLength={50}
                                name="provisionalDiagnosis"
                                value={invest.provisionalDiagnosis}
                                onChange={(e) =>
                                  handleInOutTextareaChange(
                                    "provisionalDiagnosis",
                                    e.target.value
                                  )
                                }
                                readOnly={!invest.isNewInvestRow}
                                disabled
                              ></input>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="overlay-content-end-print">
                <h1 class="clinic-name">**End of Content**</h1>
              </div>
            </div>
          </div>
        </div>
      </>
        ):(null)
    </>
  
                  
);
};

export default OverlayRecord;
