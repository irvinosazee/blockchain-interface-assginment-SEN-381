const express = require('express');
const Blockchain = require('./blockchain');
const uuid = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodeAddress = uuid.v1().split('-').join('');

const irvin = new Blockchain();
const app = express();

app.use(cors()); // Configure Cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    // send message to the listening port that will get the
    // alert
    res.json('Hello SEN 381');
});

app.get('/blockchain', function (req, res) {
    res.json(irvin);
});


app.post('/transaction', function(req, res) {
    const { amount, sender, recipient } = req.body;
    const blockIndex = irvin.addTransactionToPendingTransactions({ amount, sender, recipient });
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
    // const nodeAddress = uuid.v1().split('-').join('');
    // irvin.createNewTransaction(12.5, "00", nodeAddress);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
    irvin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
});

app.post('/register-and-broadcast-node',function(req,res){
    const newNodeUrl = req.body.NewNodeUrl;
    if(irvin.networkNodes.indexOf(newNodeUrl)== -1)
    irvin.networkNodes.push(newNodeUrl);
    const regNodesPromises = [];
    irvin.networkNodes.forEach(networkNodeUrl=>{
        const requestOptions = {
            url: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json:true
        };
        regNodesPromises.push(rp(requestOptions));

    });
    Promise.all;;(regNodesPromises)
    .then(data=>{

        const bulkRegisterOptions = {
            url: networkNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes: [...irvin.networkNodes,irvin.currentNodeUrl]},
            json:true
        };
        return rp(bulkRegisterOptions);


})
then(data =>{
    res.json({note: 'New node registered with network successfully'})
});

});

app.post('/register-node',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = irvin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = irvin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
        irvin.networkNodes.push(newNodeUrl);

    res.json({note: 'New node registered successfully'});
});

app.post('/register-node-bulk',function (req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl =>{
        const nodeNotAlreadyPresent = irvin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = irvin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) irvin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: 'Bulk registration successful'})

});

app.listen(3000, function(res, req){
console.log(`listening on port ${3000} `);
});