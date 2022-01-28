const { isAssertClause } = require("typescript");

var XManFactory = artifacts.require("./XManFactory");

contract('XManGame', (accounts) => {
    let contractInstance;
    const INITIAL_SUPPLY = 1000000;

    beforeEach(async () => {
        contractInstance = await XManFactory.deployed();
    });

    it('Should put ${INITIAL_SUPPLY} Tokens in the first account', async () =>{
        let balance = await contractInstance.balanceOf.call(accounts[0])

        assert.equal(balance.valueOf(), INITIAL_SUPPLY, 'The initial supply seams not correct ${INITIAL_SUPPLY}');
    });

    it('Should send 10 XManTokens correctly', async () => {
        var account_one = accounts[0];
        var account_two = accounts[1];

        var account_one_starting_balance = await contractInstance.balanceOf.call(account_one);
        var account_two_starting_balance = await contractInstance.balanceOf.call(account_two);

        var amount = 10;
        await contractInstance.transfer(account_two, amount, { from: account_one});

        var account_one_ending_balance = await contractInstance.balanceOf.call(account_one);
        var account_two_ending_balance = await contractInstance.balanceOf.call(account_two);

        var balance_one = account_one_ending_balance.toNumber();
        var balance_two = account_two_ending_balance.toNumber();
        var check_one = account_one_starting_balance - amount;
        var check_two = account_two_starting_balance + amount;

        assert.equal(balance_one, check_one, "Amount wasn't successfully taken from sender");
        assert.equal(balance_two, check_two, "Amount wasn't successfully sent to the receiver");

    })

    it('Should collect the Xman of specific account', async () => {
        var account = accounts[0];

        const GAS_LIMIT = 500000;

        let queryNumberOfXmen = await contractInstance.getNumberOfXmen({from: account, gas: GAS_LIMIT});
        assert.equal(queryNumberOfXmen, 0, "Not valid XMan created");
    })
}) 