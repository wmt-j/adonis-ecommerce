import Route from '@ioc:Adonis/Core/Route'

Route.post('/signup', 'AuthController.signup')
Route.post('/signin', 'AuthController.signin')
Route.delete('/auth/delete', 'AuthController.destroy').middleware('protect')