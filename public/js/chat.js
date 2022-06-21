
const socket = io();

// server (emit) -> client (receive) --acknowledgement --> server

// client (emit) -> server (receive) --acknowledgement --> client

socket.on('message', (message) => {
  console.log(message);
})


document.querySelector('#messageForm').addEventListener("submit", (e) => {

  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return console.log(error)
    } else {
      console.log("Message delivered");
    }
  });
})

document.querySelector('#sendLocation').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      console.log('Location shared!')
    })
  })
})