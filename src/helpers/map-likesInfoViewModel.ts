import {
    likesDBModel,
    likesInfoViewModel,
    likeStatusModel,
    usersLikesConnectionDBModel
} from "../models/Comments/LikeModel";

export const getlikesInfoViewModel = (
    likes: likesDBModel,
    userStatus: usersLikesConnectionDBModel | {status: likeStatusModel}): likesInfoViewModel => {
    return {
        likesCount: likes.likesCount,
        dislikesCount: likes.dislikesCount,
        myStatus: userStatus.status,
    }
}