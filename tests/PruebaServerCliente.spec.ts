import 'mocha';
import { expect } from 'chai';
import * as net from 'net';
import { Cliente } from '../src/Practica/cliente';
import { Server } from '../src/Practica/Server';


describe('Prueba Cliente', () => {
  it('Prueba del funcionamiento del cliente', () => {
    const server = new Server(60300);
    server;
    const socket = net.connect({ port: 60300 });
    const client = new Cliente(60300);
    let datos:string = '';
    client.getSocket().on('data', (data) => {
      datos += data;
    });
    client.getSocket().on('end', () => {
      const message = JSON.parse(datos);
      expect(message.type).to.equal('add');
      expect(message.nameUser).to.equal('Juan');
      expect(message.title).to.equal('Nota 1');
      expect(message.body).to.equal('Nota 1');
      expect(message.color).to.equal('amarillo');
    });

    socket.emit('data', '{"type": "add", "nameUser": "Juan", "title": "Nota1", "body" : "Nota1", "color" : "amarillo }\n');
  });
});

describe('Prueba server', () => {
  it('Prueba del funcionamiento del server', () => {
    const server = new Server(60303);
    server;
    const socket = net.connect({ port: 60303 });
    let datos: string = '';
    server.getServer().on('data', (data) => {
      datos += data;
    });
    server.getServer().on('end', () => {
      const message = JSON.parse(datos);
      expect(message.type).to.equal('add');
      expect(message.nameUser).to.equal('Juan');
      expect(message.title).to.equal('Nota 1');
      expect(message.body).to.equal('Nota 1');
      expect(message.color).to.equal('amarillo');
    });

    socket.emit('data', '{"type": "add", "nameUser": "Juan", "title": "Nota1", "body" : "Nota1", "color" : "amarillo }\n');
  });
});
