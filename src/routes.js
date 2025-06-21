import Login from "./views/Login.js";
import Dashboard from "./views/dashboard/Index.js";
import AddEditProduct from "./views/dashboard/AddEditProduct.js";
import Products from "./views/dashboard/Products.js";
import Boards from "./views/dashboard/Boards.js";
import Orders from "./views/dashboard/Orders.js";
import FinishedOrders from "./views/dashboard/FinishedOrders.js";
import Users from "./views/dashboard/Users.js";
import AddUser from "./views/dashboard/AddUser.js";
import Statistics from "./views/dashboard/Statistics.js";
var routes = [
    {
        path: "/login",
        name: "Login",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
    },

    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: Dashboard,
        layout: "/dashboard",
    },
    {
        path: "/addEditProduct/:productId",
        name: "AddEditProduct",
        component: AddEditProduct,
        layout: "/dashboard",
    },
    {
        path: "/products",
        name: "Products",
        component: Products,
        layout: "/dashboard",
    },
    {
        path: "/boards",
        name: "Boards",
        component: Boards,
        layout: "/dashboard",
    },
    {
        path: "/orders",
        name: "Orders",
        component: Orders,
        layout: "/dashboard",
    },
    {
        path: "/finishedOrders",
        name: "FinishedOrders",
        component: FinishedOrders,
        layout: "/dashboard",
    },
    {
        path: "/users",
        name: "Users",
        component: Users,
        layout: "/dashboard",
    },
    {
        path: "/addUser",
        name: "AddUser",
        component: AddUser,
        layout: "/dashboard",
    },
    {
        path: "/statistics",
        name: "Statistics",
        component: Statistics,
        layout: "/dashboard",
    },

]

export default routes;  