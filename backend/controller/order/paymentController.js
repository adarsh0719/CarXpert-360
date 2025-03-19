const stripe=require('../../config/stripe')
const UserModel=require('../../models/userModel')
const paymentController=async(request,response)=>{
    try{
    const{cartItems}=request.body
    const user=await UserModel.findOne({_id:request.userId})
    const params={
      submit_type:'pay',
      mode:'payment',
      payment_method_types:['card'],
      billing_address_collection:'auto',
      shipping_options:[
        {
            shipping_rate:'shr_1QdAsQDF7Zu61Le8UIw4JHkn'
        }
      ],
      customer_email:user.email,
      metadata:{
        userId:request.userId
      },
      line_items:cartItems.map((items,index)=>{
        return{
            price_data:{
                currency:'usd',
                product_data:{
                   name:items.productId.productName,
                   images:items.productId.productImage,
                   metadata:{
                    productId:items.productId._id
                   }
                },
                unit_amount:items.productId.sellingPrice*100

            },
            adjustable_quantity:{
                enabled:true,
                minimum:1
            },
            quantity:items.quantity
        }
      }),
      success_url:`${process.env.FRONTEND_URL}/success`,
      cancel_url:`${process.env.FRONTEND_URL}/cancel`,
    }
    const session =await stripe.checkout.sessions.create(params)
    response.status(303).json(session)
    }catch(error){
        response.json({
            message : error?.message || error,
            error : true,
            success : false
        })
    }
}

module.exports=paymentController