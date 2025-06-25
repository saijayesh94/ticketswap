# app.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Google Generative AI API key (make sure this is securely managed)
api_key = os.getenv("API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash-latest")

@app.post("/extract-ticket-info")
async def extract_ticket_info(file: UploadFile = File(...)):
    # Load PDF content
    pdf_reader = PdfReader(file.file)
    all_text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        all_text += page.extract_text() or ""
    
    # Define prompt
    prompt = '''give me json data from given data. here is the example json format:
    {
        "BookingDetails": {
            "From": "Sindhanur(karnataka)",
            "To": "Hyderabad",
            "BusOperator": "Go Tour Travels and Holidays",
            "TicketNumber": "GT823878",
            "OperatorPNR": "C9VEVJ99",
            "BusType": "A/c-sleeper",
            "BusID": "NU712071099644136",
            "BoardingDateAndTime": "10-Nov-2024 23:20",
            "Passengers": 1,
            "TotalFare": 1600.0
        },
        "PassengerDetails": [
            {
                "SNo": 1,
                "Name": "Ms. Medam Tejaswini",
                "Seat": "A1",
                "SeatType": "Sleeper"
            }
        ],
        "BoardingDropDetails": {
            "BoardingPoint": "P W D Camp (lakshmi Camp)",
            "BoardingPointAddress": "Anand Hegde Petrol Pump, Maski X Roads, Raichur Koppal Road",
            "BoardingPointLandmark": "Na",
            "DropPoint": "Panjagutta",
            "DropPointAddress": "Near Red Rose Restaurant, Metro Pillar No A1127 (No Dinner Break)",
            "DropPointLocation": "Https://Zip.Pr/In/Goto0304",
            "BusOperatorContactNumber": "9900002887, 9483071166, 9483071133"
        },
        "CancellationRules": {
            "CancellationTime": [
                {
                    "Time": "Till on 09 Nov 11:15 PM",
                    "Charges": "Rs. 224.85"
                },
                {
                    "Time": "Between on 09 Nov - on 10 Nov 11:15 AM",
                    "Charges": "Rs. 1124.25"
                },
                {
                    "Time": "Between on 10 Nov - on 10 Nov 11:15 AM",
                    "Charges": "Rs. 1499.0"
                }
            ],
            "Notes": [
                "Above penalty is calculated basis the bus scheduled start time from the first boarding point (starting point of the bus)",
                "The ticket cannot be cancelled after the bus departs from the first boarding point (starting point of the bus)",
                "Cancellation charges shown above may sometimes vary depending on the non-refundable components of the ticket fare defined by the bus operator"
            ],
            "CancellationProcess": [
                "Please go to section of makemytrip.com (Top right corner on website) and proceed to cancel your ticket.",
                "You will be asked to enter booking Id and Contact number.",
                "If you are unable to cancel, Please call us at 0124-462-8765 (Standard Charges Apply) to cancel your e-ticket.",
                "MakeMyTrip would not be able to process refunds for cancellations done directly with the bus operators."
            ],
            "CancellationType": "Partially cancellable"
        }
    }
    Other than this json data no extra text should be generated.
    here is the data from ticket:
    ''' + all_text

    # Generate JSON response
    response = model.generate_content(prompt)
    data_response = response.text
    json_string = data_response.strip("```json\n").rstrip("\n```")
    parsed_data = json.loads(json_string)
    return {"data": parsed_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
