const Blockchain = require("./blockchain");
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');


const irvin = new Blockchain();
const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Configure Cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    // send message to the listening port that will get the
    // alert
    res.send('Hello SEN 381');
});

app.get('/blockchain', function (req, res) {
    res.json(irvin);
});

app.post('/transaction', function(req, res) {
    const blockIndex = irvin.pendingTransactions.length + 1; // The next block index
    irvin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});


app.get('/mine', function(req, res) {
    const lastBlock = irvin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: irvin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = irvin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = irvin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = irvin.createNewBlock(nonce, previousBlockHash, blockHash);
    const nodeAddress = uuid.v1().split('-').join('');
    irvin.createNewTransaction(12.5, "00", nodeAddress);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

app.listen(3000, function(res, req){
console.log('listening on port 3000… ');
});