import Route from '@ioc:Adonis/Core/Route'

Route.get('/user', 'UsersController.index')
Route.post('/user', 'UsersController.store')
Route.get('/user/:id', 'UsersController.show')
Route.patch('/user/:id', 'UsersController.update').middleware('protect')
Route.delete('/user/:id', 'UsersController.destroy').middleware('protect')
