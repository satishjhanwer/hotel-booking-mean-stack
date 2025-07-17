import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HotelService } from "../../services/hotel.service";
import { BookingService } from "../../services/booking.service";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-profile",
    styleUrl: "./profile.component.scss",
    templateUrl: "./profile.component.html",
    imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  term = new FormControl("");
  hotels: any[] = [];
  bookings: any[] = [];

  constructor(private hotelService: HotelService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getHotels();
    this.getBookings();
  }

  searchHotels(): void {
    const searchTerm = this.term.value || "";
    this.hotelService.searchHotels(searchTerm, 1, 10).subscribe(hotels => {
      this.hotels = hotels;
    });
  }

  getHotels(): void {
    this.hotelService.getHotels().subscribe(hotels => (this.hotels = hotels));
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => (this.bookings = bookings));
  }

  cancelBooking(bookingId: string): void {
    this.bookingService.cancelBooking(bookingId).subscribe(() => {
      this.getBookings();
    });
  }
}
