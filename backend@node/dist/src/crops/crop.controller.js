"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crop_service_1 = require("./crop.service");
const router = (0, express_1.Router)();
router.post('/create', async (req, res, next) => {
    try {
        const { farmerId, cropName, quantity, images, location, expectedPrice } = req.body;
        if (!farmerId || !cropName || !quantity || !images || images.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const listing = await crop_service_1.CropService.createListing({ farmerId, cropName, quantity, images, location, expectedPrice });
        return res.status(201).json(listing);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
