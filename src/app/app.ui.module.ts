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
   TextareaModule,
   CardModule,
   ToggleModule,
   FileUploadModule,
   NotificationModule,
   SelectModule,
} from "@aerum/ui";


@NgModule({ 
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
       SlideToggleModule,
       TextareaModule,
       CardModule,
       ToggleModule,
       SelectModule,

       FileUploadModule,
       NotificationModule
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
       SlideToggleModule,
       TextareaModule,
       CardModule,
       ToggleModule,
       SelectModule,

       FileUploadModule,
       NotificationModule
   ]
})
export class AppUIModule { }