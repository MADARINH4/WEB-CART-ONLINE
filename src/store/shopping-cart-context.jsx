import { createContext } from 'react';

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
