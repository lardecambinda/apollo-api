"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var User_1 = __importDefault(require("./User"));
var Posts_1 = __importDefault(require("./Posts"));
var router = (0, express_1.Router)();
router.use(User_1.default);
router.use(Posts_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map