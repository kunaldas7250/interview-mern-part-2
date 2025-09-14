import { createStore, combineReducers } from "redux";

// Action creators
const ADDING = () => ({ type: "Adding" });
const REMOVE = () => ({ type: "Removeing" });

// Initial State
const initialState = { count: 50 };

// Adding Reducer
const AddingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Adding":
      return { ...state, count: state.count + 5 };
    default:
      return state;
  }
};

// Removing Reducer
const RemovingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Removeing":
      return { ...state, count: state.count - 10 };
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  adding: AddingReducer,
  removing: RemovingReducer,
});

// Store
const store = createStore(rootReducer);

// Subscribe
store.subscribe(() => console.log("Updated State:", store.getState()));

// Dispatch
store.dispatch(ADDING()); 
store.dispatch(REMOVE());
