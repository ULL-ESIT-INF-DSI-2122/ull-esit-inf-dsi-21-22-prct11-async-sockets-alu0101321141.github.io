import 'mocha';
import { expect } from 'chai';
import * as net from 'net';
import {Cliente} from '../src/modificacion/Client';
import { server } from '../src/modificacion/Server';


describe('Prueba modificacion', () => {
  it('Prueba del funcionamiento del cliente', () => {
    server;
    const socket = net.connect({ port: 60301 });
    const client = new Cliente(socket);
    let datos:string = '';
    client.getSocket().on('data', (data) => {
      datos += data;
    });
    client.getSocket().on('end', () => {
      const message = JSON.parse(datos);
      expect(message.type).to.equal('response');
      expect(message.success).to.equal(true);
      expect(message.data).to.equal('Hola mundo');
    });

    socket.emit('data', '{"type": "response", "success": true, "data": "Hola mundo"}\n');
  });
});
