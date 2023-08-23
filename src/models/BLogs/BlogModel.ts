export type BlogDbModel = {
    "id": string,
    "name": string,
    "description": string,
    "websiteUrl": string,
    "createdAt": string,
    "isMembership": boolean
}

export type BlogCreateModel = {
    "name": string,
    "description": string,
    "websiteUrl": string,
}