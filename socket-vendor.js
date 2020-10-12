'use strict';

/*
- Connect to caps hub socket and namespace
- Join a room for each unique store
- Emit a join event to caps namespace with payload (order info)
- set order interval to 5 seconds
  - generate payload within interval
    - storeName
    - ID
    - customer name
    - address
  - emit 'pickup' event to caps namespace
- Listen for 'delivered' event from caps hub
  - on listen, log 'thanks for ordering!!!!!'
*/

require('dotenv').config();
const faker = require('faker');

// global
const socket = require('socket.io-client')('http://localhost:3000');

// namespace
const capsNamespace = require('socket.io-client')('http://localhost:3000/caps-namespace');

capsNamespace.emit('join', process.env.STORE);

setInterval( () => {
  let payload = {
    store: process.env.STORE,
    orderID: faker.random.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
  };
  // socket.emit('pickup', payload);
  capsNamespace.emit('pickup', payload);
}, 5000);

capsNamespace.on('delivered', payload => {
  console.log(`${payload.store}: Thanks for delivering order # ${payload.orderID}`);
});