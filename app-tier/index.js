const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

//Health Checking
app.get('/health',(req,res)=>{
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/transaction', (req,res)=>{
    try{
        console.log(req.body);
        console.log(req.body.amount);
        console.log(req.body.desc);
        transactionService.addTransaction(req.body.amount, req.body.desc, function(err, success){
            if (err) return res.status(500).json({ message: 'something went wrong', error: err.message });
            if (success === 200) res.json({ message: 'added transaction successfully'});
        });
    }catch (err){
        res.status(500).json({ message: 'something went wrong', error : err.message});
    }
});

// GET ALL TRANSACTIONS
app.get('/transaction',(req,res)=>{
    transactionService.getAllTransactions(function (err, results) {
        if (err) return res.status(500).json({message:"could not get all transactions", error: err.message});
        console.log("we are in the call back:");
        var transactionList = [];
        for (const row of results) {
            transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
        }
        console.log(transactionList);
        res.status(200).json({"result":transactionList});
    });
});

//DELETE ALL TRANSACTIONS
app.delete('/transaction',(req,res)=>{
    transactionService.deleteAllTransactions(function(err, result){
        if (err) return res.status(500).json({message: "Deleting all transactions may have failed.", error:err.message});
        res.status(200).json({message:"delete function execution finished."});
    });
});

//DELETE ONE TRANSACTION
app.delete('/transaction/:id', (req,res)=>{
    transactionService.deleteTransactionById(req.params.id, function(err, result){
        if (err) return res.status(500).json({message:"error deleting transaction", error: err.message});
        res.status(200).json({message: `transaction with id ${req.params.id} seemingly deleted`});
    });
});

//GET SINGLE TRANSACTION
app.get('/transaction/:id',(req,res)=>{
    transactionService.findTransactionById(req.params.id, function(err, result){
        if (err) return res.status(500).json({message:"error retrieving transaction", error: err.message});
        if (!result || result.length === 0) return res.status(404).json({message:"transaction not found"});
        var id = result[0].id;
        var amount = result[0].amount;
        var description = result[0].description;
        res.status(200).json({"id":id,"amount":amount,"description":description});
    });
});

  app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`)
  })
