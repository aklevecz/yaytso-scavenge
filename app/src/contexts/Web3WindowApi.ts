import { ethers, providers } from "ethers";
import { callbackify } from "util";

export class Web3WindowApi {
  ethereum: any;
  provider: ethers.providers.Web3Provider | undefined;
  signer: ethers.Signer | undefined;
  isAvailable: boolean = false;
  chainId: number | undefined;

  constructor() {
    if (typeof window.ethereum !== "undefined") {
      this._init();
    } else {
      console.error("No metamask is present");
    }
  }

  async _init() {
    this.ethereum = window.ethereum;
    this.isAvailable = true;
    const { provider, signer } = this._getSignerProvider();
    this.provider = provider;
    this.signer = signer;
    const { chainId } = await this.provider.getNetwork();
    console.log(chainId);
    this.chainId = chainId;
  }

  _getSignerProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
  }

  requestAccount() {
    return this.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts: string[]) => {
        console.log(this.chainId);
        return {
          address: accounts[0],
          signer: this.signer,
          provider: this.provider,
          chainId: this.chainId,
        };
      });
  }

  onNetworkChange(_callback: any) {
    console.log(_callback);
    this.ethereum.on("networkChange", (chainId: number) => {
      console.log("network change");
      const { provider, signer } = this._getSignerProvider();
      _callback({ type: "INIT_WALLET", provider, signer, chainId });
    });
  }
}
