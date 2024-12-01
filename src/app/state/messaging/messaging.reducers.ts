import { createReducer, on } from '@ngrx/store';
import { Message } from '../../model/message';
import {
  closeChatWindowAction,
  emptyImageMsgAction,
  imageMsgUrlAction,
  openChatWindowAction,
  receiveMessageAction,
  sendMessageAction,
} from './messaging.actions';

export const initialSendMessageState: Message | undefined = undefined;

export const initialMessagesState: Message[] | undefined = [];

export const initialImageMsgUrlState = '';

export const sendMessageReducer = createReducer(initialSendMessageState);

export const messagesReducer = createReducer(
  initialMessagesState,
  on(receiveMessageAction, (state, data) => {
    return data.messages;
  })
);

export const imageMsgUrlReducer = createReducer(
  initialImageMsgUrlState,
  on(imageMsgUrlAction, (state, data) => {
    return data.imageUrl;
  }),
  on(emptyImageMsgAction, (state) => initialImageMsgUrlState)
);
