import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const placeOrder = async (req, res) => {
//   // const frontend_url = "http://localhost:5173";

//   try {
//     const userId = req.userId;
//     const { items, amount, address } = req.body;

//     // create order
//     const newOrder = new orderModel({
//       userId,
//       items,
//       amount,
//       address,
//       payment:false,
//     });

//     await newOrder.save();

//     // clear cart
//     if (success == "true") {
//   await orderModel.findByIdAndUpdate(orderId, { payment: true });
//   await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
// }


//     // stripe line items
//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: "USD",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100 
//       },
//       quantity: item.quantity,
//     }));

//     // delivery charge
//     line_items.push({
//       price_data: {
//         currency: "USD",
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: 2*100, 
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
//     });
//  console.log("FRONTEND_URL:", process.env.FRONTEND_URL);


//     res.json({
//       success: true,
//       session_url: session.url,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message});
//   }
// };

const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "USD",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "USD",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// const verifyOrder=async (req,res)=>{
//    const {orderId,success}=req.body;
//    try {
//     if(!orderId){
//       console.log("orderId not found");
      
//     }
//     else{
//       console.log("orderId is found");
      
//     }
//     if (success=="true") {
//       await orderModel.findByIdAndUpdate(orderId,{payment:true});
//       res.json({success:true,message:"Paid"})
//     }
//     else{
//         await orderModel.findByIdAndDelete(orderId);
//      res.json({success:false,message:"Not Paid"})
//     }
//    } catch (error) {
//       console.log(error);
//       res.json({success:false,message:"Error"})
      
//    }
// }

//user orders for frontend
const userOrders =async(req,res)=>{
    try {
     
      const orders =await orderModel.find({userId: req.userId});
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
    }
}

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query;

  try {
    if (!orderId) {
      return res.json({ success: false, message: "OrderId missing" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Verification Error" });
  }
};

//Listing orders fro admin panel
const listOrders=async(req,res)=>{
   try {
     const orders=(await orderModel.find({}));
     res.json({success:true,data:orders})
   } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
   }
}

//api for updating order status
const updateStatus= async(req,res)=>{
   try {
     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
     res.json({success:true,message:"Status Updated"})
   } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
     
   }
}

export { placeOrder,verifyOrder ,userOrders,listOrders,updateStatus};