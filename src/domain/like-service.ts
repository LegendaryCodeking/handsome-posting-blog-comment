import {inject, injectable} from "inversify";
import {LikesRepo} from "../repos/like-repo";
import {likesInfoViewModel, likeStatusModel, ownerTypeModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";

@injectable()
export class LikeService {

    constructor(@inject(LikesRepo) protected likesRepo: LikesRepo) {
    }

    async likeEntity(entityType: ownerTypeModel, entityId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string, userLogin: string): Promise<boolean> {
        const savedLikeStatus = likesInfo.myStatus
        let result: boolean = true
        if (savedLikeStatus === likeStatus.None) {
            if (newLikeStatus === likeStatus.Like) {
                result = await this.likesRepo.Like(entityType, entityId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.Dislike) {
                result = await this.likesRepo.Dislike(entityType, entityId, userId, userLogin)
            }
        }

        if (savedLikeStatus === likeStatus.Like) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Like) {
            //     await likesRepo.Reset(entityType, req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Dislike) {
                await this.likesRepo.Reset(entityType, entityId, userId, userLogin, likeStatus.Like)
                result = await this.likesRepo.Dislike(entityType, entityId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset(entityType, entityId, userId, userLogin, likeStatus.Like)
            }
        }

        if (savedLikeStatus === likeStatus.Dislike) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Dislike) {
            //     await likesRepo.Reset(entityType, req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Like) {
                await this.likesRepo.Reset(entityType, entityId, userId, userLogin, likeStatus.Dislike)
                result = await this.likesRepo.Like(entityType, entityId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset(entityType, entityId, userId, userLogin, likeStatus.Dislike)
            }
        }

        return result
    }

}