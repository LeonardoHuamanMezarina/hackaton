import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_MODULES } from './material.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Sistema de Biblioteca Digital';
}
