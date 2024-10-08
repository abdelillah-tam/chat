import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Message } from "../../model/message";

export const selectSendMessageFeature = createFeatureSelector('sendMessage');
export const selectMessagesFeature = createFeatureSelector<Message[]>('messages');
export const selectChatFeature = createFeatureSelector<{openChat: boolean; objectId: string}>('chat');

export const selectMessages = createSelector(selectMessagesFeature, (messages) => messages);
export const selectChat = createSelector(selectChatFeature, (state) => state);