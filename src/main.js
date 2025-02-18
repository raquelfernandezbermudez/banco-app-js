import "./style.css";

document.querySelector("#app").innerHTML = `
    <nav>
      <p class="welcome">Log in to get started</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login">
        <input
          type="text"
          placeholder="user"
          class="login__input login__input--user"
        />
        <!-- In practice, use type="password" -->
        <input
          type="text"
          placeholder="PIN"
          maxlength="4"
          class="login__input login__input--pin"
        />
        <button class="login__btn">&rarr;</button>
      </form>
    </nav>

    <main class="app">
      <!-- BALANCE -->
      <div class="balance">
        <div>
          <p class="balance__label">Current balance</p>
          <p class="balance__date">
            As of <span class="date">05/03/2037</span>
          </p>
        </div>
        <p class="balance__value">0000€</p>
      </div>

      <!-- MOVEMENTS -->
      <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>
        <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">
            1 withdrawal
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">-378€</div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="summary">
        <p class="summary__label">In</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Out</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interest</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; SORT</button>
      </div>

      <!-- OPERATION: TRANSFERS -->
      <div class="operation operation--transfer">
        <h2>Transfer money</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transfer to</label>
          <label class="form__label">Amount</label>
        </form>
      </div>

      <!-- OPERATION: LOAN -->
      <div class="operation operation--loan">
        <h2>Request loan</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Amount</label>
        </form>
      </div>

      <!-- OPERATION: CLOSE -->
      <div class="operation operation--close">
        <h2>Close account</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input
            type="password"
            maxlength="6"
            class="form__input form__input--pin"
          />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirm user</label>
          <label class="form__label">Confirm PIN</label>
        </form>
      </div>

      <!-- LOGOUT TIMER -->
      <p class="logout-timer">
        You will be logged out in <span class="timer">05:00</span>
      </p>
    </main>
`;

// Data
const account1 = {
  owner: "Juan Sánchez",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "María Portazgo",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Estefanía Pueyo",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//creamos el campo username para todas las cuenta de usuarios mediante una función
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

//Otra opcion
//const accounts2 = accounts.map((account) => {
//account.username = account.owner //Juan Sanchez
//.toLowerCase() //juan sanchez
//.split(" ") //["juan", "sanchez"]
//.map((name) => name[0]) //["j", "s"]
//.join(""); //js
//return account;
//});

btnLogin.addEventListener("click", function (e) {
  //evitar que el formulario se envíe
  e.preventDefault();
  //recojo el username y el pin y los comparo con los datos de la cuenta
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  const account = accounts.find(
    (account) => account.username === inputUsername
  );

  if (account && account.pin === inputPin) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Bienivenid@, ${account.owner.split(" ")[0]}`;
    //Limpiar formulario
    inputLoginUsername.value = inputLoginPin.value = "";
    //cargar los datos (movimientos de la cuenta)
    updateUI(account);
  } else {
    labelWelcome.textContent = `Login incorrecto`;
  }
});

const updateUI = function (account) {
  //mostrar los movimientos de la cuenta
  displayMovements(account.movements);
  //mostrar el balance de la cuenta
  calcDisplayBalance(account);
  //mostrar el total de los movimientos de la cuenta, ingresos y gastos
  calcDisplaySummary(account);
};

//Tarea: Saber calcular el balance -> map + reduce
const calcBalance = function (movements) {
  return movements
    .map((mov) => mov) // En este caso map simplemente pasa el valor, pero podría modificarlo
    .reduce((acc, mov) => acc + mov, 0);
};
// los ingresos y los gastos -> map + filter +reduce
// Calcular ingresos
const calcIncome = function (movements) {
  return movements
    .filter((mov) => mov > 0) // Filtramos solo los movimientos positivos
    .map((mov) => mov) // Aquí podríamos aplicar alguna transformación si fuera necesario
    .reduce((acc, mov) => acc + mov, 0);
};

// Calcular gastos
const calcExpense = function (movements) {
  return movements
    .filter((mov) => mov < 0) // Filtramos solo los movimientos negativos
    .map((mov) => Math.abs(mov)) // Convertimos a valor absoluto
    .reduce((acc, mov) => acc + mov, 0);
};

//Display moviments
const displayMovements = function (movements, sort = false) {
  // Limpiamos el contenedor de movimientos primero
  containerMovements.innerHTML = "";

  // Ordenamos los movimientos si sort es true
  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calcular y mostrar el balance
const calcDisplayBalance = function (account) {
  account.balance = calcBalance(account.movements);
  labelBalance.textContent = `${account.balance}€`;
};

//Calcular y mostrar el resumen (ingresos, gastos e intereses)
const calcDisplaySummary = function (account) {
  const incomes = calcIncome(account.movements);
  labelSumIn.textContent = `${incomes}€`;

  const out = calcExpense(account.movements);
  labelSumOut.textContent = `${out}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1) // Solo intereses de al menos 1€
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//transferencia
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverUsername = inputTransferTo.value;
  const receiverAccount = accounts.find(
    (acc) => acc.username === receiverUsername
  );

  // Limpiar campos de entrada
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Realizar la transferencia
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Actualizar la interfaz
    updateUI(currentAccount);
  }
});

//Solicitud de préstamo
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  // Verificar si algún depósito es mayor al 10% del préstamo solicitado
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Añadir movimiento
    currentAccount.movements.push(amount);

    // Actualizar UI
    updateUI(currentAccount);
  }

  // Limpiar campo
  inputLoanAmount.value = "";
});

//cierre de cuenta
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Eliminar cuenta
    accounts.splice(index, 1);

    // Ocultar UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }

  // Limpiar campos
  inputCloseUsername.value = inputClosePin.value = "";
});

//Ordenación
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//Cierre de sesión
const startLogoutTimer = function () {
  // Establecer tiempo a 5 minutos
  let time = 300;

  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");

    // En cada llamada, imprimir el tiempo restante en la UI
    labelTimer.textContent = `${min}:${sec}`;

    // Cuando llegue a 0, detener temporizador y cerrar sesión
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }

    // Disminuir 1 segundo
    time--;
  };

  // Llamar tick inmediatamente y luego cada segundo
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//Variables globales y organización final
// Variables globales para mantener el estado
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  currentAccount = accounts.find(
    (account) => account.username === inputUsername
  );

  if (currentAccount?.pin === inputPin) {
    // Mostrar UI y mensaje de bienvenida
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Bienvenid@, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Limpiar campos de entrada
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Limpiar timer anterior si existe
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Actualizar UI
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = "Login incorrecto";
  }
});
