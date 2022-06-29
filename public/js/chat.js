const socket = io();

// server (emit) -> client (receive) --acknowledgement --> server

// client (emit) -> server (receive) --acknowledgement --> client

// Elements 
const messageForm = document.querySelector('#messageForm');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

 const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

// const options = location.search.split("=");
// const username = options[1].split("&")[0];
// const room = options[2];

socket.on('message', (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplate, 
    {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a")

  })

  $messages.insertAdjacentHTML('beforeend', html);
    
})

socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm a"),
    url: message.url
  })
  $messages.insertAdjacentHTML('beforeend', html);
})

messageForm.addEventListener("submit", (e) => {

  e.preventDefault();

  messageForm.setAttribute('disabled', 'disabled');
  
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {

    messageForm.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    if (error) {
      return console.log(error)
    } else {
      console.log("Message delivered");
    }
  });
})

sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    
    sendLocationButton.removeAttribute('disabled');

    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      console.log('Location shared!')
    })
  })
})

socket.emit('join', {username, room}, (error) => {

  if (error) {
  alert(error)
  location.href= '/'
}
})