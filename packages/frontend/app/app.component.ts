import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  standalone: true,
  selector: "app-root",
  styleUrl: "./app.component.scss",
  templateUrl: "./app.component.html",
  imports: [RouterOutlet, CommonModule, NavigationComponent, FooterComponent],
})
export class AppComponent {
  constructor() {}
}
