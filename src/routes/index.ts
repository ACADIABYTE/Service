import { Router } from "express";
import AuthRoute from "./authentication";

const router = Router()

router.use("/auth", AuthRoute)

export default router