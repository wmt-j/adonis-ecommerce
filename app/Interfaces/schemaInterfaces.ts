import mongoose from "mongoose"

export interface IUser {
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