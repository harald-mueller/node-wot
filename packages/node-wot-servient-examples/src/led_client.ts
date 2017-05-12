'use strict'

import Servient from '../../servient';
import HttpClientFactory from '../../protocols/http/http-client-factory';

let serv = new Servient();
serv.addClientFactory(new HttpClientFactory())
let WoT = serv.start();
let bright = 0;

WoT.consumeDescriptionUri('http://192.168.0.23:8080/unicorn').then(thing => {
  setInterval(() => {
    bright += 10;
    if (bright >= 255) bright = 0;
    thing.setProperty('brightness', bright)
  }, 1000)
})
