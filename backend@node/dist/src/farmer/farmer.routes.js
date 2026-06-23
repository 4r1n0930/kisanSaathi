"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmer_controller_1 = require("./farmer.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authMiddleware, farmer_controller_1.FarmerController.getProfile);
exports.default = router;
