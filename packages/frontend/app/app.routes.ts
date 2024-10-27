import { Routes } from "@angular/router";

import { AdminGuard } from "./guards/admin.guard";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { RegisterComponent } from "./components/register/register.component";
import { BookingComponent } from "./components/booking/booking.component";
import { AuthGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./components/not-found/not-found.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "book-hotel/:id", component: BookingComponent, canActivate: [AuthGuard] },
  { path: "**", component: NotFoundComponent },
];
