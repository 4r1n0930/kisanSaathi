"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = require("./src/config/database.config");
const auth_routes_1 = __importDefault(require("./src/auth/auth.routes"));
const farmer_routes_1 = __importDefault(require("./src/farmer/farmer.routes"));
const trader_routes_1 = __importDefault(require("./src/trader/trader.routes"));
const inspector_routes_1 = __importDefault(require("./src/inspector/inspector.routes"));
const upload_controller_1 = __importDefault(require("./src/media/upload.controller"));
const voice_routes_1 = __importDefault(require("./src/voice/voice.routes"));
const crop_controller_1 = __importDefault(require("./src/crops/crop.controller"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use('/auth', auth_routes_1.default);
app.use('/media', upload_controller_1.default);
app.use('/farmers', farmer_routes_1.default);
app.use('/traders', trader_routes_1.default);
app.use('/inspectors', inspector_routes_1.default);
app.use('/voice', voice_routes_1.default);
app.use('/crops', crop_controller_1.default);
app.get('/', (_req, res) => res.json({ status: 'OK', message: 'KisanSaathi backend is running' }));
app.use((err, _req, res, _next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
});
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
(0, database_config_1.connectDatabase)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});
