import * as mongoose from "mongoose";
import * as express from "express";

import {routes} from "./routes/index";

/**
 * Clase server
 */
export class Server {
  /**
   * atributo app que guarda la aplicación express
   */
  private app: express.Application;
  /**
   * Constructor de la clase server
   * @param port puerto en el que se quiere inicializar el server
   */
  constructor(private readonly port: number) {
    this.app = express();
    this.initApp();
    this.connectMongoDB();
  }

  /**
   * Método que inicializa la aplicación
   */
  public initApp() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(routes);
  };

  /**
   * Método que conecta a la base de datos
   */
  public connectMongoDB() {
    const mongodb: string = "mongodb://localhost:27017/dsi-assessment";

    const options = {
      autoIndex: true,
      useNewUrlParser: true,
    };
    mongoose
        .connect(mongodb, options)
        .then((_) => console.log("Se ha podido conectar a la base de datos"))
        .catch((_) => console.error("Error al conectar en la base de datos"));
  };

  /**
   * Método que pone a escuchar el server al puerto.
   */
  public listen () {
    this.app.listen(this.port, () => {
      console.log("El servidor escucha el puerto : " + this.port);
    });
  };
}
