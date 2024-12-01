import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessagingService } from '../../services/messaging.service';
import {
  imageMsgUrlAction,
  LISTEN,
  SENDMESSAGE,
  UPLOAD_IMG_MSG,
} from './messaging.actions';
import { exhaustMap, from, map } from 'rxjs';
import { Message } from '../../model/message';

@Injectable()
export class MessagingEffects {
  sendMessage$;
  listenForMessages$;
  uploadImgMsg$;

  constructor(
    private actions$: Actions,
    private messagingService: MessagingService
  ) {
    this.sendMessage$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SENDMESSAGE),
          map((value: { message: Message }) =>
            this.messagingService.sendMessage(value.message)
          )
        ),
      { dispatch: false }
    );

    this.listenForMessages$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(LISTEN),
          map((value: { objectId: string }) =>
            this.messagingService.listenForMessages(value.objectId)
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
  }
}
