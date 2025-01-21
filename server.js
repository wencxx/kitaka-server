require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Passengers = require('./models/Passengers') // Assuming Passengers is a Mongoose model

const app = express()

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors())
app.use(express.json(corsOptions))

// Get all passengers using Mongoose
app.get('/get-passengers', async (req, res) => {
    try {
        const passengers = await Passengers.find();
        res.status(200).send(passengers);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new passenger using Mongoose
app.post('/add-passenger', async (req, res) => {
    try {
        const newPassenger = new Passengers(req.body);
        await newPassenger.save();
        res.status(201).send('Data added successfully');
    } catch (error) {
        res.status(500).send('Error adding data');
    }
});

// Update location based on wristbandId using Mongoose
app.post('/update-location', async (req, res) => {
    const { latitude, longitude, wristbandId } = req.body;

    console.log(req.body);
    try {
        const passenger = await Passengers.findOne({ wristbandId });

        if (!passenger) {
            console.log('No matching documents found.');
            return res.status(404).send('Passenger not found');
        }

        passenger.lat = latitude;
        passenger.lng = longitude;
        await passenger.save();

        console.log('Document updated successfully.');
        res.status(200).send('Location updated successfully');
    } catch (error) {
        console.error('Error updating documents:', error);
        res.status(500).send('Error updating location');
    }
});

mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
db.on('error', (error) => { console.error(error) })
db.once('open', () => { console.log('Connected to database') })

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
