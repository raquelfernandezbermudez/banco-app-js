import "./style.css";
import accounts from "./accounts.js";

import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

//Variable global para almacenar la cuenta actual
let currentAccount;
let balance;
// Variable para controlar el estado de ordenación
let sorted = false;

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

// Función para formatear fechas
const formatDate = function(date) {
  // Para fechas recientes, mostrar tiempo relativo (hace X días) si es de menos de 30 días
  const daysPassed = Math.round(Math.abs((new Date() - date) / (1000 * 60 * 60 * 24)));
  
  if (daysPassed < 30) {
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } else {
    // Para fechas más antiguas, mostrar la fecha formateada
    return format(date, 'dd/MM/yyyy', { locale: es });
  }
};

// Actualizar la fecha actual en el balance
const updateCurrentDate = function() {
  const now = new Date();
  labelDate.textContent = format(now, "dd/MM/yyyy");
};

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

// Función displayMovements actualizada para trabajar con objetos
const displayMovements = function (movements, sort = false) {
  // Vaciamos el HTML
  containerMovements.innerHTML = "";

  // Implementación de ordenación por fecha
  const movs = sort 
    ? [...movements].sort((a, b) => new Date(a.date) - new Date(b.date)) 
    : movements;
  
  // Recorremos el array de movimientos
  movs.forEach((mov, i) => {
    // Accedemos a mov.amount en lugar de mov directamente
    const type = mov.amount > 0 ? "deposit" : "withdrawal";
    
    // Formateo de la fecha de manera relativa
    const dateDisplay = formatDate(new Date(mov.date));
    
    // Creamos el HTML
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
      type === "withdrawal" ? "withdrawal" : "deposit"
    }</div>
        <div class="movements__date">${dateDisplay}</div>
        <div class="movements__value">${mov.amount.toFixed(2)}€</div>
      </div>
    `;
    // Insertamos el HTML en el DOM
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Función displayBalance actualizada para trabajar con objetos
const displayBalance = function (movements) {
  // Calculamos la suma de ingresos y retiradas de efectivo
  // Accedemos a movement.amount
  balance = movements.reduce((total, movement) => total + movement.amount, 0);
  // Actualizamos el DOM
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};

// Función displaySummary actualizada para trabajar con objetos
const displaySummary = function (movements) {
  // Filtramos y sumamos la propiedad amount
  const sumIn = movements
    .filter((movement) => movement.amount > 0)
    .reduce((total, movement) => total + movement.amount, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)} €`;
  
  // Filtramos y sumamos la propiedad amount
  const sumOut = movements
    .filter((movement) => movement.amount < 0)
    .reduce((total, movement) => total + movement.amount, 0);
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)} €`;
};

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

// Función btnLoan actualizada para trabajar con objetos
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amountValue = inputLoanAmount.value;
  const amount = Number(amountValue);

  // Validamos que la cantidad sea positiva
  if (amount <= 0) {
    alert("La cantidad del préstamo debe ser positiva.");
    return; // Salimos de la función
  }

  // Validamos que no supere el 200% del balance
  if (amount > balance * 2) {
    alert("El préstamo no puede superar el 200% de tu saldo actual.");
    return; // Salimos de la función
  }

  // Si pasa ambas validaciones, procesamos el préstamo
  // Creamos un objeto con amount y date en lugar de solo añadir un número
  currentAccount.movements.push({
    amount: amount,
    date: new Date()
  });
  
  // Actualizamos la UI
  updateUI(currentAccount);
  // Limpiamos el campo de input
  inputLoanAmount.value = "";

  // Opcional: mensaje de éxito
  alert(`Préstamo de ${amount.toFixed(2)}€ concedido correctamente.`);
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  //Obtener los datos ingresados por el usuario
  const inputUsername = inputCloseUsername.value;
  const inputPin = Number(inputClosePin.value);

  //Verificar si las credenciales son correctas (usuario actual)
  if (
    inputUsername === currentAccount.username &&
    inputPin === currentAccount.pin
  ) {
    // Encontrar el índice de la cuenta en el array de cuentas
    const accountIndex = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    //Eliminar la cuenta del array
    accounts.splice(accountIndex, 1);

    //Ocultar la UI (cerrar sesión)
    containerApp.style.opacity = 0;

    //Actualizar mensaje de bienvenida
    labelWelcome.textContent = "Log in to get started";

    //Limpiar los campos de input
    inputCloseUsername.value = inputClosePin.value = "";
  } else {
    // Si las credenciales son incorrectas
    alert("Credenciales incorrectas. No se puede cerrar la cuenta.");
  }
});

// Función btnTransfer actualizada para trabajar con objetos
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  // Obtener los datos de la transferencia
  const amount = Number(inputTransferAmount.value);
  const receiverUsername = inputTransferTo.value;

  // Buscar la cuenta destinataria
  const receiverAccount = accounts.find(
    (account) => account.username === receiverUsername
  );

  // Limpiar los campos de entrada
  inputTransferAmount.value = inputTransferTo.value = "";

  // Calcular el balance actual usando amount
  const currentBalance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov.amount, 0
  );

  // Validaciones:
  if (
    amount > 0 &&
    currentBalance >= amount &&
    receiverAccount &&
    receiverAccount.username !== currentAccount.username
  ) {
    // Realizar la transferencia con objetos en lugar de valores simples
    currentAccount.movements.push({
      amount: -amount,
      date: new Date()
    });
    
    receiverAccount.movements.push({
      amount: amount,
      date: new Date()
    });

    // Actualizar la interfaz
    updateUI(currentAccount);

    // Mostrar mensaje de éxito
    alert(
      `Transferencia de ${amount.toFixed(2)}€ a ${
        receiverAccount.owner
      } realizada con éxito.`
    );
  } else {
    // Mostrar mensaje de error apropiado
    if (amount <= 0) {
      alert("La cantidad debe ser positiva.");
    } else if (currentBalance < amount) {
      alert("No tienes suficiente saldo para realizar esta transferencia.");
    } else if (!receiverAccount) {
      alert("La cuenta destinataria no existe.");
    } else if (receiverAccount.username === currentAccount.username) {
      alert("No puedes transferir dinero a tu propia cuenta.");
    }
  }
});

// Implementación de la funcionalidad de ordenación
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});