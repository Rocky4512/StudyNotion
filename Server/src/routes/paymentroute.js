import { Router } from "express";
const router = Router();

import {
    capturePayment,
    verifySignature,
    sendPaymentSuccessEmail,
} from "../controller/paymentscontroller.js";

import {
    auth,
    isInstructor,
    isStudent,
    isAdmin,
} from "../middleware/authmiddleware.js";

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
router.post(
    "/sendPaymentSuccessEmail",
    auth,
    isStudent,
    sendPaymentSuccessEmail,
);

export default router;