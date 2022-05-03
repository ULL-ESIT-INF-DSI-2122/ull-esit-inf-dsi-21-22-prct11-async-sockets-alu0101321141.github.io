import * as net from 'net';
import chalk = require("chalk");
import { MessageEventEmitter } from "./MessageEventEmitter";
import {Notas} from "./Notas";
import {GestorNotas} from "./GestorNotas";
import {ResponseType} from "./TypesMessages/ResponseType";

net.createServer((connection) => {
  const message = new MessageEventEmitter(connection);
  console.log(chalk.black.bgGreenBright('Cliente conectado.'));
  connection.on('error', (err) => {
    console.log(chalk.black.bgRedBright('Error Creación server:', err));
  });
  message.on('message', (message) => {
    console.log(chalk.black.bgYellowBright('Mensaje del cliente recibido'));
    if (message.type === 'add') {
      console.log(chalk.black.bgYellowBright('Mensaje de tipo add recibido'));
      const gestorNotas = new GestorNotas();
      const nota = new Notas(message.title, message.body, message.color);
      const resultado:boolean = gestorNotas.addNotes(message.nameUser, nota);
      if (resultado) {
        const response:ResponseType = {
          type: 'add',
          success: true,
          color: message.color,
        };
        connection.write(JSON.stringify(response) + '\n');
      } else {
        const response:ResponseType = {
          type: 'add',
          success: false,
          color: message.color,
        };
        connection.write(JSON.stringify(response) + '\n');
      }
      connection.end();
    }
  });
  connection.on('end', () => {
    console.log(chalk.black.bgGreenBright('Cliente desconectado.'));
  });
}).listen(60300, () => {
  console.log(chalk.black.bgGreenBright('Servidor iniciado.'));
});
