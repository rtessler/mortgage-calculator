import React from 'react';
//import React, { FunctionComponent } from 'react';
import './Header.scss'

type HeaderProps = { message: string };

// interface HeaderProps { 
//   message:string, 
// } 

//const Header: FunctionComponent<HeaderProps> = (props: HeaderProps) => { 

const Header = (props: HeaderProps) => { 

  //return <div>{props.message}</div>;

  return <div className='header-view'>

              <div className="app-title">
                  
                  <img src="./assets/images/home.png" alt='home' />
                  <span className="text">Mortgage Calculator</span>

              </div>

              <a href="mailto:robert@rtessler.com">Contact</a>

        </div>
}

export default Header
