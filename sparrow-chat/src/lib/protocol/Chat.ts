export enum ChatType {
    CHAT_1_TO_1 = 0,
    GROUP = 1,
}

export enum MessageType { TEXT = 0 }

export enum DeviceType { UNKNOW = 0, PC = 1, MOBILE = 2, APP = 3 }

export enum ProtocolSegmentIndex {
    PROTOCOL_SEGMENT = 0,
    CONTENT_SEGMENT = 20,
    TIME_SEGMENT = 30,
    USER_SEGMENT = 40,
}

/** Protocol metadata follows DefaultProtocolType.java; direction is descriptive, as on the gateway. */
export enum TransmissionDirection {
    UPLINK = "UPLINK",
    DOWNLINK = "DOWNLINK",
    BIDIRECTIONAL = "BIDIRECTIONAL",
}

export enum ProtocolType {
    AI_REQUEST = 0,
    AI_RESPONSE,
    IM = 8,
    ACK = 10,
    MESSAGE_ACCEPT = 25,
    MESSAGE_CANCEL = 27,
    MESSAGE_DEAL = 28,
    READ = 20,
    PING = 30,
    PONG = 40,
    FETCH_USER_STATUS = 45,
    SEND_USER_STATUS = 50,
    OFFLINE = 70,
    ENDED_CONVERSATION = 80,
    ERROR = -99,
}

export const PROTOCOL_DEFINITIONS: Readonly<Record<ProtocolType, {
    readonly endOfSegmentIndex: ProtocolSegmentIndex;
    readonly direction: TransmissionDirection;
    readonly needBusiness: boolean;
    readonly localImmediately: boolean;
}>> = Object.freeze({
    [ProtocolType.AI_REQUEST]: {
        endOfSegmentIndex: ProtocolSegmentIndex.USER_SEGMENT,
        direction: TransmissionDirection.BIDIRECTIONAL,
        needBusiness: true,
        localImmediately: true
    },
    [ProtocolType.AI_RESPONSE]: {
        endOfSegmentIndex: ProtocolSegmentIndex.USER_SEGMENT,
        direction: TransmissionDirection.BIDIRECTIONAL,
        needBusiness: true,
        localImmediately: true
    },
    [ProtocolType.IM]: {
        endOfSegmentIndex: ProtocolSegmentIndex.USER_SEGMENT,
        direction: TransmissionDirection.BIDIRECTIONAL,
        needBusiness: true,
        localImmediately: true
    },
    [ProtocolType.ACK]: {
        endOfSegmentIndex: ProtocolSegmentIndex.TIME_SEGMENT,
        direction: TransmissionDirection.BIDIRECTIONAL,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.MESSAGE_ACCEPT]: {
        endOfSegmentIndex: ProtocolSegmentIndex.TIME_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.MESSAGE_CANCEL]: {
        endOfSegmentIndex: ProtocolSegmentIndex.TIME_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.MESSAGE_DEAL]: {
        endOfSegmentIndex: ProtocolSegmentIndex.TIME_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.READ]: {
        endOfSegmentIndex: ProtocolSegmentIndex.TIME_SEGMENT,
        direction: TransmissionDirection.UPLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.PING]: {
        endOfSegmentIndex: ProtocolSegmentIndex.PROTOCOL_SEGMENT,
        direction: TransmissionDirection.UPLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.PONG]: {
        endOfSegmentIndex: ProtocolSegmentIndex.PROTOCOL_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.FETCH_USER_STATUS]: {
        endOfSegmentIndex: ProtocolSegmentIndex.PROTOCOL_SEGMENT,
        direction: TransmissionDirection.UPLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.SEND_USER_STATUS]: {
        endOfSegmentIndex: ProtocolSegmentIndex.CONTENT_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.OFFLINE]: {
        endOfSegmentIndex: ProtocolSegmentIndex.PROTOCOL_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.ENDED_CONVERSATION]: {
        endOfSegmentIndex: ProtocolSegmentIndex.CONTENT_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
    [ProtocolType.ERROR]: {
        endOfSegmentIndex: ProtocolSegmentIndex.PROTOCOL_SEGMENT,
        direction: TransmissionDirection.DOWNLINK,
        needBusiness: false,
        localImmediately: true
    },
});

export default class Chat {
    public static readonly HORIZON_LINE = "-";
}
