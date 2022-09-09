import Route from '@ioc:Adonis/Core/Route'

Route.get('/order-detail', 'OrderDetailsController.index').middleware('restrictTo:admin')
Route.post('/order-detail', 'OrderDetailsController.store').middleware('protect')
Route.get('/order-detail/:id', 'OrderDetailsController.show').middleware('protect').middleware('restrictToOwn')
Route.patch('/order-detail/:id', 'OrderDetailsController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/order-detail/:id', 'OrderDetailsController.destroy').middleware('protect').middleware('restrictToOwn')