// SellPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { List } from "antd";

const SellPage = () => {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8000/extract-ticket-info", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log('response',response.data)
            console.log('response data data',response.data.data)
           
            setJsonData(response.data.data);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to extract data from PDF");
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Extract Data</button>
            {jsonData && 
            <>
                <p><strong>From:</strong> {jsonData.BookingDetails.From}</p>
                <p><strong>To:</strong> {jsonData.BookingDetails.To}</p>
                <p><strong>Bus Operator:</strong> {jsonData.BookingDetails.BusOperator}</p>
                <p><strong>Ticket Number:</strong> {jsonData.BookingDetails.TicketNumber}</p>
                <p><strong>Bus Type:</strong> {jsonData.BookingDetails.BusType}</p>
                <p><strong>Boarding Date and Time:</strong> {jsonData.BookingDetails.BoardingDateAndTime}</p>
                <p><strong>Total Fare:</strong> {jsonData.BookingDetails.TotalFare}</p>
            </>
            
            }
        </div>
    );
};

export default SellPage;
