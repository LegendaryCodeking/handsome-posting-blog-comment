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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const users_repo_1 = require("../repos/users-repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userService = {
    findUsers(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repo_1.usersRepo.findUsers(queryFilter);
        });
    },
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(14);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const createdUser = {
                id: (+(new Date())).toString(),
                login: login,
                email: email,
                password: passwordHash,
                createdAt: new Date().toISOString()
            };
            return yield users_repo_1.usersRepo.createUser(createdUser);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repo_1.usersRepo.deleteUser(id);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repo_1.usersRepo.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            //@ts-ignore
            const passArray = user.password.split("$");
            const salt = `$${passArray[1]}$${passArray[2]}$${passArray[3].substr(0, 22)}`;
            const passwordHash = yield this._generateHash(password, salt);
            if (user.password === passwordHash) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield users_repo_1.usersRepo.deleteAll();
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repo_1.usersRepo.findUserById(id);
        });
    },
};
