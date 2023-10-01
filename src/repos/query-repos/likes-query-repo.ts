import {LikeModelClass, UsersLikesConnectionModelClass} from "../../db/db";
import {
    likesDBModel,
    likesInfoViewModel,
    ownerTypeModel,
    usersLikesConnectionDBModel
} from "../../models/Comments/LikeModel";
import {getlikesInfoViewModel} from "../../helpers/map-likesInfoViewModel";
import {likeStatus} from "../../enum/likeStatuses";

export class LikesQueryRepo {

    async findLikesByOwnerId(
        ownerType: ownerTypeModel,
        ownerId: string,
        userId: string| undefined = undefined): Promise<likesInfoViewModel | null> {

        const foundLikes: likesDBModel | null = await LikeModelClass.findOne(
            {
                "ownerType": ownerType,
                "ownerId": ownerId
            }).lean()

        if (!foundLikes) return null

    // Пустой ID это тот случай, когда user не авторизован
        let foundStatus: usersLikesConnectionDBModel | null | { status: likeStatus.None } ;
        if (userId === undefined) {
             foundStatus = {
                status: likeStatus.None
            }

            return getlikesInfoViewModel(foundLikes, foundStatus)
        }

        foundStatus =
            await UsersLikesConnectionModelClass.findOne(
                {
                    "userId": userId,
                    "likedObjectId": ownerId,
                    "likedObjectType": ownerType
                }).lean()

        if (!foundStatus) {
            foundStatus = {
                status: likeStatus.None
            }
        }

        return getlikesInfoViewModel(foundLikes, foundStatus)

    }
}

export const likesQueryRepo = new LikesQueryRepo()