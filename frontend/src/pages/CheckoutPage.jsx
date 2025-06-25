import React from 'react'
import { purchaseTicket,validatePurchase } from '../api/api'

function CheckoutPage() {

  const handlepayment = async (amount,currency,receiptId) =>{
    const payload = {
      amount,
      currency,
      receipt: receiptId
    }
    const order = await purchaseTicket(payload)
    console.log(order)

    var options = {
      key: "rzp_test_ghTeekIY3ZvfG3", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "ticket swap", //your business name
      description: "Test Transaction",
      // image: "http://localhost:/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await validatePurchase(body)
        // const jsonRes = await validateRes.json();
        console.log(validateRes);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Web Dev Matrix", //your customer's name
        email: "webdevmatrix@example.com",
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      timrout: 600
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      // alert(response.error.code);
      alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  }


  return (
    <>
      <div>CheckoutPage</div>
      <button onClick={() => handlepayment()}>Pay</button>
    </>
    
  )
}

export default CheckoutPage