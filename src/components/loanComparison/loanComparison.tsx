import React from 'react'

type LoanComparisonProps = { }

const LoanComparison = (props: LoanComparisonProps) => { 

  return (
    <div className='calc loan-comparison'>

      <div className='outer-container rounded'>
        <h3>Loan Comparison</h3>

        <div className='calculator rounded'>

        <div className='top-div'>

        <p className='section-heading'>Enter your details</p>

        <div className='calc-panel rounded panel'>

          <div style={{float: 'left', width: '270px', paddingRight: '15px'}}>

          <strong>Enter your loan#1 details</strong><br /><br />

          <table cellPadding='0' cellSpacing='0'>
            <tr style={{lineHeight: '22px'}}>
                <td style={{whiteSpace: 'nowrap'}}>Upfront fees:</td>
                <td></td>
                <td>$ <input id='upfront_fees1' name='upfront_fees1' value='400,00' className='short-text' /></td>
            </tr>

            <tr style={{lineHeight: '22px'}}>    
                <td style={{whiteSpace: 'nowrap'}}>Ongoing fees:</td>
                <td> 
                <select id='ongoing_fees_type1' name='ongoing_fees_type1'>
                    <option value='monthly' selected>Monthly</option>
                    <option value='fortnightly'>Fortnightly</option>
                    <option value='weekly'>Weekly</option>
                </select>
                </td>   
                <td>&nbsp;&nbsp;<input id='ongoing_fees1' name='ongoing_fees1' value='0' className='short-text' /></td>
            </tr>

            <tr style={{lineHeight: '22px'}}>
                <td style={{whiteSpace: 'nowrap'}}>Intro rate:</td>
                <td><div id='intro_rate_slider1' className='slider'></div></td>
              <td>&nbsp;&nbsp;<input id='intro_rate1' name='intro_rate1'  value='5.75' className='short-text'/> %</td>
            </tr>

            <tr style={{lineHeight: '22px'}}>
                <td style={{whiteSpace: 'nowrap'}}>Intro term:</td>
                <td><div id='intro_term_slider1' className='slider'></div></td>
              <td style={{whiteSpace: 'nowrap'}}>&nbsp;&nbsp;<input id='intro_term1' name='intro_term1'  value='24' className='short-text'/>Mth</td>
            </tr>

            <tr style={{lineHeight: '22px'}}>
                <td style={{whiteSpace: 'nowrap'}}>Ongoing rate:</td>
                <td><div id='ongoing_rate_slider1' className='slider'></div></td>
              <td>&nbsp;&nbsp;<input id='ongoing_rate1' name='ongoing_rate1'  value='7.25' className='short-text'/> %</td>
            </tr>

          </table>

        </div>

        <div style={{float: 'left', width: '270px'}}>

            <strong>Enter your loan#2 details</strong><br /><br />
            
        <table cellPadding='0' cellSpacing='0'>
        <tr style={{lineHeight: '22px'}}>
            <td style={{whiteSpace: 'nowrap'}}>Upfront fees:</td>
            <td></td>
            <td>$ <input id='upfront_fees2' name='upfront_fees2' value='300,00' className='short-text' /></td>
        </tr>

        <tr style={{lineHeight: '22px'}}>    
            <td style={{whiteSpace: 'nowrap'}}>Ongoing fees:</td>
            <td> 
            <select id='ongoing_fees_type2' name='ongoing_fees_type2'>
                <option value='monthly' selected>Monthly</option>
                <option value='fortnightly'>Fortnightly</option>
                <option value='weekly'>Weekly</option>
            </select>
            </td>   
            <td>&nbsp;&nbsp;<input id='ongoing_fees2' name='ongoing_fees2'  value='40.00' className='short-text' /></td>
        </tr>

        <tr style={{lineHeight: '11px'}}>
            <td style={{whiteSpace: 'nowrap'}}>Intro rate:</td>
            <td><div id='intro_rate_slider2' className='slider'></div></td>
          <td>&nbsp;&nbsp;<input id='intro_rate2' name='intro_rate2'  value='4.25' className='short-text'/> %</td>
        </tr>

        <tr style={{lineHeight: '11px'}}>
            <td style={{whiteSpace: 'nowrap'}}>Intro term:</td>
            <td><div id='intro_term_slider2' className='slider'></div></td>
          <td style={{whiteSpace: 'nowrap'}}>&nbsp;&nbsp;<input id='intro_term2' name='intro_term2'  value='36' className='short-text'/>Mth</td>
        </tr>

        <tr style={{lineHeight: '11px'}}>
            <td style={{whiteSpace: 'nowrap'}}>Ongoing rate:</td>
            <td><div id='ongoing_rate_slider2' className='slider'></div></td>
          <td>&nbsp;&nbsp;<input id='ongoing_rate2' name='ongoing_rate2'  value='6.75' className='short-text'/> %</td>
        </tr>

        </table>

        </div> 


        </div> {/* calc-panel */}
        </div> {/* top-div */}

        <br />

        <div className='middle-div'>

            <strong>Enter common loan details</strong>
            <br />
            <br />
            
            <div style={{float: 'left', width: '300px'}}>
                <label htmlFor='loan_amount' style={{float: 'left'}}>Loan amount:</label>
          
                <div id='loan_amount_slider' className='slider' style={{top: '4px'}}></div>  
              <input id='loan_amount' name='loan_amount' value='100,000' className='long-text'/> $
            </div>
            
            <div >
                <label htmlFor='loan_term' style={{float: 'left'}}>Loan term</label>  
            
                <div id='loan_term_slider' className='slider' style={{top: '4px'}}></div>  
                &nbsp; &nbsp;<input id='loan_term' name='loan_term' value='25.0' className='short-text' /> yr
            </div>    

        </div> 

        <div className='bottom-div'>

          <p className='section-heading'>View your results</p>

            <div className='result-panel rounded panel'>
          
            {/*<div id='chart_div' ></div>    */}

                <div id='result' className='rounded'>
                
                  <p>Loan #2 will save you: <label id='res1'>0</label></p>
                
                  <table cellPadding='0' cellSpacing='0' >
                    <tr>
                      <td></td>
                        <td style={{whiteSpace: 'nowrap'}}>Loan #1</td>
                        <td style={{whiteSpace: 'nowrap'}}>Loan #2</td>
                    </tr>
                    
                    <tr>
                        <td>Initial per month:</td>
                        <td><label id='res2'>0</label></td>
                        <td><label id='res3'>0</label></td>
                    </tr>
                    
                    <tr>
                        <td>Outgoing per month:</td>
                        <td><label id='res4'>0</label></td>
                        <td><label id='res5'>0</label></td>
                    </tr>
                    
                    <tr>
                        <td>Total payable:</td>
                        <td><label id='res6'>0</label></td>
                        <td><label id='res7'>0</label></td>
                    </tr>
                                        
                    </table>
                
                </div>
                
            </div> {/* result-panel */}

        </div> {/* bottom-div> */}

        <div id='email-form' >

        <form name='email-form' action='#' method='post'>

        <h3>Email a Friend</h3>

        <div id='errmsg'></div>

        <div id='email-response'></div>

        <div style={{float: 'left', paddingRight: '30px;'}}>
        <label htmlFor='from'>Your email address</label><br />
        <input id='from' name='from' className='text normal-text' />
        </div>

        <div>
        <label htmlFor='to'>Your Friend's email address</label><br />
        <input id='to' name='to' className='text normal-text' />
        </div>

        <div>
        <label htmlFor='subject'>Subject</label><br />
        <input id='subject' name='subject' className='text long-text' value='mortgage loan repayment'/>
        </div>

        <div>
        <label htmlFor='message'>Message</label><br />
        <textarea id='message' name='message' cols={40} rows={4} className='text'></textarea>
        </div>

        <button type='submit' id='send_email' value='Send' >Send</button>

        </form>
        </div>


        </div> {/* calculator */}

        <div className='functions'>

        <ul>
          <li><br /><a className='info' href='#' title='info'><img src='./assets/images/info.png' width='19' height='18' /></a><br /><br /></li>
          <li><a className='print' href='#' title='print'><img src='./assets/images/print.png' width='18' height='19' /></a><br /><br /></li>
          <li><a className='save' href='#' title='save'><img src='./assets/images/save.png' width='18' height='18' /></a><br /><br /></li>
          <li><a className='email' href='#' title='email'><img src='./assets/images/email.png' width='16' height='17' /></a><br /><br /></li>
        </ul>

        </div>

        <div id='infodialog' title='Loan Comparison Calculator'></div>

      </div> {/* outer-container */}
    </div>
  )
}

export default LoanComparison