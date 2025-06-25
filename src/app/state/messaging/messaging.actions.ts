import { createAction, props } from '@ngrx/store';
import { Message } from '../../model/message';

export const SEND_MESSAGE = '[Chat Component] send message';
export const NEW_MESSAGE = '[Effect] received a new message';
export const RECEIVED_ALL_MESSAGES = '[Effect] received all messages';
export const CLOSECHAT = '[Users Component] close chat window';
export const OPENCHAT = '[Home Component] open chat window';
export const LISTEN = '[Chat Component] listen for messages';
export const CREATE_CHANNEL =
  '[Chat Component] create channel if not exist then return it';
export const UPLOAD_IMG_MSG = '[Chat Component] Upload Image Message';
export const GOTTEN_IMG_MSG_URL = '[Effect] gotten image url';
export const EMPTY_IMG_MSG = '[Chat Component] empty img msg';
export const GET_CHAT_CHANNEL = '[Chat Component] get chat channel';
export const RECEIVED_CHAT_CHANNEL = '[Effect] received chat channel';
export const GET_ALL_CHAT_CHANNELS = '[Users Component] get all chat channels';
export const RECEIVED_ALL_CHAT_CHANNELS =
  '[Effects] received all chat channels';
export const GET_ALL_MESSAGES = '[Chat Component] get all messages';

export const sendMessageAction = createAction(
  SEND_MESSAGE,
  props<{ message: FormData; firstMessage: boolean }>()
);

export const newMessageAction = createAction(
  NEW_MESSAGE,
  props<{ message: Message }>()
);

export const receivedAllMessagesAction = createAction(
  RECEIVED_ALL_MESSAGES,
  props<{ messages: Message[] }>()
);

export const closeChatWindowAction = createAction(CLOSECHAT);

export const openChatWindowAction = createAction(
  OPENCHAT,
  props<{ objectId: string }>()
);

export const listenForMessagesAction = createAction(
  LISTEN,
  props<{ channelId: string; firstMessage: boolean }>()
);

export const uploadImageMsgAction = createAction(
  UPLOAD_IMG_MSG,
  props<{ file: File; sender: string }>()
);

export const imageMsgUrlAction = createAction(
  GOTTEN_IMG_MSG_URL,
  props<{ imageUrl: string }>()
);

export const getChatChannelAction = createAction(
  GET_CHAT_CHANNEL,
  props<{ otherUserId: string }>()
);

export const receivedChatChannelAction = createAction(
  RECEIVED_CHAT_CHANNEL,
  props<{ chatChannelId: string }>()
);

export const getAllChatChannelsAction = createAction(GET_ALL_CHAT_CHANNELS);

export const receivedAllChatChannelsAction = createAction(
  RECEIVED_ALL_CHAT_CHANNELS,
  props<{ channels: string[] }>()
);

export const getAllMessagesAction = createAction(
  GET_ALL_MESSAGES,
  props<{ channelId: string }>()
);

export const emptyImageMsgAction = createAction(EMPTY_IMG_MSG);

export const createChannelAction = createAction(
  CREATE_CHANNEL,
  props<{ message: FormData }>()
);
