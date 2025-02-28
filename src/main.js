import "./style.css";
import accounts from "./accounts.js";

//Variable global para almacenar la cuenta actual
let currentAccount;
let balance;

document.querySelector("#app").innerHTML = `
    <nav>
      <p class="welcome">Log in to get started</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login" >
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
// creamos el campo username para todas las cuentas de usuarios
// usamos forEach para modificar el array original, en otro caso map
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner // Juan Sanchez
      .toLowerCase() //  juan sanchez
      .split(" ") // ['juan', 'sanchez']
      .map((name) => name[0]) // ['j', 's']
      .join(""); // js
  });
};
createUsernames(accounts);

btnLogin.addEventListener("click", function (e) {
  // evitar que el formulario se envíe
  e.preventDefault();
  // recojo el username y el pin y los comparo con los datos de las cuentas
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);
  const account = accounts.find(
    (account) => account.username === inputUsername
  );
  // .find((account) => account.pin === inputPin);
  // lo anterior no funciona porque account ya es un array
  if (account && account.pin === inputPin) {
    // MÁS CONCISO:  if (account?.pin === inputPin) {
    // si el usuario y el pin son correctos
    // mensaje de bienvenida y que se vea la aplicación
    currentAccount = account; //guardamos la cuenta actual

    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${account.owner.split(" ")[0]}`;
    // limpiar formulario
    inputLoginUsername.value = inputLoginPin.value = "";
    // cargar los datos (movimientos de la cuenta)
    updateUI(account);
  } else {
    //console.log("login incorrecto");
    labelWelcome.textContent = `Datos incorrectos`;
  }
});
const updateUI = function (account) {
  // mostrar los movimientos de la cuenta
  displayMovements(account.movements);
  // mostrar el balance de la cuenta
  displayBalance(account.movements);
  // mostrar el total de los movimientos de la cuenta
  displaySummary(account.movements);
};
const displayMovements = function (movements) {
  // vaciamos el HTML
  containerMovements.innerHTML = "";
  // recorremos el array de movimientos
  movements.forEach((mov, i) => {
    // creamos el html para cada movimiento y lo guardamos en una variable
    const type = mov > 0 ? "deposit" : "withdrawal";
    // creamos el HTML
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
      type === "withdrawal" ? "withdrawal" : "deposit"
    }</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;
    // insertamos el HTML en el DOM
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// Función para mostrar el balance de la cuenta
const displayBalance = function (movements) {
  // Calculamos la suma de ingresos y retiradas de efectivo
  balance = movements.reduce((total, movement) => total + movement, 0);
  // Actualizamos el DOM
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};
const displaySummary = function (movements) {
  const sumIn = movements
    .filter((movement) => movement > 0)
    .reduce((total, movement) => total + movement, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)} €`;
  const sumOut = movements
    .filter((movement) => movement < 0)
    .reduce((total, movement) => total + movement, 0);
  labelSumOut.textContent = `${sumOut.toFixed(2)} €`;
};

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("transferir");
});

// Ahora implementamos correctamente el préstamo
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  // Verificamos si el monto del préstamo es al menos el 10% del balance total
  if (amount > 0 && amount >= balance * 0.1) {
    // Añadimos el préstamo a los movimientos
    currentAccount.movements.push(amount);
    // Actualizamos la UI
    updateUI(currentAccount);
    // Limpiamos el campo de input
    inputLoanAmount.value = "";
  } else {
    alert("El préstamo debe ser al menos el 10% de tu balance total.");
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("close");
});
