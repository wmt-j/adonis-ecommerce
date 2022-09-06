import Route from '@ioc:Adonis/Core/Route'

Route.get('/product', 'ProductsController.index')
Route.post('/product', 'ProductsController.store')
Route.get('/product/:id', 'ProductsController.show')
Route.patch('/product/:id', 'ProductsController.update')
Route.delete('/product/:id', 'ProductsController.destroy')
