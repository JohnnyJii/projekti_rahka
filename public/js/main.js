'use strict';

let originalData = null;
let map = null;
let marker = null;
// read userID from cookie
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);

document.querySelector('#reset-button').addEventListener('click', () => {
  update(originalData);
});

document.querySelector('.modal button').addEventListener('click', (evt) => {
  evt.target.parentNode.classList.add('hidden');
});

const createArticle = (image, title, texts, id, user) => {
  console.log('user', user);
  let text = '';
  for (let t of texts) {
    text += `<p>${t}</p>`;
  }

  let html = `<img src="${image}" alt="${title}">
                <h3 class="card-title">${title}</h3>
                <p>${text}</p>
                <p><button>View</button>`;
  if (user == userID) {
    console.log('match');
    html += `<button>Modify</button>
    <button onclick="deleteImage(${id})">Delete</button></p>`;
  }

  return html;
};

const categoryButtons = (items) => {
  items = removeDuplicates(items, 'category');
  console.log(items);
  document.querySelector('#categories').innerHTML = '';
  for (let item of items) {
    const button = document.createElement('button');
    button.class = 'btn btn-secondary';
    button.innerText = item.category;
    document.querySelector('#categories').appendChild(button);
    button.addEventListener('click', () => {
      sortItems(originalData, item.category);
    });
  }
};

const sortItems = (items, rule) => {
  const newItems = items.filter(item => item.category === rule);
  // console.log(newItems);
  update(newItems);
};

const getData = () => {
  fetch('./images').then(response => {
    return response.json();
  }).then(items => {
    originalData = items;
    update(items);
  });

};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

const update = (items) => {
  categoryButtons(items);
  document.querySelector('main').innerHTML = '';
  for (let item of items) {
    // console.log(item);
    const article = document.createElement('article');
    const time = moment(item.time);
    article.innerHTML = createArticle(item.thumbnail, item.title, [
      '<small>' + time.format('dddd, MMMM Do YYYY, HH:mm') + '</small>',
      item.details], item.mID, item.userID);
    // open modal
    article.querySelector('button').addEventListener('click', () => {
      document.querySelector('.modal').classList.remove('hidden');
      document.querySelector('.modal img').src = item.image;
      document.querySelector('.modal h4').innerHTML = item.title;
      // set marker to map
      resetMap(item);
      // fix map resize problem
      document.querySelector('#map').addEventListener('transitionend', () => {
        map.invalidateSize();
      });
    });
    // select image to modify form
    try {
      article.querySelector('button:nth-of-type(2)').
          addEventListener('click', () => {
            console.log(item);
            fillUpdate(item);
          });
    } catch (e) {

    }

    document.querySelector('main').appendChild(article);
  }
};

const initMap = () => {
  map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  getData();
};

const resetMap = (item) => {
  try {
    map.removeLayer(marker);
  } catch (e) {

  }
  const coords = JSON.parse(item.coordinates);
  console.log(coords);
  map.panTo([coords.lat, coords.lng]);
  marker = L.marker([coords.lat, coords.lng]).addTo(map);
  map.invalidateSize();
};

// insert and update image
const frm = document.querySelector('#mediaform');
const updatefrm = document.querySelector('#updateform');

const fillUpdate = (image) => {
  console.log(image);
  updatefrm.scrollIntoView();
  document.querySelector('#updateform input[name=mID]').value = image.mID;
  document.querySelector(
      '#updateform input[name=category]').value = image.category;
  document.querySelector('#updateform input[name=title]').value = image.title;
  document.querySelector(
      '#updateform textarea[name=details]').value = image.details;
  document.querySelector('#updateform button').removeAttribute('disabled');
};

const sendForm = (evt) => {
  evt.preventDefault();
  const fd = new FormData(frm);
  const settings = {
    method: 'post',
    body: fd,
  };

  fetch('./upload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    // update list
    getData();
  });
};

const sendUpdate = (evt) => {
  evt.preventDefault();
  // get data from updatefrm and put it to body
  const data = JSON.stringify([
    updatefrm.querySelector('input[name="category"]').value,
    updatefrm.querySelector('input[name="title"]').value,
    updatefrm.querySelector('textarea[name="details"]').value,
    updatefrm.querySelector('input[name="mID"]').value,
  ]);
  const settings = {
    method: 'PATCH',
    body: data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  // app.patch('/images'.... needs to be implemented to index.js (remember body-parser)
  fetch('./images', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    updatefrm.reset();
    document.querySelector('#updateform button').
        setAttribute('disabled', 'disabled');
    // update list
    getData();
  });
};

frm.addEventListener('submit', sendForm);
updatefrm.addEventListener('submit', sendUpdate);

// delete
const deleteImage = (id) => {
  const settings = {
    method: 'DELETE',
  };
  fetch('./images/' + id, settings).then(response => {
    return response.json();
  }).then(json => {
    console.log(json);
    // update list
    getData();
  });
};

initMap();