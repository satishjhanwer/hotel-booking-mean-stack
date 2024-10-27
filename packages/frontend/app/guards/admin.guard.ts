import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "../services/session.service";

export const AdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  if (sessionService.isAdmin()) {
    return true;
  } else {
    router.navigate(["/profile"]);
    return false;
  }
};
