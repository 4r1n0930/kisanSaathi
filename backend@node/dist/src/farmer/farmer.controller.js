"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerController = void 0;
class FarmerController {
    static async getProfile(req, res) {
        if (req.user?.role !== 'FARMER') {
            return res.status(403).json({ message: 'Access denied for this role' });
        }
        return res.json({ user: req.user });
    }
}
exports.FarmerController = FarmerController;
