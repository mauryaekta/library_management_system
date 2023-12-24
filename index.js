const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const config = require('./src/config/config')
const route = require('./src/routes/index')
const port = config.PORT || 4000

// const corsOptions = {
//     origin: '*'
// };
app.use(cors());

// app.use((req, res, next) => { // Enable CORS (Cross-Origin Resource Sharing) middleware
//     req.header('Access-Control-Allow-Origin', '*'); // This middleware allows cross-origin requests to access server resources from any origin
//     req.header('Access-control-allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') // It sets necessary headers to permit specified HTTP methods and headers
//     next();
// })
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Configuration for "Static-Files"
app.use(express.static(`${__dirname}/public`))


//import database connection 
const db = require('./src/models')
app.use('/api', route)
//create simple route for entry point of project
app.use('/', (req, res) => {
    res.send({ message: 'welcome to library management system' })
})
db.sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
})
