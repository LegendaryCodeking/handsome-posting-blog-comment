"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPagination = void 0;
const queryPagination = (req) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        searchNameTerm: (_a = req.query.searchNameTerm) !== null && _a !== void 0 ? _a : '',
        sortBy: (_b = req.query.sortBy) !== null && _b !== void 0 ? _b : 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc',
        pageNumber: +((_c = req.query.pageNumber) !== null && _c !== void 0 ? _c : 1),
        pageSize: +((_d = req.query.pageSize) !== null && _d !== void 0 ? _d : 10),
        blogId: (_e = req.params.id) !== null && _e !== void 0 ? _e : '',
        searchLoginTerm: (_f = req.query.searchLoginTerm) !== null && _f !== void 0 ? _f : '',
        searchEmailTerm: (_g = req.query.searchEmailTerm) !== null && _g !== void 0 ? _g : ''
    };
};
exports.queryPagination = queryPagination;
