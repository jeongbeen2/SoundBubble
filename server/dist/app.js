"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/./../.env" });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const connectDB_1 = require("./connectDB");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const bubbleRouter_1 = __importDefault(require("./routes/bubbleRouter"));
// Connect DB
connectDB_1.connectDB();
const app = express_1.default();
const PORT = process.env.SERVER_PORT || 80;
// Setting morgan date
const today = new Date();
const dateFormat = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();
morgan_1.default.token("date", () => {
    return dateFormat;
});
// Middleware
app.use(morgan_1.default(`"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length] [:date]`));
app.use(cors_1.default({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Route
app.use('/user', userRouter_1.default);
app.use('/bubble', bubbleRouter_1.default);
app.get("/", (req, res) => {
    res.send("Hello world!!");
});
app.use((req, res, next) => {
    res.status(404).send("Page Not Found!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});
// Listen
app.listen(PORT, () => console.log(`http server is runnning on ${PORT}`));
//# sourceMappingURL=app.js.map