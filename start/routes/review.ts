import Route from '@ioc:Adonis/Core/Route'

Route.get('/review', 'ReviewsController.index')
Route.post('/review', 'ReviewsController.store').middleware('protect')
Route.get('/review/:id', 'ReviewsController.show')
Route.patch('/review/:id', 'ReviewsController.update').middleware('protect')
Route.delete('/review/:id', 'ReviewsController.destroy').middleware('protect')