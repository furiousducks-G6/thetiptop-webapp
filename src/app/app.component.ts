import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,  // Indique que ce composant est autonome
  imports: [RouterOutlet],  // Déclarez les imports nécessaires ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'thetiptop-web';
}
