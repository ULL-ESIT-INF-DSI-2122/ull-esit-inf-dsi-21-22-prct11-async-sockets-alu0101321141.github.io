import {Notas} from './Notas';

import chalk = require("chalk");
import * as fs from 'fs';

/**
 * Clase Gestor de Notas.
 */
export class GestorNotas {
  /**
   * Constructor de la clase
   */
  constructor() {
  }

  /**
   * Crea una nota en la base de datos de la aplicación.
   * @param nameUser Nombre del usuario que crea la nota
   * @param Notes Nota a añadir
   * @returns Mensaje informativo
   */
  addNotes(nameUser:string, Notes:Notas):boolean {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Bienvenido de vuelta usuario', nameUser));
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      if (fs.existsSync(`${archiveRoute}`)) {
        console.log(chalk.black.bgRedBright('Error, la nota ya existe.'));
        return false;
      } else {
        fs.writeFileSync(`${archiveRoute}`, Notes.toString());
        console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
        return true;
      }
    } else {
      console.log(chalk.black.bgGreenBright("Usuario Nuevo, bienvenido ", nameUser));
      fs.mkdirSync(`${archiveRoute}`, {recursive: true});
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      fs.writeFileSync(`${archiveRoute}`, Notes.toString());
      console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
      return true;
    }
  }

  /**
   * Modifica una nota pre existebte;
   * @param nameUser Nombre del usuario
   * @param modifyNote Nota modificada
   * @returns mensaje informativo
   */
  modifyNote(nameUser:string, modifyNote:Notas) {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + modifyNote.getTitle() + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.writeFileSync(`${archiveRoute}`, modifyNote.toString());
      console.log(chalk.black.bgGreenBright('La nota se ha modificado satisfactoriamente'));
      return 'correcto';
    } else {
      console.log(chalk.black.bgRedBright('La nota que desea modificar no existe'));
      return 'error';
    }
  }

  /**
   * Elimina na nota dado su titulo.
   * @param nameUser Nombre del usuario
   * @param noteTilte Titulo de la nota a eliminar
   * @returns mensaje informativo
   */
  deleteNote(nameUser:string, noteTilte:string) {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + noteTilte + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.rmSync(`${archiveRoute}`);
      console.log(chalk.black.bgGreenBright('La nota se ha eliminado correctamente'));
      return 'correcto';
    } else {
      console.log(chalk.black.bgRedBright('Error dicha nota no existe'));
      return 'error';
    }
  }

  /**
   * Lista los títulos de los títulos
   * @param nameUser nombre del usuario
   * @returns mensaje informativo.
   */
  listTitles(nameUser:string):string {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Las notas con sus títulos son:'));
      archiveRoute += "/";
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      namefiles.forEach((fileName) => {
        const fileContent = fs.readFileSync( archiveRoute + fileName);
        const json = JSON.parse(fileContent.toString());
        this.printWithColor(json.color, json.title);
      });
      return 'correcto';
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return 'error';
    }
  }

  /**
   * listar una nota.
   * @param nameUser nombre del usuario
   * @param noteTilte titulo de la canción a utilizar
   * @returns mensaje informativo
   */
  listNote(nameUser:string, noteTilte:string) {
    noteTilte += ".json";
    let archiveRoute: string = './AppDataBase/' + nameUser;
    let flag:boolean = false;
    if (fs.existsSync(`${archiveRoute}`)) {
      archiveRoute += "/";
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      namefiles.forEach((fileName) => {
        if (noteTilte == fileName) {
          console.log(chalk.black.bgGreenBright('La nota es: '));
          const fileContent = fs.readFileSync(archiveRoute + fileName);
          const json = JSON.parse(fileContent.toString());
          this.printWithColor(json.color, json.title);
          this.printWithColor(json.color, json.body);
          this.printWithColor(json.color, json.color);
          flag = true;
        }
      });
      if (flag) {
        return 'correcto';
      } else {
        console.log(chalk.black.bgRedBright('El usuario no tiene ninguna nota con ese nombre'));
        return 'error';
      }
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return 'error';
    }
  }

  /**
   * Printa el texto con su color correspondiente.
   * @param color color
   * @param text texto
   */
  private printWithColor(color:string, text:string) {
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
