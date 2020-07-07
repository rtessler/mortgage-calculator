import React from 'react'
import { NavLink } from "react-router-dom"

import './LeftPanel.scss'

type LeftPanelProps = { };

export default (props: LeftPanelProps) => { 

  return <div className='left-panel'>
            <nav >
              <ul>
                <li><NavLink to="/loan-repayment">Loan Repayment</NavLink></li>
                <li><NavLink to="/extra-repayment">Extra Repayment</NavLink></li>
                <li><NavLink to="/lump-sum">Lump Sum</NavLink></li>
                <li><NavLink to="/split-loan">Split Loan</NavLink></li>
                <li><NavLink to="/principal-and-interest">Principal and Interest</NavLink></li>
                <li><NavLink to="/borrowing-power">Borrowing Power</NavLink></li>
                <li><NavLink to="/stamp-duty">Stamp Duty</NavLink></li>
                <li><NavLink to="/loan-comparison">Loan Comparison</NavLink></li>
              </ul>
            </nav> 
          </div>
}

