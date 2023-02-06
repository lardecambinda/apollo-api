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
exports.Comments = void 0;
var typeorm_1 = require("typeorm");
var Users_1 = require("./Users");
var Posts_1 = require("./Posts");
var Comments = /** @class */ (function () {
    function Comments() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Comments.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Comments.prototype, "comment", void 0);
    __decorate([
        (0, typeorm_1.Column)('text', { array: true, nullable: true }),
        (0, typeorm_1.OneToMany)(function () { return Posts_1.Posts; }, function (post) { return post.id; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            eager: true
        }),
        __metadata("design:type", Array)
    ], Comments.prototype, "post", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        (0, typeorm_1.ManyToOne)(function () { return Users_1.Users; }, function (user) { return user.id; }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", String)
    ], Comments.prototype, "user", void 0);
    Comments = __decorate([
        (0, typeorm_1.Entity)()
    ], Comments);
    return Comments;
}());
exports.Comments = Comments;
//# sourceMappingURL=Comments.js.map