import { FaFacebook, FaPinterest, FaSquareXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { IoLogoYoutube } from "react-icons/io";

// Configuration for links
const footerLinks = {
  links: ["Recipes", "Article", "Careers", "About Us", "Contact Us"],
  legal: ["Terms of Service", "Privacy Policy", "FAQs"],
};

// Types for props
interface FooterSectionProps {
  title: string;
  items: string[];
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#2E5834] p-8 text-white lg:px-16 xl:px-24 xl:py-8">
      <div className="flex flex-col justify-between border-b border-gray-400 pb-14">
        <div className="md:mb-8 md:flex md:justify-between xl:justify-evenly">
          {/* Links Section */}
          <FooterSection title="LINKS" items={footerLinks.links} />
          {/* Legal & Support Section */}
          <FooterSection title="LEGAL & SUPPORT" items={footerLinks.legal} />
          {/* App Download Section */}
          <div className="mb-8">
            <h2 className="mb-4 font-semibold">DOWNLOAD THE APP</h2>
            <div className="flex flex-col gap-4">
              <img
                src="/images/googleplay.png"
                alt="Download on Google Play"
                className="w-44"
              />
              <img
                src="/images/appstore.png"
                alt="Download on App Store"
                className="w-44"
              />
            </div>
          </div>
        </div>

        {/* Newsletter & Socials Section */}
        <div className="flex basis-[33%] flex-col gap-8">
          {/* Newsletter */}
          <NewsletterSignUp />
          {/* Social Media */}
          <SocialMedia />
        </div>
      </div>

      {/* Copyright */}
      <h1 className="mt-4 text-center text-sm">
        ⓒ {currentYear} Kitchen Tales. All rights reserved.
      </h1>
    </footer>
  );
};

// Reusable Footer Section for links and legal
const FooterSection = ({ title, items }: FooterSectionProps) => (
  <div>
    <h2 className="mb-4 font-semibold">{title}</h2>
    <ul className="flex flex-col gap-1 opacity-95">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

// Newsletter Sign-up form component
const NewsletterSignUp = () => (
  <div className="md:flex md:flex-col md:items-center md:justify-center">
    <h1 className="mb-4 font-cormorant text-2xl md:text-3xl xl:text-4xl">
      Sign up for our Newsletter
    </h1>
    <p className="w-[90%] text-sm md:w-full md:text-center xl:text-base">
      Subscribe & start receiving your weekly dose of delicious inspiration!
    </p>
    <form className="mt-5 flex items-center md:w-[80%] lg:w-[65%] xl:w-[40%]">
      <input
        type="email"
        placeholder="name@domain.com"
        className="h-[50px] w-full rounded-full rounded-r-none px-4 text-sm text-black"
      />
      <button className="h-[50px] rounded-r-full border border-l-0 border-white px-6">
        SUBSCRIBE
      </button>
    </form>
  </div>
);

// Social Media icons
const SocialMedia = () => (
  <div className="mt-2 md:flex md:flex-col md:items-center md:justify-center">
    <h1 className="font-semibold">FOLLOW US</h1>
    <div className="mt-2 flex items-center gap-4 text-[30px]">
      <FaFacebook />
      <RiInstagramFill />
      <FaPinterest />
      <IoLogoYoutube />
      <FaSquareXTwitter />
    </div>
  </div>
);

export default Footer;
