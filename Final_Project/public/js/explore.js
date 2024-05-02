function generateNewList(parent, title){
    let div = document.createElement('div');
    div.className = 'content';

    let imgLink = document.createElement('a');
    imgLink.href = '#';
    let img = document.createElement('img');
    img.src = './img/PlaceholderMap.PNG';
    img.alt = 'placeholder for map';
    imgLink.appendChild(img);
    img.addEventListener('click', function(){
        window.open('create.html?redirectRoute=' + encodeURIComponent(title));
    })

    let descDiv = document.createElement('div');
    descDiv.className = 'description';
    let pfpLink = document.createElement('a');
    pfpLink.href = '#';
    pfpLink.className = 'pfp';
    let pfpImg = document.createElement('img');
    pfpImg.src = './img/pfp.jpg';
    pfpImg.alt = 'placeholder profile picture';
    pfpLink.appendChild(pfpImg);
    let usernameLink = document.createElement('a');
    usernameLink.href = '#';
    usernameLink.className = 'username';
    usernameLink.textContent = 'idiot';
    let p = document.createElement('p');
    p.textContent = 'Time: 3 days Length: 100 miles Difficulty: Hard';
    descDiv.append(pfpLink, usernameLink, p);

    let titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    let titleP = document.createElement('p');
    titleP.textContent = title;
    let likesDiv = document.createElement('div');
    likesDiv.className = 'likes';
    likesDiv.textContent = '400👍';
    titleDiv.append(titleP, likesDiv);

    div.append(imgLink, descDiv, titleDiv);
    parent.appendChild(div);
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/allContent', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach((account) => {
            account.created.forEach((route) => {
                let newUploads = document.getElementById('newUploads');
                let popularUploads = document.getElementById('popularUploads');
                generateNewList(newUploads, route.name);
                generateNewList(popularUploads, route.name);
            })
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});