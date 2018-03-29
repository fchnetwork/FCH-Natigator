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
   ModalDialogModule
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
       ModalDialogModule
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
       ModalDialogModule
   ],
   providers: []
})
export class AppUIModule { }