import { useEffect, useState } from "react";
import { apiGetPayments } from "../../api/products";
import { BarChart } from "@mui/x-charts";
import { Typography } from "@mui/material";
import { showErrorToast } from "../../utils/utilFunctions";


const Statistics = () => {


    const [data, setData] = useState([]);

    useEffect(() => {
        apiGetPayments((response) => {
            setData(response.data);
        }, showErrorToast);
    }, [data.length]);


    const chartSetting = {
        xAxis: [
            {
                label: 'Total (lei)',
            },
        ],
        height: 400,
    };

    function valueFormatter(value) {
        return `${value} lei`;
    }


    return (
        <>
            <Typography variant="h6" sx={{ ml: 2, mt: 2, fontSize: '30px' }}>Plati</Typography>
            <BarChart
                dataset={data}
                yAxis={[{ scaleType: 'band', dataKey: 'month_name' }]}
                series={[{ dataKey: 'total', label: 'Total', valueFormatter }]}
                layout="horizontal"
                {...chartSetting}
            />
        </>

    );
};

export default Statistics;