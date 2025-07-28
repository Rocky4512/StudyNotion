import { Router } from "express";
import { contactUsResponse } from "../controller/contactUscontroller.js";

const router = Router();
router.post("/contact", contactUsResponse);
export default router;