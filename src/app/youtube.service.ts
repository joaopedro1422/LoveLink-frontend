import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http'; // Aqui importa a função





@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiKey = 'AIzaSyB3ZVZejC60eF4lL5Zspb0YEdL3eWQ3JUo';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';
  constructor(private http: HttpClient) { }
  searchVideos(query: string) {
    const params = {
      part: 'snippet',
      q: query,
      key: this.apiKey,
      maxResults: '5',
      type: 'video',
    };

    return this.http.get(this.apiUrl, { params });
  }
  checkEmbeddable(videoId: string) {
    const url = 'https://www.googleapis.com/youtube/v3/videos';
    const params = {
      part: 'status',
      id: videoId,
      key: this.apiKey,
    };
  
    return this.http.get(url, { params });
  }
}
