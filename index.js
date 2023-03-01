
const ConsistentHashing = require('./consistent_hashing');
const loadbalancer = new ConsistentHashing(["node1", "node2", "node3", "node4", "node5"]);

//incoming req or data
const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

//Ojbect to hold Node request pairings
const nodes = {}; // { node1: ['A' , 'C'] , node2: ['B' , 'C' ]}

const run_time_task = []

for(let i = 0 ; i < chars.length ; i++) {
    run_time_task.push(
        new Promise((resolve, reject) => {


            setTimeout(() => {
                //get node for each request
                const node = loadbalancer.getNode(chars[i])
    
                if(nodes[node]) {
                    nodes[node].push(chars[i])
                } else {
                    nodes[node] = []
                    nodes[node].push(chars[i])
                }
                console.log('In Loop i --->', i)
                console.log('In Loop nodes ===>',nodes)
                resolve(nodes)
            }, 1000*i) //Do this every 1000*i seconds

        })
    )
}

//Run all tasks
Promise.all(run_time_task).then(() => {
    console.log(nodes)
})