import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
     ResponsiveContainer,
     BarChart,
     Bar,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     Legend,
} from 'recharts';

const DynamicChart = () => {
     const [data, setData] = useState([]);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await axios.get(
                         `${process.env.REACT_APP_API_BASE_URL}/getMonthlyComplete`
                    );
                    setData(response.data.data);
               } catch (error) {
                    console.error('Error fetching data:', error);
               }
          };

          fetchData();
     }, []);

     return (
          <div  className='ml-20' style={{ width: '50%', height: 350 }}>
               <h3 className='flex justify-center'>Show How many orders completed or declined</h3>
               <ResponsiveContainer>
                    <BarChart
                         data={data}
                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                         <YAxis label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="completedOrders" fill="#79D7BE" />
                         <Bar dataKey="declinedOrders" fill="#2E5077" />
                    </BarChart>
               </ResponsiveContainer>
          </div>
     );
};

export default DynamicChart;
