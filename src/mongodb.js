const mongoose = require('mongoose');
const config = require('config');

module.exports = async function()
{
    return new Promise( (resolve, reject) =>
    {
        mongoose.connect(config.MongodbUrl,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => {
            // logger.info('Connected to MongoDB...');
            // resolve();
        })
        .catch(err => {
            console.error("could not connect to MongoDB!");
            process.exit(1);
        });

        const db = mongoose.connection;

        
        db.on('error', (err) =>  {
            console.error(`An Error Ocuured in MongoDB: ${err}`);
          });

        db.once('open', () =>  {
            console.info('Connected to MongoDB...');
            resolve();
          });

    } ); 
}