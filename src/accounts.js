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

const accounts = [account1, account2, account3, account4];

export default accounts;
