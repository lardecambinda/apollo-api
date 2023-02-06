"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = void 0;
var typeorm_1 = require("typeorm");
var Users_1 = require("./Users");
var Comments_1 = require("./Comments");
var Posts = /** @class */ (function () {
    function Posts() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Posts.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Posts.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Posts.prototype, "content", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { array: true, nullable: true }),
        (0, typeorm_1.ManyToOne)(function () { return Comments_1.Comments; }, function (comment) { return comment.id; }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], Posts.prototype, "comments", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        (0, typeorm_1.ManyToOne)(function () { return Users_1.Users; }, function (user) { return user.id; }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", String)
    ], Posts.prototype, "user", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { array: true }),
        __metadata("design:type", Array)
    ], Posts.prototype, "files", void 0);
    Posts = __decorate([
        (0, typeorm_1.Entity)()
    ], Posts);
    return Posts;
}());
exports.Posts = Posts;
//# sourceMappingURL=Posts.js.map