'use strict';

class UserData {
  constructor(list, modal, modalBody, select, url) {
    this.request = () => fetch(url);
    this.list = document.querySelector(list),
    this.modal = document.querySelector(modal),
    this.modalBody = document.querySelector(modalBody),
    this.select = document.querySelector(select);
    this.dataUsers;
  }

  toUper(name){
    return (name[0].toUpperCase() + name.slice(1));
  };

  render = (item, index) => {
    const {title, first, last} = item.name;
    this.list.insertAdjacentHTML('beforeend', `
      <li class="list-group-item bg-secondary bg-light">
        <div class='row'>
          <div class='col-1'>
            <span class="list-group__span">${index + 1}</span>
          </div>
          <div class='col-1'>
            <img class="list-group__img" src='${item.picture.medium}' alt="avatar">
          </div>
          <div class='col-10'>
            <p class="item-group__p">${this.toUper(title)}. ${this.toUper(first)} ${this.toUper(last)}</p>
          </div>
        </div>
      </li> 
    `);
  };

  sortList = (data, e) => {
    const target = e.target;

    console.log(target.value);

    if(target.value === 'A-Z') {
      this.list.textContent = '';
      data.sort((prev, next) => {
        if ( prev.name.first < next.name.first ) return -1;
        if ( prev.name.first < next.name.first ) return 1;
        return 0;
      })
      .map((item, index) => {
        this.render(item, index)
      });
    } else if(target.value === 'reverse') {
      this.list.textContent = '';
      data.reverse((prev, next) => {
        if ( prev.name.first < next.name.first ) return -1;
        if ( prev.name.first < next.name.first ) return 1;
      })
      .map((item, index) => {
        this.render(item, index);
      });
    } else return;
  }

  openModal = (e, listItem) => {
    const listItems = document.querySelectorAll(listItem);
    let target = e.target;
    target = target.closest(listItem);
    this.modal.style.display = 'block';

    if(!target) return;

    listItems.forEach((item, i) => {
      if(target === item) {
        this.dataUsers.map((elem, index) => {
          if(index === i) {
            console.log(elem);
            this.modalBody.insertAdjacentHTML('beforeend', `
              <img src='${elem.picture.large}'/>
              <p>${target.querySelector('p').textContent}</p>
              <ul>
                <li>Street: ${elem.location.street}</li>
                <li>City: ${this.toUper(elem.location.city)}</li>
                <li>${elem.location.state}</li>
                <li>${elem.email}</li>
                <li>${elem.phone}</li>
              </ul>
            `);
          }
        });

      }
    });
  };

  closeModal = (e) => {
    const target = e.target;

    if(target.matches('.btn, .close span')) {
      this.modal.style.display = 'none';
      this.modalBody.textContent = '';
    }
  }

  listeners() {
    this.list.addEventListener('click', e => this.openModal(e, '.list-group-item'));
    this.modal.addEventListener('click', e => this.closeModal(e));
    this.select.addEventListener('change', e => this.sortList(this.dataUsers, e));
  }

  ajax() {
    this.request()
      .then(response => {
        if(response.status !== 200) {
          throw new Error('Status network is not 200');
        }
        return (response.json());
      })
      .then(data => data.results)
      .then(data => {
        data.map((item, i) => {
          this.render(item, i);
        });

        this.dataUsers = data;
      })
      .catch(err => console.error(err));

      this.listeners()
  };

};


const user = new UserData('.list-group', '.modal', '.modal-body', 'select', 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture');
user.ajax()
