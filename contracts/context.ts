import { IUser } from "App/Interfaces/schemaInterfaces";

declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
        user?: IUser
    }
}