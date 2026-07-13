import { motion } from "framer-motion";
import { useTranslation } from "../lib/store/languageStore";

export default function Contacts() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-6 sm:mb-8">
        {t("contacts")}
      </h1>

      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-brand-caramel-mousse/20 space-y-5 sm:space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">
            {t("address")}
          </h3>
          <p className="text-brand-dark-chocolate">{t("address")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">
            {t("phoneNumber")}
          </h3>
          <p className="text-brand-dark-chocolate">{t("phoneNumber")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">
            {t("workingHours")}
          </h3>
          <p className="text-brand-dark-chocolate">{t("workingHours")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">
            {t("kidsZone")}
          </h3>
          <p className="text-brand-dark-chocolate">{t("kidsZone")}</p>
        </div>

        {/* Google Карта замість фото */}
        <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner">
          <iframe
            title="Lokalizacja cafeslodziak"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=Kwiatkowskiego+38,Rzeszow`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </motion.div>
  );
}