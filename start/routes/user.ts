import Route from '@ioc:Adonis/Core/Route'

Route.get('/user', 'UsersController.index').middleware('protect').middleware('restrictTo:admin')
Route.post('/user', 'UsersController.store').middleware('protect').middleware('restrictTo:admin')

Route.get('/user/order', 'UsersController.myOrders').middleware('protect')
Route.get('/user/review', 'UsersController.myReviews').middleware('protect')
Route.get('/user/order-detail', 'UsersController.myOrderDetails').middleware('protect')

Route.get('/user/:id', 'UsersController.show').middleware('restrictTo:admin')
Route.patch('/user/:id', 'UsersController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/user/:id', 'UsersController.destroy').middleware('protect').middleware('restrictToOwn')
