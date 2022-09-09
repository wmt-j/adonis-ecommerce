/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { validator } from '@ioc:Adonis/Core/Validator'
import mongoose from 'mongoose'

validator.rule('isMongoId', (value, _, options) => {
    if (typeof value !== 'string') {
        return
    }

    const objIdString = new mongoose.Types.ObjectId(value)
    console.log(options);

    if (value !== objIdString.toString()) {
        options.errorReporter.report(
            options.pointer,
            'MongoId',
            'Value should be a valid MongoDb ID.',
            options.arrayExpressionPointer
        )
    }
})

//have to register it before use, in contracts/validator.ts, name of file does not matter