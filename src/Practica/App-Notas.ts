import { Cliente } from './cliente';
import * as yargs from 'yargs';
import * as net from 'net';

const cliente = new Cliente(net.connect({port: 60300}));

/**
 * Comando add
 */
yargs.command({
  command: 'add',
  describe: 'Añade una nota nueva',
  builder: {
    user: {
      describe: 'name User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') &&
      (typeof argv.color === 'string')) {
      cliente.enviarDatos('add', argv.user, argv.title, argv.body, argv.color);
      cliente.recibirDatos();
    }
  },
});

yargs.parse();
