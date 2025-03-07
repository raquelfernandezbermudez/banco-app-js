import { faker } from '@faker-js/faker';

// Función para crear un movimiento bancario aleatorio
const createRandomMovement = (balance, startDate = new Date(2024, 0, 1), endDate = new Date()) => {
  const minBalance = -500; // Establezco un mínimo de saldo

  // Generar una cantidad entre -5000 y 5000
  let amount = faker.number.float({ min: -5000, max: 5000, precision: 2 });

  // Ajustar el movimiento si el saldo cae por debajo del límite
  if (balance + amount < minBalance) {
    amount = minBalance - balance;
  }

  // Fecha aleatoria
  const date = faker.date.between({ from: startDate, to: endDate });

  return {
    amount: parseFloat(amount.toFixed(2)),
    date: date
  };
};

// Función para crear una cuenta bancaria con datos aleatorios
const createRandomAccount = (id) => {
  // Crear un nombre aleatorio
  const owner = faker.person.fullName();

  // Crear entre 5 y 10 movimientos bancarios
  const movementsCount = faker.number.int({ min: 5, max: 10 });
  const movements = [];
  let balance = 0; // Inicializar el saldo

  // Fecha de inicio para los movimientos (inicialmente un año atrás)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Generar movimientos con fechas ordenadas de más antiguo a más reciente
  for (let i = 0; i < movementsCount; i++) {
    // Ajustar la fecha de inicio para cada movimiento para asegurar orden cronológico
    const segmentSize = (new Date() - startDate) / movementsCount;
    const segmentStart = new Date(startDate.getTime() + segmentSize * i);
    const segmentEnd = new Date(startDate.getTime() + segmentSize * (i + 1));

    const movement = createRandomMovement(balance, segmentStart, segmentEnd);
    movements.push(movement);
    balance += movement.amount; // Actualizar el saldo
  }

  // Generar un PIN de 4 dígitos
  const pin = faker.number.int({ min: 1000, max: 9999 });

  // Generar una tasa de interés entre 0.5 y 2.0
  const interestRate = parseFloat(faker.number.float({ min: 0.5, max: 2.0, precision: 0.1 }).toFixed(1));

  return {
    owner,
    movements,
    interestRate,
    pin,
    // El username se generará en la aplicación principal
  };
};

// Cuentas de ejemplo predefinidas
const account1 = {
  owner: "Juan Sánchez",
  movements: [
    { amount: 200, date: new Date(2023, 0, 15) },
    { amount: 450, date: new Date(2023, 1, 3) },
    { amount: -400, date: new Date(2023, 1, 25) },
    { amount: 3000, date: new Date(2023, 2, 10) },
    { amount: -650, date: new Date(2023, 2, 22) },
    { amount: -130, date: new Date(2023, 3, 5) },
    { amount: 70, date: new Date(2023, 3, 18) },
    { amount: 1300, date: new Date(2023, 4, 1) },
  ],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "María Portazgo",
  movements: [
    { amount: 5000, date: new Date(2023, 0, 10) },
    { amount: 3400, date: new Date(2023, 0, 20) },
    { amount: -150, date: new Date(2023, 1, 5) },
    { amount: -790, date: new Date(2023, 1, 18) },
    { amount: -3210, date: new Date(2023, 2, 2) },
    { amount: -1000, date: new Date(2023, 2, 15) },
    { amount: 8500, date: new Date(2023, 3, 1) },
    { amount: -30, date: new Date(2023, 3, 10) },
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Estefanía Pueyo",
  movements: [
    { amount: 200, date: new Date(2023, 0, 8) },
    { amount: -200, date: new Date(2023, 1, 15) },
    { amount: 340, date: new Date(2023, 2, 10) },
    { amount: -300, date: new Date(2023, 2, 25) },
    { amount: -20, date: new Date(2023, 3, 5) },
    { amount: 50, date: new Date(2023, 3, 12) },
    { amount: 400, date: new Date(2023, 4, 2) },
    { amount: -460, date: new Date(2023, 4, 15) },
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: [
    { amount: 430, date: new Date(2023, 0, 5) },
    { amount: 1000, date: new Date(2023, 1, 8) },
    { amount: 700, date: new Date(2023, 2, 12) },
    { amount: 50, date: new Date(2023, 3, 20) },
    { amount: 90, date: new Date(2023, 4, 1) },
  ],
  interestRate: 1,
  pin: 4444,
};

// Cuentas generadas aleatoriamente
const randomAccount1 = createRandomAccount(1);
const randomAccount2 = createRandomAccount(2);
const randomAccount3 = createRandomAccount(3);
const randomAccount4 = createRandomAccount(4);

// Combinar todas las cuentas (4 predefinidas + 4 aleatorias)
const accounts = [
  account1,
  account2,
  account3,
  account4,
  randomAccount1,
  randomAccount2,
  randomAccount3,
  randomAccount4
];

// Mostrar la información de las cuentas en la consola para referencia
console.log('🏦 Datos de cuentas bancarias disponibles:');
console.log('--- CUENTAS DE EJEMPLO (PIN: 1111-4444) ---');
for (let i = 0; i < 4; i++) {
  console.log(`Cuenta ${i + 1}: ${accounts[i].owner}`);
  console.log(`Usuario: ${accounts[i].owner.toLowerCase().split(' ').map(name => name[0]).join('')}`);
  console.log(`PIN: ${accounts[i].pin}`);
  console.log('----------------------------');
}

console.log('--- CUENTAS ALEATORIAS (PIN: aleatorio) ---');
for (let i = 4; i < 8; i++) {
  console.log(`Cuenta ${i + 1}: ${accounts[i].owner}`);
  console.log(`Usuario: ${accounts[i].owner.toLowerCase().split(' ').map(name => name[0]).join('')}`);
  console.log(`PIN: ${accounts[i].pin}`);
  console.log('----------------------------');
}

export default accounts;
