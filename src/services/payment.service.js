import api from "./api";

const processPayment = (bookingId, amount) => api.post("/payments", { bookingId, amount });

const PaymentService = {
    processPayment,
};

export default PaymentService;
