import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface RunMessage {
  content: string;
}

export interface RunnableEntry {
  type: string;
  id: string;
  name: string;
  workPath: string;
  workingDirectory: string;
  parameters: string[];
  variables: string[];
  environmentVariables: string[];
  values: { [name: string]: string };
  ignoreErrors: boolean;
  pushChanges: boolean;
  dryRun: boolean;
  expectedExitValue: number;
  commandTimeout: number;
}

export function runEntry(entry: RunnableEntry, handleMessage: (message: RunMessage) => void): Promise<RunMessage> {
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

        connection.send("/api/command/run", {}, JSON.stringify(entry));
      });
    } catch (e) {
      reject(e);
    }
  });
}
