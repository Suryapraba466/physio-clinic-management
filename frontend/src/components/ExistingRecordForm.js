import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillDetails from './BillDetails';
import InOutBillRow from './InOutBillRow';

const ExistingRecordForm = ({ onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [patientRecord, setPatientRecord] = useState(null);
    const [error, setError] = useState('');
    const [closeDetails, setCloseDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nextRowPatientType, setNextRowPatientType] = useState('');
    const [viewoverlayVisible, setviewOverlayVisible] = useState(false);
    const [viewoverlayContent, setviewOverlayContent] = useState(null);
    const [createoverlayVisible, setCreateOverlayVisible] = useState(false);
    const [isBillSaved, setIsBillSaved] = useState(false);
    const [inPatientBillDetails, setInPatientBillDetails] = useState({
        inBill: [
            {
                mobileNumber: '',
                roomNumber: '',
                admissionDate: '',
                dischargeDate: '',
                totalDays: '',
                visitingBill: '',
                physioBill: '',
                nursingBill: '',
                otherExpenses: '',
                billAmount: '',
            },
        ],
    });
    const [outPatientBillDetails, setOutPatientBillDetails] = useState({
        outBill: [
            {
                mobileNumber: '',
                appointmentDate: '',
                serviceName: '',
                paymentMode: '',
                billAmount: '',
            },
        ],
    });
    const handleMobileNumberChange = (event) => {
        // Validate if the entered value is a number
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            // Only set the mobile number if it contains only numbers
            setMobileNumber(value);
        } else {
            // If the entered value contains non-numeric characters, alert the user
            alert('Please enter numbers only for the mobile number.');
        }
    };

    const handleSearch = async () => {
        setCloseDetails(false);
        try {
            // Replace 'http://localhost3000/api/find_record' with your actual endpoint
            const response = await axios.get(`https://saai-physio-api.vercel.app/api/find_record?mobileNumber=${mobileNumber}`);
            // Assuming the backend returns the patient record
            const foundPatientRecord = response.data;
            setPatientRecord(foundPatientRecord);
            setError('');
        } catch (error) {
            setPatientRecord(null);
            setError('Patient record not found. Please check the mobile number.');
        }
    };


    
    useEffect(() => {
        if (isEditing) {
            // Fetch the initial data from the backend
            axios.get(`https://saai-physio-api.vercel.app/api/find_record?mobileNumber=${mobileNumber}`)
                .then((response) => {
                    setPatientRecord(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data from backend:', error);
                });
        }
    }, [isEditing, mobileNumber]);
    useEffect(() => {
        if(mobileNumber)
handleSearch();
    }, [createoverlayVisible]);

    const closeOverlay = () => {
        setCreateOverlayVisible(false);
    
        setOutPatientBillDetails({
          outBill: [
            {
              mobileNumber: "",
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
              mobileNumber: "",
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
        }));
    
        
      };
    
    
    const handleClose = () => {
        setCloseDetails(true);
    }
    const rangeOfMotionItems = [
        { label: "FLEXION", name: "flexion" },
        { label: "EXTENSION", name: "extension" },
        { label: "ABDUCTION", name: "abduction" },
        { label: "ADDUCTION", name: "adduction" },
        { label: "SIDE FLEXION", name: "sideFlexion" },
        { label: "LATERAL ROTATION", name: "lateralRotation" },
        { label: "EXTERNAL ROTATION", name: "externalRotation" },
        { label: "INTERNAL ROTATION", name: "internalRotation" },
        { label: "DORSI FLEXION", name: "dorsiFlexion" },
        { label: "PLANTAR FLEXION", name: "plantarFlexion" },
        { label: "SUPINATION", name: "supination" },
        { label: "PRONATION", name: "pronation" },
        { label: "LATERAL ROTATION", name: "lateralRotation" },
        { label: "EHL", name: "ehl" },
    ];


    const rangeOfMotionJoints = ['cervical', 'shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];
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

    const severityOptions = ['Critical', 'High', 'Medium', 'Low'];
    const hemoptysisOptions = ['Red: Blood', 'Rust: Pneumonia', 'Purple: Neoplasm', 'Yellow: Infected', 'Green: Pus', 'Pink: Pulmonary Oedema'];

    // Range of Motion Items

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

    console.log(patientRecord);

    return (
        <div >
            <div className="existing-record-form">
                <h2>Find Existing Record</h2>
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <div class="input-container">
                    <input type="text" id="mobileNumber" value={mobileNumber} onChange={handleMobileNumberChange} />
                    <button onClick={handleSearch}>Search</button>
                </div>


                {error && <p className="error-message">{error}</p>}

                {patientRecord && !closeDetails && (
                    <div className="patient-details">
                        <h4>Patient Record<span><p></p></span></h4>
                        <div className='about-patient'>
                            <p><strong>Name: </strong>{patientRecord.name}</p>
                            <p><strong>Gender: </strong>{patientRecord.gender}</p>
                            <p><strong>Age: </strong>{patientRecord.age}</p>
                            <p><strong>Mobile Number: </strong>{patientRecord.mobileNo}</p>
                            <p><strong>Occupation: </strong>{patientRecord.occupation}</p>
                            <p><strong>IP/UHID: </strong>{patientRecord.uhid}</p>
                            <p><strong>Complaint: </strong>{patientRecord.complaint}</p>
                            <p><strong>Address: </strong>{patientRecord.address}</p>
                        </div>
                        <h4>Pain Regions:</h4>
                        <div className='about-patient'>
                            {Object.entries(patientRecord.painRegion).map(([region, value]) => (
                                <li key={region}><strong>{region}: </strong>{value ? 'Yes' : 'No'}</li>
                            ))}
                        </div>
                        <h4>Pain Assessment Before Treatment:</h4>
                        <div className='about-patient'>
                            <p><strong>Pain Level: </strong>{patientRecord.painAssessment.beforeTreatment.level}</p>
                        </div>
                        <h4>History and Onset:</h4>
                        <div className='about-patient'>
                            <p><strong>Aggrivating Factor: </strong>{patientRecord.aggFactor}</p>
                            <p><strong>Relieving Factor: </strong>{patientRecord.relFactor}</p>
                            <p><strong>Duration: </strong>{patientRecord.duration}</p>
                            <p><strong>Onset: </strong>{patientRecord.onset}</p>
                        </div>
                        <h4>Post medical history:</h4>
                        <div className='about-patient'>
                            {Object.entries(patientRecord.postMedicalHistory).map(([region, value]) => (
                                <li key={region}><strong>{region}: </strong>{value ? 'Yes' : 'No'}</li>
                            ))}
                        </div>
                        <h4>Vital Sign:</h4>
                        <div className='about-patient'>
                            <p><strong>BP: </strong>{patientRecord.vitalSign.BP}</p>
                            <p><strong>RR: </strong>{patientRecord.vitalSign.RR}</p>
                            <p><strong>HR: </strong>{patientRecord.vitalSign.HR}</p>
                            <p><strong>SPO2: </strong>{patientRecord.vitalSign.SPO2}</p>
                            <p><strong>TEMP: </strong>{patientRecord.vitalSign.TEMP}</p>
                        </div>
                        <h4>Observation:</h4>
                        <div className='about-patient'>
                            <p><strong>Skin Color: </strong>{patientRecord.observation.onObservation.SkinColor ? 'Yes' : 'No'}</p>
                            <p><strong>Deformity: </strong>{patientRecord.observation.onObservation.Deformity ? 'Yes' : 'No'}</p>
                            <p><strong>Redness: </strong>{patientRecord.observation.onObservation.Redness ? 'Yes' : 'No'}</p>
                            <p><strong>Shiny Skin: </strong>{patientRecord.observation.onObservation.ShinySkin ? 'Yes' : 'No'}</p>
                            <p><strong>Open Wounds: </strong>{patientRecord.observation.onObservation.OpenWounds ? 'Yes' : 'No'}</p>
                        </div>
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
                                                            {patientRecord.rangeOfMotion[joint][index][motion][side]}
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
                                                        {patientRecord.musclePower[item.name][side][category]}
                                                    </td>
                                                </React.Fragment>
                                            ))
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* ... Existing code ... */}
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
                                            <React.Fragment key={column}>
                                                <td>
                                                    {patientRecord.coordination[item.name][column] ? 'Yes' : 'No'}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            {patientRecord.coordination[item.name].remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* ... Existing code ... */}
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
                                            <React.Fragment key={column}>
                                                <td>
                                                    {patientRecord.standingWalking[item.name][column] ? 'Yes' : 'No'}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            {patientRecord.standingWalking[item.name].remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ... Existing code ... */}
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
                                            <React.Fragment key={column}>
                                                <td>
                                                    {patientRecord.balance[item.name][column] ? 'Yes' : 'No'}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            {patientRecord.balance[item.name].remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                                    {patientRecord.handFunction[item.name][column] ? 'Yes' : 'No'}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            {patientRecord.handFunction[item.name].remarks}
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
                                                    {patientRecord.prehension[item.name][column] ? 'Yes' : 'No'}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td>
                                            {patientRecord.prehension[item.name].remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="subjective-assessment-table">
                            <caption>SUBJECTIVE ASSESSMENT</caption>
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
                                {Object.keys(patientRecord.subjectiveAssessment).map((symptom) => (
                                    <tr key={symptom}>
                                        <td>{symptom}</td>
                                        {['duration', 'severity', 'pattern', 'associatedFactors'].map((field) => (
                                            <td key={field}>
                                                {field === 'severity' ? (
                                                    patientRecord.subjectiveAssessment[symptom][field]
                                                ) : field === 'associatedFactors' && symptom === 'sputumHemoptysis' ? (
                                                    patientRecord.subjectiveAssessment.sputumHemoptysis.hemoptysisType
                                                ) : (
                                                    patientRecord.subjectiveAssessment[symptom][field]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="rpe-table">
                            <caption>RATE OF PERCEIVED EXERTION</caption>
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
                                            {patientRecord.rpe[`point${data.point}`] ? 'Yes' : 'No'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="brpe-table">
                            <caption>BORD RATE OF PERCEIVED EXERTION (BRPE SCALE)</caption>
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
                                            {patientRecord.brpe[`rating${data.rating}`] ? 'Yes' : 'No'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                        <td>
                                            {patientRecord.generalObservation[item.name].normal ? 'Yes' : 'No'}
                                        </td>
                                        <td>
                                            {patientRecord.generalObservation[item.name].abnormal ? 'Yes' : 'No'}
                                        </td>
                                        <td>
                                            {patientRecord.generalObservation[item.name].remarks}
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
                                            {patientRecord.chestObservation[item.name].normal ? 'Yes' : 'No'}
                                        </td>
                                        <td>
                                            {patientRecord.chestObservation[item.name].abnormal ? 'Yes' : 'No'}
                                        </td>
                                        <td>
                                            {patientRecord.chestObservation[item.name].remarks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="chest-observation-table">
                            <caption>CHEST SHAPE</caption>
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
                                            {patientRecord.chestShapeObservation.chestShape[item.name] ? 'Yes' : 'No'}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
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
                                            {patientRecord.chestMotionObservation.middleLobeLingulaMotion === item.name ? 'Yes' : 'No'}
                                        </td>
                                    ))}
                                    <td>{patientRecord.chestMotionObservation.middleLobeLingulaValues}</td>
                                    <td>{patientRecord.chestMotionObservation.middleLobeLingulaRemarks}</td>
                                </tr>
                                <tr>
                                    <td>Upper Lobe Motion</td>
                                    {chestMotionItems.map((item) => (
                                        <td key={item.name}>
                                            {patientRecord.chestMotionObservation.upperLobeMotion === item.name ? 'Yes' : 'No'}
                                        </td>
                                    ))}
                                    <td>{patientRecord.chestMotionObservation.upperLobeValues}</td>
                                    <td>{patientRecord.chestMotionObservation.upperLobeRemarks}</td>
                                </tr>
                                <tr>
                                    <td>Lower Lobe Motion</td>
                                    {chestMotionItems.map((item) => (
                                        <td key={item.name}>
                                            {patientRecord.chestMotionObservation.lowerLobeMotion === item.name ? 'Yes' : 'No'}
                                        </td>
                                    ))}
                                    <td>{patientRecord.chestMotionObservation.lowerLobeValues}</td>
                                    <td>{patientRecord.chestMotionObservation.lowerLobeRemarks}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="barthel-index-table">
                            <caption>The Barthel Index</caption>
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
                                            {patientRecord.barthelIndex[item.name].score}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td>Total Scores</td>
                                    <td>
                                        {Object.values(patientRecord.barthelIndex).reduce((total, activity) => total + activity.score, 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
  
                            <InOutBillRow patientReco={patientRecord}/>
                            <button onClick={closeOverlay}>Close</button>

                        <div>
                            <BillDetails record={patientRecord} />
                        </div>



                        <button onClick={handleClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExistingRecordForm;
