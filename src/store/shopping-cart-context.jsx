import { createContext, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

/*Steps:
1st: Create the Context (creates an empty object)
2nd: Use Context.Provider to involve all child components that need access to information created in the context;
3rd: Set the value that will be used dynamically; Ex: <CartContext.Provider value={shoppingCart}>
4th: Use useContext() to get data from the context, anywhere in the application you want to use it.*/

//Ex: const { items } = useContext(CartContext);

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

/*Steps: useReducer
1st: Define a reducer function. This is where we handle our state logic.
It receives two parameters: currentState and action.
*/

function shoppingCartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  if (action.type === 'UPDATE_CART') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

export default function CartContextProvider({ children }) {
  /*Steps: useReducer
    1- Create a dispatch function that will be used to call the reducer and update the global state.
    2- Use useReducer hook from React library with our reducer and an initial empty cart as the initial state.
    3- Use useReducer to create the state and dispatch function.
  */
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_CART',
      payload: { productId, amount },
    });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
