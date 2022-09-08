import Route from '@ioc:Adonis/Core/Route'

Route.get('/order', 'OrdersController.index').middleware('protect').middleware('restrictTo:admin')
Route.post('/order', 'OrdersController.store').middleware('protect')
Route.get('/order/:id', 'OrdersController.show').middleware('protect').middleware('restrictToOwn')
Route.patch('/order/:id', 'OrdersController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/order/:id', 'OrdersController.destroy').middleware('protect').middleware('restrictToOwn')