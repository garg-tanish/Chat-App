import App from "../App";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import AuthLayouts from "../layout/AuthLayouts";
import RegisterPage from "../pages/RegisterPage";
import MessagePage from "../components/MessagePage";
import Forgotpassword from "../pages/Forgotpassword";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <AuthLayouts><RegisterPage /></AuthLayouts>
            },
            {
                path: "login",
                element: <AuthLayouts><LoginPage /></AuthLayouts>
            },
            {
                path: 'forgot-password',
                element: <AuthLayouts><Forgotpassword /></AuthLayouts>
            },
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router