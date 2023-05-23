"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPagination = void 0;
const queryPagination = (query) => {
    var _a, _b, _c, _d, _e;
    return {
        searchNameTerm: (_a = query.searchNameTerm) !== null && _a !== void 0 ? _a : '',
        sortBy: (_b = query.sortBy) !== null && _b !== void 0 ? _b : 'createdAt',
        sortDirection: query.sortDirection === 'asc' ? 'asc' : 'desc',
        pageNumber: +((_c = query.query.pageNumber) !== null && _c !== void 0 ? _c : 1),
        pageSize: +((_d = query.query.pageSize) !== null && _d !== void 0 ? _d : 10),
        blogId: (_e = query.params.id.toString()) !== null && _e !== void 0 ? _e : ''
    };
};
exports.queryPagination = queryPagination;
