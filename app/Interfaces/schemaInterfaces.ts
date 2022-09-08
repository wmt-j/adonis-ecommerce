import mongoose from "mongoose"

export interface IUser {
    id?: string
    name?: string
    email?: string
    password?: string
    password_confirm?: string
    active?: boolean
    role?: mongoose.Types.ObjectId
    phone?: number
    address?: string
    order_id?: mongoose.Types.ObjectId
}

export interface IProduct {
    name?: string
    price?: number
    discount?: number
    description?: string
    seller?: mongoose.Types.ObjectId
    category?: mongoose.Types.ObjectId
}

export interface ICategory {
    name?: string
}

export interface IRole {
    name?: string
}

export interface IOrder {
    total?: number
    status?: string
    user_id?: mongoose.Types.ObjectId
}

export interface IOrderDetail {
    quantity?: string
    product_id?: mongoose.Types.ObjectId
    user_id?: mongoose.Types.ObjectId
    order_id?: mongoose.Types.ObjectId
}

export interface IReview {
    rating?: number,
    body?: string,
    product_id?: mongoose.Types.ObjectId
    user_id?: mongoose.Types.ObjectId
}