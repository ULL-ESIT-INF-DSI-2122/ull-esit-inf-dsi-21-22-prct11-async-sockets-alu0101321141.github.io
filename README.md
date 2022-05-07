# Práctica 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto
## Autor: Vlatko Jesús Marchán Sekulic.

---

## Calidad y seguridad del código fuente mediante Sonar Cloud

<p align="center">
    <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101321141.github.io?branch=main">
        <img alt="Coveralls" src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101321141.github.io/badge.svg?branch=main' alt='Coverage Status">
    </a>
</p>

---

## Práctica 11.

En esta practica se propone realizar un servidor y un cliente para la aplicación de procesamiento de notas de texto realizada en la práctica 9.

### tipos de datos para los mensajes entre cliente y servidor.

Para implementar nuestra estructura __Cliente y Servidor__ primero se definió los tipos de mensajes que se intercambiarán ambos. Para ello, se crearon __RequestType__ y __ResponseType__ que el primero será el tipo de mensaje que enviará el _cliente_ para realizar una petición al servidor y el segundo será el tipo de mensaje que enviará el _Servidor_ para responder al cliente.

```typescript
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  nameUser: string;
  title?: string;
  body?: string;
  color?: string;
}
```

Donde el request tenemos, __type__ que notificará al servidor el comando que deberá ejecutar. __nameUser__ nombre del usuario que quiere usar el servidor. Y los atributos __tilte, body y color__ que son opcionales ya que son la información de la nota que necesita enviar el usuario para realizar el comando en específico. (Y no es todas las operaciones es necesario enviar la información de una nota completa).

```typescript
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  color: string;
  notes?: NotasType[];
  error?: string;
}
```

El tipo __Response__ por su parte tiene una serie de atributos necesarios para poder procesar desde el cliente la información. _type_ la respuesta del comando ejecutado, _success_ el booleano que notifica si el comando se ejecuto correctamente, _color_ el color de la respuesta. _notes_ es un atributo opcional vector de tipo notas, _¿Qué es el tipo notas? -> Es un tipo que se explicara a continucación_, el cual es opcional ya que todos los comandos no retornarán información. por otro lado, tenemos el tipo _error_ este tipo es opcional ya que solo se rellenaría en caso de que se produzca uno.

Con lo que respecta al _tipoNotas_ es un tipo que define el contenido de una nota. Este tipo se utilizará en todos los comandos que nos devuelvan información de las notas y por ello se estructura como:

```typescript
export type NotasType = {
  title: string;
  color: string;
  body?: string;
}
```

Como se puede observar, _title_ contendrá el titulo de la nota, _color_ el color de la nota y _body_ el contenido, El contenido es un atributo opcional ya que comandos como __listTitles__ no es necesario enviar el contenido.

---

### Modificaciones a la aplicación de notas de la práctica 9.

Para realizar dicha implementación fue necesario modificar el _retorno_ de las funciones de dicha práctica para obtener la información correctamente formateada en el servidor para poder ser enviada.

Para ello tal y como se puede observar las funciones quedaron de esta manera:

* __addNotes:__ Se ha modificado la función para que retorne una tupla con un booleano y un string. De esta manera el _booleano_ nos notifica si la ejecución del comando fue correcta y la _string_ nos devolverá el mensaje informativo.

```typescript
addNotes(nameUser:string, Notes:Notas):[boolean, string] {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Bienvenido de vuelta usuario', nameUser));
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      if (fs.existsSync(`${archiveRoute}`)) {
        console.log(chalk.black.bgRedBright('Error, la nota ya existe.'));
        return [false, "Error, la nota ya existe."];
      } else {
        fs.writeFileSync(`${archiveRoute}`, Notes.toString());
        console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
        return [true, "Se ha creado la nota satisfactoriamente"];
      }
    } else {
      console.log(chalk.black.bgGreenBright("Usuario Nuevo, bienvenido ", nameUser));
      fs.mkdirSync(`${archiveRoute}`, {recursive: true});
      archiveRoute = archiveRoute + "/" + Notes.getTitle() + ".json";
      fs.writeFileSync(`${archiveRoute}`, Notes.toString());
      console.log(chalk.black.bgGreenBright('Se ha creado la nota satisfactoriamente'));
      return [true, "Se ha creado la nota satisfactoriamente"];
    }
  }
```

* __modifyNote:__ Al igual que el _addNotes_ Se ha modificado la función para que retorne una tupla con un booleano y un string. De esta manera el _booleano_ nos notifica si la ejecución del comando fue correcta y la _string_ nos devolverá el mensaje informativo.

```typescript
modifyNote(nameUser:string, modifyNote:Notas):[boolean, string] {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + modifyNote.getTitle() + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.writeFileSync(`${archiveRoute}`, modifyNote.toString());
      console.log(chalk.black.bgGreenBright('La nota se ha modificado satisfactoriamente'));
      return [true, "La nota se ha modificado satisfactoriamente"];
    } else {
      console.log(chalk.black.bgRedBright('La nota que desea modificar no existe'));
      return [false, "La nota que desea modificar no existe"];
    }
}
```

* __deleteNote:__ 

```typescript
deleteNote(nameUser:string, noteTilte:string):[boolean, string] {
    let archiveRoute: string = './AppDataBase/' + nameUser;
    archiveRoute = archiveRoute + "/" + noteTilte + ".json";
    if (fs.existsSync(`${archiveRoute}`)) {
      fs.rmSync(`${archiveRoute}`);
      console.log(chalk.black.bgGreenBright('La nota se ha eliminado correctamente'));
      return [true, "La nota se ha eliminado correctamente"];
    } else {
      console.log(chalk.black.bgRedBright('Error dicha nota no existe'));
      return [false, "Error dicha nota no existe"];
    }
  }
```

* __listTitles:__ se modificó para que se nos enviara una tupla con un _booleano_ para identificar si fue correcta la ejeción, un _string_ con un mensaje que informa como ejecuto y un _array_ con el contenido de las notas, correctamente formateado con _NotasType_.

```typescript
listTitles(nameUser: string): [boolean, string, NotasType[]] {
    let archiveRoute:string = './AppDataBase/' + nameUser;
    if (fs.existsSync(`${archiveRoute}`)) {
      console.log(chalk.black.bgGreenBright('Las notas con sus títulos son:'));
      archiveRoute += "/";
      const nameFilesAndColors:NotasType[] = [];
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      namefiles.forEach((fileName) => {
        const fileContent = fs.readFileSync( archiveRoute + fileName);
        const json = JSON.parse(fileContent.toString());
        this.printWithColor(json.color, json.title);
        const nota:NotasType = {
          title: json.title,
          color: json.color,
        };
        nameFilesAndColors.push(nota);
      });
      return [true, "El usuario tiene notas.", nameFilesAndColors];
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return [false, "El usuario no existe", []];
    }
  }
```

* __listNote:__ al igual que __ListTitle__ se modificó para que se nos enviara una tupla con un _booleano_ para identificar si fue correcta la ejeción, un _string_ con un mensaje que informa como ejecuto y un _array_ con el contenido de las notas, correctamente formateado con _NotasType_.

```typescript
listNote(nameUser: string, noteTilte: string): [boolean, string, NotasType[]] {
    noteTilte += ".json";
    let archiveRoute: string = './AppDataBase/' + nameUser;
    let flag:boolean = false;
    if (fs.existsSync(`${archiveRoute}`)) {
      archiveRoute += "/";
      const namefiles = fs.readdirSync(`${archiveRoute}`);
      const notes:NotasType[] = [];
      namefiles.forEach((fileName) => {
        if (noteTilte == fileName) {
          console.log(chalk.black.bgGreenBright('La nota es: '));
          const fileContent = fs.readFileSync(archiveRoute + fileName);
          const json = JSON.parse(fileContent.toString());
          this.printWithColor(json.color, json.title);
          this.printWithColor(json.color, json.body);
          this.printWithColor(json.color, json.color);
          const nota: NotasType = {
            title: json.title,
            color: json.color,
            body: json.body,
          };
          notes.push(nota);
          flag = true;
        }
      });
      if (flag) {
        return [true, "La nota se ha listado correctamente", notes];
      } else {
        console.log(chalk.black.bgRedBright('El usuario no tiene ninguna nota con ese nombre'));
        return [false, "El usuario no tiene ninguna nota con ese nombre", []];
      }
    } else {
      console.log(chalk.black.bgRedBright('El usuario no existe'));
      return [false, "El usuario no existe", []];
    }
  }
```

Además también se modifico las llamadas de los comandos de la __App-Notas__ que se explicará más adelante. Por otro lado, La implementación de la clase __Notas__ no se ha visto modificada.

---

### Implementación del servidor.

Para la implementación del servidor se optó por crear una __clase Servidor__

* __constructor:__ En el constructor pedimos el puerto con el que se quiere iniciar el servidor. una vez optenido el dato procedemos a crear el servidor. El servidor se creó con la opción __{ allowHalfOpen: true }__ dicha opción lo que nos permite es que al cliente enviar toda la información y terminar con un _socket.end()_ que el socket del servidor no se bloquee y este pueda enviarle la respuesta a su petición. Por otro lado, controlamos si se produce un error en la creación y en caso de que se cierre la comunicación con el cliente que quede a la espera de nuevos clientes. Además el server, se guradará en un atributo privado para poder se invocado desde otros métodos de la clase.

```typescript
private server: net.Server;

constructor(private port: number) {
    this.server = net.createServer({ allowHalfOpen: true }, (connection) => {
      connection.on('error', (err) => {
        console.log(chalk.black.bgRedBright('Error en la creación del servidor:', err));
      });
      connection.on('close', () => {
        console.log(chalk.black.bgWhiteBright('Servidor cerrado correctamente.'));
        console.log(chalk.black.bgWhiteBright('Esperando a nuevos usuarios.'));
      });
    }).listen(this.port, () => {
      console.log(chalk.black.bgGreenBright('Se ha iniciado el servidor.'));
    });
  }
```

* __onHold():__ es un método de la clase que pondrá a nuestro servidor a la espera de nuevas peticiones de nuestros usuarios. De esta manera cada vez que se conecte un usuario se nos notificará que el cliente está conectado. Por otro lado, está función se encargará de procesar las peticiones de nuestros usuarios. Para ello guardará el mensaje que nos envie el cliente y cuando finalice de obtener los datos. Realiará un parse de los datos, y dependiendo del tipo del mensaje realizará una acción u otra.

```typescript
onHold() {
    this.server.on('connection', (connection) => {
      console.log(chalk.black.bgGreenBright('Cliente conectado.'));

      let Datos: string = '';
      // Obtenermos los datos que nos envíe el cliente.
      connection.on('data', (data) => {
        Datos += data;
      });

      connection.on('end', () => {
        // Parseamos los datos que nos envió el cliente.
        const message = JSON.parse(Datos);
        console.log(chalk.black.bgGreenBright(' -> Mensaje del cliente recibido'));
        switch (message.type) {
          case 'add':
            this.addPetitions(message, connection);
            break;
          case 'update':
            this.updatePetitions(message, connection);
            break;
          case 'remove':
            this.removePetitions(message, connection);
            break;
          case 'read':
            this.readPetitions(message, connection);
            break;
          case 'list':
            this.listPetitions(message, connection);
            break;
          default:
            console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
            break;
        }
      });
    });
  }
```

* __private addPetitions:__ esta función se encargará de procesar la petición _add_ para ello obtiene los datos dados por el usuario y llama a la función de nuestra aplicación de __Gestor de notas__. Tras esto optendrá el resultado de la función y dependiendo de su resultado creará un mensaje de respuesta satisdactoria. o por el contrario un mensaje de error. que será enviada al cliente y cerrado la conección.

```typescript
private addPetitions(message:any, connection:net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo add recibido'));
    const gestorNotas = new GestorNotas();
    const nota = new Notas(message.title, message.body, message.color);
    const resultado: [boolean, string] = gestorNotas.addNotes(message.nameUser, nota);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'add',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'add',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
```

* __private updatePetitions:__ se encargará de procesar las peticiones de _update_ que modificarán las notas, al igual que con el comando _add_ procederemos a procesar los datos pasados por el cliente y llamamos a la función del __Gestor de notas__ modify notes y dependiendo de su resultado enviar los mensajes de satisfacción o error en ejecución.

```typescript
private updatePetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo update recibido'));
    const gestorNotas = new GestorNotas();
    const nota = new Notas(message.title, message.body, message.color);
    const resultado: [boolean, string] = gestorNotas.modifyNote(message.nameUser, nota);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'update',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'update',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
```

* __private removePetitions:__ se encargará de procesar las peticiones de _remove_ que eliminará una nota, al igual que con el comando _update_ procederemos a procesar los datos pasados por el cliente y llamamos a la función del __Gestor de notas__ deleteNotes y dependiendo de su resultado enviar los mensajes de satisfacción o error en ejecución.

```typescript
  private removePetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo remove recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string] = gestorNotas.deleteNote(message.nameUser, message.title);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'remove',
        success: true,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'remove',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
```

* __private readPetitions:__ se encargará de procesar las peticiones de _read_ que leerá una nota preexistente, al igual que con el comando _remove_ procederemos a procesar los datos pasados por el cliente y llamamos a la función del __Gestor de notas__ listNote a diferencia de los comandos anteriores a parte de enviar en el mensaje satisfacción del comando se enviará la nota con su contenido. Y como en los anteriores en caso de fallo se enviará el mensaje de error.

```typescript
private readPetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo read recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string, NotasType[]] = gestorNotas.listNote(message.nameUser, message.title);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'read',
        success: true,
        notes: resultado[2],
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'read',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
```

* __private listPetitions:__ ser encargará de procesar las peticiones de _list_ que listará los titulos de las notas del usuario, al igual que con el comando _read_ procederemos a procesar los datos pasados por el cliente y llamamos a la función del __Gestor de notas__ listTitles al igual que el comando _read_ este comando enviará en su mensaje de correcto la información de las notas sin embargo esta solo enviará su contenido de notas sus titulos color. al igual que en los anteriores en caso de fallar se enviará el mensaje de error.

```typescript
private listPetitions(message: any, connection: net.Socket) {
    console.log(chalk.black.bgYellowBright('Mensaje de tipo update recibido'));
    const gestorNotas = new GestorNotas();
    const resultado: [boolean, string, NotasType[]] = gestorNotas.listTitles(message.nameUser);
    if (resultado[0]) {
      const response: ResponseType = {
        type: 'list',
        success: true,
        notes: resultado[2],
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    } else {
      const response: ResponseType = {
        type: 'list',
        success: false,
        error: `${resultado[1]}`,
        color: message.color,
      };
      connection.write(JSON.stringify(response));
      connection.end();
    }
  }
```

---

### Implementación de la aplicación Servidor.

Para crear el servidor se desarrolló un _Launcher-Server_ que contiene el comando __Launch__ que lo que realizará es crear el servidor con el numero de puerto dado y ponerlo en modo _OnHold_. Se creó para crear de forma más comoda el servidor.

```typescript
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
```

---

## Implementación del cliente.

Para la implementación del cliente, al igual que en el servidor se optó por crear una _clase cliente_:

* __constructor:__ En el constructor creamos un socket de conección al servido y lo guardamos en un atributo privado.

```typescript
private socket:net.Socket;
constructor(private port:number) {
    this.socket = net.connect({ port: this.port });
}
```

* __sendPetitions:__ Se encargará de procesar las peticiones al servidor para pedir la ejecución de uno de los comandos especificados. (Para ello utilizará las funciones Petitions que se explicarán más delante.)

```typescript
sendPetitions(type:string, nameUser:string, title?:string, body?:string, color?:string) {
    switch (type) {
      case 'add':
        this.addPetition(nameUser, title!, body!, color!);
        break;
      case 'update':
        this.updatePetition(nameUser, title!, body!, color!);
        break;
      case 'remove':
        this.removePetition(nameUser, title!);
        break;
      case 'read':
        this.readPetition(nameUser, title!);
        break;
      case 'list':
        this.listPetition(nameUser);
        break;
      default:
        console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
        break;
    }
  }
```

* __receivePetition:__ Se encargará de obtener la información de la respuesta del servidor.

```typescript
receivePetition() {
    // obtenemos la respuesta del servidor.
    let response:string = '';
    this.socket.on('data', (data) => {
      response += data;
    });
    this.socket.on('end', () => {
      const message = JSON.parse(response);
      console.log(chalk.black.bgGreenBright('Mensaje del servidor recibido'));
      switch (message.type) {
        case 'add':
          this.addResponse(message);
          break;
        case 'update':
          this.updateResponse(message);
          break;
        case 'remove':
          this.removeResponse(message);
          break;
        case 'read':
          this.readResponse(message);
          break;
        case 'list':
          this.listResponse(message);
          break;
        default:
          console.log(chalk.black.bgRedBright('Error: El tipo de mensaje no es correcto.'));
          break;
      }
    });
  }
```

* __addPetition:__ se encargará de crear el mensaje de petición, enviando el tipo de comando y la información asociada (EL resto de peticiones siguen la misma lógica).

```typescript
  private addPetition(nameUser: string, title: string, body : string, color : string) {
    const request: RequestType = {
      type: 'add',
      nameUser: nameUser,
      title: title,
      body: body,
      color: color,
    };
    this.socket.write(JSON.stringify(request));
    this.socket.end();
  }
```

* __addResponse:__ se encarga de procesar el mensaje recibido del servidor. (El resto de Response siguen la misma lógica pero con sus propios datos).

```typescript
private addResponse(message:any) {
    console.log(chalk.black.bgYellowBright('Respuesta de tipo add recibido'));
    if (message.success) {
      console.log(chalk.black.bgGreenBright('Nota añadida correctamente.'));
    } else {
      console.log(chalk.black.bgRedBright('Se ha producido un error al crear la nota.'));
      console.log(chalk.black.bgRedBright("Err:", message.error));
    }
  }
```


---

## App-notas 

En el caso de __App_notas__ se han modificado todos los comandos seguiendo la lógica:

```typescript
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
```

Creando la clase cliente con el puerto correspondiente al servidor (En nuestro caso siempre lo crearemos en el 60300). Y tras ello hacer la petición adecuada. y depués poner el cliente a la espera.

---

### Pruebas desarolladas.

Para realizar las pruebas a las clases, se reutilizaron por una parte las pruebas de la práctica 9 modificando su resultado a el nuevo formato y además desarrollamos una prueba para el Servidor y otra para el cliente. 

¡¡¡¡¡ Importante !!!!! -> Al ejecutar las pruebas para que no de problemas hay que hacerlo sin la carpeta AppDatabase. Ya que de existir y tener el mismo contenido que se crea en las pruebas puede llegar a dar errores.

> Se necesito hacer una pequeña modificación en las pruebas de la modificación, para no tener que estar abriendo el server a mano. (Se creo una variable que se llama jutamente antes). y además cambiarles los puertos para que no colisionara con las pruebas nuevas.

Por otro lado para comprobar el funcionamiento del server y del cliente se realizó una prueba sencilla para comprobar si son capaces de recibir correctamente la información.


