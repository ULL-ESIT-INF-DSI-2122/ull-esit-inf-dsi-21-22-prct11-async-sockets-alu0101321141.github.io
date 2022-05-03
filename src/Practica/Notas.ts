import chalk = require("chalk");
import { NotasType } from "./TypesMessages/NotasType";

/**
 * Clase Notas.
 */
export class Notas {
  /**
   * Color de la nota
   */
  private color:string;
  /**
   * constructor de la clase.
   * @param title Titulo de la nota
   * @param body cuerpo de la nota
   * @param color Color de la nota
   */
  constructor(private title:string, private body:string, color:string) {
    this.color = this.checkColor(color);
  }

  /**
   * getter
   * @returns title
   */
  getTitle() {
    return this.title;
  }

  /**
   * getter
   * @returns body
   */
  getBody() {
    return this.body;
  }

  /**
   * getter
   * @returns Color
   */
  getColor() {
    return this.color;
  }

  /**
   * setter
   * @param newtitle nuevo titulo
   */
  setTitle(newtitle:string) {
    this.title = newtitle;
  }

  /**
   * setter
   * @param newBody nuevo cuerpo de nota
   */
  setBody(newBody:string) {
    this.body = newBody;
  }

  /**
   * setter
   * @param newColor nuevo color
   */
  setColor(newColor: string) {
    this.color = this.checkColor(newColor);
  }

  /**
   * NotasType.
   * @returns La nota pasada a formato de mensaje.
   */
  toNotasType():NotasType {
    const nota:NotasType = {
      title: `${this.title}`,
      body: `${this.body}`,
      color: `${this.color}`,
    };
    return nota;
  }

  /**
     * ToString.
     * @returns La nota pasada a string
     */
  toString() {
    let variable: string = '{';
    variable += `\n  "title" : "${this.title}", `;
    variable += `\n  "body" : "${this.body}",`;
    variable += `\n  "color" : "${this.color}"`;
    variable += '\n}';
    return variable;
  }

  /**
   * Se encarga de comprobar los colores válidos para las
   * notas (verde, rojo, amarillo y azul)
   * @param color color a comprobar
   * @returns retorna el color correcto
   */
  private checkColor(color:string):string {
    if (color == 'verde' || color == 'green') {
      return 'green';
    } else if (color == 'rojo' || color == 'red') {
      return 'red';
    } else if (color == 'azul' || color == 'blue') {
      return 'blue';
    } else if (color == 'amarillo' || color == 'yellow') {
      return 'yellow';
    } else {
      console.log(chalk.black.bgRedBright('Error: Color no valido para una nota.'));
      console.log(chalk.black.bgRedBright('Por defecto será color Amarillo.'));
      return 'yellow';
    }
  }
}
