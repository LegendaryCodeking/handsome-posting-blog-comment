import {Request} from 'express'

export type RequestsWithParams<T> = Request<T>
export type RequestsWithBody<T> = Request<{},{},T>
export type RequestsWithQuery<T> = Request<{},{},{},T>
export type RequestsWithParamsAndBody<T,B> = Request<T,{},B>