import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalVisibleSubject = new BehaviorSubject<boolean>(false);

  // Observable to watch for changes
  modalVisible$ = this.modalVisibleSubject.asObservable();

  // Method to toggle modal visibility
  toggleModalVisibility() {
    console.log('Toggling modal visibility');
    this.modalVisibleSubject.next(!this.modalVisibleSubject.value);
  }
}
