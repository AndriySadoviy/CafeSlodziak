import { useEffect, useRef } from "react";
import Head from "next/head";
import QRCode from "qrcode";

const MENU_URL =
  process.env.NEXT_PUBLIC_MENU_URL || "https://cafeslodziak-rzeszow.com/menu";

function MenuQrCard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, MENU_URL, {
      width: 260,
      margin: 1,
      color: {
        dark: "#2F0E09",
        light: "#FEF7EE",
      },
      errorCorrectionLevel: "H",
    });
  }, []);

  return (
    <>
      <Head>
        <title>CafeSlodziak – QR Menu</title>
      </Head>

      <div className="qr-page min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center gap-6 print:bg-white print:py-0 print:px-0">
        <div className="print:hidden flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md"
          >
            Drukuj kartę / Print
          </button>
          <a
            href="/menu-qr.png"
            download="CafeSlodziak-menu-qr.png"
            className="border-2 border-brand-orange-zest text-brand-orange-zest font-bold py-3 px-6 rounded-2xl"
          >
            Pobierz QR (PNG)
          </a>
          <a
            href="/menu-qr-card.svg"
            download="CafeSlodziak-menu-qr-card.svg"
            className="border-2 border-brand-caramel-mousse text-brand-dark-chocolate font-bold py-3 px-6 rounded-2xl"
          >
            Pobierz kartę (SVG)
          </a>
        </div>

        <article className="qr-card w-[340px] bg-brand-light-cream border-4 border-brand-orange-zest rounded-3xl shadow-xl overflow-hidden print:shadow-none print:w-[85mm] print:rounded-xl print:border-[3px]">
          <header className="bg-brand-espresso text-brand-light-cream text-center py-4 px-4 print:py-3">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/logo3.png"
                alt=""
                className="w-12 h-12 rounded-full object-contain bg-white print:w-10 print:h-10"
              />
              <div className="text-left">
                <p className="text-xl font-extrabold leading-tight print:text-lg">
                  CafeSlodziak
                </p>
                <p className="text-xs text-brand-caramel-mousse print:text-[10px]">
                  Kawiarnia dla dzieci · Rzeszów
                </p>
              </div>
            </div>
          </header>

          <div className="px-6 py-6 text-center print:px-4 print:py-4">
            <p className="text-brand-dark-chocolate font-bold text-lg mb-1 print:text-base">
              Zeskanuj i zobacz menu
            </p>
            <p className="text-sm text-gray-600 mb-4 print:text-xs print:mb-3">
              Скануй — переглянь меню · Scan for menu
            </p>

            <div className="inline-block p-3 bg-white rounded-2xl border-2 border-brand-caramel-mousse/40 print:p-2">
              <canvas ref={canvasRef} className="block mx-auto" />
            </div>

            <p className="mt-4 text-xs text-brand-caramel-mousse break-all print:mt-3 print:text-[9px]">
              {MENU_URL.replace("https://", "")}
            </p>
          </div>

          <footer className="bg-brand-orange-light/60 text-center py-3 px-4 text-sm text-brand-dark-chocolate print:py-2 print:text-xs">
            <p className="font-semibold">ul. Kwiatkowskiego 38, Rzeszów</p>
            <p>+48 530 599 994</p>
          </footer>
        </article>

        <p className="print:hidden text-sm text-gray-500 text-center max-w-md">
          Otwórz tę stronę na komputerze i wybierz „Drukuj”, albo pobierz plik SVG do
          drukarni. QR prowadzi bezpośrednio do menu online.
        </p>
      </div>

      <style jsx global>{`
        @media print {
          nav,
          footer,
          .print\\:hidden {
            display: none !important;
          }

          body,
          #__next,
          .qr-page {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .qr-card {
            margin: 0 auto;
            page-break-inside: avoid;
          }

          @page {
            size: A6 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </>
  );
}

MenuQrCard.getLayout = (page) => page;

export default MenuQrCard;