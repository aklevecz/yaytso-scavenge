export default {};
// export const useWalletConnect = () => {
//   const context = useContext(WalletContext);

//   const initConnector = () =>
//     new WalletConnect({
//       bridge: "https://bridge.walletconnect.org",
//       qrcodeModal: QRCodeModal,
//     });

//   // const [connector, setConnector] = useState<WalletConnect>(initConnector());

//   if (context === undefined) {
//     throw new Error("Wallet Context error in WalletConnect hook");
//   }

//   const { dispatch, state } = context;

//   const walletConnect = (
//     address: string,
//     chainId: number,
//     connector: WalletConnect
//   ) =>
//     dispatch({
//       type: "SET_WALLETCONNECT",
//       wallet: { address, chainId, connector },
//     });

//   useEffect(() => {
//   if (!connector.connected) {
//     connector.createSession();
//   } else {
//     const { accounts, chainId } = connector;
//     console.log(accounts, chainId);
//     connector.updateSession({ accounts, chainId });
//     walletConnect(accounts[0], chainId, connector);
//   }
//   connector.on("connect", (error, payload) => {
//     if (error) {
//       throw error;
//     }
//     const { accounts, chainId } = payload.params[0];
//     walletConnect(accounts[0], chainId, connector);
//   });
//   connector.on("session_update", (error, payload) => {
//     if (error) {
//       throw error;
//     }
//     const { accounts, chainId } = payload.params[0];
//     walletConnect(accounts[0], chainId, connector);
//   });
//   connector.on("disconnect", (error, payload) => {
//     if (error) {
//       throw error;
//     }
//     context.disconnect();
//   });
//   return () => {
//     connector.killSession();
//   };
//   }, [connector]);

//   return state;
// };
