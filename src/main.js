const express = require('express')
const HttpStatus = require('http-status-codes')
const Patient = require('./patient')

const port = 2000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use((req, res, next) => { // middleware responsible for make union of json body and query params
    req.body = Object.assign({}, req.body, req.query)
    req.query = req.body
    next()
})

app
    .get('/patients_list', async(req, res) => {
        let data
        if (data = await Patient.getPatients(req.query["amount"])) {
            res.status(HttpStatus.OK).send(data)
        } else {
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    })
    .get('/patient_info', async(req, res) => {
        if (!("pid" in req.query)) {
            res.sendStatus(HttpStatus.BAD_REQUEST)
            return;
        }

        let data
        if (data = await Patient.getPatientInfo(req.query["pid"])) {
            res.status(HttpStatus.OK).send(data)
        } else {
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    })

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})