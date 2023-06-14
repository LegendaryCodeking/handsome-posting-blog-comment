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
exports.commentsRouter = void 0;
const express_1 = require("express");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const http_statuses_const_1 = require("./http-statuses-const");
const comment_service_1 = require("../domain/comment-service");
const comments_validation_mw_1 = require("../middlewares/comments-validation-mw");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', authorization_mw_1.authorizationCheckBearer, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundComment = yield comment_service_1.commentService.findCommentById(req.params.id);
    if (!foundComment) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    else {
        res.json(foundComment);
    }
}));
exports.commentsRouter.put('/:id', authorization_mw_1.authorizationCheckBearer, comments_validation_mw_1.contentValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updateStatus = yield comment_service_1.commentService.updateComment(req.params.id, req.body.content);
    if (updateStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
exports.commentsRouter.delete('/:id', authorization_mw_1.authorizationCheckBearer, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let deletionStatus = yield comment_service_1.commentService.deleteComment(req.params.id);
    if (deletionStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
