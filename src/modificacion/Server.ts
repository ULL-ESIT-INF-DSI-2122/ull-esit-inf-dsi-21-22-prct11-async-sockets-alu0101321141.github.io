import * as net from 'net';
import chalk = require("chalk");
import { ResponseType } from "./TypesMessages/ResponseType";
import { spawn } from 'child_process';

net.createServer({ allowHalfOpen: true }, (connection) => {
  console.log(chalk.black.bgGreenBright('Cliente conectado.'));
  connection.on('error', (err) => {
    console.log(chalk.black.bgRedBright('Error Creación server:', err));
  });
  let content: string = '';
  connection.on('data', (data) => {
    content += data;
  });
  connection.on('end', () => {
    const message = JSON.parse(content);
    console.log(chalk.black.bgYellowBright('Mensaje recibido del cliente recibido'));
    if (message.type === 'comand') {
      console.log(chalk.black.bgYellowBright('Mensaje de tipo command recibido'));
      const processComand = spawn(message.nameComand, message.options);
      let resultComand = '';
      processComand.stdout.on('data', (data) => {
        resultComand += data;
      });
      processComand.on('error', (err) => {
        console.log(chalk.black.bgRedBright('Error:', err));
        const response: ResponseType = {
          type: 'response',
          success: false,
          data: resultComand,
        };
        connection.write(JSON.stringify(response) + '\n');
        connection.end();
      });
      processComand.on('close', () => {
        const response: ResponseType = {
          type: 'response',
          success: true,
          data: resultComand,
        };
        connection.write(JSON.stringify(response) + '\n');
        connection.end();
      });
      console.log(chalk.black.bgGreenBright('Cliente desconectado.'));
    } else {
      console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
    }
  });
}).listen(60300, () => {
  console.log(chalk.black.bgGreenBright('Servidor iniciado.'));
});
