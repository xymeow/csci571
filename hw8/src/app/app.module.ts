import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';
import { CapToVarPipe } from './cap-to-var.pipe';
import { SearchService } from './search.service';
import { ResultTableComponent } from './result-table/result-table.component';
import { AgmCoreModule } from '@agm/core';
import { AutocompleteDirective } from './autocomplete.directive';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    CapToVarPipe,
    ResultTableComponent,
    AutocompleteDirective
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBXJZOfWGzQ9I31v3liRqb4RumMPeC2Tbo",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [GeolocationService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
