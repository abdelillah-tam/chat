import { createReducer, on } from '@ngrx/store';
import { Message } from '../../model/message';
import {
  receivedChatChannelAction,
  newMessageAction,
  sendMessageAction,
  receivedAllMessagesAction,
  receivedAllChatChannelsAction,
} from './messaging.actions';
import { ErrorBack } from '../../model/error';

export const initialSendMessageState: Message | undefined = undefined;

export const initialMessagesState:
  | { allMessages: Message[] | undefined; lastMessage: Message | undefined; }
  | undefined = { allMessages: undefined, lastMessage: undefined };

export const initialChatChannelState: {
  chatChannel: string | ErrorBack | undefined;
  chatChannels: string[];
} = { chatChannel: undefined, chatChannels: [] };

export const sendMessageReducer = createReducer(initialSendMessageState);

export const messagesReducer = createReducer(
  initialMessagesState,
  on(newMessageAction, (state, data) => {
    const newArray = Array.from(state.allMessages ?? []);
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

