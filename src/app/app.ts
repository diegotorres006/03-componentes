import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from "./shared/components/navbar/navbar";
import { Footer } from "./shared/components/footer/footer";
import { BackToTop } from "./shared/components/back-to-top/back-to-top";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, Footer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-03');
}
