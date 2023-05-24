import {FilterModel} from "../models/FilterModel";
import {usersRepo} from "../repos/users-repo";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";


export const userService = {
    async findUsers(queryFilter: FilterModel) : Promise<UsersWithPaginationModel>{
        return usersRepo.findUsers(queryFilter)
    }



}