var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("messages/message", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Message;
    return {
        setters:[],
        execute: function() {
            Message = (function () {
                function Message(content, messageId, username, userId) {
                    this.content = content;
                    this.messageId = messageId;
                    this.username = username;
                    this.userId = userId;
                }
                return Message;
            }());
            exports_1("Message", Message);
        }
    }
});
System.register("messages/message.service", ["messages/message", "angular2/http", "angular2/core", 'rxjs/Rx', "rxjs/Observable"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var message_1, http_1, core_1, Observable_1;
    var MessageService;
    return {
        setters:[
            function (message_1_1) {
                message_1 = message_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            MessageService = (function () {
                function MessageService(_http) {
                    this._http = _http;
                    // Remember when making calls to this class, we are using the same array of Messages.
                    // The subscribe Observable will add to that array, giving live updat functionality without having to go back to the db and reload the page
                    this.messages = [];
                    this.messageIsEdit = new core_1.EventEmitter();
                }
                MessageService.prototype.addMessage = function (message) {
                    var body = JSON.stringify(message);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    // Here were are returning the Observable.
                    // The '.map()' function is handled by rxjs
                    return this._http.post('http://localhost:3000/message', body, { headers: headers })
                        .map(function (response) {
                        var data = response.json().obj;
                        var message = new message_1.Message(data.content, data._id, 'Dummy', null);
                        return message;
                    })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService.prototype.getMessages = function () {
                    return this._http.get('http://localhost:3000/message')
                        .map(function (response) {
                        var data = response.json().obj;
                        var objs = [];
                        for (var i = 0; i < data.length; i++) {
                            var message = new message_1.Message(data[i].content, data[i]._id, 'Dummy', null);
                            objs.push(message);
                        }
                        ;
                        return objs;
                    })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                // Sends the update back to the server
                MessageService.prototype.updateMessage = function (message) {
                    var body = JSON.stringify(message);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    return this._http.patch('http://localhost:3000/message/' + message.messageId, body, { headers: headers })
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                // Loads the edit 'view' to make it editable
                MessageService.prototype.editMessage = function (message) {
                    this.messageIsEdit.emit(message);
                };
                MessageService.prototype.deleteMessage = function (message) {
                    this.messages.splice(this.messages.indexOf(message), 1);
                    return this._http.delete('http://localhost:3000/message/' + message.messageId)
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], MessageService);
                return MessageService;
            }());
            exports_2("MessageService", MessageService);
        }
    }
});
System.register("messages/message-input.component", ["angular2/core", "messages/message", "messages/message.service"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2, message_2, message_service_1;
    var MessageInputComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (message_2_1) {
                message_2 = message_2_1;
            },
            function (message_service_1_1) {
                message_service_1 = message_service_1_1;
            }],
        execute: function() {
            MessageInputComponent = (function () {
                function MessageInputComponent(_messageService) {
                    this._messageService = _messageService;
                    this.message = null;
                }
                MessageInputComponent.prototype.onSubmit = function (form) {
                    var _this = this;
                    if (this.message) {
                        // Edit
                        this.message.content = form.content;
                        this._messageService.updateMessage(this.message)
                            .subscribe(function (data) { return console.log(data); }, function (error) { return console.log(error); });
                        this.message = null;
                    }
                    else {
                        var message = new message_2.Message(form.content, null, 'Dummy');
                        this._messageService.addMessage(message)
                            .subscribe(function (data) {
                            console.log(data);
                            _this._messageService.messages.push(data);
                        }, function (error) { return console.error(error); });
                    }
                };
                MessageInputComponent.prototype.onCancel = function () {
                    this.message = null;
                };
                MessageInputComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._messageService.messageIsEdit.subscribe(function (message) {
                        _this.message = message;
                    });
                };
                MessageInputComponent = __decorate([
                    core_2.Component({
                        selector: 'my-message-input',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                <div class=\"form-group\">\n                    <label for=\"content\">Content</label>\n                    <input ngControl=\"content\" type=\"text\" class=\"form-control\" id=\"content\" #input [ngModel]=\"message?.content\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\">{{ !message ? 'Send Message' : 'Save Message' }}</button>\n                <button type=\"button\" class=\"btn btn-danger\" (click)=\"onCancel()\" *ngIf=\"message\">Cancel</button>\n            </form>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [message_service_1.MessageService])
                ], MessageInputComponent);
                return MessageInputComponent;
            }());
            exports_3("MessageInputComponent", MessageInputComponent);
        }
    }
});
System.register("messages/message.component", ["angular2/core", "messages/message", "messages/message.service"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3, message_3, message_service_2;
    var MessageComponent;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (message_3_1) {
                message_3 = message_3_1;
            },
            function (message_service_2_1) {
                message_service_2 = message_service_2_1;
            }],
        execute: function() {
            MessageComponent = (function () {
                function MessageComponent(_messageService) {
                    this._messageService = _messageService;
                    this.editClicked = new core_3.EventEmitter();
                }
                MessageComponent.prototype.onEdit = function () {
                    this._messageService.editMessage(this.message);
                };
                MessageComponent.prototype.onDelete = function () {
                    this._messageService.deleteMessage(this.message)
                        .subscribe(function (data) { return console.log(data); }, function (error) { return console.error(error); });
                };
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', message_3.Message)
                ], MessageComponent.prototype, "message", void 0);
                __decorate([
                    core_3.Output(), 
                    __metadata('design:type', Object)
                ], MessageComponent.prototype, "editClicked", void 0);
                MessageComponent = __decorate([
                    core_3.Component({
                        selector: 'my-message',
                        template: "\n        <article class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                {{ message.content }}\n            </div>\n            <footer class=\"panel-footer\">\n                <div class=\"author\">\n                    {{ message.username }}\n                </div>\n                <div class=\"config\">\n                    <a (click)=\"onEdit()\">Edit</a>\n                    <a (click)=\"onDelete()\">Delete</a>\n                </div>\n            </footer>\n        </article>\n    ",
                        styles: ["\n        .author {\n            display: inline-block;\n            font-style: italic;\n            font-size: 12px;\n            width: 80%;\n        }\n        .config {\n            display: inline-block;\n            text-align: right;\n            font-size: 12px;\n            width: 19%;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [message_service_2.MessageService])
                ], MessageComponent);
                return MessageComponent;
            }());
            exports_4("MessageComponent", MessageComponent);
        }
    }
});
System.register("messages/message-list.component", ["angular2/core", "messages/message.component", "messages/message.service"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_4, message_component_1, message_service_3;
    var MessageListComponent;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (message_component_1_1) {
                message_component_1 = message_component_1_1;
            },
            function (message_service_3_1) {
                message_service_3 = message_service_3_1;
            }],
        execute: function() {
            MessageListComponent = (function () {
                function MessageListComponent(_messageService) {
                    this._messageService = _messageService;
                }
                MessageListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._messageService.getMessages()
                        .subscribe(function (messages) {
                        _this.messages = messages;
                        _this._messageService.messages = messages;
                    });
                };
                MessageListComponent = __decorate([
                    core_4.Component({
                        selector: 'my-message-list',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <my-message *ngFor=\"#message of messages\" [message]=\"message\" (editClicked)=\"message.content = $event\"></my-message>     \n        </section>\n    ",
                        directives: [message_component_1.MessageComponent]
                    }), 
                    __metadata('design:paramtypes', [message_service_3.MessageService])
                ], MessageListComponent);
                return MessageListComponent;
            }());
            exports_5("MessageListComponent", MessageListComponent);
        }
    }
});
System.register("messages/messages.component", ["angular2/core", "messages/message-input.component", "messages/message-list.component"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_5, message_input_component_1, message_list_component_1;
    var MessagesComponent;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (message_input_component_1_1) {
                message_input_component_1 = message_input_component_1_1;
            },
            function (message_list_component_1_1) {
                message_list_component_1 = message_list_component_1_1;
            }],
        execute: function() {
            MessagesComponent = (function () {
                function MessagesComponent() {
                }
                MessagesComponent = __decorate([
                    core_5.Component({
                        selector: 'my-messages',
                        template: "\n        <div class=\"row spacing\">\n            <my-message-input></my-message-input>\n        </div>\n        <div class=\"row spacing\">\n            <my-message-list></my-message-list>\n        </div> \n    ",
                        directives: [message_list_component_1.MessageListComponent, message_input_component_1.MessageInputComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], MessagesComponent);
                return MessagesComponent;
            }());
            exports_6("MessagesComponent", MessagesComponent);
        }
    }
});
System.register("auth/user", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var User;
    return {
        setters:[],
        execute: function() {
            User = (function () {
                function User(email, password, firstName, lastName) {
                    this.email = email;
                    this.password = password;
                    this.firstName = firstName;
                    this.lastName = lastName;
                }
                return User;
            }());
            exports_7("User", User);
        }
    }
});
System.register("auth/auth.service", ["angular2/core", "angular2/http", "rxjs/Observable", 'rxjs/Rx'], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_6, http_2, Observable_2;
    var AuthService;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (Observable_2_1) {
                Observable_2 = Observable_2_1;
            },
            function (_2) {}],
        execute: function() {
            AuthService = (function () {
                function AuthService(_http) {
                    this._http = _http;
                }
                AuthService.prototype.signup = function (user) {
                    var body = JSON.stringify(user);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    return this._http.post('http://localhost:3000/user', body, { headers: headers })
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_2.Observable.throw(error.json()); });
                };
                AuthService.prototype.signin = function (user) {
                    var body = JSON.stringify(user);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    return this._http.post('http://localhost:3000/user/signin', body, { headers: headers })
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_2.Observable.throw(error.json()); });
                };
                AuthService = __decorate([
                    core_6.Injectable(), 
                    __metadata('design:paramtypes', [http_2.Http])
                ], AuthService);
                return AuthService;
            }());
            exports_8("AuthService", AuthService);
        }
    }
});
System.register("auth/signup.component", ["angular2/core", "angular2/common", "auth/user", "auth/auth.service"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_7, common_1, user_1, auth_service_1;
    var SignupComponent;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            SignupComponent = (function () {
                function SignupComponent(_fb, _authService) {
                    this._fb = _fb;
                    this._authService = _authService;
                }
                SignupComponent.prototype.onSubmit = function () {
                    var user = new user_1.User(this.myForm.value.email, this.myForm.value.password, this.myForm.value.firstName, this.myForm.value.lastName);
                    this._authService.signup(user)
                        .subscribe(function (data) { return console.log(data); }, function (error) { return console.error(error); });
                };
                SignupComponent.prototype.ngOnInit = function () {
                    this.myForm = this._fb.group({
                        firstName: ['', common_1.Validators.required],
                        lastName: ['', common_1.Validators.required],
                        email: ['', common_1.Validators.compose([
                                common_1.Validators.required,
                                this.isEmail
                            ])],
                        password: ['', common_1.Validators.required]
                    });
                };
                SignupComponent.prototype.isEmail = function (control) {
                    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
                        return { invalidMail: true };
                    }
                };
                SignupComponent = __decorate([
                    core_7.Component({
                        selector: 'my-signup',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form [ngFormModel]=\"myForm\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"form-group\">\n                    <label for=\"firstName\">First Name</label>\n                    <input [ngFormControl]=\"myForm.find('firstName')\" type=\"text\" id=\"firstName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"lastName\">Last Name</label>\n                    <input [ngFormControl]=\"myForm.find('lastName')\" type=\"text\" id=\"lastName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"email\">Mail</label>\n                    <input [ngFormControl]=\"myForm.find('email')\" type=\"email\" id=\"email\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input [ngFormControl]=\"myForm.find('password')\" type=\"password\" id=\"password\" class=\"form-control\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!myForm.valid\">Sign Up</button>\n            </form>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, auth_service_1.AuthService])
                ], SignupComponent);
                return SignupComponent;
            }());
            exports_9("SignupComponent", SignupComponent);
        }
    }
});
System.register("auth/signin.component", ["angular2/core", "angular2/common", "auth/user", "auth/auth.service", "angular2/router"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_8, common_2, user_2, auth_service_2, router_1;
    var SigninComponent;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (common_2_1) {
                common_2 = common_2_1;
            },
            function (user_2_1) {
                user_2 = user_2_1;
            },
            function (auth_service_2_1) {
                auth_service_2 = auth_service_2_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            SigninComponent = (function () {
                function SigninComponent(_fb, _authService, _router) {
                    this._fb = _fb;
                    this._authService = _authService;
                    this._router = _router;
                }
                SigninComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var user = new user_2.User(this.myForm.value.email, this.myForm.value.password);
                    this._authService.signin(user)
                        .subscribe(function (data) {
                        // localStorage is a built in JavaScript element not angular2
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                        _this._router.navigateByUrl('/');
                    }, function (error) { return console.error(error); });
                };
                SigninComponent.prototype.ngOnInit = function () {
                    this.myForm = this._fb.group({
                        email: ['', common_2.Validators.compose([
                                common_2.Validators.required,
                                this.isEmail
                            ])],
                        password: ['', common_2.Validators.required]
                    });
                };
                SigninComponent.prototype.isEmail = function (control) {
                    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
                        return { invalidMail: true };
                    }
                };
                SigninComponent = __decorate([
                    core_8.Component({
                        selector: 'my-signin',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form [ngFormModel]=\"myForm\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"form-group\">\n                    <label for=\"email\">Mail</label>\n                    <input [ngFormControl]=\"myForm.find('email')\" type=\"email\" id=\"email\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"password\">Password</label>\n                    <input [ngFormControl]=\"myForm.find('password')\" type=\"password\" id=\"password\" class=\"form-control\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!myForm.valid\">Sign Up</button>\n            </form>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [common_2.FormBuilder, auth_service_2.AuthService, router_1.Router])
                ], SigninComponent);
                return SigninComponent;
            }());
            exports_10("SigninComponent", SigninComponent);
        }
    }
});
System.register("auth/logout.component", ["angular2/core"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_9;
    var LogoutComponent;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            }],
        execute: function() {
            LogoutComponent = (function () {
                function LogoutComponent() {
                }
                LogoutComponent.prototype.onLogout = function () {
                };
                LogoutComponent = __decorate([
                    core_9.Component({
                        selector: 'my-logout',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <button class=\"btn btn-danger\" (click)=\"onLogout()\">Logout</button>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], LogoutComponent);
                return LogoutComponent;
            }());
            exports_11("LogoutComponent", LogoutComponent);
        }
    }
});
System.register("auth/authentication.component", ["angular2/core", "auth/signup.component", "angular2/router", "auth/signin.component", "auth/logout.component"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_10, signup_component_1, router_2, signin_component_1, logout_component_1;
    var AuthenticationComponent;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
            },
            function (signup_component_1_1) {
                signup_component_1 = signup_component_1_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (signin_component_1_1) {
                signin_component_1 = signin_component_1_1;
            },
            function (logout_component_1_1) {
                logout_component_1 = logout_component_1_1;
            }],
        execute: function() {
            AuthenticationComponent = (function () {
                function AuthenticationComponent() {
                }
                AuthenticationComponent = __decorate([
                    core_10.Component({
                        selector: 'my-auth',
                        template: "\n        <header class=\"row spacing\">\n            <nav class=\"col-md-8 col-md-offset-2\">\n                <ul class=\"nav nav-tabs\">\n                    <li><a [routerLink]=\"['Signup']\">Signup</a></li>\n                    <li><a [routerLink]=\"['Signin']\">Signin</a></li>\n                    <li><a [routerLink]=\"['Logout']\">Logout</a></li>\n                </ul>\n            </nav>\n        </header>\n        <div class=\"row spacing\">\n            <router-outlet></router-outlet>\n        </div>\n    ",
                        directives: [router_2.ROUTER_DIRECTIVES],
                        styles: ["\n        .router-link-active {\n            color: #555;\n            cursor: default;\n            background-color: #fff;\n            border: 1px solid #ddd;\n            border-bottom-color: transparent;\n        }\n    "]
                    }),
                    router_2.RouteConfig([
                        { path: '/signup', name: 'Signup', component: signup_component_1.SignupComponent, useAsDefault: true },
                        { path: '/signin', name: 'Signin', component: signin_component_1.SigninComponent },
                        { path: '/logout', name: 'Logout', component: logout_component_1.LogoutComponent },
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AuthenticationComponent);
                return AuthenticationComponent;
            }());
            exports_12("AuthenticationComponent", AuthenticationComponent);
        }
    }
});
System.register("header.component", ["angular2/core", "angular2/router"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_11, router_3;
    var HeaderComponent;
    return {
        setters:[
            function (core_11_1) {
                core_11 = core_11_1;
            },
            function (router_3_1) {
                router_3 = router_3_1;
            }],
        execute: function() {
            HeaderComponent = (function () {
                function HeaderComponent() {
                }
                HeaderComponent = __decorate([
                    core_11.Component({
                        selector: 'my-header',
                        template: "\n        <header class=\"row\">\n            <nav class=\"col-md-8 col-md-offset-2\">\n                <ul class=\"nav nav-pills\">\n                    <li><a [routerLink]=\"['Messages']\">Messages</a></li>\n                    <li><a [routerLink]=\"['Auth']\">Authentication</a></li>\n                </ul>\n            </nav>\n        </header>\n    ",
                        directives: [router_3.ROUTER_DIRECTIVES],
                        styles: ["\n        header {\n            margin-bottom: 20px;\n        }\n    \n        ul {\n          text-align: center;  \n        }\n        \n        li {\n            float: none;\n            display: inline-block;\n        }\n        \n        .router-link-active {\n            background-color: #337ab7;\n            color: white;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [])
                ], HeaderComponent);
                return HeaderComponent;
            }());
            exports_13("HeaderComponent", HeaderComponent);
        }
    }
});
System.register("app.component", ['angular2/core', "angular2/router", "messages/messages.component", "auth/authentication.component", "header.component"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_12, router_4, messages_component_1, authentication_component_1, header_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_12_1) {
                core_12 = core_12_1;
            },
            function (router_4_1) {
                router_4 = router_4_1;
            },
            function (messages_component_1_1) {
                messages_component_1 = messages_component_1_1;
            },
            function (authentication_component_1_1) {
                authentication_component_1 = authentication_component_1_1;
            },
            function (header_component_1_1) {
                header_component_1 = header_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_12.Component({
                        selector: 'my-app',
                        template: " \n        <div class=\"container\">\n            <my-header></my-header>\n            <router-outlet></router-outlet>\n        </div>\n    ",
                        directives: [router_4.ROUTER_DIRECTIVES, header_component_1.HeaderComponent]
                    }),
                    router_4.RouteConfig([
                        { path: '/', name: 'Messages', component: messages_component_1.MessagesComponent, useAsDefault: true },
                        { path: '/auth/...', name: 'Auth', component: authentication_component_1.AuthenticationComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_14("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "messages/message.service", "angular2/router", "angular2/core", "angular2/http", "auth/auth.service"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var browser_1, app_component_1, message_service_4, router_5, core_13, http_3, auth_service_3;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (message_service_4_1) {
                message_service_4 = message_service_4_1;
            },
            function (router_5_1) {
                router_5 = router_5_1;
            },
            function (core_13_1) {
                core_13 = core_13_1;
            },
            function (http_3_1) {
                http_3 = http_3_1;
            },
            function (auth_service_3_1) {
                auth_service_3 = auth_service_3_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [message_service_4.MessageService, auth_service_3.AuthService, router_5.ROUTER_PROVIDERS, core_13.provide(router_5.LocationStrategy, { useClass: router_5.HashLocationStrategy }), http_3.HTTP_PROVIDERS]);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc3NhZ2VzL21lc3NhZ2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLWlucHV0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2UuY29tcG9uZW50LnRzIiwibWVzc2FnZXMvbWVzc2FnZS1saXN0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2VzLmNvbXBvbmVudC50cyIsImF1dGgvdXNlci50cyIsImF1dGgvYXV0aC5zZXJ2aWNlLnRzIiwiYXV0aC9zaWdudXAuY29tcG9uZW50LnRzIiwiYXV0aC9zaWduaW4uY29tcG9uZW50LnRzIiwiYXV0aC9sb2dvdXQuY29tcG9uZW50LnRzIiwiYXV0aC9hdXRoZW50aWNhdGlvbi5jb21wb25lbnQudHMiLCJoZWFkZXIuY29tcG9uZW50LnRzIiwiYXBwLmNvbXBvbmVudC50cyIsImJvb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUFBO2dCQU1JLGlCQUFhLE9BQWUsRUFBRSxTQUFrQixFQUFFLFFBQWlCLEVBQUUsTUFBZTtvQkFDaEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO29CQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLENBQUM7Z0JBQ0wsY0FBQztZQUFELENBWkEsQUFZQyxJQUFBO1lBWkQsNkJBWUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQ05EO2dCQU1JLHdCQUFxQixLQUFVO29CQUFWLFVBQUssR0FBTCxLQUFLLENBQUs7b0JBTC9CLHFGQUFxRjtvQkFDckYsMklBQTJJO29CQUMzSSxhQUFRLEdBQWMsRUFBRSxDQUFDO29CQUN6QixrQkFBYSxHQUFHLElBQUksbUJBQVksRUFBVyxDQUFDO2dCQUVWLENBQUM7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LENBQUMsMEJBQWlCLEVBQUUsa0NBQWUsQ0FBQztxQkFDbkQsQ0FBQztvQkFDRCxvQkFBVyxDQUFDO3dCQUNULEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxzQ0FBaUIsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDO3dCQUMvRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsa0RBQXVCLEVBQUM7cUJBQ3hFLENBQUM7O2dDQUFBO2dCQUdGLG1CQUFDO1lBQUQsQ0FGQSxBQUVDLElBQUE7WUFGRCx3Q0FFQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQ1pELG1CQUFTLENBQUMsNEJBQVksRUFBRSxDQUFDLGdDQUFjLEVBQUUsMEJBQVcsRUFBRSx5QkFBZ0IsRUFBRSxlQUFPLENBQUMseUJBQWdCLEVBQUUsRUFBQyxRQUFRLEVBQUUsNkJBQW9CLEVBQUMsQ0FBQyxFQUFFLHFCQUFjLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4uLy4uLy4uL2FuZ3VsYXIyYXBwL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgdXNlcm5hbWU6IHN0cmluZztcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgICB1c2VySWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yIChjb250ZW50OiBzdHJpbmcsIG1lc3NhZ2VJZD86IHN0cmluZywgdXNlcm5hbWU/OiBzdHJpbmcsIHVzZXJJZD86IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICB0aGlzLm1lc3NhZ2VJZCA9IG1lc3NhZ2VJZDtcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9XG59IiwiaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQge0h0dHAsIEhlYWRlcnN9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XG5pbXBvcnQge0luamVjdGFibGUsIEV2ZW50RW1pdHRlcn0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCAncnhqcy9SeCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXNzYWdlU2VydmljZSB7XG4gICAgLy8gUmVtZW1iZXIgd2hlbiBtYWtpbmcgY2FsbHMgdG8gdGhpcyBjbGFzcywgd2UgYXJlIHVzaW5nIHRoZSBzYW1lIGFycmF5IG9mIE1lc3NhZ2VzLlxuICAgIC8vIFRoZSBzdWJzY3JpYmUgT2JzZXJ2YWJsZSB3aWxsIGFkZCB0byB0aGF0IGFycmF5LCBnaXZpbmcgbGl2ZSB1cGRhdCBmdW5jdGlvbmFsaXR5IHdpdGhvdXQgaGF2aW5nIHRvIGdvIGJhY2sgdG8gdGhlIGRiIGFuZCByZWxvYWQgdGhlIHBhZ2VcbiAgICBtZXNzYWdlczogTWVzc2FnZVtdID0gW107XG4gICAgbWVzc2FnZUlzRWRpdCA9IG5ldyBFdmVudEVtaXR0ZXI8TWVzc2FnZT4oKTtcblxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwOkh0dHApIHt9XG5cbiAgICBhZGRNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcbiAgICAgICAgLy8gSGVyZSB3ZXJlIGFyZSByZXR1cm5pbmcgdGhlIE9ic2VydmFibGUuXG4gICAgICAgIC8vIFRoZSAnLm1hcCgpJyBmdW5jdGlvbiBpcyBoYW5kbGVkIGJ5IHJ4anNcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UnLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbigpLm9iajtcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGEuY29udGVudCwgZGF0YS5faWQsICdEdW1teScsIG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cblxuICAgIGdldE1lc3NhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9tZXNzYWdlJylcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXNwb25zZS5qc29uKCkub2JqO1xuICAgICAgICAgICAgICAgIGxldCBvYmpzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGFbaV0uY29udGVudCwgZGF0YVtpXS5faWQsICdEdW1teScsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBvYmpzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqcztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kcyB0aGUgdXBkYXRlIGJhY2sgdG8gdGhlIHNlcnZlclxuICAgIHVwZGF0ZU1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wYXRjaCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UvJyArIG1lc3NhZ2UubWVzc2FnZUlkLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cblxuICAgIC8vIExvYWRzIHRoZSBlZGl0ICd2aWV3JyB0byBtYWtlIGl0IGVkaXRhYmxlXG4gICAgZWRpdE1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VJc0VkaXQuZW1pdChtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBkZWxldGVNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5zcGxpY2UodGhpcy5tZXNzYWdlcy5pbmRleE9mKG1lc3NhZ2UpLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAuZGVsZXRlKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvbWVzc2FnZS8nICsgbWVzc2FnZS5tZXNzYWdlSWQpXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tIFwiLi9tZXNzYWdlLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1tZXNzYWdlLWlucHV0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxuICAgICAgICAgICAgPGZvcm0gKG5nU3VibWl0KT1cIm9uU3VibWl0KGYudmFsdWUpXCIgI2Y9XCJuZ0Zvcm1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29udGVudFwiPkNvbnRlbnQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmdDb250cm9sPVwiY29udGVudFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImNvbnRlbnRcIiAjaW5wdXQgW25nTW9kZWxdPVwibWVzc2FnZT8uY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+e3sgIW1lc3NhZ2UgPyAnU2VuZCBNZXNzYWdlJyA6ICdTYXZlIE1lc3NhZ2UnIH19PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIChjbGljayk9XCJvbkNhbmNlbCgpXCIgKm5nSWY9XCJtZXNzYWdlXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcbiAgICBtZXNzYWdlOk1lc3NhZ2UgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6TWVzc2FnZVNlcnZpY2UpIHt9XG5cbiAgICBvblN1Ym1pdChmb3JtOmFueSkge1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlKSB7XG4gICAgICAgICAgICAvLyBFZGl0XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuY29udGVudCA9IGZvcm0uY29udGVudDtcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnVwZGF0ZU1lc3NhZ2UodGhpcy5tZXNzYWdlKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPT4gY29uc29sZS5sb2coZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZTpNZXNzYWdlID0gbmV3IE1lc3NhZ2UoZm9ybS5jb250ZW50LCBudWxsLCAnRHVtbXknKTtcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UubWVzc2FnZXMucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DYW5jZWwoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG51bGw7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2VJc0VkaXQuc3Vic2NyaWJlKFxuICAgICAgICAgICAgbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSBcIi4vbWVzc2FnZVwiO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSBcIi4vbWVzc2FnZS5zZXJ2aWNlXCI7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LW1lc3NhZ2UnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICB7eyBtZXNzYWdlLmNvbnRlbnQgfX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGZvb3RlciBjbGFzcz1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhdXRob3JcIj5cbiAgICAgICAgICAgICAgICAgICAge3sgbWVzc2FnZS51c2VybmFtZSB9fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb25maWdcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgKGNsaWNrKT1cIm9uRWRpdCgpXCI+RWRpdDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPGEgKGNsaWNrKT1cIm9uRGVsZXRlKClcIj5EZWxldGU8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgPC9hcnRpY2xlPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICAuYXV0aG9yIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIHdpZHRoOiA4MCU7XG4gICAgICAgIH1cbiAgICAgICAgLmNvbmZpZyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIHdpZHRoOiAxOSU7XG4gICAgICAgIH1cbiAgICBgXVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlQ29tcG9uZW50IHtcbiAgICBASW5wdXQoKSBtZXNzYWdlOk1lc3NhZ2U7XG4gICAgQE91dHB1dCgpIGVkaXRDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7fVxuXG4gICAgb25FZGl0KCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5lZGl0TWVzc2FnZSh0aGlzLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIG9uRGVsZXRlKCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5kZWxldGVNZXNzYWdlKHRoaXMubWVzc2FnZSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgZGF0YSA9PiBjb25zb2xlLmxvZyhkYXRhKSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgKTtcbiAgICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCB7TWVzc2FnZUNvbXBvbmVudH0gZnJvbSBcIi4vbWVzc2FnZS5jb21wb25lbnRcIjtcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSBcIi4vbWVzc2FnZVwiO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSBcIi4vbWVzc2FnZS5zZXJ2aWNlXCI7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LW1lc3NhZ2UtbGlzdCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cbiAgICAgICAgICAgIDxteS1tZXNzYWdlICpuZ0Zvcj1cIiNtZXNzYWdlIG9mIG1lc3NhZ2VzXCIgW21lc3NhZ2VdPVwibWVzc2FnZVwiIChlZGl0Q2xpY2tlZCk9XCJtZXNzYWdlLmNvbnRlbnQgPSAkZXZlbnRcIj48L215LW1lc3NhZ2U+ICAgICBcbiAgICAgICAgPC9zZWN0aW9uPlxuICAgIGAsXG4gICAgZGlyZWN0aXZlczogW01lc3NhZ2VDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge31cblxuICAgIG1lc3NhZ2VzOiBNZXNzYWdlW107XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZ2V0TWVzc2FnZXMoKVxuICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICBtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UubWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCB7TWVzc2FnZUlucHV0Q29tcG9uZW50fSBmcm9tIFwiLi9tZXNzYWdlLWlucHV0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHtNZXNzYWdlTGlzdENvbXBvbmVudH0gZnJvbSBcIi4vbWVzc2FnZS1saXN0LmNvbXBvbmVudFwiO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1tZXNzYWdlcycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XG4gICAgICAgICAgICA8bXktbWVzc2FnZS1pbnB1dD48L215LW1lc3NhZ2UtaW5wdXQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IHNwYWNpbmdcIj5cbiAgICAgICAgICAgIDxteS1tZXNzYWdlLWxpc3Q+PC9teS1tZXNzYWdlLWxpc3Q+XG4gICAgICAgIDwvZGl2PiBcbiAgICBgLFxuICAgIGRpcmVjdGl2ZXM6IFtNZXNzYWdlTGlzdENvbXBvbmVudCwgTWVzc2FnZUlucHV0Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlc0NvbXBvbmVudCB7XG4gICAgXG59IiwiZXhwb3J0IGNsYXNzIFVzZXIge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbWFpbDogc3RyaW5nLCBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZywgcHVibGljIGZpcnN0TmFtZT86IHN0cmluZywgcHVibGljIGxhc3ROYW1lPzogc3RyaW5nKSB7fVxufSIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCB7SHR0cCwgSGVhZGVyc30gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIi4vdXNlclwiO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XG5pbXBvcnQgJ3J4anMvUngnO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcblx0Y29uc3RydWN0b3IgKHByaXZhdGUgX2h0dHA6IEh0dHApIHt9XG5cblx0c2lnbnVwKHVzZXI6IFVzZXIpIHtcblx0XHRjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG5cdFx0cmV0dXJuIHRoaXMuX2h0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXInLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXG5cdFx0XHQubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcblx0XHRcdC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuXHR9XG5cblx0c2lnbmluKHVzZXI6IFVzZXIpIHtcblx0XHRjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG5cdFx0cmV0dXJuIHRoaXMuX2h0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXIvc2lnbmluJywgYm9keSwge2hlYWRlcnM6IGhlYWRlcnN9KVxuXHRcdFx0Lm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG5cdFx0XHQuY2F0Y2goZXJyb3IgPT4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkpKTtcblx0fVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBDb250cm9sR3JvdXAsIFZhbGlkYXRvcnMsIENvbnRyb2x9IGZyb20gXCJhbmd1bGFyMi9jb21tb25cIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIi4vdXNlclwiO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSBcIi4vYXV0aC5zZXJ2aWNlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktc2lnbnVwJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxuICAgICAgICAgICAgPGZvcm0gW25nRm9ybU1vZGVsXT1cIm15Rm9ybVwiIChuZ1N1Ym1pdCk9XCJvblN1Ym1pdCgpXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpcnN0TmFtZVwiPkZpcnN0IE5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ2ZpcnN0TmFtZScpXCIgdHlwZT1cInRleHRcIiBpZD1cImZpcnN0TmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhc3ROYW1lXCI+TGFzdCBOYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IFtuZ0Zvcm1Db250cm9sXT1cIm15Rm9ybS5maW5kKCdsYXN0TmFtZScpXCIgdHlwZT1cInRleHRcIiBpZD1cImxhc3ROYW1lXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZW1haWxcIj5NYWlsPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IFtuZ0Zvcm1Db250cm9sXT1cIm15Rm9ybS5maW5kKCdlbWFpbCcpXCIgdHlwZT1cImVtYWlsXCIgaWQ9XCJlbWFpbFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ3Bhc3N3b3JkJylcIiB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIFtkaXNhYmxlZF09XCIhbXlGb3JtLnZhbGlkXCI+U2lnbiBVcDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBTaWdudXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIG15Rm9ybTogQ29udHJvbEdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZmI6Rm9ybUJ1aWxkZXIsIHByaXZhdGUgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIG9uU3VibWl0KCkge1xuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIodGhpcy5teUZvcm0udmFsdWUuZW1haWwsIHRoaXMubXlGb3JtLnZhbHVlLnBhc3N3b3JkLCB0aGlzLm15Rm9ybS52YWx1ZS5maXJzdE5hbWUsIHRoaXMubXlGb3JtLnZhbHVlLmxhc3ROYW1lKTtcbiAgICAgICAgdGhpcy5fYXV0aFNlcnZpY2Uuc2lnbnVwKHVzZXIpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIGRhdGEgPT4gY29uc29sZS5sb2coZGF0YSksXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubXlGb3JtID0gdGhpcy5fZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZmlyc3ROYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgICAgICAgbGFzdE5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBlbWFpbDogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgdGhpcy5pc0VtYWlsXG4gICAgICAgICAgICBdKV0sXG4gICAgICAgICAgICBwYXNzd29yZDogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRW1haWwoY29udHJvbDogQ29udHJvbCk6IHtbczogc3RyaW5nXTogYm9vbGVhbn0ge1xuICAgICAgICBpZiAoIWNvbnRyb2wudmFsdWUubWF0Y2goXCJbYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cIikpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW52YWxpZE1haWw6IHRydWV9O1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge0NvbnRyb2xHcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIENvbnRyb2x9IGZyb20gXCJhbmd1bGFyMi9jb21tb25cIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIi4vdXNlclwiO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSBcIi4vYXV0aC5zZXJ2aWNlXCI7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcImFuZ3VsYXIyL3JvdXRlclwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LXNpZ25pbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cbiAgICAgICAgICAgIDxmb3JtIFtuZ0Zvcm1Nb2RlbF09XCJteUZvcm1cIiAobmdTdWJtaXQpPVwib25TdWJtaXQoKVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFwiPk1haWw8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ2VtYWlsJylcIiB0eXBlPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBbbmdGb3JtQ29udHJvbF09XCJteUZvcm0uZmluZCgncGFzc3dvcmQnKVwiIHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgW2Rpc2FibGVkXT1cIiFteUZvcm0udmFsaWRcIj5TaWduIFVwPC9idXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25pbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgbXlGb3JtOiBDb250cm9sR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9mYjpGb3JtQnVpbGRlciwgcHJpdmF0ZSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge31cblxuICAgIG9uU3VibWl0KCkge1xuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIodGhpcy5teUZvcm0udmFsdWUuZW1haWwsIHRoaXMubXlGb3JtLnZhbHVlLnBhc3N3b3JkKTtcbiAgICAgICAgdGhpcy5fYXV0aFNlcnZpY2Uuc2lnbmluKHVzZXIpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2NhbFN0b3JhZ2UgaXMgYSBidWlsdCBpbiBKYXZhU2NyaXB0IGVsZW1lbnQgbm90IGFuZ3VsYXIyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIGRhdGEudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcklkJywgZGF0YS51c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGVCeVVybCgnLycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubXlGb3JtID0gdGhpcy5fZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZW1haWw6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbFxuICAgICAgICAgICAgXSldLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0VtYWlsKGNvbnRyb2w6IENvbnRyb2wpOiB7W3M6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgICAgICAgaWYgKCFjb250cm9sLnZhbHVlLm1hdGNoKFwiW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XCIpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2ludmFsaWRNYWlsOiB0cnVlfTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktbG9nb3V0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgKGNsaWNrKT1cIm9uTG9nb3V0KClcIj5Mb2dvdXQ8L2J1dHRvbj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgTG9nb3V0Q29tcG9uZW50IHtcblxuICAgIG9uTG9nb3V0KCkge1xuXG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtTaWdudXBDb21wb25lbnR9IGZyb20gXCIuL3NpZ251cC5jb21wb25lbnRcIjtcbmltcG9ydCB7Um91dGVDb25maWcsIFJPVVRFUl9ESVJFQ1RJVkVTfSBmcm9tIFwiYW5ndWxhcjIvcm91dGVyXCI7XG5pbXBvcnQge1NpZ25pbkNvbXBvbmVudH0gZnJvbSBcIi4vc2lnbmluLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtMb2dvdXRDb21wb25lbnR9IGZyb20gXCIuL2xvZ291dC5jb21wb25lbnRcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktYXV0aCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XG4gICAgICAgICAgICA8bmF2IGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1NpZ251cCddXCI+U2lnbnVwPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1NpZ25pbiddXCI+U2lnbmluPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ0xvZ291dCddXCI+TG9nb3V0PC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XG4gICAgICAgICAgICA8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXSxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5yb3V0ZXItbGluay1hY3RpdmUge1xuICAgICAgICAgICAgY29sb3I6ICM1NTU7XG4gICAgICAgICAgICBjdXJzb3I6IGRlZmF1bHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG4gICAgYF1cbn0pXG5AUm91dGVDb25maWcoW1xuICAgIHtwYXRoOiAnL3NpZ251cCcsIG5hbWU6ICdTaWdudXAnLCBjb21wb25lbnQ6IFNpZ251cENvbXBvbmVudCwgdXNlQXNEZWZhdWx0OiB0cnVlfSxcbiAgICB7cGF0aDogJy9zaWduaW4nLCBuYW1lOiAnU2lnbmluJywgY29tcG9uZW50OiBTaWduaW5Db21wb25lbnR9LFxuICAgIHtwYXRoOiAnL2xvZ291dCcsIG5hbWU6ICdMb2dvdXQnLCBjb21wb25lbnQ6IExvZ291dENvbXBvbmVudH0sXG5dKVxuZXhwb3J0IGNsYXNzIEF1dGhlbnRpY2F0aW9uQ29tcG9uZW50IHtcblxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtST1VURVJfRElSRUNUSVZFU30gZnJvbSBcImFuZ3VsYXIyL3JvdXRlclwiO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1oZWFkZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxoZWFkZXIgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXBpbGxzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ01lc3NhZ2VzJ11cIj5NZXNzYWdlczwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW3JvdXRlckxpbmtdPVwiWydBdXRoJ11cIj5BdXRoZW50aWNhdGlvbjwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgPC9oZWFkZXI+XG4gICAgYCxcbiAgICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgaGVhZGVyIHtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgdWwge1xuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsaSB7XG4gICAgICAgICAgICBmbG9hdDogbm9uZTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLnJvdXRlci1saW5rLWFjdGl2ZSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzM3YWI3O1xuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICB9XG4gICAgYF1cbn0pXG5leHBvcnQgY2xhc3MgSGVhZGVyQ29tcG9uZW50IHtcbiAgICBcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JvdXRlQ29uZmlnLCBST1VURVJfRElSRUNUSVZFU30gZnJvbSBcImFuZ3VsYXIyL3JvdXRlclwiO1xuaW1wb3J0IHtNZXNzYWdlc0NvbXBvbmVudH0gZnJvbSBcIi4vbWVzc2FnZXMvbWVzc2FnZXMuY29tcG9uZW50XCI7XG5pbXBvcnQge0F1dGhlbnRpY2F0aW9uQ29tcG9uZW50fSBmcm9tIFwiLi9hdXRoL2F1dGhlbnRpY2F0aW9uLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtIZWFkZXJDb21wb25lbnR9IGZyb20gXCIuL2hlYWRlci5jb21wb25lbnRcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcbiAgICB0ZW1wbGF0ZTogYCBcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPG15LWhlYWRlcj48L215LWhlYWRlcj5cbiAgICAgICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVMsIEhlYWRlckNvbXBvbmVudF1cbn0pXG5AUm91dGVDb25maWcoW1xuICAgIHtwYXRoOiAnLycsIG5hbWU6ICdNZXNzYWdlcycsIGNvbXBvbmVudDogTWVzc2FnZXNDb21wb25lbnQsIHVzZUFzRGVmYXVsdDogdHJ1ZX0sXG4gICAge3BhdGg6ICcvYXV0aC8uLi4nLCBuYW1lOiAnQXV0aCcsIGNvbXBvbmVudDogQXV0aGVudGljYXRpb25Db21wb25lbnR9XG5dKVxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIyL3R5cGluZ3MvYnJvd3Nlci5kLnRzXCIvPlxuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuaW1wb3J0IHtBcHBDb21wb25lbnR9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gXCIuL21lc3NhZ2VzL21lc3NhZ2Uuc2VydmljZVwiO1xuaW1wb3J0IHtST1VURVJfUFJPVklERVJTLCBMb2NhdGlvblN0cmF0ZWd5LCBIYXNoTG9jYXRpb25TdHJhdGVneX0gZnJvbSBcImFuZ3VsYXIyL3JvdXRlclwiO1xuaW1wb3J0IHtwcm92aWRlfSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtIVFRQX1BST1ZJREVSU30gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gXCIuL2F1dGgvYXV0aC5zZXJ2aWNlXCI7XG5cbmJvb3RzdHJhcChBcHBDb21wb25lbnQsIFtNZXNzYWdlU2VydmljZSwgQXV0aFNlcnZpY2UsIFJPVVRFUl9QUk9WSURFUlMsIHByb3ZpZGUoTG9jYXRpb25TdHJhdGVneSwge3VzZUNsYXNzOiBIYXNoTG9jYXRpb25TdHJhdGVneX0pLCBIVFRQX1BST1ZJREVSU10pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
