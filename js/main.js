(() => {
  let columns = 4;
  let doubleNumsArr = [];

  function createForm(container) {
    const title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'ИГРА В ПАРЫ';

    const form = document.createElement('form');
    form.classList.add('form');

    const label = document.createElement('label');
    label.classList.add('label');
    label.textContent = 'Количество карточек по вертикали / горизонтали';

    const input = document.createElement('input');
    input.classList.add('input');
    input.placeholder = 'чётное число от 2 до 10';

    input.addEventListener('input', function () {
      setTimeout(() => {
        input.value = input.value.replace(/[^\d]/g, '');
      }, 200);
    });

    const formButton = document.createElement('button');
    formButton.textContent = 'Начать игру';
    formButton.classList.add('btn', 'btn-danger');

    form.append(title);
    form.append(label);
    form.append(input);
    form.append(formButton);
    container.append(form);

    return {
      form,
      input,
      formButton
    }
  }

  function createDoubleNums(arr) {
    let allCouples = columns * columns / 2;

    for (let i = 1; i <= allCouples; i++) {
      arr.push(i, i);
    }
  }

  function shuffleDoubleNums(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  function createCardList() {
    const cardList = document.createElement('ul',);
    cardList.classList.add('cart-area', 'list-reset')
    cardList.style.width = '80vh';

    return cardList;
  }

  function createCard(value) {
    const card = document.createElement('li');
    const cardBtn = document.createElement('button');
    cardBtn.textContent = value;
    card.classList.add('cart');
    card.style.width = `calc(80vh / ${columns} - 10px)`;
    card.style.height = `calc(80vh / ${columns} - 10px)`;

    cardBtn.classList.add('btn', 'cart-btn', 'btn-primary');

    card.append(cardBtn);

    return {
      card,
      cardBtn,
    }
  }

  function createCoupleGame(container, arr) {
    const newForm = createForm(container);

    newForm.formButton.addEventListener('click', function () {
      const columnsVal = +newForm.input.value;

      if (columnsVal % 2 === 0 && columnsVal >= 2 && columnsVal <= 10) {
        columns = columnsVal;
      }

      newForm.form.remove();
      createDoubleNums(arr);
      shuffleDoubleNums(arr);
      createTimer();

      const cardList = createCardList();

      container.append(cardList);

      let firstCard = null;
      let secondCard = null;

      arr.forEach((item) => {
        const newCard = createCard(item);
        cardList.append(newCard.card);

        newCard.cardBtn.addEventListener('click', function () {
          if (newCard.cardBtn.classList.contains('btn-warning') || newCard.cardBtn.classList.contains('btn-success')) {
            return;
          }

          if (firstCard !== null && secondCard !== null) {
            const firstCardNum = firstCard.textContent;
            const secondCardNum = secondCard.textContent;

            firstCard.classList.remove('btn-warning');
            secondCard.classList.remove('btn-warning');

            if (firstCardNum !== secondCardNum) {
              firstCard.classList.add('btn-primary');
              secondCard.classList.add('btn-primary');
            }

            firstCard = null;
            secondCard = null;
          }

          newCard.cardBtn.classList.remove('btn-primary');
          newCard.cardBtn.classList.add('btn-warning');

          if (firstCard === null) {
            firstCard = newCard.cardBtn;
          } else {
            secondCard = newCard.cardBtn;
          }

          if (firstCard !== null && secondCard !== null) {
            const firstCardNum = firstCard.textContent;
            const secondCardNum = secondCard.textContent;

            if (firstCardNum === secondCardNum) {
              firstCard.classList.remove('btn-warning');
              firstCard.classList.add('btn-success');
              secondCard.classList.remove('btn-warning');
              secondCard.classList.add('btn-success');
            }
          }

          const successCards = document.querySelectorAll('.btn-success');

          if (arr.length === successCards.length) {
            createPlayBtn();
          }
        });
      });


      function createTimer() {
        let count = 60;

        const timer = document.createElement('p');
        timer.textContent = `Осталось ${count} секунд!`;
        timer.setAttribute('id', 'timer');
        timer.classList.add('timer');
        container.append(timer);

        let counter = setInterval(() => {
          count = count - 1;
          timer.textContent = `Осталось ${count} секунд!`;

          const successCards = document.querySelectorAll('.btn-success');

          if (arr.length === successCards.length) {
            count = 1;
            clearInterval(counter);
            timer.textContent = `Победа!!!`;
          }

          if (count <= 0) {
            clearInterval(counter);
            document.querySelector('.cart-area').remove();
            timer.textContent = `Вы не успели!`;
            createPlayBtn();
          }
        }, 1000);
      }

      function createPlayBtn() {
        const timer = document.getElementById('timer');

        const playAgainBtn = document.createElement('button');
        playAgainBtn.textContent = 'Сыграть ещё раз';
        playAgainBtn.classList.add('btn', 'btn-danger');
        container.append(playAgainBtn);

        playAgainBtn.addEventListener('click', function () {
          if (container.querySelector('.cart-area')) {
            container.querySelector('.cart-area').remove();
          }

          if (timer) {
            timer.remove();
          }

          playAgainBtn.remove();

          doubleNumsArr = [];
          createCoupleGame(document.getElementById('game'), doubleNumsArr);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    createCoupleGame(document.getElementById('game'), doubleNumsArr);
  });

})();
