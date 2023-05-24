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
exports.usersRepo = void 0;
const db_1 = require("./db");
const getUserViewModel = (user) => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
};
exports.usersRepo = {
    findUsers(queryFilter) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const findFilter = {
                $or: [{ login: { $regex: (_a = queryFilter.searchLoginTerm) !== null && _a !== void 0 ? _a : '', $options: 'i' } },
                    { email: { $regex: (_b = queryFilter.searchEmailTerm) !== null && _b !== void 0 ? _b : '', $options: 'i' } }]
            };
            const sortFilter = { [queryFilter.sortBy]: queryFilter.sortDirection };
            let foundUsers = yield db_1.usersCollection
                .find(findFilter)
                .sort(sortFilter)
                .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
                .limit(queryFilter.pageSize)
                .map(blog => getUserViewModel(blog)).toArray();
            let totalCount = yield db_1.usersCollection.countDocuments(findFilter);
            return {
                "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
                "page": queryFilter.pageNumber,
                "pageSize": queryFilter.pageSize,
                "totalCount": totalCount,
                "items": foundUsers
            };
        });
    },
    createUser(createdUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(createdUser);
            return getUserViewModel(createdUser);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.deleteOne({ "id": id });
            return result.deletedCount === 1;
        });
    }
};
