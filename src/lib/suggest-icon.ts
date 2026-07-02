// Tabela de ícones verificados no game-icons.net
// Formato: { icon: "author/name", keywords: [...] }
// Todos os ícones foram testados e existem

const ICON_CATALOG = [
  // ── Armas brancas ──────────────────────────────────────────────────────────
  { icon: "lorc/broadsword",          keywords: ["espada", "sabre", "sword", "lamina", "lâmina", "espadão", "katana"] },
  { icon: "lorc/plain-dagger",        keywords: ["adaga", "dagger", "punhal", "stileto", "faca curta",
                                                  "garras", "chifres", "lamina de sangue cristalizado",
                                                  "arma de sangue", "ataque corpo a corpo adicional"] },
  { icon: "skoll/bowie-knife",        keywords: ["faca", "knife", "canivete", "navalha"] },
  { icon: "delapouite/hatchet",       keywords: ["machado", "machadinha", "axe", "hatchet"] },
  { icon: "delapouite/baseball-bat",  keywords: ["taco", "bastao", "bastão", "bat", "porrete", "tacape"] },
  { icon: "lorc/whip",                keywords: ["chicote", "corrente", "chain", "whip", "flagelo", "chibata"] },

  // ── Armas de fogo ──────────────────────────────────────────────────────────
  { icon: "john-colburn/pistol-gun",  keywords: ["pistola", "gun", "handgun", "glock", "beretta", "pistol",
                                                  "segurar o gatilho", "arma de fogo"] },
  { icon: "skoll/revolver",           keywords: ["revolver", "revólver", "colt", "smith wesson"] },
  { icon: "skoll/ak47",               keywords: ["rifle", "ak47", "fuzil", "carabina", "m4", "ar15", "assault", "carbine"] },
  { icon: "delapouite/uzi",           keywords: ["uzi", "submetralhadora", "smg", "mp5", "submachine"] },
  { icon: "lorc/grenade",             keywords: ["granada", "grenade", "bomba", "explosivo", "molotov"] },

  // ── Proteção ───────────────────────────────────────────────────────────────
  { icon: "sbed/kevlar",              keywords: ["kevlar", "colete", "vest", "armadura leve"] },
  { icon: "skoll/kevlar-vest",        keywords: ["colete tatico", "colete tático", "tactical vest", "body armor"] },
  { icon: "lorc/barbute",             keywords: ["capacete", "elmo", "helmet", "armadura", "headgear",
                                                  "sangue de ferro", "imunidade a venenos e doencas",
                                                  "tanque de guerra", "usar protecao pesada", "usando proteção pesada"] },

  // ── Equipamento ────────────────────────────────────────────────────────────
  { icon: "delapouite/flashlight",    keywords: ["lanterna", "flashlight", "luz", "light", "tocha", "torch"] },
  { icon: "delapouite/binoculars",    keywords: ["binoculo", "binóculo", "binoculars", "telescopio", "luneta"] },
  { icon: "delapouite/lockpicks",     keywords: ["gazua", "lockpick", "fechadura", "dedos ageis", "dedos ágeis",
                                                  "arrombar", "arrombamento", "lockpicking"] },
  { icon: "delapouite/backpack",      keywords: ["mochila", "backpack", "bag", "bolsa", "saco", "bolsao"] },
  { icon: "delapouite/walkie-talkie", keywords: ["radio", "rádio", "walkie", "comunicador", "transmissor", "receptor"] },
  { icon: "delapouite/smartphone",    keywords: ["celular", "smartphone", "phone", "telefone", "iphone", "android"] },
  { icon: "delapouite/first-aid-kit", keywords: ["kit medico", "primeiros socorros", "curativo", "bandagem", "medkit",
                                                  "cura acelerada", "sangue vivo", "machucado cura",
                                                  "medico de campo", "médico de campo", "paramedico", "cirurgia"] },
  { icon: "lorc/campfire",            keywords: ["fogueira", "campfire", "sobrevivencia", "sobrevivência", "acampamento"] },
  { icon: "lorc/magnifying-glass",    keywords: ["lupa", "investigar", "investigacao", "investigação", "busca", "detective",
                                                  "cacador", "caçador", "rastrear", "rastreamento", "procurar pistas"] },
  { icon: "lorc/manacles",            keywords: ["algemas", "manacles", "prisioneiro", "shackles",
                                                  "grilhoes de lodo", "correntes e vinhas de lodo"] },
  { icon: "delapouite/book-cover",    keywords: ["livro", "book", "manual", "grimorio", "grimório", "tomo", "diario",
                                                  "expansao de conhecimento", "aprender poder de classe",
                                                  "absorver conhecimento", "objeto escrito e fazer uma pergunta"] },
  { icon: "lorc/charm",               keywords: ["amuleto", "charm", "talismã", "amulet", "pendente", "joia", "jóia"] },
  { icon: "lorc/crystal-ball",        keywords: ["bola de cristal", "esfera magica", "oraculo", "oráculo",
                                                  "precognicao", "precognição", "prever", "futuro", "profecia",
                                                  "imune a condicao desprevenido", "imune à condição desprevenido",
                                                  "antecipar vitalidade", "carga de antecipacao"] },

  // ── Veículos ───────────────────────────────────────────────────────────────
  { icon: "delapouite/city-car",      keywords: ["carro", "car", "veiculo", "veículo", "automovel", "automóvel", "sedan"] },
  { icon: "delapouite/surfer-van",    keywords: ["van", "furgao", "furgão", "caminhao", "caminhão", "truck", "sprinter"] },

  // ── Combate corpo-a-corpo ──────────────────────────────────────────────────
  { icon: "lorc/crossed-swords",      keywords: ["duas armas", "combater com duas", "dual wield", "espadas cruzadas", "duelo",
                                                  "sangue fervente", "machucado recebe bonus em agilidade ou forca"] },
  { icon: "lorc/bordered-shield",     keywords: ["combate defensivo", "defensivo", "combater defensivamente",
                                                  "sofre penalidade ataque recebe defesa",
                                                  "anatomia insana", "ignorar dano adicional de acerto critico"] },
  { icon: "lorc/fist",                keywords: ["artista marcial", "artes marciais", "pugilismo", "boxe", "soco", "luta desarmada"] },
  { icon: "lorc/muscle-up",           keywords: ["armamento pesado", "golpe pesado", "forca bruta", "força bruta", "potencia"] },
  { icon: "lorc/heavy-fall",          keywords: ["golpe demolidor", "demolidor", "devastar", "impacto forte", "destruir", "abater"] },
  { icon: "lorc/master-of-arms",      keywords: ["guerreiro", "veterano", "mestre em armas", "disciplina marcial", "armamento"] },

  // ── Ataque reativo / Oportunidade ─────────────────────────────────────────
  { icon: "lorc/run",                 keywords: ["ataque de oportunidade", "sai voluntariamente de um espaco adjacente",
                                                  "acrobatico", "acrobático", "movimento tatico", "movimento tático"] },

  // ── Combate à distância ────────────────────────────────────────────────────
  { icon: "lorc/target-shot",         keywords: ["tiro certeiro", "certeiro", "precisão", "precisao", "mira", "alvo", "pontaria",
                                                  "atirador de elite", "elite", "sniper"] },
  { icon: "delapouite/eye-target",    keywords: ["sentido tático", "sentido tatico", "analisar o ambiente",
                                                  "bonus em defesa e testes de resistencia igual ao intelecto",
                                                  "tiro de cobertura", "cobertura"] },

  // ── Velocidade / Atletismo ────────────────────────────────────────────────
  { icon: "lorc/sprint",              keywords: ["presteza atlética", "presteza atletica", "saque rápido", "saque rapido",
                                                  "velocidade", "correria desesperada", "atletico", "atlético",
                                                  "instinto de fuga", "inicio de perseguicao", "inicio de perseguição",
                                                  "recebe bonus em todos os testes da cena"] },

  // ── Esquiva / Campo de energia ────────────────────────────────────────────
  { icon: "lorc/aura",                keywords: ["reflexos defensivos", "+2 em defesa e em testes de resistencia",
                                                  "campo protetor", "acao esquiva gasta 1 pe para bonus defesa",
                                                  "resistir a elemento", "resistencia 10 contra esse elemento",
                                                  "engolir o choro", "nao sofre penalidades por condicoes em testes de fuga"] },

  // ── Vitalidade / Resistência ──────────────────────────────────────────────
  { icon: "delapouite/heart-beats",   keywords: ["incansável", "incansavel", "vitalidade reforçada", "vitalidade", "stamina",
                                                  "tenacidade", "morrendo mas consciente", "fortitude encerrar morrendo",
                                                  "vontade inabalavel", "vontade inabalável", "+1 pe por 10",
                                                  "+1 pv por 5"] },

  // ── Estratégia / Comando / Equipe ─────────────────────────────────────────
  { icon: "lorc/all-for-one",         keywords: ["comandante de campo", "comandante", "lider", "líder", "coordenar",
                                                  "equipe", "time", "aliados",
                                                  "paranoia defensiva", "cada aliado escolhe bonus",
                                                  "sincronia paranormal", "sincronia mental", "distribui bonus de presenca"] },

  // ── Furtividade / Agente ──────────────────────────────────────────────────
  { icon: "lorc/rogue",               keywords: ["agente secreto", "espio", "espião", "encoberto", "disfarce", "clandestino", "infiltrador"] },
  { icon: "lorc/shadow-follower",     keywords: ["ninja urbano", "ninja", "sorrateiro", "furtividade", "furtivo", "sombra",
                                                  "espreitar da besta", "furtividade em vez de atletismo",
                                                  "acoes discretas sem penalidade"] },
  { icon: "darkzaitzev/smoke-bomb",   keywords: ["operações especiais", "operacoes especiais", "tropa de choque",
                                                  "fumaca", "fumaça", "diversao tatica", "diversão tática"] },

  // ── Habilidades mentais / Sociais ─────────────────────────────────────────
  { icon: "lorc/brain",               keywords: ["nerd", "pensamento ágil", "pensamento agil", "inteligência", "inteligencia",
                                                  "pensamento tatico", "pensamento tático",
                                                  "traçado conjuratório", "tracado conjuratorio",
                                                  "simbolo paranormal no chao", "tracar simbolo paranormal"] },
  { icon: "lorc/conversation",        keywords: ["negociador", "persuasivo", "primeira impressao", "primeira impressão",
                                                  "mentiroso nato", "palavras de devoção", "intimidar", "diplomacia",
                                                  "sensitivo", "sentir emocoes e intencoes", "+5 em diplomacia intimidacao"] },
  { icon: "lorc/gaze",                keywords: ["sentidos aguçados", "sentidos agucados", "observador", "perceber",
                                                  "desprevenido contra inimigos que nao possa ver",
                                                  "visao no escuro", "visão no escuro", "faro",
                                                  "instintos sanguinarios", "instintos sanguinários",
                                                  "nao pode ser flanqueado",
                                                  "percepção paranormal", "rolar novamente um dado com resultado menor"] },

  // ── Tecnologia ────────────────────────────────────────────────────────────
  { icon: "delapouite/computer",      keywords: ["hacker", "hack", "computador", "sistema", "rede", "tecnico", "técnico",
                                                  "rato de computador", "tecnologia para invadir", "tempo de hacking"] },

  // ── Ocultismo geral ───────────────────────────────────────────────────────
  { icon: "lorc/magic-swirl",         keywords: ["ocultismo", "magia", "mística", "mistica", "arcano", "fluxo de poder",
                                                  "ferramentas paranormais", "ativar itens paranormais",
                                                  "afinidade elemental", "afinidade com um elemento escolhido",
                                                  "mestre em elemento", "custo de rituais desse elemento",
                                                  "especialista em elemento", "dt para resistir aos rituais",
                                                  "transcender", "poder paranormal escolhido", "nao ganha sanidade"] },
  { icon: "lorc/wax-seal",            keywords: ["criar selo", "selos paranormais", "fabrica selos", "maximo de selos",
                                                  "pentagrama", "sigilo", "exorcista", "exorcismo"] },
  { icon: "lorc/incense",             keywords: ["ritual predileto", "ritual potente", "improvisar componentes",
                                                  "cerimônia", "invocação", "preparar ritual",
                                                  "lâmina paranormal", "conduíte", "canal paranormal"] },
  { icon: "lorc/bleeding-eye",        keywords: ["tatuagem ritualística", "tatuagem", "estigmado", "flagelador", "marca oculta"] },

  // ── Paranormal — Conhecimento ─────────────────────────────────────────────
  { icon: "lorc/psychic-waves",       keywords: ["intuição paranormal", "intuitivo", "conexão empática", "conexao empatica",
                                                  "empatia", "telepatia", "psiquico", "psíquico",
                                                  "objeto eletrico ligado", "conversar com ele como senciente",
                                                  "apatia herege", "condicao de medo", "teste contra medo"] },
  { icon: "lorc/paranoia",            keywords: ["apavorado", "aura de pavor", "pessoa ou animal apavorado",
                                                  "vontade dt pre", "aura de medo"] },

  // ── Paranormal — Energia ──────────────────────────────────────────────────
  { icon: "lorc/power-lightning",     keywords: ["energia", "instrumento elétrico de combate", "eletrico", "elétrico",
                                                  "causalidade fortuita", "manipular entropia", "entropia", "raio",
                                                  "afortunado", "rolar novamente resultado 1 em qualquer dado",
                                                  "golpe de sorte", "margem de ameaca",
                                                  "foco gravitacional", "ocupa 0 espacos",
                                                  "valer-se do caos", "controlar o caos",
                                                  "salto de dados", "marcar simbolo no proprio corpo retornar estado",
                                                  "traco de inconsistencia", "esconder identidade em imagens digitais",
                                                  "sobrepor imprevisivel", "rolar 1d20 iniciativa"] },

  // ── Paranormal — Morte ────────────────────────────────────────────────────
  { icon: "lorc/crowned-skull",       keywords: ["morte", "encarar a morte", "escapar da morte",
                                                  "surto temporal", "acao padrao adicional por 3 pe",
                                                  "potencial aprimorado", "+1 pe por nex", "+2 pe por nex",
                                                  "ao receber dano que deixaria com 0 pv",
                                                  "escudo espiral temporal", "rd 20 projeto se desfaz",
                                                  "limite de gasto de pe"] },

  // ── Paranormal — Sangue (keywords exclusivos por habilidade) ──────────────
  { icon: "lorc/heart-drop",          keywords: ["potencial reaproveitado", "pe temporarios ao passar em teste de resistencia",
                                                  "pe temporarios cumulativos", "hemorragia"] },

  // ── Paranormal — Sacrifício ───────────────────────────────────────────────
  { icon: "lorc/burning-passion",     keywords: ["sacrifício", "sacrificio", "arrogância diabólica", "arrogancia diabolica",
                                                  "causar culpa terrivel", "despertar obsessão", "adorar voce",
                                                  "acao extremamente imprudente"] },

  // ── Gerais ────────────────────────────────────────────────────────────────
  { icon: "lorc/backup",              keywords: ["provisões de emergência", "provisoes de emergencia",
                                                  "sobrevivencialista", "inventário organizado", "inventario organizado"] },
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function scoreMatch(query: string, keywords: string[]): number {
  const normQuery = normalize(query)
  const queryWords = normQuery.split(" ")

  let score = 0
  for (const kw of keywords) {
    const normKw = normalize(kw)
    // Exact keyword match in query
    if (normQuery.includes(normKw)) {
      score += normKw.includes(" ") ? 10 : 5 // multi-word keywords score higher
    }
    // Partial word match (stem)
    for (const word of queryWords) {
      if (word.length >= 3 && normKw.startsWith(word)) score += 2
      if (normKw.includes(word) && word.length >= 4) score += 1
    }
  }
  return score
}

export type IconSuggestion = {
  icon: string
  confidence: "high" | "medium" | "low" | "none"
}

export function suggestIcon(name: string, description?: string): IconSuggestion {
  const query = [name, description].filter(Boolean).join(" ")

  let best = { icon: "", score: 0 }

  for (const entry of ICON_CATALOG) {
    const score = scoreMatch(query, entry.keywords)
    if (score > best.score) {
      best = { icon: entry.icon, score }
    }
  }

  if (best.score === 0) return { icon: "", confidence: "none" }
  if (best.score >= 8)  return { icon: best.icon, confidence: "high" }
  if (best.score >= 3)  return { icon: best.icon, confidence: "medium" }
  return { icon: best.icon, confidence: "low" }
}
