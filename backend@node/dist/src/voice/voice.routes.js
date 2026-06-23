"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voice_controller_1 = require("./voice.controller");
const router = (0, express_1.Router)();
router.post('/query', voice_controller_1.VoiceController.query);
exports.default = router;
