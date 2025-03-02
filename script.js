'use strict';

// Bankist App
/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Rapahel Nady',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Lio Messi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
////////////////////////////////////////////////////////////////////////////
//functions
const displayMovments = function (movments, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movments.slice().sort((a, b) => a - b) : movments;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}$`;
};
const displaySummury = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUi = function (acc) {
  //display movments
  displayMovments(acc.movements);
  //dispaly balance
  displayBalance(acc);
  //display summury
  displaySummury(acc);
};
//////////////////////////////////////////////////////////////
//event handelers
let currentacount;
//login
btnLogin.addEventListener('click', function (e) {
  //to prevent from submtting
  e.preventDefault();
  currentacount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentacount);
  //displau ui and message
  if (currentacount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `WELCOME BACK, ${
      currentacount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //update ui
    updateUi(currentacount);
  }
});
//transfare
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputLoanAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciveAcc &&
    currentacount.balance >= amount &&
    reciveAcc?.username !== currentacount.username
  ) {
    //doing the transfare
    currentacount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    updateUi(currentacount);
  }
});
//loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentacount.movements.some(mov > mov >= amount * 0.1)) {
    currentacount.movements.push(amount);
    updateUi(currentacount);
  }
  inputLoanAmount.value = '';
});
//close
btnClose.addEventListener('click', function () {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentacount.username &&
    Number(inputClosePin.value) === currentacount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentacount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentacount.movements, !sorted);
  sorted = !sorted;
});
////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
