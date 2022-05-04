import 'mocha';
import { expect } from 'chai';
import { EventEmitter } from 'events';
import { MessageEventEmitter } from '../src/Practica/MessageEventEmitter';

describe('Prueba clase MessageEventEmitter', () => {
  it('Debe emitir un evento de mensaje una vez que recibe un mensaje completo', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitter(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({ 'type': 'change', 'prev': 13, 'curr': 26 });
      done();
    });

    socket.emit('data', '{"type": "change", "prev": 13');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
  });
});

