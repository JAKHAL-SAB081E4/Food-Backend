import userModel from "../models/userModel.js";
import foodModel from "../models/foodModels.js";

// ADD item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;


        const food = await foodModel.findById(itemId);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData;

    // if (!cartData[itemId]) {
    //   cartData[itemId] = 1;
    // } else {
    //   cartData[itemId] += 1;
    // }
  cartData[itemId] = (cartData[itemId] || 0) + 1;
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// REMOVE item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData;

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId]; // ✅ clean removal
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// GET user cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cartData: userData.cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
