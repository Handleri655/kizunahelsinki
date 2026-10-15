export const restaurant = {
  name: 'Ravintola KIZUNA',
  street: 'Pursimiehenkatu 12',
  postalCode: '00150',
  city: 'Helsinki',
  country: 'FI',
  phoneDisplay: '+358 44 952 2106',
  phoneTel: '+358449522106',
  email: 'info@kizunahelsinki.com',
  instagram: 'https://www.instagram.com/kizuna_helsinki',
  instagramHandle: '@kizuna_helsinki',
  reservation: 'https://pos.sciometa.com/reserve/08d42b5',
  /** Published coordinates for this address (60°9'34"N 24°56'19"E). Confirm before launch. */
  lat: 60.159444,
  lng: 24.938611,
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Pursimiehenkatu%2012%2C%2000150%20Helsinki',
  osmLink: 'https://www.openstreetmap.org/?mlat=60.159444&mlon=24.938611#map=18/60.159444/24.938611',
  osmEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=24.9306%2C60.1554%2C24.9466%2C60.1634&layer=mapnik&marker=60.159444%2C24.938611',
} as const;

export const pdfMenus = [
  {
    id: 'lunch',
    href: 'https://www.kizunahelsinki.com/s/LUNCH-28826-Emi.pdf',
  },
  {
    id: 'dinner',
    href: 'https://www.kizunahelsinki.com/s/AutumnDinner-menu-09092026-2.pdf',
  },
  {
    id: 'brunch',
    href: 'https://www.kizunahelsinki.com/s/Brunch-EMI-2882026.pdf',
  },
  {
    id: 'drinks',
    href: 'https://www.kizunahelsinki.com/s/Drink-MENU-10122025.pdf',
  },
] as const;
