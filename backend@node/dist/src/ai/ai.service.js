"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeAiService = void 0;
const ai_client_1 = require("./ai.client");
class NodeAiService {
    static async analyzeCrop(crop, images, location) {
        // Forward to Python AI microservice
        const data = await (0, ai_client_1.analyzeCropWithPython)(crop, images, location);
        return data;
    }
}
exports.NodeAiService = NodeAiService;
