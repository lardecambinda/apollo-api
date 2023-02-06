"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var router_1 = __importDefault(require("./routes/router"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(router_1.default);
app.listen(3001, function () { return console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:3001"); });
//# sourceMappingURL=server.js.map