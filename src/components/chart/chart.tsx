import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

import config from '../../common/config'

const Chart = (props: any) => {

  console.log('Chart')

  const {data, line1Name, line2Name} = props

  return <LineChart
    width={config.CHART_WIDTH}
    height={config.CHART_HEIGHT}
    data={data}
    margin={{
      top: 5, right: 30, left: 20, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year"  />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey={line1Name} stroke={ config.CHART_LINE1_STROKE_COLOR } activeDot={{ r: 8 }} />
    <Line type="monotone" dataKey={line2Name} stroke={ config.CHART_LINE2_STROKE_COLOR } />
  </LineChart>
}

export default Chart