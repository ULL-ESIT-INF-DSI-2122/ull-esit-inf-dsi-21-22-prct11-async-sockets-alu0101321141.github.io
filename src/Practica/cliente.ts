import { RequestType } from "./TypesMessages/RequestType";
import chalk = require("chalk");
import * as net from 'net';
import { NotasType } from './TypesMessages/NotasType';

/**
 * Clase que crea un cliente.
 */
export class Cliente {
  /**
   * Socket de conexión
   */
  private socket:net.Socket;
  /**
   * Constructor de la clase
   * @param port puerto del servidor
   */
  constructor(private port:number) {
    this.socket = net.connect({ port: this.port });
  }

  /**
   * getter
   * @returns socket
   */
  getSocket():net.Socket {
    return this.socket;
  }

  /**
   * Envia la peticion al servidor.
   * @param type tipo de mensaje
   * @param nameUser nombre del usuario
   * @param title titulo de la nota
   * @param body cuerpo de la nota
   * @param color color de la nota
   */
  sendPetitions(type:string, nameUser:string, title?:string, body?:string, color?:string) {
    switch (type) {
      case 'add':
        this.addPetition(nameUser, title!, body!, color!);
        break;
      case 'update':
        this.updatePetition(nameUser, title!, body!, color!);
        break;
      case 'remove':
        this.removePetition(nameUser, title!);
        break;
      case 'read':
        this.readPetition(nameUser, title!);
        break;
      case 'list':
        this.listPetition(nameUser);
        break;
      default:
        console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
        break;
    }
  }
  /**
   * Procesa la respuesta del servidor.
   */
  receivePetition() {
    // obtenemos la respuesta del servidor.
    let response:string = '';
    this.socket.on('data', (data) => {
      response += data;
    });
    this.socket.on('end', () => {
      const message = JSON.parse(response);
      console.log(chalk.black.bgGreenBright('Mensaje del servidor recibido'));
      switch (message.type) {
        case 'add':
          this.addResponse(message);
          break;
        case 'update':
          this.updateResponse(message);
          break;
        case 'remove':
          this.removeResponse(message);
          break;
        case 'read':
          this.readResponse(message);
          break;
        case 'list':
          this.listResponse(message);
          break;
        default:
          console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
          break;
      }
    });
  }
  /**
   * Crea la petición add
   * @param nameUser nombre del usuario
   * @param title titulo de la nota
   * @param body cuerpo de la nota
   * @param color color de la nota
   */
  private addPetition(nameUser: string, title: string, body : string, color : string) {
    const request: RequestType = {
      type: 'add',
      nameUser: nameUser,
      title: title,
      body: body,
      color: color,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }
  /**
   * Procesa la respuesta add
   * @param message mensaje recibido del servidor
   */
  private addResponse(message:any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo add recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Nota añadida correctamente.'));
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al crear la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }
  /**
   * Crea la petición update
   * @param nameUser nombre del usuario
   * @param title titulo de la nota
   * @param body cuerpo de la nota
   * @param color color de la nota
   */
  private updatePetition(nameUser: string, title: string, body: string, color: string) {
    const request: RequestType = {
      type: 'update',
      nameUser: nameUser,
      title: title,
      body: body,
      color: color,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }
  /**
   * Procesa la respuesta update
   * @param message mensaje recibido del servidor
   */
  private updateResponse(message: any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo update recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Nota modificada correctamente.'));
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al modificar la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }
  /**
   * Crea peticion remove
   * @param nameUser nombre del usuario
   * @param title titulo de la nota
   */
  private removePetition(nameUser: string, title: string){
    const request: RequestType = {
      type: 'remove',
      nameUser: nameUser,
      title: title,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }
  /**
   * Procesa la respuesta remove
   * @param message mensaje recibido del servidor
   */
  private removeResponse(message: any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo remove recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Nota se ha eliminado correctamente.'));
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al eliminar la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }

  /**
   * Crea peticion read
   * @param nameUser nombre del usuario
   */
  private readPetition(nameUser: string, title: string) {
    const request: RequestType = {
      type: 'read',
      nameUser: nameUser,
      title: title,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }

  /**
   * Procesa la respuesta read
   * @param message mensaje recibido del servidor
   */
  private readResponse(message: any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo read recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Se ha obtenido el contenido de la nota.'));
      message.notes.forEach((nota: NotasType) => {
        this.printWithColor(nota.color, nota.title);
        this.printWithColor(nota.color, nota.body!);
        this.printWithColor(nota.color, nota.color);
      });
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al leer la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }

  /**
   * Crea peticion list
   * @param nameUser nombre del usuario
   */
  private listPetition(nameUser: string) {
    const request: RequestType = {
      type: 'list',
      nameUser: nameUser,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }

  /**
   * Procesa la respuesta list
   * @param message mensaje recibido del servidor
   */
  private listResponse(message: any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo list recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Se ha obtenido la lista de notas. Las notas son:'));
      message.notes.forEach( (nota:NotasType) => {
        this.printWithColor(nota.color, nota.title);
      });
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al listar la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }

  /**
   * Printa el texto con su color correspondiente.
   * @param color color
   * @param text texto
   */
  private printWithColor(color: string, text: string) {
    if (color == 'verde' || color == 'green') {
      console.log(chalk.black.bgGreenBright(text));
    } else if (color == 'rojo' || color == 'red') {
      console.log(chalk.black.bgRedBright(text));
    } else if (color == 'azul' || color == 'blue') {
      console.log(chalk.black.bgBlueBright(text));
    } else if (color == 'amarillo' || color == 'yellow') {
      console.log(chalk.black.bgYellowBright(text));
    }
  }
}

