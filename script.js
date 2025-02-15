const express=require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const buy = require("./routes/user/business/buy");
const sell = require("./routes/user/business/sell");
const cart = require("./routes/user/cart");
const login = require("./routes/user/logins");
const orders = require("./routes/user/orders");
const profile = require("./routes/user/profile");
const sold = require("./routes/user/sold");

//no caps in url
app.use("/user",login);
app.use("/:username/orders", orders);
app.use("/:username/sold", sold);
app.use("/:username/profile", profile);
app.use("/:username/cart", cart);
app.use("/:username/buy", buy);
app.use("/:username/sell", sell);

// REST




app.get("/",(req,res)=>{
    res.json({
        message:"Home page"
    })
});


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});