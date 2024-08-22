import React, { useEffect, useState } from 'react';
import axios from 'axios';


const UpdateRecord = () => {
    const [mobileNo, setMobileNo] = useState('');
    const [page1, setPage1] = useState(true);
    const [page2, setPage2] = useState(false);
    const [page3, setPage3] = useState(false);
    const [page4, setPage4] = useState(false);
    const [page5, setPage5] = useState(false);
    const [page6, setPage6] = useState(false);
    const [page7, setPage7] = useState(false);
    const [page8, setPage8] = useState(false);


    let foundPatientBasicRecord;
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
    const [patientId, setPatientId] = useState('');
    const [error, setError] = useState('');
    const [closeDetails, setCloseDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [selectedPatientType, setSelectedPatientType] = useState('');
    const [createoverlayVisible, setCreateOverlayVisible] = useState(false);
    const [createFreshOverlayVisible, setCreateFreshOverlayVisible] = useState(false);
    const [firstRow, setFirstRow] = useState(false);
    const [patient, setPatient] = useState({
        mobileNo: '',
        painRegion: {
            Neck: false,
            Wrist: false,
            LowerBack: false,
            Ankle: false,
            Shoulder: false,
            Fingers: false,
            Hip: false,
            Toes: false,
            Elbow: false,
            UpperBack: false,
            Knee: false,
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
        aggFactor: '',  // Add other properties as needed
        relFactor: '',
        duration: '',
        onset: '',
        vitalSign: {
            BP: '',
            RR: '',
            HR: '',
            SPO2: '',
            TEMP: '',
        },
        observation: {
            onObservation: {
                SkinColor: false,
                Deformity: false,
                Redness: false,
                ShinySkin: false,
                OpenWounds: false,
            },
            onPalpation: {
                Tenderness: false,
                Warmth: false,
                Swelling: false,
                Odema: false,
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
            cervicalC1C2Flexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            cervicalC3SideFlexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            scapulaC4Elevation: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            shoulderC5Abduction: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            elbowC6FlexionWristExtension: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            elbowC7ExtensionWristFlexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            thumbC8Extension: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            hipL1L2Flexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            kneeL3Extension: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            ankleL4Dorsiflexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            bigToeL5Extension: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            ankleS1PlantarFlexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            kneeS2Flexion: { rt: { motor: 0, sensory: 0 }, lt: { motor: 0, sensory: 0 } },
            // Add other properties as needed
        },
        coordination: {
            fingerToNose: { normal: false, abnormal: false, remarks: '' },
            fingerOpposition: { normal: false, abnormal: false, remarks: '' },
            grip: { normal: false, abnormal: false, remarks: '' },
            pronationSupination: { normal: false, abnormal: false, remarks: '' },
            reboundTest: { normal: false, abnormal: false, remarks: '' },
            tappingHand: { normal: false, abnormal: false, remarks: '' },
            tappingFoot: { normal: false, abnormal: false, remarks: '' },
            heelToKnee: { normal: false, abnormal: false, remarks: '' },
            drawingCircleHand: { normal: false, abnormal: false, remarks: '' },
            drawingCircleFoot: { normal: false, abnormal: false, remarks: '' },
            // Add other properties as needed
        },
        standingWalking: {
            normalPosture: { normal: false, abnormal: false, remarks: '' },
            tandonWalking: { normal: false, abnormal: false, remarks: '' },
            // Add other properties as needed
        },
        balance: {
            sitting: { normal: false, abnormal: false, remarks: '' },
            standing: { normal: false, abnormal: false, remarks: '' },
            posture: { normal: false, abnormal: false, remarks: '' },
            gait: { normal: false, abnormal: false, remarks: '' },
            // Add other properties as needed
        },
        handFunction: {
            grip: { normal: false, abnormal: false, remarks: '' },
            grasp: { normal: false, abnormal: false, remarks: '' },
            release: { normal: false, abnormal: false, remarks: '' },
            // Add other properties as needed
        },
        prehension: {
            tipToTip: { normal: false, abnormal: false, remarks: '' },
            padToPad: { normal: false, abnormal: false, remarks: '' },
            tipToPad: { normal: false, abnormal: false, remarks: '' },
            // Add other properties as needed
        },
        subjectiveAssessment: {
            breathlessness: { duration: '', severity: '', pattern: '', associatedFactors: '' },
            cough: { duration: '', severity: '', pattern: '', associatedFactors: '' },
            sputumHemoptysis: { duration: '', severity: '', pattern: '', associatedFactors: '', hemoptysisType: '' },
            wheeze: { duration: '', severity: '', pattern: '', associatedFactors: '' },
            chestPain: { duration: '', severity: '', pattern: '', associatedFactors: '' },
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
            bodyBuilt: { normal: false, abnormal: false, remarks: '' },
            handsAndFingertips: { normal: false, abnormal: false, remarks: '' },
            eyes: { normal: false, abnormal: false, remarks: '' },
            cyanosis: { normal: false, abnormal: false, remarks: '' },
            jugularVenousPressure: { normal: false, abnormal: false, remarks: '' },
        },
        chestObservation: {
            breathingPattern: { normal: false, abnormal: false, remarks: '' },
            chestMovement: { normal: false, abnormal: false, remarks: '' },
            palpationOfChest: { normal: false, abnormal: false, remarks: '' },
            chestExpansion: { normal: false, abnormal: false, remarks: '' },
            // ... other properties
        },
        barthelIndex: {
            feeding: { score: 0, activity: 'Feeding', maxScore: 10 },
            bathing: { score: 0, activity: 'Bathing', maxScore: 5 },
            grooming: { score: 0, activity: 'Grooming', maxScore: 5 },
            dressing: { score: 0, activity: 'Dressing', maxScore: 10 },
            bowels: { score: 0, activity: 'Bowels', maxScore: 10 },
            bladder: { score: 0, activity: 'Bladder', maxScore: 10 },
            toiletUse: { score: 0, activity: 'Toilet Use', maxScore: 10 },
            transfer: { score: 0, activity: 'Transfer (Bed to Chair and Back)', maxScore: 15 },
            mobility: { score: 0, activity: 'Mobility (On level surfaces)', maxScore: 15 },
            stairs: { score: 0, activity: 'Stairs', maxScore: 10 },

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
            middleLobeLingulaMotion: null,
            upperLobeMotion: null,
            lowerLobeMotion: null,
            middleLobeLingulaValues: '',
            middleLobeLingulaRemarks: '',
            upperLobeValues: '',
            upperLobeRemarks: '',
            lowerLobeValues: '',
            lowerLobeRemarks: '',
        },
        planOfTreatment: '',

        planTreatment: [
            {
                patientType: 'outpatient',
                startDate: '',
                endDate: '',
                days: '',
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
                date: '',
                xray: '',
                mri: '',
                others: '',
                provisionalDiagnosis: '',
            },
        ],

        outPatientBill: [
            {
                appointmentDate: '',
                serviceName: '',
                paymentMode: '',
                billAmount: '',
            },
        ],

        inPatientBill: [
            {
                roomNumber: '',
                admissionDate: '',
                dischargeDate: '',
                totalDays: '',
                visitingBill: '',
                physioBill: '',
                nursingBill: '',
                otherExpenses: '',
                paymentMode: '',
                billAmount: '',
            },
        ],

    });

    const createPatientRecord = async () => {
        setTimeout(() => {
            validatemobileNo(patient.mobileNo);
        }, 1000);
        if (verifiedMobileNo) {
            const dateAndTime = new Date().toLocaleString();

            try {
                setRecordButtonClicked(true);

                if (firstRow) {
                    if (patient.planTreatment[0].patientType === "choose type") {
                        alert("Please select a patient type from plan treament");
                        return;
                    }
                    else if ((!patient.outPatientBill[0].appointmentDate) &&
                        ((!patient.inPatientBill[0].admissionDate) || (!patient.inPatientBill[0].dischargeDate))
                    ) {
                        alert("Please select date from plan treament");
                        return;
                    }
                }



                if (firstRow) {
                    const startedDate = patient.planTreatment[0].patientType === "inpatient"
                        ? patient.inPatientBill[0].admissionDate
                        : patient.outPatientBill[0].appointmentDate;

                    const endedDate = patient.planTreatment[0].patientType === "inpatient"
                        ? patient.inPatientBill[0].dischargeDate
                        : null; // Set to null for outpatient

                    const tDays = patient.planTreatment[0].patientType === "inpatient"
                        ? patient.inPatientBill[0].totalDays
                        : 1; // Set days to 1 for outpatient
                    if (patient.planTreatment[0].patientType === "inpatient") {

                        patient.planTreatment[0].startDate = startedDate;
                        patient.planTreatment[0].endDate = endedDate;
                        patient.planTreatment[0].days = tDays;

                    }
                    else {
                        patient.planTreatment[0].startDate = startedDate;
                        patient.planTreatment[0].endDate = '';
                        patient.planTreatment[0].days = 1;
                    }

                    const inBillDetails =
                        (patient.planTreatment[0].patientType === "inpatient" && isBillDetailsInPatientFilled())
                            ? patient.inPatientBill[0]
                            : undefined;

                    const outBillDetails =
                        (patient.planTreatment[0].patientType === "outpatient" && isBillDetailsOutPatientFilled())
                            ? patient.outPatientBill[0]
                            : undefined;


                    if (
                        (patient.planTreatment[0].patientType === "inpatient" && inBillDetails === undefined) ||
                        (patient.planTreatment[0].patientType === "outpatient" && outBillDetails === undefined)
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

                }


                await axios.post('https://saai-physio-api.vercel.app/api/create_record', {
                    patient: {
                        ...patient
                    },
                });

                alert("Record created successfully!");
                setAppMessage('Record updated successfully!');
                setTimeout(() => {
                    setAppMessage('');
                }, 5000);
                setLoading(false);
            } catch (error) {
                console.error('Error creating patient record:', error);
                setAppMessage('An error occurred while creating the patient record');
                setLoading(false);
            }
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
        }))
    }, [selectedRowStartDate, selectedRowEndDate]);


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
                i === index && item.isNewRow
                    ? { ...item, [field]: value }
                    : item
            );

            return {
                ...prevpatient,
                planTreatment: updatedPlanTreatment,
            };
        });
    };
    const handleAddRow = () => {
        setNewNextRow(true);
        setPatient((prevPatient) => {
            const newPlan = {
                startDate: '', // You might want to provide default values here
                endDate: '',
                days: '',
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
        setPatient((prevpatient) => {
            const updatedRecord = {
                planTreatment: prevpatient.planTreatment.filter(
                    (item, i) => i !== index
                ),
            };

            //updateBackend(updatedRecord);

            return { ...prevpatient, ...updatedRecord };
        });
    };

    const handleDeleteInvestRow = (index) => {
        setPatient((prevpatient) => {
            const updatedRecord = {
                investigation: prevpatient.investigation.filter(
                    (item, i) => i !== index
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
                        nextRowPatientType === "inpatient"
                        && inPatientBillDetails.inBill[0].dischargeDate,
                    days:
                        nextRowPatientType === "inpatient"
                            ? inPatientBillDetails.inBill[0].totalDays
                            : 1, // Set days to 1 for outpatient
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

        // Update the patient state with new data
        setPatient(prevPatient => ({
            ...prevPatient,
            planTreatment: prevPatient.planTreatment.map(plan => plan.isNewRow ? newRows.find(newRow => newRow.id === plan.id) : plan)
        }));

        // Additional UI updates or error handling if needed
    };

    const handleRowSelection = (index) => {
        setSelectedRowStartDate(sortedRows[index].startDate);
        setSelectedRowEndDate(sortedRows[index].endDate);
    };
    
    const handleInOutUpdateOutBill = async () => {
            const isBillDetailsFilled = isBillDetailsInOutOutPatientFilled();
            if (isBillDetailsFilled) {
                try {
                    // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update
    
                    const updatedBill = {
                        mobileNumber: mobileNo,
                        appointmentDate: selectedRowStartDate, // Assuming selectedRowDate is correctly set
                        serviceName: outPatientBillDetails.outBill[0].serviceName,
                        paymentMode: outPatientBillDetails.outBill[0].paymentMode,
                        billAmount: outPatientBillDetails.outBill[0].billAmount,
                    };
                    
                    patient.outPatientBill.push(updatedBill);
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
    //console.log("currentrow",currentRowPatientType);
    const handleInOutUpdateInBill = async () => {
        const isBillDetailsFilled = isBillDetailsInOutInPatientFilled();
        if (isBillDetailsFilled) {
            try {
                // Assuming outPatientBillDetails.outBill[0] contains the details of the bill to update

                const updatedBill = {
                    mobileNumber : mobileNo,
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

                patient.inPatientBill.push(updatedBill);

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
        const selectedPlanTreatment = patient.planTreatment[index];

        // Find all relevant bills for the selected date
        const relevantInPatientBills = patient.inPatientBill.filter((inPatient) => {
            return (
                new Date(inPatient.admissionDate).toLocaleDateString() ===
                new Date(selectedPlanTreatment.startDate).toLocaleDateString()
            );
        });

        const relevantOutPatientBills = patient.outPatientBill.filter((outPatient) => {
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
        const newRows = patient.investigation.filter(
            (item) => item.isNewInvestRow
        );

        // Update the backend immediately when a change is made to a new row
        axios
            .post("https://saai-physio-api.vercel.app/api/edit_invest_record", {
                mobileNo,
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
        if (nextRowPatientType === "outpatient") {
            console.log("out");
            setCreateOverlayVisible(true);
        } else {
            console.log("in");
            setCreateOverlayVisible(true);
        }
    };


    const handleInOutCreateNewInBill = (ptype, sdate, edate) => {
        setCurrentRowPatientType(ptype);
        setSelectedRowStartDate(sdate);
        setSelectedRowEndDate(edate);
        setCreateOverlayVisible(true);
    }

    const handleInOutCreateNewOutBill = (ptype, sdate) => {
        setCurrentRowPatientType(ptype);
        setSelectedRowStartDate(sdate);
        setCreateOverlayVisible(true);
    }

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
            setPatient((prevpatient) => ({
              ...prevpatient,
              planTreatment: prevpatient.planTreatment.map((plan) => ({
                ...plan,
                isNewRow: false,
              })),
            }));
        }*/
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
    const rangeOfMotionJoints = ['cervical', 'shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];
    const severityOptions = ['Critical', 'High', 'Medium', 'Low'];
    const hemoptysisOptions = ['Red: Blood', 'Rust: Pneumonia', 'Purple: Neoplasm', 'Yellow: Infected', 'Green: Pus', 'Pink: Pulmonary Oedema'];
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
    ];
    const musclePowerItems = [
        { label: "C1-C2 – CERVICAL FLEXION", name: "cervicalC1C2Flexion" },
        { label: "C3 – CERVICAL SIDE FLEXION", name: "cervicalC3SideFlexion" },
        { label: "C4-SCAPULA ELEVATION", name: "scapulaC4Elevation" },
        { label: "C5-SHOULDER ABDUCTION", name: "shoulderC5Abduction" },
        { label: "C6-ELBOW FLEXION AND WRIST EXTENSION", name: "elbowC6FlexionWristExtension" },
        { label: "C7-ELBOW EXTENSION AND WRIST FLEXION", name: "elbowC7ExtensionWristFlexion" },
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
        { label: 'FINGER TO NOSE', name: 'fingerToNose' },
        { label: 'FINGER OPPOSITION', name: 'fingerOpposition' },
        { label: 'GRIP', name: 'grip' },
        { label: 'PRONATION/SUPINATION', name: 'pronationSupination' },
        { label: 'REBOUND TEST', name: 'reboundTest' },
        { label: 'TAPPING(HAND)', name: 'tappingHand' },
        { label: 'TAPPING(FOOT)', name: 'tappingFoot' },
        { label: 'HEEL TO KNEE', name: 'heelToKnee' },
        { label: 'DRAWING A CIRCLE (HAND)', name: 'drawingCircleHand' },
        { label: 'DRAWING A CIRCLE (FOOT)', name: 'drawingCircleFoot' },
        // Add more items as needed
    ];
    const standingWalkingItems = [
        { label: 'STANDING: NORMAL POSTURE', name: 'normalPosture' },
        { label: 'TANDON WALKING', name: 'tandonWalking' },
        // Add more items as needed
    ];
    const balanceItems = [
        { label: 'SITTING', name: 'sitting' },
        { label: 'STANDING', name: 'standing' },
        { label: 'POSTURE', name: 'posture' },
        { label: 'GAIT', name: 'gait' },
        // Add more items as needed
    ];
    const handFunctionItems = [
        { label: 'GRIP', name: 'grip' },
        { label: 'GRASP', name: 'grasp' },
        { label: 'RELEASE', name: 'release' },
        // Add more items as needed
    ];
    const prehensionItems = [
        { label: 'TIP TO TIP', name: 'tipToTip' },
        { label: 'PAD TO PAD', name: 'padToPad' },
        { label: 'TIP TO PAD', name: 'tipToPad' },
        // Add more items as needed
    ];
    const rpeData = [
        { point: 6, effort: 'No Exertion', description: 'Little to no movement, very relaxed', maxHRPercentage: '20%' },
        { point: 7, effort: 'Extremely Light', description: 'Able to maintain pace', maxHRPercentage: '30%' },
        { point: 8, effort: '', description: '', maxHRPercentage: '40%' },
        { point: 9, effort: 'Very Light', description: 'Comfortable and breathing harder', maxHRPercentage: '50%' },
        { point: 10, effort: '', description: '', maxHRPercentage: '55%' },
        { point: 11, effort: 'Light', description: 'Minimal sweating, can talk easily', maxHRPercentage: '60%' },
        { point: 12, effort: '', description: '', maxHRPercentage: '65%' },
        { point: 13, effort: 'Somewhat Hard', description: 'Slight breathlessness, can talk', maxHRPercentage: '70%' },
        { point: 14, effort: '', description: 'Increased sweating, still able to hold conversation but with difficulty', maxHRPercentage: '75%' },
        { point: 15, effort: 'Hard', description: 'Sweating, able to push and still maintain proper form', maxHRPercentage: '80%' },
        { point: 16, effort: '', description: '', maxHRPercentage: '85%' },
        { point: 17, effort: 'Very Hard', description: 'Can keep a fast pace for a short', maxHRPercentage: '90%' },
    ];
    const brpeData = [
        { rating: 6, description: 'Very, Very Light (REST)', effortPercentage: '20%' },
        { rating: 7, description: '', effortPercentage: '30%' },
        { rating: 8, description: '', effortPercentage: '40%' },
        { rating: 9, description: 'Very Light, Gentle Walk', effortPercentage: '50%' },
        { rating: 10, description: '', effortPercentage: '55%' },
        { rating: 11, description: 'Fairly Light', effortPercentage: '60%' },
        { rating: 12, description: '', effortPercentage: '65%' },
        { rating: 13, description: 'Moderately Hard, Steady Pace', effortPercentage: '70%' },
        { rating: 14, description: '', effortPercentage: '75%' },
        { rating: 15, description: 'Hard', effortPercentage: '80%' },
        { rating: 16, description: '', effortPercentage: '85%' },
        { rating: 17, description: 'Very Hard', effortPercentage: '90%' },
        { rating: 18, description: '', effortPercentage: '95%' },
        { rating: 19, description: 'Very, Very Hard', effortPercentage: '100%' },
        { rating: 20, description: 'EXHAUSTION', effortPercentage: '' },
    ];
    const generalObservationItems = [
        { label: 'Body built', name: 'bodyBuilt' },
        { label: 'Hands and fingertips', name: 'handsAndFingertips' },
        { label: 'Eyes', name: 'eyes' },
        { label: 'Cyanosis', name: 'cyanosis' },
        { label: 'Jugular venous pressure', name: 'jugularVenousPressure' },
        // ... other items
    ];
    const chestObservationItems = [
        { label: 'Breathing pattern', name: 'breathingPattern' },
        { label: 'Chest movement', name: 'chestMovement' },
        { label: 'Palpation of chest', name: 'palpationOfChest' },
        { label: 'Chest expansion', name: 'chestExpansion' },
        // ... other items
    ];
    const barthelIndexItems = [
        { label: 'Feeding', name: 'feeding', range: '0 = unable, 5 = needs help, 10 = independent' },
        { label: 'Bathing', name: 'bathing', range: '0 = dependent, 5 = independent (or in shower)' },
        { label: 'Grooming', name: 'grooming', range: '0 = needs help, 5 = independent with face/hair/teeth/shaving' },
        { label: 'Dressing', name: 'dressing', range: '0 = dependent, 5 = needs help, 10 = independent (including buttons, zips, laces, etc.)' },
        { label: 'Bowels', name: 'bowels', range: '0 = incontinent, 5 = occasional accident, 10 = continent' },
        { label: 'Bladder', name: 'bladder', range: '0 = incontinent or catheterized, 5 = occasional accident, 10 = continent' },
        { label: 'Toilet Use', name: 'toiletUse', range: '0 = dependent, 5 = needs some help, 10 = independent (on and off, dressing, wiping)' },
        { label: 'Transfer', name: 'transfer', range: '0 = unable, 5 = major help, 10 = minor help, 15 = independent' },
        { label: 'Mobility', name: 'mobility', range: '0 = immobile, 5 = wheelchair independent, 10 = walks with help, 15 = independent' },
        { label: 'Stairs', name: 'stairs', range: '0 = unable, 5 = needs help, 10 = independent' },
    ];
    const chestShapeObservationItems = [
        { label: 'Normal', name: 'normal' },
        { label: 'Barrel Chest', name: 'barrelChest' },
        { label: 'Kyphosis', name: 'kyphosis' },
        { label: 'Pectus Excavatum', name: 'pectusExcavatum' },
        { label: 'Pectus Carinatum', name: 'pectusCarinatum' },
    ];
    const chestMotionItems = [

        { label: 'A', name: 'a' },
        { label: 'B', name: 'b' },

    ];
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Specific validation based on the field name
        switch (name) {
            case "name":
            case "aggFactor":
            case "relFactor":
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
            case "complaint":
            case "address":
                if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/.test(value)) {
                    setPatient((prevPatient) => ({
                        ...prevPatient,
                        [name]: value,
                    }));
                } else {
                    alert("Please enter only alphanumeric characters and special characters for the field.");
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

    const handleOutPatientInputChange = (e) => {
        const { name, value } = e.target;

        const updatedOutPatientBill = [...patient.outPatientBill];

        switch (name) {
            case 'mobileNo':
                if (/^\d{0,12}$/.test(value)) {
                    updatedOutPatientBill[0] = {
                        ...updatedOutPatientBill[0],
                        [name]: value,
                    };
                } else {
                    alert("Please enter a valid mobile number with a maximum of 12 digits.");
                }
                break;

            case 'billAmount':
                if (/^\d{0,8}$/.test(value)) {
                    updatedOutPatientBill[0] = {
                        ...updatedOutPatientBill[0],
                        [name]: value,
                    };
                } else {
                    alert("Please enter a valid amount with a maximum of 8 digits.");
                }
                break;

            case 'serviceName':
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
                if (propertyName.endsWith('Bill') || propertyName === 'otherExpenses') {
                    sum += parseFloat(updatedInPatientBill[0][propertyName]) || 0;
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
                    alert(`Please enter a valid ${name} with a maximum of 5 digits.`);
                }
                break;

            case 'admissionDate':
            case 'dischargeDate':
                updatedInPatientBill[0] = {
                    ...updatedInPatientBill[0],
                    [name]: value,
                };

                const admissionDate = new Date(updatedInPatientBill[0].admissionDate);
                const dischargeDate = new Date(updatedInPatientBill[0].dischargeDate);


                if (!isNaN(admissionDate.getTime()) && !isNaN(dischargeDate.getTime())) {
                    const timeDifference = dischargeDate.getTime() - admissionDate.getTime();
                    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

                    updatedInPatientBill[0] = {
                        ...updatedInPatientBill[0],
                        totalDays: daysDifference.toString(),
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
        updatedInPatientBill[0] = {
            ...updatedInPatientBill[0],
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
        if (ptype === "outpatient") {
            setCreateFreshOverlayVisible(true);
        } else {
            setCreateFreshOverlayVisible(true);
        }
    }


    const validatemobileNo = (number) => {
        const digitCount = number.replace(/\D/g, '').length; // Count only digits

        // Check if the number of digits is between 6 and 11
        if (digitCount > 5 && digitCount < 12) {
            setVerifiedMobileNo(true);
        } else {
            setVerifiedMobileNo(false);
            alert("Please enter the valid mobile number and create record.");
        }
    };
    const handleObservationCheckboxChange = (observationType, value) => {
        setPatient((prevPatient) => {
            const updatedPatient = { ...prevPatient };
            updatedPatient.observation[observationType] = {
                ...prevPatient.observation[observationType],
                [value]: !prevPatient.observation[observationType][value],
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

        // Additional logic if needed
        // For example, you can update the state or perform other actions based on the pain level.
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
    const handlePostMedicalHistoryCheckboxChange = (area) => {
        setPatient((prevPatient) => ({
            ...prevPatient,
            postMedicalHistory: {
                ...prevPatient.postMedicalHistory,
                [area]: !prevPatient.postMedicalHistory[area],
            },
        }));
    };
    const allowedMotions = {
        cervical: ['flexion', 'extension', 'lateralRotation'],
        shoulder: ['flexion', 'extension', 'abduction', 'adduction', 'externalRotation', 'internalRotation'],
        elbow: ['flexion', 'extension', 'supination', 'pronation'],
        wrist: ['flexion', 'extension'],
        hip: ['flexion', 'extension', 'abduction', 'adduction', 'externalRotation', 'internalRotation'],
        knee: ['flexion', 'extension'],
        ankle: ['dorsiFlexion', 'plantarFlexion', 'inversion', 'eversion'],
    };

    const handleRangeOfMotionChange = (joint, motion, side, value) => {
        console.log("lklklklkl::::::", joint, motion, side, value)
        setPatient((prevPatient) => {
            const updatedRangeOfMotion = { ...prevPatient.rangeOfMotion };
            const motionIndex = rangeOfMotionItems.findIndex((item) => item.name === motion);

            if (motionIndex !== -1 && value >= 0 && value <= 1000) {
                updatedRangeOfMotion[joint] = updatedRangeOfMotion[joint].map((motionItem, index) => {
                    if (index === motionIndex) {
                        return {
                            ...motionItem,
                            [motion]: {
                                ...motionItem[motion],
                                [side]: value,
                            },
                        };
                    }
                    return motionItem;
                });
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
            if (column === 'normal') {
                updatedCoordination[coordinationType].abnormal = false;
            } else if (column === 'abnormal') {
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
            if (column === 'normal') {
                updatedStandingWalking[standingWalkingType].abnormal = false;
            } else if (column === 'abnormal') {
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
            if (column === 'normal') {
                updatedBalance[functionType].abnormal = false;
            } else if (column === 'abnormal') {
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
            if (column === 'normal') {
                updatedHandFunction[functionType].abnormal = false;
            } else if (column === 'abnormal') {
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
            if (column === 'normal') {
                updatedPrehension[prehensionType].abnormal = false;
            } else if (column === 'abnormal') {
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
                ...Object.fromEntries(Object.entries(prevPatient.rpe).map(([key, value]) => [key, key === point])),
            },
        }));
    };
    const handleBordRatingCheckboxChange = (rating) => {
        setPatient((prevPatient) => ({
            ...prevPatient,
            brpe: {
                ...Object.fromEntries(Object.entries(prevPatient.brpe).map(([key, value]) => [key, key === rating])),
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
            if (category === 'normal') {
                updatedGeneralObservation[observation].abnormal = false;
            } else if (category === 'abnormal') {
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
            if (category === 'normal') {
                updatedChestObservation[observation].abnormal = false;
            } else if (category === 'abnormal') {
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
            const updatedChestShape = { ...prevPatient.chestShapeObservation.chestShape };

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
            case 'days':
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
                    alert('Please enter numbers only.');
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
            case 'date':
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
            startDate: '',
            endDate: '',
            days: '',
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

    const handleChestMotionInputChange = (field, value) => {

        switch (field) {
            case 'middleLobeLingulaValues':
            case 'upperLobeValues':
            case 'lowerLobeValues':
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
                    alert('Please enter numbers only.');
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
        if (/^\d*$/.test(value)) {
            // Only set the mobile number if it contains only numbers
            setMobileNo(value);
        } else {
            // If the entered value contains non-numeric characters, alert the user
            alert('Please enter numbers only for the mobile number.');
        }
    };
    const handleSearch = async () => {
        setCloseDetails(false);

        try {
            // Replace 'https://saai-physio-api.vercel.app/api/find_record' with your actual endpoint
            // Assuming the backend returns the patient record
            const response = await axios.get('https://saai-physio-api.vercel.app/api/find_basic_record', {
                params: {
                    mobileNo// Filter by institute_name
                }
            });
            foundPatientBasicRecord = response.data;

            setFounded(true);
            setFirstRow(foundPatientBasicRecord.planTreatment[0].patientType === "choose type");
            console.log("patient ::::", foundPatientBasicRecord);
            setPatient(foundPatientBasicRecord);
            // Introduce a delay of 500 milliseconds (adjust as needed)
            await delay(500);
            // fetchPatienRecord(foundPatientBasicRecord.mobileNo);
            setError('');
        } catch (error) {
            alert("poda venna");
            setPatientBasicRecord(null);
            setError('Patient record not found. Please check the mobile number.');
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

    // useEffect(() => {
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


    console.log("in patient billlllllllll", patient, firstRow);


    return (
        <div className='new-record-main-container'>


            <h2>Find Existing Record</h2>
            <label htmlFor="mobileNo">Mobile Number:</label>
            <div class="input-container">
                <input type="text" id="mobileNo" value={mobileNo} onChange={handleMobileNumberChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            {patient.mobileNo !== "" && (
                <div>
                    <div>{patient &&
                        <div>
                            <label>Name : </label>{patient.name}<br></br>
                            <label>Gender : </label>{patient.gender}<br></br>
                            <label>Age : </label>{patient.age}<br></br>
                            <label>Date Of Birth : </label>{patient.dateOfBirth}<br></br>
                            <label>Mobile Number : </label>{patient.mobileNo}<br></br>
                            <label>Occupation : </label>{patient.occupation}<br></br>
                            <label>Address : </label>{patient.address}<br></br>
                            <label>Complaint : </label>{patient.complaint}<br></br>
                            <label>Uhid : </label>{patient.uhid}<br></br>
                        </div>
                    }</div>
                    <div className="container">

                    </div>
                    <div className="post-medical-history">
                        <div className="title">Post Medical History</div>
                        <br /><br />
                        <div className="checkbox-grid">
                            {Object.keys(patient.postMedicalHistory).map((area) => (
                                <label key={area} className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="area"
                                        value={area}
                                        checked={patient.postMedicalHistory[area]}
                                        onChange={() => handlePostMedicalHistoryCheckboxChange(area)}
                                    />
                                    <p className="box">{area}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="assessment">
                        <div className="title">Pain Assessment Scale</div>
                        <form>
                            <legend>Choose the level of pain:</legend>
                            <div className="range-value-container">
                                <input
                                    type="range"
                                    name="painLevel"
                                    min="0"
                                    max="10"
                                    value={patient.painAssessment.beforeTreatment.level}
                                    step="1"
                                    onChange={handlePainLevelChange}
                                />                        <div className="scale">
                                    <div className="scale-value" style={{ "--value": 0 }}>
                                        <p>0</p>
                                        <img src="./uploads/pain-level-0.png" />
                                        <p>no pain</p>
                                    </div>

                                    <div className="scale-value" style={{ "--value": 1 }}>1</div>
                                    <div className="scale-value" style={{ "--value": 2 }}>
                                        <p>2</p>
                                        <img src="./uploads/pain-level-2.png" />
                                        <p>mild</p>

                                    </div>
                                    <div className="scale-value" style={{ "--value": 3 }}>3</div>
                                    <div className="scale-value" style={{ "--value": 4 }}>
                                        <p>4</p>
                                        <img src="./uploads/pain-level-4.png" />
                                        <p>moderate</p>

                                    </div>
                                    <div className="scale-value" style={{ "--value": 5 }}>5</div>
                                    <div className="scale-value" style={{ "--value": 6 }}>
                                        <p>6</p>
                                        <img src="./uploads/pain-level-6.png" />
                                        <p>severe</p>

                                    </div>
                                    <div className="scale-value" style={{ "--value": 7 }}>7</div>
                                    <div className="scale-value" style={{ "--value": 8 }}>
                                        <p>8</p>
                                        <img src="./uploads/pain-level-8.png" />
                                        <p>very severe</p>

                                    </div>
                                    <div className="scale-value" style={{ "--value": 9 }}>9</div>
                                    <div className="scale-value" style={{ "--value": 10 }}>
                                        <p>10</p>
                                        <img src="./uploads/pain-level-10.png" />
                                        <p>worst pain</p>
                                    </div>
                                </div>
                            </div>
                            <div id="result"></div>
                        </form>
                    </div>
                    <div className="painregion">
                        <div className="title">Pain Region</div>
                        <br />
                        <br />

                        <div className="checkbox-grid">
                            {Object.keys(patient.painRegion).map((area) => (
                                <label key={area} className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="area"
                                        value={area}
                                        checked={patient.painRegion[area]}
                                        onChange={() => handleCheckboxChange(area)}
                                    />
                                    <p className="box">{area}</p>
                                </label>
                            ))}
                        </div>
                        <br />
                        <br />

                        <div className="container-history">
                            <form action="#">
                                <div className="form-details">
                                    <div className="form-box">
                                        <span className="requirements">Aggrivating Factor</span>
                                        <input
                                            type="text"
                                            name="aggFactor"
                                            placeholder="Enter your Aggrivating Factor"
                                            value={patient.aggFactor}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-box">
                                        <span className="requirements">Relieving Factor</span>
                                        <input
                                            type="text"
                                            name="relFactor"
                                            placeholder="Enter your Relieving Factor"
                                            value={patient.relFactor}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-box">
                                        <span className="requirements">Duration</span>
                                        <input
                                            type="text"
                                            name="duration"
                                            placeholder="Enter your duration of pain"
                                            value={patient.duration}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-box">
                                        <span className="requirements">Onset</span>
                                        <select
                                            id="onset"
                                            name="onset"
                                            value={patient.onset}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="choose">Choose</option>
                                            <option value="sudden">Sudden</option>
                                            <option value="gradual">Gradual</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="container-vitalsign">
                        <div className="title">Vital Sign</div>
                        <form action="#">
                            <div className="user-data">
                                <div className="input-value">
                                    <span className="data">BP</span>
                                    <input
                                        type="text"
                                        name="BP"
                                        placeholder="Enter your bp"
                                        value={patient.vitalSign.BP}
                                        onChange={handleVitalInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-value">
                                    <span className="data">RR</span>
                                    <input
                                        type="text"
                                        name="RR"
                                        placeholder="Enter your rr"
                                        value={patient.vitalSign.RR}
                                        onChange={handleVitalInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-value">
                                    <span className="data">HR</span>
                                    <input
                                        type="text"
                                        name="HR"
                                        placeholder="Enter your hr"
                                        value={patient.vitalSign.HR}
                                        onChange={handleVitalInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-value">
                                    <span className="data">SPO2</span>
                                    <input
                                        type="text"
                                        name="SPO2"
                                        placeholder="Enter your spo2"
                                        value={patient.vitalSign.SPO2}
                                        onChange={handleVitalInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-value">
                                    <span className="data">TEMP</span>
                                    <input
                                        type="text"
                                        name="TEMP"
                                        placeholder="Enter your temp"
                                        value={patient.vitalSign.TEMP}
                                        onChange={handleVitalInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="observation-palpation-container">
                        <div className="title">On Observation</div>
                        <br />
                        <br />

                        <div className="column-one">
                            {["SkinColor", "Deformity", "Redness", "ShinySkin", "OpenWounds"].map((observationItem) => (
                                <label key={observationItem} className="checkBox">
                                    <input
                                        type="checkbox"
                                        name={observationItem.toLowerCase()}
                                        value={observationItem}
                                        checked={patient.observation.onObservation[observationItem]}
                                        onChange={(e) => handleObservationCheckboxChange("onObservation", e.target.value)}
                                    />
                                    <p className="box-value">{observationItem}</p>
                                </label>
                            ))}
                        </div>
                        <br />
                        <br />
                        <br />

                        <div className="title">On Palpation</div>
                        <br />
                        <br />

                        <div className="column-two">
                            {["Tenderness", "Warmth", "Swelling", "Odema"].map((palpationItem) => (
                                <label key={palpationItem} className="checkBox">
                                    <input
                                        type="checkbox"
                                        name={palpationItem.toLowerCase()}
                                        value={palpationItem}
                                        checked={patient.observation.onPalpation[palpationItem]}
                                        onChange={(e) => handleObservationCheckboxChange("onPalpation", e.target.value)}
                                    />
                                    <p className="box-value">{palpationItem}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="on-examination-container">
                        <div className="title">On Examination:</div>
                        <div className="physical-exam-container">
                            <table className="range-of-motion-table">
                                <caption>RANGE OF MOTION</caption>
                                <thead>
                                    <tr>
                                        <th></th>
                                        {rangeOfMotionJoints.map((joint) => (
                                            <React.Fragment key={joint}>
                                                <th colSpan="2">{joint.toUpperCase()}</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                    <tr>
                                        <th></th>
                                        {rangeOfMotionJoints.map((joint) => (
                                            <React.Fragment key={joint}>
                                                <th>RT</th>
                                                <th>LT</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {['flexion', 'extension', 'abduction', 'adduction', 'eversion', 'inversion', 'externalRotation', 'internalRotation', 'dorsiFlexion', 'plantarFlexion', 'supination', 'pronation', 'lateralRotation'].map((motion, index) => (
                                        <tr key={motion}>
                                            <td>{motion.toUpperCase()}</td>
                                            {rangeOfMotionJoints.map((joint) => (
                                                <React.Fragment key={joint}>
                                                    {['rt', 'lt'].map((side) => (
                                                        <React.Fragment key={side}>
                                                            <td>
                                                                {founded && (
                                                                    <>

                                                                        <input
                                                                            type="number"
                                                                            name={joint + '-' + motion + '-' + side}
                                                                            value={patient.rangeOfMotion[joint][index][motion][side] ? patient.rangeOfMotion[joint][index][motion][side] : 0}
                                                                            onChange={(e) => handleRangeOfMotionChange(joint, motion, side, parseInt(e.target.value))}
                                                                            placeholder={allowedMotions[joint] && allowedMotions[joint].includes(motion) ? "0" : "-"}
                                                                            disabled={!allowedMotions[joint] || !allowedMotions[joint].includes(motion)}
                                                                        />
                                                                    </>
                                                                )}
                                                                {!founded && (
                                                                    <input
                                                                        type="number"
                                                                        name={joint + '-' + motion + '-' + side}
                                                                        onChange={(e) => handleRangeOfMotionChange(joint, motion, side, parseInt(e.target.value))}
                                                                        placeholder={allowedMotions[joint] && allowedMotions[joint].includes(motion) ? "0" : "-"}
                                                                        disabled={!allowedMotions[joint] || !allowedMotions[joint].includes(motion)}
                                                                    />
                                                                )}
                                                            </td>

                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="muscle-power-table">
                                <caption>MUSCLE POWER</caption>
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
                                    {musclePowerItems.map((item) => (
                                        <tr key={item.label}>
                                            <td>{item.label}</td>
                                            {["motor", "sensory"].map((category) => (
                                                ["rt", "lt"].map((side) => (
                                                    <React.Fragment key={category + side}>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                name={item.name + "-" + side + "-" + category}
                                                                value={patient.musclePower[item.name][side][category]}
                                                                onChange={(e) => handleMusclePowerChange(item.name, side, category, parseInt(e.target.value))}
                                                                placeholder="0"
                                                            />
                                                        </td>

                                                    </React.Fragment>
                                                ))
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="coordination-container">
                        <table className="coordination-table">

                            <caption>COORDINATION</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Normal</th>
                                    <th>Abnormal</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coordinationItems.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>
                                        {['normal', 'abnormal'].map((column) => (
                                            <td key={column}>
                                                <input
                                                    type="checkbox"
                                                    name={item.name + '-' + column}
                                                    checked={patient.coordination[item.name][column]}
                                                    onChange={() => handleCoordinationCheckboxChange(item.name, column)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="text"
                                                value={patient.coordination[item.name].remarks}
                                                onChange={(event) => handleRemarksChange(item.name, event)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <br></br>
                        <br></br>
                        <br></br>

                        <table className="standing-walking-table">
                            <caption>STANDING AND WALKING</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Normal</th>
                                    <th>Abnormal</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standingWalkingItems.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>
                                        {['normal', 'abnormal'].map((column) => (
                                            <td key={column}>
                                                <input
                                                    type="checkbox"
                                                    name={item.name + '-' + column}
                                                    checked={patient.standingWalking[item.name][column]}
                                                    onChange={() => handleStandingWalkingCheckboxChange(item.name, column)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="text"
                                                value={patient.standingWalking[item.name].remarks}
                                                onChange={(event) => handleEquilibriumRemarksChange(item.name, event)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    <div className="balance-container">
                        <div className="title">ON CHECKING</div>

                        <table className="balance-table">
                            <caption>BALANCE</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Normal</th>
                                    <th>Abnormal</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balanceItems.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>
                                        {['normal', 'abnormal'].map((column) => (
                                            <td key={column}>
                                                <input
                                                    type="checkbox"
                                                    name={item.name + '-' + column}
                                                    checked={patient.balance[item.name][column]}
                                                    onChange={() => handleBalanceCheckboxChange(item.name, column)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="text"
                                                value={patient.balance[item.name].remarks}
                                                onChange={(event) => handleBalanceRemarksChange(item.name, event)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <div className='hand-function-container'>
                            <table className="hand-function-table">
                                <caption>HAND FUNCTION</caption>
                                <thead>
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
                                            {['normal', 'abnormal'].map((column) => (
                                                <React.Fragment key={column}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            name={item.name + '-' + column}
                                                            checked={patient.handFunction[item.name][column]}
                                                            onChange={() => handleHandFunctionCheckboxChange(item.name, column)}
                                                        />
                                                    </td>
                                                </React.Fragment>
                                            ))}
                                            <td>
                                                <input
                                                    type="text"
                                                    value={patient.handFunction[item.name].remarks}
                                                    onChange={(event) => handleHandFunctionRemarksChange(item.name, event)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            <table className="prehension-table">
                                <caption>PREHENSION</caption>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Normal</th>
                                        <th>Abnormal</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prehensionItems.map((item) => (
                                        <tr key={item.label}>
                                            <td>{item.label}</td>
                                            {['normal', 'abnormal'].map((column) => (
                                                <React.Fragment key={column}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            name={item.name + '-' + column}
                                                            checked={patient.prehension[item.name][column]}
                                                            onChange={() => handlePrehensionCheckboxChange(item.name, column)}
                                                        />
                                                    </td>
                                                </React.Fragment>
                                            ))}
                                            <td>
                                                <input
                                                    type="text"
                                                    value={patient.prehension[item.name].remarks}
                                                    onChange={(event) => handlePrehensionRemarksChange(item.name, event)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                    <div className="subjective-assessment-container">
                        <div className="title">SUBJECTIVE ASSESSMENT</div>
                        <table className="subjective-assessment-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Duration</th>
                                    <th>Severity</th>
                                    <th>Pattern</th>
                                    <th>Associated factors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(patient.subjectiveAssessment).map((symptom) => (
                                    <tr key={symptom}>
                                        <td>{symptom}</td>
                                        {['duration', 'severity', 'pattern', 'associatedFactors'].map((field) => (
                                            <td key={field}>
                                                {field === 'severity' ? (
                                                    <select
                                                        value={patient.subjectiveAssessment[symptom][field]}
                                                        onChange={(event) => handleSeverityChange(symptom, event)}
                                                    >
                                                        <option value="">   Severity</option>
                                                        {severityOptions.map((option) => (
                                                            <option key={option} value={option.toLowerCase()}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : field === 'duration' ? (
                                                    <input
                                                        type="text"
                                                        value={patient.subjectiveAssessment[symptom][field]}
                                                        onChange={(event) => handleTextChange(symptom, field, event)}
                                                    />
                                                ) : field === 'associatedFactors' && symptom === 'sputumHemoptysis' ? (
                                                    <select
                                                        value={patient.subjectiveAssessment.sputumHemoptysis.hemoptysisType}
                                                        onChange={(e) => handleHemoptysisTypeChange("sputumHemoptysis", e)}
                                                    >
                                                        <option value="">Type</option>
                                                        {hemoptysisOptions.map((option) => (
                                                            <option key={option} value={option.toLowerCase()}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={patient.subjectiveAssessment[symptom][field]}
                                                        onChange={(event) => handleTextChange(symptom, field, event)}
                                                    />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="rpe-table-container">
                        <div className="title">RATE OF PERCEIVED EXERTION</div>
                        <table className="rpe-table">
                            <thead>
                                <tr>
                                    <th>Point</th>
                                    <th>Effort</th>
                                    <th>Description</th>
                                    <th>% of Max HR</th>
                                    <th>Point Got</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rpeData.map((data) => (
                                    <tr key={data.point}>
                                        <td>{data.point}</td>
                                        <td>{data.effort}</td>
                                        <td>{data.description}</td>
                                        <td>{data.maxHRPercentage}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={`point${data.point}`}
                                                checked={patient.rpe[`point${data.point}`]}
                                                onChange={() => handlePointCheckboxChange(`point${data.point}`)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                        <div className="title">BORD RATE OF PERCEIVED EXERTION (BRPE SCALE)</div>

                        <table className="brpe-table">
                            <thead>
                                <tr>
                                    <th>Rating</th>
                                    <th>Description</th>
                                    <th>Effort%</th>
                                    <th>Rating Got</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brpeData.map((data) => (
                                    <tr key={data.rating}>
                                        <td>{data.rating}</td>
                                        <td>{data.description}</td>
                                        <td>{data.effortPercentage}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={`rating${data.rating}`}
                                                checked={patient.brpe[`rating${data.rating}`]}
                                                onChange={() => handleBordRatingCheckboxChange(`rating${data.rating}`)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="objective-assessment-container">
                        <div className="title">OBJECTIVE ASSESSMENT</div>
                        <table className="general-observation-table">
                            <caption>General Observation</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Normal</th>
                                    <th>Abnormal</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generalObservationItems.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>
                                        {['normal', 'abnormal'].map((category) => (
                                            <React.Fragment key={category}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name={item.name + `-${category}`}
                                                        checked={patient.generalObservation[item.name][category]}
                                                        onChange={() => handleGeneralObservationCheckboxChange(item.name, category)}
                                                    />
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            <input
                                                type="text"
                                                name={item.name + '-remarks'}
                                                value={patient.generalObservation[item.name].remarks}
                                                onChange={(e) => setPatient((prevPatient) => ({
                                                    ...prevPatient,
                                                    generalObservation: {
                                                        ...prevPatient.generalObservation,
                                                        [item.name]: {
                                                            ...prevPatient.generalObservation[item.name],
                                                            remarks: e.target.value,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <table className="chest-observation-table">
                            <caption>Observation of Chest</caption>
                            <thead>
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
                                                type="checkbox"
                                                name={item.name + '-normal'}
                                                checked={patient.chestObservation[item.name].normal}
                                                onChange={() => handleChestObservationCheckboxChange(item.name, 'normal')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={item.name + '-abnormal'}
                                                checked={patient.chestObservation[item.name].abnormal}
                                                onChange={() => handleChestObservationCheckboxChange(item.name, 'abnormal')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name={item.name + '-remarks'}
                                                value={patient.chestObservation[item.name].remarks}
                                                onChange={(e) => setPatient((prevPatient) => ({
                                                    ...prevPatient,
                                                    chestObservation: {
                                                        ...prevPatient.chestObservation,
                                                        [item.name]: {
                                                            ...prevPatient.chestObservation[item.name],
                                                            remarks: e.target.value,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <img className='chest-shapes-img' src="./uploads/chest-shapes.PNG" />
                        <table className="chest-observation-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {chestShapeObservationItems.map((item) => (
                                        <th key={item.name}>{item.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Chest Shape</td>
                                    {chestShapeObservationItems.map((item) => (
                                        <td key={item.name}>
                                            <input
                                                type="checkbox"
                                                name={`chestShape-${item.name}`}
                                                checked={patient.chestShapeObservation.chestShape[item.name]}
                                                onChange={() => handleChestShapeObservationCheckboxChange(item.name)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <br />
                        <br />
                        {/*<table className="chest-motion-observation-table">
                        <caption>Observation of Chest Motion</caption>
                        <thead>
                            <tr>
                                <th>Motion Type</th>
                                {chestMotionItems.map((item) => (
                                    <th key={item.name}>{item.label}</th>
                                ))}
                                <th>Values</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patient.chestMotionObservation.map((item) => (
                                <tr key={item}>
                                    <td>{item}</td>
                                    {['normal', 'abnormal'].map((category) => (
                                        <React.Fragment key={category}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name={item.name + `-${category}`}
                                                    checked={patient.chestObservation[item.name][category]}
                                                    onChange={() => handleChestMotionCheckboxChange(item.name, category)}
                                                />
                                            </td>
                                        </React.Fragment>
                                    ))}
                                    <td>
                                        <input
                                            type="text"
                                            name='values'
                                            value={patient.chestObservation[item.name].values}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                if (/^\d*$/.test(inputValue)) {
                                                    // If the input is a valid number, update the state
                                                    setPatient((prevPatient) => ({
                                                        ...prevPatient,
                                                        chestObservation: {
                                                            ...prevPatient.chestObservation,
                                                            [item.name]: {
                                                                ...prevPatient.chestObservation[item.name],
                                                                values: inputValue,
                                                            },
                                                        },
                                                    }));
                                                } else {
                                                    alert('Please enter numbers only.');
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name={item.name + '-remarks'}
                                            value={patient.chestObservation[item.name].remarks}
                                            onChange={(e) => setPatient((prevPatient) => ({
                                                ...prevPatient,
                                                chestObservation: {
                                                    ...prevPatient.chestObservation,
                                                    [item.name]: {
                                                        ...prevPatient.chestObservation[item.name],
                                                        remarks: e.target.value,
                                                    },
                                                },
                                            }))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
    
                                        </table>*/}

                        <table className="chest-motion-observation-table">
                            <caption>Observation of Chest Motion</caption>
                            <thead>
                                <tr>
                                    <th>MOTION TYPE</th>
                                    {chestMotionItems.map((item) => (
                                        <th key={item.name}>{item.label}</th>
                                    ))}
                                    <th>Values</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Middle Lobe & Lingula Motion</td>
                                    {chestMotionItems.map((item) => (
                                        <td key={item.name}>
                                            <input
                                                type="radio"
                                                name="middleLobeLingulaMotion"
                                                value={item.name}
                                                checked={patient.chestMotionObservation.middleLobeLingulaMotion === item.name}
                                                onChange={() => handleChestMotionCheckboxChange('middleLobeLingulaMotion', item.name)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <input
                                            type="text"
                                            name="middleLobeLingulaValues"
                                            value={patient.chestMotionObservation.middleLobeLingulaValues}
                                            onChange={(e) => handleChestMotionInputChange('middleLobeLingulaValues', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="middleLobeLingulaRemarks"
                                            value={patient.chestMotionObservation.middleLobeLingulaRemarks}
                                            onChange={(e) => handleChestMotionInputChange('middleLobeLingulaRemarks', e.target.value)}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Upper Lobe Motion</td>
                                    {chestMotionItems.map((item) => (
                                        <td key={item.name}>
                                            <input
                                                type="radio"
                                                name="upperLobeMotion"
                                                value={item.name}
                                                checked={patient.chestMotionObservation.upperLobeMotion === item.name}
                                                onChange={() => handleChestMotionCheckboxChange('upperLobeMotion', item.name)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <input
                                            type="text"
                                            name="upperLobeValues"
                                            value={patient.chestMotionObservation.upperLobeValues}
                                            onChange={(e) => handleChestMotionInputChange('upperLobeValues', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="upperLobeRemarks"
                                            value={patient.chestMotionObservation.upperLobeRemarks}
                                            onChange={(e) => handleChestMotionInputChange('upperLobeRemarks', e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lower Lobe Motion</td>
                                    {chestMotionItems.map((item) => (
                                        <td key={item.name}>
                                            <input
                                                type="radio"
                                                name="lowerLobeMotion"
                                                value={item.name}
                                                checked={patient.chestMotionObservation.lowerLobeMotion === item.name}
                                                onChange={() => handleChestMotionCheckboxChange('lowerLobeMotion', item.name)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <input
                                            type="text"
                                            name="lowerLobeValues"
                                            value={patient.chestMotionObservation.lowerLobeValues}
                                            onChange={(e) => handleChestMotionInputChange('lowerLobeValues', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="lowerLobeRemarks"
                                            value={patient.chestMotionObservation.lowerLobeRemarks}
                                            onChange={(e) => handleChestMotionInputChange('lowerLobeRemarks', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <img className='lobe-img' src="./uploads/lobe.PNG" />
                    </div>
                    <div className="barthel-index-container">
                        <div className="title">The Barthel Index</div>
                        <table className="barthel-index-table">
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Range</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {barthelIndexItems.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>

                                        <td>{item.range}</td>
                                        <td>
                                            <select
                                                value={patient.barthelIndex[item.name].score}
                                                onChange={(e) => handleScoreChange(item.name, parseInt(e.target.value))}
                                            >
                                                {Array.from({ length: patient.barthelIndex[item.name].maxScore + 1 }, (_, index) => index).map(
                                                    (score) => (
                                                        <option key={score} value={score}>
                                                            {score}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td>Total Scores</td>
                                    <td>
                                        {Object.values(patient.barthelIndex).reduce((total, activity) => total + activity.score, 0)}
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <>
                        <h4>Plan Of Treatment</h4>


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
                            {patient && (
                                <>
                                    {firstRow ? (
                                        <table className="treatment-table">

                                            <caption>Treatment Details</caption>
                                            <thead>

                                                <tr>
                                                    {console.log("first ")}

                                                    <th>Date</th>
                                                    <th>No. of Days</th>
                                                    <th>Patient Type</th>
                                                    {patient.planTreatment[0].patientType === 'inpatient' ? (
                                                        Object.keys(patient.planTreatment[0]).slice(4).map((category, index) => (
                                                            <th key={index}>{category}</th>
                                                        ))
                                                    ) : (
                                                        Object.keys(patient.planTreatment[0]).slice(4, -1).map((category, index) => (
                                                            <th key={index}>{category}</th>
                                                        ))
                                                    )
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patient.planTreatment.map((plan, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {/*<input
                                                type="date"
                                                name={`date_${index}`}
                                                value={plan.date}
                                                onChange={(e) => handlePlanChange(index, 'date', e.target.value)}
                                            />*/}
                                                            {plan.patientType !== "inpatient" && plan.patientType !== "choose type" && (
                                                                <label>
                                                                    Appointment Date:
                                                                    <input
                                                                        type="date"
                                                                        name="appointmentDate"
                                                                        value={patient.outPatientBill[0].appointmentDate}
                                                                        onChange={handleOutPatientInputChange}
                                                                    />
                                                                </label>
                                                            )}
                                                            {plan.patientType === "inpatient" && (
                                                                <div>
                                                                    <label>
                                                                        Admission Date:
                                                                        <input
                                                                            type="date"
                                                                            name="admissionDate"
                                                                            value={patient.inPatientBill[0].admissionDate}
                                                                            onChange={handleInPatientInputChange}
                                                                        />
                                                                    </label>
                                                                    <label>
                                                                        Discharge Date:
                                                                        <input
                                                                            type="date"
                                                                            name="dischargeDate"
                                                                            value={patient.inPatientBill[0].dischargeDate}
                                                                            onChange={handleInPatientInputChange}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {/*<input
                                                type="text"
                                                name={`days${index}`}
                                                value={plan.days}
                                                onChange={(e) => handlePlanChange(index, 'days', e.target.value)}
                                            />*/}
                                                            {plan.patientType !== "inpatient" && plan.patientType !== "choose type" && (
                                                                <input
                                                                    type="text"
                                                                    value={1}
                                                                // onChange={(e) => handleInputChange(index, "days", 1)}
                                                                />
                                                            )}
                                                            {plan.patientType === "inpatient" && (
                                                                <input
                                                                    type="text"
                                                                    value={patient.inPatientBill[0].totalDays}
                                                                    onChange={handleInPatientInputChange}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={plan.patientType}
                                                                onChange={(e) => handlePatientTypeChange(e.target.value)}
                                                            >
                                                                <option value="">Select Patient Type</option>
                                                                <option value="outpatient">Out-Patient</option>
                                                                <option value="inpatient">In-Patient</option>
                                                            </select>

                                                        </td>
                                                        {patient.planTreatment[0].patientType === 'inpatient' ? (
                                                            Object.keys(plan).slice(4).map((category, colIndex) => (
                                                                <td key={colIndex}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name={`${category}_${index}`}
                                                                        checked={plan[category]}
                                                                        onChange={() => handlePlanCheckboxChange(index, category)}
                                                                    />
                                                                </td>
                                                            ))
                                                        ) : (
                                                            Object.keys(plan).slice(4, -1).map((category, colIndex) => (
                                                                <td key={colIndex}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name={`${category}_${index}`}
                                                                        checked={plan[category]}
                                                                        onChange={() => handlePlanCheckboxChange(index, category)}
                                                                    />
                                                                </td>
                                                            ))
                                                        )
                                                        }
                                                        <td>
                                                            <div>
                                                                <button onClick={() => handleCreateFreshBill(plan.patientType)}>Create Fresh Bill</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) :
                                        (
                                            <>
                                                <button onClick={handleEditClick}>
                                                    {isEditing ? "Done Editing" : "Edit"}
                                                </button>
                                                {isEditing &&
                                                    <button onClick={handleAddRow}>Add Row</button>
                                                }
                                                <div className='table-wrap'>
                                                <table className="planed-treatment">
                                                    <caption>Planned Treatment</caption>
                                                    {console.log("fetched rows", patient.planTreatment)}
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
                                                        {patient.planTreatment.map((plan, index) => (
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
                                                                            <option value="choose type">Select Patient Type</option>
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
                                                                        patient.planTreatment[index - 1].startDate === plan.startDate
                                                                        ? null
                                                                        : (
                                                                            <>
                                                                                {!plan.isNewRow && (
                                                                                    <>
                                                                                        <button onClick={() => handleViewBill(index)}>
                                                                                            View Bill
                                                                                        </button>
                                                                                        <button onClick={() => { handleInOutCreateNewInBill("inpatient", plan.startDate, plan.endDate) }}>
                                                                                            Create New Inpatient Bill
                                                                                        </button>
                                                                                        <button onClick={() => { handleInOutCreateNewOutBill("outpatient", plan.startDate) }}>
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
                                                </div>
                                            </>
                                        )}
                                </>
                            )}
                        </div>
                        {/* 
                {console.log("next", nextRowPatientType)}
                {console.log("curr", currentRowPatientType)}
                {console.log("createoverlay", createoverlayVisible)}
                {console.log("plan", patient.planTreatment[0].patientType)} */}


                        {createoverlayVisible && (
                            <>
                                {(nextRowPatientType === "outpatient" || currentRowPatientType === "outpatient") && (
                                    <div>
                                        {console.log("newxtrowoverlay")}
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
                                                        value={outPatientBillDetails.outBill[0].serviceName}
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
                                                        value={outPatientBillDetails.outBill[0].paymentMode}
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
                                                        value={outPatientBillDetails.outBill[0].billAmount}
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
                                        {console.log("newxtrowoverlay")}
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

                        {createFreshOverlayVisible && (
                            <>

                                {(patient.planTreatment[0].patientType === "outpatient" && patient.planTreatment.length == 1 && !patient.planTreatment.isNewRow) && (
                                    <div>
                                        {console.log("patienttype overlay")}
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
                                                        value={patient.outPatientBill[0].serviceName}
                                                        onChange={handleOutPatientInputChange}
                                                    />
                                                </label>
                                            </div>

                                            {/* Billing Information */}
                                            <div className="billing-info">
                                                <label>
                                                    Payment Mode:
                                                    <select
                                                        name="paymentMode"
                                                        value={patient.outPatientBill[0].paymentMode}
                                                        onChange={handleOutPatientInputChange}
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
                                                        value={patient.outPatientBill[0].billAmount}
                                                        onChange={handleOutPatientInputChange}
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

                                {(patient.planTreatment[0].patientType === "inpatient" && patient.planTreatment.length == 1 && !patient.planTreatment[0].isNewRow) && (
                                    <div>
                                        {console.log("patienttype overlay")}
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
                                                            value={patient.inPatientBill[0].roomNumber}
                                                            onChange={handleInPatientInputChange}
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
                                                                value={patient.inPatientBill[0].admissionDate}
                                                                onChange={handleInPatientInputChange}

                                                            />
                                                        </label>
                                                        <label>
                                                            Discharge Date:
                                                            <input
                                                                type="date"
                                                                name="dischargeDate"
                                                                value={patient.inPatientBill[0].dischargeDate}
                                                                onChange={handleInPatientInputChange}
                                                            />
                                                        </label>
                                                        <label>
                                                            Total Days:
                                                            <input
                                                                type="text"
                                                                name="totalDays"
                                                                value={patient.inPatientBill[0].totalDays}
                                                                onChange={handleInPatientInputChange}
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
                                                                value={patient.inPatientBill[0].visitingBill}
                                                                onChange={handleInPatientInputChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p>Physio Bill</p>
                                                            <input
                                                                type="text"
                                                                name="physioBill"
                                                                value={patient.inPatientBill[0].physioBill}
                                                                onChange={handleInPatientInputChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p>Nursing Bill</p>
                                                            <input
                                                                type="text"
                                                                name="nursingBill"
                                                                value={patient.inPatientBill[0].nursingBill}
                                                                onChange={handleInPatientInputChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p>Other Expenses</p>
                                                            <input
                                                                type="text"
                                                                name="otherExpenses"
                                                                value={patient.inPatientBill[0].otherExpenses}
                                                                onChange={handleInPatientInputChange}
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
                                                        value={patient.inPatientBill[0].paymentMode}
                                                        onChange={handleInPatientInputChange}
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
                                                        value={patient.inPatientBill[0].billAmount}
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

                        {patient && (
                            <>
                                {firstRow ? (
                                    <table>
                                        <caption>Investigation</caption>
                                        {console.log("firstrowinvets", patient.investigation)}
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
                                            {patient.investigation.map((invest, index) => (
                                                <tr key={index}>
                                                    <td><input
                                                        type="date"
                                                        name={`date_${index}`}
                                                        value={invest.date}
                                                        onChange={(e) => handleInvestigationChange(index, 'date', e.target.value)}
                                                    /></td>
                                                    <td><textarea maxLength={50} name='xray' value={invest.xray} onChange={handleInputChange}></textarea></td>
                                                    <td><textarea maxLength={50} name='mri' value={invest.mri} onChange={handleInputChange}></textarea></td>
                                                    <td><textarea maxLength={50} name='others' value={invest.others} onChange={handleInputChange}></textarea></td>
                                                    <td><textarea maxLength={50} name='provisionalDiagnosis' value={invest.provisionalDiagnosis} onChange={handleInputChange}></textarea></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="investigation-treatment">
                                        <caption>Investigation Treatment</caption>
                                        {console.log("newrowinvets", patient.investigation)}

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
                                            {patient.investigation.map((invest, index) => (
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
                            </>

                        )}

                        {isEditing && (
                            <div>
                                <button onClick={handleInOutUpdateInvestigation}>
                                    Update Investigation
                                </button>
                            </div>
                        )}

                    </>
                    <div>
                        <button onClick={createPatientRecord}>Create record</button>
                    </div>
                    <p>{appMessage}</p>
                </div>
            )}

        </div>
    );


};

export default UpdateRecord;
