import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentPage = 'fiches';

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goHome(){
    console.log('home clicked');
    this.router.navigate(['fiches']);
    this.currentPage = 'fiches';
  }

  goStory(){
    console.log('story clicked');
    this.router.navigate(['livrets']);
    this.currentPage = 'livrets';
  }

}
