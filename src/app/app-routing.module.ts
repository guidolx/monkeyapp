import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { StoryComponent } from './story/story.component';


const routes:Routes = [
  {path:'', redirectTo:'fiches', pathMatch:'full'},
  {path:'fiches', component:CardComponent},
  {path:'livrets',component:StoryComponent},
  {path:'**', component:CardComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
