import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Message } from '../../model/message';

export const selectSendMessageFeature = createFeatureSelector('sendMessage');
export const selectMessagesFeature =
  createFeatureSelector<Message[]>('messages');

export const selectImageMsgUrlFeature =
  createFeatureSelector<string>('imageMsgUrl');

export const selectMessages = createSelector(
  selectMessagesFeature,
  (messages) => messages
);
export const selectImageMsgUrl = createSelector(
  selectImageMsgUrlFeature,
  (state) => state
);
