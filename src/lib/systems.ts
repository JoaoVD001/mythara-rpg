// ─── Origens ────────────────────────────────────────────────────────────────

export type OPOrigin = {
  id: string
  name: string
  description: string
  grantedSkills: string[]
  chooseSkillFrom?: string[]
  powerName: string
  powerDescription: string
}

export type OPBook = {
  id: string
  name: string
  coverImage: string
  origins: OPOrigin[]
}

const LIVRO_BASICO_ORIGINS: OPOrigin[] = [
  {
    id: "academico",
    name: "Acadêmico",
    description: "Você passou anos estudando em universidades, laboratórios ou bibliotecas. Seja um professor, pesquisador ou estudante dedicado, seu conhecimento teórico é vasto. A vida acadêmica o ensinou a investigar, questionar e buscar respostas — habilidades que se provam valiosas diante do paranormal.",
    grantedSkills: ["Ciências"],
    chooseSkillFrom: ["Atualidades", "Investigação", "Tecnologia"],
    powerName: "Especialização",
    powerDescription: "Escolha uma perícia treinada. Quando fizer um teste com essa perícia, pode rolar dois dados e usar o maior resultado. Pode trocar a perícia escolhida ao subir de NEX.",
  },
  {
    id: "agente-saude",
    name: "Agente de Saúde",
    description: "Médico, enfermeiro, paramédico ou qualquer profissional de saúde — você dedicou sua vida a salvar outras. Seu treinamento clínico e sua calma sob pressão fazem de você um aliado indispensável em campo.",
    grantedSkills: ["Medicina"],
    chooseSkillFrom: ["Ciências", "Fortitude", "Percepção"],
    powerName: "Mãos que Curam",
    powerDescription: "Quando usa a ação Primeiros Socorros, cura pontos de vida adicionais iguais ao seu valor de Intelecto. Além disso, pode usar Primeiros Socorros como ação bônus uma vez por cena.",
  },
  {
    id: "amnesico",
    name: "Amnésico",
    description: "Você não sabe quem é. Suas memórias são fragmentos — rostos sem nome, lugares sem contexto, habilidades sem origem. Algo apagou seu passado, mas deixou as capacidades intactas. Descobrir sua identidade pode ser tão perigoso quanto o paranormal.",
    grantedSkills: [],
    chooseSkillFrom: [...[] as string[]],
    powerName: "Memória Fragmentada",
    powerDescription: "Uma vez por sessão, pode declarar que seu personagem possui uma memória relevante para a situação atual. Ganhe treinamento em uma perícia à sua escolha até o fim da cena.",
  },
  {
    id: "artista",
    name: "Artista",
    description: "Ator, pintor, escritor, escultor — você vê o mundo de forma diferente e transforma essa visão em arte. Sua sensibilidade artística aguçou sua percepção e sua capacidade de se expressar e convencer os outros.",
    grantedSkills: ["Artes"],
    chooseSkillFrom: ["Enganação", "Percepção", "Persuasão"],
    powerName: "Inspiração Criativa",
    powerDescription: "Uma vez por cena, pode gastar 2 PE para conceder vantagem no próximo teste de um aliado que você possa ver, por meio de palavras de encorajamento, música ou performance.",
  },
  {
    id: "criminoso",
    name: "Criminoso",
    description: "Ladrão, trapaceiro, golpista ou mercenário — você viveu à margem da lei. Seja por necessidade ou escolha, aprendeu a sobreviver em ambientes hostis usando astúcia, furtividade e quando necessário, violência.",
    grantedSkills: ["Crime"],
    chooseSkillFrom: ["Enganação", "Furtividade", "Intimidação"],
    powerName: "Vida no Crime",
    powerDescription: "Você tem contatos no submundo. Uma vez por sessão, pode usar sua rede de contatos para obter um item ilegal, informação sigilosa ou abrigo sem levantar suspeitas.",
  },
  {
    id: "cultista-arrependido",
    name: "Cultista Arrependido",
    description: "Você fez parte de um culto que adorava entidades do Outro Lado. Por escolha própria ou força das circunstâncias, rompeu com o grupo — mas o conhecimento que adquiriu sobre o paranormal permanece, assim como os pesadelos.",
    grantedSkills: ["Ocultismo", "Religião"],
    powerName: "Conhecimento Proibido",
    powerDescription: "Você conhece rituais e símbolos de cultos. Uma vez por sessão, pode identificar automaticamente uma entidade, ritual ou símbolo paranormal sem precisar de um teste.",
  },
  {
    id: "desaparecido",
    name: "Desaparecido",
    description: "Por algum motivo — fuga, testemunha protegida, recomeço — você desapareceu do radar. Aprendeu a se mover sem ser notado, a mudar de identidade e a desconfiar de todos. Oficialmente, você não existe.",
    grantedSkills: ["Furtividade"],
    chooseSkillFrom: ["Enganação", "Investigação", "Percepção"],
    powerName: "Sombra",
    powerDescription: "Pode forjar documentos, criar identidades falsas e obter alojamento seguro com facilidade. Além disso, testes para rastrear ou identificar você têm desvantagem.",
  },
  {
    id: "esportista",
    name: "Esportista",
    description: "Atleta profissional ou amador, seu corpo é sua ferramenta. Anos de treino físico intenso desenvolveram não apenas força e agilidade, mas também disciplina mental e capacidade de trabalhar em equipe.",
    grantedSkills: ["Atletismo"],
    chooseSkillFrom: ["Acrobacia", "Fortitude", "Reflexos"],
    powerName: "Corpo de Atleta",
    powerDescription: "Seu limite de carga é dobrado. Além disso, quando faz um teste de Atletismo ou Acrobacia, pode gastar 1 PE para rolar novamente e usar o melhor resultado.",
  },
  {
    id: "executivo",
    name: "Executivo",
    description: "CEO, diretor ou gerente de alto escalão — você comandou pessoas e recursos em ambientes corporativos. Seu poder de persuasão, liderança e capacidade de tomar decisões sob pressão são notáveis.",
    grantedSkills: ["Diplomacia"],
    chooseSkillFrom: ["Atualidades", "Persuasão", "Tecnologia"],
    powerName: "Networking",
    powerDescription: "Seus contatos corporativos abrem portas. Uma vez por sessão, pode acionar uma conexão profissional para obter acesso a locais restritos, informações sigilosas ou recursos financeiros.",
  },
  {
    id: "hacker",
    name: "Hacker",
    description: "Você vê o mundo através de código e sistemas. Invasor de redes, pesquisador de segurança ou simplesmente curioso digital — sua habilidade com tecnologia é incomparável e frequentemente encontra aplicação em situações inesperadas.",
    grantedSkills: ["Tecnologia"],
    chooseSkillFrom: ["Ciências", "Investigação", "Percepção"],
    powerName: "Acesso Remoto",
    powerDescription: "Uma vez por cena, pode hackear um sistema eletrônico próximo sem precisar de teste, desde que tenha pelo menos 1 minuto e acesso à rede. Em combate, pode tentar hackear como ação padrão.",
  },
  {
    id: "investigador",
    name: "Investigador",
    description: "Detetive particular, jornalista investigativo ou simplesmente alguém obcecado com a verdade — você tem um talento nato para encontrar respostas onde outros veem apenas perguntas. Sua mente analítica e perseverância são suas maiores armas.",
    grantedSkills: ["Investigação"],
    chooseSkillFrom: ["Intuição", "Percepção", "Persuasão"],
    powerName: "Faro Investigativo",
    powerDescription: "Ao examinar uma cena, pode gastar 1 PE para fazer uma pergunta ao Narrador sobre o local ou situação, que deve ser respondida honestamente. Pode usar este poder uma vez por cena.",
  },
  {
    id: "lutador",
    name: "Lutador",
    description: "Praticante de artes marciais, boxeador, lutador de rua — seu corpo é uma arma. Você passou anos aperfeiçoando técnicas de combate corpo a corpo e sabe usar a força física para resolver problemas quando as palavras falham.",
    grantedSkills: ["Luta"],
    chooseSkillFrom: ["Atletismo", "Fortitude", "Intimidação"],
    powerName: "Combatente Nato",
    powerDescription: "Quando realiza uma manobra de combate (agarrar, derrubar, desarmar), ignora a penalidade de -5 no teste e causa dano normal em caso de sucesso.",
  },
  {
    id: "magnata",
    name: "Magnata",
    description: "Herdeiro ou self-made — você possui uma fortuna considerável. Dinheiro abre portas que habilidades não conseguem, e você aprendeu a usar seus recursos estrategicamente para obter o que precisa.",
    grantedSkills: ["Diplomacia"],
    chooseSkillFrom: ["Atualidades", "Persuasão", "Pilotagem"],
    powerName: "Recursos Ilimitados",
    powerDescription: "Uma vez por sessão, pode gastar dinheiro para resolver um problema que normalmente exigiria um teste. O Narrador define o custo. Você também começa com o dobro de patrimônio inicial.",
  },
  {
    id: "medium",
    name: "Médium",
    description: "Desde criança você via coisas que outros não podiam — ou ao menos era o que diziam ser loucura. Espíritos, visões, pressentimentos. Agora que sabe que o Outro Lado é real, seu dom se prova mais valioso do que nunca.",
    grantedSkills: ["Ocultismo"],
    chooseSkillFrom: ["Intuição", "Percepção", "Religião"],
    powerName: "Sentido Paranormal",
    powerDescription: "Você pode sentir a presença de entidades e fenômenos paranormais. Uma vez por cena, pode gastar 1 PE para detectar automaticamente qualquer ser ou efeito do Outro Lado a até 30 metros.",
  },
  {
    id: "militar",
    name: "Militar",
    description: "Soldado, veterano ou oficial — você foi treinado para combater em condições extremas. Disciplina, trabalho em equipe e pensamento tático fazem parte da sua essência. Suas experiências de guerra deixaram marcas, mas também habilidades que poucos possuem.",
    grantedSkills: ["Pontaria", "Tática"],
    powerName: "Disciplina Militar",
    powerDescription: "Você e seus aliados a até 6 metros não sofrem penalidade em testes por estarem sob efeito de medo. Além disso, pode usar a ação Ajudar como ação bônus uma vez por rodada.",
  },
  {
    id: "monge",
    name: "Monge",
    description: "Seja em um mosteiro budista, um retiro espiritual ou uma escola de artes marciais oriental, você dedicou anos ao autoconhecimento e à disciplina do corpo e da mente. Sua serenidade é uma fortaleza.",
    grantedSkills: ["Fortitude"],
    chooseSkillFrom: ["Luta", "Meditação", "Religião"],
    powerName: "Mente Clara",
    powerDescription: "Uma vez por cena, pode gastar 2 PE para remover um efeito mental que o afete (medo, confusão, dominação). Além disso, tem vantagem em testes de Sanidade contra efeitos do Outro Lado.",
  },
  {
    id: "nomade",
    name: "Nômade",
    description: "Viajante, morador de rua ou explorador — você não tem lugar fixo e aprendeu a sobreviver em qualquer ambiente. Sua vida ao ar livre e em condições adversas tornou você resiliente e adaptável.",
    grantedSkills: ["Sobrevivência"],
    chooseSkillFrom: ["Atletismo", "Fortitude", "Percepção"],
    powerName: "Adaptação",
    powerDescription: "Você é capaz de encontrar abrigo, comida e água em qualquer ambiente, mesmo urbano. Além disso, nunca fica perdido e tem vantagem em testes para rastrear criaturas ao ar livre.",
  },
  {
    id: "policial",
    name: "Policial",
    description: "Agente da lei, detetive ou investigador forense — você trabalhou dentro do sistema para manter a ordem. Seu treinamento inclui tanto investigação quanto uso de força, e seus contatos nas forças de segurança são valiosos.",
    grantedSkills: ["Investigação", "Pontaria"],
    powerName: "Autoridade",
    powerDescription: "Sua credencial policial (mesmo que antiga) abre portas e intimi da civis. Uma vez por sessão, pode acessar registros policiais, cenas de crime ou prender um suspeito sem burocracia.",
  },
  {
    id: "politico",
    name: "Político",
    description: "Vereador, deputado ou assessor — você navega nas águas turvas da política. A arte do discurso, da negociação e da manipulação são ferramentas que você domina, assim como a capacidade de sobreviver em ambientes hostis.",
    grantedSkills: ["Diplomacia", "Persuasão"],
    powerName: "Palanque",
    powerDescription: "Quando se dirige a um grupo de pessoas, pode gastar 2 PE para fazer todos os presentes passarem em um teste de Vontade ou se tornarem favoráveis à sua causa por 1 hora.",
  },
  {
    id: "religioso",
    name: "Religioso",
    description: "Padre, pastor, rabino, imam ou qualquer líder espiritual — sua fé é um escudo. Você entende de rituais, simbolismos sagrados e a psicologia da crença. Diante do paranormal, sua convicção pode ser sua maior força.",
    grantedSkills: ["Religião"],
    chooseSkillFrom: ["Diplomacia", "Intuição", "Ocultismo"],
    powerName: "Fé Inabalável",
    powerDescription: "Uma vez por cena, pode gastar 2 PE para se recuperar de um efeito de insanidade imediatamente. Além disso, entidades do Outro Lado têm desvantagem em testes para afetá-lo com medo.",
  },
  {
    id: "seguranca",
    name: "Segurança",
    description: "Segurança privado, guarda-costas ou vigilante — você foi pago para proteger pessoas e propriedades. Sua presença imponente e habilidade em detectar ameaças fazem de você um guardian natural do grupo.",
    grantedSkills: ["Luta"],
    chooseSkillFrom: ["Fortitude", "Intimidação", "Percepção"],
    powerName: "Protetor",
    powerDescription: "Quando um aliado adjacente é alvo de um ataque, você pode usar uma reação para se interpor, recebendo o ataque no lugar dele. Além disso, pode usar Intimidação no lugar de Persuasão em situações de segurança.",
  },
  {
    id: "sem-teto",
    name: "Sem Teto",
    description: "As ruas foram sua escola. Invisível para a sociedade, você aprendeu a observar sem ser visto, a sobreviver com nada e a encontrar comunidade nos lugares mais improváveis. Você conhece a cidade por baixo de sua fachada.",
    grantedSkills: ["Sobrevivência"],
    chooseSkillFrom: ["Furtividade", "Percepção", "Persuasão"],
    powerName: "Invisível",
    powerDescription: "As pessoas ignoram sua presença naturalmente. Testes para notar você em situações sociais têm desvantagem. Além disso, você conhece os refugios, passagens e segredos de qualquer cidade.",
  },
  {
    id: "servidor-publico",
    name: "Servidor Público",
    description: "Funcionário de repartição, cartório, hospital público ou qualquer órgão governamental — você conhece como a burocracia funciona por dentro. Sabe quais formulários assinar, quais portas bater e quem realmente manda.",
    grantedSkills: ["Atualidades"],
    chooseSkillFrom: ["Diplomacia", "Investigação", "Persuasão"],
    powerName: "Burocracia",
    powerDescription: "Você sabe navegar (e manipular) o sistema. Uma vez por sessão, pode obter qualquer documento, certidão ou informação de registro público sem testes, apenas com tempo.",
  },
  {
    id: "trambiqueiro",
    name: "Trambiqueiro",
    description: "Vigarista, golpista, cambista — você vive de enganar os outros. Seu charme é uma máscara perfeita e sua língua afiada consegue convencer quase qualquer pessoa de quase qualquer coisa. A confiança dos outros é sua moeda.",
    grantedSkills: ["Enganação"],
    chooseSkillFrom: ["Atuação", "Crime", "Persuasão"],
    powerName: "Conto do Vigário",
    powerDescription: "Uma vez por cena, pode criar uma mentira elaborada. O alvo deve passar em um teste de Intuição (dificuldade 15) ou acreditar completamente na sua história por 1 hora.",
  },
]

const SOBREVIVENDO_HORROR_ORIGINS: OPOrigin[] = [
  {
    id: "amigo-animais",
    name: "Amigo dos Animais",
    description: "Você sempre teve uma conexão especial com animais. Veterinário, tratador ou simplesmente alguém que os bichos escolhem — sua empatia com outras criaturas vai além do comum e, diante do paranormal, essa habilidade se revela surpreendentemente útil.",
    grantedSkills: ["Adestramento"],
    chooseSkillFrom: ["Fortitude", "Medicina", "Sobrevivência"],
    powerName: "Linguagem Animal",
    powerDescription: "Animais comuns nunca o atacam sem provocação. Uma vez por cena, pode tentar se comunicar com um animal para obter informações simples (localização, presença de pessoas, perigo) por meio de um teste de Adestramento.",
  },
  {
    id: "astronauta",
    name: "Astronauta",
    description: "Você foi ao espaço — ou pelo menos foi treinado para isso. Engenheiro aeroespacial, piloto de missão ou cientista de bordo, seu preparo físico e mental é rigorosíssimo. A vastidão do cosmos muda a perspectiva de qualquer um.",
    grantedSkills: ["Ciências", "Pilotagem"],
    powerName: "Preparado para o Extremo",
    powerDescription: "Você foi treinado para operar sob estresse absoluto. Uma vez por cena, pode ignorar uma penalidade por condição ambiental (frio extremo, falta de ar, pressão) por até 10 minutos.",
  },
  {
    id: "chef",
    name: "Chef do Outro Lado",
    description: "Cozinheiro profissional com um paladar apurado para o incomum. Sua carreira no mundo gastronômico o expôs a ingredientes, culturas e situações inesperadas — incluindo algumas de origem claramente paranormal.",
    grantedSkills: ["Ciências"],
    chooseSkillFrom: ["Diplomacia", "Percepção", "Persuasão"],
    powerName: "Alquimia Culinária",
    powerDescription: "Em campo, pode preparar refeições que concedem benefícios temporários. Com acesso a ingredientes e 1 hora, prepare uma refeição que restaura 1d6 PV ou 1d6 pontos de Sanidade a até 4 criaturas.",
  },
  {
    id: "colegial",
    name: "Colegial",
    description: "Você ainda está no ensino médio — mas o paranormal não escolhe idade. Seja por coincidência ou destino, você acabou envolvido com a Ordem antes da hora. Jovem, adaptável e com uma perspectiva diferente dos adultos ao redor.",
    grantedSkills: ["Tecnologia"],
    chooseSkillFrom: ["Artes", "Atletismo", "Investigação"],
    powerName: "Energia Juvenil",
    powerDescription: "Você se recupera com mais facilidade. No início de cada sessão, recupera PE adicionais iguais ao seu bônus de Agilidade. Além disso, NPCs adultos tendem a subestimá-lo — o que pode ser uma vantagem.",
  },
  {
    id: "cosplayer",
    name: "Cosplayer",
    description: "Você domina a arte de se transformar em outra pessoa. Figurinista, caracterizador e ator por hobby — sua habilidade de assumir identidades vai muito além da fantasia e se prova um talento raro em missões que exigem infiltração.",
    grantedSkills: ["Artes", "Enganação"],
    powerName: "Outro Personagem",
    powerDescription: "Uma vez por sessão, pode criar um disfarce convincente em até 10 minutos usando materiais à mão. Enquanto mantiver o disfarce, testes para reconhecê-lo têm desvantagem.",
  },
  {
    id: "diplomata",
    name: "Diplomata",
    description: "Você representa interesses — de um país, empresa ou organização. Sua carreira é construída sobre negociação, protocolo e a capacidade de manter a calma em salas onde palavras podem mover nações.",
    grantedSkills: ["Diplomacia", "Persuasão"],
    powerName: "Imunidade Diplomática",
    powerDescription: "Sua reputação o precede. Uma vez por sessão, pode invocar contatos diplomáticos para obter proteção legal, acesso a locais restritos ou interromper uma situação de conflito com autoridades.",
  },
  {
    id: "explorador",
    name: "Explorador",
    description: "Arqueólogo, espeleólogo, montanhista ou simplesmente um aventureiro — você passou anos explorando lugares onde a maioria das pessoas nunca ousa entrar. Ruínas, cavernas e florestas fechadas são seu território.",
    grantedSkills: ["Sobrevivência", "Atletismo"],
    powerName: "Sentido de Explorador",
    powerDescription: "Nunca fica perdido em ambientes naturais ou estruturas abandonadas. Além disso, uma vez por cena, pode detectar automaticamente armadilhas ou passagens ocultas ao examinar um ambiente.",
  },
  {
    id: "experimento",
    name: "Experimento",
    description: "Você não escolheu esse caminho — foi escolhido. Sujeito de experimentos científicos (legais ou não), seu corpo e mente carregam marcas de procedimentos que a maioria das pessoas nem sabe que existem. O que fizeram com você ainda está para ser completamente descoberto.",
    grantedSkills: ["Fortitude"],
    chooseSkillFrom: ["Ciências", "Medicina", "Percepção"],
    powerName: "Modificação Experimental",
    powerDescription: "Escolha um benefício físico resultante dos experimentos: visão no escuro até 9m, resistência a venenos e doenças (vantagem nos testes), ou velocidade aumentada em +3m. Este benefício é permanente.",
  },
  {
    id: "fanatico-criaturas",
    name: "Fanático por Criaturas",
    description: "Criptozoólogo amador, estudioso de folclore ou simplesmente obcecado com criaturas extraordinárias — você passou anos catalogando relatos, avistamentos e evidências de seres que a ciência oficial ignora. Agora sabe que estava certo.",
    grantedSkills: ["Ocultismo"],
    chooseSkillFrom: ["Ciências", "Investigação", "Sobrevivência"],
    powerName: "Bestiário Mental",
    powerDescription: "Uma vez por cena, ao encontrar uma criatura paranormal, pode fazer um teste de Ocultismo (dificuldade 12) para identificar automaticamente suas vulnerabilidades, resistências e comportamentos.",
  },
  {
    id: "fotografo",
    name: "Fotógrafo",
    description: "Seu olho treinado capta o que outros ignoram. Fotógrafo de guerra, jornalista visual ou artista independente — sua câmera já te levou a lugares perigosos e revelou verdades que muitos prefeririam manter ocultas.",
    grantedSkills: ["Percepção"],
    chooseSkillFrom: ["Artes", "Furtividade", "Investigação"],
    powerName: "Olho Clínico",
    powerDescription: "Ao fotografar ou examinar detalhadamente um local ou objeto, pode fazer perguntas específicas ao Narrador sobre detalhes que outros passariam despercebido. Uma vez por cena, esta ação é automática sem teste.",
  },
  {
    id: "inventor",
    name: "Inventor Paranormal",
    description: "Engenheiro, maker ou cientista louco — você cria soluções onde outros veem apenas problemas. Sua mente inventiva começou a incorporar o paranormal como variável em seus projetos, com resultados surpreendentes e nem sempre seguros.",
    grantedSkills: ["Ciências", "Tecnologia"],
    powerName: "Improviso Técnico",
    powerDescription: "Uma vez por sessão, pode criar um dispositivo improvisado com materiais à mão em até 10 minutos. O dispositivo resolve um problema específico definido no momento da criação, mas é de uso único.",
  },
  {
    id: "jovem",
    name: "Jovem",
    description: "Recém-saído da adolescência, você ainda está descobrindo quem é — mas o paranormal não esperou por isso. Sua mente aberta e sem preconceitos permite que você aceite o impossível mais rapidamente do que a maioria dos adultos.",
    grantedSkills: [],
    chooseSkillFrom: ["Atletismo", "Artes", "Tecnologia", "Investigação"],
    powerName: "Mente Aberta",
    powerDescription: "Você tem vantagem em testes de Sanidade para aceitar fenômenos paranormais pela primeira vez. Além disso, aprende habilidades novas mais facilmente — o custo de PE para usar habilidades de outras classes é reduzido em 1.",
  },
  {
    id: "legista",
    name: "Legista",
    description: "Médico forense, perito criminal ou patologista — você convive com a morte diariamente e aprendeu a ler histórias nos corpos. Sua objetividade clínica diante do horrível é uma armadura psicológica que poucos possuem.",
    grantedSkills: ["Medicina", "Ciências"],
    powerName: "Indiferença Clínica",
    powerDescription: "Você tem vantagem em testes de Sanidade contra cenas de violência e morte. Além disso, ao examinar um cadáver, pode determinar automaticamente a causa da morte e o tempo aproximado de óbito.",
  },
  {
    id: "espirito",
    name: "Espírito",
    description: "Você morreu — ou pelo menos deveria ter morrido. Algo o prendeu a este plano: um objetivo inacabado, uma ligação poderosa, ou simplesmente a recusa em partir. Você existe entre os dois mundos, com um pé no Outro Lado.",
    grantedSkills: ["Ocultismo"],
    chooseSkillFrom: ["Furtividade", "Intuição", "Percepção"],
    powerName: "Entre Mundos",
    powerDescription: "Uma vez por sessão, pode tornar-se brevemente intangível (1 rodada), passando por paredes ou evitando um ataque físico. Além disso, pode ver e comunicar-se com espíritos que não estejam manifestados.",
  },
]

export const ORDEM_PARANORMAL_BOOKS: OPBook[] = [
  {
    id: "livro-basico",
    name: "Livro de Regras",
    coverImage: "/books/op-livro-basico-v2.png",
    origins: LIVRO_BASICO_ORIGINS,
  },
  {
    id: "sobrevivendo-ao-horror",
    name: "Sobrevivendo ao Horror",
    coverImage: "/books/op-sobrevivendo-horror.png",
    origins: SOBREVIVENDO_HORROR_ORIGINS,
  },
]

export const ORDEM_PARANORMAL_ORIGINS: OPOrigin[] = ORDEM_PARANORMAL_BOOKS.flatMap((b) => b.origins)

// ─── Classes ─────────────────────────────────────────────────────────────────

export type OPClass = {
  id: string
  name: string
  description: string
  role: string
}

export const ORDEM_PARANORMAL_CLASSES_DATA: OPClass[] = [
  {
    id: "combatente",
    name: "Combatente",
    role: "Dano & Resistência",
    description: "Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente. É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.\n\nDo mercenário especialista em armas de fogo até o perito em espadas, combatentes apresentam uma gama enorme de habilidades e técnicas especiais que aprimoram sua eficiência no campo de batalha, tornando-os membros essenciais em qualquer missão de extermínio.\n\nAlém de treinar seu corpo, o combatente também é perito em liderar seus aliados em batalha e cuidar do seu equipamento de combate, sempre preparado para assumir a linha de frente quando a coisa fica feia.",
  },
  {
    id: "especialista",
    name: "Especialista",
    role: "Versatilidade & Suporte",
    description: "Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.\n\nCientistas, inventores, pesquisadores e técnicos de vários tipos são exemplos de especialistas, que são tão variados quanto as áreas do conhecimento e da tecnologia. Alguns ainda preferem estudar engenharia social e se tornam excelentes espiões infiltrados, ou mesmo estudam técnicas especiais de combate como artes marciais e tiro a distância, aliando conhecimento técnico e habilidade.\n\nO que une todos os especialistas é sua incrível capacidade de aprender e improvisar.",
  },
  {
    id: "ocultista",
    name: "Ocultista",
    role: "Magia & Rituais",
    description: "O Outro Lado é misterioso, perigoso e, de certa forma, cativante. Muitos estudiosos das entidades se perdem em seus reinos obscuros em busca de poder, mas existem aqueles que visam compreender e dominar os mistérios paranormais para usá-los para combater o próprio Outro Lado.\n\nEsse tipo de agente não é apenas um conhecedor do oculto, como também possui talento para se conectar com elementos paranormais.\n\nAo contrário da crença popular, ocultistas não são intrinsecamente malignos. Seria como dizer que o cientista que inventou a pólvora é culpado pelo assassino que disparou o revólver. Para a Ordem, o Paranormal é uma força que pode ser usada para os mais diversos propósitos, de acordo com a intenção de seu usuário.",
  },
]

export const SYSTEM_LABELS: Record<string, string> = {
  "ordem-paranormal": "Ordem Paranormal",
  "dnd5e": "D&D 5e",
}

export const SYSTEMS = Object.entries(SYSTEM_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export type OrdemParanormalData = {
  playerName: string
  age: string
  origin: string
  nex: string
  class: string
  subclass: string
  // Trilhas
  hp: string
  hpMax: string
  sanity: string
  sanityMax: string
  pe: string
  peMax: string
  // Atributos
  str: string
  dex: string
  int: string
  pres: string
  vig: string
  // Perícias (booleanos como string "true"/"false")
  skills: string // JSON das perícias marcadas
  // Rituais
  rituals: string
  // Inventário
  inventory: string
  // Notas
  notes: string
}

export type DnD5eData = {
  playerName: string
  race: string
  class: string
  subclass: string
  level: string
  background: string
  alignment: string
  xp: string
  // Atributos
  str: string
  dex: string
  con: string
  int: string
  wis: string
  cha: string
  // Combate
  ac: string
  initiative: string
  speed: string
  hpMax: string
  hp: string
  hpTemp: string
  // Proficiency bonus (derived)
  profBonus: string
  // Saving throws (lista de proficiências)
  savingThrows: string
  // Perícias com proficiência
  proficiencies: string
  // Magias
  spells: string
  spellSlots: string
  // Inventário
  inventory: string
  // Notas
  notes: string
  // Features
  features: string
}

export const ORDEM_PARANORMAL_SKILLS = [
  "Acrobacia",
  "Adestramento",
  "Artes",
  "Atletismo",
  "Atualidades",
  "Ciências",
  "Crime",
  "Diplomacia",
  "Enganação",
  "Fortitude",
  "Furtividade",
  "Iniciativa",
  "Intimidação",
  "Intuição",
  "Investigação",
  "Luta",
  "Medicina",
  "Ocultismo",
  "Percepção",
  "Persuasão",
  "Pilotagem",
  "Pontaria",
  "Reflexos",
  "Religião",
  "Sobrevivência",
  "Tática",
  "Tecnologia",
  "Vontade",
]

export const ORDEM_PARANORMAL_CLASSES = [
  "Combatente",
  "Especialista",
  "Ocultista",
]

export const DND5E_CLASSES = [
  "Bárbaro",
  "Bardo",
  "Bruxo",
  "Clérigo",
  "Druida",
  "Feiticeiro",
  "Guerreiro",
  "Ladino",
  "Mago",
  "Moine",
  "Paladino",
  "Patrulheiro",
]

export function defaultOrdemParanormalData(): OrdemParanormalData {
  return {
    playerName: "",
    age: "",
    origin: "",
    nex: "5",
    class: "",
    subclass: "",
    hp: "10",
    hpMax: "10",
    sanity: "10",
    sanityMax: "10",
    pe: "4",
    peMax: "4",
    str: "1",
    dex: "1",
    int: "1",
    pres: "1",
    vig: "1",
    skills: JSON.stringify({}),
    rituals: "",
    inventory: "",
    notes: "",
  }
}

export function defaultDnD5eData(): DnD5eData {
  return {
    playerName: "",
    race: "",
    class: "",
    subclass: "",
    level: "1",
    background: "",
    alignment: "",
    xp: "0",
    str: "10",
    dex: "10",
    con: "10",
    int: "10",
    wis: "10",
    cha: "10",
    ac: "10",
    initiative: "0",
    speed: "9",
    hpMax: "8",
    hp: "8",
    hpTemp: "0",
    profBonus: "2",
    savingThrows: JSON.stringify([]),
    proficiencies: JSON.stringify([]),
    spells: "",
    spellSlots: JSON.stringify({}),
    inventory: "",
    notes: "",
    features: "",
  }
}

// ─── Shop / Mercado ──────────────────────────────────────────────────────────

export type ShopItemCategory =
  | "arma-simples"
  | "arma-fogo"
  | "protecao"
  | "equipamento"
  | "veiculo"

export type ShopItem = {
  id: string
  name: string
  category: ShopItemCategory
  price: number       // em $ (moeda do universo OP)
  weight: number      // em kg
  description: string
  icon?: string       // "autor/nome" do game-icons.net
  // Armas
  damage?: string
  damageType?: string
  range?: string
  properties?: string[]
  // Proteção
  defense?: number
  penalty?: number    // penalidade em agilidade
}

export function gameIconUrl(icon: string, color = "ffffff") {
  return `https://game-icons.net/icons/${color}/transparent/1x1/${icon}.svg`
}

export type ShopConfig = {
  disabled: string[]                            // IDs de itens desativados pelo mestre
  overrides: Record<string, { price?: number }> // sobrescritas de preço
}

export const CATEGORY_LABELS: Record<ShopItemCategory, string> = {
  "arma-simples": "Armas Simples",
  "arma-fogo":    "Armas de Fogo",
  "protecao":     "Proteção",
  "equipamento":  "Equipamento",
  "veiculo":      "Veículos",
}

export const ORDEM_PARANORMAL_ITEMS: ShopItem[] = [
  // ── Armas Simples ──────────────────────────────────────────────────────────
  {
    id: "op-faca-combate",
    name: "Faca de Combate",
    category: "arma-simples",
    icon: "skoll/bowie-knife",
    price: 50,
    weight: 0.5,
    description: "Faca robusta projetada para combate próximo. Lâmina resistente com cabo ergonômico.",
    damage: "1d4",
    damageType: "cortante",
    range: "1,5m",
    properties: ["leve", "arremessável"],
  },
  {
    id: "op-machadinha",
    name: "Machadinha",
    category: "arma-simples",
    icon: "delapouite/hatchet",
    price: 50,
    weight: 1,
    description: "Pequeno machado de uso geral, eficaz tanto como ferramenta quanto como arma.",
    damage: "1d6",
    damageType: "cortante",
    range: "1,5m",
    properties: ["leve", "arremessável"],
  },
  {
    id: "op-porrete",
    name: "Porrete",
    category: "arma-simples",
    icon: "lorc/wood-axe",
    price: 30,
    weight: 1.5,
    description: "Bastão pesado de madeira ou borracha. Simples e eficaz para atordoar.",
    damage: "1d6",
    damageType: "concussão",
    range: "1,5m",
    properties: [],
  },
  {
    id: "op-bastao-policial",
    name: "Bastão Policial",
    category: "arma-simples",
    icon: "delapouite/truncheon",
    price: 50,
    weight: 0.5,
    description: "Cassetete retrátil de aço ou polímero, padrão policial.",
    damage: "1d6",
    damageType: "concussão",
    range: "1,5m",
    properties: ["leve"],
  },
  {
    id: "op-faca-utilitaria",
    name: "Faca Utilitária",
    category: "arma-simples",
    icon: "delapouite/swiss-army-knife",
    price: 20,
    weight: 0.3,
    description: "Faca multiuso de bolso. Não foi feita para combate, mas serve em apuro.",
    damage: "1d4",
    damageType: "cortante",
    range: "1,5m",
    properties: ["leve", "improvisada"],
  },
  {
    id: "op-corrente",
    name: "Corrente",
    category: "arma-simples",
    icon: "lorc/chain-lightning",
    price: 30,
    weight: 2,
    description: "Corrente de metal pesada. Pode ser usada como arma improvisada à distância curta.",
    damage: "1d6",
    damageType: "concussão",
    range: "1,5m",
    properties: ["alcance", "improvisada"],
  },
  // ── Armas de Fogo ──────────────────────────────────────────────────────────
  {
    id: "op-pistola",
    name: "Pistola Semiautomática",
    category: "arma-fogo",
    icon: "john-colburn/pistol-gun",
    price: 500,
    weight: 0.9,
    description: "Pistola de médio calibre, padrão para agentes de campo. Confiável e fácil de portar.",
    damage: "2d6",
    damageType: "balístico",
    range: "9m / 36m",
    properties: ["munição (15)", "recarga"],
  },
  {
    id: "op-revolver",
    name: "Revólver",
    category: "arma-fogo",
    icon: "skoll/revolver",
    price: 300,
    weight: 0.9,
    description: "Clássico revólver de seis tiros. Menos capacidade, mas extremamente confiável.",
    damage: "2d6",
    damageType: "balístico",
    range: "9m / 36m",
    properties: ["munição (6)", "recarga"],
  },
  {
    id: "op-espingarda",
    name: "Espingarda",
    category: "arma-fogo",
    icon: "skoll/winchester-rifle",
    price: 700,
    weight: 3,
    description: "Arma de cano longo com grande poder de parada a curta distância.",
    damage: "4d6",
    damageType: "balístico",
    range: "9m / 18m",
    properties: ["munição (5)", "recarga", "duas mãos", "dispersão"],
  },
  {
    id: "op-rifle-caca",
    name: "Rifle de Caça",
    category: "arma-fogo",
    icon: "skoll/winchester-rifle",
    price: 600,
    weight: 3,
    description: "Rifle de precisão para caça. Excelente alcance e poder de parada.",
    damage: "2d8",
    damageType: "balístico",
    range: "30m / 120m",
    properties: ["munição (5)", "recarga", "duas mãos", "pesada"],
  },
  {
    id: "op-submetralhadora",
    name: "Submetralhadora",
    category: "arma-fogo",
    icon: "delapouite/uzi",
    price: 1500,
    weight: 3,
    description: "Arma automática compacta. Alta cadência de fogo, ideal para combate próximo.",
    damage: "2d6",
    damageType: "balístico",
    range: "9m / 36m",
    properties: ["munição (30)", "recarga", "automática"],
  },
  {
    id: "op-rifle-assalto",
    name: "Rifle de Assalto",
    category: "arma-fogo",
    icon: "skoll/ak47",
    price: 2000,
    weight: 3.5,
    description: "Fuzil militar de uso geral. Versátil e letal em diversas distâncias.",
    damage: "2d8",
    damageType: "balístico",
    range: "30m / 90m",
    properties: ["munição (30)", "recarga", "duas mãos", "automática"],
  },
  {
    id: "op-escopeta-tatica",
    name: "Escopeta Tática",
    category: "arma-fogo",
    icon: "delapouite/sawed-off-shotgun",
    price: 900,
    weight: 3.5,
    description: "Versão curta e tática da espingarda, mais manobável em espaços fechados.",
    damage: "3d6",
    damageType: "balístico",
    range: "6m / 15m",
    properties: ["munição (8)", "recarga", "duas mãos", "dispersão"],
  },
  // ── Proteção ───────────────────────────────────────────────────────────────
  {
    id: "op-jaqueta-couro",
    name: "Jaqueta de Couro",
    category: "protecao",
    icon: "delapouite/leather-armor",
    price: 100,
    weight: 2,
    description: "Jaqueta de couro resistente. Oferece proteção mínima sem chamar atenção.",
    defense: 2,
    penalty: 0,
  },
  {
    id: "op-colete-kevlar",
    name: "Colete de Kevlar",
    category: "protecao",
    icon: "sbed/kevlar",
    price: 600,
    weight: 4,
    description: "Colete à prova de balas de uso civil. Bom equilíbrio entre proteção e mobilidade.",
    defense: 4,
    penalty: 0,
  },
  {
    id: "op-colete-tatico",
    name: "Colete Tático",
    category: "protecao",
    icon: "skoll/kevlar-vest",
    price: 1200,
    weight: 10,
    description: "Colete balístico reforçado com placas de aço. Alta proteção, mobilidade reduzida.",
    defense: 6,
    penalty: -2,
  },
  {
    id: "op-capacete",
    name: "Capacete Tático",
    category: "protecao",
    icon: "lorc/barbute",
    price: 400,
    weight: 1.5,
    description: "Capacete balístico de uso militar ou policial. Protege a cabeça de impactos.",
    defense: 2,
    penalty: 0,
  },
  // ── Equipamentos ───────────────────────────────────────────────────────────
  {
    id: "op-kit-saude",
    name: "Kit de Primeiros Socorros",
    category: "equipamento",
    icon: "delapouite/health-normal",
    price: 100,
    weight: 1,
    description: "Kit completo com curativos, antissépticos e bandagens. Recupera PV em campo.",
  },
  {
    id: "op-kit-investigacao",
    name: "Kit de Investigação",
    category: "equipamento",
    icon: "delapouite/magnifying-glass",
    price: 100,
    weight: 1,
    description: "Luvas, sacos plásticos, pinças e pós para coleta de evidências.",
  },
  {
    id: "op-kit-sobrevivencia",
    name: "Kit de Sobrevivência",
    category: "equipamento",
    icon: "lorc/camping-tent",
    price: 250,
    weight: 2,
    description: "Faca, isqueiro, filtro de água, cobertor térmico e sinalizador. Essencial em campo.",
  },
  {
    id: "op-algemas",
    name: "Algemas",
    category: "equipamento",
    icon: "delapouite/handcuffs",
    price: 50,
    weight: 0.5,
    description: "Algemas de metal resistente. Imobiliza um alvo com restrição de Força CD 20 para escapar.",
  },
  {
    id: "op-lanterna",
    name: "Lanterna Tática",
    category: "equipamento",
    icon: "delapouite/flashlight",
    price: 30,
    weight: 0.5,
    description: "Lanterna LED de alta potência. Ilumina até 20 metros.",
  },
  {
    id: "op-binoculo",
    name: "Binóculo",
    category: "equipamento",
    icon: "delapouite/binoculars",
    price: 150,
    weight: 0.5,
    description: "Binóculo 10x42 para observação a distância. +2 em testes de Percepção à longa distância.",
  },
  {
    id: "op-camera",
    name: "Câmera Fotográfica",
    category: "equipamento",
    icon: "delapouite/photo-camera",
    price: 500,
    weight: 0.8,
    description: "Câmera DSLR com lente zoom. Essencial para documentar evidências paranormais.",
  },
  {
    id: "op-tablet",
    name: "Tablet",
    category: "equipamento",
    icon: "skoll/tablet",
    price: 1000,
    weight: 0.5,
    description: "Dispositivo com acesso à internet e diversas ferramentas de pesquisa e comunicação.",
  },
  {
    id: "op-radio",
    name: "Rádio Comunicador (par)",
    category: "equipamento",
    icon: "delapouite/walkie-talkie",
    price: 100,
    weight: 0.4,
    description: "Par de rádios com alcance de 5km. Comunicação criptografada.",
  },
  {
    id: "op-corda",
    name: "Corda (20m)",
    category: "equipamento",
    icon: "delapouite/rope-coil",
    price: 50,
    weight: 2,
    description: "Corda de nylon resistente capaz de suportar até 200kg.",
  },
  {
    id: "op-mochila-tatica",
    name: "Mochila Tática",
    category: "equipamento",
    icon: "delapouite/army-field-manual",
    price: 100,
    weight: 1,
    description: "Mochila de carga com compartimentos organizados. +2 slots de inventário.",
  },
  {
    id: "op-gravador",
    name: "Gravador de Voz",
    category: "equipamento",
    icon: "delapouite/old-microphone",
    price: 80,
    weight: 0.1,
    description: "Gravador digital compacto. Capta sons inaudíveis ao ouvido humano com sensibilidade alta.",
  },
  {
    id: "op-visao-noturna",
    name: "Óculos de Visão Noturna",
    category: "equipamento",
    icon: "delapouite/night-vision",
    price: 2000,
    weight: 0.6,
    description: "Equipamento militar de intensificação de luz. Elimina penalidades por escuridão.",
  },
  {
    id: "op-detector-emf",
    name: "Detector de EMF",
    category: "equipamento",
    icon: "delapouite/radar-sweep",
    price: 300,
    weight: 0.3,
    description: "Medidor de campo eletromagnético. Detecta atividade paranormal em um raio de 3 metros.",
  },
  {
    id: "op-kit-arrombamento",
    name: "Kit de Arrombamento",
    category: "equipamento",
    icon: "delapouite/lockpicks",
    price: 150,
    weight: 0.5,
    description: "Ferramentas para abrir fechaduras. +2 em testes de Crime para arrombar.",
  },
  // ── Veículos ───────────────────────────────────────────────────────────────
  {
    id: "op-moto",
    name: "Motocicleta",
    category: "veiculo",
    icon: "delapouite/full-motorcycle-helmet",
    price: 8000,
    weight: 0,
    description: "Moto de médio porte. Ágil em tráfego urbano, ideal para fuga e perseguição.",
  },
  {
    id: "op-carro-comum",
    name: "Carro Comum",
    category: "veiculo",
    icon: "delapouite/city-car",
    price: 15000,
    weight: 0,
    description: "Automóvel de passeio. Comporta 4 passageiros e oferece cobertura durante combate.",
  },
  {
    id: "op-van-tatica",
    name: "Van Tática",
    category: "veiculo",
    icon: "delapouite/surfer-van",
    price: 30000,
    weight: 0,
    description: "Van com compartimento traseiro adaptado. Comporta o grupo inteiro e equipamentos pesados.",
  },
]
