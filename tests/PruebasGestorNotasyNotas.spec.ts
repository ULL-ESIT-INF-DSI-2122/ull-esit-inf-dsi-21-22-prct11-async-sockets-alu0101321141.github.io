import 'mocha';
import { expect } from 'chai';
import { Notas } from '../src/Practica/Notas';
import { GestorNotas } from '../src/Practica/GestorNotas';

describe('pruebas Notas', () => {
  it('Pruebas para el funcionamiento  la clase: ', () => {
    const nota = new Notas("Recordatorio", "Clase DSI", "Green");
    expect(nota).not.to.be.null;
  });
  it('Pruebas Getters', () => {
    const nota = new Notas("Recordatorio", "Clase DSI", "green");
    expect(nota.getTitle()).to.eq("Recordatorio");
    expect(nota.getBody()).to.eq("Clase DSI");
    expect(nota.getColor()).to.eq("green");
  });
  it('Prueba setters', () => {
    const nota = new Notas("Recordatorio", "Clase DSI", "Green");
    expect(nota.getColor()).to.eq("yellow");
    nota.setTitle("hola");
    expect(nota.getTitle()).to.eq("hola");
    nota.setBody("adios");
    expect(nota.getBody()).to.eq("adios");
    nota.setColor("verde");
    expect(nota.getColor()).to.eq("green");
    nota.setColor("rojo");
    expect(nota.getColor()).to.eq("red");
    nota.setColor("azul");
    expect(nota.getColor()).to.eq("blue");
    nota.setColor("amarillo");
    expect(nota.getColor()).to.eq("yellow");
    nota.setColor("morado");
    expect(nota.getColor()).to.eq("yellow");
  });
});

describe('pruebas Clase Gestor de Notas', () => {
  it('Pruebas para el funcionamiento constructor de la clase: ', () => {
    const gestor = new GestorNotas();
    expect(gestor).not.to.be.null;
  });
  it("Prueba para el funcionamiento de añadir una nota", () => {
    const gestor = new GestorNotas();
    const nota = new Notas("Recordatorio", "Clase DSI", "red");
    const nota2 = new Notas("Alarma", "Comprar la alarma", "azul");
    const nota3 = new Notas("Recado", "Ir a comprar aceite", "amarillo");
    expect(gestor.addNotes('Pablo', nota)).to.eql([true, "Se ha creado la nota satisfactoriamente"]);
    expect(gestor.addNotes('Pepe', nota)).to.eql([true, "Se ha creado la nota satisfactoriamente"]);
    expect(gestor.addNotes('Pablo', nota)).to.eql([false, "Error, la nota ya existe."]);
    expect(gestor.addNotes('Pablo', nota2)).to.eql([true, "Se ha creado la nota satisfactoriamente"]);
    expect(gestor.addNotes('Pablo', nota3)).to.eql([true, "Se ha creado la nota satisfactoriamente"]);
  });
  it("Prueba para el funcionamiento de modificar una nota", () => {
    const gestor = new GestorNotas();
    const nota = new Notas("Alarma", "Instalar la alarma", "azul");
    const nota1 = new Notas("Compra", "hacer la compra", "red");
    expect(gestor.modifyNote('Pablo', nota)).to.eql([true, "La nota se ha modificado satisfactoriamente"]);
    expect(gestor.modifyNote('Pablo', nota1)).to.eql([false, "La nota que desea modificar no existe"]);
    expect(gestor.modifyNote('Pepe', nota)).to.eql([false, "La nota que desea modificar no existe"]);
  });
  it("Prueba para el funcionamiento de eliminar una nota", () => {
    const gestor = new GestorNotas();
    expect(gestor.deleteNote('Pablo', "Recado")).to.eql([true, "La nota se ha eliminado correctamente"]);
    expect(gestor.deleteNote('Pepe', "Compra")).to.eql([false, "Error dicha nota no existe"]);
  });
  it("Prueba para el funcionamiento de listar los títulos de las notas", () => {
    const gestor = new GestorNotas();
    const nota = new Notas("Loteria", "Ir a comprar loteria", "amarillo");
    const nota1 = new Notas("Mensaje", "Enviar mensaje a pedro", "verde");
    const aux1 = {
      "color": "blue",
      "title": "Alarma",
    };
    const aux2 = {
      "color": "yellow",
      "title": "Loteria",
    };
    const aux3 = {
      "color": "green",
      "title": "Mensaje",
    };
    const aux4 = {
      "color": "red",
      "title": "Recordatorio",
    };
    gestor.addNotes('Pablo', nota);
    gestor.addNotes('Pablo', nota1);
    expect(gestor.listTitles('Pablo')).to.eql([true, "El usuario tiene notas.", [aux1, aux2, aux3, aux4]]);
    expect(gestor.listTitles('Pedro')).to.eql([false, "El usuario no existe", []]);
  });
  it("Prueba para el funcionamiento de listar los títulos de las notas", () => {
    const gestor = new GestorNotas();
    const aux1 = {
      "body": "Instalar la alarma",
      "color": "blue",
      "title": "Alarma",
    };
    expect(gestor.listNote('Pablo', "Alarma")).to.eql([true, "La nota se ha listado correctamente", [aux1]]);
    expect(gestor.listNote('Pepe', "Saludos")).to.eql([false, "El usuario no tiene ninguna nota con ese nombre", []]);
    expect(gestor.listNote('Pedro', "londres")).to.eql([false, "El usuario no existe", []]);
  });
});
