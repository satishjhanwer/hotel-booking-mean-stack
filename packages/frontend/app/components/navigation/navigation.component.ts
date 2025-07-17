import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { SessionService } from "../../services/session.service";
import { AuthService } from "../../services/auth.service";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
    selector: "app-navigation",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: "./navigation.component.html",
    styleUrl: "./navigation.component.scss"
})
export class NavigationComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.sessionService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: response => {
        if (response.status === 200) {
          this.sessionService.clearToken();
          this.sessionService.clearUserProfile();
          this.router.navigate(["/login"]);
        }
      },
      error: err => {
        console.error("Logout failed:", err);
        this.snackbar.showMessage("Login failed. Please check your credentials and try again.");
      },
    });
  }
}
