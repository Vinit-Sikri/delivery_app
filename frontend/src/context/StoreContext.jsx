import { createContext, useEffect, useState } from "react";
import axios from "axios"


export const StoreContext = createContext(null);

const StoreContextProvider =(props)=>{

  const[cartItems , setCartItems] = useState({});
  const url = "https://delivery-app-backendd.onrender.com"
  const [token,setToken] = useState("");
  const [food_list,setFoodList] = useState([]);

  const fetchFoodList = async()=>{
    const response = await axios.get(url+"/api/food/list")
    setFoodList(response.data.data)
  }

const loadCartData = async (token) => {
  try {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  } catch (error) {
    console.error("Invalid token, clearing localStorage", error);
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  }
};


  useEffect(()=>{
    async function loadData(){
      await fetchFoodList();
      if(localStorage.getItem('token')){
        setToken(localStorage.getItem('token'))
        await loadCartData(localStorage.getItem("token"));
      }
    }loadData();
  },[])

  const addToCart= async (itemId)=>{
    if(!cartItems[itemId]){
      setCartItems((prev)=>({...prev,[itemId]:1}))
    }
    else{
      setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }

      if (token) {
        await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})   
      }
  }

  const removeFromCart=async(itemId)=>{
     setCartItems((prev)=>({
      ...prev,[itemId]:prev[itemId]-1
     }))
     if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
     }
  }

const getTotalAmount = () => {
  let totalAmount = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      const itemInfo = food_list.find(product => product?._id === item);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
};

  const contextValue = {
      food_list,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      getTotalAmount,
      url,
      token,
      setToken
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider