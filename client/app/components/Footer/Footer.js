import React from 'react';

const Footer = () => (
  <footer className="bg1 pos-relative">
		<div className="container p-t-5 p-b-5">
			<div className="row">
        <div className="col p-l-20">
          <div className="col-sm-10 col-md-40 p-t-30">
            <h4 className="txt13 m-b-33">
              Contact Us
            </h4>
            <ul className="m-b-25">
              <li className="txt14 m-b-14">
                <i className="fa fa-map-marker fs-16 dis-inline-block size19" aria-hidden="true"></i>
                8th floor, 379 Hudson St, New York, NY 10018
              </li>
              <li className="txt14 m-b-14">
                <i className="fa fa-phone fs-16 dis-inline-block size19" aria-hidden="true"></i>
                (+1) 96 716 6879
              </li>
              <li className="txt14 m-b-14">
                <i className="fa fa-envelope fs-13 dis-inline-block size19" aria-hidden="true"></i>
                contact@site.com
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-l-20">
          <div className="col-sm-10 col-md-40 p-t-30 m-b-30">
            <h4 className="txt13 m-b-32">
              Opening Times
            </h4>
            <ul>
              <li className="txt14">
                09:30 AM – 11:00 PM
              </li>
              <li className="txt14">
                Every Day
              </li>
            </ul>
          </div>
        </div>
      </div>
		</div>

		<div className="end-footer bg2">
			<div className="container">
				<div className="flex-sb-m flex-w p-t-22 p-b-22">
					<div className="p-t-5 p-b-5">
						<a href="#" className="fs-15 c-white"><i className="fa fa-tripadvisor" aria-hidden="true"></i></a>
						<a href="#" className="fs-15 c-white"><i className="fa fa-facebook m-l-18" aria-hidden="true"></i></a>
						<a href="#" className="fs-15 c-white"><i className="fa fa-twitter m-l-18" aria-hidden="true"></i></a>
					</div>

					<div className="txt17 p-r-20 p-t-5 p-b-5">
						Copyright &copy; 2018 All rights reserved  |  This template is made with <i className="fa fa-heart"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
);

export default Footer;
