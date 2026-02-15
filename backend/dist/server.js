"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({

    origin: ['http://localhost:5173', 'http://192.168.0.103', 'http://dotflag.net'], 
    credentials: true,
}));

app.set('trust proxy', 1);

app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // If it's true and you are on http://, the session will fail.
        secure: false, 
        httpOnly: true,
        sameSite: 'lax', // Better for cross-origin if needed
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use('/api/auth', auth_1.default);
app.get('/api/admin-dashboard', (0, authMiddleware_1.hasRole)('Admin'), (req, res) => {
    res.json({ message: `Welcome to the admin area, ${req.session.role}!` });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
