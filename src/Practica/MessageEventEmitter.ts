import { EventEmitter } from 'events';

/**
 * Clase para definir el evento message.
 */
export class MessageEventEmitter extends EventEmitter {
  /**
   * Constructor de la clase.
   * @param connection Socket de conexión.
   */
  constructor(connection: EventEmitter) {
    super();

    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
