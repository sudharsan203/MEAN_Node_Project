// Event Loop - Phases
// The event loop is a fundamental concept in JavaScript and Node.js that allows for non-blocking I/O operations. It enables the execution of asynchronous code by managing a queue of events and callbacks. When an asynchronous operation is initiated, such as a network request or file read, the operation is offloaded to the system, allowing the main thread to continue executing other code. Once the operation completes, its callback is added to the event queue, and the event loop processes these callbacks when the main thread is idle.
// REPL (Read-Eval-Print Loop)
// REPL is an interactive programming environment that takes single user inputs (reads), evaluates them (eval), and returns the result to the user (prints). This loop continues until the user decides to exit. REPL is commonly used in programming languages like JavaScript (Node.js), Python, and Ruby for quick testing and debugging of code snippets without the need to create a full program or script. It provides an immediate feedback loop, making it a valuable tool for learning and experimentation.

// JavaScript is a Synchronous and Single-Threaded Language

// let name = "Alice";
// console.log("Start", name);

// const sum = (a, b) => a + b;
// console.log("Sum:", sum(5, 10));

// setTimeout(() => {
//   console.log("Timeout Callback");
// }, 0);

// Promise.resolve().then(() => {
//   console.log("Promise Callback");
// });

// console.log("End");

// // Callbacks Example
// const fetchData = (callback) => {
//   setTimeout(() => {
//     const data = { id: 1, name: "Sample Data" };
//     callback(data);
//   }, 1000);
// };

// fetchData((data) => {
//   console.log("Data received:", data);
// });


// Callback hell example
// const fetchUser = (userId, callback) => {
//   setTimeout(() => {
//     const user = { id: userId, name: "John Doe" };
//     callback(user);
//   }, 1000);
// };

// const fetchOrders = (userId, callback) => {
//   setTimeout(() => {
//     const orders = [
//       { orderId: 1, item: "Laptop" },
//       { orderId: 2, item: "Phone" }
//     ];
//     callback(orders);
//   }, 1000);
// };
// // function calling
// fetchUser(1, (user) => {
//     console.log("User:", user);
//     fetchOrders(user.id, (orders) => {
//         console.log("Orders for", user.name, ":", orders);
//     });
// });

// Promises for the above callback hell example
// const fetchUser = (userId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const user = { id: userId, name: "John Doe" };
//       resolve(user);
//     }, 1000);
//   });
// };

// const fetchOrders = (userId) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//         const orders = [
//             { orderId: 1, item: "Laptop" },
//             { orderId: 2, item: "Phone" }
//         ];
//         resolve(orders);
//         }, 1000);
//     });
// };
// function calling
// fetchUser(1)
//     .then((user) => {
//         console.log("User:", user);
//         return fetchOrders(user.id);
//     })
//     .then((orders) => {
//         console.log("Orders:", orders);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });

    // Promises Phases:
// 1. Pending: Initial state, neither fulfilled nor rejected.  -> ongoing operation -> pending()
// 2. Fulfilled: Operation completed successfully. -> resolve(value)
// 3. Rejected: Operation failed. -> reject(reason)
// Promise Consumption:
    // Output in the form of Object with then() and catch() methods to handle fulfilled and rejected states respectively.

// const samplePromise = new Promise((resolve, reject) => {
//     const success = true;
//     if (success) {
//         resolve({name:"Operation succeeded.", code:200});
//     } else {
//         reject("Operation failed.");
//     }
// });

// samplePromise.then((message) => {
//   console.log("Fulfilled:", message);
// }).catch((error) => {
//   console.log("Rejected:", error);
// });
  

// async/await
// const fetchExampleData =   () => {
//    return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const data = { id: 101, title: "Async/Await Example" };
//             reject("Failed to fetch data");
//         }, 8000);
//     });
// }
// const displayData = async () => {
//     try {
//         const data = await fetchExampleData();
//         console.log("Data received: Async", data);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// };

// displayData();
   


// Node JS: -> V8 Engine
// Synchronous Code Request
// Asynchronous Code Request
// Output:
// Start
// End
// Promise Callback
// Timeout Callback