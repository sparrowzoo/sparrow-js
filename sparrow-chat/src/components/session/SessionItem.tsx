"use client";
import * as React from "react";
import {SidebarMenuItem} from "@/components/ui/sidebar";
import SessionItemTrigger from "@/components/session/SessionItemTrigger";
import SessionItemProps from "@/components/session/item/SessionItemProps";

export default function SessionItem(props: SessionItemProps) {
    const {chatSession} = props;
    return (
        <SidebarMenuItem className="im-session-list-item">
            <SessionItemTrigger
                unreadPosition={props.unreadPosition}
                triggerType={props.triggerType}
                chatSession={chatSession}
            />
        </SidebarMenuItem>
    );
}
