import React, { useState, useEffect } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable, { ResultTableItem } from '../resultTable/resultTable'
import Chart from '../chart/chart'

type ExtraRepaymentProps = { }

const ExtraRepayment = (props: ExtraRepaymentProps) => { 

    const [loanAmount, setLoanAmount] = useState(config.DEFAULT_LOAN_AMOUNT.toString())
    const [interestRate, setInterestRate] = useState(config.DEFAULT_INTEREST_RATE.toString())
    const [loanTerm, setLoanTerm] = useState(config.DEFAULT_LOAN_TERM.toString())
    const [repaymentFrequency, setRepaymentFrequency] = useState(config.FREQUENCY_MONTHLY)

    const [extraRepayment, setExtraRepayment] = useState(config.DEFAULT_EXTRA_REPAYMENT.toString())
    const [extraRepaymentStart, setExtraRepaymentStart] = useState(config.DEFAULT_EXTRA_REPAYMENT_START.toString())

    const [resultData, setResultData] = useState<ResultTableItem[]>([])

    interface ChartPoint {
        year: number
        original: number
        extra: number
    }
    
    const [data, setData] = useState<ChartPoint[]>([])

    useEffect(() => {

        calculate()
    
    }, [loanAmount, loanTerm, interestRate, repaymentFrequency, extraRepayment, extraRepaymentStart])


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let x = e.target.value

        switch (e.target.id) {
            case 'loanTerm': setLoanTerm(x); break
            case 'loanAmount': setLoanAmount(x); break
            case 'interestRate': setInterestRate(x); break
            case 'extraRepayment': setExtraRepayment(x); break
            case 'extraRepaymentStart': setExtraRepaymentStart(x); break
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
        const rawExtraRepayment = parseFloat(extraRepayment)
        const rawExtraRepaymentStart = parseFloat(extraRepaymentStart)
        let interest = rawInterestRate / 100.0
        let scale = config.MONTHS_PER_YEAR

        let newResultData = []

        switch (repaymentFrequency)
        {
        case config.FREQUENCY_WEEKLY:        scale = config.WEEKS_PER_YEAR; break;
        case config.FREQUENCY_FORTNIGHTLY:   scale = config.FORTNIGHTS_PER_YEAR; break;
        default:                          scale = config.MONTHS_PER_YEAR; break;
        }

		interest /= scale
		const n = rawLoanTerm * scale                   // number of payments
		const n2 = rawExtraRepaymentStart * scale		// start after n payments

	    //-----------------------------------------------------------------------------
        // min monthly payment
		
        const repayment = Calculator.repayment(rawLoanAmount, (rawInterestRate / scale)/100.0, n)
        newResultData.push({label: 'Minimum monthly repayments:', value: format(repayment, "C")})
		const pmt1 = repayment
		const nper1 = n

	    // ----------------------------------------------------------------------------
        // original total

		var a = app.total(interest, nper1, pmt1, rawLoanAmount)

        const originalTotalCost = Calculator.totalCost(rawLoanAmount, (rawInterestRate / scale)/100.0, n)
        newResultData.push({label: 'Original total:', value: format(originalTotalCost, "C")})

	    //------------------------------------------------------------------------------
	    // increased monthly payment

        newResultData.push({label: 'Increased monthly repayments:', value: format(pmt1 + rawExtraRepayment, "C")})

	    //-----------------------------------------------------------------------------
        // updated total		

		const pmt2 = pmt1 + rawExtraRepayment
		const t = app.total(interest, n2, pmt1, rawLoanAmount)
		const nper2 = n - n2
		
		const b = app.total(interest, nper2, pmt2, t.principal_remaining)
		
        newResultData.push({label: 'Updated total:', value: format(b.total_principal + b.total_interest + t.total_principal + t.total_interest, "C")})

	    //--------------------------------------------------------------------------------------------
	    // interest saved

		const interest_saved = a.total_interest - (t.total_interest + b.total_interest)
        newResultData.push({label: 'Interest saved:', value: format(interest_saved, "C")})

	    //--------------------------------------------------------------------------------------------
	    // updated time

		const years2 = (t.payment_no + b.payment_no) / scale
		const months2 = (years2 - Math.floor(years2)) * 12.0

        newResultData.push({label: 'Updated time:', value: Math.floor(years2) + " years, " + Math.floor(months2) + " months"})

	    //--------------------------------------------------------------------------------------------
	    // time saved
			
		const years_saved = rawLoanTerm - years2
		const months_saved = 12 - Math.floor(months2)

        newResultData.push({label: 'Time saved:', value: Math.floor(years_saved) + " years, " + months_saved + " months"})

	    //--------------------------------------------------------------------------------------------
        // chart data


		let p1 = rawLoanAmount
        let p2 = rawLoanAmount
        
        let newData = []
        let j = 0

		for (let i = 0; i <= nper1; i++) {

            const v = Calculator.periodPrincipalRepayment(pmt1, interest, nper1, i)

		    if (i >= n2) {

                // we are paying extra

                const u = Calculator.periodPrincipalRepayment(pmt2, interest, nper2, i )
                
                //console.log('principal repayment: ', u)

		        if (i === 0 || i % scale === 0 || i === n) {

                    newData.push({year: j++, original: p1, extra: p2 > 0 ? p2 : 0})
		        }

		        p2 -= u
		    }
		    else {
                // not yet started paying extra

		        if (i === 0 || i % scale === 0 || i === n) {

                    newData.push({year: j++, original: p1, extra: p1 > 0 ? p1 : 0})
		        }

		        p2 -= v 
            }
            
            p1 -= v
        }

        setData(newData)
        setResultData(newResultData)
    }

    return (

        <CalculatorWrapper title='Extra Repayment' 
                        description='Use this mortgage calculator to find out how much time and interest can you save by paying more than the minimum repayment.'>
    
            <div className='extra-repayment'>

                <div className='section-container'>

                    <div className='left-div'>

                        <div className='panel calc-panel'>

                            <div className='field'>
                                <label>Loan term</label>             
                                {/* <div className='slider loan-term-slider'></div> */}
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

                            <div className='field'>
                                <label>Extra contribution per payment</label>           
                                {/*<div className='slider extra-contribution-slider'></div>*/}
                                <div className='currency'>{ config.CURRENCY_SYMBOL }</div>
                                <input id='extraRepayment' className='short-text' value={ extraRepayment } required onKeyPress={onKeyPress} onChange={ onChange } />
                            </div>

                            <div className='field'>
                                <label>Extra contribution starts after</label>          
                                {/*<div className='slider extra-contribution-start-slider'></div>*/}
                                <div className='currency'></div>
                                <input id='extraRepaymentStart' className='short-text' value={ extraRepaymentStart } required onKeyPress={onKeyPress} onChange={ onChange } /> 
                                <span className='units'>years</span>
                            </div>

                        </div> 
                    </div> 

                    <div className='right-div'>

                        <div className='panel result-panel'>

                            <Chart data={data} line1Name='original' line2Name='extra' /> 
                                                    
                            <br />

                            <ResultTable data={resultData} />
                        </div> 

                    </div> 

                </div>
            </div>
        </CalculatorWrapper>
    )
}

export default ExtraRepayment