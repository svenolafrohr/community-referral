export type RemoteType = "remote" | "hybrid" | "onsite"

export type Job = {
  id: string
  title: string
  company: string
  companyInitials: string
  location: string
  remote: RemoteType
  department: string
  bonus: number
  postedDaysAgo: number
  about: string
  requirements: string[]
  benefits: string[]
}

export const remoteLabels: Record<RemoteType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Vor Ort",
}

export const departments = [
  "Engineering",
  "Sales",
  "Produkt",
  "Finance",
  "R&D",
  "Gesundheitswesen",
  "Handel",
  "Operations",
] as const

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior Backend Engineer",
    company: "Kestrel Software",
    companyInitials: "KS",
    location: "Berlin",
    remote: "hybrid",
    department: "Engineering",
    bonus: 1500,
    postedDaysAgo: 3,
    about:
      "Du verantwortest die Weiterentwicklung unserer Zahlungs-Infrastruktur und arbeitest eng mit dem Platform-Team zusammen, um Skalierbarkeit und Zuverlässigkeit sicherzustellen.",
    requirements: [
      "5+ Jahre Erfahrung mit verteilten Systemen (Go, TypeScript)",
      "Erfahrung mit PostgreSQL und Event-driven Architekturen",
      "Fließend Deutsch oder Englisch",
    ],
    benefits: ["Remote-flexibel", "Firmen-Equity", "Weiterbildungsbudget"],
  },
  {
    id: "j2",
    title: "Head of Sales DACH",
    company: "Nordwind Logistics",
    companyInitials: "NL",
    location: "Hamburg",
    remote: "onsite",
    department: "Sales",
    bonus: 1200,
    postedDaysAgo: 12,
    about:
      "Du baust unser DACH-Vertriebsteam auf und verantwortest die Umsatzverantwortung für den größten Wachstumsmarkt des Unternehmens.",
    requirements: [
      "8+ Jahre B2B-Vertriebserfahrung, davon 3+ in Führung",
      "Track Record im Aufbau von Vertriebsteams",
      "Verhandlungssicheres Deutsch und Englisch",
    ],
    benefits: ["Firmenwagen", "Variable Vergütung", "30 Tage Urlaub"],
  },
  {
    id: "j3",
    title: "Produktmanager (m/w/d)",
    company: "Ampel Retail",
    companyInitials: "AR",
    location: "Köln",
    remote: "hybrid",
    department: "Produkt",
    bonus: 700,
    postedDaysAgo: 6,
    about:
      "Du verantwortest die Produkt-Roadmap für unsere Checkout-Erfahrung und arbeitest crossfunktional mit Design und Engineering.",
    requirements: [
      "3+ Jahre Produktmanagement-Erfahrung im E-Commerce",
      "Sicherer Umgang mit Daten und A/B-Testing",
      "Ausgeprägtes Nutzer-Empathie",
    ],
    benefits: ["Hybrid-Arbeiten", "Mitarbeiterrabatte", "Sabbatical-Option"],
  },
  {
    id: "j4",
    title: "Bauleiter Hochbau",
    company: "Havelbau GmbH",
    companyInitials: "HB",
    location: "Leipzig",
    remote: "onsite",
    department: "Operations",
    bonus: 900,
    postedDaysAgo: 20,
    about:
      "Du übernimmst die Bauleitung anspruchsvoller Hochbauprojekte im Raum Leipzig und führst ein Team aus Poliers und Subunternehmern.",
    requirements: [
      "Abgeschlossenes Studium Bauingenieurwesen oder vergleichbar",
      "5+ Jahre Erfahrung in der Bauleitung",
      "Führerschein Klasse B",
    ],
    benefits: ["Firmenwagen auch privat", "Projektboni", "Altersvorsorge"],
  },
  {
    id: "j5",
    title: "Financial Controller",
    company: "Bergfeld Consulting",
    companyInitials: "BC",
    location: "Frankfurt",
    remote: "hybrid",
    department: "Finance",
    bonus: 800,
    postedDaysAgo: 9,
    about:
      "Du verantwortest das monatliche Reporting sowie die Budgetplanung für mehrere Geschäftsbereiche und bist Sparringspartner der Geschäftsführung.",
    requirements: [
      "Abgeschlossenes Studium mit Schwerpunkt Finance/Controlling",
      "3+ Jahre Berufserfahrung im Controlling",
      "Sehr gute Excel-Kenntnisse",
    ],
    benefits: ["Flexible Arbeitszeiten", "Jobticket", "Bonusprogramm"],
  },
  {
    id: "j6",
    title: "Robotics Test Engineer",
    company: "Fjord Robotics",
    companyInitials: "FR",
    location: "München",
    remote: "onsite",
    department: "R&D",
    bonus: 1300,
    postedDaysAgo: 4,
    about:
      "Du entwickelst und führst Testverfahren für unsere autonomen Robotiksysteme durch und arbeitest eng mit dem Hardware-Team zusammen.",
    requirements: [
      "Studium Robotik, Mechatronik oder vergleichbar",
      "Erfahrung mit ROS und Python",
      "Freude an praktischer Testarbeit im Labor",
    ],
    benefits: ["Modernes Labor", "Konferenzbudget", "Firmenfahrrad"],
  },
  {
    id: "j7",
    title: "Pflegefachkraft Intensivstation",
    company: "Meridian Health",
    companyInitials: "MH",
    location: "Stuttgart",
    remote: "onsite",
    department: "Gesundheitswesen",
    bonus: 1500,
    postedDaysAgo: 2,
    about:
      "Du versorgst Patient:innen auf unserer Intensivstation und bringst dich aktiv in die Weiterentwicklung unserer Pflegestandards ein.",
    requirements: [
      "Examinierte Pflegefachkraft mit Fachweiterbildung Intensiv",
      "Teamfähigkeit und Belastbarkeit im Schichtdienst",
      "Empathischer Umgang mit Patient:innen und Angehörigen",
    ],
    benefits: ["Schichtzulagen", "Kinderbetreuungszuschuss", "Fortbildungen"],
  },
  {
    id: "j8",
    title: "Regionalleiter Vertrieb",
    company: "Ampel Retail",
    companyInitials: "AR",
    location: "Remote",
    remote: "remote",
    department: "Sales",
    bonus: 500,
    postedDaysAgo: 15,
    about:
      "Du verantwortest den Vertriebserfolg mehrerer Filialen in deiner Region und coachst die lokalen Store-Manager:innen.",
    requirements: [
      "Erfahrung in der Führung von Filialstrukturen",
      "Reisebereitschaft innerhalb der Region",
      "Unternehmerisches Denken",
    ],
    benefits: ["Firmenwagen", "Homeoffice-Ausstattung", "Bonusprogramm"],
  },
]
