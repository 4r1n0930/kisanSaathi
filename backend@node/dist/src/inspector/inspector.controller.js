"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorController = void 0;
class InspectorController {
    static async getProfile(req, res) {
        if (req.user?.role !== 'INSPECTOR') {
            return res.status(403).json({ message: 'Access denied for this role' });
        }
        return res.json({ user: req.user });
    }
}
exports.InspectorController = InspectorController;
