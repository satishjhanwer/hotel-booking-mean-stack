import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  standalone: true,
  selector: "app-register",
  styleUrl: "./register.component.scss",
  templateUrl: "./register.component.html",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackbar: SnackbarService) {
    this.registerForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm.value).subscribe({
      next: response => {
        this.snackbar.showMessage("Registration successful! Please log in.");
        this.router.navigate(["/login"]);
      },
      error: error => {
        console.error("Registration failed", error);
        this.snackbar.showMessage("Registration failed; please try again.");
      },
    });
  }
}
