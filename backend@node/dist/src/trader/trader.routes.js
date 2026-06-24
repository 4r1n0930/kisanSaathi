"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trader_controller_1 = require("./trader.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authMiddleware, trader_controller_1.TraderController.getProfile);
exports.default = router;
