import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Directive, HostListener } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "@firebase/auth";
@Directive({
  selector: "[googleSso]",
})
export class GoogleSsoDirective {

  constructor(private angularFireAuth: AngularFireAuth) {
    
  }
  @HostListener("click")
  async onClick() {
    const creds = await this.angularFireAuth.signInWithPopup(
      new GoogleAuthProvider(),
    );
  }
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
