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
    supplier_id?: mongoose.Types.ObjectId
    googleToken?: String
}

export interface IProduct {
    name?: string
    price?: number
    discount?: number
    description?: string
    seller?: mongoose.Types.ObjectId
    category?: mongoose.Types.ObjectId
    total?: number,
    createdAt?: Date,
    avgRating?: number
    noOfRatings?: number
    updateRatings: Function
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
    user_id?: mongoose.Types.ObjectId,
    ordered_at?: Date
}

export interface IOrderDetail {
    quantity?: number
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

export interface ISuppplier {
    name?: string,
    website?: string,
    user_id?: mongoose.Types.ObjectId
}