import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

interface Hotel {
  id: string;
  name: string;
}

interface Booking {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
}

@Injectable({
  providedIn: "root",
})
export class HotelService {
  private apiUrl = `${environment.apiUrl}/hotels`;
  private adminAPIUrl = `${environment.apiUrl}/admin/hotels`;

  constructor(private http: HttpClient) {}

  addHotel(hotelData: any): Observable<any> {
    return this.http.post(`${this.adminAPIUrl}`, hotelData);
  }

  deleteHotel(hotelId: string): Observable<any> {
    return this.http.delete(`${this.adminAPIUrl}/${hotelId}`);
  }

  getHotels(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getHotelDetails(hotelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${hotelId}`);
  }

  searchHotels(query: string, page: number, limit: number): Observable<Hotel[]> {
    const params = new HttpParams().set("query", query).set("page", page.toString()).set("limit", limit.toString());

    return this.http.get<Hotel[]>(`${this.apiUrl}/search`, { params });
  }
}
