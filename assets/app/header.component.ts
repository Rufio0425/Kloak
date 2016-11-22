import {Component} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";
@Component({
    selector: 'my-header',
    template: `
        <header class="row">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-pills">
                    <li><a [routerLink]="['Messages']" class="buttonHeader">Messages</a></li>
                    <li><a [routerLink]="['Auth']" class="buttonHeader">Authentication</a></li>
                </ul>
            </nav>
        </header>
    `,
    directives: [ROUTER_DIRECTIVES],
    styles: [`
        header {
            margin-bottom: 20px;
        }
    
        ul {
          text-align: center;
        }
        
        li {
            float: none;
            display: inline-block;
        }
        
        a {
            color:white;
        }
    `]
})
export class HeaderComponent {
    
}