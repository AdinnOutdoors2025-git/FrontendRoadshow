import React from 'react';
import './a3Footer.css';

function Footer() {
    return (
        <div className='container-fluid RdFooterMain'>
            <div className='container'>

                <div className='row'>
                    {/* Column 1 - Company Info */}
                    <div className='RdFooterContent1 col-md-4 col-sm-12 mb-4'>
                        <div>
                            <img src='/images/FooterAdinnLogo.png' className='FooterAdinnLogo' alt='Adinn Logo' />
                        </div>
                        <div className='FooterSocIcons'>
                            <div><img src='/images/FootSocIcon1.png' className='FootSocIcon' alt='Social Icon 1' /></div>
                            <div><img src='/images/FootSocIcon2.png' className='FootSocIcon' alt='Social Icon 2' /></div>
                            <div><img src='/images/FootSocIcon3.png' className='FootSocIcon' alt='Social Icon 3' /></div>
                            <div><img src='/images/FootSocIcon4.png' className='FootSocIcon' alt='Social Icon 4' /></div>
                            <div><img src='/images/FootSocIcon5.png' className='FootSocIcon' alt='Social Icon 5' /></div>
                        </div>
                        <div className='RdFootContactContents'>
                            <div className='RdFootContactContents RdFooterContactNumber'>
   
                                <div><a href='tel:7373785057' style={{textDecoration:'none', color:'#2B3333'}}>7373785057</a></div>
                                <div>&nbsp;|&nbsp;</div>
  
                                <div><a href='tel:9626987861' style={{textDecoration:'none', color:'#2B3333'}}>9626987861</a></div>
                            </div>
  
                            <div className='RdFootContactContents'><a href='mailto:ba@adinn.co.in' style={{textDecoration:'none', color:'#2B3333'}}>ba@adinn.co.in</a></div>
                        </div>
                        <div className='RdFootContactContents'>Get notified upon new Updates</div>
                        <div className='RdFootContactContents'>
                            <div className='RdFootContactContentsInputMain'>
                                <div> <input type='text' placeholder='Your Email-Id Here' className='RdFootContactContentsInput' /></div>
                                <div className='RdFootContactContentsInputSend'>
                                    <img src='/images/RdFootContactContentsInputSend.png' className='RdFootContactContentsInputSendIcon'></img>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - Services */}
                    <div className='RdFooterContent2 col-md-4 col-sm-6 mb-4'>
                        <div className='RdFootContactContentsTitle'>Services</div>
                        <div>
                            <div className='RdFootContactContents'>LED Screen Vehicle</div>
                            <div className='RdFootContactContents'>L-Type LED Vehicle</div>
                            <div className='RdFootContactContents'>3-Side LED Truck</div>
                            <div className='RdFootContactContents'>Customize Fabrication Vehicle</div>
                            <div className='RdFootContactContents'>Stage Vehicle (Hydraulic / Manual)</div>
                            <div className='RdFootContactContents'>Canopy / Hood Setup</div>
                            <div className='RdFootContactContents'>E-Vehicle / E-Rickshaw with LED</div>
                            <div className='RdFootContactContents'>Inflatable / 3D Model Mounted Vehicle</div>
                        </div>
                    </div>

                    {/* Column 3 - Address */}
                    <div className='RdFooterContent3 col-md-4 col-sm-6 mb-4'>
                        <div className='RdFootContactContentsTitle'>Address</div>
                        <div >
                            <div className='RdFootContactContents'>
                                29, 1st Cross Street, Vanamamalai Nagar, By-pass Road, <span className='RdFootContactContentsHighlight'> Madurai-625010. </span>
                            </div>
                            <div className='RdFootContactContents'>
                                Door No:3, 1st Floor, Vijayalakshmi Street, Mahalingapuram, Nungambakkam,
                                <span className='RdFootContactContentsHighlight'> Chennai – 600 034. </span>
                            </div>
                            <div className='RdFootContactContents'>
                                Old No:76, New No:976, 7th Cross, Basaveswara Badavane, Bagegowda Layout,
                                Rajarajeswari Nagar, <span className='RdFootContactContentsHighlight'> Bangalore – 560 039.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className='row'>
                    <div className='col-12 text-center'>
                        <div className='RdFootContactContents'>
                            Copyright © 2025 Adinn Digital. All Right Reserved
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Footer;