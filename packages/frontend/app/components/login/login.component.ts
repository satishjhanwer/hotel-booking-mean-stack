import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SnackbarService } from "../../services/snackbar.service";
import { SessionService } from "../../services/session.service";

@Component({
    selector: "app-login",
    styleUrl: "./login.component.scss",
    templateUrl: "./login.component.html",
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private sessionService: SessionService
  ) {
    this.loginForm = this.fb.group({
      password: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: response => {
        this.snackbar.showMessage("Login successful!");
        this.sessionService.setToken(response.token || "");
        this.sessionService.setUserProfile(response.user || null);
        if (response?.user?.isAdmin) {
          this.router.navigate(["/admin"]);
        } else {
          this.router.navigate(["/profile"]);
        }
      },
      error: error => {
        console.error("Login failed", error);
        this.snackbar.showMessage("Login failed. Please check your credentials and try again.");
      },
    });
  }
}
