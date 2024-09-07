import { createAction, props } from "@ngrx/store";
import { Message } from "../../model/message";

export const SENDMESSAGE = '[Chat Component] send message';
export const RECEIVEDMESSAGES = '[Messaging Service] receive message';
export const CLOSECHAT = '[Users Component] close chat window';
export const OPENCHAT = '[Home Component] open chat window';
export const LISTEN = '[Chat Component] listen for messages'


export const sendMessageAction = createAction(SENDMESSAGE, props<{message: Message}>());

export const receiveMessageAction = createAction(RECEIVEDMESSAGES, props<{ messages: Message[] }>());

export const closeChatWindowAction = createAction(CLOSECHAT);

export const openChatWindowAction = createAction(OPENCHAT, props<{ objectId: string }>());

export const listenForMessagesAction = createAction(LISTEN, props<{objectId: string}>());
