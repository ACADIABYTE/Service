const { Router } = require("express")
const AuthRoute = require("./authentication")

const router = Router()

router.use("/auth", AuthRoute)

module.exports = router