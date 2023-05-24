import {FilterModel} from "../models/FilterModel";
import {usersRepo} from "../repos/users-repo";


export const userService = {
    async findUsers(queryFilter: FilterModel) : Promise<T>{
        return usersRepo.findUsers(queryFilter)
    }



}