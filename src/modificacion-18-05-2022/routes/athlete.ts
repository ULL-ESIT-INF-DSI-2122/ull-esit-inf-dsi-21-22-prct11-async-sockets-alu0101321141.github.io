import { Request, Response, Router } from "express";
import { Athlete } from "../models/athlete";

/**
 * Clase Athleta
 */
class AthleteRoutes {
  /**
   * Rutas
   */
  public router: Router;

  /**
   * Constructor de la clase
   */
  constructor() {
    this.router = Router();
    this.routes();
  }

  /**
   * Crea el atleta
   * @param req 
   * @param res 
   */
  public postAthlete(req: Request, res: Response) {
    const newAthlete = new Athlete({
      name: req.body.name,
      surname: req.body.surname,
      NIF: req.body.nif,
      age: req.body.age,
      sport: req.body.sport,
      expertProof: req.body.expertProof,
      bestTime: req.body.bestTime,
    })

    newAthlete
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Busca un atleta por su NIF y id
   * @param req 
   * @param res 
   */
  public getAthlete(req: Request, res: Response) {
    let filter = {};
    if (req.query.nif && req.query.id) {
      filter = { _id: req.query.id.toString() , nif: req.query.nif.toString() };
    } else if (req.query.nif) {
      filter = { nif: req.query.nif.toString() };
    } else if (req.query.id) {
      filter = { _id: req.query.id.toString() };
    } else {
      filter = {};
    }

    Athlete.find(filter)
      .then(async (result) => {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "El athleta no se ha encontrado" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Actualiza el Atleta
   * @param req 
   * @param res 
   */
  public putAthlete (req: Request, res: Response) {
    Athlete.findOneAndUpdate({ NIF: req.body.NIF }, req.body, { new: true })
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "El athleta no se ha encontrado" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Elimina el athleta por su nif
   * @param req 
   * @param res 
   */
  public deleteAthlete(req: Request, res: Response) {
    Athlete.findOneAndDelete({ nif: req.body.nif })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Rutas aceptadas.
   */
  public routes() {
    this.router.get("/athlete", this.getAthlete);
    this.router.post("/athlete", this.postAthlete);
    this.router.put("/athlete", this.putAthlete);
    this.router.delete("/athlete", this.deleteAthlete);
  };
}

const athleteRoutes = new AthleteRoutes();
export default athleteRoutes.router;
