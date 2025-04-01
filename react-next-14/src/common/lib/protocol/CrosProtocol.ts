// 定义消息协议

export enum CommandType {
  GET = "get",
  SET = "set",
  REMOVE = "remove"
}
export enum StorageType{
  LOCAL = "local",
  SESSION = "session",
  AUTOMATIC = "automatic"
}

export interface StorageRequest {
  storage: StorageType;
  command: CommandType;
  key: string;
  requestId: string; // 唯一请求ID，用于匹配响应
  value?: string;
}

export interface StorageResponse {
  requestId: string;
  value: string | null;
  error?: string;
}
