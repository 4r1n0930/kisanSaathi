"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inspector_controller_1 = require("./inspector.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authMiddleware, inspector_controller_1.InspectorController.getProfile);
exports.default = router;
