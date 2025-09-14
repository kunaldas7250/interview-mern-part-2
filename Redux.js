
import { createStore } from "redux";

// ✅ Action Creators
function orderPizza() {
  return {
    type: "ORDER_PIZZA",
    shopName: "DOMINO",
  };
}

function addTopping(topping) {
  return {
    type: "ADD_TOPPING",
    topping,
  };
}

function removeTopping(topping) {
  return {
    type: "REMOVE_TOPPING",
    topping,
  };
}

// ✅ Initial State
const initialState = {
  Pizza_Base: 100,
  Toppings: ["cheese", "ketchup"],
};

// ✅ Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDER_PIZZA":
      return {
        ...state,
        Pizza_Base: state.Pizza_Base - 1,
      };

    case "ADD_TOPPING":
      return {
        ...state,
        Toppings: [...state.Toppings, action.topping],
      };

    case "REMOVE_TOPPING":
      return {
        ...state,
        Toppings: state.Toppings.filter(
          (item) => item !== action.topping
        ),
      };

    default:
      return state;
  }
};

// ✅ Store
const store = createStore(reducer);

// ✅ Subscribe
const unscribe=store.subscribe(() => console.log("Updated State:", store.getState()));

// ✅ Dispatch multiple actions
store.dispatch(orderPizza()); 
store.dispatch(addTopping("olives")); 
store.dispatch(addTopping("jalapeno")); 
store.dispatch(removeTopping("ketchup"));
unscribe()
store.dispatch(addTopping("olives"));