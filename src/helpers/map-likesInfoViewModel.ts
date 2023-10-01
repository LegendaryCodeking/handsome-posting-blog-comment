import {likesDBModel, likesInfoViewModel, usersLikesConnectionDBModel} from "../models/Comments/LikeModel";

export const getlikesInfoViewModel = (
    likes: likesDBModel,
    userStatus: usersLikesConnectionDBModel): likesInfoViewModel => {
    return {
        likesCount: likes.likesCount,
        dislikesCount: likes.dislikesCount,
        myStatus: userStatus.status,
    }
}