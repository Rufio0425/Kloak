import {Component, OnInit} from "angular2/core";
import {Message} from "./message";
import {MessageService} from "./message.service";
import {ErrorService} from "../errors/error.service";
@Component({
    selector: 'my-message-input',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
                <div class="form-group">
                    <label for="content">Content</label>
                    <textarea [class.my-class]="!isWriting" (focus)="isWriting = !isWriting" (focusout)="isWriting = !isWriting" placeholder="Got something to say?" ngControl="content" type="text" class="form-control" id="content" #input [ngModel]="message?.content"></textarea>
                </div>
                <button title="Public Help Text" trigger="hover" type="submit" (click)="anonymousPost(false)" class="btn btn-primary">{{ !message ? 'Post Publicly' : 'Save Message' }}</button>
                <button title="Private Help Text" trigger="hover" type="submit" (click)="anonymousPost(true)" class="btn btn-primary">Post Anonymously</button>
                <button type="button" class="btn btn-danger" (click)="onCancel()" *ngIf="message">Cancel</button>
            </form>
        </section>
    `,
    styles: [
      `
          .my-class {
              height: 34px;
          }

          textarea {
              resize: none;
          }
      `
  ]
})
export class MessageInputComponent implements OnInit{
    message:Message = null;
    anonymous = false;
    isWriting = false;
    constructor(private _messageService:MessageService, private _errorService: ErrorService) {}

    anonymousPost(anonymous) {
        this.anonymous = anonymous;
    }

    onSubmit(form:any) {
        if (this.message) {
            // Edit
            this.message.content = form.content;
            this._messageService.updateMessage(this.message)
                .subscribe(
                    data => console.log(data),
                    error => this._errorService.handleError(error)
                );
            this.message = null;
        } else {
            console.log('anon in else is::: ' +this.anonymous);
            const message:Message = new Message(form.content, null, 'Dummy', null, this.anonymous);
            console.log('message is::: ' + JSON.stringify(message));
            this._messageService.addMessage(message)
                .subscribe(
                    data => {
                        console.log(data);
                        this._messageService.messages.push(data);
                    },
                    error => this._errorService.handleError(error)
                );
        }
    }

    onCancel() {
        this.message = null;
    }

    ngOnInit() {
        this._messageService.messageIsEdit.subscribe(
            message => {
                this.message = message;
            }
        );
    }
}