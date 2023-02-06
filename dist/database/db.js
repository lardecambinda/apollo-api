"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var connectDB = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.URL_DB_CONNECT,
    logging: true,
    synchronize: true,
    entities: ["./src/entity/**/*.ts"],
});
connectDB
    .initialize()
    .then(function () {
    console.log("Data Source has been initialized");
})
    .catch(function (err) {
    console.error("Data Source initialization error", err);
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map