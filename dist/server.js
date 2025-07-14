"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
let port = 3000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB:", result.connection.name);
        server = app_1.default.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
process.on("SIGINT", () => {
    console.log("Received SIGINT signal. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("SIGTERM", () => {
    console.log("Received SIGTERM signal. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("unhandledRejection", (error) => {
    console.log("Server shutting down...");
    console.log("Unhandled Rejection Error Detected... \n", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
//Promise.reject(new Error("Unhandled Rejection Error Provided"));
process.on("uncaughtException", (error) => {
    console.log("Server shutting down...");
    console.log("Uncaught Exception Error Detected... \n", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
//throw new Error("Uncaught Exception Error Provided");
