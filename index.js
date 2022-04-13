const { client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
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
}
main();

