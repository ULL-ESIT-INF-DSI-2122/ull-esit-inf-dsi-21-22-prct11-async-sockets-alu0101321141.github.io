import { Cliente } from './cliente';
import * as yargs from 'yargs';


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
      const cliente = new Cliente(60300);
      cliente.sendPetitions('add', argv.user, argv.title, argv.body, argv.color);
      cliente.receivePetition();
    }
  },
});

/**
 * Comando update
 */
yargs.command({
  command: 'update',
  describe: 'Modifica una nota existente',
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
      const cliente = new Cliente(60300);
      cliente.sendPetitions('update', argv.user, argv.title, argv.body, argv.color);
      cliente.receivePetition();
    }
  },
});

/**
 * Comando remove
 */
yargs.command({
  command: 'remove',
  describe: 'Elimina una nota existente',
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
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      const cliente = new Cliente(60300);
      cliente.sendPetitions('remove', argv.user, argv.title);
      cliente.receivePetition();
    }
  },
});

/**
 * Comando read
 */
yargs.command({
  command: 'read',
  describe: 'lee la nota existente',
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
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      const cliente = new Cliente(60300);
      cliente.sendPetitions('read', argv.user, argv.title);
      cliente.receivePetition();
    }
  },
});

/**
 * Comando list
 */
yargs.command({
  command: 'list',
  describe: 'lista el titulo de las notas del usuario',
  builder: {
    user: {
      describe: 'name User',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string')) {
      const cliente = new Cliente(60300);
      cliente.sendPetitions('list', argv.user);
      cliente.receivePetition();
    }
  },
});


yargs.parse();
