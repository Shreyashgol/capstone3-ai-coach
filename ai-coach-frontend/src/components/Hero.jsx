import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HeroSection = () => {
  const imageRef = useRef(null);
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          {loading ? (
            <>
              <div className="h-12 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-12 w-32 bg-muted animate-pulse rounded"></div>
            </>
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button size="lg" className="px-8 cursor-pointer">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/resume">
                <Button size="lg" variant="outline" className="px-8 cursor-pointer">
                  Build Resume
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/signin">
                <Button size="lg" className="px-8 cursor-pointer">
                  Start Your Journey Today
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button size="lg" variant="outline" className="px-8 cursor-pointer">
                  Sign Up Free
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <div className="rounded-lg shadow-2xl border mx-auto max-w-full h-auto bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">AI Career Coach Dashboard</h3>
                <p className="text-muted-foreground">Advanced analytics and insights for your career growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
