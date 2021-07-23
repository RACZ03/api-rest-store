import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/storedb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        .then( db => console.log('Db is connected') )
        .catch( error => console.log(error) )