// src/components/About.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./a1Navbar";
import Footer from "./a3Footer";
import { MainLayout } from "../Authentication/MainLayout";
import "./a4About.css";
import { gsap } from "gsap";                // ✅ ADD THIS
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ✅ ADD THIS

// gsap.registerPlugin(ScrollTrigger); 

const About = () => {

  useEffect(() => {
    if (window.innerWidth <= 1199) {
      gsap.registerPlugin(ScrollTrigger);

      const boxes = gsap.utils.toArray(".mission-box");
      const section = document.querySelector(".about-mission-section");
      const totalBoxes = boxes.length;

      // total scroll distance = number of boxes * viewport height
      const totalScroll = window.innerHeight * totalBoxes;

      // ✅ Vertical slide animation for 3 boxes
      gsap.to(boxes, {
        yPercent: -100 * (boxes.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1, // smoother scrolling
          start: "top top",
          end: `+=${totalScroll}`,
          anticipatePin: 1,
        },
      });



      // ✅ Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, []);


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainLayout>
      <div>
        {/*  Navbar */}
        <Navbar />

        {/* About Banner Section */}
        <div className="aboutus-row">
          <img
            src={isMobile ? "/images/about-banner-mobile.png" : "/images/about-banner1.png"}
            className="rdshowHomeBanner1"
            alt="Roadshow Banner"
          />
          <div className="aboutus-content">
            <h1>Driving Brands, Building Connections</h1>
            <p className="aboutus-para">
              From LED trucks to custom roadshow vehicles, we blend creativity,
              tech, and expertise to connect brands with people.
            </p>
            <button className="aboutus-btn">View All</button>
          </div>
        </div>

        {/* ✅ Who We Are Section */}
        <div className="row align-items-center aboutus-section" style={{ padding: "60px 90px", margin: 'auto' }}>
          <div className="col-md-6 mb-4" style={{ textAlign: "left" }}>
            <h2 className="aboutus-heading">Who We Are</h2>
            <p className="aboutus-para">
              We are Adinn, a trusted name in roadshow advertising with over two
              decades of expertise. Our fleet of 110+ customized vehicles and
              LED setups helps brands connect with people across South India.
              From creative fabrication to GPS-tracked campaigns, we make
              marketing more visible, measurable, and impactful. At Adinn, we
              don't just run roadshows — we create experiences that move your
              brand closer to your audience.
            </p>
          </div>

          <div className="col-md-6 mb-4" style={{ textAlign: "center" }}>
            <img
              src="./images/about-banner.png"
              alt="About Us Visual"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "20px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Mission Section */}
        <div
          className="aboutus-section"
          style={{
            padding: "60px 90px",
          }}
        >
          {/* <div className="row align-items-center justify-content-center"> */}
          <div className="col-md-10 text-start">
            <div className="aboutsection">
              <h2 className="aboutus-heading mb-4">Our Story</h2>

              {/* Responsive Image Container */}
              <div
                className="story-image-container"
                style={{
                  width: "100%",
                  margin: "0 auto",
                }}
              >
                <img
                  src="./images/about-vision.png"
                  alt="About Us Visual"
                  className="story-image"
                />
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>

        {/* ✅ Vision Section */}
        <div
          className="about-mission-section"
          style={{
            position: "relative",
            width: "100%",
            padding: "60px 0",
            overflow: "hidden",
            background: "linear-gradient(248deg, #787C8F 55.36%, #EBA282 79%, #EAB56A 97.7%)",
          }}
        >
          {/* ✅ Background truck image */}
          <img
            src="./images/about-mission1.png"
            alt="About Mission Truck"
            style={{
              width: "99%",
              height: "auto",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* ✅ Overlay content (3 white boxes) */}
          {/* ✅ Overlay content (3 white boxes with full-height red dividers) */}
          <div
            className="mission-overlay"
            style={{
              position: "absolute",
              top: "38%",
              left: "62%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "stretch",
              width: "67%",
            }}
          >

            {/* Mission Box */}
            <div
              className="mission-box"
              style={{
                backgroundColor: "white",
                padding: "23px 25px",
                flex: "1",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "left",
                position: "relative",
              }}
            >
              <h3 style={{ fontWeight: "600" }}>Mission</h3>
              <p>
                Our mission is to bring ideas to life through innovative roadshow
                advertising. By blending creativity with strategy, we aim to deliver
                impactful results while helping brands shine wherever the road takes
                them.
              </p>

              {/* ✅ Full-height red divider */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  right: "-10px",
                  width: "20px",
                  height: "100%",
                  backgroundColor: "#b75552",

                }}
              />
            </div>

            {/* Vision Box */}
            <div
              className="mission-box"
              style={{
                backgroundColor: "white",
                padding: "20px 30px",
                flex: "1",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "left",
                position: "relative",
              }}
            >
              <h3 style={{ fontWeight: "600" }}>Vision</h3>
              <p>
                We envision a future where brands and people connect effortlessly, not
                just through advertisements but through meaningful experiences.
              </p>

              {/* ✅ Full-height red divider */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  right: "-10px",
                  width: "20px",
                  height: "100%",
                  backgroundColor: "#b75552",
                }}
              />
            </div>

            {/* Value Box */}
            <div
              className="mission-box"
              style={{
                backgroundColor: "white",
                padding: "20px 30px",
                flex: "1",
                // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "left",
                position: "relative",
              }}
            >
              <h3 style={{ fontWeight: "600" }}>Value</h3>
              <p>
                Our values are built on creativity, trust, and measurable impact. We
                believe every campaign should deliver real benefits for clients and
                audiences alike.
              </p>
            </div>
          </div>

        </div>

        <div className="row align-items-center aboutus-section1" style={{ padding: "60px 90px", margin: 'auto' }}>
          <div className="col-md-12 mb-4" style={{ textAlign: "Left" }}>
            <div className="about-section">
              <h2 className="aboutus-heading">What We Stand For</h2>

              {/* 5 Image Grid */}
              <div className="aboutus-image-grid">
                <div className="aboutus-image-card">
                  <img src="./images/about-stand-1.png" alt="Grid 1" className="aboutus-grid-img" />
                  <div className="aboutus-overlay">
                    <div className="aboutus-text">
                      <h2 className="aboutus-heading">Innovation</h2>
                      <p>We encourage fresh thinking and trust every member to spot opportunities for improvement.Impact</p>
                    </div>
                  </div>
                </div>

                <div className="aboutus-image-card">
                  <img src="./images/about-stand-2.png" alt="Grid 2" className="aboutus-grid-img" />
                  <div className="aboutus-overlay"><div className="aboutus-text">
                    <h2 className="aboutus-heading">Teamwork</h2>
                    <p>We believe in lifting each other up. When one grows, the whole team grows.</p>
                  </div></div>
                </div>

                <div className="aboutus-image-card">
                  <img src="./images/about-stand-3.png" alt="Grid 3" className="aboutus-grid-img" />
                  <div className="aboutus-overlay"><div className="aboutus-text">
                    <h2>Resilience</h2>
                    <p>The road ahead may be challenging, but we embrace persistence, continuous learning, and a growth mindset.</p>
                  </div></div>
                </div>

                <div className="aboutus-image-card">
                  <img src="./images/about-stand-4.png" alt="Grid 4" className="aboutus-grid-img" />
                  <div className="aboutus-overlay"><div className="aboutus-text">
                    <h2>Freedom</h2>
                    <p>with independence comes accountability. We trust our team to decide how, when, and why they deliver their best work</p>
                  </div></div>
                </div>

                <div className="aboutus-image-card">
                  <img src="./images/about-stand-5.png" alt="Grid 5" className="aboutus-grid-img" />
                  <div className="aboutus-overlay"><div className="aboutus-text">
                    <h2>Impact</h2>
                    <p>We aim to create meaningful results while fostering a healthy, positive, and connected team spirit.</p>
                  </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </MainLayout>
  );
};

export default About;