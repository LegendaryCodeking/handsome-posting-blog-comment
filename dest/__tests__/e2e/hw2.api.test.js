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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../index");
const http_statuses_const_1 = require("../../routes/http-statuses-const");
describe('/blogs', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).delete('/testing/all-data');
    }));
    it('should return 404 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get('/blogs')
            .expect(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404, []);
    }));
    it('should return 404 for not existing blog', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get('/blogs/22222222220')
            .expect(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }));
    it('should not create blog without AUTH', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .send({
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
            "createdAt": "2023-05-18T11:39:35.408Z",
            "isMembership": true
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.UNAUTHORIZED_401);
        yield (0, supertest_1.default)(index_1.app)
            .get('/blogs')
            .expect(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404, []);
    }));
    /*
    * Created variable outside the next test to have option use
    * id of created blog in the further put test
    * */
    let createdBlog1 = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };
    it('should create blog with AUTH and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        let readyResponse = yield (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .send({
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.CREATED_201);
        createdBlog1 = readyResponse.body;
        expect(createdBlog1).toEqual({
            "_id": expect.any(String),
            "id": expect.any(String),
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
            "createdAt": expect.any(String),
            "isMembership": false
        });
        yield (0, supertest_1.default)(index_1.app)
            .get('/blogs')
            .expect(http_statuses_const_1.STATUSES_HTTP.OK_200, [{
                "id": createdBlog1.id,
                "name": createdBlog1.name,
                "description": createdBlog1.description,
                "websiteUrl": createdBlog1.websiteUrl,
                "createdAt": createdBlog1.createdAt,
                "isMembership": createdBlog1.isMembership
            }]);
    }));
    let createdBlog2 = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };
    it('should create one more blog with AUTH and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        let readyResponse = yield (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .send({
            "name": "Red Fox",
            "description": "Bingo article about Red Fox",
            "websiteUrl": "https://telegra.ph/Red-Fox-03-33"
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.CREATED_201);
        createdBlog2 = readyResponse.body;
        expect(createdBlog2).toEqual({
            "_id": expect.any(String),
            "id": expect.any(String),
            "name": "Red Fox",
            "description": "Bingo article about Red Fox",
            "websiteUrl": "https://telegra.ph/Red-Fox-03-33",
            "createdAt": expect.any(String),
            "isMembership": false
        });
        yield (0, supertest_1.default)(index_1.app)
            .get('/blogs')
            .expect(http_statuses_const_1.STATUSES_HTTP.OK_200, [{
                "id": createdBlog1.id,
                "name": createdBlog1.name,
                "description": createdBlog1.description,
                "websiteUrl": createdBlog1.websiteUrl,
                "createdAt": createdBlog1.createdAt,
                "isMembership": createdBlog1.isMembership
            }, {
                "id": createdBlog2.id,
                "name": createdBlog2.name,
                "description": createdBlog2.description,
                "websiteUrl": createdBlog2.websiteUrl,
                "createdAt": createdBlog2.createdAt,
                "isMembership": createdBlog2.isMembership
            }]);
    }));
    it('should not update blog with AUTH and incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/blogs/${createdBlog1.id}`)
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .send({
            "name": "",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.BAD_REQUEST_400);
        yield (0, supertest_1.default)(index_1.app)
            .get(`/blogs/${createdBlog1.id}`)
            .expect(http_statuses_const_1.STATUSES_HTTP.OK_200, {
            "id": createdBlog1.id,
            "name": createdBlog1.name,
            "description": createdBlog1.description,
            "websiteUrl": createdBlog1.websiteUrl,
            "createdAt": createdBlog1.createdAt,
            "isMembership": createdBlog1.isMembership
        });
    }));
    it('should update blog with AUTH and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/blogs/${createdBlog1.id}`)
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .send({
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
        yield (0, supertest_1.default)(index_1.app)
            .get(`/blogs/${createdBlog1.id}`)
            .expect(http_statuses_const_1.STATUSES_HTTP.OK_200, {
            "id": createdBlog1.id,
            "name": createdBlog1.name,
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11",
            "createdAt": createdBlog1.createdAt,
            "isMembership": createdBlog1.isMembership
        });
    }));
    it('should not update blog without AUTH and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/blogs/${createdBlog1.id}`)
            .send({
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 33333",
            "websiteUrl": "https://telegra.ph/Richard-Fey33333nman-05-11"
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.UNAUTHORIZED_401);
        yield (0, supertest_1.default)(index_1.app)
            .get(`/blogs/${createdBlog1.id}`)
            .expect(http_statuses_const_1.STATUSES_HTTP.OK_200, {
            "id": createdBlog1.id,
            "name": createdBlog1.name,
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11",
            "createdAt": createdBlog1.createdAt,
            "isMembership": createdBlog1.isMembership
        });
    }));
    it('should not update blog with AUTH and nonexistent шв ', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/blogs/404`)
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .send({
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        })
            .expect(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }));
});
