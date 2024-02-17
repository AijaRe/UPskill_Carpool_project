import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
  @Output() submitted = new EventEmitter<{ email: string; password: string }>();

  email: string = '';
  password: string = '';

  onSubmit(): void {
    this.submitted.emit({ email: this.email, password: this.password });
  }
}
