import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SessionService } from "../../services/session.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-home",
    styleUrl: "./home.component.scss",
    templateUrl: "./home.component.html",
    imports: [RouterModule, CommonModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private sessionService: SessionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sessionService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      this.cdr.detectChanges();
    });
  }
}
