export interface iLanguage {
  id: number;
  lang: string;
  img: string;
}

export const languages: Array<iLanguage> = [{
  id: 1,
  lang: "Korean",
  img: "/assets/images/ko.svg",
}, {
  id: 2,
  lang: "Russian",
  img: "/assets/images/ru.svg"
}, {
  id: 3,
  lang: "Deutch",
  img: "/assets/images/de.svg",
}, {
  id: 4,
  lang: "French",
  img: "/assets/images/fr.svg",
}, {
  id: 5,
  lang: "Czech",
  img: "/assets/images/cz.svg",
}, {
  id: 6,
  lang: "English",
  img: "/assets/images/en.svg",
}];  