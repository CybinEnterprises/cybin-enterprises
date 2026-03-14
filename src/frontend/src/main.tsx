import ReactDOM from "react-dom/client";
import App from "./App";
import "../index.css";

console.log('🎯 main.tsx loading!');

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

console.log('🎯 About to create root...');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);

console.log('🎯 Root rendered!');
