import { MessageEventEmitter } from "./MessageEventEmitter";
import { RequestType } from "./TypesMessages/RequestType";
import chalk = require("chalk");
import * as net from 'net';

/**
 * Clase que crea un cliente.
 */
export class Cliente {
  private message:MessageEventEmitter;
  /**
   * Constructor de la clase.
   * @param connection Socket de conexión.
   */
  constructor(private sokect:net.Socket) {
    this.message = new MessageEventEmitter(sokect);
  }

  enviarDatos(type:string, nameUser:string, title?:string, body?:string, color?:string) {
    if (type === 'add') {
      const request:RequestType = {
        type: 'add',
        nameUser: nameUser,
        title: title,
        body: body,
        color: color,
      };
      this.sokect.write(JSON.stringify(request) + '\n');
    } else {
      console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
    }
  }
  recibirDatos() {
    this.message.on('message', (message) => {
      if (message.type === 'add') {
        console.log(chalk.black.bgYellowBright('Respuesta de tipo add recibido'));
        if (message.success) {
          console.log(chalk.black.bgGreenBright('Nota añadida correctamente.'));
        } else {
          console.log(chalk.black.bgRedBright('Error al añadir la nota.'));
        }
      } else {
        console.log(chalk.black.bgRedBright('Error: El tipo de respuesta no es correcto.'));
      }
    });
  }
}

