import * as express from 'express';
import { spawn } from 'child_process';

/**
 * Clase servidor
 */
export class Server {
  private server: express.Application;
  /**
   * constructor
   */
  constructor() {
    this.server = express();
    this.server.listen(3000, () => {
      console.log('Se ha inicializado el servidor en el puerto 3000');
    });
  }

  /**
   * Resuelve una petición
   */
  getPetitions() {
    this.server.get('/execmd', (req, res) => {
      const cmd = req.query.cmd as string;
      let options:string[] = [];
      if (req.query.args) {
        const args = req.query.args as string;
        options = args.split(',');
      }
      const processComand = spawn(cmd, options);
      let resultComand = '';
      processComand.stdout.on('data', (data) => {
        resultComand += data;
      });
      processComand.on('error', (err) => {
        const response = {
          type: 'response',
          success: false,
          data: err,
        };
        res.send(JSON.stringify(response));
      });
      processComand.on('close', () => {
        const response = {
          type: 'response',
          success: true,
          data: resultComand,
        };
        res.send(JSON.stringify(response));
      });
    });

    this.server.get('*', (_, res) => {
      res.send('<h1>404</h1>');
    });
  }
}

const server = new Server();
server.getPetitions();
