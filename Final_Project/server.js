const {initializeApp} = require('firebase/app');
const { getFirestore, collection, doc, getDoc, updateDoc, arrayUnion, getDocs } = require('firebase/firestore');
const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json());
app.use(cors());


// Set up env variables 
const mapApiKey = process.env.MAP_API_KEY;
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const debugEmail = process.env.DEBUG_EMAIL;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqykJcKI_EngKmyUvQ7aUthExPoYIDV_M",
    authDomain: "final-project-dd4e7.firebaseapp.com",
    projectId: "final-project-dd4e7",
    storageBucket: "final-project-dd4e7.appspot.com",
    messagingSenderId: "750350625495",
    appId: "1:750350625495:web:c7b41616bb69958b6d5e92"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
const db = getFirestore(fireApp);

// Serve static files from 'public' directory
app.use(express.static('public'));

app.post('/signup', (req, res) => {
    console.log(req.body);
    res.send('POST RECEIVED');
});

// Route functions 
app.post('/allRoutes', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const array = data.created; 
        res.send({routes: array});
    } else {
        console.log("No such document!");
        res.send("No such document!");
    }
})

app.post('/getRoute', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.name) { 
                console.log(array[i]);
                res.send({route: array[i]});
            }
        }
    } else {
        console.log("No such document!");
        res.send("No such document!");
    }
});

app.post('/renameRoute', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // retrieve the array of routes and identify index
        let index; 
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.originalName) { 
                index = i; 
            }
        }
        let initInt = 0; 
        let initName = `${req.body.updatedName}`;
        while (await checkRedundant(initName)) {
            initInt++;
            initName = `${req.body.updatedName} ${initInt}`;
        }
        console.log(array[index]);
        array[index].name = initName;
        await updateDoc(docRef, {
            created: array
        });
        res.send({message: 'Success'})
    } else {
        res.send({message: 'Failure'})
    }
})

app.get('/addRoute', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let initInt = 0; 
        let initName = `untitled ${initInt}`;
        while (await checkRedundant(initName)) {
            initInt++;
            initName = `untitled ${initInt}`;
        }
        const newItem = { likes: 0, locations: [], name: initName }; // new item
        await updateDoc(docRef, {
            created: arrayUnion(newItem)
        });
        res.send({name: initName})
    } else {
        res.send({message: 'Failure'})
    }
});

app.post('/deleteRoute', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // retrieve the array of routes and identify index
        const data = docSnap.data();
        const array = data.created; 
        const index = array.indexOf(req.body.name);
        array.splice(index, 1);
        await updateDoc(docRef, {
            created: array
        });
        res.send({message: 'Success'})
    } else {
        res.send({message: 'Failure'})
    }
});

// Location functions
app.post('/allLocations', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", req.body.username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.routeName) { 
                res.send({locations: array[i].locations});
            }
        }
    } else {
        console.log("No such document!");
        res.send("No such document!");
    }
});

app.post('/renameLocation', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", req.body.username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // retrieve the array of routes and identify index
        let routeIndex; 
        let locationIndex;
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.routeName) { 
                routeIndex = i; 
            }
        }
        const locationArray = array[routeIndex].locations;
        for (let i = 0; i < locationArray.length; i++) {
            if (locationArray[i].title === req.body.originalName) { 
                locationIndex = i; 
            }
        }
        let initInt = 0; 
        let initName = `${req.body.updatedName}`;
        while (await checkRedundantLocation(locationArray,initName)) {
            initInt++;
            initName = `${req.body.updatedName} ${initInt}`;
        }
        let originalLat = locationArray[locationIndex].lat;
        let originalLng = locationArray[locationIndex].lng;
        array[routeIndex].locations[locationIndex] = { lat: originalLat, lng: originalLng, title: initName};
        await updateDoc(docRef, {
            created: array
        });
        res.send({message: 'Success'})
    } else {
        res.send({message: 'Failure'})
    }
});

app.post('/addLocation', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", req.body.username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // retrieve the array of routes and identify index
        let routeIndex; 
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.routeName) { 
                routeIndex = i; 
            }
        }
        let initInt = 0; 
        let initName = `location`;
        console.log(array[routeIndex]);
        while (await checkRedundantLocation(array[routeIndex].locations, initName)) {
            initInt++;
            initName = `location ${initInt}`;
        }
        let lat = req.body.lat;
        let lng = req.body.lng;
        array[routeIndex].locations.push({ lat: lat, lng: lng, title: initName });
        await updateDoc(docRef, {
            created: array
        });
        res.send({name: initName})
    } else {
        res.send({message: 'Failure'})
    }
});

app.post('/deleteLocation', async (req, res) => {
    const docRef = doc(db, "Final-Project-Users", req.body.username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // retrieve the array of routes and identify index
        const data = docSnap.data();
        const array = data.created; 
        let routeIndex;
        let locationIndex;
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === req.body.routeName) { 
                routeIndex = i; 
            }
        }
        for (let i = 0; i < array[routeIndex].locations.length; i++) {
            if (array[routeIndex].locations[i].title === req.body.name) { 
                locationIndex = i; 
            }
        }
        array[routeIndex].locations.splice(locationIndex, 1);
        await updateDoc(docRef, {
            created: array
        });
        res.send({message: 'Success'})
    } else {
        res.send({message: 'Failure'})
    }
});

app.get('/mapApiKey', (req, res) => {
    res.send({key: mapApiKey});
});

app.get('/debugEmail', (req, res) => {
    res.send({email: debugEmail});
})

app.get('/allContent', async (req, res) => {
    const querySnapshot = await getDocs(collection(db, "Final-Project-Users"));
    let documents = [];
    querySnapshot.forEach((doc) => {
        documents.push(doc.data());
    });
    res.send(documents);
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  //printDebug();
});

async function printDebug(){
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === "debug") { 
                console.log(array[i]);
            }
        }
    } else {
        console.log("No such document!");
    }
}

async function checkRedundant(name){
    const docRef = doc(db, "Final-Project-Users", "parkvinnie@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const array = data.created; 
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === name) { 
                return true; 
            }
        }
    }
    return false; 
}

async function checkRedundantLocation(locationArray,name){
    for (let i = 0; i < locationArray.length; i++) {
        if (locationArray[i].title === name) { 
            return true; 
        }
    }
    return false; 
}
