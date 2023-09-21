export const authBasicHeader = {Authorization: "Basic YWRtaW46cXdlcnR5"}

export function generateString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
const DbName =  process.env.MONGODBNAME || "forum";
export const connection_string = mongoUri + '/' + DbName