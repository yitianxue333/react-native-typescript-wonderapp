import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

Reactotron.configure({
  name: "Wonder App Mobile",
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect({ enabled: __DEV__ });

// setTimeout(() => {
//   Reactotron.connect({enabled: __DEV__})
// }, 5000);

console.tron = Reactotron;
// console log
const oldeConsoleLog = console.log;
console.log = (...args) => {
  oldeConsoleLog(...args);
  Reactotron.display({
    name: "CONSOLE.LOG",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null,
  });
};

export default Reactotron;
