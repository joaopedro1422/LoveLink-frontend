import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  clientId = "1ea6c6459eb94120ace724ce71ca234e";
  clientSecret = "53d1c87c3ca14d2485c23f0ed1ac8f61";
  constructor() { }

  trocaCodigoPorToken(code: string){
      let body ={
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://127.0.0.1:4200/criarCarta"
      }
      const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);
    
   
      axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: new URLSearchParams(Object.entries(body)).toString(),
        headers: {
          Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response =>{
        const accessToken = response.data.access_token;
        localStorage.setItem('spotify_access_token', accessToken); // <- aqui armazenamos
        console.log("Access token armazenado:", accessToken);
      }).catch(error => {
        console.error("Erro ao trocar código por token:", error);
      })
    }
    async searchTracks(keyword: string) {
    const accessToken = localStorage.getItem('spotify_access_token');
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: keyword,
            type: "track",
            market: "BR",  // ou "US", se preferir
            limit: 5,
          },
        });

        // Aqui estão as músicas retornadas
        const tracks = response.data.tracks.items;
        console.log("Músicas encontradas:", tracks);

        return tracks; // você pode usar isso para exibir na UI
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        return [];
      }
    }
}
