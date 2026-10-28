"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// All user-facing copy lives here. Add a key to BOTH "es" and "en" and use it
// via the t() function returned by useLang(). Use {placeholders} for variables.
// ---------------------------------------------------------------------------
export const translations = {
  es: {
    // Document / metadata
    "meta.title": "SkillBoard — encuentra personas buenas en algo",
    "meta.description": "Un directorio de personas y en qué son mejores.",

    // Header
    "header.greeting": "Hola, {name}",
    "header.greetingFallback": "allí",
    "header.messages": "Mensajes",
    "header.myProfile": "Mi perfil",
    "header.logout": "Cerrar sesión",
    "header.login": "Iniciar sesión",
    "header.signup": "Registrarse",
    "lang.toggle": "EN",
    "lang.toggleAria": "Cambiar a inglés",

    // App-level
    "app.loading": "Cargando…",

    // Portada
    "hero.eyebrow": "Tu comunidad, tus profesionales",
    "hero.title": "Encuentra al profesional de confianza en tu zona",
    "hero.sub": "Plomeros, electricistas, niñeras, cocineros y mucho más. Gente de tu comunidad, con reseñas de clientes reales.",
    "hero.client": "Soy cliente",
    "hero.clientSub": "Busco un profesional",
    "hero.pro": "Soy profesional",
    "hero.proSub": "Quiero ofrecer mi servicio",
    "hero.explore": "Explorar sin cuenta ↓",
    "hero.haveAccount": "¿Ya tienes cuenta?",
    "hero.loggedSearch": "Buscar un profesional",
    "hero.loggedSearchSub": "Mira quién ofrece lo que necesitas",
    "hero.loggedOffer": "Agregar mi servicio",
    "hero.loggedOfferSub": "Muestra en qué eres bueno",

    // Barra de datos
    "stats.pros": "profesionales",
    "stats.professions": "oficios distintos",
    "stats.zones": "zonas",
    "stats.reviews": "reseñas de clientes",
    "stats.rating": "calificación promedio",

    // Tiempo en la app
    "tenure.today": "Se unió hoy",
    "tenure.dayOne": "1 día en la app",
    "tenure.dayMany": "{n} días en la app",
    "tenure.monthOne": "1 mes en la app",
    "tenure.monthMany": "{n} meses en la app",
    "tenure.yearOne": "1 año en la app",
    "tenure.yearMany": "{n} años en la app",

    // Tarjetas
    "card.noReviews": "Sin reseñas aún",
    "card.reviewsOne": "{count} reseña",
    "card.reviewsMany": "{count} reseñas",
    "card.viewProfile": "Ver perfil →",
    "card.moreSkills": "+{n} más",

    // Sugerencias del buscador
    "browse.suggestPopular": "Populares",
    "browse.suggestSkills": "Oficios",
    "browse.suggestPeople": "Personas",
    "browse.suggestCountOne": "1 profesional",
    "browse.suggestCountMany": "{count} profesionales",
    "browse.suggestNone": "sin profesionales aún",
    "browse.clear": "Limpiar búsqueda",

    // Recuperar contraseña / registro
    "auth.goToBoard": "Ir al tablero",
    "auth.checkEmail": "Te enviamos un correo para confirmar tu cuenta. Ábrelo y toca el enlace para entrar.",
    "auth.iWant": "Quiero…",
    "auth.intentClient": "Buscar un profesional",
    "auth.intentPro": "Ofrecer mi servicio",
    "auth.err.rateLimit": "Pediste demasiados correos seguidos. Espera unos minutos e inténtalo otra vez.",
    "auth.err.samePassword": "La contraseña nueva debe ser diferente a la anterior.",
    "auth.err.sessionExpired": "El enlace venció. Pide uno nuevo desde “¿Olvidaste tu contraseña?”.",

    // Auth
    "auth.tab.login": "Iniciar sesión",
    "auth.tab.signup": "Registrarse",
    "auth.name": "Tu nombre",
    "auth.namePlaceholder": "ej. Jackie Mensah",
    "auth.email": "Correo electrónico",
    "auth.emailPlaceholder": "tu@correo.com",
    "auth.password": "Contraseña",
    "auth.passwordPlaceholder": "Mínimo 6 caracteres",
    "auth.wait": "Por favor espera…",
    "auth.createAccount": "Crear cuenta",
    "auth.login": "Iniciar sesión",
    "auth.enterName": "Por favor ingresa tu nombre.",
    // Supabase error messages
    "auth.err.userExists": "Este correo ya está registrado. Intenta iniciar sesión.",
    "auth.err.passwordShort": "La contraseña debe tener al menos 6 caracteres.",
    "auth.err.invalidEmail": "El formato del correo no es válido.",
    "auth.err.needPassword": "Ingresa una contraseña válida.",
    "auth.err.invalidLogin": "Correo o contraseña incorrectos.",
    "auth.err.notConfirmed": "Debes confirmar tu correo antes de iniciar sesión.",
    "auth.err.tooMany": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",

    // Browse
    "browse.title": "El tablero",
    "browse.searchPlaceholder": "Busca una habilidad o nombre — ej. plomería, jardinería…",
    "browse.locationPlaceholder": "Filtrar por ubicación — ej. Ciudad de Panamá",
    "browse.sortRecent": "Más recientes",
    "browse.sortRating": "Mejor calificados",
    "browse.resultsOne": "{count} resultado",
    "browse.resultsMany": "{count} resultados",
    "browse.peopleOne": "{count} persona en el tablero",
    "browse.peopleMany": "{count} personas en el tablero",
    "browse.noMatch": "Nadie coincide con tu búsqueda — intenta con otras palabras.",
    "browse.empty": "El tablero está vacío. ¡Regístrate y agrega la primera habilidad!",

    // MyProfile
    "profile.title": "Mi perfil",
    "profile.back": "← Volver al tablero",
    "profile.aboutYou": "Sobre ti",
    "profile.changePhoto": "Cambiar foto",
    "profile.uploading": "Subiendo…",
    "profile.photoUpdated": "Foto actualizada ✓",
    "profile.name": "Nombre",
    "profile.location": "Ubicación",
    "profile.locationPlaceholder": "Ciudad, País",
    "profile.bio": "Biografía",
    "profile.optional": "(opcional)",
    "profile.bioPlaceholder": "Una oración sobre ti",
    "profile.save": "Guardar perfil",
    "profile.saved": "Guardado ✓",
    "profile.mySkills": "Mis habilidades",
    "profile.noSkills": "Sin habilidades aún — agrega la primera abajo.",
    "profile.experienceOf": "{exp} de experiencia",
    "profile.remove": "Eliminar",
    "profile.addSkill": "Agregar una habilidad",
    "profile.skill": "Habilidad",
    "profile.skillPlaceholder": "ej. Plomería",
    "profile.experience": "Experiencia",
    "profile.experiencePlaceholder": "ej. 5 años",
    "profile.yourLevel": "Tu nivel",
    "profile.yourLevelPlaceholder": "¿Qué te hace bueno en esto?",
    "profile.addSkillBtn": "Agregar habilidad",
    "profile.enterSkillName": "Ingresa el nombre de la habilidad.",
    "profile.added": "Agregado ✓",
    "profile.skillHint": "Empieza a escribir y te sugerimos oficios. También puedes escribir el tuyo.",
    "profile.skillDuplicate": "Ya tienes agregado este oficio.",

    // ViewProfile
    "view.back": "← Volver al tablero",
    "view.ratingOne": "{count} calificación",
    "view.ratingMany": "{count} calificaciones",
    "view.sendMessage": "Enviar mensaje",
    "view.noSkills": "Sin habilidades listadas aún.",
    "view.experienceOf": "{exp} de experiencia",
    "view.reviews": "Reseñas",
    "view.reviewerFallback": "Cliente",

    // Messages
    "messages.userFallback": "Usuario",
    "messages.title": "Mensajes",
    "messages.back": "← Volver al tablero",
    "messages.noConversations": "Sin conversaciones aún.",
    "messages.choosePrompt": "Elige una conversación para empezar.",
    "messages.noMessages": "Aún no hay mensajes. ¡Escribe el primero!",
    "messages.composePlaceholder": "Escribe un mensaje…",
    "messages.send": "Enviar",

    // RatingForm
    "rating.yours": "Tu calificación",
    "rating.ratePerson": "Calificar a esta persona",
    "rating.starsAria": "{n} estrellas",
    "rating.commentPlaceholder": "Comentario (opcional)",
    "rating.saving": "Guardando…",
    "rating.update": "Actualizar",
    "rating.submit": "Enviar calificación",
    "rating.pickStar": "Elige al menos una estrella.",
    "rating.thanks": "¡Gracias por tu calificación! ✓",
  },

  en: {
    // Document / metadata
    "meta.title": "SkillBoard — find people who are good at something",
    "meta.description": "A directory of people and what they're best at.",

    // Header
    "header.greeting": "Hi, {name}",
    "header.greetingFallback": "there",
    "header.messages": "Messages",
    "header.myProfile": "My profile",
    "header.logout": "Log out",
    "header.login": "Log in",
    "header.signup": "Sign up",
    "lang.toggle": "ES",
    "lang.toggleAria": "Switch to Spanish",

    // App-level
    "app.loading": "Loading…",

    // Home hero
    "hero.eyebrow": "Your community, your professionals",
    "hero.title": "Find a trusted professional in your area",
    "hero.sub": "Plumbers, electricians, nannies, cooks and much more. People from your community, with reviews from real customers.",
    "hero.client": "I'm a client",
    "hero.clientSub": "I'm looking for a professional",
    "hero.pro": "I'm a professional",
    "hero.proSub": "I want to offer my service",
    "hero.explore": "Browse without an account ↓",
    "hero.haveAccount": "Already have an account?",
    "hero.loggedSearch": "Find a professional",
    "hero.loggedSearchSub": "See who offers what you need",
    "hero.loggedOffer": "Add my service",
    "hero.loggedOfferSub": "Show what you're good at",

    // Stats bar
    "stats.pros": "professionals",
    "stats.professions": "different trades",
    "stats.zones": "areas",
    "stats.reviews": "customer reviews",
    "stats.rating": "average rating",

    // Time in the app
    "tenure.today": "Joined today",
    "tenure.dayOne": "1 day on the app",
    "tenure.dayMany": "{n} days on the app",
    "tenure.monthOne": "1 month on the app",
    "tenure.monthMany": "{n} months on the app",
    "tenure.yearOne": "1 year on the app",
    "tenure.yearMany": "{n} years on the app",

    // Cards
    "card.noReviews": "No reviews yet",
    "card.reviewsOne": "{count} review",
    "card.reviewsMany": "{count} reviews",
    "card.viewProfile": "View profile →",
    "card.moreSkills": "+{n} more",

    // Search suggestions
    "browse.suggestPopular": "Popular",
    "browse.suggestSkills": "Trades",
    "browse.suggestPeople": "People",
    "browse.suggestCountOne": "1 professional",
    "browse.suggestCountMany": "{count} professionals",
    "browse.suggestNone": "no professionals yet",
    "browse.clear": "Clear search",

    // Password recovery / sign up
    "auth.goToBoard": "Go to the board",
    "auth.checkEmail": "We sent you an email to confirm your account. Open it and tap the link to get in.",
    "auth.iWant": "I want to…",
    "auth.intentClient": "Find a professional",
    "auth.intentPro": "Offer my service",
    "auth.err.rateLimit": "You asked for too many emails in a row. Wait a few minutes and try again.",
    "auth.err.samePassword": "The new password must be different from the old one.",
    "auth.err.sessionExpired": "The link expired. Request a new one with “Forgot your password?”.",

    // Auth
    "auth.tab.login": "Log in",
    "auth.tab.signup": "Sign up",
    "auth.name": "Your name",
    "auth.namePlaceholder": "e.g. Jackie Mensah",
    "auth.email": "Email",
    "auth.emailPlaceholder": "you@email.com",
    "auth.password": "Password",
    "auth.passwordPlaceholder": "At least 6 characters",
    "auth.wait": "Please wait…",
    "auth.createAccount": "Create account",
    "auth.login": "Log in",
    "auth.enterName": "Please enter your name.",
    // Supabase error messages
    "auth.err.userExists": "This email is already registered. Try logging in.",
    "auth.err.passwordShort": "The password must be at least 6 characters.",
    "auth.err.invalidEmail": "The email format is not valid.",
    "auth.err.needPassword": "Enter a valid password.",
    "auth.err.invalidLogin": "Incorrect email or password.",
    "auth.err.notConfirmed": "You must confirm your email before logging in.",
    "auth.err.tooMany": "Too many attempts. Wait a moment and try again.",

    // Browse
    "browse.title": "The board",
    "browse.searchPlaceholder": "Search a skill or name — e.g. plumbing, gardening…",
    "browse.locationPlaceholder": "Filter by location — e.g. Panama City",
    "browse.sortRecent": "Most recent",
    "browse.sortRating": "Top rated",
    "browse.resultsOne": "{count} result",
    "browse.resultsMany": "{count} results",
    "browse.peopleOne": "{count} person on the board",
    "browse.peopleMany": "{count} people on the board",
    "browse.noMatch": "Nobody matches your search — try other words.",
    "browse.empty": "The board is empty. Sign up and add the first skill!",

    // MyProfile
    "profile.title": "My profile",
    "profile.back": "← Back to the board",
    "profile.aboutYou": "About you",
    "profile.changePhoto": "Change photo",
    "profile.uploading": "Uploading…",
    "profile.photoUpdated": "Photo updated ✓",
    "profile.name": "Name",
    "profile.location": "Location",
    "profile.locationPlaceholder": "City, Country",
    "profile.bio": "Bio",
    "profile.optional": "(optional)",
    "profile.bioPlaceholder": "One sentence about you",
    "profile.save": "Save profile",
    "profile.saved": "Saved ✓",
    "profile.mySkills": "My skills",
    "profile.noSkills": "No skills yet — add the first one below.",
    "profile.experienceOf": "{exp} of experience",
    "profile.remove": "Remove",
    "profile.addSkill": "Add a skill",
    "profile.skill": "Skill",
    "profile.skillPlaceholder": "e.g. Plumbing",
    "profile.experience": "Experience",
    "profile.experiencePlaceholder": "e.g. 5 years",
    "profile.yourLevel": "Your level",
    "profile.yourLevelPlaceholder": "What makes you good at this?",
    "profile.addSkillBtn": "Add skill",
    "profile.enterSkillName": "Enter the skill name.",
    "profile.added": "Added ✓",
    "profile.skillHint": "Start typing and we'll suggest trades. You can also type your own.",
    "profile.skillDuplicate": "You already added this trade.",

    // ViewProfile
    "view.back": "← Back to the board",
    "view.ratingOne": "{count} rating",
    "view.ratingMany": "{count} ratings",
    "view.sendMessage": "Send message",
    "view.noSkills": "No skills listed yet.",
    "view.experienceOf": "{exp} of experience",
    "view.reviews": "Reviews",
    "view.reviewerFallback": "Customer",

    // Messages
    "messages.userFallback": "User",
    "messages.title": "Messages",
    "messages.back": "← Back to the board",
    "messages.noConversations": "No conversations yet.",
    "messages.choosePrompt": "Choose a conversation to start.",
    "messages.noMessages": "No messages yet. Write the first one!",
    "messages.composePlaceholder": "Type a message…",
    "messages.send": "Send",

    // RatingForm
    "rating.yours": "Your rating",
    "rating.ratePerson": "Rate this person",
    "rating.starsAria": "{n} stars",
    "rating.commentPlaceholder": "Comment (optional)",
    "rating.saving": "Saving…",
    "rating.update": "Update",
    "rating.submit": "Submit rating",
    "rating.pickStar": "Choose at least one star.",
    "rating.thanks": "Thanks for your rating! ✓",
  },
};

// Maps raw Supabase (English) error messages to a translation key so they can
// be shown in the active language.
export const SUPABASE_ERROR_KEYS = {
  "User already registered": "auth.err.userExists",
  "Password should be at least 6 characters": "auth.err.passwordShort",
  "Unable to validate email address: invalid format": "auth.err.invalidEmail",
  "Signup requires a valid password": "auth.err.needPassword",
  "Invalid login credentials": "auth.err.invalidLogin",
  "Email not confirmed": "auth.err.notConfirmed",
  "Too many requests": "auth.err.tooMany",
  "New password should be different from the old password.": "auth.err.samePassword",
  "Auth session missing!": "auth.err.sessionExpired",
  "email rate limit exceeded": "auth.err.rateLimit",
};

// Códigos de error de Supabase (más confiables que el texto, que puede cambiar).
export const SUPABASE_ERROR_CODES = {
  user_already_exists: "auth.err.userExists",
  email_exists: "auth.err.userExists",
  weak_password: "auth.err.passwordShort",
  invalid_credentials: "auth.err.invalidLogin",
  email_not_confirmed: "auth.err.notConfirmed",
  over_email_send_rate_limit: "auth.err.rateLimit",
  over_request_rate_limit: "auth.err.tooMany",
  same_password: "auth.err.samePassword",
  session_not_found: "auth.err.sessionExpired",
};

export const LANGUAGES = ["es", "en"];
const STORAGE_KEY = "skillboard.lang";
const DEFAULT_LANG = "es";

const LanguageContext = createContext(null);

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}

export function LanguageProvider({ children }) {
  // Always start at the default so server and first client render match
  // (avoids hydration mismatch); the stored choice is applied after mount.
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.includes(saved)) setLangState(saved);
    } catch (_) {}
  }, []);

  // Keep <html lang> and the document title in sync with the language.
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.title = translations[lang]["meta.title"];
    } catch (_) {}
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  const t = useCallback(
    (key, vars) => {
      const table = translations[lang] || translations[DEFAULT_LANG];
      const str = table[key] != null ? table[key] : key;
      return interpolate(str, vars);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback so components don't crash if used outside the provider.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      toggleLang: () => {},
      t: (key, vars) => interpolate(translations[DEFAULT_LANG][key] ?? key, vars),
    };
  }
  return ctx;
}
