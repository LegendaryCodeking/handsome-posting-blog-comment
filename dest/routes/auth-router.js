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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const user_service_1 = require("../domain/user-service");
const http_statuses_const_1 = require("./http-statuses-const");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkResult = yield user_service_1.userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    return checkResult ? res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204) : res.sendStatus(http_statuses_const_1.STATUSES_HTTP.UNAUTHORIZED_401);
}));
