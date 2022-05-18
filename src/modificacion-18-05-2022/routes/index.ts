import { Router } from "express";
import athleteRoutes from "./athlete";

/**
 * Clase Rutas
 */
export class Routes {
  /**
   * Rutas
   */
  public router: Router;
  /**
   * Constructor de la clase
   */
  constructor() {
    this.router = Router();
    this.setRouters();
  }

  /**
   * Hace un set de la clase ruta.
   */
  public setRouters() {
    this.router.use(athleteRoutes);
  };
}

const route = new Routes();

export const  routes =  route.router;

