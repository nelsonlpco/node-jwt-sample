import environment from 'config/environment';
import 'driver/mongodb/index';
import express, { Express, Router } from 'express';
import morgan from 'morgan';

class Server {
  server: Express;
  port: number;

  constructor(){
    this.server = express();
    this.port = environment.serverPort;
  }

  async init():Promise<void>{
    await this._start();
    this.server.use(morgan('combined'));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  _start(): Promise<void>{
    return new Promise( (resolve, reject)  => {
      this.server.listen(this.port, resolve);

      this.server.on('error', reject);
    });
  }

  addRoute(path: string, router: Router){
    this.server.use(path, router);
  }
}

export default new Server();
