import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private apiUrl = environment.apiUrl + "/bookings";

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }
}
