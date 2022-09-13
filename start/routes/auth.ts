import Route from '@ioc:Adonis/Core/Route'

Route.post('/signup', 'AuthController.signup')
Route.post('/signin', 'AuthController.signin')
Route.post('/auth/google', 'AuthController.signinGoogle')
Route.get('/google/redirect', 'AuthController.getAccessTokenGoogle')
Route.get('/google/callback', 'AuthController.callbackGoogle')
Route.delete('/auth/delete', 'AuthController.destroy').middleware('protect')