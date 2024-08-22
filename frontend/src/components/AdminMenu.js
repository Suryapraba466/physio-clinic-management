import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import html2canvas from "html2canvas";
import { useNavigate, useLocation } from "react-router-dom";
import UpdateRecord from "./UpdateRecord";
import BasicRecord from "./BasicRecord";
import ExistingRecordForm from "./ExistingRecordForm";
import InPatientBill from "./InPatientBill";
import OutPatientBill from "./OutPatientBill";
import powerButton from "./power-button.png";
import PatientDetails from "./PatientDetails";
import Treatment from "./Treatment";
import Appointment from "./Appointment";
//import './CSS/landpage.css';
import "./CSS/landingpage.css";
import "./CSS/Dashboard.css";
import "./CSS/tooltip.css";
import "./CSS/appointment-overlay.css";
import "./CSS/reminder-overlay.css";

import logoimg from "../components/images/yoga.png";

import remainericon from "./images/paper-plane.png";
import searchicon from "./images/magnifying-glass.png";
import errorimg from "./landing-page-imgs/error.png";
import checklist from "./landing-page-imgs/checklist.png";
import addfile from "./content icons/add-file.png";
import update from "./content icons/update.png";
import inbill from "./content icons/transaction.png";
import outbill from "./content icons/medical.png";
import search from "./content icons/search.png";
import createrecord from "./landing-page-imgs/createrecord.jpg";
import updaterecord from "./landing-page-imgs/updaterecord.jpg";
import inpatientbill from "./landing-page-imgs/inpatientbill.jpg";
import outpatientbill from "./landing-page-imgs/outpatientbill.jpg";
import record from "./landing-page-imgs/record.jpg";

import Calendar from "react-calendar";
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const AdminMenu = () => {
  const [remainderChart, setRemainderChart] = useState(null);
  const [remainderLoading, setRemainderLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [eventSource, setEventSource] = useState(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(true);
  const [showExistingRecordForm, setShowExistingRecordForm] = useState(false);
  const [showUpdateRecord, setShowUpdateRecord] = useState(false);
  const [showBasicRecord, setShowBasicRecord] = useState(false);
  const [showInPatientBill, setShowInPatientBill] = useState(false);
  const [showOutPatientBill, setShowOutPatientBill] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showMobileErrorToast, setShowMobileErrorToast] = useState(false);

  const [showNetworkErrorToast, setShowNetworkErrorToast] = useState(false);
  const [showVisitedSuccessToast, setShowVisitedSuccessToast] = useState(false);
  const [showVisitedFailToast, setShowVisitedFailToast] = useState(false);
  const [showCompletedSuccessToast, setShowCompletedSuccessToast] =
    useState(false);
  const [showUnexpectedErrorToast, setShowUnexpectedErrorToast] =
    useState(false);
  const [showCompletedFailToast, setShowCompletedFailToast] = useState(false);
  const [showNotVisitedSuccessToast, setShowNotVisitedSuccessToast] =
    useState(false);
  const [showNotVisitedFail1Toast, setShowNotVisitedFail1Toast] =
    useState(false);
  const [showNotVisitedFail2Toast, setShowNotVisitedFail2Toast] =
    useState(false);
  const [showCalenderFail, setShowCalenderFail] = useState(false);
  const [showNoAppointment, setShowNoAppointment] = useState(false);
  const [showNoPatientThreeDays, setShowNoPatientThreeDays] = useState(false);
  const [stillRemainderNotSentToast, setStillRemainderNotSentToast] =
    useState(false);

  const [showServerNetworkErrorToast, setShowServerNetworkErrorToast] =
    useState(false);
  const [showAdminDetailsNotFound, setShowAdminDetailsNotFound] =
    useState(false);

  const [amountCurrentMonth, setAmountCurrentMonth] = useState(
    new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
  );
  const [patientCurrentMonth, setPatientCurrentMonth] = useState(
    new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
  );
  const [inoutpatientCurrentMonth, setInOutPatientCurrentMonth] = useState(
    new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
  );

  const [successReminders, setSuccessReminders] = useState([]);
  const [failedReminders, setFailedReminders] = useState([]);

  const [showNavBar, setShowNavBar] = useState(false);
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);

  const [deviceType, setDeviceType] = useState(null);
  const overlayClass = `loading-overlay${loading || isLoading ? " visible" : ""
    }`;
  const [mobile, setMobile] = useState(false);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [ordersInProcess, setOrdersInProcess] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [ordersReceived, setOrdersReceived] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false); // State to track overlay open/close
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [remainderOverlay, setRemainderOverlay] = useState(false);

  const [patients, setPatients] = useState([]);
  const [visitingPatients, setVisitingPatients] = useState([]);
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [todayNotVisited, setTodayNotVisited] = useState([]);
  const [todayVisited, setTodayVisited] = useState([]);
  const [todayCompleted, setTodayCompleted] = useState([]);

  // State variables to track button visibility
  const [notVisitedVisible, setNotVisitedVisible] = useState(true);
  const [visitedVisible, setVisitedVisible] = useState(true);
  const [completedVisible, setCompletedVisible] = useState(true);

  //const [todayAppointment, setTodayAppointment] = useState([]);
  // let todayNoOfAppointments = 0;
  // let numberOfPatientsVisited = 0;
  // let totalBillForToday = 0;
  const [selectedMonthPatient, setSelectedMonthPatient] = useState(new Date());
  const [percentagePatient, setPercentagePatient] = useState(0);
  const [currentMonthPatient, setCurrentMonthPatient] = useState(
    new Date().getMonth()
  );

  const [inPatientCount, setInPatientCount] = useState(0);
  const [outPatientCount, setOutPatientCount] = useState(0);

  const [selectedMonthAmount, setSelectedMonthAmount] = useState(new Date());
  const [percentageAmount, setPrecentageAmount] = useState(0);
  const [currentMonthAmount, setCurrentMonthAmount] = useState(
    new Date().getMonth()
  );
  const [totalBillForMonth, setTotalBillForMonth] = useState(0);

  const [totalBillForToday, setTotalBillForToday] = useState(0);
  const [totalBillForCurrentMonth, setTotalBillForCurrentMonth] = useState(0);
  const [totalPatientForMonth, setTotalPatientForMonth] = useState(0);
  const [numberOfPatientsVisited, setNumberOfPatientsVisited] = useState(0);
  const [todayNoOfAppointments, setTodayNoOfAppointments] = useState(0);
  const [chartInstance, setChartInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRemainderTerm, setSearchRemainderTerm] = useState("");

  const clinicName = localStorage.getItem("clinicName");
  const doctorName = localStorage.getItem("doctorName");

  const [chartData, setChartData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectiveAppointment, setSelectiveAppointment] = useState([]);
  const [selectiveAppointmentOverlay, setSelectiveAppointmentOverlay] =
    useState(false);

  const [statusFetched, setStatusFetched] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState([]);

  // Check if the values are not null or undefined before using them
  // Check if the values are not null or undefined before using them
  if (clinicName && doctorName) {
    // Do something with the values, such as displaying them on the UI
    console.log("Clinic Name:", clinicName);
    console.log("Doctor Name:", doctorName);
  } else {
    // Handle the case where the values are not found in localStorage
    console.log("Clinic Name or Doctor Name not found in localStorage");
    navigate("/Login");
  }

  const safelyCallDestroy = (chartInstance) => {
    if (chartInstance && chartInstance.destroy) {
      chartInstance.destroy();
    }
  };

  useEffect(() => {
    let newChart = null;
    let source = null;
    if (remainderLoading) {
      const remainderDonutChartCanvas =
        document.getElementById("progressChart");

      const chartWidth = 150;
      const chartHeight = 150;
      remainderDonutChartCanvas.width = chartWidth;
      remainderDonutChartCanvas.height = chartHeight;

      console.log("Canvassssssss Width:", remainderDonutChartCanvas.width);
      console.log("Canvassssssssss Height:", remainderDonutChartCanvas.height);

      const ctx = remainderDonutChartCanvas.getContext("2d");

      if (remainderDonutChartCanvas) {
        newChart = new Chart(remainderDonutChartCanvas, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [loadingProgress, 100 - loadingProgress],
                backgroundColor: ["#3477f5", "#f5f5f5"],
              },
            ],
          },
          options: {
            cutout: "80%",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
              annotation: {
                annotations: [
                  {
                    type: "text",
                    fontColor: "grey",
                    fontSize: 10,
                    fontStyle: "bold",
                    textAlign: "center",
                    text: `${Math.round(loadingProgress)}%`,
                    x: "50%",
                    y: "50%",
                  },
                ],
              },
            },
            cutout: "85%",
          },
          plugins: [
            {
              id: "remainderLabel",
              afterDraw: (chart) => {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = "rgb(20,20,20)";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "calc(0.5rem + 2vw) FjallaOne-Regular";
                ctx.fillText(
                  `${Math.round(loadingProgress)}%`,
                  width / 2,
                  height / 2
                );
                ctx.restore();
              },
            },
          ],
        });
        setRemainderChart(newChart);
        const source = new EventSource(
          "https://rehab-rythm-ti17.vercel.app/api/progress-updates"
        );

        source.onmessage = (event) => {
          const progressPercentage = parseFloat(event.data);
          setLoadingProgress(progressPercentage);
        };

        source.onerror = (error) => {
          console.error("Error occurred:", error);
          source.close();
        };

        setEventSource(source);
      }
    } else {
      // Destroy the existing chart if remainderLoading becomes false
      safelyCallDestroy(remainderChart);
      setRemainderChart(null);

      // Close the event source when remainderLoading becomes false
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
    }

    // Cleanup functions
    return () => {
      safelyCallDestroy(newChart);
      if (source) {
        source.close();
        setEventSource(null);
      }
    };
  }, [loadingProgress, remainderLoading]);

  const handleTotalMonthlyPatient = async (monthType) => {
    let targetDate = new Date(selectedMonthPatient);
    if (monthType === "previous") {
      targetDate.setMonth(targetDate.getMonth() - 1);
    } else if (monthType === "next") {
      targetDate.setMonth(targetDate.getMonth() + 1);
    }

    const firstDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );

    // Calculate the first day of the previous month
    const firstDayOfPreviousMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() - 1,
      1
    );

    let lastDayOfPreviousMonth,
      daysInPreviousMonth,
      daysInCurrentMonth,
      lastDayOfMonth;
    if (monthType === "current") {
      // Calculate the last day of the previous month
      lastDayOfPreviousMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        0
      );

      // Calculate the number of days in the previous month
      daysInPreviousMonth =
        Math.ceil(
          (lastDayOfPreviousMonth - firstDayOfPreviousMonth) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      // Calculate the number of days in the current month
      daysInCurrentMonth =
        Math.ceil((targetDate - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1;

      lastDayOfMonth = targetDate;
    } else {
      const currentMonth = new Date().getMonth();
      if (targetDate.getMonth() === currentMonth) {
        lastDayOfMonth = targetDate;
      } else {
        lastDayOfMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0
        );
      }

      // Calculate the last day of the previous month
      lastDayOfPreviousMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        0
      );

      // Calculate the number of days in the previous month
      daysInPreviousMonth =
        Math.ceil(
          (lastDayOfPreviousMonth - firstDayOfPreviousMonth) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      // Calculate the number of days in the current month
      if (targetDate.getMonth() === currentMonth) {
        daysInCurrentMonth = Math.ceil(
          (lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24)
        );
      } else {
        daysInCurrentMonth =
          Math.ceil(
            (lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24)
          ) + 1;
      }
    }

    setPatientCurrentMonth(
      targetDate.toLocaleString("en-US", { month: "short", year: "numeric" })
    );

    console.log(
      clinicName,
      doctorName,
      lastDayOfMonth,
      firstDayOfMonth,
      firstDayOfPreviousMonth,
      lastDayOfPreviousMonth,
      daysInCurrentMonth,
      daysInPreviousMonth
    );

    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_monthly_patient",
        {
          params: {
            clinicName,
            doctorName,
            currentDate: lastDayOfMonth,
            firstDayOfMonth,
            firstDayOfPreviousMonth,
            lastDayOfPreviousMonth,
            daysInCurrentMonth,
            daysInPreviousMonth,
          },
        },
        console.log(
          clinicName,
          doctorName,
          lastDayOfMonth,
          firstDayOfMonth,
          firstDayOfPreviousMonth,
          lastDayOfPreviousMonth,
          daysInCurrentMonth,
          daysInPreviousMonth
        )
      );

      if (response.status === 200) {
        const { totalPatient, previousMonthTotalPatient, percentageChange } =
          response.data;
        console.log(
          "Total monthly patient:",
          totalPatient,
          previousMonthTotalPatient,
          percentageChange
        );
        setTotalPatientForMonth(totalPatient);
        setSelectedMonthPatient(targetDate);
        setPercentagePatient(percentageChange);
        // Now you can use the totalAmount as needed, such as displaying it in your UI
      } else {
        console.log("Failed to fetch total monthly amount");
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error fetching total monthly amount:", error);
      // Handle errors here
    }
  };

  const fetchInOutCount = async () => {
    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_inout_count_current_month",
        {
          params: {
            // date,
            clinicName, // Make sure clinicName and doctorName are defined before using them here
            doctorName,
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        const { inPatientCount, outPatientCount } = response.data;
        console.log("In out count:", inPatientCount, outPatientCount);
        setInPatientCount(inPatientCount);
        setOutPatientCount(outPatientCount);
      } else {
        console.log("No in out count");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log("Server error:", error.response.status);
          // Handle server error
        }
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error fetching today bill:", error.message);
        // Handle other errors
      }
    }
  };

  const handleTotalMonthlyAmount = async (monthType) => {
    let targetDate = new Date(selectedMonthAmount);
    if (monthType === "previous") {
      targetDate.setMonth(targetDate.getMonth() - 1);
    } else if (monthType === "next") {
      targetDate.setMonth(targetDate.getMonth() + 1);
    }

    const firstDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );

    // Calculate the first day of the previous month
    const firstDayOfPreviousMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() - 1,
      1
    );

    let lastDayOfPreviousMonth,
      daysInPreviousMonth,
      daysInCurrentMonth,
      lastDayOfMonth;
    if (monthType === "current") {
      // Calculate the last day of the previous month
      lastDayOfPreviousMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        0
      );

      // Calculate the number of days in the previous month
      daysInPreviousMonth =
        Math.ceil(
          (lastDayOfPreviousMonth - firstDayOfPreviousMonth) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      // Calculate the number of days in the current month
      daysInCurrentMonth =
        Math.ceil((targetDate - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1;

      lastDayOfMonth = targetDate;
    } else {
      const currentMonth = new Date().getMonth();
      if (targetDate.getMonth() === currentMonth) {
        lastDayOfMonth = targetDate;
      } else {
        lastDayOfMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0
        );
      }

      // Calculate the last day of the previous month
      lastDayOfPreviousMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        0
      );

      // Calculate the number of days in the previous month
      daysInPreviousMonth =
        Math.ceil(
          (lastDayOfPreviousMonth - firstDayOfPreviousMonth) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      // Calculate the number of days in the current month
      if (targetDate.getMonth() === currentMonth) {
        daysInCurrentMonth = Math.ceil(
          (lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24)
        );
      } else {
        daysInCurrentMonth =
          Math.ceil(
            (lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24)
          ) + 1;
      }
    }

    console.log(
      clinicName,
      doctorName,
      lastDayOfMonth,
      firstDayOfMonth,
      firstDayOfPreviousMonth,
      lastDayOfPreviousMonth,
      daysInCurrentMonth,
      daysInPreviousMonth
    );
    console.log(
      "Month and Year:",
      targetDate.toLocaleString("en-US", { month: "long", year: "numeric" })
    );

    setAmountCurrentMonth(
      targetDate.toLocaleString("en-US", { month: "short", year: "numeric" })
    );
    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_monthly_amount",
        {
          params: {
            clinicName,
            doctorName,
            currentDate: lastDayOfMonth,
            firstDayOfMonth,
            firstDayOfPreviousMonth,
            lastDayOfPreviousMonth,
            daysInCurrentMonth,
            daysInPreviousMonth,
          },
        },
        console.log(
          clinicName,
          doctorName,
          lastDayOfMonth,
          firstDayOfMonth,
          firstDayOfPreviousMonth,
          lastDayOfPreviousMonth,
          daysInCurrentMonth,
          daysInPreviousMonth
        )
      );

      if (response.status === 200) {
        const {
          totalAmount,
          previousMonthTotalAmount,
          totalAmountAverage,
          previousMonthTotalAmountAverage,
          percentageChange,
        } = response.data;
        console.log(
          "Total monthly amount:",
          totalAmount,
          previousMonthTotalAmount,
          percentageChange
        );
        setTotalBillForMonth(totalAmount);
        setSelectedMonthAmount(targetDate);
        setPrecentageAmount(percentageChange);
        // Now you can use the totalAmount as needed, such as displaying it in your UI
      } else {
        console.log("Failed to fetch total monthly amount");
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error fetching total monthly amount:", error);
      // Handle errors here
    }
  };

  const fetchAppointments = async () => {
    try {
      // Make an API request to retrieve patients with a timeout of 30 seconds
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_appointments",
        {
          params: {
            clinicName,
            doctorName,
          },
          timeout: 8000,
        }
      );

      // Rest of your code remains the same...
      // Check the response status
      if (response.status === 200) {
        const { data } = response;

        console.log("Response from server:", data);

        if (data) {
          if (data.appointments && data.appointments.length > 0) {
            // Map patient details to the required format
            const formattedPatients = data.appointments.map(
              (patientDetails) => ({
                pid: patientDetails.pid,
                name: patientDetails.name,
                mobileNo: patientDetails.mobileNo,
                date: patientDetails.date,
                tokenid: patientDetails.tokenid,
              })
            );

            // Update state with the formatted patient details
            setTodayAppointment(formattedPatients);
            setLoading(false);
          } else {
            console.log("No appointments found.");
            alert("No appointments today");
          }

          // Store the count of appointments in todayNoOfAppointments variable
          setTodayNoOfAppointments(data.count);
          console.log("Number of appointments:", todayNoOfAppointments);
        } else {
          console.log("No data received from server.");
          setLoading(false);
          alert("Error in fetching appointments");
        }
      } else {
        // If response status is not 200, handle it here
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // If there's an error in the request or response
      if (axios.isCancel(error)) {
        console.log("Request timed out");
        alert("Request timed out. Please try again later.");
      } else if (error.response) {
        // If there's a response from the server
        if (error.response.status === 404) {
          console.log("Error 404: Not found");
          // alert("No appointments found for today");
          setShowNoAppointment(true);
          setTimeout(() => {
            setShowNoAppointment(false);
          }, 5300);
        } else if (error.response.status === 500) {
          console.log("Error 500: Internal server error");
          // alert("Internal server error occurred");
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } else {
        // If there's an error but no response from the server
        console.error("Error fetching appointments:", error);
        // alert("Error in fetching appointments");
        setShowUnexpectedErrorToast(true);
        setTimeout(() => {
          setShowUnexpectedErrorToast(false);
        }, 5300);
      }
    }
  };

  const fetchTodayVisited = async () => {
    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_todayvisited_appointments",
        {
          params: {
            clinicName,
            doctorName,
          },
          timeout: 8000,
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        const { todayWaitingPatients, numberOfPatientsVisited } = response.data;

        console.log("numberOfPatientsVisited", numberOfPatientsVisited);
        setNumberOfPatientsVisited(numberOfPatientsVisited);
        if (todayWaitingPatients && todayWaitingPatients.length >= 0) {
          setTodayVisited(todayWaitingPatients);
        } else {
          console.log("No appointments today visited");
        }
      } else {
        console.log("Server error:", response.status);
        // Handle other server errors
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          console.log("No appointments found for today");
          // Handle scenario when no appointments are found for today
        } else if (error.response.status === 500) {
          console.log("Server error:", error.response.status);
          // Handle server error
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(
          "Error fetching appointments for today visited:",
          error.request
        );
        // Handle request error
      } else {
        // Something happened in setting up the request that triggered an error
        console.error(
          "Error fetching appointments for today visited:",
          error.message
        );
        // Handle other errors
      }
    }
  };

  const [lineChartData, setLineChartData] = useState({});
  const [chartInstanceDoughnut, setChartInstanceDoughnut] = useState(null);
  const [chartInstanceLine, setChartInstanceLine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://rehab-rythm-ti17.vercel.app/api/fetch_patient_count_on_current_month",
          {
            params: {
              clinicName,
              doctorName,
            },
            timeout: 8000,
          }
        );

        if (response.status === 200) {
          const { currentMonthDates, currentMonthPatientCount } = response.data;
          setLineChartData({
            dates: currentMonthDates,
            counts: currentMonthPatientCount,
          });
        } else {
          console.log("Error: Unable to fetch patient count on particular day");
          // Handle the error
        }
      } catch (error) {
        console.error(
          "Error fetching patient count on particular day:",
          error.message
        );
        // Handle the error
      }
    };

    fetchData();
  }, [clinicName, doctorName]);

  useEffect(() => {
    // Function to create the doughnut chart and render line chart asynchronously
    const renderChartsAsync = () => {
      setTimeout(() => {
        createDoughnutChart();
        renderLineChart();
      }, 0);
    };
    // Call the function to render charts asynchronously
    renderChartsAsync();
    // Add event listener for screen resize
    window.addEventListener("resize", renderChartsAsync);
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", renderChartsAsync);
    };
  }, [lineChartData, numberOfPatientsVisited, todayNoOfAppointments]);

  const renderLineChart = () => {
    const { dates, counts } = lineChartData;
    const container = document.getElementById("dashboard-linechart-container");

    const canvas = document.getElementById("lineChart");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const chartWidth = container.clientWidth - 20;
      const chartHeight = container.clientHeight - 50;
      canvas.width = chartWidth;
      canvas.height = chartHeight;
      const existingChart = Chart.getChart(canvas);

      // Check if existing Chart instance exists
      if (existingChart) {
        // Destroy existing Chart
        existingChart.destroy();
      }
      // Check if chartInstanceLine exists and destroy it
      if (chartInstanceLine) {
        chartInstanceLine.destroy();
      }

      // Create a new chart instance for line chart
      setChartInstanceLine(
        new Chart(ctx, {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Patient Count",
                data: counts,
                borderColor: "#3477f5",
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                borderWidth: 1,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 2, // Set the step size to 2 to display integer values on y-axis
              },
              x: {
                ticks: {
                  callback: function (value, index, values) {
                    // Only show ticks for dates divisible by 5
                    if (
                      (index + 1) % 5 === 0 ||
                      index === 0 ||
                      index === values.length - 1
                    ) {
                      return value;
                    } else {
                      return ""; // Hide ticks for other dates
                    }
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Date: ${context.label}, Patients: ${context.raw}`;
                  },
                },
              },
              legend: {
                display: false,
              },
            },
          },
        })
      );
    }
  };

  const createDoughnutChart = () => {
    console.log("Inside createDoughnutChart");
    const container = document.getElementById("dashboard-donutchar-container");

    // Clear existing chart instance if it exists
    if (chartInstanceDoughnut) {
      chartInstanceDoughnut.destroy();
    }

    // Function to create the chart
    const renderChart = () => {
      const donutChartCanvas = document.getElementById("donutChart");
      if (donutChartCanvas) {
        // Update canvas dimensions based on container size
        const chartWidth = container.clientWidth - 20;
        const chartHeight = container.clientHeight - 50;
        donutChartCanvas.width = chartWidth;
        donutChartCanvas.height = chartHeight;
        const ctx = donutChartCanvas.getContext("2d");
        // Get existing Chart instance by canvas ID
        const existingChart = Chart.getChart(donutChartCanvas);

        // Check if existing Chart instance exists
        if (existingChart) {
          // Destroy existing Chart
          existingChart.destroy();
        }

        console.log(
          "todayNoOfAppointments:",
          todayNoOfAppointments,
          "numberOfPatientsVisited:",
          numberOfPatientsVisited
        );

        setChartInstanceDoughnut(
          new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: ["Patients Visited", "Patients Not Visited"],
              datasets: [
                {
                  data: [
                    numberOfPatientsVisited,
                    todayNoOfAppointments - numberOfPatientsVisited,
                  ],
                  backgroundColor: ["#3477f5", "#edf5ff"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              cutout: "80%",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
                annotation: {
                  annotations: [
                    {
                      type: "text",
                      fontColor: "grey",
                      fontSize: 10,
                      fontStyle: "bold",
                      textAlign: "center",
                      text: `${Math.round(todayNoOfAppointments)}`,
                      x: "50%",
                      y: "50%",
                    },
                  ],
                },
              },
              cutout: "85%",
            },
            plugins: [
              {
                id: "customLabel",
                afterDraw: (chart) => {
                  const width = chart.width;
                  const height = chart.height;
                  const ctx = chart.ctx;
                  ctx.save();
                  ctx.fillStyle = "rgb(20,20,20)";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.font = "calc(0.5rem + 2vw) FjallaOne-Regular";
                  ctx.fillText(
                    `${Math.round(todayNoOfAppointments)}`,
                    width / 2,
                    height / 2.5
                  );
                  ctx.restore();
                },
              },
            ],
          })
        );
      }
    };

    // Render the chart asynchronously with a delay
    setTimeout(renderChart, 0);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0, so adding 1
    const year = date.getFullYear();

    // Forming date string in the format YYYY-MM-DD
    const dateString = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""
      }${day}`;

    console.log("Selected Date:", dateString);

    try {
      // Send a GET request to find selective appointments
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/find_selective_appointments",
        {
          params: {
            dateString,
            clinicName,
            doctorName,
          },
          timeout: 8000,
        }
      );

      const { data } = response;

      if (response.status === 200) {
        // Check if data is available
        if (data.patients && data.patients.length > 0) {
          // Map patient details to the required format
          const formattedPatients = data.patients.map((patientDetails) => ({
            pid: patientDetails.pid,
            name: patientDetails.name,
            mobileNo: patientDetails.mobileNo,
            tokenid: patientDetails.tokenid,
          }));

          console.log("formattedPatients", formattedPatients);
          // Update state with the formatted patient details
          setSelectiveAppointment(formattedPatients);
          setSelectiveAppointmentOverlay(true);
        } else {
          // alert("No appointments found for the selected date");
          setShowCalenderFail(true);
          setTimeout(() => {
            setShowCalenderFail(false);
          }, 5300);
        }
      }

      // Handle response data here if needed
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // alert(
        //   "Error: No admin details found for the provided clinic and doctor"
        // );
        setShowAdminDetailsNotFound(true);
        setTimeout(() => {
          setShowAdminDetailsNotFound(false);
        }, 5300);
      } else {
        // alert("Error: in finding appointments for selected date");
        console.error("Error in finding appointments  selected date:", error);
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAppointments = todayAppointment.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemainderSearchChange = (event) => {
    setSearchRemainderTerm(event.target.value);
  };

  const filteredPatients = visitingPatients.filter((vp) =>
    vp.name.toLowerCase().includes(searchRemainderTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPatients();
    handleTotalMonthlyAmount("current");
    handleTotalMonthlyPatient("current");
    fetchInOutCount();
    fetchAppointments();
    fetchTodayVisited();
    fetchTodayBill();
  }, []);

  useEffect(() => {
    getStatus().then(() => {
      setStatusFetched(true);
    });
  }, [todayAppointment]);

  const getStatus = async () => {
    try {
      // Make an API request to retrieve status appointments
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_status_appointments",
        {
          params: {
            clinicName,
            doctorName,
            todayAppointment: JSON.stringify(todayAppointment), // Convert array to JSON string
            // Include any other query parameters needed
          },
        }
      );

      // Check the response status
      if (response.status === 200) {
        const { data } = response;

        console.log("Response from server fetch_status_appointments:", data);
        setAppointmentStatus(data.statusAppointments);

        // Handle the received data here
      } else {
        // If response status is not 200, handle it here
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching status appointments:", error);
      // Handle any errors here
    }
  };

  // Function to fetch patients based on your criteria
  const fetchPatients = async () => {
    try {
      // Make an API request to retrieve patients
      const response = await axios.get("https://rehab-rythm-ti17.vercel.app/api/patients", {
        params: {
          clinicName, // Make sure clinicName and doctorName are defined before using them here
          doctorName,
        },
      });
      const { data } = response;

      console.log("reeeeeeeeeeeeemmmmmmm", data);
      //setPatients(data);

      if (response.status === 200) {
        // Check if data is available
        if (data && data.length > 0) {
          // Map patientDetails to the required format and update visitingPatients state
          const formattedPatients = data.map((patientDetails) => ({
            pid: patientDetails.pid,
            name: patientDetails.name,
            mobileNo: patientDetails.mobileNo,
            patientType: patientDetails.patientType,
            nextVisitDate: patientDetails.nextVisitDate,
          }));
          setVisitingPatients(formattedPatients);
        } else {
          console.log("No patients found.");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No patients are visiting for the next three days");
        // alert("No patients are visiting for the next three days");
        setShowNoPatientThreeDays(true);
        setTimeout(() => {
          setShowNoPatientThreeDays(false);
        }, 5300);
      } else if (error.response && error.response.status === 500) {
        console.log("Internal server error occurred");
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      } else {
        console.error("Error fetching patients:", error);
        setShowUnexpectedErrorToast(true);
        setTimeout(() => {
          setShowUnexpectedErrorToast(false);
        }, 5300);
      }
    }
  };

  // useEffect(() => {
  //   fetchTodayBill();
  // }, []);

  const fetchTodayBill = async () => {
    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_today_bill",
        {
          params: {
            clinicName,
            doctorName,
          },
          timeout: 8000,
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        const { totalBillForToday } = response.data;
        console.log("Total bill for today:", totalBillForToday);
        setTotalBillForToday(totalBillForToday);
      } else {
        console.log("No Bill");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          console.log("No Bill found for today");
          // Handle scenario when no bills are found for today
        } else if (error.response.status === 500) {
          console.log("Server error:", error.response.status);
          // Handle server error
        }
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error fetching today bill:", error.message);
        // Handle other errors
      }
    }
  };

  useEffect(
    () => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(1, elapsedTime / 500);
        const todayOrdersLimit = 200;
        const ordersInProcessLimit = 170;
        const ordersCompletedLimit = numberOfPatientsVisited;
        const ordersReceivedLimit = 10;

        // Replace the static totalOrdersLimit with todayNoOfAppointments
        setTotalOrders(Math.floor(todayNoOfAppointments * progress));
        setTodayOrders(Math.floor(todayOrdersLimit * progress));
        setOrdersInProcess(Math.floor(ordersInProcessLimit * progress));
        setOrdersCompleted(Math.floor(numberOfPatientsVisited * progress));
        setOrdersReceived(Math.floor(ordersReceivedLimit * progress));

        setNumberOfPatientsVisited(
          Math.floor(numberOfPatientsVisited * progress)
        );
        setTotalBillForToday(Math.floor(totalBillForToday * progress));

        console.log("use total bill", totalBillForToday);
        if (progress >= 1) {
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    },
    [todayNoOfAppointments],
    [numberOfPatientsVisited],
    [totalBillForToday]
  );

  const slidesRef = useRef([]);
  const navButtonsRef = useRef([]);
  const contentsRef = useRef([]);

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // Populate refs with DOM element references
    slidesRef.current = document.querySelectorAll(".img-slide");
    navButtonsRef.current = document.querySelectorAll(".nav-btn");
    contentsRef.current = document.querySelectorAll(".content");
  }, []);

  function nextSlide() {
    // Check if slidesRef and slidesRef.current are defined
    if (!slidesRef || !slidesRef.current) {
      console.error("Error: slidesRef or slidesRef.current is not defined.");
      return;
    }

    const currentSlideIndex = Array.from(slidesRef.current).findIndex((slide) =>
      slide.classList.contains("active")
    );

    // Check if currentSlideIndex is valid
    if (currentSlideIndex === -1) {
      console.error("Error: Could not find current slide.");
      return;
    }

    const nextSlideIndex = (currentSlideIndex + 1) % slidesRef.current.length;

    // Remove 'active' class from all slides and content
    slidesRef.current.forEach((slide) => slide.classList.remove("active"));
    contentsRef.current.forEach((content) =>
      content.classList.remove("active")
    );

    // Add 'active' class to next slide and content
    if (
      slidesRef.current[nextSlideIndex] &&
      contentsRef.current[nextSlideIndex]
    ) {
      slidesRef.current[nextSlideIndex].classList.add("active");
      contentsRef.current[nextSlideIndex].classList.add("active");
    } else {
      console.error("Error: Next slide or content not found.");
      return;
    }
  }

  useEffect(() => {
    const dropdowns = document.querySelectorAll(".dropdown");

    if (dropdowns) {
      dropdowns.forEach((dropdown) => {
        const navLink = dropdown.querySelector(".nav-link");
        const dropdownContent = dropdown.querySelector(".dropdown-content");

        if (navLink && dropdownContent) {
          navLink.addEventListener("click", () => {
            hideAllDropdowns();

            dropdownContent.classList.toggle("active");
          });
        }
      });
    }

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        hideAllDropdowns();
      }
    });

    function hideAllDropdowns() {
      const activeDropdowns = document.querySelectorAll(
        ".dropdown-content.active"
      );
      activeDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }

    return () => {
      document.removeEventListener("click", hideAllDropdowns);
    };
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    setShowConfirmationPrompt(false);
    navigate("/");
  };

  if (error) {
    return <p>Error fetching student data: {error.message}</p>;
  }

  /**
   * Handles the click event for the home button.
   *
   * This function resets various states and displays elements with the class 'body'.
   * It sets isLoading state to true initially, then after a delay, sets isLoading state to false and resets other states.
   *
   * @returns {void}
   */

  /**
  
  Toggles the visibility state of the navigation bar.
  This function toggles the visibility state of the navigation bar by flipping the value of prevShowNavBar.
  @returns {void}
  */

  const handleUpdateRecordClick = () => {
    if (!navigator.onLine) {
      console.log("in upp date reccccccccccccccccc");
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    // Show new record form and hide other elements
    setShowBasicRecord(false);
    setShowUpdateRecord(true);
    setShowExistingRecordForm(false);
    setShowNavBar(false);
    setShowInPatientBill(false);
    setShowOutPatientBill(false);
    setShowPatientDetails(false);
    setShowAppointment(false);

    // Set loading state
    setIsLoading(true);

    // Hide elements with class 'admin-chart-container'

    // Create a message element

    // After 1000 milliseconds, reset states and loading state
    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(false);
      setShowUpdateRecord(true);
      setShowExistingRecordForm(false);
      setShowNavBar(false);
      setIsHomeButtonClicked(false);
      setShowInPatientBill(false);
      setShowOutPatientBill(false);
      setShowPatientDetails(false);
      setShowAppointment(false);
    }, 3000);
  };
  /**
  
  Handles the click event to create a new record.
  
  This function initializes the creation of a new record by setting various states and displaying elements.
  
  It sets isLoading state to true initially, then after a delay, sets isLoading state to false and resets other states.
  
  @returns {void}
  */

  const handleBasicRecordClick = () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    // Show new record form and hide other elements
    setShowBasicRecord(true);
    setShowUpdateRecord(false);
    setShowExistingRecordForm(false);
    setIsHomeButtonClicked(false);
    setShowNavBar(false);
    setShowInPatientBill(false);
    setShowOutPatientBill(false);
    setShowPatientDetails(false);
    setShowAppointment(false);

    // Set loading state
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(true);
      setShowUpdateRecord(false);
      setShowExistingRecordForm(false);
      setShowNavBar(false);
      setIsHomeButtonClicked(false);
      setShowInPatientBill(false);
      setShowOutPatientBill(false);
      setShowPatientDetails(false);
      setShowAppointment(false);
    }, 3000);
  };

  const handleInPatientBillClick = () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setShowBasicRecord(false);
    setShowInPatientBill(true);
    setShowOutPatientBill(false);
    setShowNavBar(false);
    setShowUpdateRecord(false);
    setShowExistingRecordForm(false);
    setShowPatientDetails(false);
    setShowAppointment(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(false);
      setShowUpdateRecord(false);
      setShowExistingRecordForm(false);
      setShowNavBar(false);
      setShowInPatientBill(true);
      setShowOutPatientBill(false);
      setIsHomeButtonClicked(false);
      setShowPatientDetails(false);
      setShowAppointment(false);
    }, 3000);
  };
  const handleOutPatientBillClick = () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setShowBasicRecord(false);
    setShowInPatientBill(false);
    setShowOutPatientBill(true);
    setShowUpdateRecord(false);
    setShowNavBar(false);
    setShowExistingRecordForm(false);
    setShowPatientDetails(false);
    setShowAppointment(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(false);
      setShowUpdateRecord(false);
      setShowExistingRecordForm(false);
      setShowInPatientBill(false);
      setShowNavBar(false);
      setShowOutPatientBill(true);
      setIsHomeButtonClicked(false);
      setShowPatientDetails(false);
      setShowAppointment(false);
    }, 3000);
  };
  const handlePatientDetails = () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setShowBasicRecord(false);
    setShowInPatientBill(false);
    setShowOutPatientBill(false);
    setShowUpdateRecord(false);
    setShowNavBar(false);
    setShowExistingRecordForm(false);
    setShowPatientDetails(true);
    setShowAppointment(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(false);
      setShowUpdateRecord(false);
      setShowExistingRecordForm(false);
      setShowInPatientBill(false);
      setShowNavBar(false);
      setShowOutPatientBill(false);
      setIsHomeButtonClicked(false);
      setShowPatientDetails(true);
      setShowAppointment(false);
    }, 3000);
  };

  const handleAppointment = () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setShowBasicRecord(false);
    setShowInPatientBill(false);
    setShowOutPatientBill(false);
    setShowUpdateRecord(false);
    setShowNavBar(false);
    setShowExistingRecordForm(false);
    setShowPatientDetails(false);
    setShowAppointment(true);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowBasicRecord(false);
      setShowUpdateRecord(false);
      setShowExistingRecordForm(false);
      setShowInPatientBill(false);
      setShowNavBar(false);
      setShowOutPatientBill(false);
      setIsHomeButtonClicked(false);
      setShowPatientDetails(false);
      setShowAppointment(true);
    }, 3000);
  };

  if (deviceType === "mobile") {
    return (
      <div className="mobile-warning-overlay-message">
        <p>
          You are logged in on a mobile device. Please logout from the mobile
          device to access this page on a computer or laptop.
        </p>
      </div>
    );
  }

  const handleGoAdminMenu = () => {
    setLoading(true);
    setTimeout(() => {
      // // Refresh the admin menu
      // window.location.reload();
      // Navigate to the admin menu
      window.location.href = "/AdminMenu";
      setIsLoading(false);
    }, 2000);
  };

  const handleGoBack = () => {
    if (
      showBasicRecord ||
      showUpdateRecord ||
      showInPatientBill ||
      showOutPatientBill ||
      showAppointment ||
      showPatientDetails
    ) {
      setIsLoading(true);
      // setShowBasicRecord(false);
      // setShowInPatientBill(false);
      // setShowOutPatientBill(false);
      // setShowUpdateRecord(false);
      // setIsHomeButtonClicked(true);
      // setShowPatientDetails(false);
      // setShowAppointment(false);

      setTimeout(() => {
        // // Refresh the admin menu
        // window.location.reload();
        // Navigate to the admin menu
        window.location.href = "/AdminMenu";
        setIsLoading(false);
      }, 2000);
    } else {
      navigate("/");
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleRemainder = () => {
    fetchPatients();
    setRemainderOverlay(true);
  };

  const handleViewReminderList = async () => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    setRemainderOverlay(true); // Show the reminder overlay

    try {
      const response = await axios.get(
        "https://rehab-rythm-ti17.vercel.app/api/fetch_reminder_list",
        {
          params: {
            clinicName,
            doctorName,
          },
        }
      );

      if (response.status === 200) {
        // If the request was successful
        const { data } = response;
        const { success, message, successRemindersList, failedRemindersList } =
          data;

        if (success) {
          // If the request was successful
          console.log("Success Reminders:", successRemindersList);
          console.log("Failed Reminders:", failedRemindersList);
          setSuccessReminders(successRemindersList); // Update state with success reminders
          setFailedReminders(failedRemindersList); // Update state with failed reminders
        } else {
          // If the request was not successful, handle the error
          console.error("Error:", message);
          // Handle the error (e.g., show an error message)
        }
      } else {
        // If the request was not successful, handle the error
        console.error("Server error:", response.status);
        // Handle the error (e.g., show an error message)
      }
    } catch (error) {
      // If an error occurs during the request, handle it here
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          if (
            error.response.data.message === "Reminder is not sent for today"
          ) {
            // alert(error.response.data.message); // Show the error message
            setStillRemainderNotSentToast(true);
            setTimeout(() => {
              setStillRemainderNotSentToast(false);
            }, 5300);
          } else if (
            error.response.data.message ===
            "No admin details found for the provided clinic and doctor"
          ) {
            setShowAdminDetailsNotFound(true);
            setTimeout(() => {
              setShowAdminDetailsNotFound(false);
            }, 5300);
          }
        } else if (error.response.status === 500) {
          console.log("Server error:", error.response.status); // Log the server error
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } else {
        console.error("Error fetching reminder list:", error.message); // Log the error message
        setShowUnexpectedErrorToast(true);
        setTimeout(() => {
          setShowUnexpectedErrorToast(false);
        }, 5300);
      }
    }
  };

  const handleCloseReminder = () => {
    setRemainderOverlay(false);
  };

  const handleCloseReminderPercentage = () => {
    setRemainderLoading(false);
  };

  const handleCloseTodayAppointment = () => {
    setSelectiveAppointmentOverlay(false);
  };

  const isValidMobileNumber = (mobileNo) => {
    // Regular expression to match a generic international mobile number
    const regex = /^[0-9]{8,15}$/; // Adjust the range based on your requirements

    // Test if the mobile number matches the regular expression
    return regex.test(mobileNo);
  };

  // useEffect(() => {
  //   if (remainderLoading) {
  //     const source = new EventSource(
  //       "http://localhost3000/api/progress-updates"
  //     );

  //     source.onmessage = (event) => {
  //       const progressPercentage = parseFloat(event.data);
  //       setLoadingProgress(progressPercentage);
  //     };

  //     source.onerror = (error) => {
  //       console.error("Error occurred:", error);
  //       source.close();
  //     };

  //     setEventSource(source);
  //   } else {
  //     // Close the event source when remainderLoading becomes false
  //     if (eventSource) {
  //       eventSource.close();
  //       setEventSource(null);
  //     }
  //   }

  //   // Cleanup function to close event source when component unmounts
  //   return () => {
  //     if (eventSource) {
  //       eventSource.close();
  //       setEventSource(null);
  //     }
  //   };
  // }, [remainderLoading]);

  const handleSendRemainder = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setShowMobileErrorToast(true);
      setTimeout(() => {
        setShowMobileErrorToast(false);
      }, 5300);
    } else {
      // Assuming visitingPatients is an array of patient objects
      const validPatients = visitingPatients.filter((patient) =>
        isValidMobileNumber(patient.mobileNo)
      );

      if (validPatients.length === 0) {
        console.log("No valid mobile numbers found. Aborting operation.");
        return;
      }

      sendRemindersViaBackend(validPatients);
      setRemainderLoading(true);
    }
  };

  const sendRemindersViaBackend = async (validPatients) => {
    try {
      const response = await fetch("https://rehab-rythm-ti17.vercel.app/api/send-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitingPatients: validPatients,
          clinicName: clinicName,
          doctorName: doctorName,
        }),
      });

      // Check if the response status is OK (status code 200)
      if (response.status === 200) {
        // Parse the response body as JSON
        const responseData = await response.json();

        // Access the sent data from the response
        const successReminders = responseData.successReminders;
        const failedReminders = responseData.failedReminders;

        console.log("Reminders sent successfully");
        console.log("Success Reminders:", successReminders);
        console.log("Failed Reminders:", failedReminders);
        setSuccessReminders(successReminders);
        setFailedReminders(failedReminders);
        setRemainderOverlay(true);
      } else {
        // If response status is not OK, throw an error
        throw new Error("Failed to send reminders");
      }
    } catch (error) {
      console.error("Error sending reminders:", error.message);
      setShowUnexpectedErrorToast(true);
      setTimeout(() => {
        setShowUnexpectedErrorToast(false);
      }, 5300);
    }
  };

  const handleNotVisitedClick = async (patient) => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    const { name, pid, mobileNo, date, tokenid } = patient; // Destructure patient object

    try {
      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/addNotVisitedPatient",
        {
          name,
          pid,
          mobileNo,
          date,
          tokenid,
          clinicName,
          doctorName,
        }
      );
      console.log("Server returned status code:", response.status);

      if (response.status === 201) {
        console.log("Patient added to not visited list successfully");
        // alert("The patient has been successfully added to the list of non-attendees.");
        fetchTodayVisited();
        getStatus();
        setShowNotVisitedSuccessToast(true);
        setTimeout(() => {
          setShowNotVisitedSuccessToast(false);
        }, 5300);
      } else {
        throw new Error("Failed to add patient to not visited list");
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log("Patient already visited");
        // alert(`${error.response.data.message}`);
        if (error.response.data.message === "Patient already visited") {
          setShowNotVisitedFail1Toast(true);
          setTimeout(() => {
            setShowNotVisitedFail1Toast(false);
          }, 5300);
        } else if (
          error.response.data.message === "Patient already in not visited"
        ) {
          setShowNotVisitedFail2Toast(true);
          setTimeout(() => {
            setShowNotVisitedFail2Toast(false);
          }, 5300);
        }
      } else if (error.response.status === 404) {
        console.log(
          "No admin details found for the provided clinic and doctor"
        );
        // alert("No admin details found for the provided clinic and doctor");
        setShowAdminDetailsNotFound(true);
        setTimeout(() => {
          setShowAdminDetailsNotFound(false);
        }, 5300);
      } else {
        console.error("Error adding patient to not visited list:", error);
        // alert("Error adding patient to not visited list");
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      }
    }
  };

  const handleVisitedClick = async (patient) => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    const { name, pid, mobileNo, date, tokenid } = patient; // Destructure patient object

    try {
      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/addVisitedPatient",
        {
          name,
          pid,
          mobileNo,
          date,
          tokenid,
          clinicName,
          doctorName,
        }
      );
      console.log("Server returned status code:", response.status);

      if (response.status === 201) {
        console.log("Patient added to waiting list successfully");
        // alert("The patient has been successfully added to the waiting list.");
        fetchTodayVisited();
        getStatus();
        setShowVisitedSuccessToast(true);
        setTimeout(() => {
          setShowVisitedSuccessToast(false);
        }, 5300);
      } else {
        throw new Error("Failed to create record");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // alert("The patient has attended the clinic.");
        setShowVisitedFailToast(true);
        setTimeout(() => {
          setShowVisitedFailToast(false);
        }, 5300);
      } else if (error.response && error.response.status === 404) {
        // alert(
        //   "Error: No admin details found for the provided clinic and doctor"
        // );
        setShowAdminDetailsNotFound(true);
        setTimeout(() => {
          setShowAdminDetailsNotFound(false);
        }, 5300);
      } else {
        console.error("Error creating patient record:", error);
        setShowServerNetworkErrorToast(true);
        setTimeout(() => {
          setShowServerNetworkErrorToast(false);
        }, 5300);
      }
    }
  };

  const handleCompletedClick = async (mobileNo, tokenid) => {
    if (!navigator.onLine) {
      setShowNetworkErrorToast(true);
      setTimeout(() => {
        setShowNetworkErrorToast(false);
      }, 5300);
      return;
    }
    try {
      // Send a POST request to mark patient as completed using mobileNo
      const response = await axios.post(
        "https://rehab-rythm-ti17.vercel.app/api/markCompletedByMobileNo",
        {
          mobileNo,
          tokenid,
          clinicName,
          doctorName,
        }
      );

      if (response.status === 200) {
        // If the request is successful (status code 200), update UI and fetch updated data
        console.log("Patient marked as completed successfully");
        fetchTodayVisited(); // Refresh the list of today's visited patients
        fetchTodayBill();
        handleTotalMonthlyAmount("current");
        handleTotalMonthlyPatient("current");
        fetchInOutCount();
        getStatus();
        setShowCompletedSuccessToast(true);
        setTimeout(() => {
          setShowCompletedSuccessToast(false);
        }, 5300);
        // alert("The patient's visit has been successfully completed.");
      } else {
        // If the response status is not 200, handle it in the catch block
        throw new Error(
          `Failed to mark patient as completed: ${response.statusText}`
        );
      }
      // Handle other response statuses as needed
    } catch (error) {
      // If there's an error in the request or response
      if (error.response) {
        // If there's a response from the server
        if (error.response.status === 404) {
          // If the patient is not found in the waiting list
          // alert("The patient could not be located in the waiting list.");
          setShowCompletedFailToast(true);
          setTimeout(() => {
            setShowCompletedFailToast(false);
          }, 5300);
        } else if (error.response.status === 500) {
          // If there's a server-side error
          // alert("Failed to mark patient as completed");
          setShowServerNetworkErrorToast(true);
          setTimeout(() => {
            setShowServerNetworkErrorToast(false);
          }, 5300);
        }
      } else {
        // If there's an error but no response from the server
        // alert("Error marking patient as completed");
        setShowUnexpectedErrorToast(true);
        setTimeout(() => {
          setShowUnexpectedErrorToast(false);
        }, 5300);
      }
    }
  };

  const toggleMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleToastClose = () => {
    if (showVisitedSuccessToast) {
      setShowVisitedSuccessToast(false);
    } else if (showCompletedSuccessToast) {
      setShowCompletedSuccessToast(false);
    } else if (showNotVisitedSuccessToast) {
      setShowNotVisitedSuccessToast(false);
    } else if (showNetworkErrorToast) {
      setShowNetworkErrorToast(false);
    } else if (showServerNetworkErrorToast) {
      setShowServerNetworkErrorToast(false);
    } else if (showVisitedFailToast) {
      setShowVisitedFailToast(false);
    } else if (showNotVisitedFail1Toast) {
      setShowNotVisitedFail1Toast(false);
    } else if (showNotVisitedFail2Toast) {
      setShowNotVisitedFail2Toast(false);
    } else if (showAdminDetailsNotFound) {
      setShowAdminDetailsNotFound(false);
    } else if (showCalenderFail) {
      setShowCalenderFail(false);
    } else if (showNoAppointment) {
      setShowNoAppointment(false);
    } else if (showNoPatientThreeDays) {
      setShowNoPatientThreeDays(false);
    } else if (stillRemainderNotSentToast) {
      setStillRemainderNotSentToast(false);
    } else if (showUnexpectedErrorToast) {
      setShowUnexpectedErrorToast(false);
    } else if (showMobileErrorToast) {
      setShowMobileErrorToast(false);
    }
  };

  return (
    <div>
      {remainderLoading && (
        <div className="loading-overlay" id="loading-overlay">
          <div className="remainder-progress-heading">
            <h1>Remainder Sending Progress...</h1>
          </div>
          <div className="progress-chart">
            <canvas id="progressChart"></canvas>
          </div>
          <a onClick={handleCloseReminderPercentage}>
            {" "}
            <img src="./uploads/close.png"></img>
          </a>
        </div>
      )}
      {showConfirmationPrompt && (
        <div className="logout-overlay">
          <div className="confirmation-container">
            <p>Are you sure you want to logout?</p>
            <button className="confirm-button" onClick={handleLogout}>
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
      {(showVisitedSuccessToast ||
        showCompletedSuccessToast ||
        showNotVisitedSuccessToast) && (
          <div className="toast toast-active">
            <div className="toast-content">
              <img src={checklist} alt="Success" className="toast-check" />
              <div className="toast-message">
                {showVisitedSuccessToast && (
                  <>
                    <span className="toast-text toast-text-1">Success</span>
                    <span className="toast-text toast-text-2">
                      The patient has been successfully added to the waiting list!
                    </span>
                  </>
                )}
                {showCompletedSuccessToast && (
                  <>
                    <span className="toast-text toast-text-1">Success</span>
                    <span className="toast-text toast-text-2">
                      The patient's visit has been successfully completed!
                    </span>
                  </>
                )}
                {showNotVisitedSuccessToast && (
                  <>
                    <span className="toast-text toast-text-1">Success</span>
                    <span className="toast-text toast-text-2">
                      The patient has been successfully added to the list of
                      non-attendees.
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

      {(showMobileErrorToast ||
        showNetworkErrorToast ||
        showServerNetworkErrorToast ||
        showVisitedFailToast ||
        showCompletedFailToast ||
        showNotVisitedFail1Toast ||
        showNotVisitedFail2Toast ||
        showAdminDetailsNotFound ||
        showCalenderFail ||
        showNoAppointment ||
        showNoPatientThreeDays ||
        stillRemainderNotSentToast ||
        showUnexpectedErrorToast) && (
          <div className="toast toast-active">
            <div className="toast-content">
              <img src={errorimg} alt="Error" className="toast-error-check" />
              <div className="toast-message">
                {showNetworkErrorToast && (
                  <span className="toast-text toast-text-2">
                    Network disconnected. Please check your network!
                  </span>
                )}
                {showMobileErrorToast && (
                  <span className="toast-text toast-text-2">
                    This feature is only available in desktops!
                  </span>
                )}
                {showVisitedFailToast && (
                  <span className="toast-text toast-text-2">
                    The patient has attended the clinic.
                  </span>
                )}
                {showCompletedFailToast && (
                  <span className="toast-text toast-text-2">
                    The patient could not be located in the waiting list.
                  </span>
                )}
                {showNotVisitedFail1Toast && (
                  <span className="toast-text toast-text-2">
                    The patient has already been marked as visited.
                  </span>
                )}
                {showNotVisitedFail2Toast && (
                  <span className="toast-text toast-text-2">
                    The patient is already listed as 'not visited'.
                  </span>
                )}
                {showServerNetworkErrorToast && (
                  <span className="toast-text toast-text-2">
                    Internal Server Error! Try after some time.
                  </span>
                )}
                {showAdminDetailsNotFound && (
                  <span className="toast-text toast-text-2">
                    Admin Details Not found! Try after some time.
                  </span>
                )}
                {showCalenderFail && (
                  <span className="toast-text toast-text-2">
                    There are no appointments available for the selected date.
                  </span>
                )}
                {showNoAppointment && (
                  <span className="toast-text toast-text-2">
                    No appointments are scheduled for today.
                  </span>
                )}
                {showNoPatientThreeDays && (
                  <span className="toast-text toast-text-2">
                    No patients are scheduled to visit for the next three days.
                  </span>
                )}
                {stillRemainderNotSentToast && (
                  <span className="toast-text toast-text-2">
                    Reminder is not sent for today.
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
      <header>
        <div class="menu-left-head">
          <div class="king-tooltip" onClick={handleGoBack}>
            <span className="goback-tooltip-icon">
              <img src="./uploads/left-arrow.png" />
            </span>
            <span class="goback-tooltiptext">Go Back</span>
          </div>
          {/* <img src="./uploads/back-arrow.png" alt="Back" onClick={handleGoBack} className="back-img"/> */}
          <div className="logo-name">
            <img src={logoimg} alt="logo" className="admin-logo" />
            <p>RehabRythm</p>
          </div>
        </div>

        <div class="menu-btn">
          <div class="navigation">
            {/* <div class="navigation-items">
              <div class="dropdown">
                <a href="#" class="nav-link">
                  Action
                </a>
                <div class="dropdown-content">
                  <a href="#" onClick={handleBasicRecordClick}>
                    Create Record
                  </a>
                  <a href="#" onClick={handleUpdateRecordClick}>
                    Update Record
                  </a>
                </div>
              </div>
              <div class="dropdown">
                <a href="#" class="nav-link">
                  Billing
                </a>
                <div class="dropdown-content">
                  <a href="#" onClick={handleInPatientBillClick}>
                    In Patient Billing
                  </a>
                  <a href="#" onClick={handleOutPatientBillClick}>
                    Out Patient Billing
                  </a>
                </div>
              </div>
              <div class="dropdown">
                <a href="#" class="nav-link" onClick={handlePatientDetails}>
                  Records
                </a>
              </div>
              <div class="dropdown">
                <a href="#" class="nav-link" onClick={handleAppointment}>
                  Appointment
                </a>
              </div>
              <div class="dropdown">
                <label
                  className="power-button"
                  onClick={() => setShowConfirmationPrompt(true)}
                >
                  <input
                    type="checkbox"
                    checked={showConfirmationPrompt}
                    readOnly
                  />
                  <div className="checkmark-pwr-btn">
                    <img src={powerButton} alt="Power Button" />
                  </div>
                </label>
              </div>
            </div> */}
            <div class="navigation-items">
              <nav className="nav-menu nav-large">
                <a
                  href="#"
                  onClick={handleGoAdminMenu}
                  className="nav-link"
                  data-target="lp-container"
                >
                  <img
                    src="./uploads/home.png"
                    alt=""
                    className="nav-icons-admin"
                  />
                  Menu
                </a>
                <a
                  href="#"
                  onClick={handleBasicRecordClick}
                  className="nav-link"
                  data-target="lp-container"
                >
                  <img
                    src="./uploads/add.png"
                    alt=""
                    className="nav-icons-admin"
                  />
                  Create Record
                </a>
                <a
                  href="#"
                  onClick={handleUpdateRecordClick}
                  className="nav-link"
                  data-target="home-patient-cards"
                >
                  <img
                    src="./uploads/edit.png"
                    alt=""
                    className="nav-icons-admin"
                  />
                  Update Record
                </a>
                <a
                  href="#"
                  onClick={handlePatientDetails}
                  className="nav-link"
                  data-target="about-us"
                >
                  <img
                    src="./uploads/prescription.png"
                    alt=""
                    className="nav-icons-admin"
                  />
                  Records
                </a>
                <a
                  href="#"
                  onClick={handleAppointment}
                  className="nav-link"
                  data-target="footer"
                >
                  <img
                    src="./uploads/confirmation.png"
                    alt=""
                    className="nav-icons-admin"
                  />
                  Appointment
                </a>
                <div class="dropdown">
                  <div class="profile-hero">
                    {/* <img
                    src="./uploads/dashboard-profile.png"
                    class="profile-image"
                    onClick={toggleMenu}
                    alt="Profile"
                  /> */}
                    <div class="king-tooltip" onClick={toggleMenu}>
                      <span className="profile-tooltip-icon">
                        <img src="./uploads/dashboard-profile.png" />
                      </span>
                      <span class="profile-tooltiptext">Profile</span>
                    </div>
                    <div
                      className={`profile-sub-menu-wrap ${isSubMenuOpen ? "open-profile-menu" : ""
                        }`}
                      id="profileSubMenu"
                    >
                      <div class="profile-sub-menu">
                        <div class="user-profile-info">
                          <img src="./uploads/dashboard-profile.png" />
                          <h2>{doctorName}</h2>
                        </div>
                        <hr />
                        <a href="#" class="profile-sub-menu-link">
                          <img src="./uploads/logout.png" />
                          <p onClick={() => setShowConfirmationPrompt(true)}>
                            Logout
                          </p>
                          <span>{">"}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="small-width-nav">
                <nav className="nav-menu">
                  <a
                    href="#"
                    onClick={handleGoBack}
                    className="nav-link"
                    data-target="lp-container"
                  >
                    <img
                      src="./uploads/home.png"
                      alt=""
                      className="nav-icons-admin"
                    />
                  </a>
                  <a
                    href="#"
                    onClick={handleBasicRecordClick}
                    className="nav-link"
                    data-target="lp-container"
                  >
                    <img
                      src="./uploads/add.png"
                      alt=""
                      className="nav-icons-admin"
                    />
                  </a>
                  <a
                    href="#"
                    onClick={handleUpdateRecordClick}
                    className="nav-link"
                    data-target="home-patient-cards"
                  >
                    <img
                      src="./uploads/edit.png"
                      alt=""
                      className="nav-icons-admin"
                    />
                  </a>
                  <a
                    href="#"
                    onClick={handlePatientDetails}
                    className="nav-link"
                    data-target="about-us"
                  >
                    <img
                      src="./uploads/prescription.png"
                      alt=""
                      className="nav-icons-admin"
                    />
                  </a>
                  <a
                    href="#"
                    onClick={handleAppointment}
                    className="nav-link"
                    data-target="footer"
                  >
                    <img
                      src="./uploads/confirmation.png"
                      alt=""
                      className="nav-icons-admin"
                    />
                  </a>

                  <div class="dropdown">
                    <div class="profile-hero">
                      {/* <img
                    src="./uploads/dashboard-profile.png"
                    class="profile-image"
                    onClick={toggleMenu}
                    alt="Profile"
                  /> */}
                      <div class="king-tooltip" onClick={toggleMenu}>
                        <span className="profile-tooltip-icon">
                          <img src="./uploads/dashboard-profile.png" />
                        </span>
                        <span class="profile-tooltiptext">Profile</span>
                      </div>
                      <div
                        className={`profile-sub-menu-wrap ${isSubMenuOpen ? "open-profile-menu" : ""
                          }`}
                        id="profileSubMenu"
                      >
                        <div class="profile-sub-menu">
                          <div class="user-profile-info">
                            <img src="./uploads/dashboard-profile.png" />
                            <h2>{doctorName}</h2>
                          </div>
                          <hr />
                          <a href="#" class="profile-sub-menu-link">
                            <img src="./uploads/logout.png" />
                            <p onClick={() => setShowConfirmationPrompt(true)}>
                              Logout
                            </p>
                            <span>{">"}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
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
        {showUpdateRecord ? (
          <UpdateRecord />
        ) : showBasicRecord ? (
          <BasicRecord />
        ) : showInPatientBill ? (
          <InPatientBill />
        ) : showAppointment ? (
          <Appointment />
        ) : showOutPatientBill ? (
          <OutPatientBill />
        ) : showPatientDetails ? (
          <PatientDetails />
        ) : (
          isHomeButtonClicked && (
            <div
              className={`admin-container ${isNavOpen ? "left-nav-open" : ""} ${overlayOpen ? "overlay-open" : ""
                }`}
            >
              <div className={`left-nav ${isNavOpen ? "open" : "closed"}`}>
                <div className="toggle-btn-container">
                  <button
                    className={`toggle-btn ${overlayOpen ? "disabled" : ""}`}
                    onClick={toggleNav}
                    disabled={overlayOpen}
                  >
                    <span>Queue</span>
                  </button>
                </div>
                <div className="logo">QUEUE</div>
                <ul>
                  {todayVisited.map((order) => (
                    <li
                      key={order.id}
                      className={selectedOrderId === order.pid ? "active" : ""}
                    >
                      {order.tokenid} {order.name}
                    </li>
                  ))}
                </ul>
                {/* <ul>
                  {sortedTodayVisited.map((order) => (
                    <li key={order.id} className={selectedOrderId === order.pid ? "active" : ""}>
                      {order.pid} {order.name} - {order.date} - {new Date(order.date).toLocaleTimeString()}
                    </li>
                  ))}

                </ul> */}
                <ul></ul>
              </div>

              <div
                className={`main-content ${isNavOpen ? "left-nav-open" : ""}`}
              >
                <div className="dashboard-left-container">
                  <div className="dashboard-container1"></div>
                  <div className="dashboard-heading">
                    <h1>Analytics Overview</h1>
                  </div>
                  <div className="dashboard-container2">
                    <div className="dashboard-overview-container">
                      <div className="total-patients-count1">
                        <p className="top-small-container-heading">
                          Total Patients{" "}
                          <span>
                            {percentagePatient}
                            {"%"}
                          </span>
                        </p>
                      </div>
                      <div className="top-small-container-inside-buttons">
                        <span
                          onClick={() => handleTotalMonthlyPatient("previous")}
                        >
                          <img src="./uploads/dashboard-previous.png" />
                        </span>
                        <h1 className="total-patients-count2">
                          {totalPatientForMonth}+
                          <span className="total-patients-count2-span">
                            {patientCurrentMonth}
                          </span>
                        </h1>
                        {selectedMonthPatient.getMonth() !==
                          currentMonthPatient && (
                            <span
                              onClick={() => handleTotalMonthlyPatient("next")}
                            >
                              <img src="./uploads/dashboard-next.png" />
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="dashboard-overview-container">
                      <div className="total-patients-count1">
                        <p className="top-small-container-heading">
                          Patients Category
                        </p>
                      </div>
                      <div className="top-small-container-inside-buttons">
                        <h1 className="total-patients-count3">
                          IP: {inPatientCount}
                          {" / "} OP: {outPatientCount}
                          {/* <span className="total-patients-count2-span">
                            
                          </span> */}
                          <br />
                          <span className="total-patients-count2-span">
                            {inoutpatientCurrentMonth}
                          </span>
                        </h1>
                      </div>
                    </div>
                    <div className="dashboard-overview-container">
                      <div className="total-patients-count1">
                        <p className="top-small-container-heading">
                          Total Amount{" "}
                          <span>
                            {percentageAmount}
                            {"%"}
                          </span>
                        </p>
                      </div>
                      <div className="top-small-container-inside-buttons">
                        <span
                          onClick={() => handleTotalMonthlyAmount("previous")}
                        >
                          <img src="./uploads/dashboard-previous.png" />
                        </span>
                        <h1 className="total-patients-count2">
                          {totalBillForMonth}+
                          <span className="total-patients-count2-span">
                            {amountCurrentMonth}
                          </span>
                        </h1>
                        {selectedMonthAmount.getMonth() !==
                          currentMonthAmount && (
                            <span
                              onClick={() => handleTotalMonthlyAmount("next")}
                            >
                              <img src="./uploads/dashboard-next.png" />
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="dashboard-overview-container">
                      <div className="total-patients-count1">
                        <p className="top-small-container-heading">
                          Today Amount{" "}
                        </p>
                      </div>
                      <div className="top-small-container-inside-buttons">
                        <h1 className="total-patients-count2">
                          {totalBillForToday}
                          {"+"}
                          <span className="total-patients-count2-span">
                            (Today)
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-container34">
                    <div className="dashboard-container3">
                      <div className="dashboard-table-container">
                        <div className="search-heading">
                          <div className="dashboard-inner-heading">
                            <h1>tODAY AppointmentS</h1>
                          </div>
                          <div className="dashboard-search">
                            <input
                              type="text"
                              placeholder="search by name"
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                            <img
                              className="search-icon-filter-db"
                              src={searchicon}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="dashboard-table-inner-container">
                          <table className="dashboard-appointment-table">
                            <thead className="dashboard-head">
                              <tr className="dashboard-appointment-header">
                                <th className="dashboard-appointment-th">
                                  Token
                                </th>
                                <th className="dashboard-appointment-th">
                                  PID
                                </th>
                                <th className="dashboard-appointment-th">
                                  Name
                                </th>
                                <th className="dashboard-appointment-th">
                                  Mobile
                                </th>
                                <th className="dashboard-appointment-th">
                                  Progress
                                </th>
                                <th className="dashboard-appointment-th">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="dashboard-appointment-body">
                              {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((patient, index) => {
                                  // Find the corresponding status from the appointmentStatus array
                                  const statusObject = appointmentStatus.find(
                                    (status) =>
                                      status.tokenid === patient.tokenid &&
                                      status.mobileNo === patient.mobileNo
                                  );
                                  const status = statusObject
                                    ? statusObject.status
                                    : "";

                                  return (
                                    <tr key={index}>
                                      <td className="dashboard-appointment-td">
                                        {patient.tokenid}
                                      </td>
                                      <td className="dashboard-appointment-td">
                                        {patient.pid
                                          ? patient.pid
                                          : "New"}
                                      </td>
                                      <td className="dashboard-appointment-td">
                                        {patient.name}
                                      </td>
                                      <td className="dashboard-appointment-td">
                                        {patient.mobileNo}
                                      </td>
                                      <td className="dashboard-appointment-td-progress">
                                        <button
                                          className="king-tooltip btn-not-visited"
                                          onClick={() => {
                                            handleNotVisitedClick(patient);
                                            getStatus();
                                          }}
                                        >
                                          <span class="not-visited-tooltiptext">
                                            Not Visited
                                          </span>
                                        </button>

                                        <button
                                          className="king-tooltip btn-visited"
                                          onClick={() => {
                                            handleVisitedClick(patient);
                                            getStatus();
                                          }}
                                        >
                                          <span class="visited-tooltiptext">
                                            Visited
                                          </span>
                                        </button>

                                        <button
                                          className="king-tooltip btn-completed"
                                          onClick={() => {
                                            handleCompletedClick(
                                              patient.mobileNo,
                                              patient.tokenid
                                            );
                                            getStatus();
                                          }}
                                        >
                                          <span class="completed-tooltiptext">
                                            Completed
                                          </span>
                                        </button>
                                      </td>
                                      {statusFetched && (
                                        <td className="dashboard-appointment-td">
                                          <span
                                            className={`status-db-${status}`}
                                          >
                                            {status}
                                          </span>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="5">Patient not found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div
                        className="dashboard-linechart-container"
                        id="dashboard-linechart-container"
                      >
                        <div className="dashboard-inner-heading">
                          <h1>pATIENTS VISIT THIS MONTH</h1>
                        </div>
                        <div className="line-chart">
                          <canvas id="lineChart"></canvas>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-container4">
                      <div
                        className="dashboard-donutchar-container"
                        id="dashboard-donutchar-container"
                      >
                        <div className="dashboard-inner-heading">
                          <h1>TODAY PATIENT VISITS</h1>
                        </div>
                        <div className="donut-chart">
                          <canvas id="donutChart"></canvas>
                        </div>
                      </div>
                      <div className="dashboard-calender-container">
                        <div className="left-calender">
                          <p className="calendar-inside-date">
                            {new Date().toLocaleDateString("en-US", {
                              day: "numeric",
                            })}
                          </p>
                          <p className="calendar-inside-day">
                            {new Date().toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </p>
                        </div>
                        <div className="calendar-container">
                          <Calendar
                            className="custom-calendar"
                            onChange={handleDateChange}
                            value={selectedDate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-right-container">
                  <div className="remainder-overlay">
                    <div className="remainder-search">
                      <div className="remainder-title">Reminder</div>
                      <div className="wrap-input">
                        <input
                          type="text"
                          placeholder="Search by name"
                          value={searchRemainderTerm}
                          onChange={handleRemainderSearchChange}
                        />
                        <img
                          className="search-icon-filter-remainder"
                          src={searchicon}
                          alt=""
                        />
                      </div>
                      {/* <button
                        onClick={handleSendRemainder}
                        className="remainer-btn"
                      >
                        <img
                          src={remainericon}
                          alt=""
                          className="remainer-image"
                        />
                      </button> */}
                      <div class="king-tooltip" onClick={handleSendRemainder}>
                        <span className="remainder-tooltip-icon">
                          <img src={remainericon} />
                        </span>
                        <span class="add-bill-tooltiptext">Remainder</span>
                      </div>
                      <div class="king-tooltip">
                        <button
                          onClick={handleViewReminderList}
                          className="remainer-btn"
                        >
                          <img src="./uploads/update-icon.png" />
                        </button>
                        <span class="print-tooltiptext">View Sent List</span>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>PID</th>
                          <th>Name</th>
                          <th>Mobile No</th>
                          <th>Patient type</th>
                          <th>Next Visit Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((vp) => (
                          <tr key={vp.pid}>
                            <td>{vp.pid}</td>
                            <td>{vp.name}</td>
                            <td>{vp.mobileNo}</td>
                            <td
                              style={{
                                color:
                                  vp.patientType === "outpatient"
                                    ? "green"
                                    : "orange",
                              }}
                            >
                              {vp.patientType}
                            </td>
                            {console.log(vp.patientType, "mmmmmmmmmmmmmmmmmmm")}
                            <td>{vp.nextVisitDate}</td>
                          </tr>
                        ))}
                        {filteredPatients.length === 0 && (
                          <tr>
                            <td colSpan="5">No matching patients found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="dashboard-image">
                    <img src="./uploads/DASHBOARD-IMAGE.png"></img>
                  </div>
                </div>
                {/* <div className="stall-name">
                  <img src="./uploads/profile.png" alt="" className="stall-profile-img" />
                  <span>{doctorName}</span>
                </div>

                <div className="order-data-stats-1">
                  <div className="total-order">
                    <div className="total-order-text"> Total  Appointment</div>
                    <div className="sap">
                      <div className="total-order-img">&#9729;</div>

                      <div className="total-order-count">{totalOrders}</div>

                    </div>

                  </div>

                  <div className="order-completed">
                    <div className="order-completed-text"> Patient Visited </div>
                    <div className="sap">
                      <div className="order-completed-img">&#9729;</div>

                      <div className="order-completed-count">{numberOfPatientsVisited}/{totalOrders}</div>

                    </div>

                  </div>
                  <div className="order-completed">
                    <div className="order-completed-text"> Total Amounts</div>

                    <div className="sap">

                      <div className="order-completed-img">&#9729;</div>
                      <div className="order-completed-count">{totalBillForToday}+</div>

                    </div>

                  </div>

                  <div className="order-completed">
                    <div className="order-completed-text" > Patient visited on particular day</div>

                    <div className="sap">
                      <button onClick={handlePatientVisitOnParticularDay}>Patient visited </button>

                      <div className="order-completed-img">&#9729;</div>
                      <div className="order-completed-count">{totalBillForToday}+</div>

                    </div>

                  </div>

                  <div className="order-completed">
                    <div className="order-completed-text" >total monthly amounts</div>

                    <div className="sap">
                      <button onClick={handleTotalMonthlyAmount}>total monthly amounts</button>

                      <div className="order-completed-img">&#9729;</div>
                      <div className="order-completed-count">{totalBillForToday}+</div>

                    </div>

                  </div>

                  <div className="order-completed">
                    <div className="order-completed-text" onClick={handleRemainder}> Remainder </div>

                    <div className="sap">

                      <div className="order-completed-img">&#9729;</div>
                      <div className="order-completed-count">{ordersCompleted}+</div>

                    </div>

                  </div>
                  <div className="calendar-container">
                    <Calendar className='custom-calendar' />
                  </div>


                </div> */}

                {/* <div className="table-container">
                  <table className="dashboard-appointment-table">
                    <thead className="dashboard-head">
                      <tr className="dashboard-appointment-header">
                        <th className="dashboard-appointment-th">Patient ID</th>
                        <th className="dashboard-appointment-th">Name</th>
                        <th className="dashboard-appointment-th">Mobile Number</th>
                        <th className="dashboard-appointment-th">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="dashboard-appointment-body">

                      <tr>
                        <td className="dashboard-appointment-td">1</td>
                        <td className="dashboard-appointment-td">John Doe</td>
                        <td className="dashboard-appointment-td">123-456-7890</td>
                        <td className="dashboard-appointment-td">50%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>
                      <tr>
                        <td className="dashboard-appointment-td">2</td>
                        <td className="dashboard-appointment-td">Jane Smith</td>
                        <td className="dashboard-appointment-td">987-654-3210</td>
                        <td className="dashboard-appointment-td">75%</td>
                      </tr>

                    </tbody>
                  </table>
                </div> */}

                {/* <div className="table-container">
                  <table className="dashboard-appointment-table">
                    <thead className="dashboard-head">
                      <tr className="dashboard-appointment-header">
                        <th className="dashboard-appointment-th">Patient ID</th>
                        <th className="dashboard-appointment-th">Token Number</th>
                        <th className="dashboard-appointment-th">Name</th>
                        <th className="dashboard-appointment-th">Mobile Number</th>
                        <th className="dashboard-appointment-th">Date</th>
                        <th className="dashboard-appointment-th">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="dashboard-appointment-body">
                      {todayAppointment.map((patient, index) => (
                        <tr key={index}>
                          <td className="dashboard-appointment-td">{patient.pid ? patient.pid : "New Patient"}</td>
                          <td className="dashboard-appointment-td">{patient.tokenid}</td>
                          <td className="dashboard-appointment-td">{patient.name}</td>
                          <td className="dashboard-appointment-td">{patient.mobileNo}</td>
                          <td className="dashboard-appointment-td">{new Date(patient.date).toLocaleTimeString()}</td>
                          <td>
                            <button onClick={() => handleNotVisitedClick(patient)}>Not Visited</button>
                            <button onClick={() => handleVisitedClick(patient)}>Visited</button>
                            <button onClick={() => handleCompletedClick(patient.mobileNo)}>Completed</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div> */}
              </div>
            </div>
          )
        )}
      </main>

      {remainderOverlay && (
        <div className="remainder-root">

          <div className="remainder-overlay">
            <a onClick={handleCloseReminder}>
              {" "}
              <img src="./uploads/close.png"></img>
            </a>
            <div className="remainder-overlay-left-container">
              <img src="./uploads/3053910-png.png"></img>
            </div>
            <div className="remainder-overlay-right-container">
              <h1 className="remainder-overlay-title">REMINDER REPORT</h1>

              <div className="table-container">
                <p>Message sent successfully for the following patients</p>
                <table>
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Name</th>
                      <th>Mobile No</th>
                      <th>Patient type</th>
                      <th>Next Visit Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successReminders.map((success) => (
                      <tr key={success.pid}>
                        <td>{success.pid}</td>
                        <td>{success.name}</td>
                        <td>{success.mobileNo}</td>
                        <td>{success.patientType}</td>
                        <td>{success.nextVisitDate.split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-container">
                <p>Failed to send reminder for the following patients</p>
                <table>
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Name</th>
                      <th>Mobile No</th>
                      <th>Patient type</th>
                      <th>Next Visit Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedReminders.map((failed) => (
                      <tr key={failed.pid}>
                        <td>{failed.pid}</td>
                        <td>{failed.name}</td>
                        <td>{failed.mobileNo}</td>
                        <td>{failed.patientType}</td>
                        <td>{failed.nextVisitDate.split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectiveAppointmentOverlay && (
        <div className="appointment-overlay">
          <a onClick={handleCloseTodayAppointment}>
            <img src="./uploads/close.png"></img>
          </a>
          <div className="appointment-overlay-inner-container">
            <div className="appointment-overlay-inner-right-container">
              <img src="./uploads/3552395-png.png"></img>
            </div>
            <div>
              <h1 className="appointments-title">APPOINTMENTS</h1>
              <div className="appointment-overlay-inner-left-container">
                <table className="appointment-overlay-table">
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Token ID</th>
                      <th>Name</th>
                      <th>Mobile No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectiveAppointment.map((vp) => (
                      <tr key={vp.pid}>
                        <td>{vp.pid}</td>
                        <td>{vp.tokenid}</td>
                        <td>{vp.name}</td>
                        <td>{vp.mobileNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminMenu;
