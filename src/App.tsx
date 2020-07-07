import React from 'react'
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import Header from './components/header/Header'
import LeftPanel from './components/leftPanel/LeftPanel'
import RightPanel from './components/rightPanel/rightPanel'

import BorrowingPower from './components/borrowingPower/borrowingPower'
import ExtraRepayment from './components/extraRepayment/extraRepayment'
import LoanComparison from './components/loanComparison/loanComparison'
import LoanRepayment from './components/loanRepayment/loanRepayment'
import LumpSum from './components/lumpSum/lumpSum'
import PrincipalAndInterest from './components/principalAndInterest/principalAndInterest'
import SplitLoan from './components/splitLoan/splitLoan'
import StampDuty from './components/stampDuty/stampDuty'

import './App.scss'

// import { createBrowserHistory } from 'history'


// export const history = createBrowserHistory( {
//     basename: process.env.PUBLIC_URL
// } );

function App() {
  return (

    <div id="wrapper">

      <Router> 

        <div className='home-page-view'>

          <Header message='hello' />

          <div className="layout">
             
                <LeftPanel />

                <Switch>    

                  <Route exact path='/' component={LoanRepayment} />
                  <Route path='/borrowing-power' component={BorrowingPower} />
                  <Route path='/extra-repayment' component={ExtraRepayment} />
                  <Route exact path='/loan-comparison' component={LoanComparison} />
                  <Route path='/loan-repayment' component={LoanRepayment} />
                  <Route exact path='/lump-sum' component={LumpSum} />
                  <Route path='/principal-and-interest' component={PrincipalAndInterest} />
                  <Route exact path='/split-loan' component={SplitLoan} />
                  <Route path='/stamp-duty' component={StampDuty} />

                </Switch>  

                  <RightPanel />

            </div>

        </div>

    </Router>
          
  </div>

  )
}

export default App
