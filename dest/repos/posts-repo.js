"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepo = void 0;
let db_posts = {
    posts: [
        {
            "id": "1",
            "title": "Very interesting story number 111111111",
            "shortDescription": "Very interesting story number 111111111 short desc",
            "content": "Very interesting story number 111111111 outstanding content",
            "blogId": "111111111",
            "blogName": "BingoBlog"
        },
        {
            "id": "2",
            "title": "Very interesting story number 222222",
            "shortDescription": "Very interesting story number 222222 short desc",
            "content": "Very interesting story number 222222 outstanding content",
            "blogId": "222222",
            "blogName": "ShlakoBlocun"
        },
        {
            "id": "3",
            "title": "Very interesting story number 3333333333",
            "shortDescription": "Very interesting story number 3333333333 short desc",
            "content": "Very interesting story number 3333333333 outstanding content",
            "blogId": "3333333333",
            "blogName": "DogMemes"
        }
    ]
};
exports.postsRepo = {
    findPosts() {
        return db_posts.posts;
    },
    findProductById(id) {
        return db_posts.posts.find(c => +c.id === +id);
    },
    deletePost(id) {
        const foundPost = db_posts.posts.find(c => +c.id === +id);
        if (foundPost) {
            db_posts.posts = db_posts.posts.filter(c => +c.id !== +id);
            return true;
        }
        else {
            return false;
        }
    },
    createPost(title, shortDescription, content, blogId) {
        const createdPost = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": "BlogName"
        };
        db_posts.posts.push(createdPost);
        return createdPost;
    },
    updatePost(id, title, shortDescription, content, blogId) {
        const foundPost = db_posts.posts.find(c => +c.id === +id);
        if (foundPost) {
            foundPost.title = title;
            foundPost.shortDescription = shortDescription;
            foundPost.content = content;
            foundPost.blogId = blogId;
            return true;
        }
        else {
            return false;
        }
    },
    deleteAll() {
        db_posts.posts = [];
    }
};
