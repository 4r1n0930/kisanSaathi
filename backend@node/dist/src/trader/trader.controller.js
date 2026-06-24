"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderController = void 0;
class TraderController {
    static async getProfile(req, res) {
        if (req.user?.role !== 'TRADER') {
            return res.status(403).json({ message: 'Access denied for this role' });
        }
        return res.json({ user: req.user });
    }
}
exports.TraderController = TraderController;
