import {Request} from "express";

export type RequestWithParamsBlog<T> = Request<T>
// export type RequestWithBody<T> = Request<{},{},T>
// export type RequestWithQuery<T> = Request<{},{},{},T>
// export type RequestWithParamsAndBody<T,B> = Request<T,{},B>