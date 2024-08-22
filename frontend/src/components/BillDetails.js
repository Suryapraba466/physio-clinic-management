import React from 'react';

const BillDetails = ({ record }) => {
    const outPatientBillings = record?.outPatientBillings || [];
    const inPatientBillings = record?.inPatientBillings || [];

    return (
        <div className="bill-details-container">
            <div className="out-patient-bill">
                <h3>Out-Patient Bill Details</h3>
                {outPatientBillings.map((bill, index) => (
                    <div key={index} className='bill-card'>
                        <p>Appointment Date: {bill?.appointmentDate ? new Date(bill.appointmentDate).toLocaleDateString('en-GB') : '-'}</p>
                        <p>Service Name: {bill?.serviceName || '-'}</p>
                        <p>Payment Mode: {bill?.paymentMode || '-'}</p>
                        <p>Bill Amount: {bill?.billAmount || '-'}</p>
                    </div>
                ))}
            </div>

            <div className="in-patient-bill">
                <h3>In-Patient Bill Details</h3>
                {inPatientBillings.map((bill, index) => (
                    <div key={index} className='bill-card'>
                        <p>Room Number: {bill?.roomNumber || '-'}</p>
                        <p>Admission Date: {bill?.admissionDate? new Date(bill.admissionDate).toLocaleDateString('en-GB') : '-'}</p>
                        <p>Discharge Date: {bill?.dischargeDate? new Date(bill.dischargeDate).toLocaleDateString('en-GB') : '-'}</p>
                        <p>Total Days: {bill?.totalDays || '-'}</p>
                        <p>Amount Per Day: {bill?.amountPerDay || '-'}</p>
                        <p>Payment Mode: {bill?.paymentMode || '-'}</p>
                        <p>Bill Amount: {bill?.billAmount || '-'}</p>
                        <p>Date Of Bill: {bill?.dateOfBill ? new Date(bill.dateOfBill).toLocaleDateString('en-GB') : '-'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillDetails;
