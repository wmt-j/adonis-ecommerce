import Route from '@ioc:Adonis/Core/Route'

Route.get('/order', 'OrdersController.index').middleware('protect')
Route.post('/order', 'OrdersController.store').middleware('protect')    //IMP
Route.get('/order/:id', 'OrdersController.show').middleware('protect').middleware('restrictToOwn')
Route.patch('/order/:id', 'OrdersController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/order/:id', 'OrdersController.destroy').middleware('protect').middleware('restrictToOwn')
Route.get('/order/cancel/:id', 'OrdersController.destroy').middleware('protect').middleware('restrictToOwn')
Route.get('/order/place/:id', 'OrdersController.placeOrder').middleware('protect').middleware('restrictToOwn')