import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5258/api";
// Loại bỏ /api để lấy URL gốc cho Hub
const HUB_URL = API_URL.replace(/\/api$/, "") + "/chatHub";

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  public startConnection = async () => {
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return this.connection;
    }

    const token = Cookies.get("accessToken");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token || "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    await this.connection.start();
    return this.connection;
  };

  public stopConnection = async () => {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  };

  public getConnection = () => this.connection;
}

export const signalRService = new SignalRService();
