"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropRepository = void 0;
const crop_model_1 = require("./crop.model");
exports.CropRepository = {
    async create(listing) {
        const doc = await crop_model_1.CropListingModel.create(listing);
        return doc;
    },
    async findById(id) {
        return crop_model_1.CropListingModel.findById(id).exec();
    },
};
