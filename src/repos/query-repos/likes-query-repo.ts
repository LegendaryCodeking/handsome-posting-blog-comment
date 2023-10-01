import {LikeModelClass, UsersLikesConnectionModelClass} from "../../db/db";
import {
    likesDBModel,
    likesInfoViewModel,
    ownerTypeModel,
    usersLikesConnectionDBModel
} from "../../models/Comments/LikeModel";
import {getlikesInfoViewModel} from "../../helpers/map-likesInfoViewModel";

export class LikesQueryRepo {

    async findLikesByOwnerId(
        ownerType: ownerTypeModel,
        ownerId: string,
        userId: string): Promise<likesInfoViewModel | null> {

        const foundLikes: likesDBModel | null = await LikeModelClass.findOne(
            {
                "ownerType": ownerType,
                "ownerId": ownerId
            }).lean()

        const foundStatus: usersLikesConnectionDBModel | null =
            await UsersLikesConnectionModelClass.findOne(
                {
                    "userId": userId,
                    "likedObjectId": ownerId,
                    "likedObjectType": ownerType
                }).lean()

        if (!foundLikes || !foundStatus) return null

        return getlikesInfoViewModel(foundLikes, foundStatus)

    }
}

export const likesQueryRepo = new LikesQueryRepo()