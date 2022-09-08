import Route from '@ioc:Adonis/Core/Route'

Route.get('/review', 'ReviewsController.index')
Route.post('/review', 'ReviewsController.store').middleware('protect').middleware('restrictTo:customer,admin')
Route.get('/review/:id', 'ReviewsController.show')
Route.patch('/review/:id', 'ReviewsController.update').middleware('protect').middleware('restrictTo:customer,admin').middleware('restrictToOwn')
Route.delete('/review/:id', 'ReviewsController.destroy').middleware('protect').middleware('restrictTo:customer,admin').middleware('restrictToOwn')