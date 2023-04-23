import { Fragment, Component } from "react";

import ERC20_Json from './ERC20.json'
import Web3 from "web3";

class Connect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: {},
            chainId: '',
            accountAddress: '',
            blockNumber: '',
            block_timestamp: '',
            account_address: '',
            account_balance: '',
            contract_address: '',
            token_symbol: '',
            token_totalSupply: '',
            token_balance: '',

            to_address: '',
            transfer_amount: ''

        }
        this.connect = this.connect.bind(this);
        this.getContractAddress = this.getContractAddress.bind(this);
        this.read = this.read.bind(this);
        this.transfer = this.transfer.bind(this);
        this.getToAddress = this.getToAddress.bind(this);
        this.getTransferAmount = this.getTransferAmount.bind(this);
    }

    render() {
        return (
            <Fragment>
                <button onClick={this.connect}>Connect Wallet</button>

                <div>ChainId: {this.state.chainId}</div>
                <div>BlockNumber: {this.state.blockNumber}</div>
                <div>BlockTimestamp: {this.state.block_timestamp}</div>
                <div>Current Account: {this.state.account_address}</div>
                <div>Current Balance: {this.state.account_balance}</div>

                <br/>

                <input value={this.state.contract_address} onChange={this.getContractAddress}></input>
                <button onClick={this.read}>Read Contract</button>
                <div>TokenSymbol: {this.state.token_symbol}</div>
                <div>TotalSupply:{this.state.token_totalSupply}</div>
                <div>TokenBalance: {this.state.token_balance}</div>

                <br/>

                <input value={this.state.to_address} onChange={this.getToAddress}/>
                <input value={this.state.transfer_amount} onChange={this.getTransferAmount}/>
                <button onClick={this.transfer}>Transfer</button>

                <div>estimateGas: <span id="estimate_gas"></span></div>
                <div>gasPrice: <span id="gas_price"></span></div>
                <div>txHash: <span id="tx_hash"></span></div>
            </Fragment>
        )
    }

    getContractAddress(e) {
        this.setState({
            contract_address: e.target.value
        })
    }

    getToAddress(e) {
        this.setState({
            to_address: e.target.value
        })
    }

    getTransferAmount(e) {
        this.setState({
            transfer_amount: e.target.value
        })
    }

    async connect() {
        console.log('Abi: ', ERC20_Json);
        console.log('abi: ', ERC20_Json.abi);
        console.log('privKey: ', process.env.privKey);

        let web3 = new Web3();
        // let chainId = this.state.chainId;
        // let accountAddress = this.state.accountAddress;
        let chainId;
        let accountAddress

        if (window.ethereum) {
            // 实例化之前，让用户唤醒钱包
            // 用户可能同意或拒绝，所以要先try..catch
            try {
                await window.ethereum.enable();
            } catch (error) {
                console.error("User denied account access");
            }
            web3 = new Web3(window.ethereum);

            this.state.web3 = web3;

            console.log('web3: ', web3)
        } else if(window.web3) {        // 这是针对旧版本的metamask拿实例的方法
            web3 = new Web3(window.ethereum);
        } else {
            alert("Please install wallet");
        }

        // 读取链上信息
        chainId = await web3.eth.getChainId();
        console.log('chainId: ', chainId);

        let blockNumber = await web3.eth.getBlockNumber();

        // 拿到区块时间戳前，必须先通过blockNumber拿到区块头
        let block = await web3.eth.getBlock(blockNumber);
        let blockTimestamp = block.timestamp;
        console.log('blockTimestamp: ', blockTimestamp);

        // ------------

        // getAccounts返回的是数组
        let accounts = await window.ethereum.send('eth_requestAccounts');       // 在没有用React时，可以直接写ethereum.send('eth_requestAccounts');
        // let accounts = await web3.eth.getAccounts();         // 换成Arbitrum就报错，只能用ethereum.send('eth_requestAccounts');这时官方推荐的新用法
        console.log('accounts: ', accounts);
        accountAddress = accounts.result[0];
        console.log('accountAddress: ', accountAddress);

        // 查询账户余额
        let balance = await web3.eth.getBalance(accountAddress);

        this.setState({
            chainId,
            blockNumber,
            block_timestamp: blockTimestamp,
            account_address: accountAddress,
            account_balance: balance
        })
    }

    async read() {
        let web3 = this.state.web3;

        // 读取前先实例化合约
        // let contractAddress = document.getElementById("contract_address").value;
        let contractAddress = this.state.contract_address;
        console.log('contractAddress: ', contractAddress);
        let instance = new web3.eth.Contract(ERC20_Json.abi, contractAddress)      // 第一个参数是abi，第二个是地址
        console.log('instance: ', instance);
        console.log('ERC20_Json.abi: ', ERC20_Json.abi);
        console.log('contractAddress: ', contractAddress);

        // methods后面跟的是合约里的字段（public字段会自动生成对应的方法）或方法名
        let tokenSymbol = await instance.methods.symbol().call();
        let tokenTotalSupply = await instance.methods.totalSupply().call();
        // let balance = await instance.methods.balanceOf(accountAddress).call();
        let balance = await instance.methods.balanceOf(this.state.account_address).call();
        console.log("balance: ", balance);


        this.setState({
            token_symbol: tokenSymbol,
            token_totalSupply: tokenTotalSupply,
            token_balance: balance,
        })
    }

// 发起交易前要先进行签名
// 交易消耗多少gas，以及指定多少gasPrice是需要我们提前知道的（需要存到钱包里）
    async transfer() {
        let web3 = this.state.web3;

        let contractAddress = this.state.contract_address;
        let instance = new web3.eth.Contract(ERC20_Json.abi, contractAddress);


        let toAddress = this.state.to_address;
        let amount = this.state.transfer_amount;

        // 发送交易
        // 构造上链的data，然后签名，再广播
        // 不应该让用户输入18个0，所以用户如果想要输入1000000000000000000，只需要输入1即可，然后toWei会让数据自动带上18个0
        let transferData = instance.methods.transfer(toAddress, web3.utils.toWei(amount)).encodeABI();

        // 预执行一下，知道会消耗多少Gas
        // 如果用户在上链时可能出现报错，那么可以通过预执行提前知道，报错的话就不能让用户去签名，避免浪费Gas
        let estimateGas = await web3.eth.estimateGas({
            to: contractAddress,
            data: transferData,
            // from: accountAddress,
            from: this.state.account_address,
            value: '0x0'
        });

        let gasPrice = await web3.eth.getGasPrice();

        // 构造上链的原始信息
        // let nonce = await web3.eth.getTransactionCount(accountAddress);
        let nonce = await web3.eth.getTransactionCount(this.state.account_address);
        console.log('nonce: ', nonce);

        let rawTransaction = {
            // from: accountAddress,       // 签名的地址
            from: this.state.account_address,       // 签名的地址
            to: contractAddress,        // 合约地址
            nonce: web3.utils.toHex(nonce),
            gasPrice: gasPrice,
            gas: estimateGas * 2,           // 有可能出来预测偏少的情况，那我们要预留一定的数量，保证不会失败
            value: '0x0',                   // 这个value是要传ETH的，由于我们不传，所以是0
            data: transferData,
            chainId: this.state.chainId
        }

        // 发起上链交易
        // 需要等待交易打包，我们要监听这笔交易的状态拿到对应的 transaction Hash，追踪交易状态
        // https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=sendTransaction#sendtransaction
        web3.eth.sendTransaction(rawTransaction).on('transactionHash', function(hash) {
            console.log('txHash: ', hash);
            document.getElementById("tx_hash").innerText = hash;
        });

        // gasPrice默认单位是Gwei
        document.getElementById("estimate_gas").innerText = estimateGas;
        document.getElementById("gas_price").innerText = web3.utils.fromWei(
            gasPrice,
            "gwei"      // 1后面9个0，把单位传进来，配合fromWei，把decimal去掉
        );
    }
}

export default Connect;