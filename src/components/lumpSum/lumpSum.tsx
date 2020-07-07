import React, { useState, useEffect } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable, { ResultTableItem } from '../resultTable/resultTable'
import Chart from '../chart/chart'

import './lumpSum.scss'

type LumpSumProps = { }

const LumpSum = (props: LumpSumProps) => { 

    const [loanAmount, setLoanAmount] = useState(config.DEFAULT_LOAN_AMOUNT.toString())
    const [interestRate, setInterestRate] = useState(config.DEFAULT_INTEREST_RATE.toString())
    const [loanTerm, setLoanTerm] = useState(config.DEFAULT_LOAN_TERM.toString())
    const [repaymentFrequency, setRepaymentFrequency] = useState(config.FREQUENCY_MONTHLY)

    const [lumpSum, setlumpSum] = useState(config.DEFAULT_LUMP_SUM.toString())
    const [lumpSumYear, setLumpSumYear] = useState(config.DEFAULT_LUMP_SUM_YEAR.toString())

    const [resultData, setResultData] = useState<ResultTableItem[]>([])

    interface ChartPoint {
        year: number
        original: number
        extra: number
      }

    
    const [data, setData] = useState<ChartPoint[]>([])

    useEffect(() => {

        calculate()
    
    }, [loanAmount, loanTerm, interestRate, repaymentFrequency, lumpSum, lumpSumYear])


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let x = e.target.value

        switch (e.target.id) {
            case 'loanTerm': setLoanTerm(x); break
            case 'loanAmount': setLoanAmount(x); break
            case 'interestRate': setInterestRate(x); break
            case 'lumpSum': setlumpSum(x); break
            case 'lumpSumYear': setLumpSumYear(x); break
        }
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        e.preventDefault()

        const val = e.target.value

        switch (e.target.id) {
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
        const rawInterestRate = parseFloat(interestRate)
        const rawLoanTerm = parseFloat(loanTerm)
        const rawLumpSum = parseFloat(lumpSum)
        const rawLumpSumYear = parseFloat(lumpSumYear)
      
        let scale = config.MONTHS_PER_YEAR
        
        let newResultData = []

        let interest = rawInterestRate / 100.0

        switch (repaymentFrequency)
        {
        case config.FREQUENCY_WEEKLY:        scale = config.WEEKS_PER_YEAR; break;
        case config.FREQUENCY_FORTNIGHTLY:   scale = config.FORTNIGHTS_PER_YEAR; break;
        default:                          scale = config.MONTHS_PER_YEAR; break;
        }

        interest = interest / scale            // interest per period
        const n = rawLoanTerm * scale       // number of payments
        const n2 = rawLumpSumYear * scale	// number of payments before lump sum

        //-----------------------------------------------------------------------------
        // repayment

        const res = app.calculateRepayment(rawLoanAmount, interest, n)
        //var pmt1 = app.PMT(interest, n, inputs.loan_amount, 0);
        //this.$('.repayment').html(format(res.repayment, 'C'));
       
       

        //-----------------------------------------------------------------------------
        // original total

        let a = app.total(interest, n, res.repayment, rawLoanAmount)
        //this.$('.original-total').html(format(a.total_principal + a.total_interest, 'C'))
        newResultData.push({ label: 'Original total:', value: format(a.total_principal + a.total_interest, 'C') })


        //-----------------------------------------------------------------------------
        // updated total

        const pmt1 = res.repayment

        const t = app.total(interest, n, pmt1, rawLoanAmount)

        const total_interest1 = t.total_interest

        // with extra lump sum

        a = app.total(interest, n2, pmt1, loanAmount)		// before lump sum

        const new_loan_amount = rawLoanAmount - a.total_principal - rawLumpSum
        const nper2 = app.NPER(interest, pmt1, -new_loan_amount, 0)
        const b = app.total(interest, nper2, pmt1, new_loan_amount)                   // after lump sum

        //debug('nper2 = ' + nper2 + ' s = ' + s + ' n = ' + n);

        //this.$('.updated-total').html(format(a.total_principal + b.total_principal + a.total_interest + b.total_interest, 'C'));
        newResultData.push({ label: 'Updated total', value: format(a.total_principal + b.total_principal + a.total_interest + b.total_interest, 'C') });

        //-----------------------------------------------------------------------------
        // chart data

        var total_interest2 = a.total_interest + b.total_interest

        let newData = []
        let j = 0

        for (var i = 0; i <= t.amount_owing.length; i++) {

            if (i === 0 || i % scale === 0 || i === n) {

                if (i < n2) {

                    newData.push({year: j++, original: t.amount_owing[i], extra: a.amount_owing[i]})
                }
                else {

                    if (i - n2 < b.amount_owing.length)
                        newData.push({year: j++, original: t.amount_owing[i], extra: b.amount_owing[i - n2]})
                    else
                        newData.push({year: j++, original: t.amount_owing[i] ? t.amount_owing[i] : 0, extra: 0})
                }
            }
        }

        /*
        var arr = [];
        var p1 = inputs.loan_amount;
        var p2 = inputs.loan_amount;
        var jump = true;

        for (var i = 0; i <= n; i++) {

            arr[i] = {};

            a = app.calculatePeriodRepayment(pmt1, interest, n, i);

            if (i == 0 || i % scale == 0 || i == n) {
                series[0].data.push(p1);
                arr[i].original = p1;
            }
            p1 -= a.principal_repayment;

            if (i >= s) {
                b = app.calculatePeriodRepayment(pmt1, interest, nper2, i - s);

                if (i == 0 || i % scale == 0 || i == n) {
                    series[1].data.push(p2);
                    arr[i].extra = p2;
                }

                p2 -= b.principal_repayment;

                if (jump) {
                    p2 -= inputs.lump_sum;
                    jump = false;
                }
            }
            else {

                if (i == 0 || i % scale == 0 || i == n) {
                    series[1].data.push(p1);
                    arr[i].extra = p1;
                }

                p2 -= a.principal_repayment;
            }
        }
*/
        const original_years = rawLoanTerm
        const years_saved = original_years - ((n2 + nper2) / scale)      
        const months_saved = (years_saved - Math.floor(years_saved)) * 12.0
        const interest_saved = total_interest1 - total_interest2

        newResultData.push({ label: 'Minimum monthly repayments:', value: format(res.repayment, 'C')});
        newResultData.push({ label: 'Time saved', value: Math.floor(years_saved) + ' years, ' + Math.ceil(months_saved) + ' months' });
        newResultData.push({ label: 'Interest saved', value: format(interest_saved, 'C') });

        setData(newData)
        setResultData(newResultData)
    }

  return (

    <CalculatorWrapper title='Lump Sum' 
            description='How much time and interest can you save by paying a lump sum off your home loan? Find out using this mortgage calculator.'>

        <div className='lump-sum'>

            <div className='section-container'>

                <div className='left-div'>

                    <div className='panel calc-panel'>

                        <div className='field'>
                            <label>Loan Amount:</label>
                            {/*<div className='slider loan-amount-slider'></div>*/}
                            <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                            <input id='loanAmount' value={ loanAmount } required onKeyPress={onKeyPress} onChange={ onChange } />
                        </div>

                        <div className='field'>
                            <label>Interest Rate:</label>
                            {/*<div className='slider interest-rate-slider'></div>*/}
                            <div className='currency'></div>
                            <input id='interestRate' className='short-text' value={ interestRate } onKeyPress={onKeyPress} onChange={ onChange } /> 
                            <span className='units'>%</span>
                        </div>

                        <div className='field'>
                            <label>Loan Term:</label>  
                            {/*<div className='slider loan-term-slider'></div> */} 
                            <div className='currency'></div>
                            <input id='loanTerm' className='short-text' value={ loanTerm } onKeyPress={onKeyPress} onChange={ onChange } /> 
                            <span className='units'>years</span>
                        </div>

                        <div className='field'>
                            <label>Repayment Frequency:</label> 
                            <div className='currency'></div>
                            <select id='repaymentFrequency' value={ repaymentFrequency } onChange={ onSelectChange } >
                                <option value={ config.FREQUENCY_MONTHLY }>Monthly</option>
                                <option value={ config.FREQUENCY_FORTNIGHTLY }>Fortnightly</option>
                                <option value={ config.FREQUENCY_WEEKLY }>Weekly</option>
                            </select>
                        </div>

                     

                        <div className='field'>
                            <label>Lump sum amount</label>
                            {/*<div className='slider lump-sum-slider'></div>*/}
                            <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                            <input id='lumpSum' value={ lumpSum } onKeyPress={onKeyPress} onChange={ onChange } />
                        </div>

                        <div className='field'>
                            <label>Lump sum payment made after</label>
                            {/*<div className='slider lump-sum-year-slider'></div>*/}
                            <div className='currency'></div>
                            <input id='lumpSumYear' className='short-text' value={ lumpSumYear } onKeyPress={onKeyPress} onChange={ onChange } /> 
                            <span className='units'>years</span>
                        </div>

                    </div> 
                </div>

                <div className='right-div'>	        

                    <div className='panel result-panel'>

                        {/*<div className='title'>Result</div>*/}

                        {/* <LineChart
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
                            <Line type="monotone" dataKey="original" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="extra" stroke="#82ca9d" />
                        </LineChart> */}

                        <Chart data={data} line1Name='original' line2Name='extra' /> 

                        {/* <div className='legend'></div> */}
                                    
                        <br />
                        <ResultTable data={resultData} />
                       
                    </div> 
                </div> 
            </div>
         </div>

    </CalculatorWrapper>
  )
}

export default LumpSum