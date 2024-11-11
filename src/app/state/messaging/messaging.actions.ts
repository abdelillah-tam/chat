import { createAction, props } from '@ngrx/store';
import { Message } from '../../model/message';

export const SENDMESSAGE = '[Chat Component] send message';
export const RECEIVEDMESSAGES = '[Messaging Service] receive message';
export const CLOSECHAT = '[Users Component] close chat window';
export const OPENCHAT = '[Home Component] open chat window';
export const LISTEN = '[Chat Component] listen for messages';
export const UPLOAD_IMG_MSG = '[Chat Component] Upload Image Message';
export const GOTTEN_IMG_MSG_URL = '[Effect] gotten image url';
export const EMPTY_IMG_MSG = '[Chat Component] empty img msg';

export const sendMessageAction = createAction(
  SENDMESSAGE,
  props<{ message: Message;}>()
);

export const receiveMessageAction = createAction(
  RECEIVEDMESSAGES,
  props<{ messages: Message[] }>()
);

export const closeChatWindowAction = createAction(CLOSECHAT);

export const openChatWindowAction = createAction(
  OPENCHAT,
  props<{ objectId: string }>()
);

export const listenForMessagesAction = createAction(
  LISTEN,
  props<{ objectId: string }>()
);

export const uploadImageMsgAction = createAction(
  UPLOAD_IMG_MSG,
  props<{ file: File; sender: string }>()
);

export const imageMsgUrlAction = createAction(
  GOTTEN_IMG_MSG_URL,
  props<{ imageUrl: string }>()
);

export const emptyImageMsgAction = createAction(EMPTY_IMG_MSG);