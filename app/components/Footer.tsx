export default function Footer() {
  return (
    <footer className="mt-auto py-6 text-center text-sm text-gray-500">
      <div className="container mx-auto px-4">
        <p className="flex items-center justify-center gap-2">
          <span>All content on this website is released under </span>
          <a 
            href="https://creativecommons.org/publicdomain/zero/1.0/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline hover:text-gray-700 transition-colors"
          >
            <svg
              height="16"
              width="16"
              viewBox="0 0 384 384"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <path d="M192 0c106 0 192 86 192 192s-86 192-192 192S0 298 0 192 86 0 192 0zm0 35c-86 0-157 70-157 157s70 157 157 157 157-70 157-157S278 35 192 35z"/>
              <path d="M192 84c-68 0-99 67-99 108s31 109 99 109 98-68 98-109-30-108-98-108zm0 45c34 0 53 33 53 63s-19 64-53 64-54-34-54-64 20-63 54-63z"/>
            </svg>
            CC0 1.0 Universal
          </a>
          <span> (Public Domain)</span>
        </p>
      </div>
    </footer>
  );
}

