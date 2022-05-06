import {Notas} from './Notas';

import chalk = require("chalk");
import * as fs from 'fs';
import { NotasType } from './TypesMessages/NotasType';

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
  addNotes(nameUser:string, Notes:Notas):[boolean, string] {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Bienvenido de vuelta usuario', nameUser));
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      if (fs.existsSync(`${archiveRoute}`)) {
        console.log(chalk.black.bgRedBright('Error, la nota ya existe.'));
        return [false, "Error, la nota ya existe."];
      } else {
        fs.writeFileSync(`${archiveRoute}`, Notes.toString());
        console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
        return [true, "Se ha creado la nota satisfactoriamente"];
      }
    } else {
      console.log(chalk.black.bgGreenBright("Usuario Nuevo, bienvenido ", nameUser));
      fs.mkdirSync(`${archiveRoute}`, {recursive: true});
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      fs.writeFileSync(`${archiveRoute}`, Notes.toString());
      console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
      return [true, "Se ha creado la nota satisfactoriamente"];
    }
  }

  /**
   * Modifica una nota pre existebte;
   * @param nameUser Nombre del usuario
   * @param modifyNote Nota modificada
   * @returns mensaje informativo
   */
  modifyNote(nameUser:string, modifyNote:Notas):[boolean, string] {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + modifyNote.getTitle() + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.writeFileSync(`${archiveRoute}`, modifyNote.toString());
      console.log(chalk.black.bgGreenBright('La nota se ha modificado satisfactoriamente'));
      return [true, "La nota se ha modificado satisfactoriamente"];
    } else {
      console.log(chalk.black.bgRedBright('La nota que desea modificar no existe'));
      return [false, "La nota que desea modificar no existe"];
    }
  }

  /**
   * Elimina na nota dado su titulo.
   * @param nameUser Nombre del usuario
   * @param noteTilte Titulo de la nota a eliminar
   * @returns mensaje informativo
   */
  deleteNote(nameUser:string, noteTilte:string):[boolean, string] {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + noteTilte + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.rmSync(`${archiveRoute}`);
      console.log(chalk.black.bgGreenBright('La nota se ha eliminado correctamente'));
      return [true, "La nota se ha eliminado correctamente"];
    } else {
      console.log(chalk.black.bgRedBright('Error dicha nota no existe'));
      return [false, "Error dicha nota no existe"];
    }
  }

  /**
   * Lista los títulos de los títulos
   * @param nameUser nombre del usuario
   * @returns mensaje informativo.
   */
  listTitles(nameUser: string): [boolean, string, NotasType[]] {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Las notas con sus títulos son:'));
      archiveRoute += "/";
      const nameFilesAndColors:NotasType[] = [];
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      namefiles.forEach((fileName) => {
        const fileContent = fs.readFileSync( archiveRoute + fileName);
        const json = JSON.parse(fileContent.toString());
        this.printWithColor(json.color, json.title);
        const nota:NotasType = {
          title: json.title,
          color: json.color,
        };
        nameFilesAndColors.push(nota);
      });
      return [true, "El usuario tiene notas.", nameFilesAndColors];
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return [false, "El usuario no existe", []];
    }
  }

  /**
   * listar una nota.
   * @param nameUser nombre del usuario
   * @param noteTilte titulo de la canción a utilizar
   * @returns mensaje informativo
   */
  listNote(nameUser: string, noteTilte: string): [boolean, string, NotasType[]] {
    noteTilte += ".json";
    let archiveRoute: string = './AppDataBase/' + nameUser;
    let flag:boolean = false;
    if (fs.existsSync(`${archiveRoute}`)) {
      archiveRoute += "/";
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      const notes:NotasType[] = [];
      namefiles.forEach((fileName) => {
        if (noteTilte == fileName) {
          console.log(chalk.black.bgGreenBright('La nota es: '));
          const fileContent = fs.readFileSync(archiveRoute + fileName);
          const json = JSON.parse(fileContent.toString());
          this.printWithColor(json.color, json.title);
          this.printWithColor(json.color, json.body);
          this.printWithColor(json.color, json.color);
          const nota: NotasType = {
            title: json.title,
            color: json.color,
            body: json.body,
          };
          notes.push(nota);
          flag = true;
        }
      });
      if (flag) {
        return [true, "La nota se ha listado correctamente", notes];
      } else {
        console.log(chalk.black.bgRedBright('El usuario no tiene ninguna nota con ese nombre'));
        return [false, "El usuario no tiene ninguna nota con ese nombre", []];
      }
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return [false, "El usuario no existe", []];
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
