export default class Calculator {

  static periodPrincipalRepayment(total_repayment: number, interest: number, repayment_no: number, period: number): number {

    // use this to get the principal repayment on a principal and interest loan

    // total_repayment: the fixed sum paid every period
    // interest: the interest for the period
    // repayment_no: the total number of periods
    // period: the current period

    // see http://www.ext.colostate.edu/pubs/farmmgt/03757.html

    if (period === 0 || period >= repayment_no)
        return 0

    return total_repayment * (Math.pow((1.0 + interest), -(1.0 + repayment_no - period)))
  }

  static totalPrincipal(total_repayment: number, interest: number, repayment_no: number, n: number): number {

    // get total principal paid after n periods

    let total = 0

    for (let i = 0; i < n; i++)
      total += Calculator.periodPrincipalRepayment(total_repayment, interest, repayment_no, i)

    return total
  }

  static repayment(P: number, I: number, L: number) : number {

    // use this to calculate the periodic payment in a principal and interest loan

    // https://www.hughcalc.org/formula.php

    // P = principal, the initial amount of the loan
    // I = the annual interest rate (from 1 to 100 percent)
    // L = length, the length (in years) of the loan, or at least the length over which the loan is amortized.

    // J = monthly interest in decimal form = I / (12 x 100)
    // N = number of months over which loan is amortized = L x 12

    // const J = I / (12 * 100)
    // const N = L * 12

    return P * (I/(1-(1+I) ** -L))
  }

  static totalCost(P: number, I: number, N: number) : number {

    // https://www.wikihow.com/Calculate-Total-Interest-Paid-on-a-Car-Loan

    // P: principal
    // I: interest rate in each payment period. eg if paying 6% monthly I = 6/12
    // N: total number of payments. eg for a 5 year loan paying monthly N = 5 * 12

    return (I * P * N) / (1 - ((1 + I) ** -N))
  }

  static PMT(rate: number, nper: number, pv: number, fv: number) : number
  {
      // rate: interest for a period
      // nper: number of payments
      // pv : principal

      // calculates the total repayment for a period
      
      if (rate === 0)
          return - (fv + pv)/nper
        
      let x = Math.pow(1 + rate,nper)
      let pmt = (rate * (fv + x * pv)) / (-1 + x)

      return pmt
  }

}