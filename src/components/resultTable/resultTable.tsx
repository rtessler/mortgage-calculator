import React from 'react'

import './resultTable.scss'

export type ResultTableItem = {label: string, value: string}
export type ResultTableData = {data: ResultTableItem[]}

export default function (props: ResultTableData)  { 

  return (
      <div className='result'>

          {
            props.data.map((r: any, i: number) =>  <div className='row' key={i}>
                <div className='label'>{r.label}</div>
                <div className='value'>{r.value}</div>
              </div>
            )
          }

      </div>
  )
}

