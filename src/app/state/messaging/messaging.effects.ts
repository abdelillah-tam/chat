import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessagingService } from '../../services/messaging.service';
import {
  GET_ALL_MESSAGES,
  GET_CHAT_CHANNEL,
  LISTEN,
  receivedAllMessagesAction,
  receivedChatChannelAction,
  SEND_MESSAGE,
  GET_ALL_CHAT_CHANNELS,
  receivedAllChatChannelsAction,
  CREATE_CHANNEL,
  listenForMessagesAction,
} from './messaging.actions';
import { exhaustMap, map, switchAll } from 'rxjs';

@Injectable()
export class MessagingEffects {
  sendMessage$;
  listenForMessages$;
  createChannelIfNotExist$;
  getChatChannel$;
  getAllChatChannels$;
  getAllMessages$;

  constructor(
    private actions$: Actions,
    private messagingService: MessagingService,
  ) {
    this.sendMessage$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SEND_MESSAGE),
          map((value: { message: FormData; firstMessage: boolean }) =>
            this.messagingService.sendMessage(
              value.message,
              value.firstMessage,
            ),
          ),
        ),
      { dispatch: false },
    );

    this.listenForMessages$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(LISTEN),
          map((value: { channelId: string; firstMessage: boolean }) =>
            this.messagingService.listenForMessages(
              value.channelId,
              value.firstMessage,
            ),
          ),
        ),
      { dispatch: false },
    );

    this.createChannelIfNotExist$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CREATE_CHANNEL),
        exhaustMap((value: { message: FormData }) =>
          this.messagingService
            .createChannel(
              value.message.get('channel')!.toString(),
              value.message.get('senderId')!.toString(),
              value.message.get('receiverId')!.toString(),
            )
            .pipe(
              map((data) =>
                listenForMessagesAction({
                  channelId: data,
                  firstMessage: true,
                }),
              ),
            ),
        ),
      ),
    );

    this.getChatChannel$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_CHAT_CHANNEL),
        map((value: { otherUserId: string }) =>
          this.messagingService
            .getChatChannel(value.otherUserId)
            .pipe(
              map((data) => receivedChatChannelAction({ chatChannelId: data })),
            ),
        ),
        switchAll(),
      ),
    );

    this.getAllChatChannels$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_ALL_CHAT_CHANNELS),
        exhaustMap(() =>
          this.messagingService
            .getAllChatChannels()
            .pipe(
              map((data) => receivedAllChatChannelsAction({ channels: data })),
            ),
        ),
      ),
    );

    this.getAllMessages$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_ALL_MESSAGES),
        map((value: { channelId: string }) =>
          this.messagingService.getAllMessages(value.channelId).pipe(
            map((data) => {
              return receivedAllMessagesAction({
                messages: data,
              });
            }),
          ),
        ),
        switchAll(),
      ),
    );
  }
}
