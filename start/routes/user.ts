import Route from '@ioc:Adonis/Core/Route'

Route.get('/user', 'UsersController.index').middleware('restrictTo:admin')
Route.post('/user', 'UsersController.store').middleware('restrictTo:admin')
Route.get('/user/:id', 'UsersController.show').middleware('restrictTo:admin')
Route.patch('/user/:id', 'UsersController.update').middleware('protect').middleware('restrictToOwn')
Route.delete('/user/:id', 'UsersController.destroy').middleware('protect').middleware('restrictToOwn')
