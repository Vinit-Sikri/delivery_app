import React, { useContext } from 'react'
import "./FoodDisplay.css"
import { StoreContext } from './../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category}) => {
  const {food_list} = useContext(StoreContext)

  if (!food_list || !Array.isArray(food_list)) return null;

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes Near You</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (!item) return null;
          if (category === "All" || category === item.category) {
            return (
              <FoodItem 
                key={index} 
                id={item._id} 
                name={item.name} 
                description={item.description} 
                price={item.price} 
                image={item.image} 
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default FoodDisplay