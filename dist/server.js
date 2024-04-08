"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./src/index"));
const app = (0, express_1.default)();
const server = new index_1.default(app);
const PORT = process.env.WS_PORT
    ? parseInt(process.env.WS_PORT, 10)
    : 3000;
app
    .listen(PORT, "localhost", () => {
    console.log(`Server escuchando en puerto ${PORT}.`);
})
    .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log("Error: la dirección se encuentra en uso");
    }
    else {
        console.log(err);
    }
});
