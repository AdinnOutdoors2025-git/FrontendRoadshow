import React, { useState } from 'react';
import './a3Footer.css';

function Footer() {
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isAddressOpen, setAddressOpen] = useState(false);

  const services = [
    'LED Screen Vehicle',
    'L-Type LED Vehicle',
    '3-Side LED Truck',
    'Customize Fabrication Vehicle',
    'Stage Vehicle (Hydraulic / Manual)',
    'Canopy / Hood Setup',
    'E-Vehicle / E-Rickshaw with LED',
    'Inflatable / 3D Model Mounted Vehicle'
  ];

  const addresses = [
    // '29, 1st Cross Street, Vanamamalai Nagar, By-pass Road,',
    // 'Door No:3, 1st Floor, Vijayalakshmi Street, Mahalingapuram, Nungambakkam,',
    // 'Old No:76, New No:976, 7th Cross, Basaveswara Badavane, Bagegowda Layout, Rajarajeswari Nagar,'
    {
      id: 1,
      address: "29, 1st Cross Street, Vanamamalai Nagar, By-pass Road,",
      addLocation: "Madurai-625010."
    },
    {
      id: 2,
      address: "Door No:3, 1st Floor, Vijayalakshmi Street, Mahalingapuram, Nungambakkam,",
      addLocation: "Chennai – 600 034."
    }, {
      id: 3,
      address: "Old No:76, New No:976, 7th Cross, Basaveswara Badavane, Bagegowda Layout, Rajarajeswari Nagar,",
      addLocation: "Bangalore – 560 039."
    },
  ];


  return (
    <div className="container-fluid RdFooterMain">
      <div className="container d-none d-md-block">
        {/* 💻 Desktop Footer */}
        <div className="row">
          {/* Column 1 */}
          <div className="RdFooterContent1 col-md-4 col-sm-12 mb-4">
            <img src="/images/FooterAdinnLogo.png" className="FooterAdinnLogo" alt="Adinn Logo" />
            <div className="FooterSocIcons">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}><img src={`/images/FootSocIcon${i}.png`} className="FootSocIcon" alt={`Social Icon ${i}`} /></div>
              ))}
            </div>
            <div className="RdFooterContactNumber">
              <a href="tel:7373785057" style={{ textDecoration: 'none', color: '#2B3333' }}>7373785057</a>
              <span>|</span>
              <a href="tel:9626987861" style={{ textDecoration: 'none', color: '#2B3333' }}>9626987861</a>
            </div>
            <div><a href="mailto:ba@adinn.co.in" style={{ textDecoration: 'none', color: '#2B3333' }}>ba@adinn.co.in</a></div>

            <div className="newsletter-section">
              <h4>Get notified upon new Updates</h4></div>
            {/* <div className="RdFootContactContentsInputMain">
              <input type="text" placeholder="Your Email-Id Here" className="RdFootContactContentsInput" />
              <div className="RdFootContactContentsInputSend">
                <img src="/images/RdFootContactContentsInputSend.png" className="RdFootContactContentsInputSendIcon" alt="Send" />
              </div>
            </div> */}

            <div className='RdFootContactContents'>
              <div className='RdFootContactContentsInputMain'>
                <div> <input type='text' placeholder='Your Email-Id Here' className='RdFootContactContentsInput' /></div>
                <div className='RdFootContactContentsInputSend'>
                  <img src='/images/RdFootContactContentsInputSend.png' className='RdFootContactContentsInputSendIcon'></img>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="RdFooterContent2 col-md-4 col-sm-6 mb-4">
            <div className="RdFootContactContentsTitle">Services</div>
            {services.map((item, i) => <div key={i} className="RdFootContactContents">{item}</div>)}
          </div>

          {/* Column 3 */}
          {/* For desktop version */}
          <div className="RdFooterContent3 col-md-4 col-sm-6 mb-4">
            <div className="RdFootContactContentsTitle">Address</div>
            {addresses.map((addr) => (
              <div key={addr.id} className="RdFootContactContents">
                {addr.address} <strong>{addr.addLocation}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <div className="RdFootContactContents">Copyright © 2025 Adinn Digital. All Right Reserved</div>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Footer with Dropdowns */}
      <div className="footer-mobile d-block d-md-none">
        <div className="footer-mobile-section">

          {/* ✅ Column 1 (Tablet Left) */}
          <div className="footer-col-1">
            <img src="/images/FooterAdinnLogo.png" className="FooterAdinnLogo" alt="Adinn Logo" />

            <div className="FooterSocIcons">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <img src={`/images/FootSocIcon${i}.png`} className="FootSocIcon" alt={`Social Icon ${i}`} />
                </div>
              ))}
            </div>

            <div className="RdFooterContactNumber">
              <a href="tel:7373785057" style={{ textDecoration: 'none', color: '#2B3333' }}>7373785057</a><span>|</span><a href="tel:9626987861" style={{ textDecoration: 'none', color: '#2B3333' }}>9626987861</a>
            </div>

            <div><a href="mailto:ba@adinn.co.in" style={{ textDecoration: 'none', color: '#2B3333' }}>ba@adinn.co.in</a></div>

            <div className="newsletter-section">
              <h4>Get notified upon new Updates</h4>
              <div className="RdFootContactContentsInputMain">
                <input type="text" placeholder="Your Email-Id Here" className="RdFootContactContentsInput" />
                <div className="RdFootContactContentsInputSend">
                  <img src="/images/RdFootContactContentsInputSend.png" className="RdFootContactContentsInputSendIcon" alt="Send" />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Column 2 (Tablet Right) */}
          <div className="footer-col-2">

            {/* Services Dropdown */}
            <div className="RdFootContactContentsInput1">
              <div className="mobile-dropdown-header" onClick={() => setServicesOpen(!isServicesOpen)}>
                <span className="dropdown-title">Services</span>
                <img src="/images/downward-arrow.svg" alt="toggle arrow" className={`dropdown-arrow ${isServicesOpen ? "open" : ""}`} />
              </div>
              <div className={`mobile-dropdown-content ${isServicesOpen ? 'open' : ''}`}>
                <ul className="services-list-mobile">
                  {services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Address Dropdown */}
            <div className="RdFootContactContentsInput1">
              <div className="mobile-dropdown-header" onClick={() => setAddressOpen(!isAddressOpen)}>
                <span className="dropdown-title">Address</span>
                <img src="/images/downward-arrow.svg" alt="toggle arrow" className={`dropdown-arrow ${isAddressOpen ? "open" : ""}`} />
              </div>


              {/*  For mobile dropdown version */}
              <div className={`mobile-dropdown-content ${isAddressOpen ? 'open' : ''}`}>
                <ul className="address-list-mobile">
                  {addresses.map((addr) => (
                    <li key={addr.id}>
                      {addr.address} <strong>{addr.addLocation}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* ✅ Row 2 – Copyright */}
        <div className="footer-copy-mobile text-center">
          Copyright © 2025 Adinn Digital. All Right Reserved
        </div>

      </div>
    </div>
  );
}

export default Footer;
