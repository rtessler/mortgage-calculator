import React, { useState, useEffect, useRef } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable, { ResultTableItem } from '../resultTable/resultTable'
import Chart from '../chart/chart'

import './borrowingPower.scss'


const BorrowingPower = (props: any) => { 

  const [inputs, setInputs] = useState({

    // income

    netSalaryFrequency1: config.FREQUENCY_MONTHLY,
    netSalary1: config.DEFAULT_MONTHLY_SALARY.toString(),
    netSalaryFrequency2: config.FREQUENCY_MONTHLY,
    netSalary2: '0',
    otherNetIncomeFrequency: config.FREQUENCY_MONTHLY,
    otherNetIncome: '0',
    jointIncome: true,
    maxIncomePercentAvailable: config.DEFAULT_MAX_INCOME_AVAILABLE.toString(),
    maxIncomePercentAvailableDefault: true,

    // expenses

    dependents: 0,
    monthlyExpenses: '0',
    monthlyExpensesDefault: true,
    carLoan: '0',
    creditCard: '0',
    otherMonthlyExpenses: '0',

    // loan

    interestRate: config.DEFAULT_INTEREST_RATE.toString(),
    loanTerm: config.DEFAULT_LOAN_TERM.toString(),
    interestRateBuffer: '1.50',
    interestRateBufferDefault: true,
    repaymentFrequency: config.FREQUENCY_MONTHLY,
  })

  const [resultData, setResultData] = useState<ResultTableItem[]>([])
  const [data, setData] = useState<ChartPoint[]>([])

  interface ChartPoint {
      year: number
      total: number
      principal: number
  }

    // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    //     let x = e.target.value

    //     switch (e.target.id) {
    //         case 'loanTerm': setLoanTerm(x); break
    //         case 'loanAmount': setLoanAmount(x); break
    //         case 'fixedPortion': setFixedPortion(x); break
    //         case 'fixedPeriod': setFixedPeriod(x); break
    //         case 'fixedInterestRate': setFixedInterestRate(x); break
    //         case 'variableInterestRate': setVariableInterestRate(x); break
    //     }
    // }

    // const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    //     e.preventDefault()

    //     const val = e.target.value

    //     switch (e.target.id) {
    //         case 'repaymentFrequency': setRepaymentFrequency(parseInt(val)); break;
    //     }
    // }

    const onChange = (e: any) => {

      e.preventDefault()

      const val = e.target.value

      let newInputs: any = {...inputs}

      newInputs[e.target.id] = val

      setInputs(newInputs)

      // switch (e.target.id) {
      //   case 'loanTerm': setLoanTerm(val); break
      //   case 'loanAmount': setLoanAmount(val); break
      //   case 'fixedPortion': setFixedPortion(val); break
      //   case 'fixedPeriod': setFixedPeriod(val); break
      //   case 'fixedInterestRate': setFixedInterestRate(val); break
      //   case 'variableInterestRate': setVariableInterestRate(val); break
      //   case 'repaymentFrequency': setRepaymentFrequency(parseInt(val)); break;
      // }
  }

  const onKeyPress = (e: any) => {

    var allowedChars = '0123456789.'

    if (allowedChars.indexOf(e.key) === -1)
      e.preventDefault()
  }

  const getMonthlyValue = (f: number, val: number) =>
  {
      switch (f) {
          case config.FREQUENCY_ANNUAL: val /= 12.0; break;
          case config.FREQUENCY_WEEKLY: val *= config.WEEKS_PER_YEAR / 12.0; break;
          case config.FREQUENCY_FORTNIGHTLY: val *= config.FORTNIGHTS_PER_YEAR / 12.0;  break;
      }
      
      return val;     
  }

  const calculate = () => {

    const finputs: any = {...inputs}

    finputs.netSalary1 = parseFloat(inputs.netSalary1)
    finputs.netSalary2 = parseFloat(inputs.netSalary2)
    finputs.otherNetIncome = parseFloat(inputs.otherNetIncome)
    finputs.maxIncomePercentAvailable = parseFloat(inputs.maxIncomePercentAvailable)

    // expenses

    finputs.dependents = parseInt(inputs.maxIncomePercentAvailable)
    finputs.monthlyExpenses = parseFloat(inputs.monthlyExpenses)
    finputs.carLoan = parseFloat(inputs.carLoan)
    finputs.creditCard = parseFloat(inputs.creditCard)
    finputs.otherMonthlyExpenses = parseFloat(inputs.otherMonthlyExpenses)

    // loan

    finputs.interestRate = parseFloat(inputs.interestRate)
    finputs.loanTerm = parseInt(inputs.loanTerm)
    finputs.interestRateBuffer = parseFloat(inputs.interestRateBuffer)


    var scale = config.MONTHS_PER_YEAR

    switch (inputs.repaymentFrequency) {
        case config.FREQUENCY_WEEKLY: scale = config.WEEKS_PER_YEAR; break;
        case config.FREQUENCY_FORTNIGHTLY: scale = config.FORTNIGHTS_PER_YEAR; break;
        default: scale = config.MONTHS_PER_YEAR; break;
    }

    var interest = (finputs.interestRate + finputs.interestRateBuffer) / 100.0

    interest /= 12.0;   // monthly interest

    var net_salary1 = getMonthlyValue(finputs.netSalaryFrequency1, finputs.netSalary1)
    var net_salary2 = getMonthlyValue(finputs.netSalaryFrequency2, finputs.netSalary2)
    var other_net_income = getMonthlyValue(finputs.otherNetIncome_frequency, finputs.otherNetIncome)
    
    var monthlyExpenses = finputs.monthlyExpenses + finputs.carLoan + finputs.creditCard + finputs.otherMonthlyPayments
    var monthlySalary = net_salary1 + net_salary2 + other_net_income

    var monthlyAvailable = ((finputs.maxIncomePercentAvailable / 100.0) * monthlySalary) - monthlyExpenses
    
    var n = Math.floor(finputs.loanTerm * 12.0)

    console.log('n: ', n)
    
    // http://www.infobarrel.com/Financial_Math%3A__How_Much_Can_I_Afford_to_Borrow%3F
    
    let loanAmount = (monthlyAvailable / interest) * (( Math.pow((1.0 + interest), n) - 1.0 ) / ( Math.pow((1.0 + interest), n) ))
    
    loanAmount -= loanAmount % 1000;     // round down to nearest thousand
    
    const normalInterest = ((finputs.interestRate ) / 100.0) / 12
                
    const pmt = Calculator.PMT(normalInterest, n, loanAmount, 0)
    
    // this.$(".res1").html(format(loan_amount, "C"));
    // this.$(".res2").html(format(pmt, "C"));       
        
    
    let principal = loanAmount
    let total = loanAmount + app.total(normalInterest, n, pmt, loanAmount).total_interest

    let newData = []
    let j = 0
    
    for (let i = 0; i < n; i++)
    {
        var interestPayment = principal * normalInterest
        var principalPayment = pmt - interestPayment
                    
        //arr.push({principal: principal, total: total});

        if (i == 0 || i % scale == 0 || i == n) {

            // series[0].data.push(principal);
            // series[1].data.push(total);

            newData.push({year: j++, principal: principal, total: total})
        }
        
        principal -= principalPayment; 
        total -= pmt;
    }       
            
     let newResultData = [];

     newResultData.push({label: "Borrowing Power", value: ""})
     newResultData.push({label: "joint income", value: finputs.jointIncome ? "true" : "false"})
     newResultData.push({label: "dependents", value: inputs.dependents })
                    
     newResultData.push({label: "net_salary_frequency1", value: finputs.netSalaryFrequency1})
     newResultData.push({label: "net_salary1", value: format(finputs.netSalary1, "C")})
    
     newResultData.push({label: "net_salary_frequency2", value: finputs.netSalaryFrequency2})
     newResultData.push({label: "net_salary2", value: format(finputs.netSalary2, "C")})
    
     newResultData.push({label: "monthly expenses", value: format(finputs.monthlyExpenses, "C")})        
     newResultData.push({label: "car loan", value: format(finputs.carLoan, "C")})
     newResultData.push({label: "credit card", value: format(finputs.creditCard, "C")})
     newResultData.push({label: "other payments", value: format(finputs.otherMonthlyPayments, "C")})
     newResultData.push({label: "max percent income available", value: format(finputs.maxIncomePercentAvailable, "C") })
            

     newResultData.push({label: "interest rate", value: finputs.interestRate + "%"})
     newResultData.push({label: "loan term", value: finputs.loanTerm + " years"})
     newResultData.push({label: "total interest:", value: finputs.interestRateBuffer + "%"})
    
     newResultData.push({label: "you can borrow", value: format(loanAmount, "C") })
     newResultData.push({label: "repayments", value: format(pmt, "C") })

     setData(newData)
     setResultData(newResultData)
  }

    // stop warning message about missing dependencies in useEffect

  const { current: calculateRef } = useRef(calculate)

  useEffect(() => {

    calculateRef()
  
  }, [inputs, calculateRef])

  return (
  
    <CalculatorWrapper title='Borrowing Power' 
        description='This calculator provides an estimate of your borrowing power based on your income, financial commitments and loan details entered. You may also consider looking at our loan repayment calculator to determine your repayments based on the amount you 
        wish to borrow.'>

        <div className='borrowing-power'>


            <div className='top-div'>

              <div className='panel calc-panel'>

                <div style={{float: 'left', width: '273px'}}>

                  <table>
                    <tbody>

                    <tr>
                        <td><strong>Income</strong></td>
                    </tr>

                    <tr>
                        <td colSpan={3}>Net salary</td>
                    </tr>

                    <tr>
                        <td>
                          <select id='netSalaryFrequency1' value={inputs.netSalaryFrequency1} onChange={ onChange } >
                            <option value={config.FREQUENCY_ANNUAL}>Annually</option>
                            <option value={config.FREQUENCY_MONTHLY}>Monthly</option>
                            <option value={config.FREQUENCY_FORTNIGHTLY}>Fortnightly</option>
                            <option value={config.FREQUENCY_WEEKLY}>Weekly</option>
                          </select>
                        </td>
        
                        <td> 
                          <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                          <input id='netSalary1' className='short-text' value={inputs.netSalary1} onKeyPress={onKeyPress} onChange={ onChange } />
                        </td>
                    </tr>

                      <tr>
                          <td colSpan={3}>Net salary 2</td>
                      </tr>

                      <tr>
                        <td>

                          <select id='netSalaryFrequency2' value={inputs.netSalaryFrequency2} onChange={ onChange } >
                            <option value={config.FREQUENCY_ANNUAL}>Annually</option>
                            <option value={config.FREQUENCY_MONTHLY}>Monthly</option>
                            <option value={config.FREQUENCY_FORTNIGHTLY}>Fortnightly</option>
                            <option value={config.FREQUENCY_WEEKLY}>Weekly</option>
                          </select>

                        </td>

                        <td>
                          <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                          <input id='netSalary2' className='readonly short-text' value={inputs.netSalary2} readOnly onKeyPress={onKeyPress} onChange={ onChange } />
                        </td>
                      </tr>

                      <tr>
                          <td colSpan={3}>Other net income</td>
                      </tr>

                      <tr>
                          <td>
                              <select id='otherNetIncomeFrequency' value={inputs.otherNetIncomeFrequency} onChange={ onChange } >
                                <option value={config.FREQUENCY_ANNUAL}>Annually</option>
                                <option value={config.FREQUENCY_MONTHLY}>Monthly</option>
                                <option value={config.FREQUENCY_FORTNIGHTLY}>Fortnightly</option>
                                <option value={config.FREQUENCY_WEEKLY}>Weekly</option>
                            </select>
                          </td>
  
                          <td>
                              <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                              <input id='otherNetIncome' className='short-text' value={inputs.otherNetIncome} onKeyPress={onKeyPress} onChange={ onChange } />
                          </td>
                      </tr>

                      <tr>
                          <td>Joint Income <input id='jointIncome' type='checkbox' value='1' checked={inputs.jointIncome} onChange={ onChange } /></td>

                      </tr>

                      <tr>
                          <td colSpan={3}>
                              Maximum percent of income available
                          </td>
                      </tr>

                      <tr>
                          <td>
                            <input id='maxIncomePercentAvailable' className='short-text readonly' value={inputs.maxIncomePercentAvailable} readOnly onKeyPress={onKeyPress} onChange={ onChange } /> 
                            <span className='units'>%</span>
                          </td>

                          <td>
                              <input id='maxIncomePercentAvailableDefault' type='checkbox' checked={inputs.maxIncomePercentAvailableDefault} value='1' onChange={ onChange } />default
                          </td>
                      </tr>
                      </tbody>
                  </table>
                </div>

                  <div style={{float: 'left', width: '272px'}}>

                    <table>
                      <tbody>

                        <tr>
                            <td colSpan={3}><strong>Expenses</strong></td>
                        </tr>

                        <tr>
                            <td colSpan={3}>Dependents</td>
                        </tr>

                        <tr>
                            <td><input id='dependents' className='short-text' value={inputs.dependents} onKeyPress={onKeyPress} onChange={ onChange } /></td>
                        </tr>

                        <tr>
                            <td colSpan={3}>Monthly Expenses</td>
                        </tr>                        

                        <tr>
                        
                            <td>
                              <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                                <input id='monthlyExpenses' className='short-text readonly' value={inputs.monthlyExpenses} onKeyPress={onKeyPress} onChange={ onChange } /> 
                            </td>

                            <td>
                                <input id='monthlyExpensesDefault' type='checkbox' checked={inputs.monthlyExpensesDefault} value='1' onChange={ onChange } />
                                default
                            </td>
                        </tr>
      
          
                        <tr>
                            <td colSpan={3}>Monthly car loan repayment</td>
                        </tr>

                        <tr>             			               
                            <td>
                            <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                                <input id='carLoan' className='short-text' value={inputs.carLoan} onKeyPress={onKeyPress} onChange={ onChange } />
                            </td>
                      </tr>
            
                      <tr>
                          <td colSpan={3}>Average monthly credit card repayment</td>
                      </tr>

                      <tr>           			            
                          <td>
                            <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                              <input id='creditCard' className='short-text' value={inputs.creditCard} onKeyPress={onKeyPress} onChange={ onChange } />
                          </td>
                      </tr>			    
              
                      <tr>
                          <td colSpan={3}>Other monthly payments</td>
                      </tr>

                      <tr>                       
                          <td>
                            <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                            <input id='otherMonthlyExpenses' className='short-text' value={inputs.otherMonthlyExpenses} onKeyPress={onKeyPress} onChange={ onChange } />
                          </td>
                      </tr>
                </tbody>
              </table>

            </div> 
          </div>
        </div>


              <div className='middle-div'>

                  <div className='calc-panel'>
          
                      <div className='field'>
                          <label >Interest Rate</label>
          
                          <div className='slider interest-rate-slider'></div>  
                          <div className='currency'></div>
                          <input id='interestRate' className='short-text' value={inputs.interestRate} onKeyPress={onKeyPress} onChange={ onChange } /> 
                          <span className='units'>%</span>
                      </div>
          
                      <div className='field'>
                          <label >Loan term</label>  
          
                          <div className='slider loan-term-slider'></div>  
                          <div className='currency'></div>
                          <input id='loanTerm' className='short-text' value={inputs.loanTerm} onKeyPress={onKeyPress} onChange={ onChange } /> 
                          <span className='units'>years</span>
                      </div>
                
                      <div className='field' >
                          <label>Interest rate buffer</label>  
                          <div className='currency'></div>
                          <input className='interest-rate-buffer short-text readonly' value={inputs.interestRateBuffer} readOnly /> 
                          <span className='units'>%</span>
          
                          <input id='interestRateBufferDefault' type='checkbox' checked={inputs.interestRateBufferDefault} value='1' onKeyPress={onKeyPress} onChange={ onChange } /> Use default
                      </div>

                      <div className='field'>
                        <label>Repayment Frequency</label>
                        <div className='currency'></div> 
                        <select id='repaymentFrequency' value={inputs.repaymentFrequency} onChange={ onChange } >
                            <option value={config.FREQUENCY_MONTHLY}>Monthly</option>
                            <option value={config.FREQUENCY_FORTNIGHTLY}>Fortnightly</option>
                            <option value={config.FREQUENCY_WEEKLY}>Weekly</option>
                        </select>
                    </div>
                </div>
              </div> 

              <div className='bottom-div'>
            
                <div className='panel result-panel'>
                    
                <Chart data={data} line1Name='total' line2Name='principal' />  

                <br />

                <ResultTable data={resultData} />

                {/* <div className='result'>
        
                  <table>
                    <tr>
                        <td><label className='label1'>You can borrow up to:</label></td>
                        <td><label className='res1'>0</label></td>
                    </tr>
            
                    <tr>
                        <td><label className='label2'>monthly repayments:</label></td>
                        <td><label className='res2'>0</label></td>
                    </tr>
                    </table>
        
                </div> */}
              
            </div> 
          </div> 

      </div>
    </CalculatorWrapper>
  )
}

export default BorrowingPower