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
exports.usersRouter = void 0;
const express_1 = require("express");
const FilterModel_1 = require("../models/FilterModel");
const http_statuses_const_1 = require("./http-statuses-const");
const user_service_1 = require("../domain/user-service");
const authorization_mw_1 = require("../middlewares/authorization-mw");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', authorization_mw_1.superAuthorizationCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let queryFilter = (0, FilterModel_1.queryPagination)(req);
    let foundUsers = yield user_service_1.userService.findUsers(queryFilter);
    if (!foundUsers.items.length) {
        res.status(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundUsers);
        return;
    }
    res.status(http_statuses_const_1.STATUSES_HTTP.OK_200)
        .json(foundUsers);
}));