import Route from '@ioc:Adonis/Core/Route'

Route.get('/product', 'ProductsController.index')
Route.post('/product', 'ProductsController.store').middleware('protect').middleware('restrictTo:seller,admin')  //passing arguments to middleware
Route.get('/product/:id', 'ProductsController.show')
Route.patch('/product/:id', 'ProductsController.update').middleware('protect').middleware('restrictTo:seller,admin').middleware('restrictToOwn')
Route.delete('/product/:id', 'ProductsController.destroy').middleware('protect').middleware('restrictTo:seller,admin').middleware('restrictToOwn')
