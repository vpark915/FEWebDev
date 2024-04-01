var destinations = []; 
var locationSelector = document.getElementsByClassName('locationSelector');
locationSelector = locationSelector[0];
locationSelector.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        destinations.push(locationSelector.value);

        // Visually update HTML 
        var rankings = document.getElementsByClassName('rankings');
        rankings = rankings[0];
        var newItem = document.createElement('div');
        newItem.className = 'item';
        var newDestination = document.createElement('a');
        newDestination.href = '#';
        newDestination.style.color = "#191919";
        newDestination.textContent = locationSelector.value;
        newItem.appendChild(newDestination);
        rankings.appendChild(newItem);
    }
})
