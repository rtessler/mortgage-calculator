import React, { useState, useEffect } from 'react'
import CalculatorWrapper from '../calculatorWrapper/calculatorWrapper'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import app from '../../common/app'
import config from '../../common/config'
import { format } from '../../common/loancalc'
import Calculator from '../../common/calculator'
import ResultTable from '../resultTable/resultTable'
import { round2 } from '../../common/math'

import './principalAndInterest.scss'

type PrincipalAndInterestProps = { }

const PrincipalAndInterest = (props: PrincipalAndInterestProps) => { 

  const [loanAmount, setLoanAmount] = useState(config.DEFAULT_LOAN_AMOUNT.toString())
  const [interestRate, setInterestRate] = useState(config.DEFAULT_INTEREST_RATE.toString())
  const [loanTerm, setLoanTerm] = useState(config.DEFAULT_LOAN_TERM.toString())
  const [repaymentFrequency, setRepaymentFrequency] = useState(config.FREQUENCY_MONTHLY)

  const [extraRepayment, setExtraRepayment] = useState('0')
  const [monthlyRepayment, setMonthlyRepayment] = useState('0')

  const [resultData, setResultData] = useState<any[]>([])

  useEffect(() => {

    calculate()

  }, [loanAmount, loanTerm, interestRate, repaymentFrequency])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    //e.preventDefault()

    let x = e.target.value

    switch (e.target.id) {
      case 'loanTerm': setLoanTerm(x); break
      case 'loanAmount': setLoanAmount(x); break
      case 'interestRate': setInterestRate(x); break
    }
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
        const rawInterestRate = parseFloat(interestRate)
        const rawLoanTerm = parseFloat(loanTerm)
        const rawExtraRepayment = parseFloat(extraRepayment)
        let interest = rawInterestRate / 100.0
        let scale = config.MONTHS_PER_YEAR


        interest /= 12.0
        const n = rawLoanTerm * 12.0
        const pmt = Calculator.PMT(interest, n, rawLoanAmount, 0)

        //pmt += inputs.extra_payments;
        //n = app.NPER(interest, pmt, -(inputs.loan_amount), 0);

        var monthly_payment = app.calculateRepayment(rawLoanAmount, interest, n);
        //debug(monthly_payment);
        setExtraRepayment( round2(pmt).toString() )

        var arr = [];

        var principal = rawLoanAmount;
        var total_interest = 0;
        var total_principal = 0;

        for (var i = 0; i < n; i++) {
            var interest_payment = principal * interest;
            var principal_payment = pmt - interest_payment;
            principal -= principal_payment;

            total_principal += principal_payment;
            total_interest += interest_payment;

            arr.push( {
                interest: interest_payment,
                principal: principal_payment,
                total_interest: total_interest,
                total_principal: total_principal,
                principal_remaining: principal
            });
        }

        //var yearno = $(".yearno").val();
        //yearno = parseInt(yearno);

        //this.$(".yearid").html(yearno);

        //yearno -= 1;


        var columns = [
                    "year",
                    "month",
                    "Interest",
                    "Principal",
                    "Interest to date",
                    "Principal to date",
                    "Principal remaining"];

        var rows = [];

        var month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

        for (var i = 0; i < n; i++)
        {
            rows[i] = [Math.floor(i / 12) + 1,
                month[i - Math.floor(i / 12) * 12],
                format(arr[i].interest, "C"),
                format(arr[i].principal, "C"),
                format(arr[i].total_interest, "C"),
                format(arr[i].total_principal, "C"),
                format(arr[i].principal_remaining, "C")
            ];
        }

        var options = {
            columns: columns,
            rows: rows,
            pagesize: 12,
            columnFormatter: null,
            cellFormatter: null
        };

        //$(".result-table").mjGrid(options);

        //this.$(".result-table").find("tr:gt(0)").remove();


        //for (var i = 12 * yearno; i < (12 * yearno) + 12 && i < n; i++) {
        //    var str = "<tr>";
        //    str += "<td>" + (i + 1) + "</td>";
        //    str += "<td>$" + arr[i].interest.toFixed(2) + "</td>";
        //    str += "<td>$" + addCommas(arr[i].principal.toFixed(2)) + "</td>";
        //    str += "<td>$" + addCommas(arr[i].total_interest.toFixed(2)) + "</td>";
        //    str += "<td>$" + addCommas(arr[i].total_principal.toFixed(2)) + "</td>";
        //    str += "<td>$" + addCommas(arr[i].principal_remaining.toFixed(2)) + "</td>";
        //    str += "</tr>";

        //    this.$(".result-table").append(str);
        //}

        //this.$(".result-table tr:odd").css("background", "#eee");
        //this.$(".result-table tr:even").css("background", "#fff");

        let newResultData = []

        newResultData.push({label: 'Principal and Interest', value: ''})
        newResultData.push({ label: "loan amount", value: config.CURRENCY_SYMBOL + format(rawLoanAmount) });
        newResultData.push({ label: "interest rate", value: format(rawInterestRate, 'C') + "%" });
        newResultData.push({ label: "loan term", value: rawLoanTerm + " years" });
        newResultData.push({ label: "extra payments", value: format(rawExtraRepayment, 'C') });
        newResultData.push({ label: "monthly payment", value: config.CURRENCY_SYMBOL + format(pmt, 'C') });

        setResultData(newResultData)
  }

  return (
    <div className='principal-and-interest'>

      <div className='section-container'>

        <div className='top-div'>

            <div className='panel calc-panel'>

                <div className='field' style={{float: 'left', width: '300px'}}>
                    <label>Loan Amount:</label>
                    <div className='slider loan-amount-slider'></div>
                    <div className='currency'>{ config.CURRENCY_SYMBOL }</div> 
                    <input className='loan-amount' value={ loanAmount } required onKeyPress={onKeyPress} onChange={ onChange } />
                </div>

                <div className='field'>
                    <label>Interest Rate:</label>  
                    <div className='slider interest-rate-slider'></div>  
                    <div className='currency'></div>
                    <input className='interest-rate short-text' value={ interestRate } required onKeyPress={onKeyPress} onChange={ onChange }  /> 
                    <span className='units'>%</span>
                </div>

                <div className='field' style={{float: 'left', width: '300px'}}>
                    <label>Extra payments per month:</label>  
                    <div className='slider extra-payments-slider'></div>
                    <div className='currency'></div>
                    <input className='extra-payments short-text' value={ extraRepayment } required onKeyPress={onKeyPress} onChange={ onChange } />
                </div>

                <div className='field'>
                    <label>Number of Years:</label>  
                    <div className='slider loan-term-slider'></div>  
                    <div className='currency'></div>
                    <input className='loan-term short-text' value={ loanTerm } required onKeyPress={onKeyPress} onChange={ onChange }  />
                </div>

            </div> 
        </div> 

      <div className='bottom-div'>

          <div className='panel result-panel'>

            <p>Monthly payment: <span className='monthly-payment'>{ monthlyRepayment }</span></p>

                {/* <table className='result-table' >
              <tr>
                  <th>Payment Number (Year <span className='yearid'>1</span>) Month</th>           
                  <th>Interest</th>
                  <th>Principal</th>
                  <th>Interest to Date</th>
                  <th>Principal to Date</th>
                  <th>Principal Remaining</th>
              </tr>
              </table> */}

                <ResultTable data={resultData} />

                <br />

                    <div className='spinner' style={{float: 'right'}}>
      {/* 
                  <input value='1' className='yearno short-text' style='float: left;'/>

                  <div style='float: left;'>
                      <ul>
                          <li><a className='up' href='#' ><img src='./assets/images/up-arrow.png' /></a></li>
                          <li><a className='down' href='#' ><img src='./assets/images/down-arrow.png' /></a></li>
                      </ul>
      </div> */}
              </div>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default PrincipalAndInterest