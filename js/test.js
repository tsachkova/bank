// function* f(max) {
//     if(max < 1) {
//         return;
//     }

//     for(let i = 0; i < max; i++) {console.log(111)
//         yield* f(--max);
//         yield i;
//     }
// }

// (async () => {
//     let result = 0;

//     for await(let item of f(3)) {console.log(item)
//         new Promise((resolve) => {
//            resolve("PROMISE")}).then((value => console.log(value)));
        
//         result += item;
//     }

//     console.log(result); // 10 15
// })();

