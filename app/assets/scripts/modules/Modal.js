import $ from "jquery";


export default class Modal {
  constructor() { 
    this.openModalButton = $(".open-modal");
    this.modal = $(".modal");
    this.closeModalButton = $(".modal__close");
    this.events();
  } 
  events() {
    this.openModalButton.click(this.openModal.bind(this));
    this.closeModalButton.click(this.closeModal.bind(this)); 
    $(document).keyup(this.keyPressHandler.bind(this));
  }

  keyPressHandler(key) {
    if (key.key === "Escape") {
      this.closeModal();
    }
  }

  openModal() { 
    this.modal.addClass("modal--is-visible");
  }
  closeModal() {
    this.modal.removeClass("modal--is-visible"); 
  }
}