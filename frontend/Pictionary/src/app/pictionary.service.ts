import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class PictionaryService {

  uri='http://localhost:4000'
  //uri='https://pictionary-etf-diplomski.web.app';
  
  constructor(private http: HttpClient) { }

  login(kor_ime){
    const data = {
      kor_ime: kor_ime
    };
    return this.http.post(`${this.uri}/login`, data);
  }

  getUserByUsername(kor_ime){
    const data = {
      kor_ime: kor_ime
    };

    return this.http.post(`${this.uri}/getUserByUsername`, data);
  }

  getMails(mejl){
    const data = {
      mejl: mejl
    };

    return this.http.post(`${this.uri}/getMails`, data);
  }

  findAllRequests(){
    return this.http.post(`${this.uri}/findAllRequests`, null);
  }

  findAllWordsRequests(){
    return this.http.post(`${this.uri}/findAllWordsRequests`, null);
  }

  findAllRooms(){
    return this.http.post(`${this.uri}/findAllRooms`, null);
  }

  sendRequest(ime,prezime,korisnicko_ime, lozinka,mejl,slika, tip){
    const data = {
      ime: ime,
      prezime: prezime,
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka,
      slika:slika,
      mejl: mejl,
      tip:tip
    };

    return this.http.post(`${this.uri}/sendRequest`, data);
  }

  deleteRequest(korisnicko_ime){
    let data={
      korisnicko_ime:korisnicko_ime
    };
    return this.http.post(`${this.uri}/deleteRequest`, data);
  }

  findAllUsers(){
    return this.http.post(`${this.uri}/findAllUsers`, null);
  }

  findAllWords(){
    return this.http.post(`${this.uri}/findAllWords`, null);
  }

  addUser(id, je_najbolji, ime,prezime,korisnicko_ime, lozinka, tip, slika, mejl){
    const data = {
      id:id,
      je_najbolji: je_najbolji,
      ime: ime,
      prezime: prezime,
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka,
      tip: tip,
      slika:slika,
      mejl:mejl
    };

    return this.http.post(`${this.uri}/addUser`, data);
  }

  addResult(id, id_igraca, najbolji_rezultat,broj_odigranih_partija){
    const data = {
      id:id,
      id_igraca: id_igraca,
      najbolji_rezultat: najbolji_rezultat,
      broj_odigranih_partija: broj_odigranih_partija
    };

    return this.http.post(`${this.uri}/addResult`, data);
  }

  addRoom(id, naziv, lozinka, vlasnik){
    const data = {
      id:id,
      naziv: naziv,
      lozinka: lozinka,
      vlasnik: vlasnik,
      aktivna_igra: '0',
      trenutno_crta:  vlasnik,
      trenutna_rec: '',
      runda: '0'
    };

    return this.http.post(`${this.uri}/addRoom`, data);
  }

  addParticipant(id_sobe, id_igraca){
    const data = {
      id_sobe:id_sobe,
      id_igraca: id_igraca
    };
    console.log("dodavanje igraca "+id_igraca+" u sobu "+id_sobe);

    return this.http.post(`${this.uri}/addParticipant`, data);
  }

  deleteUser(korisnicko_ime){
    const data = {
      korisnicko_ime: korisnicko_ime
    };

    return this.http.post(`${this.uri}/deleteUser`, data);
  }

  deleteResult(id_igraca){
    const data = {
      id_igraca: id_igraca
    };

    return this.http.post(`${this.uri}/deleteResult`, data);
  }

  findIdForRoom(room){
    const data = {
      naziv: room
    };

    return this.http.post(`${this.uri}/findIdForRoom`, data);
  }

  findAllParticipants(room){
    const data = {
      id_sobe: room
    };

    return this.http.post(`${this.uri}/findAllParticipants`, data);
  }

  findWordsForRoom(room){
    const data = {
      soba: room
    };

    return this.http.post(`${this.uri}/findWordsForRoom`, data);
  }

  runGame(room){
    const data = {
      id: room
    };

    return this.http.post(`${this.uri}/runGame`, data);
  }

  updateRound(room){
    const data = {
      id: room
    };

    return this.http.post(`${this.uri}/updateRound`, data);
  }

  setCurrentPainter(user, room){
    const data = {
      trenutno_crta: user,
      soba: room,
      trenutna_rec: ''
    };

    return this.http.post(`${this.uri}/setCurrentPainter`, data);
  }

  setCurrentWord(word, room){
    const data = {
      trenutna_rec: word,
      soba: room
    };

    return this.http.post(`${this.uri}/setCurrentWord`, data);
  }

  getCurrentWord(room){
    const data = {
      soba: room
    };

    return this.http.post(`${this.uri}/getCurrentWord`, data);
  }


}
