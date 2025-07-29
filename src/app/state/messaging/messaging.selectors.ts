import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Message } from '../../model/message';
import { ErrorBack } from '../../model/error';

export const selectSendMessageFeature = createFeatureSelector('sendMessage');
export const selectMessageFeature = createFeatureSelector<{
  allMessages: Message[];
  lastMessage: Message | undefined;
}>('messages');


export const selectChatChannelFeature = createFeatureSelector<{
  chatChannel: string | ErrorBack | undefined;
  chatChannels: string[];
}>('chatChannel');

export const selectMessages = createSelector(
  selectMessageFeature,
  (state) => state.allMessages
);

export const selectLastMessage = createSelector(selectMessageFeature, state => state.lastMessage);



export const selectChatChannel = createSelector(
  selectChatChannelFeature,
  (state) => state
);
