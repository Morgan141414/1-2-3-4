import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainContentComponent} from './layout/main-content/main-content.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'saphena-web';
}
