import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient = null;
  connected = false;
  websocketEvents: Subject<any> = new Subject<any>();

  constructor() {
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/websocket');
    // @ts-ignore
    this.stompClient = Stomp.over(socket);
    const _this = this;
    // @ts-ignore
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // @ts-ignore
      _this.stompClient.subscribe('rating-service', hello => {
        _this.websocketEvents.next(hello.body);
        console.log("websocket received: " + hello.body);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      // @ts-ignore
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  setConnected(connected: boolean) {
    this.connected = !connected;
  }

  subscribe(observer: (value: any) => void) {
    this.websocketEvents.subscribe(observer);
  }
}
