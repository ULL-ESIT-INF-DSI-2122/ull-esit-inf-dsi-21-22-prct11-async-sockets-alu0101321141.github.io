import { RequestType } from "./TypesMessages/RequestType";
import chalk = require("chalk");
import * as net from 'net';


/**
 * Clase que crea un cliente.
 */
export class Cliente {
  /**
   * Constructor de la clase.
   * @param connection Socket de conexión.
   */
  constructor(private sokect: net.Socket) {
  }

  /**
   * getter
   * @returns {net.Socket}
   */
  getSocket() {
    return this.sokect;
  }
  /**
   * enviar datos
   * @param type tipo del dato a mandar
   * @param comand comando
   * @param options opciones del comando
   */
  enviarDatos(type: string, comand: string, options?:string[]) {
    if (type === 'comand') {
      const request: RequestType = {
        type: 'comand',
        nameComand: comand,
        options: options,
      };
      this.sokect.write(JSON.stringify(request) + '\n');
      this.sokect.end();
    } else {
      console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
    }
  }

  /**
   * recibir datos
   */
  recibirDatos() {
    let response:string = '';
    this.sokect.on('data', (data) => {
      response += data;
    });
    this.sokect.on('end', () => {
      const message = JSON.parse(response);
      console.log(chalk.black.bgGreenBright('Mensaje recibido delservidor recibido'));
      if (message.type === 'response' && message.success) {
        console.log(chalk.black.bgBlueBright('El resultado del comando es'));
        console.log(chalk.black.bgGreenBright(message.data));
      } else if (message.type === 'response' && !message.success) {
        console.log(chalk.black.bgRedBright('Error:'));
        console.log(chalk.black.bgRedBright(message.error));
      } else {
        console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
      }
    });
  }
}
