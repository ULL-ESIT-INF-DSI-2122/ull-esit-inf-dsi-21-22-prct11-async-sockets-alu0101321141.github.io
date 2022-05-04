import { Cliente } from './Client';
import * as net from 'net';

const cliente = new Cliente(net.connect({ port: 60300 }));


const readComand: string = process.argv[2];
let comandosOpcional: string[] = [];
if (process.argv.length > 2) {
  for (let i = 3; i < process.argv.length; i++) {
    comandosOpcional.push(process.argv[i]);
  }
}

cliente.enviarDatos('comand', readComand, comandosOpcional);
cliente.recibirDatos();
