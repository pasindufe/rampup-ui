import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  HttpClient,
  HttpClientModule,
  HttpClientJsonpModule,
} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component'

import { GridModule } from '@progress/kendo-angular-grid'
import { DropDownsModule } from '@progress/kendo-angular-dropdowns'
import { DateInputsModule } from '@progress/kendo-angular-dateinputs'
import { NotificationModule } from '@progress/kendo-angular-notification'

import { APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { InMemoryCache } from '@apollo/client/core'

import { StudentService } from './services/student-api-service'
import { baseConfig } from './services/config'
import { AlertNotificationService } from './services/alert-notification-service'
import { DialogsModule } from '@progress/kendo-angular-dialog'

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownsModule,
    DateInputsModule,
    NotificationModule,
    DialogsModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: baseConfig(process.env.NODE_ENV).graphQLUrl,
          }),
        }
      },
      deps: [HttpLink],
    },
    StudentService,
    AlertNotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
