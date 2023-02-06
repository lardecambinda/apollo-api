"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var PostController_1 = __importDefault(require("../../controller/PostController"));
var router = (0, express_1.Router)();
router.post('/post/create', PostController_1.default.store);
exports.default = router;
//# sourceMappingURL=index.js.map