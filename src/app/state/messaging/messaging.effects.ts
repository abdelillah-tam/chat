import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MessagingService } from "../../services/messaging.service";
import { LISTEN, RECEIVEDMESSAGES, SENDMESSAGE } from "./messaging.actions";
import { exhaustMap, map } from "rxjs";
import { Message } from "../../model/message";

@Injectable()
export class MessagingEffects {

    sendMessage$;
    listenForMessages$;


    constructor(private actions$: Actions, private messagingService: MessagingService) {
        this.sendMessage$ = createEffect(() => this.actions$.pipe(
            ofType(SENDMESSAGE),
            map((value: { message: Message }) => {
                this.messagingService.sendMessage(value.message);
                return { type: '' }
            })

        ));

        this.listenForMessages$ = createEffect(() => this.actions$.pipe(
            ofType(LISTEN),
            map((value: { objectId: string }) => {
                this.messagingService.listenForMessages(value.objectId);
                return { type: '' }
            })
        ))

    }

}