import { createReducer, on } from "@ngrx/store";
import { Message } from "../../model/message";
import { closeChatWindowAction, openChatWindowAction, receiveMessageAction, sendMessageAction } from "./messaging.actions";

export const initialSendMessageState: Message | undefined = undefined;

export const initialMessagesState: Message[] | undefined = [];

export const initialChatState: { openChat: boolean; objectId: string } = {
    openChat: false,
    objectId: ''
};

export const sendMessageReducer = createReducer(initialSendMessageState);

export const messagesReducer = createReducer(initialMessagesState,
    on(receiveMessageAction, (state, data) => {
        return data.messages
    })
);

export const chatReducer = createReducer(initialChatState,
    on(closeChatWindowAction, (state) => {
        return { ...state, openChat: false, objectId: '' }
    }),
    on(openChatWindowAction, (state, data) => {
        return { ...state, openChat: true, objectId: data.objectId }
    })
);