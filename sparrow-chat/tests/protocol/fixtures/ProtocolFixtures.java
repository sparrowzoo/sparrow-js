import com.sparrow.messaging.protocol.Protocol;
import com.sparrow.messaging.protocol.ChatUser;
import com.sparrow.messaging.protocol.ChatSession;
import com.sparrow.messaging.protocol.enums.DefaultProtocolType;
import com.sparrow.messaging.protocol.enums.ChatType;
import com.sparrow.protocol.enums.DeviceType;
import java.nio.ByteBuffer;

/** Run with Java protocol and sparrow-protocol target/classes on the classpath. */
class ProtocolFixtures {
    public static void main(String[] args) {
        System.out.println("{");
        boolean first = true;
        for (DefaultProtocolType type : DefaultProtocolType.values()) {
            Protocol p = new Protocol();
            p.setProtocolType(type);
            p.setDevice(DeviceType.PC);
            p.setChatType(ChatType.ONE_2_ONE);
            p.setMessageType((short)65535);
            p.setPayload("你");
            p.setClientSendTime(12L);
            p.setServerTime(34L);
            p.setSender(ChatUser.stringUserId("1", 1));
            p.setReceiver(ChatUser.stringUserId("2", 2));
            if (!first) System.out.println(",");
            write(type.name(), p);
            first = false;
        }
        Protocol group = new Protocol();
        group.setProtocolType(DefaultProtocolType.IM);
        group.setDevice(DeviceType.MOBILE);
        group.setChatType(ChatType.GROUP);
        group.setMessageType((short)256);
        group.setPayload(null);
        group.setClientSendTime(1L);
        group.setSender(ChatUser.stringUserId("中", 255));
        group.setChatSession(ChatSession.createSession(1, "群"));
        System.out.println(",");
        write("GROUP", group);
        System.out.println("\n}");
    }

    static void write(String name, Protocol p) {
        ByteBuffer encoded = p.encode();
        byte[] bytes = new byte[encoded.remaining()];
        encoded.get(bytes);
        // Also ensure Java itself accepts the emitted frame.
        new Protocol(bytes);
        System.out.print("  \"" + name + "\": [");
        for (int i = 0; i < bytes.length; i++) {
            if (i != 0) System.out.print(",");
            System.out.print(Byte.toUnsignedInt(bytes[i]));
        }
        System.out.print("]");
    }
}
