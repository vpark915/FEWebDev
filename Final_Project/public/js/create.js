var currentRoute; 
var map;
var originalRouteName; 
var originalLocationName;
var currentEmail; 
var currentApiKey;
var markers = []; 
var locationSelector = document.getElementById('locationSelector');

let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('redirectRoute')) {
    let redirectRoute = urlParams.get('redirectRoute');
    currentRoute = redirectRoute;
    retrieveAllLocations("parkvinnie@gmail.com",currentRoute);
} else {
    console.log('No redirectRoute parameter in the URL');
}

// Client functions  
function initMap() {
    map = new google.maps.Map(document.getElementById('creationWindow'), {
        center: { lat: -34.397, lng: 150.644 },  // Coordinates of initial map center
        zoom: 8                                  // Initial zoom level
    });
    map.addListener('click', function(mapsMouseEvent) {
        var latLng = mapsMouseEvent.latLng;
        var lat = latLng.lat();
        var lng = latLng.lng();

        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        var infoWindow = new google.maps.InfoWindow({
            content: '<p>Latitude: ' + lat + '<br>Longitude: ' + lng + '</p>'
        });

        infoWindow.setPosition(latLng);
        infoWindow.open(map);
        addLocation(lat,lng,"parkvinnie@gmail.com",currentRoute);
    });
}

function addNewMarker(lat,lng,map,title) {
    let marker = new google.maps.Marker({
        position: {lat,lng},
        map: map,
        title:title
    });
    marker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: `<p>${title} Latitude: ` + lat + '<br>Longitude: ' + lng + '</p>'
        });
        infoWindow.setPosition({lat:lat,lng:lng});
        infoWindow.open(map);
    });
    markers.push(marker);
}

function createRouteButton(name){
    let newRoute = document.createElement('div');
    let newSpan = document.createElement('span');
    let newInput = document.createElement('input');
    let newTrash = document.createElement('a');

    newRoute.className = 'route';
    newSpan.className = 'routeItem';
    newSpan.textContent = name;
    newInput.type = 'text';
    newInput.className = 'editRouteTitle';
    newInput.style.display = 'none';
    newTrash.href = '#';
    newTrash.className = 'removeRoute';
    newTrash.textContent = '🗑️';

    newRoute.appendChild(newSpan);
    newRoute.appendChild(newInput);
    newRoute.appendChild(newTrash);

    newTrash.addEventListener('click', function(){
        console.log(newTrash.parentNode.firstChild.innerText);
        deleteRoute(newTrash.parentNode.firstChild.innerText);
        newTrash.parentNode.remove();
    })

    newRoute.addEventListener('click', function(){
        currentRoute = newSpan.innerText;
        console.log(currentRoute);
        retrieveAllLocations("parkvinnie@gmail.com",currentRoute);
        let rankingsElements = document.getElementsByClassName('rankings');
        for (let i = 0; i < rankingsElements.length; i++) {
            rankingsElements[i].innerHTML = '';
        }
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    })

    let routeRankings = document.getElementById('routeRankings');

    routeRankings.appendChild(newRoute);

    // Event listener for clicking on the span
    newSpan.addEventListener('click', function() {
        originalRouteName = newSpan.innerText;
        newInput.style.display = 'block';  // Show input
        newInput.value = newSpan.innerText;  // Set input value to span's text
        newSpan.style.display = 'none';       // Hide span
        newInput.focus();                  // Focus on the input field
    });

    // Event listener for pressing 'Enter' in the input
    newInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            newSpan.innerText = newInput.value; // Update span text
            newSpan.style.display = 'block';     // Show span
            newInput.style.display = 'none';  // Hide input
            renameRoute(originalRouteName, newInput.value);
        }
    });

    // Optional: Event listener for input losing focus
    newInput.addEventListener('blur', function() {
        newSpan.style.display = 'block';       // Show span
        newInput.style.display = 'none';    // Hide input
        renameRoute(originalRouteName, newInput.value);
    });
}

function createLocationButton(name){
    var newLocation = document.createElement('div');
    newLocation.className = 'item';
    var nameItem = document.createElement('a');
    nameItem.href = '#';
    nameItem.style.color = '#191919';
    nameItem.className = 'nameItem';
    nameItem.textContent = name;

    var removeItem = document.createElement('a');
    removeItem.href = '#';
    removeItem.className = 'removeItem';
    removeItem.textContent = '🗑️';
    removeItem.addEventListener('click', function(){
        console.log(removeItem.parentNode.firstChild.innerText);
        deleteLocation(removeItem.parentNode.firstChild.innerText,"parkvinnie@gmail.com");
        removeItem.parentNode.remove();
    })

    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'editTitle';
    input.style.display = 'none';

    newLocation.appendChild(input);
    newLocation.appendChild(nameItem);
    newLocation.appendChild(removeItem);

    var rankings = document.querySelector('.rankings');
    rankings.appendChild(newLocation);

    // Event listener for clicking on the span
    nameItem.addEventListener('click', function() {
        originalLocationName = nameItem.innerText;
        input.style.display = 'block';  // Show input
        input.value = nameItem.innerText;  // Set input value to span's text
        nameItem.style.display = 'none';       // Hide span
        input.focus();                  // Focus on the input field
    });

    // Event listener for pressing 'Enter' in the input
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            nameItem.innerText = input.value; // Update span text
            nameItem.style.display = 'block';     // Show span
            input.style.display = 'none';  // Hide input
            renameLocation(originalLocationName, input.value, "parkvinnie@gmail.com");
        }
    });

    // Optional: Event listener for input losing focus
    input.addEventListener('blur', function() {
        nameItem.style.display = 'block';       // Show span
        input.style.display = 'none';    // Hide input
        renameLocation(originalLocationName, input.value, "parkvinnie@gmail.com");
    });
}

function createAddButton(){
    const routeAdd = document.getElementById('addRoute');
    routeAdd.addEventListener('click', function(){
        addRoute();
    })
}

// Backend functions 
// Route Functions 
function retrieveAllRoutes(username){
    fetch('http://localhost:3000/allRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username
        })
    })
    .then(response => response.json())
    .then(data => {
        data.routes.forEach(function(route){
            createRouteButton(route.name);
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function retrieveRoute(name){
    fetch('http://localhost:3000/getRoute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addRoute(){
    fetch('http://localhost:3000/addRoute', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        createRouteButton(data.name);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function renameRoute(originalName, updatedName){
    fetch('http://localhost:3000/renameRoute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            originalName: originalName,
            updatedName: updatedName
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteRoute(name){
    fetch('http://localhost:3000/deleteRoute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name:name
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Location Functions
function retrieveAllLocations(username, routeName){
    fetch('http://localhost:3000/allLocations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            routeName: routeName
        })
    })
    .then(response => response.json())
    .then(data => {
        data.locations.forEach(function(location){
            createLocationButton(location.title);
            addNewMarker(location.lat,location.lng,map,location.title);
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function renameLocation(originalName, updatedName, username){
    fetch('http://localhost:3000/renameLocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            originalName: originalName,
            updatedName: updatedName,
            username:username,
            routeName: currentRoute
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addLocation(lat, lng, username, routeName){
    fetch('http://localhost:3000/addLocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lat: lat,
            lng: lng,
            username:username,
            routeName:routeName
        })
    })
    .then(response => response.json())
    .then(data => {
        createLocationButton(data.name);
        addNewMarker(lat,lng,map,data.name);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteLocation(name,username){
    fetch('http://localhost:3000/deleteLocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name:name,
            routeName:currentRoute,
            username:username
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function retrieveEmail(){
    fetch('http://localhost:3000/debugEmail', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.email);
        currentEmail = data.email;
        retrieveAllRoutes(currentEmail);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function retrieveMapApiKey(){
    fetch('http://localhost:3000/mapApiKey', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.key);
        currentApiKey = data.key;
        let script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${currentApiKey}&callback=initMap&libraries=&v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
retrieveEmail();
retrieveMapApiKey();
document.addEventListener('DOMContentLoaded', function() {
    createAddButton();
});

