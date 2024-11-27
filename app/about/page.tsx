import { FaGithub, FaXTwitter, FaTelegram, FaEnvelope } from "react-icons/fa6";
import Link from "next/link";

export default function AboutPage() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Fallenhh",
      icon: <FaGithub className="w-6 h-6" />,
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/Fallenhh2",
      icon: <FaXTwitter className="w-6 h-6" />,
    },
    {
      name: "Telegram",
      url: "https://t.me/@Fallenhh",
      icon: <FaTelegram className="w-6 h-6" />,
    },
    {
      name: "Email",
      url: "mailto:fallen2hh@gmail.com",
      icon: <FaEnvelope className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Me</h1>

      <div className="prose lg:prose-xl">
        <p className="text-lg mb-6">
          Hi! I&apos;m Fallenhh, a struggling CS PhD.
        </p>

        <p className="text-lg mb-12">
          Feel free to reach out if you want to collaborate or just chat!
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Connect with me</h2>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={link.name}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
