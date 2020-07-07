import React, { useState, useEffect, useRef } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable, { ResultTableItem } from '../resultTable/resultTable'
import Chart from '../chart/chart'

import './splitLoan.scss'

// see: https://www.ing.com.au/home-loans/calculators/split-loan.html

type SplitLoanProps = { }

const SplitLoan = (props: SplitLoanProps) => { 

  const [loanAmount, setLoanAmount] = useState(config.DEFAULT_LOAN_AMOUNT.toString())
  const [loanTerm, setLoanTerm] = useState(config.DEFAULT_LOAN_TERM.toString())
  const [repaymentFrequency, setRepaymentFrequency] = useState(config.FREQUENCY_MONTHLY)
  const [fixedPortion, setFixedPortion] = useState(config.DEFAULT_FIXED_PORTION_PERCENTAGE.toString()) 
  const [fixedPeriod, setFixedPeriod] = useState(config.DEFAULT_FIXED_PERIOD_YEARS.toString())
  const [fixedInterestRate, setFixedInterestRate] = useState(config.DEFAULT_FIXED_INTEREST_RATE.toString())
  const [variableInterestRate, setVariableInterestRate] = useState(config.DEFAULT_INTEREST_RATE.toString())

  const [resultData, setResultData] = useState<ResultTableItem[]>([])
  const [data, setData] = useState<ChartPoint[]>([])

  interface ChartPoint {
      year: number
      variable: number
      fixed: number
  }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let x = e.target.value

        switch (e.target.id) {
            case 'loanTerm': setLoanTerm(x); break
            case 'loanAmount': setLoanAmount(x); break
            case 'fixedPortion': setFixedPortion(x); break
            case 'fixedPeriod': setFixedPeriod(x); break
            case 'fixedInterestRate': setFixedInterestRate(x); break
            case 'variableInterestRate': setVariableInterestRate(x); break
        }
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        e.preventDefault()

        const val = e.target.value

        switch (e.target.id) {
            case 'repaymentFrequency': setRepaymentFrequency(parseInt(val)); break;
        }
    }

    const onChange2 = (e: any) => {

      e.preventDefault()

      const val = e.target.value

      switch (e.target.id) {
        case 'loanTerm': setLoanTerm(val); break
        case 'loanAmount': setLoanAmount(val); break
        case 'fixedPortion': setFixedPortion(val); break
        case 'fixedPeriod': setFixedPeriod(val); break
        case 'fixedInterestRate': setFixedInterestRate(val); break
        case 'variableInterestRate': setVariableInterestRate(val); break
        case 'repaymentFrequency': setRepaymentFrequency(parseInt(val)); break;
      }
  }

    const onKeyPress = (e: any) => {

        var allowedChars = '0123456789.'
    
        if (allowedChars.indexOf(e.key) === -1)
          e.preventDefault()
      }

  const calculate = () => {

    const rawLoanAmount = parseFloat(loanAmount)
    const rawVariableInterestRate = parseFloat(variableInterestRate)
    const rawFixedInterestRate = parseFloat(fixedInterestRate)
    const rawLoanTerm = parseFloat(loanTerm)
    const rawFixedPeriod = parseFloat(fixedPeriod)
    const rawFixedPortion = parseFloat(fixedPortion)

    let variable_interest = rawVariableInterestRate / 100.0
    let fixed_interest = rawFixedInterestRate / 100.0
    let scale = config.MONTHS_PER_YEAR

    switch (repaymentFrequency)
    {
    case config.FREQUENCY_WEEKLY:        scale = config.WEEKS_PER_YEAR; break;
    case config.FREQUENCY_FORTNIGHTLY:   scale = config.FORTNIGHTS_PER_YEAR; break;
    default:                          scale = config.MONTHS_PER_YEAR; break;
    }

    variable_interest /= scale
    fixed_interest /= scale
    const n = rawLoanTerm * scale
    const s = rawFixedPeriod * scale

    const fixed_loan_amount = rawLoanAmount * rawFixedPortion / 100.0
    const pmt_fixed = Calculator.PMT(fixed_interest, n, fixed_loan_amount, 0)

    const variable_loan_amount = rawLoanAmount * (100 - rawFixedPortion) / 100.0
    const pmt_variable = Calculator.PMT(variable_interest, n, variable_loan_amount, 0)

    console.log("pmt_fixed = " + pmt_fixed + " pmt_variable = " + pmt_variable)

    const x = pmt_fixed + pmt_variable

    const pmt_normal = Calculator.PMT(variable_interest, n, rawLoanAmount, 0)
    const total_interest = app.total(variable_interest, n, pmt_normal, rawLoanAmount).total_interest

    console.log("total_interest = " + total_interest)

    const a = app.total(fixed_interest, s, pmt_fixed, fixed_loan_amount)
    const b = app.total(variable_interest, s, pmt_variable, variable_loan_amount)

    var r = rawLoanAmount - a.total_principal - b.total_principal
    var pmt4 = Calculator.PMT(variable_interest, n - s, r, 0)
    var c = a.total_interest + b.total_interest + app.totalInterest(variable_interest, n - s, pmt4, r).total_interest

    let p1 = fixed_loan_amount
    let p2 = variable_loan_amount
    let p3 = r

    let newData = []
    let j = 0

    for (let i = 0; i <= n; i++) {

        if (i < s) {
            // const aa = app.calculatePeriodRepayment(pmt_variable, variable_interest, s, i)
            // const bb = app.calculatePeriodRepayment(pmt_fixed, fixed_interest, s, i)

            const aaa = Calculator.periodPrincipalRepayment(pmt_variable, variable_interest, s, i)
            const bbb = Calculator.periodPrincipalRepayment(pmt_fixed, fixed_interest, s, i)

            if (i === 0 || i % scale === 0 || i === n)
                newData.push({year: j++, fixed: p1 > 0 ? p1 : 0, variable: p2 > 0 ? p2 : 0})

            p1 -= aaa //aa.principal_repayment
            p2 -= bbb //bb.principal_repayment
        }
        else {
            //const aa = app.calculatePeriodRepayment(pmt4, variable_interest, n - s, i)
            const aaa = Calculator.periodPrincipalRepayment(pmt4, variable_interest, n, i)

            if (i === 0 || i % scale === 0 || i === n) 
                newData.push({year: j++, fixed: 0, variable: p3 > 0 ? p3 : 0})

            p3 -= aaa //aa.principal_repayment				
        }
    }

    setData(newData)

    let newResultData = []

    newResultData.push({ label: "fixed repayment", value: format(pmt_fixed, "C") })
    newResultData.push({ label: "variable repayment", value: format(pmt_variable, "C") })
    newResultData.push({ label: "total monthly repayment", value: format(x, "C") })
    newResultData.push({ label: "total interest payable", value: format(c, "C") })
    newResultData.push({ label: "total Interest payable if loan was at a variable rate only", value: format(total_interest, "C") })

    setResultData(newResultData)
  }

  

  // stop warning message about missing dependencies in useEffect

  const { current: calculateRef } = useRef(calculate)

  useEffect(() => {

    calculateRef()
  
  }, [loanAmount, loanTerm, repaymentFrequency, fixedPortion, fixedPeriod, fixedInterestRate, variableInterestRate, calculateRef])

  return (

    <CalculatorWrapper title='Split Loan' 
        description='Spliting your home loan into fixed and variable rate portions can provide you with both security and flexibility. 
                  This mortgage calculator helps you work out different options for splitting your home loan.'>

        <div className='split-loan'>

            <div className='section-container'>

            <div className='left-div'>

                <div className='panel calc-panel'>

                    <div className='field'>
                        <label>Loan Amount</label>
                        {/*<div className='slider loan-amount-slider'></div>*/}
                        <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                        <input id='loanLmount' value={loanAmount} required onKeyPress={onKeyPress} onChange={ onChange } />
                    </div>

                    <div className='field'>
                        <label>Fixed Portion</label>
                        {/*<div className='slider fixed-portion-slider'></div>*/}
                        <div className='currency'></div>
                        <input id='fixedPortion' className='short-text' value={fixedPortion} required onKeyPress={onKeyPress} onChange={ onChange } /> 
                        <span className='units'>%</span>
                    </div>

                    <div className='field'>
                        <label>Fixed Period</label>  
                        {/*<div className='slider fixed-period-slider' ></div>  */}
                        <div className='currency'></div>
                        <input id='fixedPeriod' className='short-text' value={fixedPeriod} required onKeyPress={onKeyPress} onChange={ onChange } /> 
                        <span className='units'>years</span>
                    </div>

                    <div className='field'>
                        <label>Fixed Interest Rate</label>  
                        {/*<div className='slider fixed-interest-rate-slider'></div>  */}
                        <div className='currency'></div>
                        <input id='fixedInterestRate' className='short-text' value={fixedInterestRate} required onKeyPress={onKeyPress} onChange={ onChange } /> 
                        <span className='units'>%</span>
                    </div>

                    <div className='field'>
                        <label>Variable Interest Rate</label>  
                        {/*<div className='slider variable-interest-rate-slider'></div>  */}
                        <div className='currency'></div>
                        <input id='variableInterestRate' className='short-text' value={variableInterestRate} required onKeyPress={onKeyPress} onChange={ onChange } /> 
                        <span className='units'>%</span>
                    </div>

                    <div className='field'>
                        <label>Loan Term</label>  
                        {/*<div className='slider loan-term-slider'></div>*/}  
                        <div className='currency'></div>
                        <input id='loanTerm' className='short-text' value={ loanTerm } required onKeyPress={onKeyPress} onChange={ onChange } /> 
                        <span className='units'>years</span>
                    </div>

                    <div className='field'>
                        <label>Repayment Frequency</label>
                        <div className='currency'></div>
                        <select id='repaymentFrequency' value={repaymentFrequency} onChange={ onSelectChange } >
                            <option value={config.FREQUENCY_MONTHLY}>Monthly</option>
                            <option value={config.FREQUENCY_FORTNIGHTLY}>Fortnightly</option>
                            <option value={config.FREQUENCY_WEEKLY}>Weekly</option>
                        </select>
                    </div>

                </div> 
            </div>

            <div className='right-div'>
            
                <div className='panel result-panel'>

                    <Chart data={data} line1Name='variable' line2Name='fixed' />                     
                    <br />
                    <ResultTable data={resultData} />
                </div> 
              </div> 
            </div>
        </div>
    </CalculatorWrapper>
  )
}

export default SplitLoan