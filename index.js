const { client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId ==  null ||
        myPrivateKey == null ) {
            throw new Error("Environment variables myAccountID and PrivateKey missing");
        }

    //connection to the hedera network
    const client = client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;


    //create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    //Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;


    console.log("The new account ID is: " +newAccountID);


    //verify the account balance

    const AccountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is "+accountBalance.hbars.toTinybars() +" tinybar.");

    //create the transfer transaction

    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))//sending account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //receiving account
        .execute(client);

    //verify that the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: "+ transactionReceipt.status.toString());


    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .getCost(client);


    console.log("The cost of the query is: " +queryCost);

    //check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")
}
main();

