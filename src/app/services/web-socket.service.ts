import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  receiveResponse() {
    return this.socket.fromEvent('response')
  }
}
