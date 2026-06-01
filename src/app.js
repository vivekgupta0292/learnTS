/**
 * This code demonstrates the creation of two promises, `promise1` and `promise2`, which simulate asynchronous operations using `setTimeout`. Each promise logs a message when it starts and resolves after a specified delay, returning a message indicating that it has been resolved. The first promise resolves after 1 second, while the second promise resolves after 2 seconds.
 * The purpose of this code is to illustrate how promises work in JavaScript, allowing for asynchronous operations to be handled in a more manageable way compared to traditional callback functions. By using promises, we can chain operations and handle errors more effectively, improving the readability and maintainability of our code.
 * 
 */

const promise1 = new Promise((resolve, reject) => {
    console.log('Promise 1 started');
  setTimeout(() => {
    resolve('Promise 1 resolved');
  }, 1000);
});

const promise2 = new Promise((resolve, reject) => {
  console.log('Promise 2 started');
  setTimeout(() => {
    resolve('Promise 2 resolved');
  }, 2000); 
});

