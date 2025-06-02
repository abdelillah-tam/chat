import { createReducer, on } from '@ngrx/store';
import { Message } from '../../model/message';
import {
  closeChatWindowAction,
  emptyImageMsgAction,
  imageMsgUrlAction,
  openChatWindowAction,
  receivedChatChannelAction,
  newMessageAction,
  sendMessageAction,
  receivedAllMessagesAction,
  receivedAllChatChannelsAction,
} from './messaging.actions';

export const initialSendMessageState: Message | undefined = undefined;

export const initialMessagesState:
  | { allMessages: Message[]; lastMessage: Message | undefined }
  | undefined = { allMessages: [], lastMessage: undefined };

export const initialChatChannelState: {
  chatChannel: string;
  chatChannels: string[];
} = { chatChannel: '', chatChannels: [] };

export const initialImageMsgUrlState = '';

export const sendMessageReducer = createReducer(initialSendMessageState);

export const messagesReducer = createReducer(
  initialMessagesState,
  on(newMessageAction, (state, data) => {
    const newArray = Array.from(state.allMessages);
    newArray.push(data.message);
    return {...state, lastMessage: data.message, allMessages: newArray}
  }),
  on(receivedAllMessagesAction, (state, data) => {
    return {...state, allMessages: data.messages}
  })
);

export const chatChannelReducer = createReducer(
  initialChatChannelState,
  on(receivedChatChannelAction, (state, data) => {
    return {
      ...state,
      chatChannel: data.chatChannelId,
    };
  }),
  on(receivedAllChatChannelsAction, (state, data) => {
    return state;
  })
);

export const imageMsgUrlReducer = createReducer(
  initialImageMsgUrlState,
  on(imageMsgUrlAction, (state, data) => {
    return data.imageUrl;
  }),
  on(emptyImageMsgAction, (state) => initialImageMsgUrlState)
);
