import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../../services/session.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "app-not-found",
  styleUrl: "./not-found.component.scss",
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  isLoggedIn = false;

  constructor(private router: Router, private sessionService: SessionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sessionService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      this.cdr.detectChanges();
    });
  }

  navigateHome() {
    this.router.navigate(["/"]);
  }

  navigateProfile() {
    this.router.navigate(["/profile"]);
  }
}
