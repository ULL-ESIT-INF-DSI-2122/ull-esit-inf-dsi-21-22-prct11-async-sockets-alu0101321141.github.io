import { Server } from './Server';
import * as yargs from 'yargs';


/**
 * Comando Server
 */
yargs.command({
  command: 'launch',
  describe: 'Añade una nota nueva',
  builder: {
    port: {
      describe: 'puerto del servidor',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    if (typeof argv.port === 'number') {
      const server = new Server(argv.port);
      server.onHold();
    }
  },
});


yargs.parse();
