"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const connectDb_1 = __importDefault(require("./config/connectDb"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const errorMiddlewares_1 = require("./middlewares/errorMiddlewares");
const chatRoutes_1 = require("./routes/chatRoutes");
const sessionRoutes_1 = require("./routes/sessionRoutes");
dotenv_1.default.config();
const corsOptions = {
    origin: process.env.CLIENT_PORT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
};
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_PORT
    }
});
dotenv_1.default.config();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '15mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
(0, connectDb_1.default)();
app.use('/api/users/', userRoutes_1.default);
app.use('/api/chats/', chatRoutes_1.chatRouter);
app.use('/api/admin/', adminRoutes_1.default);
app.use('/api/session/', sessionRoutes_1.sessionRouter);
if (process.env.NODE_ENV === 'production') {
    const parentDir = path_1.default.resolve(__dirname, '..');
    const staticMiddleware = express_1.default.static(path_1.default.join(parentDir, 'client', 'dist'));
    app.use(staticMiddleware);
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(parentDir, 'client', 'dist', 'index.html'));
    });
}
else {
    app.get('/', (req, res) => res.send('Server is ready'));
}
app.use(errorMiddlewares_1.notFound);
app.use(errorMiddlewares_1.errorHandler);
const port = process.env.PORT || 9009;
server.listen(port, () => {
    console.log(`server connected on port = ${port}`);
});
io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData === null || userData === void 0 ? void 0 : userData._id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => {
        socket.join(room);
    });
    socket.on('leave chat', (room) => {
        socket.leave(room);
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
    socket.on('new message', (newMessageRecieved) => {
        var _a, _b;
        let chat = (_a = newMessageRecieved === null || newMessageRecieved === void 0 ? void 0 : newMessageRecieved.message) === null || _a === void 0 ? void 0 : _a.chat_id;
        if (!(chat === null || chat === void 0 ? void 0 : chat.users))
            return console.log('chatusers not defined');
        (_b = chat === null || chat === void 0 ? void 0 : chat.users) === null || _b === void 0 ? void 0 : _b.forEach((user) => {
            if (user == newMessageRecieved.message.sender_id)
                return;
            socket.in(user).emit('message recieved', newMessageRecieved);
        });
    });
    socket.on('join session', (room) => {
        socket.join(room);
    });
    socket.on('leave session', (room) => {
        socket.leave(room);
    });
    socket.on('quit session', (room) => {
        socket.leave(room);
    });
    socket.on('close session', (room) => {
        io.to(room).emit('quit session', room);
    });
    socket.on('new sessionmessage', (newMessageRecieved) => {
        var _a;
        let session = newMessageRecieved === null || newMessageRecieved === void 0 ? void 0 : newMessageRecieved.session_id;
        if (!(session === null || session === void 0 ? void 0 : session.members))
            return console.log('session members not defined');
        (_a = session === null || session === void 0 ? void 0 : session.members) === null || _a === void 0 ? void 0 : _a.forEach((member) => {
            socket.in(member).emit('sessionmessage recieved', newMessageRecieved);
        });
        socket.in(session.host).emit('sessionmessage recieved', newMessageRecieved);
    });
    socket.on('new notification', (newNotificationRecieved) => {
        let userId = newNotificationRecieved === null || newNotificationRecieved === void 0 ? void 0 : newNotificationRecieved.user_id;
        socket.in(userId).emit('notification recieved', newNotificationRecieved);
    });
});
