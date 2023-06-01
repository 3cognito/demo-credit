import App from "./app";
import AuthRoute from "../src/routes/auth.routes";
import WalletRoute from "../src/routes/wallet.routes";

new App([new AuthRoute(), new WalletRoute()]);
