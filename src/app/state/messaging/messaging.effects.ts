import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessagingService } from '../../services/messaging.service';
import {
  GET_ALL_MESSAGES,
  GET_CHAT_CHANNEL,
  imageMsgUrlAction,
  LISTEN,
  receivedAllMessagesAction,
  receivedChatChannelAction,
  newMessageAction,
  SEND_MESSAGE,
  UPLOAD_IMG_MSG,
  NEW_MESSAGE,
  GET_ALL_CHAT_CHANNELS,
  receivedAllChatChannelsAction,
} from './messaging.actions';
import { exhaustMap, from, map } from 'rxjs';
import { Message } from '../../model/message';

@Injectable()
export class MessagingEffects {
  sendMessage$;
  listenForMessages$;
  uploadImgMsg$;
  getChatChannel$;
  getAllChatChannels$;
  getAllMessages$;

  constructor(
    private actions$: Actions,
    private messagingService: MessagingService
  ) {
    this.sendMessage$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SEND_MESSAGE),
          map((value: { message: FormData }) =>
            this.messagingService.sendMessage(value.message)
          )
        ),
      { dispatch: false }
    );

    this.listenForMessages$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(LISTEN),
          map((value: { channelId: string }) =>
            this.messagingService.listenForMessages(value.channelId)
          )
        ),
      { dispatch: false }
    );

    this.uploadImgMsg$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UPLOAD_IMG_MSG),
        exhaustMap((value: { file: File; sender: string }) =>
          from(
            this.messagingService.uploadImageMsg(value.file, value.sender)
          ).pipe(map((result) => imageMsgUrlAction({ imageUrl: result })))
        )
      )
    );

    this.getChatChannel$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_CHAT_CHANNEL),
        exhaustMap((value: { otherUserId: string }) =>
          this.messagingService
            .getChatChannel(value.otherUserId)
            .pipe(
              map((data) => receivedChatChannelAction({ chatChannelId: data }))
            )
        )
      )
    );

    this.getAllChatChannels$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_ALL_CHAT_CHANNELS),
        exhaustMap(() =>
          this.messagingService
            .getAllChatChannels()
            .pipe(
              map((data) => receivedAllChatChannelsAction({ channels: data }))
            )
        )
      )
    );

    this.getAllMessages$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GET_ALL_MESSAGES),
        exhaustMap((value: { channelId: string }) =>
          this.messagingService.getAllMessages(value.channelId).pipe(
            map((data) => {
              return receivedAllMessagesAction({
                messages: data,
              });
            })
          )
        )
      )
    );
  }
}
