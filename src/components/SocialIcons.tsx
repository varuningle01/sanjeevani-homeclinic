import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export const SocialIcons = () => {
  return (
    <div className="flex gap-4 text-2xl text-gray-500">
      <a
        href="#"
        className="hover:text-primary transition"
        aria-label="Facebook"
      >
        <FaFacebook />
      </a>
      <a
        href="#"
        className="hover:text-primary transition"
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>
      <a
        href="#"
        className="hover:text-primary transition"
        aria-label="Twitter"
      >
        <FaTwitter />
      </a>
      <a
        href="#"
        className="hover:text-primary transition"
        aria-label="LinkedIn"
      >
        <FaLinkedin />
      </a>
    </div>
  );
};
