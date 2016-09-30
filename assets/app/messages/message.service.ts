import {Message} from "./message";
import {Http, Headers} from "angular2/http";
import {Injectable, EventEmitter} from "angular2/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
@Injectable()
export class MessageService {
    // Remember when making calls to this class, we are using the same array of Messages.
    // The subscribe Observable will add to that array, giving live updat functionality without having to go back to the db and reload the page
    messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor (private _http:Http) {}

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        // Here were are returning the Observable.
        // The '.map()' function is handled by rxjs
        return this._http.post('http://localhost:3000/message' + token, body, {headers: headers})
            .map(response => {
                const data = response.json().obj;
                let message = new Message(data.content, data._id, 'Dummy', null);
                return message;
            })
            .catch(error => Observable.throw(error.json()));
    }

    getMessages() {
        return this._http.get('http://localhost:3000/message')
            .map(response => {
                const data = response.json().obj;
                let objs: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    let message = new Message(data[i].content, data[i]._id, 'Dummy', null);
                    objs.push(message);
                };
                return objs;
            })
            .catch(error => Observable.throw(error.json()));
    }

    // Sends the update back to the server
    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this._http.patch('http://localhost:3000/message/' + message.messageId, body, {headers: headers})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    // Loads the edit 'view' to make it editable
    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        return this._http.delete('http://localhost:3000/message/' + message.messageId)
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }
}