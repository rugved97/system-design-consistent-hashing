const crypto = require('crypto')
class ConsistentHashing {
    constructor(nodes, replicas = 4, algorithm = 'md5', add_node_dynamically_time= 1000) {
        this.ring = {}; //Hash Ring : { 'sha_node1_1': node1 , 'sha_node1_2' : node2 }
        this.keys = []; // [ 'sha_node1_1' , 'sha_node1_2' ]
        this.nodes = []; //['node1 , node2']
        this.replicas = replicas
        this.algorithm = algorithm
        for(let i =0; i < nodes.length; i++) {
            setTimeout(() =>{
                this.addNode(nodes[i])
            }, add_node_dynamically_time * i) //Periodically add node
        }

    }

    addNode(node) {
        this.nodes.push(node)

        for(let i = 0; i < this.replicas ; i++) {
            const key = this.crypto(node + ':' + i)
            // const key = node + ':' + i
            this.keys.push(key)
            this.ring[key] = node
        }
        console.log(this.keys)
        console.log(this.ring)

        this.keys.sort() //sorting the keys to enable simple binary search
    }

    getNode(key) {
        if(this.getRingLength() === 0 ) return 0

        //Get hash of key
        const hash = this.crypto(key)
        //Get position of Node closest to Hash
        const pos = this.getNodePosition(hash)

        return this.ring[this.keys[pos]]
    }

    getNodePosition(hash) {
        // Binary search to get node position

        let upper = this.getRingLength() - 1
        let lower = 0
        let idx = 0
        let comp = 0

        while(lower<= upper) {
            idx = Math.floor((lower+upper) / 2)
            comp = this.compare(this.keys[idx], hash) //compare two strings

            if(comp === 0 ) {
                //We found it 
                return idx
            } else if ( comp > 0 ) {
                upper = idx - 1
            } else {
                lower = idx + 1
            }
        }

        //upper will always be in range between (lower-upper)
        //if upper get less than lower, attach data to last node then
        if (upper < 0) {
            upper = this.getRingLength() - 1;
        }

        return upper;

    }

    getRingLength() {
        return Object.keys(this.ring).length
    }

    compare(str1, str2) {
        //string compare
        return str1 > str2 ? 1 : str2 > str1 ? -1 : 0 //return zero if equal
    }


    crypto(str) {
        return crypto.createHash(this.algorithm).update(str).digest('hex')
    }

}

module.exports = ConsistentHashing