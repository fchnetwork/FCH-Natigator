import { NgModule } from "@angular/core";

// @aerum/UI Framework Modules 
import {
   ContentModule,
   IconModule,
   SidebarModule,
   ToolbarModule,
   ButtonModule,
   InputModule,
   ModalContainerModule,
   ModalDialogModule,
   SlideToggleModule,
} from "@aerum/ui";


@NgModule({
   declarations: [
   ],
   imports: [
       // UI Framework Modules
       ContentModule,
       IconModule,
       SidebarModule,
       ToolbarModule,
       ButtonModule,
       InputModule,
       ModalContainerModule,
       ModalDialogModule,
       SlideToggleModule
   ],
   exports: [
       // UI Framework Modules
       ContentModule,
       IconModule,
       SidebarModule,
       ToolbarModule,
       ButtonModule,
       InputModule,
       ModalContainerModule,
       ModalDialogModule,
       SlideToggleModule
   ],
   providers: []
})
export class AppUIModule { }