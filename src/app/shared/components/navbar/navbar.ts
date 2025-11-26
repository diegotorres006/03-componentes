import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ThemeSwitcher, RouterLinkActive],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar { }