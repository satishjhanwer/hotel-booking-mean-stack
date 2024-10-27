import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../services/session.service";

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  const loggedIn = sessionService.isAuthenticated();
  if (loggedIn) {
    return true;
  }
  router.navigate(["/login"]);
  return false;
};
