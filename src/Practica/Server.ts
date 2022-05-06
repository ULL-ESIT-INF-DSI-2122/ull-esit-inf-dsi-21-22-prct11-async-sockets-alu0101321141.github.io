import * as net from 'net';
import chalk = require("chalk");
import { Notas } from "./Notas";
import { GestorNotas } from "./GestorNotas";
import { ResponseType } from "./TypesMessages/ResponseType";
import { NotasType } from './TypesMessages/NotasType';

/**
 * Clase servidor.
 */
export class Server {
  /**
   * Servidor.
   */
  private server: net.Server;
  /**
   * Constructor de la clase.
   */
  constructor(private port: number) {
    this.server = net.createServer({ allowHalfOpen: true }, (connection) => {
      connection.on('error', (err) => {
        console.log(chalk.black.bgRedBright('Error en la creación del servidor:', err));
      });
      connection.on('close', () => {
        console.log(chalk.black.bgWhiteBright('Servidor cerrado correctamente.'));
        console.log(chalk.black.bgWhiteBright('Esperando a nuevos usuarios.'));
      });
    }).listen(this.port, () => {
      console.log(chalk.black.bgGreenBright('Se ha iniciado el servidor.'));
    });
  }

  /**
   * Método que recibe las peticiones del cliente y las procesa.
   */
  onHold() {
    this.server.on('connection', (connection) => {
      console.log(chalk.black.bgGreenBright('Cliente conectado.'));

      let Datos: string = '';
      // Obtenermos los datos que nos envíe el cliente.
      connection.on('data', (data) => {
        Datos += data;
      });

      connection.on('end', () => {
        // Parseamos los datos que nos envió el cliente.
        const message = JSON.parse(Datos);
        console.log(chalk.black.bgGreenBright(' -> Mensaje del cliente recibido'));
        switch (message.type) {
          case 'add':
            this.addPetitions(message, connection);
            break;
          case 'update':
            this.updatePetitions(message, connection);
            break;
          case 'remove':
            this.removePetitions(message, connection);
            break;
          case 'read':
            this.readPetitions(message, connection);
            break;
          case 'list':
            this.listPetitions(message, connection);
            break;
          default:
            console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
            break;
        }
      });
    });
  }

  /**
   * Procesa las peticiones add.
   * @param message mensaje parseado
   * @param connection conexión establecida (Socket)
   */
  private addPetitions(message:any, connection:net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo add recibido'));
    const gestorNotas = new GestorNotas();
    const nota = new Notas(message.title, message.body, message.color);
    const resultado: [boolean, string] = gestorNotas.addNotes(message.nameUser, nota);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'add',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'add',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }

  /**
   * Procesa las peticiones update.
   * @param message mensaje parseado
   * @param connection conexión establecida (Socket)
   */
  private updatePetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo update recibido'));
    const gestorNotas = new GestorNotas();
    const nota = new Notas(message.title, message.body, message.color);
    const resultado: [boolean, string] = gestorNotas.modifyNote(message.nameUser, nota);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'update',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'update',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }

  /**
   * Procesa las peticiones remove.
   * @param message mensaje parseado
   * @param connection conexión establecida (Socket)
   */
  private removePetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo remove recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string] = gestorNotas.deleteNote(message.nameUser, message.title);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'remove',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'remove',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }

  /**
     * Procesa las peticiones read.
     * @param message mensaje parseado
     * @param connection conexión establecida (Socket)
     */
  private readPetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo read recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string, NotasType[]] = gestorNotas.listNote(message.nameUser, message.title);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'read',
        success: true,
        notes: resultado[2],
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'read',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
  /**
   * Procesa las peticiones list.
   * @param message mensaje parseado
   * @param connection conexión establecida (Socket)
   */
  private listPetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo update recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string, NotasType[]] = gestorNotas.listTitles(message.nameUser);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'list',
        success: true,
        notes: resultado[2],
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'list',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
}
