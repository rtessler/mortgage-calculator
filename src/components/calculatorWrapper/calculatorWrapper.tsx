import React, { FunctionComponent, useState } from 'react'

import './calculatorWrapper.scss'

type CalculatorWrapperProps = {
  title: string
  description: string
}

const CalculatorWrapper: FunctionComponent<CalculatorWrapperProps> = (props) => { 

  const [showDescription, setShowDescription] = useState(false)

  const onPrint = (e: React.FormEvent<HTMLButtonElement>) => {

    e.preventDefault();

    window.print();
  }

          
//   save: function(e) {

//     e.preventDefault();
                
//     //var uriContent = "data:application/octet-stream," + encodeURIComponent(content);
//     var uriContent = "data:application/text," + encodeURIComponent(resultToString(result));
//     w = window.open(uriContent, 'loan_repayment.txt');
// },

// info: function(e)
// {
//     e.preventDefault();

//     this.$( "#infodialog" ).html("<h3>The Loan Repayments View.</h3<p> The Loan Repayments View calculates the type of repayment required, at the frequency requested, in respect of the loan parameters entered, namely amount, term and interest rate.</p>");
//     this.$( "#infodialog" ).dialog();
// },

// showEmailForm: function(e)
// {
//     var self = this;

//     e.preventDefault();

//     self.$(".calc .email").toggle(function() { 
//         var h = self.$(".calc .outer-container").height();
//         self.$(".calc .outer-container").height(h + 330); 
//         self.$(".calc #email-form").toggle(); 
//         self.$(".calc #message").val(resultToString(result));

//         self.enail_view = new app.EmailView();
//         self.email_container.html(self.email_view.render().el);
//         },
//     function() { 
//         var h = self.$(".calc .outer-container").height();
//         self.$(".calc .outer-container").height(h - 330); 
//         self.$(".calc #email-form").toggle(); 

//         self.email_view.close();
//     }); 
// },

  return <div className='calculator-wrapper-view'>

            <div className='main-title'>
              <span>{props.title}</span>
              <button className='show-description btn-link' title='description' onClick={() => setShowDescription(!showDescription)}>?</button>
            </div>

            <div className='description'>
              {
                showDescription ? props.description : null
              }
            </div>

            { props.children }

            <br />

            <button className='btn-icon' title='print' onClick={ onPrint } >

                <img  src='./assets/images/print.png' />
                <span>print</span>
            </button>		

  </div>
}

export default CalculatorWrapper