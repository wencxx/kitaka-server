const express = require('express')
const cors = require('cors')
const { admin, db } = require('./firebase/firebase'); 

const app = express()

app.use(cors())
app.use(express.json())

app.post('/location', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.get('/get-passengers', async (req, res) => {
    try {
      const snapshot = await db.collection('Passengers').get();
      const data = snapshot.docs.map(doc => doc.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.post('/add-passenger', async (req, res) => {
    try {
      await db.collection('Passengers').add(req.body);
      res.status(201).send('Data added successfully');
    } catch (error) {
      res.status(500).send('Error adding data');
    }
});

app.post('/update-location', async (req, res) => {
    const { latitude, longitude } = req.body

    console.log(req.body)
    const collectionRef = db.collection('Passengers');
    const query = collectionRef.where('wristbandId', '==', 10); 

    try {
        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            console.log('No matching documents found.');
            return;
        }

        const batch = db.batch();

        querySnapshot.forEach((doc) => {
            const docRef = collectionRef.doc(doc.id);
            batch.update(docRef, { lat: latitude, lng: longitude });
        });

        await batch.commit();
        console.log('Documents updated successfully.');
    } catch (error) {
        console.error('Error updating documents:', error);
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});