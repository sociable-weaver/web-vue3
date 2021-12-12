import { Entry } from "@/models/Chapter";
import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface RunMessage {
  content: string;
}

export function run(entry: Entry, handleMessage: (message: RunMessage) => void): Promise<RunMessage> {
  return new Promise((resolve, reject) => {
    try {
      const socket = new SockJS("http://localhost:8077/ws");
      const connection: CompatClient = Stomp.over(() => socket);
      connection.connect({}, () => {
        connection.subscribe("/user/topic/run/output", (messageOutput: IMessage) => {
          const body = JSON.parse(messageOutput.body) as RunMessage;
          handleMessage(body);
        });
        connection.subscribe("/user/topic/run/outcome", (messageOutput: IMessage) => {
          connection.disconnect();
          const body = JSON.parse(messageOutput.body) as RunMessage;
          resolve(body);
        });

        /* TODO: we are sending the whole object, but we don't need that.  We should remove the things that are not needed by the backend. */
        connection.send("/api/command/run", {}, JSON.stringify(entry));
      });
    } catch (e) {
      console.log("Failed to run command", e);
      reject(e);
    }
  });
}
