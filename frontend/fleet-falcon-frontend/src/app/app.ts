import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { ToastComponent } from './core/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private readonly router: Router) {}

  protected showNavbar(): boolean {
    return !this.router.url.startsWith('/login');
  }
}
