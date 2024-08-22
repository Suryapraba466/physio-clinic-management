const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');
const { EventEmitter } = require('events');
const progressEmitter = new EventEmitter();

const puppeteer = require('puppeteer');
// const { isValidNumber } = require('libphonenumber-js');

const app = express();
app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(express.json());

//const MONGODB_URI = 'mongodb+srv://Venkatagiriraju:King%40123@kiot.mmjm1ma.mongodb.net/test?retryWrites=true&w=majority';
const MONGODB_URI = 'mongodb+srv://venkatagirirajuearth:King%40123@cluster0.wfzzdgr.mongodb.net/test?retryWrites=true&w=majority';

app.get('/', (req, res) => {
    const message = "saai-clinic-database";
    res.send(`<html><body><h1>${message}</h1></body></html>`);
});

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


console.log('Mongoose connected to MongoDB');

const basicDetails = new mongoose.Schema({
    name: { type: String },
    lastName: { type: String },
    pid: { type: String },
    gender: { type: String },
    age: { type: String }, // Assuming age is stored as a string
    mobileNo: { type: String },
    occupation: { type: String },
    address: { type: String },
    uhid: { type: String },
    bloodGroup: { type: String },
    height: { type: String },
    weight: { type: String },
    complaints: { type: String },
    docr: { type: String },
    clinicName: { type: String, default: '' },
    doctorName: { type: String, default: '' },


    exercise: [
        {
            id: { type: Number, default: 1 },
            exerciseName: { type: String, default: "" },
            equipmentNeeded: { type: String, default: "" },
            frequency: { type: String, default: "" },
            duration: { type: String, default: "" },
            timesRepeated: { type: String, default: "" },
        },
    ],
    medication: [
        {
            id: { type: Number, default: 1 },
            medicineName: { type: String, default: "" },
            duration: { type: String, default: "" },
            timeToTake: { type: String, default: "" },
            morning: { type: Boolean, default: false },
            afternoon: { type: Boolean, default: false },
            night: { type: Boolean, default: false },
            foodPreference: { type: String, default: "" },
        },
    ],
    painRegion: {
        Neck: { type: Boolean, default: false },
        Wrist: { type: Boolean, default: false },
        LowerBack: { type: Boolean, default: false },
        Ankle: { type: Boolean, default: false },
        Shoulder: { type: Boolean, default: false },
        Fingers: { type: Boolean, default: false },
        Hip: { type: Boolean, default: false },
        Toes: { type: Boolean, default: false },
        Elbow: { type: Boolean, default: false },
        UpperBack: { type: Boolean, default: false },
        Knee: { type: Boolean, default: false },
    },
    radiatesThrough: {
        Arms: { type: Boolean, default: false },
        LegsToKnee: { type: Boolean, default: false },
    },
    feelsLike: {
        Numbness: { type: Boolean, default: false },
        Tingling: { type: Boolean, default: false },
        WeakGrip: { type: Boolean, default: false },
    },
    postMedicalHistory: {
        dm: { type: Boolean, default: false },
        htn: { type: Boolean, default: false },
        cad: { type: Boolean, default: false },
        cvd: { type: Boolean, default: false },
        asthma: { type: Boolean, default: false },
        smoking: { type: Boolean, default: false },
        alcohol: { type: Boolean, default: false },
        surgicalHistory: { type: Boolean, default: false },
    },
    painAssessment: {
        beforeTreatment: {
            level: { type: Number, default: 0 },
        },
    },
    aggFactor: { type: String, default: '' },  // Add other properties as needed
    relFactor: { type: String, default: '' },
    duration: { type: String, default: '' },
    onset: { type: String, default: '' },
    vitalSign: {
        BP: { type: String, default: '' },
        RR: { type: String, default: '' },
        HR: { type: String, default: '' },
        SPO2: { type: String, default: '' },
        TEMP: { type: String, default: '' },
    },
    observation: {
        onObservation: {
            SkinColor: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            Deformity: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            Redness: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            ShinySkin: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            OpenWounds: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
        },
        onPalpation: {
            Tenderness: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            Warmth: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            Swelling: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
            Edema: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false } },
        },
    },
    rangeOfMotion: {
        cervical: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },

            },
        ],
        shoulder: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
            // ... other properties
        ],
        elbow: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
            // ... other properties
        ],
        wrist: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
        ],
        hip: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
            // ... other properties
        ],
        knee: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
            // ... other properties
        ],
        ankle: [
            {
                flexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                extension: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                abduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                adduction: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                eversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                inversion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                externalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                internalRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                dorsiFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                plantarFlexion: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                supination: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                pronation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
                lateralRotation: { rt: { type: Number, default: 0 }, lt: { type: Number, default: 0 } },
            },
        ],
    },
    musclePower: {
        cervicalC1C2Flexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        cervicalC3SideFlexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        scapulaC4Elevation: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        shoulderC5Abduction: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        elbowC6FlexionWristExtension: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        elbowC7ExtensionWristFlexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        thumbC8Extension: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        hipL1L2Flexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        kneeL3Extension: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        ankleL4Dorsiflexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        bigToeL5Extension: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        ankleS1PlantarFlexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        kneeS2Flexion: { rt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } }, lt: { motor: { type: Number, default: 0 }, sensory: { type: Number, default: 0 } } },
        // ... other properties
    },
    coordination: {
        fingerToNose: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        fingerOpposition: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        grip: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        pronationSupination: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        reboundTest: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        tappingHand: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        tappingFoot: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        heelToKnee: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        drawingCircleHand: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        drawingCircleFoot: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    standingWalking: {
        normalPosture: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        tandonWalking: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    balance: {
        sitting: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        standing: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        posture: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        gait: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    handFunction: {
        grip: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        grasp: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        release: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    prehension: {
        tipToTip: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        padToPad: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        tipToPad: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    subjectiveAssessment: {
        breathlessness: {
            duration: { type: String, default: '' },
            severity: { type: String, default: '' },
            pattern: { type: String, default: '' },
            associatedFactors: { type: String, default: '' },
        },
        cough: {
            duration: { type: String, default: '' },
            severity: { type: String, default: '' },
            pattern: { type: String, default: '' },
            associatedFactors: { type: String, default: '' },
        },
        sputumHemoptysis: {
            duration: { type: String, default: '' },
            severity: { type: String, default: '' },
            pattern: { type: String, default: '' },
            associatedFactors: { type: String, default: '' },
            hemoptysisType: { type: String, default: '' },
        },
        wheeze: {
            duration: { type: String, default: '' },
            severity: { type: String, default: '' },
            pattern: { type: String, default: '' },
            associatedFactors: { type: String, default: '' },
        },
        chestPain: {
            duration: { type: String, default: '' },
            severity: { type: String, default: '' },
            pattern: { type: String, default: '' },
            associatedFactors: { type: String, default: '' },
        },
        // ... other properties
    },
    rpe: {
        point6: { type: Boolean, default: false },
        point7: { type: Boolean, default: false },
        point8: { type: Boolean, default: false },
        point9: { type: Boolean, default: false },
        point10: { type: Boolean, default: false },
        point11: { type: Boolean, default: false },
        point12: { type: Boolean, default: false },
        point13: { type: Boolean, default: false },
        point14: { type: Boolean, default: false },
        point15: { type: Boolean, default: false },
        point16: { type: Boolean, default: false },
        point17: { type: Boolean, default: false },
    },
    brpe: {
        rating6: { type: Boolean, default: false },
        rating7: { type: Boolean, default: false },
        rating8: { type: Boolean, default: false },
        rating9: { type: Boolean, default: false },
        rating10: { type: Boolean, default: false },
        rating11: { type: Boolean, default: false },
        rating12: { type: Boolean, default: false },
        rating13: { type: Boolean, default: false },
        rating14: { type: Boolean, default: false },
        rating15: { type: Boolean, default: false },
        rating16: { type: Boolean, default: false },
        rating17: { type: Boolean, default: false },
        rating18: { type: Boolean, default: false },
        rating19: { type: Boolean, default: false },
        rating20: { type: Boolean, default: false },
    },
    generalObservation: {
        bodyBuilt: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        handsAndFingertips: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        eyes: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        cyanosis: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        jugularVenousPressure: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    chestObservation: {
        breathingPattern: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        chestMovement: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        palpationOfChest: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        chestExpansion: { normal: { type: Boolean, default: false }, abnormal: { type: Boolean, default: false }, remarks: { type: String, default: '' } },
        // ... other properties
    },
    barthelIndex: {
        feeding: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Feeding' }, maxScore: { type: Number, default: 10 } },
        bathing: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Bathing' }, maxScore: { type: Number, default: 5 } },
        grooming: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Grooming' }, maxScore: { type: Number, default: 5 } },
        dressing: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Dressing' }, maxScore: { type: Number, default: 10 } },
        bowels: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Bowels' }, maxScore: { type: Number, default: 10 } },
        bladder: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Bladder' }, maxScore: { type: Number, default: 10 } },
        toiletUse: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Toilet Use' }, maxScore: { type: Number, default: 10 } },
        transfer: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Transfer (Bed to Chair and Back)' }, maxScore: { type: Number, default: 15 } },
        mobility: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Mobility (On level surfaces)' }, maxScore: { type: Number, default: 15 } },
        stairs: { score: { type: Number, default: 0 }, activity: { type: String, default: 'Stairs' }, maxScore: { type: Number, default: 10 } },
        // ... other properties
    },
    chestShapeObservation: {
        chestShape: {
            normal: { type: Boolean, default: false },
            barrelChest: { type: Boolean, default: false },
            kyphosis: { type: Boolean, default: false },
            pectusExcavatum: { type: Boolean, default: false },
            pectusCarinatum: { type: Boolean, default: false },
        },
    },
    chestMotionObservation: {
        middleLobeLingulaMotion: {
            normal: { type: Boolean, default: false },
            abnormal: { type: Boolean, default: false },
            remarks: { type: String, default: '' },
        }, // Assuming you want to store a string, default: '' value
        upperLobeMotion: {
            normal: { type: Boolean, default: false },
            abnormal: { type: Boolean, default: false },
            remarks: { type: String, default: '' },
        },
        lowerLobeMotion: {
            normal: { type: Boolean, default: false },
            abnormal: { type: Boolean, default: false },
            remarks: { type: String, default: '' },
        },
    },
    inPatientBill: [
        {
            mobileNumber: { type: String, default: '' },
            roomNumber: { type: String, default: '' },
            admissionDate: { type: Date, default: '' },

            dischargeDate: { type: Date, default: '' },
            totalDays: { type: Number, default: 0 },
            treatmentCharges: { type: Number, default: 0 },
            visitingBill: { type: Number, default: 0 },
            physioBill: { type: Number, default: 0 },
            nursingBill: { type: Number, default: 0 },
            otherExpenses: { type: Number, default: 0 },
            paymentMode: { type: String, default: '' },
            billAmount: { type: Number, default: 0 },
            amountPerDay: { type: Number, default: 0 },

        },
    ],
    outPatientBill: [
        {
            mobileNumber: { type: String, default: '' },
            appointmentDate: { type: String, default: '' },
            serviceName: { type: String, default: '' },
            paymentMode: { type: String, default: '' },
            billAmount: { type: Number, default: 0 },
            treatmentCharges: { type: Number, default: 0 },

        },
    ],
    planOfTreatment: { type: String, default: '' },

    planTreatment: [
        {
            patientType: { type: String, default: '' },
            startDate: { type: String, default: '' },
            endDate: { type: String, default: '' },
            days: { type: String, default: '' },
            ust: { type: Boolean, default: false },
            ift: { type: Boolean, default: false },
            swd: { type: Boolean, default: false },
            tr: { type: Boolean, default: false },
            wax: { type: Boolean, default: false },
            est: { type: Boolean, default: false },
            sht: { type: Boolean, default: false },
            laser: { type: Boolean, default: false },
            exs: { type: Boolean, default: false },
            rehab: { type: Boolean, default: false },
        },
    ],

    investigation: [
        {
            date: { type: String, default: '' },
            xray: { type: String, default: '' },
            mri: { type: String, default: '' },
            others: { type: String, default: '' },
            provisionalDiagnosis: { type: String, default: '' },
        },
    ],

}, { versionKey: false });

const AdminDetails = new mongoose.Schema({
    clinicName: { type: String, default: '' },
    doctorName: { type: String, default: '' },
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    appointments: [{
        date: { type: Date },
        patients: [{
            name: { type: String },
            pid: { type: String },
            mobileNo: { type: String },
            date: { type: Date },
            tokenid: { type: Number },
        },],

        todayVisitedPatients: [{
            name: { type: String },
            pid: { type: String },
            mobileNo: { type: String },
            date: { type: Date },
            tokenid: { type: Number },
        },],

        todayWaitingPatients: [{
            name: { type: String },
            pid: { type: String },
            mobileNo: { type: String },
            date: { type: Date },
            tokenid: { type: Number },
        },],


        todayNotVisitedPatients: [{
            name: { type: String },
            pid: { type: String },
            mobileNo: { type: String },
            date: { type: Date },
            tokenid: { type: Number },
        },],

    },],

    reminders: [{
        date: { type: Date },
        successRemindersList: [{
            pid: { type: String },
            name: { type: String },
            mobileNo: { type: String },
            patientType: { type: String },
            nextVisitDate: { type: Date },
        },],
        failedRemindersList: [{
            pid: { type: String },
            name: { type: String },
            mobileNo: { type: String },
            patientType: { type: String },
            nextVisitDate: { type: Date },
        },],
    }],


}, { versionKey: false });

const adminDetails = mongoose.model('adminDetails', AdminDetails);

const BasicDetails = mongoose.model('basicDetails', basicDetails);

app.post('/api/admin-login', async (req, res) => {
    const { login_id, password } = req.body;
    console.log(login_id, password)
    try {
        const admin = await adminDetails.findOne({ username: login_id, password: password });
        console.log(admin);

        if (!admin) {
            console.log(" not found");

            return res.status(401).json({ message: 'Invalid Login ID or password' });
        }
        res.status(200).json({ success: true, admin: admin });
    } catch (error) {
        console.error('Error authenticating admin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/students', async (req, res) => {
    const { email } = req.query;

    try {
        const student = await BasicDetails.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await BasicDetails.findOne({ email, password });
        if (!student) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error authenticating student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// app.post('/api/create_record', async (req, res) => {
//     const { patient } = req.body;

//     try {
//         let foundPatient = await BasicDetails.findOne({ mobileNo: patient.mobileNo });

//         if (foundPatient) {
//             // Update the existing patient record
//             foundPatient = { ...foundPatient._doc, ...patient }; // Use _doc to get the plain object

//             // Remove the specific billing field if the condition is not true
//             // if (!foundPatient.inPatientBill[0].roomNumber) {
//             //     foundPatient.inPatientBill = undefined;
//             // }

//             // if (!foundPatient.outPatientBill[0].serviceName) {
//             //     foundPatient.outPatientBill = undefined;
//             // }
//         } else {
//             // Create a new patient record
//             const newPatient = new BasicDetails({
//                 ...patient,
//             });

//             // Remove the specific billing field if the condition is not true
//             // if (!patient.inPatientBill[0].roomNumber) {
//             //     newPatient.inPatientBill = undefined;
//             // }

//             // if (!patient.outPatientBill[0].serviceName) {
//             //     newPatient.outPatientBill = undefined;
//             // }

//             // Save the new patient record to the database
//             await newPatient.save();

//             res.status(201).json({ message: 'Patient record created successfully', patient: newPatient });
//             return; // Add return to avoid executing the code below in case of creating a new patient
//         }

//         // Update the existing patient record in the database
//         await foundPatient.save();

//         res.status(200).json({ message: 'Patient record updated successfully', patient: foundPatient });
//     } catch (error) {
//         console.error('Error creating/updating patient record:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


app.post('/api/create_record', async (req, res) => {
    const { patient, clinicName, doctorName } = req.body;
    console.log(patient.mobileNo, clinicName, doctorName)

    try {
        let foundPatient = await BasicDetails.findOne({ mobileNo: patient.mobileNo, clinicName: clinicName, doctorName: doctorName });
        // console.log("foundPatient", foundPatient);
        if (foundPatient) {
            console.log("patient.plantreatment", patient.planTreatment);
            // Update the existing patient record
            foundPatient.set(patient); // Use set method to update fields
            // if (!foundPatient.inPatientBill[0].roomNumber) {
            //     foundPatient.inPatientBill = undefined;
            // }

            // if (!foundPatient.outPatientBill[0].serviceName) {
            //     foundPatient.outPatientBill = undefined;
            // }
        } else {
            // Create a new patient record
            console.log("new patient rec")
            // const newPatient = new BasicDetails({
            //     ...patient,
            //     clinicName:clinicName,
            //     doctorName:doctorName
            // });
            // foundPatient = newPatient; // Assign foundPatient for consistent handling
            // Save the new patient record to the database
            //await newPatient.save();
            //res.status(201).json({ message: 'Patient record created successfully', patient: newPatient });
            return; // Add return to avoid executing the code below in case of creating a new patient
        }

        // Save the updated patient record in the database
        await foundPatient.save();

        res.status(200).json({ message: 'Patient record updated successfully', patient: foundPatient });
    } catch (error) {
        console.error('Error creating/updating patient record:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/create_basic_record', async (req, res) => {
    const { patient, clinicName, doctorName } = req.body;
    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: patient.mobileNo, clinicName: clinicName, doctorName: doctorName });
        if (foundPatient) {
            console.log('Patient found in the database');
            return res.status(400).json({ message: 'Patient already exists with the provided mobile number' });
        }

        // Generate nextPid
        const lastRecord = await BasicDetails.findOne({ clinicName: clinicName, doctorName: doctorName }).sort({ _id: -1 }).limit(1);
        let nextPid = '';
        if (lastRecord && lastRecord.pid) {
            const lastPidNumber = parseInt(lastRecord.pid.match(/\d+$/)[0], 10);
            nextPid = generateNextPid(clinicName, doctorName, lastPidNumber + 1);
        } else {
            nextPid = generateNextPid(clinicName, doctorName, 1);
        }

        // Create a new patient record
        const newPatient = new BasicDetails({
            ...patient,
            pid: nextPid,
            clinicName: clinicName,
            doctorName: doctorName
        });
        // Save the new patient record to the database
        await newPatient.save();

        res.status(201).json({ message: 'Patient record created successfully', patient: newPatient });
    } catch (error) {
        console.error('Error creating patient record:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

function generateNextPid(clinicName, doctorName, nextNumber) {
    // Generate acronym for clinicName
    const clinicAcronym = generateAcronym(clinicName);

    // Generate acronym for doctorName
    const doctorAcronym = generateAcronym(doctorName);

    // Generate the next PID by combining clinicAcronym, doctorAcronym, and nextNumber
    return clinicAcronym + doctorAcronym + nextNumber.toString();
}

function generateAcronym(name) {
    // Split name into words
    const words = name.split(' ');

    // Extract the first character of each word and convert to uppercase
    const acronym = words.map(word => word.charAt(0).toLowerCase());

    // Join the acronym characters together
    return acronym.join('');
}

// app.post('/api/create_record', async (req, res) => {
//     const { patient } = req.body;

//     try {
//         // Find the latest BasicDetails record to determine the next pid
//         const lastRecord = await BasicDetails.findOne().sort({ _id: -1 }).limit(1);

//         let nextPid = 'spc1'; // Default pid if no records are found

//         if (lastRecord && lastRecord.pid) {
//             // Ensure that lastRecord.pid is defined before accessing slice
//             const lastPidNumber = parseInt(lastRecord.pid.slice(3), 10);
//             nextPid = 'spc' + (lastPidNumber + 1);
//         }

//         // Create a new patient record
//         const newPatient = new BasicDetails({
//             ...patient,
//             pid: nextPid,
//         });

//         // Remove the specific billing field if the condition is not true
//         if (patient.inPatientBill && patient.inPatientBill.length > 0 && !patient.inPatientBill[0].roomNumber) {
//             newPatient.inPatientBill = undefined;
//         }

//         if (patient.outPatientBill && patient.outPatientBill.length > 0 && !patient.outPatientBill[0].serviceName) {
//             newPatient.outPatientBill = undefined;
//         }

//         // Save the new patient record to the database
//         await newPatient.save();

//         res.status(201).json({ message: 'Patient record created successfully', patient: newPatient });
//     } catch (error) {
//         console.error('Error creating patient record:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


app.post('/api/update_record', async (req, res) => {
    try {
        const { patient } = req.body;
        console.log(patient);

        if (!patient || !patient.pid) {
            return res.status(400).json({ error: 'Invalid request. Patient data or ID missing.' });
        }

        // Update the patient record based on pid (assuming pid is the unique identifier)
        const updatedPatient = await BasicDetails.findOneAndUpdate(
            { pid: patient.pid },
            { $set: patient },
            { new: true } // Returns the modified document
        );

        if (updatedPatient) {
            res.status(200).json(updatedPatient.toObject());
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error updating patient record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/find_basic_record', async (req, res) => {
    const { mobileNo, clinicName, doctorName } = req.query;

    try {
        console.log(mobileNo);
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo, clinicName: clinicName, doctorName: doctorName });

        if (foundPatient) {
            res.json(foundPatient);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error finding patient record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/find_record', async (req, res) => {
    const { mobileNo, clinicName, doctorName } = req.query;

    try {
        console.log(mobileNo)
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo, clinicName: clinicName, doctorName: doctorName });

        if (foundPatient) {
            res.json(foundPatient);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error finding patient record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/get_patient_details', async (req, res) => {
    const { mobileNumber, clinicName, doctorName } = req.query;
    console.log('Mobile Number:', mobileNumber);
    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNumber, clinicName: clinicName, doctorName: doctorName });

        if (foundPatient) {
            const { name, pid, gender, age, doctorName } = foundPatient;
            res.status(200).json({ name, pid, gender, age, doctorName }); // Send status 200 for success
        } else {
            res.status(404).json({ error: 'Patient not found' }); // Send status 404 if patient not found
        }
    } catch (error) {
        console.error('Error finding patient record:', error);
        res.status(500).json({ error: 'Internal server error' }); // Send status 500 for internal server error
    }
});


app.get('/api/get_all_records', async (req, res) => {
    const { clinicName, doctorName } = req.query;
    console.log("recordssss", clinicName, doctorName)
    try {
        const allRecords = await BasicDetails.find({ clinicName: clinicName, doctorName: doctorName });
        res.status(200).json(allRecords);
    } catch (error) {
        console.error('Error fetching all records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/api/edit_invest_record', async (req, res) => {
    const { mobileNo, updatedData } = req.body;

    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo });

        if (foundPatient) {
            // Iterate over each new row and push it to the planTreatment array
            updatedData.forEach((newRow) => {
                foundPatient.investigation.push(newRow);
            });

            await foundPatient.save();

            res.json({ message: 'Patient record updated successfully' });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error updating patient record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/add_row', async (req, res) => {
    const { mobileNumber, newRows } = req.body;

    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNumber });

        if (foundPatient) {
            // Add new rows to the patient record
            newRows.forEach((newRow) => {
                foundPatient.planTreatment.push(newRow);
            });

            await foundPatient.save();

            res.json({ message: 'Rows added successfully' });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error adding new rows:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/update_bill_plantreatment', async (req, res) => {
    const { mobileNo, updatedData, inBillDetails, outBillDetails } = req.body;
    console.log('Received update data:', updatedData, mobileNo, inBillDetails, outBillDetails);

    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo });

        if (!foundPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Update planTreatment
        updatedData.forEach((newRow) => {
            foundPatient.planTreatment.push(newRow);
        });

        // Update in-patient bill details if provided
        if (inBillDetails) {
            const newInBillingRecord = {
                mobileNumber: inBillDetails.mobileNumber,
                roomNumber: inBillDetails.roomNumber,
                admissionDate: inBillDetails.admissionDate,
                dischargeDate: inBillDetails.dischargeDate,
                totalDays: inBillDetails.totalDays,
                visitingBill: inBillDetails.visitingBill,
                physioBill: inBillDetails.physioBill,
                amountPerDay: inBillDetails.amountPerDay,
                nursingBill: inBillDetails.nursingBill,
                otherExpenses: inBillDetails.otherExpenses,
                paymentMode: inBillDetails.paymentMode,
                billAmount: inBillDetails.billAmount,
            };
            foundPatient.inPatientBill.push(newInBillingRecord);
        }

        // Update out-patient bill details if provided
        if (outBillDetails) {
            const newOutBillingRecord = {
                mobileNumber: outBillDetails.mobileNumber,
                appointmentDate: outBillDetails.appointmentDate,
                serviceName: outBillDetails.serviceName,
                paymentMode: outBillDetails.paymentMode,
                billAmount: outBillDetails.billAmount,
            };

            foundPatient.outPatientBill.push(newOutBillingRecord);
        }

        await foundPatient.save();

        res.json({ message: 'Patient record updated successfully' });
    } catch (error) {
        console.error('Error updating patient record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/create_new_inpatient_bill', async (req, res) => {
    const { patient, clinicName, doctorName } = req.body;

    console.log('Received patient data:', patient);

    try {
        // Find the BasicDetails based on the mobile number
        const foundPatient = await BasicDetails.findOne({ mobileNo: patient.mobileNumber, clinicName: clinicName, doctorName: doctorName });

        if (!foundPatient) {
            console.log('Patient not found in the database');
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Add billing details to the billings array
        const newBillingRecord = {
            mobileNumber: patient.mobileNumber,
            roomNumber: patient.roomNumber,
            admissionDate: patient.admissionDate,
            dischargeDate: patient.dischargeDate,
            totalDays: patient.totalDays,
            visitingBill: patient.visitingBill,
            physioBill: patient.physioBill,
            nursingBill: patient.nursingBill,
            amountPerDay: patient.amountPerDay,
            otherExpenses: patient.otherExpenses,
            paymentMode: patient.paymentMode,
            billAmount: patient.billAmount,
        };

        foundPatient.inPatientBill.push(newBillingRecord);

        // Save the updated patient record
        await foundPatient.save();

        res.status(201).json({ message: 'In-Patient Bill created successfully' });
    } catch (error) {
        console.error('Error creating in-patient bill:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/create_new_outpatient_bill', async (req, res) => {
    const { patient, clinicName, doctorName } = req.body;
    console.log("Received patient data:", patient);
    try {
        // Find the BasicDetails based on the mobile number
        const foundPatient = await BasicDetails.findOne({ mobileNo: patient.mobileNumber, clinicName: clinicName, doctorName: doctorName });

        if (!foundPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Add billing details to the billings array
        const newBillingRecord = {
            mobileNumber: patient.mobileNumber,
            appointmentDate: patient.appointmentDate,
            serviceName: patient.serviceName,
            paymentMode: patient.paymentMode,
            billAmount: patient.billAmount,
        };

        foundPatient.outPatientBill.push(newBillingRecord);
        // Save the updated patient record
        await foundPatient.save();

        // Send back the details of the created bill
        res.status(201).json({ message: 'Out-Patient Bill created successfully', newBillingRecord });
    } catch (error) {
        console.error('Error creating out-patient bill:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// app.get('/api/patients', async (req, res) => {
//     try {
//       // Get current date
//       const currentDate = new Date();

//       // Calculate date 3 days from now
//       const threeDaysLater = new Date();
//       threeDaysLater.setDate(threeDaysLater.getDate() + 3);

//       // Retrieve patients from database
//       const patients = await BasicDetails.find().exec();

//       // Filter patients based on criteria
//       const filteredPatients = patients.filter(patient => {
//         if (patient.planTreatment && patient.planTreatment.length > 0) {
//           const treatment = patient.planTreatment[0];

//           // Check if patient is inpatient and enddate is within next 3 days from current date
//           if (treatment.patientType === 'inpatient') {
//             const endDate = new Date(treatment.endDate);
//             if (endDate <= threeDaysLater && endDate >= currentDate) {
//               console.log(patient.planTreatment);
//               return true;
//             }
//           }

//           // Check if patient is outpatient and nextoutdate is within next 3 days from current date
//           if (treatment.patientType === 'outpatient') {
//             const startDate = new Date(treatment.startDate);
//             const nextOutDate = new Date(startDate);
//             nextOutDate.setDate(nextOutDate.getDate() + parseInt(treatment.days, 10)); // Add totaldays
//             if (nextOutDate <= threeDaysLater && nextOutDate >= currentDate) {
//               console.log(patient.planTreatment);
//               return true;
//             }
//           }
//         }
//         return false;
//       });

//       // Send response with filtered patients
//       res.json(filteredPatients);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


//retrieve last 3 days
// app.get('/api/patients', async (req, res) => {
//     try {
//       // Get current date
//       const currentDate = new Date();
//       console.log("current date", currentDate);

//       // Calculate date 3 days from now
//       const threeDaysLater = new Date();
//       threeDaysLater.setDate(threeDaysLater.getDate() + 3);
//       console.log("three date", threeDaysLater);

//       // Retrieve patients from database
//       const patients = await BasicDetails.find().exec();

//       // Filter patients based on criteria
//       const filteredPatients = patients.filter(patient => {
//         if (patient.planTreatment && patient.planTreatment.length > 0) {
//           const treatments = patient.planTreatment;
//           for (const treatment of treatments) {
//             // Check if patient is inpatient and enddate is within next 3 days from current date
//             if (treatment.patientType === 'inpatient') {
//               const endDate = new Date(treatment.endDate);
//               if (endDate <= threeDaysLater && endDate >= currentDate) {
//                 //console.log("end date", endDate);
//                 //console.log(patient.planTreatment);
//                 console.log(treatment);
//                 return true;
//               }
//             }

//             // Check if patient is outpatient and nextoutdate is within next 3 days from current date
//             if (treatment.patientType === 'outpatient') {
//               const startDate = new Date(treatment.startDate);
//               const nextOutDate = new Date(startDate);
//               nextOutDate.setDate(nextOutDate.getDate() + parseInt(treatment.days, 10)); // Add totaldays
//               if (nextOutDate <= threeDaysLater && nextOutDate >= currentDate) {
//                 //console.log("next out date", nextOutDate);
//                 //console.log(patient.planTreatment);
//                 console.log(treatment);
//                 return true;
//               }
//             }
//           }
//         }
//         return false;
//       });

//       // Log planTreatment for filteredPatients
//     //   filteredPatients.forEach(patient => {
//     //     console.log("Patient ID:", patient.pid);
//     //     console.log("Plan Treatment:");
//     //     patient.planTreatment.forEach(treatment => {
//     //       console.log(treatment);
//     //     });
//     //   });

//       // Send response with filtered patients
//       res.json(filteredPatients);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
//retrieve 3rd day patient
// app.get('/api/patients', async (req, res) => {
//     try {
//       // Get current date
//       const currentDate = new Date();
//       console.log("current date", currentDate);

//       // Calculate date 3 days from now
//       const threeDaysLater = new Date();
//       threeDaysLater.setDate(threeDaysLater.getDate() + 3);
//       console.log("three date", threeDaysLater);

//       // Retrieve patients from database
//       const patients = await BasicDetails.find().exec();

//       // Filter patients based on criteria
//       const filteredPatients = patients.filter(patient => {
//         if (patient.planTreatment && patient.planTreatment.length > 0) {
//           const treatments = patient.planTreatment;
//           for (const treatment of treatments) {
//             // Check if patient is inpatient and enddate is within next 3 days from current date
//             if (treatment.patientType === 'inpatient') {
//               const endDate = new Date(treatment.endDate);
//               console.log("in",endDate,threeDaysLater);
//               if (
//                 endDate.getFullYear() === threeDaysLater.getFullYear() &&
//                 endDate.getMonth() === threeDaysLater.getMonth() &&
//                 endDate.getDate() === threeDaysLater.getDate()
//             )   {
//                 //console.log("end date", endDate);
//                 //console.log(patient.planTreatment);
//                 console.log(treatment);
//                 return true;
//               }
//             }

//             // Check if patient is outpatient and nextoutdate is within next 3 days from current date
//             if (treatment.patientType === 'outpatient') {
//               const startDate = new Date(treatment.startDate);
//               const nextOutDate = new Date(startDate);
//               nextOutDate.setDate(nextOutDate.getDate() + parseInt(treatment.days, 10)); // Add totaldays
//               if (
//                 nextOutDate.getFullYear() === threeDaysLater.getFullYear() &&
//                 nextOutDate.getMonth() === threeDaysLater.getMonth() &&
//                 nextOutDate.getDate() === threeDaysLater.getDate()
//             ) {
//                 //console.log("next out date", nextOutDate);
//                 //console.log(patient.planTreatment);
//                 console.log(treatment);
//                 return true;
//               }
//             }
//           }
//         }
//         return false;
//       });

//       // Log planTreatment for filteredPatients
//     //   filteredPatients.forEach(patient => {
//     //     console.log("Patient ID:", patient.pid);
//     //     console.log("Plan Treatment:");
//     //     patient.planTreatment.forEach(treatment => {
//     //       console.log(treatment);
//     //     });
//     //   });

//       // Send response with filtered patients
//       res.json(filteredPatients);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


//send required data alone


app.get('/api/patients', async (req, res) => {
    const { clinicName, doctorName } = req.query;

    try {
        // Get current date
        const currentDate = new Date();

        // Calculate date 3 days from now
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        // Retrieve patients from database
        const patients = await BasicDetails.find({ clinicName, doctorName }).exec();

        // Initialize array to store filtered patient details
        const filteredPatientDetails = [];

        // Filter patients based on criteria
        patients.forEach(patient => {
            if (patient.planTreatment && patient.planTreatment.length > 0) {
                const treatments = patient.planTreatment;
                for (const treatment of treatments) {
                    // Check if patient is inpatient
                    // if (treatment.patientType === 'inpatient') {
                    //     const endDate = new Date(treatment.endDate);
                    //     if (endDate <= threeDaysLater && endDate >= currentDate) {
                    //         filteredPatientDetails.push({
                    //             pid: patient.pid,
                    //             name: patient.name,
                    //             mobileNo: patient.mobileNo,
                    //             patientType: treatment.patientType,
                    //             nextVisitDate: endDate.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                    //         });
                    //     }
                    // }

                    // Check if patient is outpatient
                    if (treatment.patientType === 'outpatient') {
                        const startDate = new Date(treatment.startDate);
                        const nextOutDate = new Date(startDate);
                        // console.log("nextOutdate 1", nextOutDate)

                        // Adding one day to treatment.days
                        const daysToAdd = parseInt(treatment.days, 10) + 1;

                        nextOutDate.setDate(nextOutDate.getDate() + daysToAdd); // Add totaldays
                        // console.log("nextOutdate 2", nextOutDate, threeDaysLater, currentDate)
                        if (nextOutDate <= threeDaysLater && nextOutDate >= currentDate) {
                            // console.log("nextOutdate 3", nextOutDate)
                            filteredPatientDetails.push({
                                pid: patient.pid,
                                name: patient.name,
                                mobileNo: patient.mobileNo,
                                patientType: treatment.patientType,
                                nextVisitDate: nextOutDate.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                            });
                        }
                    }
                }
            }
        });

        // Check if filteredPatientDetails is empty
        if (filteredPatientDetails.length === 0) {
            return res.status(404).json({ message: 'No patients are visiting for the next three days' });
        }

        // Send response with filtered patient details
        res.status(200).json(filteredPatientDetails);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



const clearSearchInputBox = async () => {
    try {
        // Click on the search input field to focus
        await page.click('div[aria-label="New chat"]');

        // Wait for a short delay to ensure the input field is focused
        await sleep(1000);

        // Focus on the input field
        await page.focus('div[contenteditable="true"]');

        // Clear the content of the input field
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
    } catch (error) {
        console.error(`Error clearing search input box: ${error}`);
        throw error;
    }
};

const sendWhatsAppMessage = async (mobileNo, message, retries = 3) => {
    try {
        // Find the search input field and type the patient's mobile number
        await page.waitForSelector('div[aria-label="New chat"]');
        await page.click('div[aria-label="New chat"]');

        // Clear search input box
        await clearSearchInputBox();

        // Type mobile number
        await page.keyboard.type(mobileNo);

        // Adjust the delay to ensure the mobile number is completely typed
        await sleep(2000);

        // Press tab twice to navigate to the first search result
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Wait for a short delay before selecting the search result
        await sleep(1000);

        // Click on the first search result to select it
        await page.evaluate(() => {
            const searchResult = document.querySelector('div._ak8n');
            if (searchResult) {
                searchResult.click(); // Click on the first search result
            }
        });

        // Adjust the delay as needed
        await sleep(1000);

        // Focus on the message input field
        await page.focus('.copyable-area [contenteditable="true"]');

        // Ensure the correct input box is focused
        const isInputBoxFocused = await page.evaluate(() => {
            const inputBox = document.querySelector('div._ak1l [contenteditable="true"]');
            return inputBox !== null && document.activeElement === inputBox;
        });

        if (isInputBoxFocused) {
            // Type the message and send it
            await page.keyboard.type(message);
            await page.keyboard.press('Enter');

            console.log(`Message sent to ${mobileNo}: ${message}`);
        } else {
            // If input box is not focused, throw an error
            throw new Error(`Failed to send message to ${mobileNo}: Input box not focused`);
        }
    } catch (error) {
        // Retry with reduced retries
        if (retries > 0) {
            console.error(`Failed to send message to ${mobileNo}: ${error.message}`);
            await sendWhatsAppMessage(mobileNo, message, retries - 1); // Recursive call with reduced retries
        } else {
            console.error(`Failed to send message to ${mobileNo}: Maximum retries exceeded`);
            throw error;
        }
    }
};


// Server-sent events route
app.get('/api/progress-updates', (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send progress updates to the client
    const progressHandler = (progressPercentage) => {
        res.write(`data: ${progressPercentage.toFixed(2)}%\n\n`);
    };

    // Add progress event listener
    progressEmitter.on('progress', progressHandler);

    // Remove progress event listener when the client closes the connection
    req.on('close', () => {
        progressEmitter.removeListener('progress', progressHandler);
    });
});

app.post('/api/send-reminders', async (req, res) => {
    const visitingPatients = req.body.visitingPatients;
    const clinicName = req.body.clinicName;
    const doctorName = req.body.doctorName;


    console.log("sendrem", clinicName, doctorName);
    const successReminders = [];
    const failedReminders = [];

    // Calculate total patients count
    const totalPatients = visitingPatients.length;
    let processedPatients = 0;

    if (!page) {
        await loginToWhatsApp();
    }

    await sleep(8000); // Adjust the delay as needed

    // Loop through visitingPatients array and send reminders
    for (const patient of visitingPatients) {
        const message = `
🌟✉ *Reminder: Appointment Alert!* ✉🌟

Dear ${patient.name},

📅 *Date:* ${patient.nextVisitDate}

This message serves as a gentle reminder for your upcoming visit. We look forward to seeing you soon! 

Warm Regards,
${doctorName}
${clinicName}`;
        // const message = Dear ${patient.name}, this is a reminder for your upcoming visit on ${patient.nextVisitDate}. Regards ${doctorName} from ${clinicName};

        // const message = `Dear ${patient.name}, this is a reminder for your upcoming visit on ${patient.nextVisitDate}.`;
        const mobileNo = patient.mobileNo;
        let retries = 3; // Reset retries for each patient
        let success = false; // Flag to track if the message was sent successfully
        while (retries > 0 && !success) {
            try {
                await sendWhatsAppMessage(mobileNo, message);
                success = true; // Message sent successfully, exit the loop
                successReminders.push(patient); // Store successful reminder data
            } catch (error) {
                console.error(`Failed to send message to ${mobileNo}: ${error.message}`);
                retries--; // Decrement retries on failure
                if (retries === 0) {
                    // If retries are exhausted, move to the next patient
                    console.log(`Retries exhausted for ${mobileNo}. Moving to the next patient.`);
                    await clearSearchInputBox(); // Clear search input box
                    failedReminders.push(patient); // Store failed reminder data
                }
            }
        }
        // Update processed patients count
        processedPatients++;
        // Calculate progress percentage
        const progressPercentage = (processedPatients / totalPatients) * 100;
        // Emit progress update
        progressEmitter.emit('progress', progressPercentage);
    }

    let existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

    console.log("existingAdminDetails", existingAdminDetails);

    if (!existingAdminDetails) {
        res.status(404).json({ message: "No admin details found for the provided clinic and doctor" });
    }

    // Get the current date
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().split('T')[0]; // Get date part only
    console.log("cureent date remin", currentDateISO);

    // Find the reminders array with the current date
    let reminders = existingAdminDetails.reminders.find(reminder => {
        return reminder.date.toISOString().split('T')[0] === currentDateISO;
    });

    console.log("reminders pre or not", reminders);

    if (!reminders) {
        // If reminders array for current date doesn't exist, create a new one
        console.log("remainder array not present")
        existingAdminDetails.reminders.push({
            date: currentDate,
            successRemindersList: successReminders,
            failedRemindersList: failedReminders

        });
    } else {
        // If reminders array for current date already exists, remove it
        existingAdminDetails.reminders = existingAdminDetails.reminders.filter(reminder => {
            const reminderDate = reminder.date.toISOString().split('T')[0];
            return reminderDate !== currentDateISO;
        });

        // Create a new reminder object with updated reminder lists
        const newReminder = {
            date: currentDate,
            successRemindersList: successReminders,
            failedRemindersList: failedReminders
        };

        // Push the new reminder object to the reminders array
        existingAdminDetails.reminders.push(newReminder);

        // // Iterate through successReminders and check if each object exists in successRemindersList
        // for (const reminder of successReminders) {
        //     const { pid, mobileNo } = reminder;
        //     if (!reminders.successRemindersList.some(item => item.pid === pid && item.mobileNo === mobileNo)) {
        //         // If not found, push the reminder object to successRemindersList
        //         reminders.successRemindersList.push(reminder);
        //     }
        // }

        // // Iterate through failedReminders and check if each object exists in failedRemindersList
        // for (const reminder of failedReminders) {
        //     const { pid, mobileNo } = reminder;
        //     if (!reminders.failedRemindersList.some(item => item.pid === pid && item.mobileNo === mobileNo)) {
        //         // If not found, push the reminder object to failedRemindersList
        //         reminders.failedRemindersList.push(reminder);
        //     }
        // }
    }

    // Save the updated AdminDetails object
    await existingAdminDetails.save();

    // Respond with success message and reminder data
    res.status(200).json({
        message: 'Reminders sent successfully',
        successReminders: successReminders,
        failedReminders: failedReminders
    });
});

// Function to introduce a delay
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
let page; // Declare page outside the functions to make it accessible globally
// Function to login to WhatsApp Web
const loginToWhatsApp = async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch Chromium with visible browser window
    page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    // Wait for the user to scan the QR code and log in
    await page.waitForSelector('#side', { timeout: 60000 }); // Wait for 60 seconds

    console.log("Logged in to WhatsApp Web");
};



app.get('/api/fetch_reminder_list', async (req, res) => {
    const { clinicName, doctorName } = req.query;

    try {
        // Get the current date in the required format (YYYY-MM-DD)
        const currentDate = new Date().toISOString().split('T')[0];

        // Check if an object with the provided clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (existingAdminDetails) {
            // Find the reminder object with the current date
            const reminder = existingAdminDetails.reminders.find(reminder => {
                const reminderDate = reminder.date.toISOString().split('T')[0];
                return reminderDate === currentDate;
            });

            if (reminder) {
                // Extract successRemindersList and failedRemindersList from the reminder object
                const { successRemindersList, failedRemindersList } = reminder;

                console.log("fetch rem list", successRemindersList, failedRemindersList);
                // Respond with success and the reminder lists
                res.status(200).json({
                    success: true,
                    message: 'Reminder lists retrieved successfully',
                    successRemindersList,
                    failedRemindersList
                });
            } else {
                // If no reminder exists for the current date, respond with a message
                res.status(404).json({
                    success: false,
                    message: 'Reminder is not sent for today'
                });
            }
        } else {
            // If no admin details found for the provided clinic and doctor, respond with a message
            res.status(404).json({
                success: false,
                message: 'No admin details found for the provided clinic and doctor'
            });
        }
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error fetching reminder list:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// Define a route handler for the /api/book_appointment endpoint
app.post("/api/book_appointment", async (req, res) => {
    try {
        // Extract the patient data from the request body
        const { name, mobileNo, date, clinicName, doctorName } = req.body;
        console.log("dateeeeeeeeeeeeeeee", date, name, mobileNo, clinicName, doctorName);


        // Extract date and time separately
        const currentDate = new Date();
        const appointmentDate = new Date(date);
        const appointmentDateString = appointmentDate.toISOString().split('T')[0]; // Extract date
        const appointmentTimeString = currentDate.toTimeString().split(' ')[0]; // Extract current time
        const fullAppointmentDateTime = new Date(`${appointmentDateString}T${appointmentTimeString}`);
        const fullAppointmentDateTimeISOString = fullAppointmentDateTime.toISOString();

        console.log("appointmentDate", appointmentDate);
        console.log("Received date:", appointmentDateString);
        console.log("Received time:", appointmentTimeString);
        console.log("Received time:", appointmentTimeString);
        console.log("fullAppointmentDateTimeISOString", fullAppointmentDateTimeISOString);


        // Check if an admin details object with the provided clinicName and doctorName exists
        let existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });
        // console.log("existingAdminDetails", existingAdminDetails);
        let pid;

        let patientfind = await BasicDetails.findOne({ mobileNo, clinicName, doctorName });
        if (patientfind) {
            pid = patientfind.pid;
        }
        else {
            pid = "New patient"
        }

        console.log("piddddddd book", pid);

        if (existingAdminDetails) {
            // If an admin details object with the provided clinicName and doctorName exists for the given date
            const appointment = existingAdminDetails.appointments.find(appointment => {
                const appointmentDatePart = appointment.date.toISOString().split('T')[0]; // Extract date part
                const fullAppointmentDatePart = fullAppointmentDateTime.toISOString().split('T')[0]; // Extract date part
                return appointmentDatePart === fullAppointmentDatePart;
            });

            if (appointment) {
                console.log("yess");
                const isMobilePresent = appointment.todayVisitedPatients.some(patient => patient.mobileNo === mobileNo);
                if (isMobilePresent) {
                    // If the mobile number is present, find the latest tokenid for that mobile number
                    const latestTokenId = appointment.patients.filter(patient => patient.mobileNo === mobileNo)
                        .sort((a, b) => b.tokenid - a.tokenid)[0].tokenid;

                    // Check if the latest tokenid is present in the todayVisitedPatients array
                    const isTokenIdPresent = appointment.todayVisitedPatients.some(patient => patient.tokenid === latestTokenId);
                    const isTokenIdPresentInWaiting = appointment.todayWaitingPatients.some(patient => patient.tokenid === latestTokenId);
                    if (isTokenIdPresent) {
                        if (!isTokenIdPresentInWaiting) {
                            // Push the patient details to the patients array
                            const patientlength = appointment.patients.length;
                            appointment.patients.push({ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: patientlength + 1 });
                            appointment.todayNotVisitedPatients.push({ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: patientlength + 1 });
                        }
                        else {
                            return res.status(400).json({ message: "Patient is waiting in the clinic", tokenid: latestTokenId });
                        }
                    } else {
                        // Respond with an alert that appointment already exists along with the tokenid
                        return res.status(400).json({ message: "Appointment already exists", tokenid: latestTokenId });
                    }
                } else {
                    // Find the tokenid from the patients array for the provided mobile number
                    const patient = appointment.patients.find(patient => patient.mobileNo === mobileNo);
                    if (patient) {
                        // Respond with an alert that appointment already exists along with the tokenid
                        return res.status(400).json({ message: "Appointment already exists", tokenid: patient.tokenid });
                    }


                    const patientlength = appointment.patients.length;
                    appointment.patients.push({ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: patientlength + 1 });
                    appointment.todayNotVisitedPatients.push({ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: patientlength + 1 });

                }
            } else {
                // If no appointments array with the current date exists, create a new one
                existingAdminDetails.appointments.push({
                    date: fullAppointmentDateTimeISOString,
                    patients: [{ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: 1 }],// Ensure that the patient data is passed correctly
                    todayNotVisitedPatients: [{ name, pid, mobileNo, date: fullAppointmentDateTimeISOString, tokenid: 1 }]

                });
            }
        }


        // Save the appointment object to the database
        await existingAdminDetails.save();

        // // // Respond with a success status and message
        res.status(201).json({ message: "AdminDetails booked successfully" });
    } catch (error) {
        // If an error occurs, respond with an error status and message
        console.error("Error booking appointment:", error);
        res.status(500).json({ error: "Failed to book appointment" });
    }
});


// Define a route handler for the /api/fetch_appointments endpoint
app.get("/api/fetch_appointments", async (req, res) => {
    const { clinicName, doctorName } = req.query;
    //console.log("clinic", clinicName, doctorName);
    try {
        // Get the current date in the required format (YYYY-MM-DD)
        const currentDate = new Date().toISOString().split('T')[0];

        // Check if an object with the provided clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (existingAdminDetails) {
            // Find the appointment array with the current date
            const appointment = existingAdminDetails.appointments.find(appointment => {
                const appointmentDate = appointment.date.toISOString().split('T')[0];
                return appointmentDate === currentDate;
            });

            if (appointment) {
                // Extract patient details from the appointment
                const currentPatients = appointment.patients;
                const numberOfPatients = currentPatients.length;

                // Send the current date's patient details and the number of appointments to the client
                res.status(200).json({ appointments: currentPatients, count: numberOfPatients });
            } else {

                // If no appointments are found for the current date, send an appropriate message to the client
                res.status(404).json({ message: "No appointments found for today", count: 0 });
            }
        } else {
            // If no object with the provided clinicName and doctorName exists, send an appropriate message to the client
            res.status(404).json({ message: "No admin details found for the provided clinic and doctor", count: 0 });
        }
    } catch (error) {
        // If an error occurs, send an error response to the client
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});


app.post("/api/addVisitedPatient", async (req, res) => {
    try {
        // Extract the patient data from the request body
        const { name, pid, mobileNo, date, tokenid, clinicName, doctorName } = req.body;

        // Log received data
        console.log("Received data:", { name, pid, mobileNo, date });

        // Get the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Check if an object with the provided clinicName and doctorName exists
        let existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (existingAdminDetails) {
            // Check if an appointment object with the current date exists
            const appointment = existingAdminDetails.appointments.find(appointment => {
                const appointmentDate = appointment.date.toISOString().split('T')[0];
                return appointmentDate === currentDate;
            });

            if (appointment) {
                // If the appointment object with the current date exists

                // Check if the mobile number already exists in today's visited patients or waiting patients
                const todayVisitedPatients = appointment.todayVisitedPatients;
                const todayWaitingPatients = appointment.todayWaitingPatients;

                const patientExists = appointment.todayVisitedPatients.some(patient => patient.tokenid === tokenid && patient.mobileNo === mobileNo);

                if (!patientExists) {
                    // Check if the patient with the provided mobile number is present in the todayNotVisitedPatients array
                    const patientToRemove = appointment.todayNotVisitedPatients.find(patient => patient.tokenid === tokenid && patient.mobileNo === mobileNo);
                    if (patientToRemove) {
                        // Remove the patient from todayNotVisitedPatients array
                        const index = appointment.todayNotVisitedPatients.indexOf(patientToRemove);
                        appointment.todayNotVisitedPatients.splice(index, 1);
                    }

                    // Push the received patient details into todayVisitedPatients and todayWaitingPatients arrays
                    todayVisitedPatients.push({ name, pid, mobileNo, date, tokenid });
                    todayWaitingPatients.push({ name, pid, mobileNo, date, tokenid });

                    // Sort todayWaitingPatients by time
                    // todayWaitingPatients.sort((a, b) => {
                    //     // Extract components from dates
                    //     const timeA = extractTimeComponents(new Date(a.date));
                    //     const timeB = extractTimeComponents(new Date(b.date));

                    //     // Compare hours
                    //     if (timeA.hours !== timeB.hours) {
                    //         return timeA.hours - timeB.hours;
                    //     }
                    //     // Compare minutes
                    //     if (timeA.minutes !== timeB.minutes) {
                    //         return timeA.minutes - timeB.minutes;
                    //     }
                    //     // Compare seconds
                    //     if (timeA.seconds !== timeB.seconds) {
                    //         return timeA.seconds - timeB.seconds;
                    //     }
                    //     // Compare AM/PM
                    //     if (timeA.period !== timeB.period) {
                    //         return timeA.period === 'AM' ? -1 : 1;
                    //     }
                    //     return 0; // Dates are equal
                    // });

                    // Sort todayWaitingPatients by tokenid in ascending order
                    todayWaitingPatients.sort((a, b) => a.tokenid - b.tokenid);

                    // Save the updated admin details to the database
                    await existingAdminDetails.save();

                    // Respond with a success status and message
                    return res.status(201).json({ message: "AdminDetails updated successfully" });
                } else {
                    // If the mobile number already exists, send an alert to the client
                    return res.status(400).json({ error: "Mobile number already exists" });
                }
            }
        } else {
            // If no object with the provided clinicName and doctorName exists, send an appropriate message to the client
            return res.status(404).json({ message: "No admin details found for the provided clinic and doctor" });
        }
    } catch (error) {
        // If an error occurs, respond with an error status and message
        console.error("Error adding visited patient:", error);
        return res.status(500).json({ error: "Failed to add visited patient" });
    }
});


// Function to extract time components from a date
const extractTimeComponents = (date) => {
    const hours = date.getHours() % 12 || 12; // Convert hours to 12-hour format
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = date.getHours() < 12 ? 'AM' : 'PM'; // Determine AM/PM
    return { hours, minutes, seconds, period };
};

app.get("/api/fetch_todayvisited_appointments", async (req, res) => {
    const { clinicName, doctorName } = req.query;

    try {
        // Check if an object with the provided clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (existingAdminDetails) {
            // Get the current date in the required format (YYYY-MM-DD)
            const currentDate = new Date().toISOString().split('T')[0];

            // Find appointments with the current date
            const appointment = existingAdminDetails.appointments.find(appointment => {
                const appointmentDate = appointment.date.toISOString().split('T')[0];
                return appointmentDate === currentDate;
            });

            if (appointment) {
                // Extract todayVisitedPatients and todayWaitingPatients arrays
                const todayVisitedPatients = appointment.todayVisitedPatients;
                const todayWaitingPatients = appointment.todayWaitingPatients;

                // Calculate the number of patients visited today
                const numberOfPatientsVisited = todayVisitedPatients.length;

                // Send the todayVisitedPatients and todayWaitingPatients arrays to the client
                res.status(200).json({ todayWaitingPatients, numberOfPatientsVisited });
            } else {
                // If no appointments are found for the current date, send an appropriate message to the client
                res.status(404).json({ message: "No appointments found for today", count: 0 });
            }
        } else {
            // If no object with the provided clinicName and doctorName exists, send an appropriate message to the client
            res.status(404).json({ message: "No admin details found for the provided clinic and doctor" });
        }
    } catch (error) {
        // If an error occurs, send an error response to the client
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});


app.post("/api/markCompletedByMobileNo", async (req, res) => {
    try {
        const { mobileNo, tokenid, clinicName, doctorName } = req.body; // Extract mobileNo from the request body

        // Check if an object with the provided clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (!existingAdminDetails) {
            return res.status(404).json({ error: "No admin details found for the provided clinic and doctor" });
        }

        // Get the current date in the required format (YYYY-MM-DD)
        const currentDate = new Date().toISOString().split('T')[0];

        // Find appointments with the current date
        const appointment = existingAdminDetails.appointments.find(appointment => {
            const appointmentDate = appointment.date.toISOString().split('T')[0];
            return appointmentDate === currentDate;
        });

        if (!appointment) {
            return res.status(404).json({ error: "No appointments found for today" });
        }

        // Find the patient details with the provided mobile number in the todayWaitingPatients array
        const todayWaitingPatients = appointment.todayWaitingPatients;
        // console.log("todayWaitingPatients", todayWaitingPatients);
        const patientToRemove = todayWaitingPatients.find(patient => {
            // Log tokenid and mobileNo
            // console.log("Token ID:", patient.tokenid,tokenid);
            // console.log("Mobile Number:", patient.mobileNo,mobileNo);
            // Check condition and return
            return patient.tokenid === tokenid && patient.mobileNo === mobileNo;
        });
        console.log("patientToRemove", patientToRemove);

        if (!patientToRemove) {
            return res.status(404).json({ error: "Patient not found in waiting list" });
        }

        // Remove the patient from the todayWaitingPatients array
        const index = todayWaitingPatients.indexOf(patientToRemove);
        todayWaitingPatients.splice(index, 1);

        // Save the updated admin details to the database
        await existingAdminDetails.save();

        // Return success message
        return res.status(200).json({ message: "Patient marked as completed successfully" });
    } catch (error) {
        console.error("Error marking patient as completed:", error);
        return res.status(500).json({ error: "Failed to mark patient as completed" });
    }
});


app.post("/api/addNotVisitedPatient", async (req, res) => {
    console.log("inside not visited");
    try {
        // Extract the patient data from the request body
        const { name, pid, mobileNo, date, tokenid, clinicName, doctorName } = req.body;

        // Log received data
        console.log("Received data:", { name, pid, mobileNo });

        // Check if an object with the provided clinicName and doctorName exists
        let existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (!existingAdminDetails) {
            return res.status(404).json({ error: "No admin details found for the provided clinic and doctor" });
        }

        // Get the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Find appointments with the current date
        const appointment = existingAdminDetails.appointments.find(appointment => {
            const appointmentDate = appointment.date.toISOString().split('T')[0];
            return appointmentDate === currentDate;
        });

        if (appointment) {
            // If no appointment object with the current date exists, create a new one
            const patientAlreadyVisited = appointment.todayVisitedPatients.some(patient => patient.tokenid === tokenid && patient.mobileNo === mobileNo);

            if (patientAlreadyVisited) {
                return res.status(400).json({ message: "Patient already visited" });

            }

            const patientAlreadyNotVisited = appointment.todayNotVisitedPatients.some(patient => patient.tokenid === tokenid && patient.mobileNo === mobileNo);

            if (patientAlreadyNotVisited) {
                return res.status(400).json({ message: "Patient already in not visited" });
            }
            // If the patient is not present in todayVisitedPatients, add the patient details to todayNotVisitedPatients array
            appointment.todayNotVisitedPatients.push({ name, pid, mobileNo, date, tokenid });
        }

        // Save the updated admin details to the database
        await existingAdminDetails.save();

        // Respond with a success status and message
        return res.status(201).json({ message: "Patient added to not visited list successfully" });
    } catch (error) {
        // If an error occurs, respond with an error status and message
        console.error("Error adding patient to not visited list:", error);
        return res.status(500).json({ error: "Failed to add patient to not visited list" });
    }
});


app.get("/api/fetch_today_bill", async (req, res) => {
    const { clinicName, doctorName } = req.query;
    console.log("today bill", clinicName, doctorName);
    try {
        const currentDate = new Date();

        // Retrieve patients from the database
        const patients = await BasicDetails.find({ clinicName, doctorName }).exec();

        // Initialize totalBillForToday variable to store the sum of billAmount for today
        let totalBillForToday = 0;

        // Iterate over each patient
        patients.forEach(patient => {
            // Check in inPatientBill array
            patient.inPatientBill.forEach(inPatient => {
                // Convert admissionDate to Date object for comparison
                const admissionDate = new Date(inPatient.admissionDate);
                if (admissionDate.toDateString() === currentDate.toDateString()) {
                    totalBillForToday += inPatient.billAmount; // Add billAmount to totalBillForToday
                }
            });


            // Check in outPatientBill array
            patient.outPatientBill.forEach(outPatient => {
                // Convert appointmentDate to Date object for comparison
                const appointmentDate = new Date(outPatient.appointmentDate);
                if (appointmentDate.toDateString() === currentDate.toDateString()) {
                    totalBillForToday += (outPatient.billAmount + outPatient.treatmentCharges); // Add billAmount to totalBillForToday
                }
            });
        });
        console.log("totalBillForToday", totalBillForToday)

        // Send the totalBillForToday to the client
        res.status(200).json({ totalBillForToday });
    } catch (error) {
        console.error('Error fetching patients "today bill":', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get("/api/fetch_patient_count_on_current_month", async (req, res) => {
    const { clinicName, doctorName } = req.query;

    try {
        // Get the current date
        const currentDate = new Date();


        // Set the current date to the first day of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1); // Add one day
        console.log("firstDayOfMonth", firstDayOfMonth)

        // Set the current date to the last day of the month
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1); // Add one day
        console.log("lastDayOfMonth", lastDayOfMonth)


        // Create arrays to store current month dates and patient counts
        const currentMonthDates = [];
        const currentMonthPatientCount = [];

        // Loop through each date of the current month
        for (let date = new Date(firstDayOfMonth); date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
            const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

            // Check if the object with clinicName and doctorName exists
            const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

            if (existingAdminDetails) {
                // Find the appointment with the current date
                const appointment = existingAdminDetails.appointments.find(appointment => {
                    const appointmentDate = appointment.date.toISOString().split('T')[0];
                    return appointmentDate === dateString;
                });

                if (appointment) {
                    // Push the length of the todayVisitedPatients array to currentMonthPatientCount
                    currentMonthPatientCount.push(appointment.todayVisitedPatients.length);
                } else {
                    // If no appointments are found for the current date, push 0 to currentMonthPatientCount
                    currentMonthPatientCount.push(0);
                }
            } else {
                // If no object with the provided clinicName and doctorName exists, push 0 to currentMonthPatientCount
                currentMonthPatientCount.push(0);
            }

            // Push the current date to currentMonthDates
            currentMonthDates.push(dateString);
        }

        // Send the current month dates and patient counts to the client
        res.status(200).json({ currentMonthDates, currentMonthPatientCount });
    } catch (error) {
        console.error("Error fetching patient count on particular day:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/find_selective_appointments", async (req, res) => {
    const { dateString, clinicName, doctorName } = req.query;
    console.log("date in find_selective_appointments ", dateString);

    try {
        // Check if the object with clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (existingAdminDetails) {
            // Find the appointment with the provided date
            const appointment = existingAdminDetails.appointments.find(appointment => {
                const appointmentDate = appointment.date.toISOString().split('T')[0];
                return appointmentDate === dateString;
            });

            if (appointment) {
                console.log(appointment.patients)
                // Send the details of the patients from the patients array to the client
                return res.status(200).json({ patients: appointment.patients });
            } else {
                console.log("No appointments found for the provided date")
                // If no appointments are found for the provided date, send a message to the client
                return res.status(200).json({ message: "No appointments found for the provided date" });
            }
        } else {
            // If no object with the provided clinicName and doctorName exists, send a message to the client
            return res.status(404).json({ message: "No admin details found for the provided clinic and doctor" });
        }
    } catch (error) {
        // If an error occurs, respond with an error status and message
        console.error("Error finding selective appointments:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/api/fetch_monthly_amount", async (req, res) => {
    const { clinicName, doctorName, currentDate, firstDayOfMonth, firstDayOfPreviousMonth, lastDayOfPreviousMonth, daysInCurrentMonth, daysInPreviousMonth } = req.query;
    console.log("monthly amt 1", clinicName, doctorName, currentDate, firstDayOfMonth, firstDayOfPreviousMonth, lastDayOfPreviousMonth, daysInCurrentMonth, daysInPreviousMonth);

    try {

        // Convert query string dates to Date objects
        const currentDateObj = new Date(currentDate);
        const firstDayOfMonthObj = new Date(firstDayOfMonth);
        const firstDayOfPreviousMonthObj = new Date(firstDayOfPreviousMonth);
        const lastDayOfPreviousMonthObj = new Date(lastDayOfPreviousMonth);

        // Increment dates by one day
        currentDateObj.setDate(currentDateObj.getDate() );
        firstDayOfMonthObj.setDate(firstDayOfMonthObj.getDate() );
        firstDayOfPreviousMonthObj.setDate(firstDayOfPreviousMonthObj.getDate() );
        lastDayOfPreviousMonthObj.setDate(lastDayOfPreviousMonthObj.getDate() );

        console.log("monthly amt 2", clinicName, doctorName, currentDateObj, firstDayOfMonthObj, firstDayOfPreviousMonthObj, lastDayOfPreviousMonthObj, daysInCurrentMonth, daysInPreviousMonth);


        // Retrieve patients with the provided clinicName and doctorName
        const patients = await BasicDetails.find({ clinicName, doctorName }).exec();

        let totalAmount = 0;
        let previousMonthTotalAmount = 0;

        if (patients && patients.length > 0) {
            // Filter patient records based on admission date and appointment date
            patients.forEach(patient => {
                patient.inPatientBill.forEach(inPatient => {
                    const admissionDate = new Date(inPatient.admissionDate);
                    // const admissionDateOnly = new Date(admissionDate.getFullYear(), admissionDate.getMonth(), admissionDate.getDate());
                    // Extract only the date part of the dates
                    const admissionDateOnly = `${admissionDate.getFullYear()}-${('0' + (admissionDate.getMonth() + 1)).slice(-2)}-${('0' + admissionDate.getDate()).slice(-2)}`;
                    const firstDayOfMonthObjOnly = `${firstDayOfMonthObj.getFullYear()}-${('0' + (firstDayOfMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfMonthObj.getDate()).slice(-2)}`;
                    const currentDateObjOnly = `${currentDateObj.getFullYear()}-${('0' + (currentDateObj.getMonth() + 1)).slice(-2)}-${('0' + currentDateObj.getDate()).slice(-2)}`;


                    if (admissionDateOnly >= firstDayOfMonthObjOnly && admissionDateOnly <= currentDateObjOnly) {
                        console.log("monthly inpat curr",admissionDateOnly,firstDayOfMonthObjOnly,currentDateObjOnly)

                        totalAmount += inPatient.billAmount;
                    }
                });


                patient.outPatientBill.forEach(outPatient => {
                    const appointmentDate = new Date(outPatient.appointmentDate);
                    // const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());

                    // Extract only the date part of the dates
                    const appointmentDateOnly = `${appointmentDate.getFullYear()}-${('0' + (appointmentDate.getMonth() + 1)).slice(-2)}-${('0' + appointmentDate.getDate()).slice(-2)}`;
                    const firstDayOfMonthObjOnly = `${firstDayOfMonthObj.getFullYear()}-${('0' + (firstDayOfMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfMonthObj.getDate()).slice(-2)}`;
                    const currentDateObjOnly = `${currentDateObj.getFullYear()}-${('0' + (currentDateObj.getMonth() + 1)).slice(-2)}-${('0' + currentDateObj.getDate()).slice(-2)}`;


                    if (appointmentDateOnly >= firstDayOfMonthObjOnly && appointmentDateOnly <= currentDateObjOnly) {
                        console.log("monthly outpat curr",appointmentDateOnly,firstDayOfMonthObjOnly,currentDateObjOnly)

                        totalAmount += (outPatient.billAmount + outPatient.treatmentCharges);
                    }
                });
            });



            // Filter patient records based on admission date and appointment date for the previous month
            patients.forEach(patient => {
                patient.inPatientBill.forEach(inPatient => {
                    const admissionDate = new Date(inPatient.admissionDate);
                    //const admissionDateOnly = new Date(admissionDate.getFullYear(), admissionDate.getMonth(), admissionDate.getDate());

                    const admissionDateOnly = `${admissionDate.getFullYear()}-${('0' + (admissionDate.getMonth() + 1)).slice(-2)}-${('0' + admissionDate.getDate()).slice(-2)}`;
                    const firstDayOfPreviousMonthObjOnly = `${firstDayOfPreviousMonthObj.getFullYear()}-${('0' + (firstDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfPreviousMonthObj.getDate()).slice(-2)}`;
                    const lastDayOfPreviousMonthObjOnly = `${lastDayOfPreviousMonthObj.getFullYear()}-${('0' + (lastDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + lastDayOfPreviousMonthObj.getDate()).slice(-2)}`;


                    if (admissionDateOnly >= firstDayOfPreviousMonthObjOnly && admissionDateOnly <= lastDayOfPreviousMonthObjOnly) {
                        console.log("monthly inpat prev",admissionDateOnly,firstDayOfPreviousMonthObjOnly,lastDayOfPreviousMonthObjOnly)

                        previousMonthTotalAmount += inPatient.billAmount;
                    }
                });



                patient.outPatientBill.forEach(outPatient => {
                    const appointmentDate = new Date(outPatient.appointmentDate);
                    // const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());

                    const appointmentDateOnly = `${appointmentDate.getFullYear()}-${('0' + (appointmentDate.getMonth() + 1)).slice(-2)}-${('0' + appointmentDate.getDate()).slice(-2)}`;
                    const firstDayOfPreviousMonthObjOnly = `${firstDayOfPreviousMonthObj.getFullYear()}-${('0' + (firstDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfPreviousMonthObj.getDate()).slice(-2)}`;
                    const lastDayOfPreviousMonthObjOnly = `${lastDayOfPreviousMonthObj.getFullYear()}-${('0' + (lastDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + lastDayOfPreviousMonthObj.getDate()).slice(-2)}`;

                    if (appointmentDateOnly >= firstDayOfPreviousMonthObjOnly && appointmentDateOnly <= lastDayOfPreviousMonthObjOnly) {
                        console.log("monthly outpat prev",appointmentDateOnly,firstDayOfPreviousMonthObjOnly,lastDayOfPreviousMonthObjOnly)

                        previousMonthTotalAmount += (outPatient.billAmount + outPatient.treatmentCharges);
                    }
                });

            });
        }

        // Calculate averages
        // const totalAmountAverage = totalAmount / daysInCurrentMonth;
        // const previousMonthTotalAmountAverage = previousMonthTotalAmount / daysInPreviousMonth;

        // Calculate percentage change
        const percentageChange = Math.round(((totalAmount - previousMonthTotalAmount) / previousMonthTotalAmount) * 100);



        // Send the total sums and percentage change to the client
        res.status(200).json({ totalAmount, previousMonthTotalAmount, percentageChange });
    } catch (error) {
        console.error('Error fetching monthly amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/api/fetch_monthly_patient", async (req, res) => {
    const { clinicName, doctorName, currentDate, firstDayOfMonth, firstDayOfPreviousMonth, lastDayOfPreviousMonth, daysInCurrentMonth, daysInPreviousMonth } = req.query;
    console.log("mon pati 1", clinicName, doctorName, currentDate, firstDayOfMonth, firstDayOfPreviousMonth, lastDayOfPreviousMonth, daysInCurrentMonth, daysInPreviousMonth);

    try {
        // Convert query string dates to Date objects
        const currentDateObj = new Date(currentDate);
        const firstDayOfMonthObj = new Date(firstDayOfMonth);
        const firstDayOfPreviousMonthObj = new Date(firstDayOfPreviousMonth);
        const lastDayOfPreviousMonthObj = new Date(lastDayOfPreviousMonth);

        // Increment dates by one day
        currentDateObj.setDate(currentDateObj.getDate());
        firstDayOfMonthObj.setDate(firstDayOfMonthObj.getDate());
        firstDayOfPreviousMonthObj.setDate(firstDayOfPreviousMonthObj.getDate());
        lastDayOfPreviousMonthObj.setDate(lastDayOfPreviousMonthObj.getDate());

        console.log("mon pati 2", clinicName, doctorName, currentDateObj, firstDayOfMonthObj, firstDayOfPreviousMonthObj, lastDayOfPreviousMonthObj, daysInCurrentMonth, daysInPreviousMonth);

        // Check if the object with clinicName and doctorName exists
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName }).exec();

        let totalPatient = 0;
        let previousMonthTotalPatient = 0;

        if (existingAdminDetails) {
            // Filter appointments array to include only appointments within the specified date range
            const filteredAppointmentsCurrentMonth = existingAdminDetails.appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);

                // Extract only the date part of the dates
                const appointmentDateOnly = `${appointmentDate.getFullYear()}-${('0' + (appointmentDate.getMonth() + 1)).slice(-2)}-${('0' + appointmentDate.getDate()).slice(-2)}`;
                const firstDayOfMonthOnly = `${firstDayOfMonthObj.getFullYear()}-${('0' + (firstDayOfMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfMonthObj.getDate()).slice(-2)}`;
                const currentDateOnly = `${currentDateObj.getFullYear()}-${('0' + (currentDateObj.getMonth() + 1)).slice(-2)}-${('0' + currentDateObj.getDate()).slice(-2)}`;

                // console.log("heee", appointmentDateOnly, firstDayOfMonthOnly, currentDateOnly);
                return appointmentDateOnly >= firstDayOfMonthOnly && appointmentDateOnly <= currentDateOnly;
            });

            // Filter appointments array for the previous month
            const filteredAppointmentsPreviousMonth = existingAdminDetails.appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);

                // Extract only the date part of the dates
                const appointmentDateOnly = `${appointmentDate.getFullYear()}-${('0' + (appointmentDate.getMonth() + 1)).slice(-2)}-${('0' + appointmentDate.getDate()).slice(-2)}`;
                const firstDayOfPreviousMonthOnly = `${firstDayOfPreviousMonthObj.getFullYear()}-${('0' + (firstDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfPreviousMonthObj.getDate()).slice(-2)}`;
                const lastDayOfPreviousMonthOnly = `${lastDayOfPreviousMonthObj.getFullYear()}-${('0' + (lastDayOfPreviousMonthObj.getMonth() + 1)).slice(-2)}-${('0' + lastDayOfPreviousMonthObj.getDate()).slice(-2)}`;


                // console.log("leee", appointmentDateOnly, firstDayOfPreviousMonthOnly, lastDayOfPreviousMonthOnly);

                return appointmentDateOnly >= firstDayOfPreviousMonthOnly && appointmentDateOnly <= lastDayOfPreviousMonthOnly;
            });

            // console.log("filteredAppointmentsCurrentMonth",filteredAppointmentsCurrentMonth);

            // Calculate total number of patients who visited during the current month
            totalPatient = filteredAppointmentsCurrentMonth.reduce((total, appointment) => {
                return total + appointment.todayVisitedPatients.length;
            }, 0);

            // console.log("totalPatient",totalPatient);


            // Calculate total number of patients who visited during the previous month
            previousMonthTotalPatient = filteredAppointmentsPreviousMonth.reduce((total, appointment) => {
                return total + appointment.todayVisitedPatients.length;
            }, 0);

            // console.log("previousMonthTotalPatient",previousMonthTotalPatient);

            // Calculate percentage change
            const percentageChange = Math.round(((totalPatient - previousMonthTotalPatient) / previousMonthTotalPatient) * 100);



            // console.log("totalPatient",totalPatient);


            // Send the totalPatient count and previousMonthTotalPatient count to the client
            res.status(200).json({ totalPatient, previousMonthTotalPatient, percentageChange });
        } else {
            // If no object with the provided clinicName and doctorName exists, send a message to the client
            res.status(200).json({ message: "No admin details found for the provided clinic and doctor" });
        }
    } catch (error) {
        console.error('Error fetching monthly patient count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get("/api/fetch_inout_count_current_month", async (req, res) => {
    const { clinicName, doctorName } = req.query;

    try {
        // Get the current date
        const currentDate = new Date();

        // Set the current date to the first day of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate()); // Add one day

        // Retrieve patients with the provided clinicName and doctorName
        const patients = await BasicDetails.find({ clinicName, doctorName }).exec();

        let inPatientCount = 0;
        let outPatientCount = 0;

        if (patients && patients.length > 0) {
            // Iterate through patients and their planTreatment array
            patients.forEach(patient => {
                patient.planTreatment.forEach(treatment => {
                    // Convert treatment startDate to a string representing the date
                    const startDate = new Date(treatment.startDate);
                    const startDateOnly = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;

                    // Convert firstDayOfMonth to a string representing the date
                    const firstDayOfMonthOnly = `${firstDayOfMonth.getFullYear()}-${('0' + (firstDayOfMonth.getMonth() + 1)).slice(-2)}-${('0' + firstDayOfMonth.getDate()).slice(-2)}`;

                    // Convert currentDate to a string representing the date
                    const currentDateOnly = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;

                    console.log("1", startDateOnly, firstDayOfMonthOnly, currentDateOnly);

                    // Check if the treatment falls within the period
                    if (startDateOnly >= firstDayOfMonthOnly && startDateOnly <= currentDateOnly) {
                        console.log("2", startDateOnly, firstDayOfMonthOnly, currentDateOnly);

                        // Check patientType and increment corresponding count
                        if (treatment.patientType === 'inpatient') {
                            inPatientCount++;
                        } else if (treatment.patientType === 'outpatient') {
                            outPatientCount++;
                        }
                    }
                });
            });
        }

        console.log(" inPatientCount, outPatientCount", inPatientCount, outPatientCount);

        // Send the inpatient and outpatient counts to the client
        res.status(200).json({ inPatientCount, outPatientCount });
    } catch (error) {
        console.error('Error fetching inpatient and outpatient counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get("/api/fetch_status_appointments", async (req, res) => {
    const { clinicName, doctorName, todayAppointment } = req.query;

    try {
        // Find the AdminDetails object with the provided clinicName and doctorName
        const existingAdminDetails = await adminDetails.findOne({ clinicName, doctorName });

        if (!existingAdminDetails) {
            return res.status(404).json({ error: "AdminDetails not found" });
        }

        // Parse the JSON string back to an array of objects
        const parsedTodayAppointment = JSON.parse(todayAppointment);

        // Find the appointments array with the current date
        const currentDate = new Date();
        const currentDatePart = currentDate.toISOString().split('T')[0];
        const appointment = existingAdminDetails.appointments.find(appointment => {
            const appointmentDatePart = appointment.date.toISOString().split('T')[0];
            return appointmentDatePart === currentDatePart;
        });

        if (!appointment) {
            return res.status(404).json({ error: "No appointments found for the current date" });
        }

        // Initialize an array to store the status of each appointment
        const statusAppointments = [];

        // Traverse the parsedTodayAppointment array and update the status of each appointment
        parsedTodayAppointment.forEach(app => {
            const { tokenid, mobileNo } = app;

            let status = "not-visited";
            let waitingPatient, notvisitedPatient, visitedPatient;

            // console.log("appointment.todayVisitedPatients", appointment.todayVisitedPatients);

            // Check if the appointment's tokenid and mobileNo are in todayVisitedPatients or todayWaitingPatients
            if (appointment.todayVisitedPatients && appointment.todayVisitedPatients.length > 0) {
                // console.log("inside today visi");
                visitedPatient = appointment.todayVisitedPatients.find(patient => {
                    return patient.tokenid === tokenid && patient.mobileNo === mobileNo;
                });

            }

            // console.log("appointment.todayWaitingPatients", appointment.todayWaitingPatients);
            if (status !== "visited" && appointment.todayWaitingPatients && appointment.todayWaitingPatients.length > 0) {
                waitingPatient = appointment.todayWaitingPatients.find(patient => {
                    return patient.tokenid === tokenid && patient.mobileNo === mobileNo;
                });
            }
            if (status !== "visited" && appointment.todayNotVisitedPatients && appointment.todayNotVisitedPatients.length > 0) {
                notvisitedPatient = appointment.todayNotVisitedPatients.find(patient => {
                    return patient.tokenid === tokenid && patient.mobileNo === mobileNo;
                });

            }

            if (visitedPatient && waitingPatient) {
                status = "visited";
            }

            if (!waitingPatient && !notvisitedPatient) {
                status = "completed";
            }
            statusAppointments.push({ tokenid, mobileNo, status });
        });

        // Respond with the status of the appointment array
        res.status(200).json({ statusAppointments });
    } catch (error) {
        console.error("Error fetching status appointments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/api/update_prescription", async (req, res) => {
    const { mobileNo, medication, exercise, clinicName, doctorName } = req.body;

    try {
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo, clinicName, doctorName });

        if (foundPatient) {
            console.log("Patientfounded");
            foundPatient.medication = medication;
            foundPatient.exercise = exercise;
            await foundPatient.save();
            res.status(202).json({ message: "Prescription updated successfully." });
        } else {
            res.status(404).json({ error: "Patient not found." });
        }
    } catch (error) {
        console.error("Error updating prescription:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/api/fetch_prescription", async (req, res) => {
    const { mobileNo, clinicName, doctorName } = req.query;

    try {
        // Assuming BasicDetails is your mongoose model
        const foundPatient = await BasicDetails.findOne({ mobileNo: mobileNo, clinicName, doctorName });

        if (foundPatient) {
            res.status(200).json({ medication: foundPatient.medication, exercise: foundPatient.exercise });
        } else {
            res.status(404).json({ error: "Patient not found." });
        }
    } catch (error) {
        console.error("Error fetching prescription data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
