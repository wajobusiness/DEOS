import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.ecosystem': 'Ecosystem & Tools',
    'nav.resources': 'Resources & Academy',
    'nav.company': 'Company & Network',
    'nav.marketplace': 'Marketplace',
    'nav.stores': 'Creator Stores',
    'nav.pricing': 'Pricing',
    'nav.login': 'Login',
    'nav.get_started': 'Get Started',
    'nav.dashboard': 'Dashboard',
    'nav.wallet': 'Wallet',
    'nav.deposit': 'Deposit',
    'nav.search': 'Search',
    'hero.badge': 'The Digital Entrepreneurship Operating System',
    'hero.title_1': 'Build, Automate & Scale',
    'hero.title_2': 'Digital Businesses with AI',
    'hero.subhead': 'Launch autonomous storefronts, sell digital assets worldwide, automate customer outreach, and earn multi-tier affiliate rewards in one sovereign ecosystem.',
    'hero.cta_start': 'Get Started Now',
    'hero.cta_tour': 'Watch 2-Min Tour',
    'market.title': 'Digital Marketplace',
    'market.subhead': 'Discover, buy, and resell premium courses, SaaS tools, and digital templates with instant delivery.',
    'market.search_placeholder': 'Search 10,000+ courses, templates, tools...',
    'market.all': 'All Categories',
    'market.courses': 'Courses',
    'market.templates': 'Templates',
    'market.tools': 'Tools',
    'market.ebooks': 'eBooks',
    'market.quick_view': 'Quick View',
    'market.buy_now': 'Buy Now',
    'market.add_cart': 'Add to Cart',
    'market.instant_access': 'Instant Download',
    'market.verified': 'Verified Quality',
    'wallet.balance': 'Live Balance',
    'wallet.deposit': 'Deposit Funds',
    'currency.rates_live': 'Live Rates Active',
    'geo.detected': 'Auto-Detected',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.ecosystem': 'Écosystème & Outils',
    'nav.resources': 'Ressources & Académie',
    'nav.company': 'Entreprise & Réseau',
    'nav.marketplace': 'Marché Digital',
    'nav.stores': 'Boutiques Créateurs',
    'nav.pricing': 'Tarifs',
    'nav.login': 'Connexion',
    'nav.get_started': 'Commencer',
    'nav.dashboard': 'Tableau de bord',
    'nav.wallet': 'Portefeuille',
    'nav.deposit': 'Déposer',
    'nav.search': 'Recherche',
    'hero.badge': "Le Système d'Exploitation de l'Entrepreneuriat Digital",
    'hero.title_1': 'Construisez, Automatisez & Développez',
    'hero.title_2': 'Vos Entreprises avec l’IA',
    'hero.subhead': 'Lancez des boutiques autonomes, vendez des actifs numériques dans le monde entier et gagnez des commissions multi-niveaux.',
    'hero.cta_start': 'Commencer Gratuitement',
    'hero.cta_tour': 'Visite en 2 Minutes',
    'market.title': 'Marché Digital Mondial',
    'market.subhead': 'Découvrez, achetez et revendez des cours exclusifs, des outils SaaS et des modèles avec livraison instantanée.',
    'market.search_placeholder': 'Rechercher parmi 10 000+ cours, outils, modèles...',
    'market.all': 'Toutes Catégories',
    'market.courses': 'Formations',
    'market.templates': 'Modèles',
    'market.tools': 'Logiciels',
    'market.ebooks': 'Livres numériques',
    'market.quick_view': 'Aperçu Rapide',
    'market.buy_now': 'Acheter',
    'market.add_cart': 'Ajouter au Panier',
    'market.instant_access': 'Téléchargement Immédiat',
    'market.verified': 'Qualité Vérifiée',
    'wallet.balance': 'Solde en Direct',
    'wallet.deposit': 'Déposer des Fonds',
    'currency.rates_live': 'Taux de Change en Direct',
    'geo.detected': 'Détecté Automatiquement',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.ecosystem': 'Ecosistema y Herramientas',
    'nav.resources': 'Recursos y Academia',
    'nav.company': 'Empresa y Red',
    'nav.marketplace': 'Mercado Digital',
    'nav.stores': 'Tiendas de Creadores',
    'nav.pricing': 'Precios',
    'nav.login': 'Iniciar Sesión',
    'nav.get_started': 'Empezar',
    'nav.dashboard': 'Panel de Control',
    'nav.wallet': 'Billetera',
    'nav.deposit': 'Depositar',
    'nav.search': 'Buscar',
    'hero.badge': 'El Sistema Operativo para Emprendedores Digitales',
    'hero.title_1': 'Construye, Automatiza y Escala',
    'hero.title_2': 'Negocios Digitales con IA',
    'hero.subhead': 'Lanza tiendas autónomas, vende activos digitales en todo el mundo y obtén comisiones de afiliados multinivel.',
    'hero.cta_start': 'Comenzar Ahora',
    'hero.cta_tour': 'Ver Tour de 2 Min',
    'market.title': 'Mercado Digital Global',
    'market.subhead': 'Descubre, compra y revende cursos, herramientas SaaS y plantillas con entrega instantánea.',
    'market.search_placeholder': 'Buscar más de 10,000 cursos, plantillas, herramientas...',
    'market.all': 'Todas las Categorías',
    'market.courses': 'Cursos',
    'market.templates': 'Plantillas',
    'market.tools': 'Herramientas',
    'market.ebooks': 'Libros Digitales',
    'market.quick_view': 'Vista Rápida',
    'market.buy_now': 'Comprar Ahora',
    'market.add_cart': 'Añadir al Carrito',
    'market.instant_access': 'Descarga Inmediata',
    'market.verified': 'Calidad Verificada',
    'wallet.balance': 'Saldo en Vivo',
    'wallet.deposit': 'Depositar Fondos',
    'currency.rates_live': 'Tasas en Tiempo Real',
    'geo.detected': 'Auto-Detectado',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.ecosystem': 'المنظومة والأدوات',
    'nav.resources': 'المصادر والأكاديمية',
    'nav.company': 'الشركة والشبكة',
    'nav.marketplace': 'السوق الرقمي',
    'nav.stores': 'متاجر المبدعين',
    'nav.pricing': 'الأسعار',
    'nav.login': 'تسجيل الدخول',
    'nav.get_started': 'ابدأ الآن',
    'nav.dashboard': 'لوحة التحكم',
    'nav.wallet': 'المحفظة',
    'nav.deposit': 'إيداع',
    'nav.search': 'بحث',
    'hero.badge': 'نظام التشغيل لرواد الأعمال الرقميين',
    'hero.title_1': 'ابنِ وأتمت وطوّر',
    'hero.title_2': 'أعمالك الرقمية بالذكاء الاصطناعي',
    'hero.subhead': 'أطلق متاجرك المستقلة وبع المنتجات الرقمية عالمياً واربح عمولات تسويق بالعمولة متعددة المستويات.',
    'hero.cta_start': 'ابدأ الآن مجاناً',
    'hero.cta_tour': 'جولة سريعة دقيقتين',
    'market.title': 'السوق الرقمي العالمي',
    'market.subhead': 'اكتشف واشترِ وأعد بيع الدورات التدريبية وأدوات البرمجيات والقوالب الجاهزة مع تسليم فوري.',
    'market.search_placeholder': 'ابحث بين أكثر من 10,000 منتج ودورة وأداة...',
    'market.all': 'جميع الأقسام',
    'market.courses': 'الدورات التدريبية',
    'market.templates': 'القوالب',
    'market.tools': 'الأدوات البرمجية',
    'market.ebooks': 'الكتب الرقمية',
    'market.quick_view': 'معاينة سريعة',
    'market.buy_now': 'شراء الآن',
    'market.add_cart': 'إضافة للسلة',
    'market.instant_access': 'تحميل فوري',
    'market.verified': 'جودة موثوقة',
    'wallet.balance': 'الرصيد المباشر',
    'wallet.deposit': 'إيداع أموال',
    'currency.rates_live': 'أسعار الصرف المباشرة',
    'geo.detected': 'تم التعرف تلقائياً',
  },
  pt: {
    'nav.home': 'Início',
    'nav.ecosystem': 'Ecossistema & Ferramentas',
    'nav.resources': 'Recursos & Academia',
    'nav.company': 'Empresa & Rede',
    'nav.marketplace': 'Mercado Digital',
    'nav.stores': 'Lojas de Criadores',
    'nav.pricing': 'Preços',
    'nav.login': 'Entrar',
    'nav.get_started': 'Começar',
    'nav.dashboard': 'Painel',
    'nav.wallet': 'Carteira',
    'nav.deposit': 'Depositar',
    'nav.search': 'Pesquisar',
    'hero.badge': 'O Sistema Operacional para Empreendedores Digitais',
    'hero.title_1': 'Construa, Automatize e Escale',
    'hero.title_2': 'Negócios Digitais com IA',
    'hero.subhead': 'Lance lojas virtuais autônomas, venda infoprodutos globalmente e ganhe comissões recorrentes.',
    'hero.cta_start': 'Começar Agora',
    'hero.cta_tour': 'Ver Demonstração de 2 Min',
    'market.title': 'Mercado Digital Global',
    'market.subhead': 'Descubra, compre e revenda cursos, ferramentas e templates com entrega imediata.',
    'market.search_placeholder': 'Pesquisar mais de 10.000 cursos, ferramentas...',
    'market.all': 'Todas Categorias',
    'market.courses': 'Cursos',
    'market.templates': 'Modelos',
    'market.tools': 'Ferramentas',
    'market.ebooks': 'eBooks',
    'market.quick_view': 'Visualização Rápida',
    'market.buy_now': 'Comprar Agora',
    'market.add_cart': 'Adicionar ao Carrinho',
    'market.instant_access': 'Download Instantâneo',
    'market.verified': 'Qualidade Verificada',
    'wallet.balance': 'Saldo em Tempo Real',
    'wallet.deposit': 'Depositar Fundos',
    'currency.rates_live': 'Câmbio em Tempo Real',
    'geo.detected': 'Detecção Automática',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.ecosystem': 'Ökosystem & Tools',
    'nav.resources': 'Ressourcen & Akademie',
    'nav.company': 'Unternehmen & Netzwerk',
    'nav.marketplace': 'Marktplatz',
    'nav.stores': 'Creator-Stores',
    'nav.pricing': 'Preise',
    'nav.login': 'Anmelden',
    'nav.get_started': 'Loslegen',
    'nav.dashboard': 'Dashboard',
    'nav.wallet': 'Geldbörse',
    'nav.deposit': 'Einzahlen',
    'nav.search': 'Suchen',
    'hero.badge': 'Das Betriebssystem für digitale Unternehmer',
    'hero.title_1': 'Bauen, Automatisieren & Skalieren',
    'hero.title_2': 'Digitale Unternehmen mit KI',
    'hero.subhead': 'Eröffnen Sie autonome Shops, verkaufen Sie digitale Produkte weltweit und verdienen Sie Provisionen.',
    'hero.cta_start': 'Jetzt Starten',
    'hero.cta_tour': '2-Minuten Tour ansehen',
    'market.title': 'Digitaler Marktplatz',
    'market.subhead': 'Finden und kaufen Sie Premium-Kurse, SaaS-Tools und Vorlagen mit Sofortbereitstellung.',
    'market.search_placeholder': 'Über 10.000 Kurse und Tools durchsuchen...',
    'market.all': 'Alle Kategorien',
    'market.courses': 'Kurse',
    'market.templates': 'Vorlagen',
    'market.tools': 'Tools',
    'market.ebooks': 'E-Books',
    'market.quick_view': 'Schnellansicht',
    'market.buy_now': 'Jetzt Kaufen',
    'market.add_cart': 'In den Warenkorb',
    'market.instant_access': 'Sofort-Download',
    'market.verified': 'Geprüfte Qualität',
    'wallet.balance': 'Live-Guthaben',
    'wallet.deposit': 'Guthaben aufladen',
    'currency.rates_live': 'Echtzeit-Wechselkurse',
    'geo.detected': 'Automatisch erkannt',
  },
  zh: {
    'nav.home': '首页',
    'nav.ecosystem': '生态系统与工具',
    'nav.resources': '学习资源与学院',
    'nav.company': '公司与全球网络',
    'nav.marketplace': '数字资产市场',
    'nav.stores': '创作者独立店铺',
    'nav.pricing': '会员方案',
    'nav.login': '登录',
    'nav.get_started': '立即开始',
    'nav.dashboard': '控制台',
    'nav.wallet': '多币种钱包',
    'nav.deposit': '充值',
    'nav.search': '搜索',
    'hero.badge': '数字创业者专属操作系统',
    'hero.title_1': '构建、自动化与规模化',
    'hero.title_2': '基于人工智能的数字企业',
    'hero.subhead': '快速搭建独立店铺，全球分发数字产品与在线课程，自动化AI获客，获取多层级联盟佣金。',
    'hero.cta_start': '免费开启',
    'hero.cta_tour': '2分钟平台演示',
    'market.title': '全球数字资产交易平台',
    'market.subhead': '探索、购买并分销精品课程、SaaS自动化工具与设计模板，即买即用。',
    'market.search_placeholder': '搜索 10,000+ 热门课程、模板与工具...',
    'market.all': '全部分类',
    'market.courses': '精品课程',
    'market.templates': '设计模板',
    'market.tools': 'SaaS工具',
    'market.ebooks': '电子书',
    'market.quick_view': '快速预览',
    'market.buy_now': '立即购买',
    'market.add_cart': '加入购物车',
    'market.instant_access': '即时交付',
    'market.verified': '官方认证',
    'wallet.balance': '实时余额',
    'wallet.deposit': '充值资金',
    'currency.rates_live': '实时汇率生效',
    'geo.detected': '自动识别地区',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.ecosystem': 'Экосистема и инструменты',
    'nav.resources': 'Ресурсы и Академия',
    'nav.company': 'Компания и сеть',
    'nav.marketplace': 'Цифровой Маркетплейс',
    'nav.stores': 'Магазины авторов',
    'nav.pricing': 'Тарифы',
    'nav.login': 'Вход',
    'nav.get_started': 'Начать',
    'nav.dashboard': 'Панель',
    'nav.wallet': 'Кошелек',
    'nav.deposit': 'Пополнить',
    'nav.search': 'Поиск',
    'hero.badge': 'Операционная система для цифровых предпринимателей',
    'hero.title_1': 'Создавайте, автоматизируйте и масштабируйте',
    'hero.title_2': 'Цифровой бизнес с помощью ИИ',
    'hero.subhead': 'Запускайте автономные магазины, продавайте инфопродукты по всему миру и получайте партнерские вознаграждения.',
    'hero.cta_start': 'Начать сейчас',
    'hero.cta_tour': '2-минутный обзор',
    'market.title': 'Глобальный маркетплейс',
    'market.subhead': 'Находите, покупайте и перепродавайте курсы, SaaS-инструменты и шаблоны с мгновенной доставкой.',
    'market.search_placeholder': 'Поиск среди 10 000+ курсов, инструментов...',
    'market.all': 'Все категории',
    'market.courses': 'Курсы',
    'market.templates': 'Шаблоны',
    'market.tools': 'Инструменты',
    'market.ebooks': 'Электронные книги',
    'market.quick_view': 'Быстрый просмотр',
    'market.buy_now': 'Купить',
    'market.add_cart': 'В корзину',
    'market.instant_access': 'Мгновенный доступ',
    'market.verified': 'Проверенное качество',
    'wallet.balance': 'Текущий баланс',
    'wallet.deposit': 'Пополнить баланс',
    'currency.rates_live': 'Курсы в реальном времени',
    'geo.detected': 'Автоопределение региона',
  },
};

interface LanguageContextType {
  language: string;
  languageConfig: LanguageOption;
  setLanguage: (code: string) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('eviona_preferred_language');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
        return browserLang;
      }
    } catch {}
    return 'en';
  });

  const languageConfig =
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const isRTL = languageConfig.dir === 'rtl';

  useEffect(() => {
    // Update HTML dir and lang attributes
    document.documentElement.lang = language;
    document.documentElement.dir = languageConfig.dir;
  }, [language, languageConfig.dir]);

  const setLanguage = (code: string) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === code)) {
      setLanguageState(code);
      try {
        localStorage.setItem('eviona_preferred_language', code);
      } catch {}
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageConfig,
        setLanguage,
        t,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

