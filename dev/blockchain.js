// Security and Hashing of data
// invoke the specific sha -bit size (256)
const sha256 = require("sha256");
const currentUrl = process.argv[3];

class Blockchain {
    constructor() {
		this.currentNodeUrl = currentUrl;
		this.networkNodes = [];
        this.chain = [];
        this.pendingTransactions = [];
        // this.newTransactions = [];
        this.createNewBlock(100,'‘0', '0');
    }
  // add other methods for the blockchain here
}
Blockchain.prototype.createNewBlock = function (
    nonce,
    previousBlockHash,
    hash
) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    };
    // this.newTransaction = [];
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
};
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};
Blockchain.prototype.createNewTransaction = function (
    amount,
    sender,
    recipient
) {
const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
};
this.pendingTransactions.push(newTransaction);
// return this.getLastBlock()["index"] + 1;
return newTransaction;
};

// lab 3
Blockchain.prototype.addTransactionToPendingTransactions = function (
    transactionObj
) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.hashBlock = function (
    previousBlockHash,
    currentBlockData,
    nonce
) {
    // the data string will consist of previous block, nonce and present block. This further makes the secret key generated difficult to compromise
    const dataAsString =
        previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    // the string of data is hashed next
    const hash = sha256(dataAsString);
    // the final hashed value is supplied next by method next
    return hash;
};

Blockchain.prototype.proofOfWork = function (
    previousBlockHash,
    currentBlockData
) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash);
    }
    return nonce;
};
module.exports = Blockchain;
