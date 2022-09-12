import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/RoleModel'
import Supplier from 'App/Models/SupplierModel'
import User from 'App/Models/UserModel'
import errorHandler from 'App/utils/errorHandler'
import CustomException from 'App/Exceptions/CustomException'

export default class SuppliersController {
    public async index(ctx: HttpContextContract) {
        try {
            const suppliers = await Supplier.find().populate('user_id')
            ctx.response.ok(suppliers)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
    public async store(ctx: HttpContextContract) {
        try {
            const { name, website } = ctx.request.body()
            const newSupplier = await Supplier.create({ name, website, user_id: ctx.user?.id })
            const sellerRole = await Role.findOne({ name: 'seller' })
            await User.findByIdAndUpdate(ctx.user?.id, { role: sellerRole?.id, supplier_id: newSupplier?.id })
            ctx.response.created(newSupplier)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const supplier = await Supplier.findById(id)
            if (!supplier) throw new CustomException("Suppplier not found", ctx, 404, 1)
            ctx.response.ok(supplier)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { name, website } = ctx.request.body()
            const updatedSupplier = await Supplier.findByIdAndUpdate(id, { name, website }, { new: true, runValidators: true })
            ctx.response.created(updatedSupplier)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Supplier.findByIdAndDelete(id)
            ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
}
