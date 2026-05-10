const products = [
  // ===== ŚNIADANIA (breakfast) =====
  {
    id: 101,
    nameKey: "jajecznica_3jaja",
    category: "breakfast",
    descriptionKey: "jajecznica_3jaja_desc",
    price: 22,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
  },
  {
    id: 102,
    nameKey: "jajecznica_boczek",
    category: "breakfast",
    descriptionKey: "jajecznica_boczek_desc",
    price: 27,
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
  },
  {
    id: 103,
    nameKey: "grzanki_awokado",
    category: "breakfast",
    descriptionKey: "grzanki_awokado_desc",
    price: 32,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
  },
  {
    id: 104,
    nameKey: "szakszuka",
    category: "breakfast",
    descriptionKey: "szakszuka_desc",
    price: 30,
    image: "https://images.unsplash.com/photo-1590412200988-a4369702f258?w=400&h=300&fit=crop",
  },

  // ===== PIZZA =====
  {
    id: 201,
    nameKey: "margherita",
    category: "pizza",
    descriptionKey: "margherita_desc",
    price: 36,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
  },
  {
    id: 202,
    nameKey: "diavola",
    category: "pizza",
    descriptionKey: "diavola_desc",
    price: 43,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  },
 // ... після diavola (id 202)

// Нові піци
{
  id: 203,
  nameKey: "rustica",
  category: "pizza",
  descriptionKey: "rustica_desc",
  price: 45,
  image: "https://images.unsplash.com/photo-1604382355076-af4beb1f9b0b?w=400&h=300&fit=crop",
},
{
  id: 204,
  nameKey: "capricciosa",
  category: "pizza",
  descriptionKey: "capricciosa_desc",
  price: 42,
  image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
},
{
  id: 205,
  nameKey: "salame",
  category: "pizza",
  descriptionKey: "salame_desc",
  price: 42,
  image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
},
{
  id: 206,
  nameKey: "alformaggio",
  category: "pizza",
  descriptionKey: "alformaggio_desc",
  price: 45,
  image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
},
{
  id: 207,
  nameKey: "gamberie_rucola",
  category: "pizza",
  descriptionKey: "gamberie_rucola_desc",
  price: 46,
  image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
},
{
  id: 208,
  nameKey: "prosciutto_e_rucola",
  category: "pizza",
  descriptionKey: "prosciutto_e_rucola_desc",
  price: 44,
  image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400&h=300&fit=crop",
},
{
  id: 209,
  nameKey: "pistacchio_e_mascarpone",
  category: "pizza",
  descriptionKey: "pistacchio_e_mascarpone_desc",
  price: 43,
  image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop",
},
{
  id: 210,
  nameKey: "bacon_e_funghi",
  category: "pizza",
  descriptionKey: "bacon_e_funghi_desc",
  price: 42,
  image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=400&h=300&fit=crop",
},

// Дитячі піци
{
  id: 211,
  nameKey: "pizza_dzieci_mis",   // ця вже була, можна залишити
  category: "pizza",
  descriptionKey: "pizza_dzieci_mis_desc",
  price: 28,
  image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
},
{
  id: 212,
  nameKey: "pizza_dzieci_margerytka",
  category: "pizza",
  descriptionKey: "pizza_dzieci_margerytka_desc",
  price: 29,
  image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
},
{
  id: 213,
  nameKey: "pizza_dzieci_pollo",
  category: "pizza",
  descriptionKey: "pizza_dzieci_pollo_desc",
  price: 29,
  image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
},

  // ===== SAŁATKI (salads) =====
  {
    id: 301,
    nameKey: "salatka_burrata",
    category: "salads",
    descriptionKey: "salatka_burrata_desc",
    price: 41,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
  },
  {
    id: 302,
    nameKey: "salatka_kurczak_boczek",
    category: "salads",
    descriptionKey: "salatka_kurczak_boczek_desc",
    price: 43,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },

  // ===== PANINI =====
  {
    id: 401,
    nameKey: "panini_pesto",
    category: "panini",
    descriptionKey: "panini_pesto_desc",
    price: 36,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
  },
  {
    id: 402,
    nameKey: "panini_halloumi",
    category: "panini",
    descriptionKey: "panini_halloumi_desc",
    price: 36,
    image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=400&h=300&fit=crop",
  },

  // ===== MAKARONY (pasta) =====
  {
    id: 501,
    nameKey: "makaron_pesto_kurczak",
    category: "pasta",
    descriptionKey: "makaron_pesto_kurczak_desc",
    price: 40,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop",
  },
  {
    id: 502,
    nameKey: "makaron_krewetki",
    category: "pasta",
    descriptionKey: "makaron_krewetki_desc",
    price: 47,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
  },

  // ===== DLA DZIECI (kids) =====
  {
    id: 601,
    nameKey: "makaron_dzieci",
    category: "kids",
    descriptionKey: "makaron_dzieci_desc",
    price: 22,
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
  },
  {
    id: 602,
    nameKey: "pierogi_dzieci",
    category: "kids",
    descriptionKey: "pierogi_dzieci_desc",
    price: 19,
    image: "https://images.unsplash.com/photo-1578362737347-c5e01e9a6202?w=400&h=300&fit=crop",
  },
  {
    id: 603,
    nameKey: "nalesniki_dzem",
    category: "kids",
    descriptionKey: "nalesniki_dzem_desc",
    price: 18,
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop",
  },

  // ===== NAPOJE (drinks) – лишимо деякі з попередньої версії =====
  {
    id: 4,
    nameKey: "smoothie",
    category: "drinks",
    descriptionKey: "smoothie_desc",
    price: 18,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7c7f6bc?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    nameKey: "cocoa",
    category: "drinks",
    descriptionKey: "cocoa_desc",
    price: 15,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5b0eb585?w=400&h=300&fit=crop",
  },
  {
    id: 701,
    nameKey: "iced_latte_raffaello",
    category: "drinks",
    descriptionKey: "iced_latte_raffaello_desc",
    price: 24,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=300&fit=crop",
  },
  {
    id: 702,
    nameKey: "lemoniada_mango",
    category: "drinks",
    descriptionKey: "lemoniada_mango_desc",
    price: 18,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
  },

  // ===== DESERY (desserts) =====
  {
    id: 6,
    nameKey: "icecream",
    category: "desserts",
    descriptionKey: "icecream_desc",
    price: 20,
    image: "https://images.unsplash.com/photo-1625869016774-3a92b2a183a9?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    nameKey: "pancakes",
    category: "desserts",
    descriptionKey: "pancakes_desc",
    price: 26,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710dc4d?w=400&h=300&fit=crop",
  },
];

export default products;