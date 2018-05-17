import { NgModule } from "@angular/core";

// @aerum/UI Framework Modules 
import {
   ContentModule,
   CheckboxModule,
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
   GridModule,
   ExpandableModule,
   LoaderModule,
} from "@aerum/ui";


@NgModule({ 
   imports: [
       // UI Framework Modules
       ContentModule,
       CheckboxModule,
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
       GridModule,
       FileUploadModule,
       NotificationModule,
       ExpandableModule,
       LoaderModule
   ],
   exports: [
       // UI Framework Modules
       ContentModule,
       CheckboxModule,
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
       GridModule,
       FileUploadModule,
       NotificationModule,
       ExpandableModule,
       LoaderModule
   ]
})
export class AppUIModule { }