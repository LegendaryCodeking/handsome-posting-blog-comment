"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUSES_HTTP = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const app = (0, express_1.default)();
const port = 7050;
const jsonBodyMW = express_1.default.json();
app.use(jsonBodyMW);
// const isItNotString = (value: any) => {
//     return typeof value !== 'string'
// }
//
// const notCorrectResolutions = (arr: Array<string>) => {
//     let correctResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
//     return arr.reduce(function (answer, item) {
//         return correctResolutions.indexOf(item) === -1 ? answer + 1 : answer
//     }, 0)
//
// }
// const isNotDate = (date: string) => {
//     return (String(new Date(date)) === "Invalid Date") || isNaN(+(new Date(date)));
// }
exports.STATUSES_HTTP = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
app.use('/blogs', blogs_router_1.blogsRouter);
app.delete('/testing/all-data', (req, res) => {
    blogs_router_1.db_blogs.blogs = [];
    res.sendStatus(exports.STATUSES_HTTP.NO_CONTENT_204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
