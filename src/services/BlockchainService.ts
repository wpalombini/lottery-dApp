import Web3 from 'web3';
import LotteryContract from '../abis/LotteryContract.json';

export enum GameStateEnum {
  OPEN,
  CLOSED,
  PROCESSING_WINNERS,
  PAYING_WINNERS,
  PAYING_WINNERS_COMPLETED,
}
export class BlockchainService {
  private _window: any = window as any;
  private web3: Web3;
  private lotteryContract: any;

  public async isConnected(): Promise<boolean> {
    return typeof this.web3 !== 'undefined' && (await this.web3.eth.getChainId()) > 0;
  }

  public isAdmin(): boolean {
    // TODO: find whether the default account is the smart contract's admin
    return this.web3.eth.defaultAccount === '0x9a6BB2BE1978371D662C9B9F6f5C9Ce56205c11E';
  }

  public async connect(): Promise<void> {
    if (this._window.ethereum) {
      try {
        this.web3 = new Web3(this._window.ethereum);
        const defaultAccount = await this._window.ethereum.enable();
        this.web3.eth.defaultAccount = defaultAccount[0];

        const netId = await this.web3.eth.net.getId();

        this.lotteryContract = new this.web3.eth.Contract(
          LotteryContract.abi as any,
          (LotteryContract.networks as any)[netId].address,
        );

        this.subscribeToWebWalletEvents();
      } catch (error) {
        throw new Error('could not connect to the blockchain');
      }
    } else {
      throw new Error('Please use MetaMask');
    }
  }

  public getCurrentAccountAddress(): string | null {
    return this.web3.eth.defaultAccount;
  }

  public async getBalance(): Promise<string> {
    if (await this.isConnected()) {
      return Number(
        this.web3.utils.fromWei(await this.web3.eth.getBalance(this.web3.eth.defaultAccount as string)),
      ).toFixed(5);
    } else {
      throw new Error('Not connected to blockchain network.');
    }
  }

  public async getCurrentGameId(): Promise<number> {
    return await this.lotteryContract.methods.currentGameId().call();
  }

  public async getCurrentGameState(): Promise<GameStateEnum> {
    return await this.lotteryContract.methods.gameState().call();
  }

  public async getTotalBetsAmount(gameId: number): Promise<string> {
    const game = await this.lotteryContract.methods.games(gameId).call();
    return this.web3.utils.fromWei(game.totalBetAmount, 'Gwei');
  }

  public async startGame(): Promise<void> {
    try {
      await this.lotteryContract.methods.startGame().send({ from: this.getCurrentAccountAddress() });
      // .on('receipt', (receipt: any): void => {
      //   // ideally rxjs/Subject would be pushing a boolean here, but just rushing through it for now to see the app working
      //   console.log(receipt);
      // });
    } catch (error) {
      console.log(error);
    }
  }

  public async drawNumbers(numbers: number): Promise<void> {
    try {
      await this.lotteryContract.methods.drawNumbers(numbers).send({ from: this.getCurrentAccountAddress() });
    } catch (error) {
      console.log(error);
    }
  }

  private subscribeToWebWalletEvents(): void {
    this._window.ethereum.on('accountsChanged', (): void => {
      this._window.location.reload();
    });
  }
}
