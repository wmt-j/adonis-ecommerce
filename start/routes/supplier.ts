import Route from '@ioc:Adonis/Core/Route'

Route.get('/supplier', 'SuppliersController.index').middleware('protect').middleware('restrictTo:admin')
Route.post('/supplier', 'SuppliersController.store').middleware('protect').middleware('restrictTo:customer')

Route.get('/supplier/product', 'SuppliersController.myProducts').middleware('protect')

Route.get('/supplier/:id', 'SuppliersController.show').middleware('protect')
Route.patch('/supplier/:id', 'SuppliersController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/supplier/:id', 'SuppliersController.destroy').middleware('protect').middleware('restrictToOwn')
