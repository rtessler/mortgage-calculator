import React, { useState, useEffect, useMemo } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable, { ResultTableItem } from '../resultTable/resultTable'
import { round2 } from '../../common/math'
//import _, {debounce} from 'lodash';
//import useDebounce from '../../common/useDebounce'
import Chart from '../chart/chart'

import './loanRepayment.scss'

type LoanRepaymentProps = { };

const LoanRepayment = (props: LoanRepaymentProps) => { 

  const [loanAmount, setLoanAmount] = useState(config.DEFAULT_LOAN_AMOUNT.toString())
  const [interestRate, setInterestRate] = useState(config.DEFAULT_INTEREST_RATE.toString())
  const [loanTerm, setLoanTerm] = useState(config.DEFAULT_LOAN_TERM.toString())
  const [repaymentFrequency, setRepaymentFrequency] = useState(config.FREQUENCY_MONTHLY)
  //const [repaymentType, setRepaymentType] = useState(app.PRINCIPAL_AND_INTEREST)

  interface ChartPoint {
    year: number
    principal: number
    total: number
  }
  

  const [data, setData] = useState<ChartPoint[]>([])

  // result fields

  const [resultData, setResultData] = useState<ResultTableItem[]>([])

  //const debouncedSearchTerm = useDebounce(data, 1000)

  useEffect(() => {


    calculate()

  }, [loanAmount, loanTerm, interestRate, repaymentFrequency])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // _.debounce(function(e) {

    //   console.log('set')

        let x = e.target.value
           
        switch (e.target.id) {
          case 'loanTerm': setLoanTerm(x); break
          case 'loanAmount': setLoanAmount(x); break
          case 'interestRate': setInterestRate(x); break
        }

      //}, 1000)
  }

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    e.preventDefault()

    const val = e.target.value

    switch (e.target.id) {
      case 'repaymentFrequency': setRepaymentFrequency(parseInt(val)); break;
      //case 'repaymentType': setRepaymentType(val); break
    }
  }

  const onKeyPress = (e: any) => {

    var allowedChars = '0123456789.'

    if (allowedChars.indexOf(e.key) === -1)
      e.preventDefault()
  }

  const calculate = () => {

    const rawLoanAmount = parseFloat(loanAmount)
    const rawLoanTerm = parseFloat(loanTerm)
    const rawInterestRate = parseFloat(interestRate)
    
    
    let scale = config.MONTHS_PER_YEAR
    
    switch (repaymentFrequency)
    {
    case config.FREQUENCY_WEEKLY:        scale = config.WEEKS_PER_YEAR; break;
    case config.FREQUENCY_FORTNIGHTLY:   scale = config.FORTNIGHTS_PER_YEAR; break;
    default:                          scale = config.MONTHS_PER_YEAR; break;
    }

    const periodInterest = (rawInterestRate / 100.0)/ scale

    const n = rawLoanTerm * scale      // number of payments

    //console.log('calculate: loanAmount: ', amount, ' interest: ', interest, ' repaymentFrequency: ', repaymentFrequency, 'scale: ', scale )
    
    //const res = app.calculateRepayment2(amount, interest, n, repaymentType)

    const repayment = Calculator.repayment(rawLoanAmount, periodInterest, n)
    const totalCost = Calculator.totalCost(rawLoanAmount, periodInterest, n)

    let p : number = rawLoanAmount                   // principal
    let a : number = p + totalCost - rawLoanAmount   // total to pay

    let newData = []
    let j = 0
    
    for (let i = 0; i <= n; i++)
    {
        // if (repaymentType == app.INTEREST_ONLY)
        // {
        //   // principal never goes down

        //   if (i == 0 || i % scale == 0 || i == n) {
              
        //       newData.push({year: j++, principal: Math.round(p * 100) / 100, total: Math.round(a * 100) / 100})
        //   }            
        // }
        // else
        // {
          const r = Calculator.periodPrincipalRepayment(repayment, periodInterest, n, i)

          //console.log(r)

          if (i === 0 || i % scale === 0 || i === n) {
              newData.push({year: j++, principal: round2(p), total: round2(a)})
          }

          p -= r             
        //}

        a -= repayment
    }



    // setPeriodRepayment(format(repayment, "C"))
    // setTotalInterest(format(totalCost - rawLoanAmount, "C"))
    // setTotalAmount(format(totalCost, "C"))

    let newResultData = [
      {label: config.FREQUENCY_NAME[repaymentFrequency] + " repayments:", value: format(repayment, "C")},
      {label: 'total cost of loan', value: format(totalCost, "C")},
      {label: 'total interest payable', value: format(totalCost - rawLoanAmount, "C")}
    ]

    setData(newData)
    setResultData(newResultData)
  }

  const drawChart = () => {

    return <Chart data={data} line1Name='principal' line2Name='total' />
  }

  const memoizedDrawChart = useMemo(() => drawChart(), [data])

  console.log('render')

  return (
    <CalculatorWrapper title='Loan Repayment' 
      description='By using this home loan calculator you can work out what your minimum weekly, fortnightly or monthly home loan repayments would be for the amount you are 
      planning to borrow.'>

      <div className='loan-repayment-view'>

      <div className='section-container'>

        <div className='left-div'>

          <div className='panel calc-panel'>

              <div className='field'>
                  <label>Loan term</label>                    
                  {/*<div className='slider loan-term-slider'></div>  */}
                  <div className='currency'></div>
                  <input id='loanTerm' className='short-text' value={ loanTerm } required onKeyPress={onKeyPress} onChange={ onChange } /> 
                  <span className='units'>years</span>
              </div>                

            <div className='field'>
                <label>Loan amount</label>				    
                {/*<div className='slider loan-amount-slider'></div>*/}
                <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                <input id='loanAmount' value={ loanAmount } required onKeyPress={onKeyPress} onChange={ onChange } />
            </div>

            <div className='field'>
                <label>Interest rate</label>				    
                {/*<div className='slider interest-rate-slider'></div>*/}
                <div className='currency'></div>
                <input id='interestRate' className='short-text' value={ interestRate } required onKeyPress={onKeyPress} onChange={ onChange } /> 
                <span className='units'>%</span>
            </div>

            <div className='field'>
                <label>Repayment frequency</label> 
                <div className='currency'></div> 
                <select id='repaymentFrequency' value={ repaymentFrequency } onChange={ onSelectChange } >
                    <option value={ config.FREQUENCY_MONTHLY }>Monthly</option>
                    <option value={ config.FREQUENCY_FORTNIGHTLY }>Fortnightly</option>
                    <option value={ config.FREQUENCY_WEEKLY }>Weekly</option>
                </select>
            </div>

            {/* <div className='field'>
                <label>Repayment type</label>
                <div className='currency'></div> 

                <select id='repaymentType' value={ repaymentType } onChange={ onSelectChange }>
                    <option value={ app.PRINCIPAL_AND_INTEREST }>principal &amp; Interest</option>
                    <option value={ app.INTEREST_ONLY }>interest only</option>
                </select>
            </div> */}

            <br />

        </div> 
      </div> 

      <div className='right-div'>

          <div className='panel result-panel'>

          {/*<div className='chart' ></div>  */}
  {/*                <div className='axis-label y-axis-label vertical-text'>amount</div>
                  <div className='axis-label x-axis-label'>years</div>*/}

              {/* { memoizedDrawChart } */}

              <Chart data={data} line1Name='principal' line2Name='total' /> 

              <br />

              <ResultTable data={resultData} />

          </div> 
      </div> 

    </div>
   </div>
   </CalculatorWrapper>
  )
}

export default LoanRepayment