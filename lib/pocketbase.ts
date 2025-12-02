// import PocketBase from "pocketbase";

// // let pb: PocketBase | null = null;

// // export function getPocketBase() // {
// //     // if (!pb) {}

//  const pb = new PocketBase("http://localhost:8090");
//     // }
// //     return pb;
// // }
// export default pb ;

import PocketBase from 'pocketbase';


const pb = new PocketBase('http://localhost:8090/');


export default pb;
