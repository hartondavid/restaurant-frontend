import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { RIGHTS_MAPPING } from "../../utils/utilConstants.js";
const Dashboard = ({ userRights }) => {

    const rightCode = userRights[0]?.right_code;

    return (
        <>
            <Typography variant="h4">
                {/* <span className="font-bold text-black">{'dashboard'}</span> */}
                {/* <Navigate to="/dashboard/orders" /> */}
                {rightCode === RIGHTS_MAPPING.MANAGER && (
                    <Navigate to="/dashboard/boards" />
                )}
                {rightCode === RIGHTS_MAPPING.WAITER && (
                    <Navigate to="/dashboard/boards" />
                )}
                {rightCode === RIGHTS_MAPPING.CHEF && (
                    <Navigate to="/dashboard/orders" />
                )}
            </Typography>
        </>
    )
}
export default Dashboard;