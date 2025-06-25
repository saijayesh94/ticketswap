import { z } from "zod";

const registerInputValidator = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: "Not a valid email address" })
    .trim(),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .length(10, { message: "Phone number must be exactly 10 digits" }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

const loginInputValidator = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: "Not a valid email address" })
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

const forgetPasswordInputValidator = z.object({
  email: z
    .string({ required_error: 'Email is required if no phone number is provided' })
    .email({ message: "Not a valid email address" })
    .trim()
    .optional(),
  phone: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone number is required",
  path: ["email", "phone"],
});

const fetchAllTicketInputValidator = z.object({
  departure: z
    .string({ required_error: 'Departure location is required' })
    .trim(),
  arrival: z
    .string({ required_error: 'Arrival location is required' })
    .trim(),
  date: z
    .string({ required_error: 'Time is required' }),
});

const uploadTicketInputValidator = z.object({
  user_id: z.string(),
  bus_company: z
    .string({ required_error: 'Bus company name is required' })
    .trim(),
  departure: z
    .string({ required_error: 'Departure location is required' })
    .trim(),
  arrival: z
    .string({ required_error: 'Arrival location is required' })
    .trim(),
  mustbe: z
    .enum(['mail', 'femail'], { required_error: 'Gender selection is required' })
    .optional(),
  date: z
    .string({ required_error: 'Time is required' }),
  // .date({ required_error: 'Date is required' }),
  time: z
    .string({ required_error: 'Time is required' }),
  // .regex(/^\d{2}:\d{2}$/, { message: "Time must be in HH:MM format" }),
  // .date({ required_error: 'Date is required' }),
  seat_number: z
    .string({ required_error: 'Seat number is required' }),
  price: z
    .number({ required_error: 'Price is required' })
    .positive({ message: "Price must be a positive number" }),
  ticketurl: z
    .string({ required_error: 'Ticket URL is required' })
    .url({ message: "Must be a valid URL" }),
});


const purchaseTicketInputValidator = z.object({
  // some confusion
  amount: z
    .number({ required_error: "amount must be selected" }),
  currency: z
    .string({ required_error: "currency must be selected" }),
  receipt: z
    .string({ message: "receipt Id must be" })
})

const validatePurchaseTicketInputValidator = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string()
})


export {
  registerInputValidator,
  loginInputValidator,
  // logoutInputValidator,
  forgetPasswordInputValidator,
  fetchAllTicketInputValidator,
  uploadTicketInputValidator,
  purchaseTicketInputValidator,
  validatePurchaseTicketInputValidator
} 
