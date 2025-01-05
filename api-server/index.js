/*
 * Module dependencies
 */
const express = require('express')
const cors = require('cors')
const query = require('./query');
const createCar = require('./createCar')
const changeOwner = require('./changeOwner')
const bodyParser = require('body-parser')


const app = express()

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors())
app.options('*', cors()); 

// To parse encoded data
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// get all car
app.get('/get-car', function (req, res) {
    query.main( req.query )
    .then(result => {
        const parsedData = JSON.parse( result )
        let carList

        // if user search car
        if(  req.query.key ){
            carList = [
                {
                    Key: req.query.key,
                    Record: {
                        ...parsedData
                    }
                }
            ]
            res.send( carList )
            return
        }

        carList = parsedData
        res.send( carList )
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO GET DATA!')
    })
})

// create a new car
app.post('/create', function (req, res) {
    createCar.main( req.body  )
    .then(result => {
        res.send({message: 'Created successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

// change car owner
app.post('/update', function (req, res) {
    changeOwner.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

app.listen(3000, () => console.log('Server is running at port 3000'))