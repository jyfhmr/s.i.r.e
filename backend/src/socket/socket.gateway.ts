import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
    // cors: {
    //     origin: process.env.FRONT_URLS, //'http://localhost:3001', // URL de tu frontend
    //     methods: ['GET', 'POST'],
    //     credentials: true,
    // },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('SocketGateway');

    afterInit() {
        this.logger.log('Init GatewayServer');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected2: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
