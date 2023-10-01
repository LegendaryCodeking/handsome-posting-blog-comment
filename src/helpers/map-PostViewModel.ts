import {PostType} from "../models/Posts/PostModel";
import {PostViewModel} from "../models/Posts/PostViewModel";
import {PostDBModel} from "../models/Posts/PostDBModel";
import {likeDetailsViewModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {likesQueryRepo} from "../repos/query-repos/likes-query-repo";
import {UsersLikesConnectionModelClass} from "../db/db";

export const getPostViewModel = async (post: PostType | PostDBModel, userId?: string | undefined): Promise<PostViewModel> => {
    const likesInfo = await likesQueryRepo.findLikesByOwnerId("Post", post.id, userId)
        ?? {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: likeStatus.None
        }

    const likesLastThreeMongoose = await UsersLikesConnectionModelClass.find({
        "likedObjectId": post.id,
        "likedObjectType": "Post"
    }).lean()
        .sort({addedAt: 'desc'})
        .limit(3)


    let likesLastThree = likesLastThreeMongoose.map((value) => {
        console.log(value)
        let newItem: likeDetailsViewModel = {
            addedAt: value.addedAt.toString(),
            userId: value.userId,
            login: value.userLogin
        }
        return newItem
    })


    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: likesInfo.likesCount,
            dislikesCount: likesInfo.dislikesCount,
            myStatus: likesInfo.myStatus,
            newestLikes: likesLastThree
        }
    }
}