// 定义消息协议
export type StorageType = "local" | "session";
export type CommandType = "get" | "set" | "remove";

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
