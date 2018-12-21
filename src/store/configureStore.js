import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import applyAppStateListener from "redux-enhancer-react-native-appstate";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import Reactotron from "reactotron-react-native";
import { PURGE, blacklist } from "@utils";

const persistConfig = {
  key: "root",
  storage,
  blacklist,
};

const composeEnhancers =
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  __DEV__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const configureStore = (initialState) => {
  // create store and persistor per normal...
  const makeStore = __DEV__ ? Reactotron.createStore : createStore;
  //   const makeStore = createStore;

  const store = makeStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyAppStateListener(), applyMiddleware(...middlewares)),
  );

  const persistor = persistStore(store);

  // Uncomment next line to dev purge the store.
  if (PURGE) {
    persistor.purge();
  }

  if (module.hot) {
    module.hot.accept(() => {
      // This fetch the new state of the above reducers.
      const nextRootReducer = require("./reducers");
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};

export const { store, persistor } = configureStore();
