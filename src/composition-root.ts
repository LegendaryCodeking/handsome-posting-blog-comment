import {BlogsRepo} from "./repos/blogs-repo";
import {BlogsService} from "./domain/blogs-service";
import {BlogsQueryRepo} from "./repos/query-repos/blogs-query-repo";
import {PostQueryRepo} from "./repos/query-repos/post-query-repo";
import {PostsRepo} from "./repos/posts-repo";
import {PostsService} from "./domain/posts-service";
import {BlogsController} from "./controller/blogs-controller";
import {PostsController} from "./controller/posts-controller";
import {CommentService} from "./domain/comment-service";
import {CommentsQueryRepo} from "./repos/query-repos/comments-query-repo";
import {CommentsRepo} from "./repos/comments-repo";
import {CommentsController} from "./controller/comments-controller";
import {UsersRepo} from "./repos/users-repo";
import {UsersQueryRepo} from "./repos/query-repos/users-query-repo";
import {JwtService} from "./application/jwt-service";
import {EmailManager} from "./managers/email-manager";
import {UserService} from "./domain/user-service";
import {UsersController} from "./controller/users-controller";
import {AuthController} from "./controller/auth-controller";
import {AuthService} from "./domain/auth-service";
import {SessionsRepo} from "./repos/sessions-repo";
import {SessionsService} from "./domain/sessions-service";
import {SecurityController} from "./controller/security-controller";
import {SessionsQueryRepo} from "./repos/query-repos/sessions-query-repo";
import {LikesRepo} from "./repos/like-repo";
import {LikesQueryRepo} from "./repos/query-repos/likes-query-repo";


const jwtService = new JwtService()

const emailManager = new EmailManager()

const blogsRepo = new BlogsRepo()
const blogsQueryRepo = new BlogsQueryRepo()
const blogsService = new BlogsService(blogsRepo)


const commentsRepo = new CommentsRepo()
const commentsQueryRepo = new CommentsQueryRepo()
const likesRepo = new LikesRepo()
const likesQueryRepo = new LikesQueryRepo()
const commentService = new CommentService(commentsRepo,likesRepo)

const postsRepo = new PostsRepo()
const postQueryRepo = new PostQueryRepo()
const postsService = new PostsService(postsRepo, blogsQueryRepo,likesRepo)

const usersRepo = new UsersRepo()
const usersQueryRepo = new UsersQueryRepo()
const userService = new UserService(usersQueryRepo, usersRepo, jwtService, emailManager)


const sessionsRepo = new SessionsRepo()
const sessionsQueryRepo = new SessionsQueryRepo()
const sessionsService = new SessionsService(sessionsRepo)

const authService = new AuthService(usersRepo,emailManager)

export const blogsController = new BlogsController(blogsService, blogsQueryRepo, postQueryRepo, postsService)
export const postsController = new PostsController(postQueryRepo, postsService, commentsQueryRepo, commentService,likesQueryRepo)
export const commentsController = new CommentsController(commentsQueryRepo, commentService,likesQueryRepo)
export const usersController = new UsersController(usersQueryRepo, userService)
export const authController = new AuthController(userService,jwtService,authService,sessionsService)
export const securityController = new SecurityController(jwtService,sessionsQueryRepo,sessionsService)