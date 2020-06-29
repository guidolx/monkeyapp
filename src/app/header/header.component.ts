import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentPage = 'Fiches';

  constructor(private router:Router, private activatedRoute:ActivatedRoute) { 
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd){
        console.log("Current url " + event.url);
        this.currentPage = event.url === '/livrets' ? 'Livrets' : 'Fiches';
      }
    });


  }

  ngOnInit() {
  }

  goHome(){
    console.log('home clicked');
    this.router.navigate(['fiches']);
    this.currentPage = 'Fiches';
  }

  goStory(){
    console.log('story clicked');
    this.router.navigate(['livrets']);
    this.currentPage = 'Livrets';
  }

}
