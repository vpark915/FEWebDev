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
    retrieveAllLocations(currentEmail,currentRoute);
} else {
    console.log('No redirectRoute parameter in the URL');
}

// Client functions  
function initMap() {
    // Create new map 
    map = new google.maps.Map(document.getElementById('creationWindow'), {
        center: { lat: -34.397, lng: 150.644 }, 
        zoom: 8                                  
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
        addLocation(lat,lng,currentEmail,currentRoute);
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
        retrieveAllLocations(currentEmail,currentRoute);
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

    // Add event listeners for route buttons 
    newSpan.addEventListener('click', function() {
        originalRouteName = newSpan.innerText;
        newInput.style.display = 'block';  
        newInput.value = newSpan.innerText;  
        newSpan.style.display = 'none';       
        newInput.focus();                 
    });

    newInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            newSpan.innerText = newInput.value; 
            newSpan.style.display = 'block';     
            newInput.style.display = 'none';  
            renameRoute(originalRouteName, newInput.value);
        }
    });

    newInput.addEventListener('blur', function() {
        newSpan.style.display = 'block';      
        newInput.style.display = 'none';    
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
        console.log(removeItem);
        console.log(removeItem.parentNode);
        console.log(removeItem.parentNode.firstElementChild);
        console.log(removeItem.parentNode.children[1].innerText);
        deleteLocation(removeItem.parentNode.children[1].innerText,currentEmail);
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

    // Create event listeners
    nameItem.addEventListener('click', function() {
        originalLocationName = nameItem.innerText;
        input.style.display = 'block'; 
        input.value = nameItem.innerText;  
        nameItem.style.display = 'none';     
        input.focus();              
    });

    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            nameItem.innerText = input.value; 
            nameItem.style.display = 'block';     
            input.style.display = 'none';  
            renameLocation(originalLocationName, input.value, currentEmail);
        }
    });

    input.addEventListener('blur', function() {
        nameItem.style.display = 'block';       
        input.style.display = 'none';   
        renameLocation(originalLocationName, input.value, currentEmail);
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
            name: name,
            username: currentEmail
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
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: currentEmail
        })
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
            updatedName: updatedName,
            username: currentEmail
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
            name:name,
            username:currentEmail
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

