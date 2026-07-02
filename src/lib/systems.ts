// ─── Origens ────────────────────────────────────────────────────────────────

export type OPOrigin = {
  id: string
  name: string
  description: string
  grantedSkills: string[]
  chooseSkillFrom?: string[]
  powerName: string
  powerDescription: string
  patrimonio: number
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
    description: "Você era um pesquisador ou professor universitário. De forma proposital ou não, seus estudos tocaram em assuntos misteriosos e chamaram a atenção da Ordo Realitas.",
    grantedSkills: ["Ciências", "Investigação"],
    powerName: "Saber é Poder",
    powerDescription: "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "agente-saude",
    name: "Agente de Saúde",
    description: "Você era um profissional da saúde como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. Pode ter sido surpreendido por um evento paranormal durante o trabalho ou ter cuidado de um agente da Ordem em uma emergência.",
    grantedSkills: ["Intuição", "Medicina"],
    powerName: "Técnica Medicinal",
    powerDescription: "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.",
    patrimonio: 500,
  },
  {
    id: "amnesico",
    name: "Amnésico",
    description: "Você perdeu a maior parte da memória. Sabe apenas o próprio nome, ou nem isso. Sua amnésia pode ser resultado de um trauma paranormal ou de um ritual. Talvez você tenha sido vítima de cultistas, ou talvez tenha sido um cultista. Hoje a Ordem é a única família que conhece.",
    grantedSkills: [],
    chooseSkillFrom: ["(duas à escolha do mestre)"],
    powerName: "Vislumbres do Passado",
    powerDescription: "Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil.",
    patrimonio: 500,
  },
  {
    id: "artista",
    name: "Artista",
    description: "Você era um ator, músico, escritor, dançarino, influenciador... Seu trabalho pode ter sido inspirado por uma experiência paranormal do passado, e o que o público acha que é pura criatividade, a Ordem sabe que tem um lado mais sombrio.",
    grantedSkills: ["Artes", "Enganação"],
    powerName: "Magnum Opus",
    powerDescription: "Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem envolvido em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquele personagem. A critério do mestre, pode receber esses bônus em outras situações nas quais seria reconhecido.",
    patrimonio: 500,
  },
  {
    id: "atleta",
    name: "Atleta",
    description: "Você competia em um esporte individual ou por equipe, como natação ou futebol. Seu alto desempenho pode ser fruto de alguma influência paranormal que nem mesmo você conhecia, ou você pode ter se envolvido em algum evento paranormal em uma de suas competições.",
    grantedSkills: ["Acrobacia", "Atletismo"],
    powerName: "110%",
    powerDescription: "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria), você pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "chef",
    name: "Chef",
    description: "Você é um cozinheiro amador ou profissional. Talvez trabalhasse em um restaurante, talvez simplesmente gostasse de cozinhar para a família e amigos. Os outros agentes adoram quando você vai para a missão!",
    grantedSkills: ["Fortitude", "Profissão (cozinheiro)"],
    powerName: "Ingrediente Secreto",
    powerDescription: "Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você e todos os membros do grupo que fizerem a ação alimentar-se recebem o benefício de dois pratos (caso o mesmo benefício seja escolhido duas vezes, seus efeitos se acumulam).",
    patrimonio: 500,
  },
  {
    id: "criminoso",
    name: "Criminoso",
    description: "Você vivia uma vida fora da lei, seja como mero batedor de carteiras, seja como membro de uma facção criminosa. Em algum momento, se envolveu em um assunto da Ordem — talvez tenha roubado um item amaldiçoado. A organização achou melhor recrutar seus talentos do que ter você como um estorvo.",
    grantedSkills: ["Crime", "Furtividade"],
    powerName: "O Crime Compensa",
    powerDescription: "No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.",
    patrimonio: 500,
  },
  {
    id: "cultista-arrependido",
    name: "Cultista Arrependido",
    description: "Você fez parte de um culto paranormal. Talvez fossem ignorantes iludidos, ou talvez soubessem exatamente o que estavam fazendo. Seja como for, algo abriu seus olhos e agora você luta pelo lado certo — embora carregue para sempre traços de sua vida pregressa. Outros membros da Ordem podem desconfiar de sua conversão.",
    grantedSkills: ["Ocultismo", "Religião"],
    powerName: "Traços do Outro Lado",
    powerDescription: "Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.",
    patrimonio: 500,
  },
  {
    id: "desgarrado",
    name: "Desgarrado",
    description: "Você não vivia de acordo com as normas da sociedade. Podia ser um eremita, uma pessoa em situação de rua ou simplesmente alguém que descobriu o paranormal e abandonou sua rotina. A vida sem os confortos modernos o deixou mais forte.",
    grantedSkills: ["Fortitude", "Sobrevivência"],
    powerName: "Calejado",
    powerDescription: "Você recebe +1 PV para cada 5% de NEX.",
    patrimonio: 500,
  },
  {
    id: "engenheiro",
    name: "Engenheiro",
    description: "Enquanto os acadêmicos estão preocupados com teorias, você coloca a mão na massa, seja como engenheiro profissional, seja como inventor de garagem. Provavelmente você criou algum dispositivo paranormal que chamou a atenção da Ordem.",
    grantedSkills: ["Profissão", "Tecnologia"],
    powerName: "Ferramentas Favoritas",
    powerDescription: "Um item à sua escolha (exceto armas) conta como uma categoria abaixo do normal para você (por exemplo, um item de categoria II conta como categoria I).",
    patrimonio: 500,
  },
  {
    id: "executivo",
    name: "Executivo",
    description: "Você possuía um trabalho de escritório em uma grande empresa, banco ou corporação. Era um administrador, advogado, contador ou de qualquer outra profissão que lida com papelada e burocracia. Sua vida era bastante normal, até que você descobriu algo que não devia — talvez o sucesso da empresa residisse em um ritual, ou toda a corporação fosse fachada para um culto.",
    grantedSkills: ["Diplomacia", "Profissão"],
    powerName: "Processo Otimizado",
    powerDescription: "Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos (físicos ou digitais), pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "investigador",
    name: "Investigador",
    description: "Você era um investigador do governo, como um perito forense ou policial federal, ou privado, como um detetive particular. Pode ter tido contato com o paranormal em algum caso ou ter sido recrutado pela Ordem por suas habilidades de resolução de mistérios.",
    grantedSkills: ["Investigação", "Percepção"],
    powerName: "Faro para Pistas",
    powerDescription: "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "lutador",
    name: "Lutador",
    description: "Você pratica uma arte marcial ou esporte de luta, ou cresceu em um bairro perigoso onde aprendeu briga de rua. Já quebrou muitos ossos, tanto seus quanto dos outros. Pode ter conhecido a Ordem após um torneio secreto envolvendo entidades do Outro Lado.",
    grantedSkills: ["Luta", "Reflexos"],
    powerName: "Mão Pesada",
    powerDescription: "Você recebe +2 em rolagens de dano com ataques corpo a corpo.",
    patrimonio: 500,
  },
  {
    id: "magnata",
    name: "Magnata",
    description: "Você possui muito dinheiro ou patrimônio. Pode ser o herdeiro de uma família antiga ligada ao oculto, ter criado e vendido uma empresa, ou ter ganhado uma loteria após inadvertidamente escolher números amaldiçoados que formavam um ritual.",
    grantedSkills: ["Diplomacia", "Pilotagem"],
    powerName: "Patrocinador da Ordem",
    powerDescription: "Seu limite de crédito é sempre considerado um patamar acima do atual.",
    patrimonio: 1000,
  },
  {
    id: "mercenario",
    name: "Mercenário",
    description: "Você é um soldado de aluguel, que trabalha sozinho ou como parte de alguma organização que vende serviços militares. Escoltas e assassinatos fizeram parte de sua rotina por tempo suficiente para você se envolver em alguma situação com o paranormal.",
    grantedSkills: ["Iniciativa", "Intimidação"],
    powerName: "Posição de Combate",
    powerDescription: "No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.",
    patrimonio: 500,
  },
  {
    id: "militar",
    name: "Militar",
    description: "Você serviu em uma força militar, como o exército ou a marinha. Passou muito tempo treinando com armas de fogo, até se tornar um perito no uso delas. Acostumado a obedecer ordens e partir em missões, está em casa na Ordo Realitas.",
    grantedSkills: ["Pontaria", "Tática"],
    powerName: "Para Bellum",
    powerDescription: "Você recebe +2 em rolagens de dano com armas de fogo.",
    patrimonio: 500,
  },
  {
    id: "operario",
    name: "Operário",
    description: "Pedreiro, industriário, operador de máquinas em uma fábrica... Você passou uma parte de sua vida em um emprego braçal, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo. Sua rotina mundana foi confrontada de alguma forma pelo paranormal.",
    grantedSkills: ["Fortitude", "Profissão"],
    powerName: "Ferramenta de Trabalho",
    powerDescription: "Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.",
    patrimonio: 500,
  },
  {
    id: "policial",
    name: "Policial",
    description: "Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.",
    grantedSkills: ["Percepção", "Pontaria"],
    powerName: "Patrulha",
    powerDescription: "Você recebe +2 em Defesa.",
    patrimonio: 500,
  },
  {
    id: "religioso",
    name: "Religioso",
    description: "Você é devoto ou sacerdote de uma fé. Independentemente da religião que pratica, se dedica a auxiliar as pessoas com problemas espirituais. A partir disso, teve contato com o paranormal e foi convocado pela Ordem.",
    grantedSkills: ["Religião", "Vontade"],
    powerName: "Acalentar",
    powerDescription: "Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença.",
    patrimonio: 500,
  },
  {
    id: "servidor-publico",
    name: "Servidor Público",
    description: "Você possuía carreira em um órgão do governo, lidando com burocracia e atendendo pessoas. Sua rotina foi quebrada quando você viu que o prefeito era um cultista ou que a câmara de vereadores se reunia à noite para realizar rituais.",
    grantedSkills: ["Intuição", "Vontade"],
    powerName: "Espírito Cívico",
    powerDescription: "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.",
    patrimonio: 500,
  },
  {
    id: "teorico-conspiracao",
    name: "Teórico da Conspiração",
    description: "A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana... e secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo. Quando sua pesquisa esbarrou no paranormal, você foi recrutado. Na Ordem, sua determinação será usada para um bom propósito.",
    grantedSkills: ["Investigação", "Ocultismo"],
    powerName: "Eu Já Sabia",
    powerDescription: "Você não se abala com entidades ou anomalias. Afinal, sempre soube que isso tudo existia. Você recebe resistência a dano mental igual ao seu Intelecto.",
    patrimonio: 500,
  },
  {
    id: "ti",
    name: "T.I.",
    description: "Programador, engenheiro de software ou simplesmente \"o cara da T.I.\", você tem treinamento e experiência para lidar com sistemas informatizados. Seu talento ou curiosidade exagerada chamou a atenção da Ordem.",
    grantedSkills: ["Investigação", "Tecnologia"],
    powerName: "Motor de Busca",
    powerDescription: "A critério do mestre, sempre que tiver acesso à internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.",
    patrimonio: 500,
  },
  {
    id: "trabalhador-rural",
    name: "Trabalhador Rural",
    description: "Você trabalhava no campo ou em áreas isoladas, como fazendeiro, pescador, biólogo, veterinário... Se acostumou com o convívio com a natureza e os animais e talvez tenha ouvido uma ou outra história de fantasmas ao redor da fogueira. Em algum momento, descobriu que muitas dessas histórias são verdadeiras.",
    grantedSkills: ["Adestramento", "Sobrevivência"],
    powerName: "Desbravador",
    powerDescription: "Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.",
    patrimonio: 500,
  },
  {
    id: "trambiqueiro",
    name: "Trambiqueiro",
    description: "Uma vida digna exige muito trabalho, então é melhor nem tentar. Você vivia de pequenos golpes, jogatina ilegal e falcatruas. Certo dia, enganou a pessoa errada; no dia seguinte, se viu servindo à Ordem. Pelo menos agora tem a chance de usar sua lábia para o bem.",
    grantedSkills: ["Crime", "Enganação"],
    powerName: "Impostor",
    powerDescription: "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.",
    patrimonio: 500,
  },
  {
    id: "universitario",
    name: "Universitário",
    description: "Você era aluno de uma faculdade. Em sua rotina de estudos, provas e festas, acabou descobrindo algo — talvez um livro amaldiçoado na antiga biblioteca do campus. Por seu achado, foi convocado pela Ordem. Agora, estuda com mais afinco: nesse novo curso, ouviu dizer que as provas podem ser mortais.",
    grantedSkills: ["Atualidades", "Investigação"],
    powerName: "Dedicação",
    powerDescription: "Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1 (em NEX 5% seu limite é 2, em NEX 10% é 3, e assim por diante — isso não afeta a DT de seus efeitos).",
    patrimonio: 500,
  },
  {
    id: "vitima",
    name: "Vítima",
    description: "Em algum momento de sua vida — infância, juventude ou início da vida adulta — você encontrou o paranormal... e a experiência não foi nada boa. Você viu os espíritos dos mortos, foi atacado por uma entidade ou mesmo foi sequestrado para ser sacrificado em um ritual impedido no último momento. A experiência foi traumática, mas você não se abateu; em vez disso, decidiu lutar para impedir que outros inocentes passem pelo mesmo.",
    grantedSkills: ["Reflexos", "Vontade"],
    powerName: "Cicatrizes Psicológicas",
    powerDescription: "Você recebe +1 de Sanidade para cada 5% de NEX.",
    patrimonio: 500,
  },
]

const SOBREVIVENDO_HORROR_ORIGINS: OPOrigin[] = [
  {
    id: "amigo-animais",
    name: "Amigo dos Animais",
    description: "Você desenvolveu uma conexão muito forte com outros seres: os animais. Seja por nunca ter se dado muito bem com humanos ou por preferir a companhia de um melhor amigo de quatro patas, você leva sua vida ao lado de um bichano e aprende com a natureza perceptiva deles.",
    grantedSkills: ["Adestramento", "Percepção"],
    powerName: "Companheiro Animal",
    powerDescription: "Você consegue entender as intenções e sentimentos de animais, e pode usar Adestramento para mudar a atitude deles. Além disso, você possui um melhor amigo, um animal que cresceu com você e ao qual tem profundo apego. Ele conta como um aliado que fornece +2 em uma perícia à sua escolha (aprovada pelo mestre). Quando você alcança NEX 35%, ele também passa a fornecer o bônus de um aliado de um tipo à sua escolha. Quando você alcança NEX 70%, ele fornece a habilidade do tipo de aliado escolhido. Perder seu parceiro causa perda permanente de 10 pontos de Sanidade, além de deixá-lo perturbado até o fim da cena.",
    patrimonio: 500,
  },
  {
    id: "astronauta",
    name: "Astronauta",
    description: "Como astronauta, você se acostumou à pressão de ser responsável pela vida de seus colegas e por experimentos de milhões de reais. E foi na escuridão do espaço que você descobriu que não estamos sozinhos.",
    grantedSkills: ["Ciências", "Fortitude"],
    powerName: "Acostumado ao Extremo",
    powerDescription: "Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE.",
    patrimonio: 500,
  },
  {
    id: "chef-outro-lado",
    name: "Chef do Outro Lado",
    description: "Você nunca foi muito bom na culinária convencional. Depois de sobreviver ao paranormal, entretanto, descobriu um talento considerado um grande tabu até mesmo pelos ocultistas mais experientes: cozinhar e ingerir entidades do Outro Lado.",
    grantedSkills: ["Ocultismo", "Profissão (cozinheiro)"],
    powerName: "Fome do Outro Lado",
    powerDescription: "Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. No início de cada missão, pode solicitar essas partes como itens de Categoria I (0,5 espaço cada), e pode obtê-las de criaturas derrotadas (cada criatura Pequena ou maior fornece 1 ingrediente paranormal). Pode gastar uma ação de interlúdio e 1 ingrediente para preparar um prato especial: teste de Profissão (cozinheiro) DT 15 + O (o mestre oculta o resultado até alguém comer o prato). Se passar, o prato fornece RD 10 contra o tipo de dano do elemento da criatura. Se falhar, o prato causa vulnerabilidade a esse tipo de dano. Os efeitos duram até o fim da próxima cena. A cada refeição consumida, você perde 1 ponto permanente de Sanidade.",
    patrimonio: 500,
  },
  {
    id: "colegial",
    name: "Colegial",
    description: "Você era um aluno do colegial com uma rotina baseada nos estudos, nas amizades e nos dramas típicos de alguém da sua idade, até que um encontro com o paranormal mudou sua vida. Sua verdadeira força está nos amigos que fizer pelo caminho.",
    grantedSkills: ["Atualidades", "Tecnologia"],
    powerName: "Poder da Amizade",
    powerDescription: "Escolha um personagem para ser seu melhor amigo. Se estiver em alcance médio dele e puderem trocar olhares, você recebe +2 em todos os testes de perícia. Entretanto, se ele morrer, seu total de PE é reduzido em –1 para cada 5% de NEX até o fim da missão. Se perder seu melhor amigo, pode escolher outro entre os demais personagens no início da próxima missão.",
    patrimonio: 500,
  },
  {
    id: "cosplayer",
    name: "Cosplayer",
    description: "Você é apaixonado pela arte do cosplay e dedicou sua vida a criar a melhor fantasia possível. Constantemente questionado por pessoas que confundem seus gostos com acusações ignorantes, você se acostumou a seguir em frente. Confrontado com o paranormal, colocou sua arte e resiliência a serviço da Ordem.",
    grantedSkills: ["Artes", "Vontade"],
    powerName: "Não É Fantasia, É Cosplay!",
    powerDescription: "Você pode fazer testes de disfarce usando Artes em vez de Enganação. Além disso, ao fazer um teste de perícia enquanto usa um cosplay que tem relação com ele, você recebe +2. Por exemplo, vestido de um personagem furtivo, recebe +2 em testes para ser furtivo, se equilibrar e situações similares.",
    patrimonio: 500,
  },
  {
    id: "diplomata",
    name: "Diplomata",
    description: "Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis — talvez fosse representante comercial, membro de um partido político ou embaixador do governo. Em algum momento, teve uma experiência paranormal que revelou entidades com as quais não é possível negociar.",
    grantedSkills: ["Atualidades", "Diplomacia"],
    powerName: "Conexões",
    powerDescription: "Você recebe +2 em Diplomacia. Além disso, se puder contatar um NPC capaz de lhe auxiliar, você pode gastar 10 minutos e 2 PE para substituir um teste de uma perícia relacionada ao conhecimento desse NPC, feito até o fim da cena, por um teste de Diplomacia.",
    patrimonio: 500,
  },
  {
    id: "explorador",
    name: "Explorador",
    description: "Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas. Um encontro trágico com o paranormal marcou sua jornada.",
    grantedSkills: ["Fortitude", "Sobrevivência"],
    powerName: "Manual do Sobrevivente",
    powerDescription: "Ao fazer um teste para resistir a armadilhas, clima, doenças, fome, sede, fumaça, sono, sufocamento ou veneno (incluindo de fontes paranormais), você pode gastar 2 PE para receber +5 nesse teste. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais.",
    patrimonio: 500,
  },
  {
    id: "experimento",
    name: "Experimento",
    description: "Você foi uma cobaia em um experimento físico — pode ter sido um voluntário em um procedimento experimental legítimo, ou submetido a experimentos científicos ou paranormais contra sua vontade. Causou alterações permanentes em seu corpo, como um cheiro forte de químicos, cicatrizes ou manchas estranhas.",
    grantedSkills: ["Atletismo", "Fortitude"],
    powerName: "Mutação",
    powerDescription: "Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre –O em Diplomacia.",
    patrimonio: 500,
  },
  {
    id: "fanatico-criaturas",
    name: "Fanático por Criaturas",
    description: "Você sempre foi obcecado pelo sobrenatural. Desde que pode se lembrar, a ideia de encontrar uma criatura o fascina tanto quanto o assusta. Essa faísca fez você se tornar um \"caçador de monstros\", dedicando-se a localizar as feras citadas em documentários sensacionalistas.",
    grantedSkills: ["Investigação", "Ocultismo"],
    powerName: "Conhecimento Oculto",
    powerDescription: "Você pode fazer testes de Ocultismo para identificar uma criatura a partir de informações como uma imagem, rastros, indícios de sua presença ou outras pistas que o mestre considere suficientes. Se passar, descobre as características da criatura (conforme descrito na perícia), mas não sua identidade ou tipo específico. Além disso, quando passa em um teste de Ocultismo para identificar criatura, recebe +2 em todos os testes contra aquela criatura até o fim da missão.",
    patrimonio: 500,
  },
  {
    id: "fotografo",
    name: "Fotógrafo",
    description: "Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor, buscando ângulos únicos e perspectivas singulares, você não fazia ideia de que encontraria elementos paranormais através de sua lente.",
    grantedSkills: ["Artes", "Percepção"],
    powerName: "Através da Lente",
    powerDescription: "Quando faz um teste de Investigação ou de Percepção ou para adquirir pistas olhando através de uma câmera ou analisando fotos, você pode gastar 2 PE para receber +5 nesse teste (um personagem que se move olhando através de uma lente anda à metade de seu deslocamento).",
    patrimonio: 500,
  },
  {
    id: "inventor-paranormal",
    name: "Inventor Paranormal",
    description: "A curiosidade e a criatividade fizeram de você uma pessoa que busca constantemente desafiar limites e criar soluções inovadoras, sendo mais de uma vez intitulado como um \"cientista louco\". Você teve contato com o paranormal por meio de seus experimentos ou foi procurado pela Ordem porque suas pesquisas chamaram atenção demais.",
    grantedSkills: ["Profissão (engenheiro)", "Vontade"],
    powerName: "Invenção Paranormal",
    powerDescription: "Escolha um ritual de 1º círculo. Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite executar o efeito do ritual escolhido. Para ativar o invento, gasta uma ação padrão e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão. Se passar, o item faz o equivalente a conjurar o ritual em sua forma básica sem pagar seu custo em PE. Se falhar, ele enguiça. Você pode gastar uma ação de interlúdio para fazer manutenção do invento, consertando-o e redefinindo a DT para 15. Pode trocar o ritual contido no invento no início de cada missão.",
    patrimonio: 500,
  },
  {
    id: "jovem-mistico",
    name: "Jovem Místico",
    description: "Você possui uma profunda conexão com sua espiritualidade, suas crenças ou o próprio universo. Essa conexão faz com que você veja o mundo de forma diferente e peculiar, características que o tornaram mais suscetível a um encontro com o paranormal.",
    grantedSkills: ["Ocultismo", "Religião"],
    powerName: "A Culpa é das Estrelas",
    powerDescription: "Escolha um número da sorte entre 1 e 6. No início de cada cena, você pode gastar 1 PE e rolar 1d6. Se o resultado for seu número da sorte, você recebe +2 em testes de perícia até o fim da cena. Caso contrário, na próxima vez que usar esta habilidade, escolha mais um número como número da sorte. Quando rolar um de seus números da sorte, a quantidade de números volta a 1.",
    patrimonio: 500,
  },
  {
    id: "legista-noite",
    name: "Legista do Turno da Noite",
    description: "Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria. Os sons que poderiam ter sido fruto de sua imaginação se revelaram mais do que um truque da sua própria mente.",
    grantedSkills: ["Ciências", "Medicina"],
    powerName: "Luto Habitual",
    powerDescription: "Você sofre apenas a metade do dano mental por presenciar uma cena que, a critério do mestre, esteja relacionada à rotina de um legista (como presenciar uma morte, ver um cadáver ou encontrar órgãos humanos). Além disso, quando faz um teste de Medicina para primeiros socorros ou necropsia, você pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "mateiro",
    name: "Mateiro",
    description: "Você conhece áreas rurais e selvagens. Pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.",
    grantedSkills: ["Percepção", "Sobrevivência"],
    powerName: "Mapa Celeste",
    powerDescription: "Desde que possa ver o céu, você sempre sabe as direções dos pontos cardeais e consegue chegar sem se perder em qualquer lugar que já tenha visitado ao menos uma vez. Quando faz um teste de Sobrevivência, pode gastar 2 PE para rolar o teste novamente e escolher o melhor entre os dois resultados. Além disso, em cenas de interlúdio, considera condições de sono precárias como normais.",
    patrimonio: 500,
  },
  {
    id: "mergulhador",
    name: "Mergulhador",
    description: "Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. No dia em que você olhou para o abismo, ele encarou você de volta.",
    grantedSkills: ["Atletismo", "Fortitude"],
    powerName: "Fôlego de Nadador",
    powerDescription: "Você recebe +5 PV e pode prender a respiração por um número de rodadas igual ao dobro do seu Vigor. Além disso, quando passa em um teste de Atletismo para natação, você avança seu deslocamento normal (em vez da metade).",
    patrimonio: 500,
  },
  {
    id: "motorista",
    name: "Motorista",
    description: "Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros, até o dia em que suas viagens cruzaram o caminho do Outro Lado.",
    grantedSkills: ["Pilotagem", "Reflexos"],
    powerName: "Mãos no Volante",
    powerDescription: "Você não sofre penalidades em testes de ataque por estar em um veículo em movimento e, sempre que estiver pilotando e tiver que fazer um teste de Pilotagem ou resistência, pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
  {
    id: "nerd-entusiasta",
    name: "Nerd Entusiasta",
    description: "Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado \"nerd\". Sua obsessão em pesquisar fundo seus assuntos de interesse e sua capacidade em lidar com os mais variados temas chamou a atenção de organizações paranormais.",
    grantedSkills: ["Ciências", "Tecnologia"],
    powerName: "O Inteligentão",
    powerDescription: "O bônus que você recebe ao utilizar a ação de interlúdio \"ler\" aumenta em +1 dado (de +1d6 para +2d6).",
    patrimonio: 500,
  },
  {
    id: "profetizado",
    name: "Profetizado",
    description: "Como qualquer pessoa, você vai morrer. Entretanto, diferente delas, você sabe como isso vai acontecer. De algum jeito, seja por pesadelos, pensamentos intrusivos ou visões inesperadas, você tem uma premonição de como serão seus últimos momentos de vida. Será que você é capaz de mudar seu próprio destino?",
    grantedSkills: ["Vontade"],
    chooseSkillFrom: ["(à escolha, relacionada à sua premonição)"],
    powerName: "Luta ou Fuga",
    powerDescription: "Conhecer os sinais de sua morte o deixa mais confiante, principalmente quando eles não estão presentes. Você recebe +2 em Vontade. Quando surge uma referência à sua premonição, uma onda de adrenalina toma seu corpo. Além do bônus em Vontade, você recebe +2 PE temporários que duram até o fim da cena.",
    patrimonio: 500,
  },
  {
    id: "psicologo",
    name: "Psicólogo",
    description: "Você se especializou no estudo e tratamento das questões mentais do ser humano. Em sua prática profissional, teve contato com o paranormal e descobriu que algumas aflições mentais possuem origens sombrias e perigosas. Agora, emprega seus conhecimentos para enfrentar o Outro Lado.",
    grantedSkills: ["Intuição", "Profissão (psicólogo)"],
    powerName: "Terapia",
    powerDescription: "Você pode usar Profissão (psicólogo) como Diplomacia. Além disso, uma vez por rodada, quando você ou um aliado em alcance curto falha em um teste de resistência contra um efeito que causa dano mental, você pode gastar 2 PE para fazer um teste de Profissão (psicólogo) e usar o resultado desse teste no lugar do teste de resistência falho.",
    patrimonio: 500,
  },
  {
    id: "reporter-investigativo",
    name: "Repórter Investigativo",
    description: "Você está sempre em busca de histórias significativas, investigando eventos, entrevistando fontes e analisando dados para descobrir a verdade por trás dos acontecimentos. Essa profissão levou você ao encontro do indescritível.",
    grantedSkills: ["Atualidades", "Investigação"],
    powerName: "Encontrar a Verdade",
    powerDescription: "Você pode usar Investigação no lugar de Diplomacia ao fazer testes para persuadir e mudar atitude. Além disso, quando faz um teste de Investigação, pode gastar 2 PE para receber +5 nesse teste.",
    patrimonio: 500,
  },
]

const ARQUIVOS_SECRETOS_4_ORIGINS: OPOrigin[] = [
  {
    id: "influencer-paranormal",
    name: "Influencer Paranormal",
    description: "De início, você nunca acreditou nas lendas urbanas e vídeos de fantasmas, então resolveu se aproveitar daqueles que acreditam. Foi produzindo conteúdos falsos e duvidosos para a internet que você descobriu a dura verdade por trás da Membrana.",
    grantedSkills: ["Enganação", "Tecnologia"],
    powerName: "Registrar o Paranormal",
    powerDescription: "Uma vez por cena, você pode gastar uma ação padrão e 2 PE para criar um registro de uma criatura paranormal ou ritual que tenha sido conjurado na mesma cena. Você recebe +5 em testes contra presença perturbadora de criaturas que tenham sido registradas previamente. Além disso, pode gastar uma ação de interlúdio para memorizar um único ritual registrado, podendo conjurá-lo como se o conhecesse até a próxima cena de interlúdio, desde que tenha o NEX necessário.",
    patrimonio: 500,
  },
  {
    id: "cacador-recompensas",
    name: "Caçador de Recompensas",
    description: "Sua sede pelo dinheiro fácil sempre te guiou na exploração dos locais mais obscuros. Você sabe muito bem que as situações mais insalubres guardam as melhores recompensas.",
    grantedSkills: ["Crime", "Investigação"],
    powerName: "Quem Não Arrisca, Não Petisca",
    powerDescription: "Você recebe +2 em testes para resistir a condições mentais e de medo. Além disso, caso falhe em algum desses testes, você recebe +1d20 no próximo teste que fizer. Esse bônus termina no fim da cena e não é cumulativo com ele mesmo.",
    patrimonio: 500,
  },
]

const ARQUIVOS_SECRETOS_5_ORIGINS: OPOrigin[] = [
  {
    id: "ufologo",
    name: "Ufólogo",
    description: "Você sempre soube que não estávamos sozinhos no universo. Muitos já te consideraram um lunático, mas algo dizia que suas teorias sempre estavam no caminho certo. As intermináveis pesquisas sobre o espaço, sinais no céu e seres de outros planetas eventualmente fizeram perceber que o oculto não mede distâncias.",
    grantedSkills: ["Ciências", "Ocultismo"],
    powerName: "Minha Teoria Absurda",
    powerDescription: "Uma vez por cena de interlúdio, você pode gastar uma ação para apresentar ao seu grupo sua tese sobre as prováveis respostas para a investigação. A critério do mestre, se suas teorias forem boas (não necessariamente corretas), você recebe 1d4+1 PE temporários que duram até serem gastos. Se, quando a missão acabar, uma de suas teorias se provar correta, você recebe +1 PE máximo e atual.",
    patrimonio: 500,
  },
  {
    id: "funcionario-beira-estrada",
    name: "Funcionário de Beira de Estrada",
    description: "Longe das grandes concentrações urbanas, você dava o seu melhor para atender os viajantes cansados. Entre madrugadas adentro e caminhões barulhentos, as lendas urbanas e relatos horripilantes eventualmente chegaram aos seus ouvidos e atiçaram a sua curiosidade.",
    grantedSkills: ["Fortitude", "Intuição"],
    powerName: "Turno Invertido",
    powerDescription: "Uma vez por missão, durante uma cena de interlúdio, você pode receber os benefícios da ação dormir sem precisar realizá-la. Além disso, recebe +2 em testes contra qualquer efeito que tente te deixar inconsciente.",
    patrimonio: 500,
  },
]

const ARQUIVOS_SECRETOS_6_ORIGINS: OPOrigin[] = [
  {
    id: "cientista-ex-panacea",
    name: "Cientista Ex-Panacea",
    description: "Ingênuo, você passou anos trabalhando para a Panacea Industries até descobrir que prestava serviços para uma grande organização responsável por aprisionar e utilizar criaturas paranormais que pesquisam umas às outras. Quando soube do uso de cobaias humanas nesses experimentos, decidiu parar de apoiar as pesquisas e se voltou contra a multinacional.",
    grantedSkills: ["Atualidades", "Ciências"],
    powerName: "Existe uma Explicação",
    powerDescription: "Acostumado a ver o paranormal como um assunto científico, você prefere lidar com o sobrenatural através de teorias, cálculos e testes experimentais. Quando faz um teste de Ocultismo, você pode gastar 2 PE para usar Ciências no lugar dessa perícia.",
    patrimonio: 500,
  },
  {
    id: "cobaia-sobrevivente",
    name: "Cobaia Sobrevivente",
    description: "Você foi pego pelas Indústrias Panacea (ou outra organização semelhante) ainda pequeno, mas, após anos como cobaia, conseguiu sobreviver aos experimentos com o mínimo de sequelas mentais e/ou físicas. Após escapar das garras da multinacional, passou a dedicar sua vida a encontrar meios de salvar outras pessoas do destino trágico que você evitou.",
    grantedSkills: ["Fortitude", "Vontade"],
    powerName: "Forças para Enfrentar",
    powerDescription: "Ser uma cobaia por anos marcou você com experiências horríveis, mas que, às vezes, podem ser usadas como força para continuar sobrevivendo. Descreva ao mestre a parte mais traumática da sua história como cobaia. Quando estiver em uma cena em que há algo relacionado a esse trauma (a critério do mestre), você fica abalado. Entretanto, quando isso acontecer, você pode gastar 2 PE para, até o fim da cena, receber imunidade a efeitos de medo (aplica-se também ao abalado desta habilidade).",
    patrimonio: 500,
  },
  {
    id: "seguranca-ex-panacea",
    name: "Segurança Ex-Panacea",
    description: "Acreditando que trabalhava em uma multinacional dedicada à saúde e bem-estar da população, você quase enlouqueceu quando descobriu que fazia a segurança para cientistas dispostos a usar cobaias humanas em seus experimentos com o paranormal. Assim que soube a verdade, abandonou as Indústrias Panacea para acabar com a existência dela.",
    grantedSkills: ["Luta", "Pontaria"],
    powerName: "Técnicas de Contenção",
    powerDescription: "Você domina técnicas de luta para conter pessoas que podem causar problemas. Quando faz uma manobra de combate (agarrar, derrubar, desarmar, empurrar), você pode gastar 2 PE para receber +5 no teste de manobra.",
    patrimonio: 500,
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
  {
    id: "arquivos-secretos-4",
    name: "Arquivos Secretos #4",
    coverImage: "/books/op-as4.png",
    origins: ARQUIVOS_SECRETOS_4_ORIGINS,
  },
  {
    id: "arquivos-secretos-5",
    name: "Arquivos Secretos #5",
    coverImage: "/books/op-as5.png",
    origins: ARQUIVOS_SECRETOS_5_ORIGINS,
  },
  {
    id: "arquivos-secretos-6",
    name: "Arquivos Secretos #6",
    coverImage: "/books/op-as6.png",
    origins: ARQUIVOS_SECRETOS_6_ORIGINS,
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

export type InventoryItem = {
  itemId: string
  itemName: string
  price: number
  category: string
  rankCategory?: OPRankCategory
  effectiveRankCategory?: OPRankCategory
  icon?: string
  slots?: number
  modifications?: string[]
}

export type OrdemParanormalData = {
  playerName: string
  age: string
  origin: string
  originId?: string
  nex: string
  class: string
  subclass: string
  // Patente
  patente: string
  pp: string
  // Trilhas de recurso
  hp: string
  hpMax: string
  sanity: string
  sanityMax: string
  pe: string
  peMax: string
  // Modo Sobrevivendo ao Horror — trilha alternativa
  sobrevivendoMode?: string   // "true" quando ativo
  determinacao?: string
  determinacaoMax?: string
  // Atributos
  str: string
  dex: string
  int: string
  pres: string
  vig: string
  // Perícias — JSON de Record<string, { treino: number; outros: number }>
  // (retrocompatível com boolean: true → treino:5, false → treino:0)
  skills: string
  // Stats de combate calculados
  pd?: string            // PD por turno (padrão "3")
  deslocamento?: string  // metros (padrão "9")
  defesaEquip?: string   // bônus equip. na defesa (padrão "0")
  defesaOutros?: string  // outros bônus de defesa (padrão "0")
  bloqueio?: string      // override manual do RD de bloqueio; vazio = auto calculado
  esquivaOverride?: string  // legado — não usado na UI
  // Proteção equipada (drive defense auto-calc)
  protecaoEquip?: string     // "none" | "leve" | "pesada"
  escudoEquipado?: string    // "" | "1"
  protecaoReforçada?: string // "" | "1"
  // Descrição de combate/proteção
  protecao?: string
  resistencias?: string
  proficiencias?: string
  // Ataques (JSON de OPAttack[])
  attacks?: string
  // Habilidades de classe (texto livre)
  habilidades?: string
  // Rituais
  rituals: string
  // Inventário
  inventory: string
  inventoryItems: string
  dinheiro: string
  // Notas & Descrição narrativa
  notes: string
  appearance?: string
  personality?: string
  history?: string
  objective?: string
  // Portrait (URL da imagem do personagem)
  portrait?: string
  // Condições ativas (JSON de ActiveCondition[])
  conditions?: string
  // Regras opcionais SaH
  nexExperienceMode?: string // "true" quando modo NEX & Experiência ativo
  nivel?: string             // Nível de experiência 1–20 (modo NEX & Exp)
}

export type ConditionAutoApply = {
  field: keyof Pick<OrdemParanormalData, "str" | "dex" | "int" | "pres" | "vig" | "hpMax" | "sanityMax" | "peMax">
  delta: number
}

export type ActiveCondition = {
  id: string
  notes?: string
  appliedAt?: string
  /** Populated only for GM-created custom conditions */
  custom?: {
    name: string
    description: string
    shortEffect: string
    autoApply?: ConditionAutoApply
  }
}

export type ConditionCategory =
  | "medo" | "mental" | "fadiga" | "paralisia" | "sentidos" | "fisica"
  | "ferimento" | "doenca" | "veneno"

export type Condition = {
  id: string
  name: string
  category: ConditionCategory
  description: string
  shortEffect: string
  autoApply?: ConditionAutoApply
}

/** Attempts to detect a single numeric modifier from free-form text.
 *  Looks for patterns like "-1 em VIG", "FOR -2", "+1 em Presença", etc. */
export function detectAutoApply(text: string): ConditionAutoApply | null {
  type FieldEntry = { field: ConditionAutoApply["field"]; patterns: string[] }
  const FIELDS: FieldEntry[] = [
    { field: "str",       patterns: ["FOR", "força", "forca"] },
    { field: "dex",       patterns: ["AGI", "agilidade", "dex"] },
    { field: "int",       patterns: ["INT", "intelecto"] },
    { field: "pres",      patterns: ["PRE", "presen[çc]a"] },
    { field: "vig",       patterns: ["VIG", "vigor"] },
    { field: "hpMax",     patterns: ["PV\\s*m[áa]x", "HP\\s*m[áa]x", "vida\\s*m[áa]x"] },
    { field: "sanityMax", patterns: ["SAN\\s*m[áa]x", "sanidade\\s*m[áa]x"] },
    { field: "peMax",     patterns: ["PE\\s*m[áa]x", "energia\\s*m[áa]x"] },
  ]

  for (const { field, patterns } of FIELDS) {
    for (const pat of patterns) {
      const before = new RegExp(`([+-]?\\d+)\\s*(?:em|no|na|de|em\\s+seu)?\\s*${pat}`, "i")
      const after  = new RegExp(`${pat}\\s*:?\\s*([+-]\\d+)`, "i")
      let m = text.match(before)
      if (m) return { field, delta: parseInt(m[1], 10) }
      m = text.match(after)
      if (m) return { field, delta: parseInt(m[1], 10) }
    }
  }
  return null
}

export const CONDITION_CATEGORY_LABELS: Record<ConditionCategory, string> = {
  medo:      "Medo",
  mental:    "Mental",
  fadiga:    "Fadiga",
  paralisia: "Paralisia",
  sentidos:  "Sentidos",
  fisica:    "Física",
  ferimento: "Ferimento Debilitante",
  doenca:    "Doença",
  veneno:    "Veneno",
}

export const ORDEM_PARANORMAL_CONDITIONS: Condition[] = [
  // ── MEDO ────────────────────────────────────────────────────────────────────
  { id: "abalado",   name: "Abalado",   category: "medo", shortEffect: "−1d20 em testes",
    description: "−1d20 em testes. Se ficar abalado de novo, vira apavorado." },
  { id: "apavorado", name: "Apavorado", category: "medo", shortEffect: "−2d20 em perícias; deve fugir",
    description: "−2d20 em perícias e deve fugir da fonte do medo pelo caminho mais eficiente. Se não puder fugir, pode agir mas não pode se aproximar voluntariamente da fonte." },
  { id: "tremulo",   name: "Trêmulo",   category: "medo", shortEffect: "−1d20 em Força e Vigor por 3 rodadas",
    description: "(AS#03) Nervoso e com tremeliques. Sofre −1d20 em testes baseados em Força e Vigor por 3 rodadas." },

  // ── MENTAL ───────────────────────────────────────────────────────────────────
  { id: "alquebrado", name: "Alquebrado", category: "mental", shortEffect: "+1 PE por habilidade/ritual",
    description: "Custo de PE de habilidades e rituais aumenta em +1." },
  { id: "atordoado",  name: "Atordoado",  category: "mental", shortEffect: "Desprevenido; sem ações",
    description: "Fica desprevenido e não pode fazer ações." },
  { id: "confuso",    name: "Confuso",    category: "mental", shortEffect: "Comportamento aleatório (1d6 por turno)",
    description: "No início do turno, rola 1d6: 1) move-se em direção aleatória; 2–3) não pode agir; 4–5) ataca o ser mais próximo; 6) condição termina." },
  { id: "esmorecido", name: "Esmorecido", category: "mental", shortEffect: "−2d20 em INT e PRE",
    description: "−2d20 em testes de Intelecto e Presença. Se ficar esmorecido de novo, vira inconsciente." },
  { id: "fascinado",  name: "Fascinado",  category: "mental", shortEffect: "−2d20 em Percepção; sem ações exceto observar",
    description: "−2d20 em Percepção e não pode fazer ações, exceto observar o que o fascinou. Qualquer ação hostil contra ele encerra a condição." },
  { id: "frustrado",  name: "Frustrado",  category: "mental", shortEffect: "−1d20 em INT e PRE",
    description: "−1d20 em testes de Intelecto e Presença. Se ficar frustrado de novo, vira esmorecido." },
  { id: "pasmo",      name: "Pasmo",      category: "mental", shortEffect: "Sem ações",
    description: "Não pode fazer ações." },
  { id: "perturbado", name: "Perturbado", category: "mental", shortEffect: "Sanidade < metade (pré-req. de habilidades)",
    description: "Menos da metade da Sanidade total. Sem penalidade própria, mas é pré-requisito para certas habilidades." },

  // ── FADIGA ───────────────────────────────────────────────────────────────────
  { id: "fatigado", name: "Fatigado", category: "fadiga", shortEffect: "Fraco e vulnerável",
    description: "Fica fraco e vulnerável. Se ficar fatigado de novo, vira exausto." },
  { id: "exausto",  name: "Exausto",  category: "fadiga", shortEffect: "Debilitado, lento e vulnerável",
    description: "Fica debilitado, lento e vulnerável. Se ficar exausto de novo, vira inconsciente." },

  // ── PARALISIA ────────────────────────────────────────────────────────────────
  { id: "agarrado",  name: "Agarrado",  category: "paralisia", shortEffect: "Desprevenido, imóvel, −1d20 ataques",
    description: "Desprevenido, imóvel, −1d20 em testes de ataque, só pode atacar com armas leves. Ataque à distância tem 50% de chance de acertar alvo errado." },
  { id: "enredado",  name: "Enredado",  category: "paralisia", shortEffect: "Lento, vulnerável, −1d20 ataques",
    description: "Fica lento, vulnerável e sofre −1d20 em testes de ataque." },
  { id: "imovil",    name: "Imóvel",    category: "paralisia", shortEffect: "Deslocamento 0m",
    description: "Todas as formas de deslocamento reduzidas a 0m." },
  { id: "lento",     name: "Lento",     category: "paralisia", shortEffect: "Deslocamento reduzido à metade; sem correr",
    description: "Deslocamento reduzido à metade; não pode correr nem fazer investidas." },
  { id: "paralisado",name: "Paralisado",category: "paralisia", shortEffect: "Imóvel, indefeso; só ações mentais",
    description: "Fica imóvel e indefeso; só pode realizar ações puramente mentais." },
  { id: "petrificado",name:"Petrificado",category:"paralisia", shortEffect: "Inconsciente + RD 10",
    description: "Fica inconsciente e ganha RD 10 contra todo tipo de dano." },

  // ── SENTIDOS ─────────────────────────────────────────────────────────────────
  { id: "cego",     name: "Cego",     category: "sentidos", shortEffect: "Desprevenido, −2d20 AGI/FOR, camuflagem total",
    description: "Fica desprevenido e lento, não pode fazer testes de Percepção visual, −2d20 em testes de Agilidade e Força, todos os alvos têm camuflagem total." },
  { id: "ofuscado", name: "Ofuscado", category: "sentidos", shortEffect: "−1d20 em ataques e Percepção",
    description: "−1d20 em testes de ataque e Percepção." },
  { id: "surdo",    name: "Surdo",    category: "sentidos", shortEffect: "Sem Percepção auditiva; −2d20 Iniciativa",
    description: "Não pode fazer testes de Percepção auditiva, −2d20 em Iniciativa, considerado em condição ruim para lançar rituais." },

  // ── FÍSICA ───────────────────────────────────────────────────────────────────
  { id: "asfixiado",   name: "Asfixiado",   category: "fisica", shortEffect: "Sem respiração; perde VIG rodadas antes de morrer",
    description: "Não pode respirar. Pode prender o fôlego por rodadas igual ao Vigor; cada dano sofrido reduz esse valor em 1. Ao final, vira morrendo." },
  { id: "caido",       name: "Caído",       category: "fisica", shortEffect: "−2d20 corpo a corpo; −5 Def. melé, +5 Def. distância",
    description: "−2d20 em ataques corpo a corpo, deslocamento reduzido a 1,5m, −5 na Defesa contra ataques corpo a corpo, +5 na Defesa contra ataques à distância." },
  { id: "debilitado",  name: "Debilitado",  category: "fisica", shortEffect: "−2d20 em AGI, FOR e VIG",
    description: "−2d20 em testes de Agilidade, Força e Vigor. Se ficar debilitado de novo, vira inconsciente." },
  { id: "desprevenido",name: "Desprevenido",category: "fisica", shortEffect: "−5 Defesa; −1d20 Reflexos",
    description: "−5 na Defesa e −1d20 em Reflexos. Fica desprevenido contra inimigos que não possa perceber." },
  { id: "em-chamas",   name: "Em Chamas",   category: "fisica", shortEffect: "1d6 fogo/turno; ação para apagar",
    description: "1d6 de dano de fogo no início de cada turno. Gasta ação padrão para apagar com as mãos ou imersão em água." },
  { id: "enjoado",     name: "Enjoado",     category: "fisica", shortEffect: "Ação padrão OU movimento por rodada",
    description: "Só pode realizar uma ação padrão OU uma ação de movimento por rodada (não ambas)." },
  { id: "envenenado",  name: "Envenenado",  category: "fisica", shortEffect: "Efeito conforme o veneno",
    description: "Efeito varia conforme o veneno (outra condição ou dano recorrente)." },
  { id: "fraco",       name: "Fraco",       category: "fisica", shortEffect: "−1d20 em AGI, Físico e VIG",
    description: "−1d20 em testes de Agilidade, Físico e Vigor. Se ficar fraco de novo, vira debilitado." },
  { id: "indefeso",    name: "Indefeso",    category: "fisica", shortEffect: "Desprevenido; −10 Defesa; falha automática em Reflexos",
    description: "Considerado desprevenido, −10 na Defesa, falha automaticamente em Reflexos e pode sofrer golpes de misericórdia." },
  { id: "machucado",   name: "Machucado",   category: "fisica", shortEffect: "PV < metade (pré-req. de habilidades)",
    description: "Menos da metade dos PV totais. Sem penalidade própria, mas é pré-requisito para certas habilidades." },
  { id: "morrendo",    name: "Morrendo",    category: "fisica", shortEffect: "0 PV; inconsciente; morre em 3 turnos",
    description: "0 PV. Fica inconsciente. Se iniciar 3 turnos nessa condição (não necessariamente consecutivos), morre. Encerra com 1 PV curado ou Medicina DT 20." },
  { id: "sangrando",   name: "Sangrando",   category: "fisica", shortEffect: "VIG DT 20/turno ou perde 1d6 PV",
    description: "No início de cada turno, teste de Vigor DT 20: se passar, estabiliza; se falhar, perde 1d6 PV e continua sangrando." },
  { id: "vulneravel",  name: "Vulnerável",  category: "fisica", shortEffect: "−5 na Defesa",
    description: "−5 na Defesa." },
  { id: "inconsciente",name: "Inconsciente",category: "fisica", shortEffect: "Indefeso; sem ações nem reações",
    description: "Fica indefeso e não pode fazer ações (nem reações). Acordar gasta ação padrão de alguém." },
  { id: "doente",      name: "Doente",      category: "fisica", shortEffect: "Sob efeito de uma doença",
    description: "Sob efeito de uma doença (veja tabela de doenças)." },
  { id: "surpreendido",name: "Surpreendido",category: "fisica", shortEffect: "Desprevenido; sem ações no 1º turno",
    description: "Fica desprevenido e não pode fazer ações." },

  // ── FERIMENTOS DEBILITANTES (SaH) ────────────────────────────────────────────
  { id: "ferimento-agilidade", name: "Ferimento: Agilidade", category: "ferimento",
    shortEffect: "−1 em AGI permanente",
    description: "Ferimento debilitante em Agilidade. −1 em AGI; deixa cicatriz permanente. Cura: ação de interlúdio + Medicina DT 20.",
    autoApply: { field: "dex", delta: -1 } },
  { id: "ferimento-forca",     name: "Ferimento: Força",     category: "ferimento",
    shortEffect: "−1 em FOR permanente",
    description: "Ferimento debilitante em Força. −1 em FOR; deixa cicatriz permanente. Cura: ação de interlúdio + Medicina DT 20.",
    autoApply: { field: "str", delta: -1 } },
  { id: "ferimento-intelecto", name: "Ferimento: Intelecto", category: "ferimento",
    shortEffect: "−1 em INT permanente",
    description: "Ferimento debilitante em Intelecto. −1 em INT; deixa cicatriz permanente. Cura: ação de interlúdio + Medicina DT 20.",
    autoApply: { field: "int", delta: -1 } },
  { id: "ferimento-presenca",  name: "Ferimento: Presença",  category: "ferimento",
    shortEffect: "−1 em PRE permanente",
    description: "Ferimento debilitante em Presença. −1 em PRE; deixa cicatriz permanente. Cura: ação de interlúdio + Medicina DT 20.",
    autoApply: { field: "pres", delta: -1 } },
  { id: "ferimento-vigor",     name: "Ferimento: Vigor",     category: "ferimento",
    shortEffect: "−1 em VIG permanente (+ reduz PV máx.)",
    description: "Ferimento debilitante em Vigor. −1 em VIG; PV máximos reduzidos conforme NEX; deixa cicatriz permanente. Cura: ação de interlúdio + Medicina DT 20.",
    autoApply: { field: "vig", delta: -1 } },
  { id: "ferimento-superficial",name:"Ferimento Superficial",category:"ferimento",
    shortEffect: "Cicatriz sem penalidade de atributo",
    description: "Ferimento debilitante superficial. Sem penalidade de atributo, mas deixa cicatriz permanente." },

  // ── DOENÇAS ──────────────────────────────────────────────────────────────────
  { id: "infecticidio-i",  name: "Infecticídio I",  category: "doenca", shortEffect: "PV máx. −2d10 (GM aplica valor)",
    description: "Vírus do Infecticídio Estágio I: PV máximos reduzidos em 2d10 (se chegar a 0, morte imediata). Fortitude DT 30; só cura em ambiente abaixo de 0°C." },
  { id: "infecticidio-ii", name: "Infecticídio II", category: "doenca", shortEffect: "PV máx. −2d10 adicionais",
    description: "Vírus do Infecticídio Estágio II: PV máximos reduzidos em mais 2d10." },
  { id: "infecticidio-iii",name: "Infecticídio III",category: "doenca", shortEffect: "PV máx. −2d10 + transmissão por contato",
    description: "Vírus do Infecticídio Estágio III+: PV máximos reduzidos em mais 2d10 e passa a transmitir por contato." },
  { id: "ossos-cristal-i",  name: "Ossos de Cristal I",  category: "doenca", shortEffect: "VIG −1",
    description: "Ossos de Cristal Estágio I: Vigor reduzido em 1.",
    autoApply: { field: "vig", delta: -1 } },
  { id: "ossos-cristal-ii", name: "Ossos de Cristal II", category: "doenca", shortEffect: "VIG −2 total; deslocamento ÷2",
    description: "Ossos de Cristal Estágio II: Vigor −2 total (aplica −1 adicional) e deslocamento reduzido à metade.",
    autoApply: { field: "vig", delta: -1 } },
  { id: "ossos-cristal-iii",name: "Ossos de Cristal III",category: "doenca", shortEffect: "VIG 0; deslocamento 1,5m; lesão permanente",
    description: "Ossos de Cristal Estágio III: Vigor a 0, deslocamento 1,5m e adquire lesão permanente." },
  { id: "sangue-quente-i",  name: "Sangue Quente I",  category: "doenca", shortEffect: "FOR +1, AGI +1",
    description: "Sangue Quente Estágio I: Força e Agilidade +1 cada (efeito aparente positivo).",
    autoApply: { field: "str", delta: 1 } },
  { id: "sangue-quente-ii", name: "Sangue Quente II", category: "doenca", shortEffect: "Confuso",
    description: "Sangue Quente Estágio II: fica confuso." },
  { id: "sangue-quente-iii",name: "Sangue Quente III",category: "doenca", shortEffect: "Confuso + vulnerável a todo dano",
    description: "Sangue Quente Estágio III: fica confuso e vulnerável a todo tipo de dano." },
  { id: "crise-alergica-i",   name: "Crise Alérgica I",   category: "doenca", shortEffect: "−2 em testes",
    description: "(AS#06) Crise Alérgica Estágio I: −2 em testes. Fortitude DT 20." },
  { id: "crise-alergica-ii",  name: "Crise Alérgica II",  category: "doenca", shortEffect: "−5 em testes",
    description: "(AS#06) Crise Alérgica Estágio II: −5 em testes." },
  { id: "crise-alergica-iii", name: "Crise Alérgica III", category: "doenca", shortEffect: "−5 em testes + enjoado",
    description: "(AS#06) Crise Alérgica Estágio III: −5 em testes + enjoado." },
  { id: "crise-alergica-iv",  name: "Crise Alérgica IV",  category: "doenca", shortEffect: "−5 em testes + enjoado + asfixiado",
    description: "(AS#06) Crise Alérgica Estágio IV+: −5 em testes + enjoado + asfixiado." },
  { id: "crise-hipertensiva-i",   name: "Crise Hipertensiva I",   category: "doenca", shortEffect: "Trêmulo",
    description: "(AS#06) Crise Hipertensiva Estágio I: trêmulo. Vontade DT 20." },
  { id: "crise-hipertensiva-ii",  name: "Crise Hipertensiva II",  category: "doenca", shortEffect: "Trêmulo + abalado",
    description: "(AS#06) Crise Hipertensiva Estágio II: trêmulo + abalado." },
  { id: "crise-hipertensiva-iii", name: "Crise Hipertensiva III", category: "doenca", shortEffect: "Trêmulo + abalado + enjoado",
    description: "(AS#06) Crise Hipertensiva Estágio III: trêmulo + abalado + enjoado." },
  { id: "crise-hipertensiva-iv",  name: "Crise Hipertensiva IV",  category: "doenca", shortEffect: "Infarto e morte",
    description: "(AS#06) Crise Hipertensiva Estágio IV+: infarto e morte." },
  { id: "crise-hipocondriaca-i",   name: "Crise Hipocondríaca I",   category: "doenca", shortEffect: "Abalado",
    description: "(AS#06) Crise Hipocondríaca Estágio I: abalado." },
  { id: "crise-hipocondriaca-ii",  name: "Crise Hipocondríaca II",  category: "doenca", shortEffect: "Abalado + confuso",
    description: "(AS#06) Crise Hipocondríaca Estágio II: abalado + confuso." },
  { id: "crise-hipocondriaca-iii", name: "Crise Hipocondríaca III", category: "doenca", shortEffect: "Usa todos os medicamentos; −2d12 PV; abalado + confuso",
    description: "(AS#06) Crise Hipocondríaca Estágio III: usa todos os medicamentos do grupo sem efeito + perde 2d12 PV + abalado + confuso." },
  { id: "crise-hipocondriaca-iv",  name: "Crise Hipocondríaca IV",  category: "doenca", shortEffect: "Morte por intoxicação",
    description: "(AS#06) Crise Hipocondríaca Estágio IV+: morre intoxicado." },
  { id: "infeccao-cerebral-i",   name: "Infecção Cerebral I",   category: "doenca", shortEffect: "Frustrado",
    description: "(AS#06) Infecção Cerebral Estágio I: frustrado. Fortitude DT 20." },
  { id: "infeccao-cerebral-ii",  name: "Infecção Cerebral II",  category: "doenca", shortEffect: "Esmorecido",
    description: "(AS#06) Infecção Cerebral Estágio II: esmorecido." },
  { id: "infeccao-cerebral-iii", name: "Infecção Cerebral III", category: "doenca", shortEffect: "Esmorecido + INT 0 + sem comunicação",
    description: "(AS#06) Infecção Cerebral Estágio III: esmorecido + Intelecto a 0 + perde comunicação e raciocínio." },
  { id: "infeccao-cerebral-iv",  name: "Infecção Cerebral IV",  category: "doenca", shortEffect: "Morte cerebral",
    description: "(AS#06) Infecção Cerebral Estágio IV+: morte cerebral." },
  { id: "infeccao-generalizada-i",   name: "Infecção Generalizada I",   category: "doenca", shortEffect: "Fatigado",
    description: "(AS#06) Infecção Generalizada Estágio I: fatigado. Fortitude DT 20." },
  { id: "infeccao-generalizada-ii",  name: "Infecção Generalizada II",  category: "doenca", shortEffect: "Exausto",
    description: "(AS#06) Infecção Generalizada Estágio II: exausto." },
  { id: "infeccao-generalizada-iii", name: "Infecção Generalizada III", category: "doenca", shortEffect: "Exausto + inconsciente",
    description: "(AS#06) Infecção Generalizada Estágio III: exausto + inconsciente." },
  { id: "infeccao-generalizada-iv",  name: "Infecção Generalizada IV",  category: "doenca", shortEffect: "Falência dos órgãos e morte",
    description: "(AS#06) Infecção Generalizada Estágio IV+: falência dos órgãos e morte." },

  // ── VENENOS (AS#06) ──────────────────────────────────────────────────────────
  { id: "batracotoxina",      name: "Batracotoxina",       category: "veneno", shortEffect: "Exausta + paralisada + asfixiada",
    description: "(AS#06) Contato, Fortitude DT 25: exausta + paralisada + asfixiada." },
  { id: "cianeto-potassio",   name: "Cianeto de Potássio", category: "veneno", shortEffect: "Inconsciente + asfixiada",
    description: "(AS#06) Ingestão, Fortitude DT 25: inconsciente + asfixiada." },
  { id: "gas-neurotoxicо",    name: "Gás Neurotóxico",     category: "veneno", shortEffect: "Paralisada (imóvel)",
    description: "(AS#06) Inalação, Fortitude DT 25: paralisada (imóvel)." },
  { id: "ricina",             name: "Ricina",              category: "veneno", shortEffect: "4d6 PV/rodada até curar",
    description: "(AS#06) Inalação, Fortitude DT 25: perde 4d6 PV por rodada (ou 2d6 por 1d4+1 rodadas) até ser curada." },
  { id: "toxina-cardiotoxica",name: "Toxina Cardiotóxica", category: "veneno", shortEffect: "0 PV + morrendo",
    description: "(AS#06) Ferimento, Fortitude DT 25: vai a 0 PV e fica morrendo (perde metade dos PV)." },
]

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

export type OPSkillDef = {
  name: string
  attr: "str" | "dex" | "int" | "pres" | "vig"
  suffix?: "+" | "*" | "*+" | "++"
}

export const OP_SKILL_DEFS: OPSkillDef[] = [
  { name: "Acrobacia",     attr: "dex",  suffix: "+"  },
  { name: "Adestramento",  attr: "pres", suffix: "*"  },
  { name: "Artes",         attr: "pres", suffix: "*"  },
  { name: "Atletismo",     attr: "str"               },
  { name: "Atualidades",   attr: "int"               },
  { name: "Ciências",      attr: "int",  suffix: "*"  },
  { name: "Crime",         attr: "dex",  suffix: "*+" },
  { name: "Diplomacia",    attr: "pres"              },
  { name: "Enganação",     attr: "pres"              },
  { name: "Fortitude",     attr: "vig"               },
  { name: "Furtividade",   attr: "dex",  suffix: "+"  },
  { name: "Iniciativa",    attr: "dex"               },
  { name: "Intimidação",   attr: "pres"              },
  { name: "Intuição",      attr: "pres"              },
  { name: "Investigação",  attr: "int"               },
  { name: "Luta",          attr: "str"               },
  { name: "Medicina",      attr: "int"               },
  { name: "Ocultismo",     attr: "int",  suffix: "*"  },
  { name: "Percepção",     attr: "pres"              },
  { name: "Pilotagem",     attr: "dex",  suffix: "*"  },
  { name: "Pontaria",      attr: "dex"               },
  { name: "Profissão",     attr: "int",  suffix: "*"  },
  { name: "Reflexos",      attr: "dex"               },
  { name: "Religião",      attr: "int"               },
  { name: "Sobrevivência", attr: "int",  suffix: "*"  },
  { name: "Tática",        attr: "int",  suffix: "*"  },
  { name: "Tecnologia",    attr: "int"               },
  { name: "Vontade",       attr: "pres"              },
]

export type OPAttack = {
  id: string
  name: string
  damage: string
  critical: string
  multiplier?: string
  attackBonus?: string
  type?: string
  range?: string
  skill?: string
  damageAttr?: string
  extraDamage?: { damage: string; type?: string }[]
  image?: string
  notes?: string
}

export const ORDEM_PARANORMAL_CLASSES = [
  "Combatente",
  "Especialista",
  "Ocultista",
]

export const NEX_PD_TABLE: Record<string, number> = {
  "5": 1, "10": 2, "15": 3, "20": 4, "25": 5, "30": 6, "35": 7,
  "40": 8, "45": 9, "50": 10, "55": 11, "60": 12, "65": 13, "70": 14,
  "75": 15, "80": 16, "85": 17, "90": 18, "95": 19, "99": 20,
}

export const CLASS_STATS = {
  Combatente:   { pvBase: 20, pvPerNex: 4, peBase: 2,  pePerNex: 2, sanBase: 12, sanPerNex: 3 },
  Especialista: { pvBase: 16, pvPerNex: 3, peBase: 3,  pePerNex: 3, sanBase: 16, sanPerNex: 4 },
  Ocultista:    { pvBase: 12, pvPerNex: 2, peBase: 4,  pePerNex: 4, sanBase: 20, sanPerNex: 5 },
}

export function calcOPStats(data: Pick<OrdemParanormalData, "nex" | "class" | "str" | "dex" | "int" | "pres" | "vig"> & {
  nivel?: string
  semSanidade?: boolean
}) {
  const nex = parseInt(data.nex || "5") || 5
  const nivelN = parseInt(data.nivel || "1") || 1
  // Quando modo NEX & Exp ativo, progressão baseada em Nível (1→0 inc, 2→1, …)
  const nexLevels = data.nivel !== undefined
    ? Math.max(0, nivelN - 1)
    : Math.max(0, Math.floor((nex - 5) / 5))
  const stats = CLASS_STATS[data.class as keyof typeof CLASS_STATS] ?? CLASS_STATS.Combatente
  const vig   = parseInt(data.vig  || "1") || 1
  const pre   = parseInt(data.pres || "1") || 1
  const agi   = parseInt(data.dex  || "1") || 1
  const forca = parseInt(data.str  || "1") || 1
  const intel = parseInt(data.int  || "1") || 1

  const PD_TABLE: Record<string, { base: number; perLevel: number }> = {
    Combatente:   { base: 6,  perLevel: 3 },
    Especialista: { base: 8,  perLevel: 4 },
    Ocultista:    { base: 10, perLevel: 5 },
  }
  const pdStats = PD_TABLE[data.class as string] ?? PD_TABLE.Combatente
  const pdMax = data.semSanidade
    ? (pdStats.base + pre) + nexLevels * (pdStats.perLevel + pre)
    : 0

  return {
    pvMax:         (stats.pvBase  + vig) + nexLevels * (stats.pvPerNex  + vig),
    peMax:         (stats.peBase  + pre) + nexLevels * (stats.pePerNex  + pre),
    sanMax:        stats.sanBase + stats.sanPerNex * nexLevels,
    pdTurno:       NEX_PD_TABLE[String(nex)] ?? 1,
    defesa:        10 + agi,
    carga:         (forca + 1) * 5,
    intSkillBonus: intel,
    ritualLimit:   intel,
    pdMax,
  }
}

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
    patente: "recruta",
    pp: "0",
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
    protecaoEquip: "none",
    escudoEquipado: "",
    protecaoReforçada: "",
    rituals: "",
    inventory: "",
    inventoryItems: JSON.stringify([]),
    dinheiro: "0",
    pd: "3",
    deslocamento: "9",
    nexExperienceMode: "",
    nivel: "1",
    notes: "",
    appearance: "",
    personality: "",
    history: "",
    objective: "",
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

// ─── Patente ─────────────────────────────────────────────────────────────────

export type OPRankCategory = "cat-0" | "cat-I" | "cat-II" | "cat-III" | "cat-IV"
export type ShopMode = "requisition" | "market"

export type OPPatente = {
  id: string
  name: string
  ppMin: number
  creditLimit: "baixo" | "medio" | "alto" | "ilimitado"
  catLimits: Record<OPRankCategory, number> // -1 = ilimitado, 0 = sem acesso
}

export const PATENTE_DATA: OPPatente[] = [
  {
    id: "recruta",
    name: "Recruta",
    ppMin: 0,
    creditLimit: "baixo",
    catLimits: { "cat-0": -1, "cat-I": 2, "cat-II": 0, "cat-III": 0, "cat-IV": 0 },
  },
  {
    id: "operador",
    name: "Operador",
    ppMin: 20,
    creditLimit: "medio",
    catLimits: { "cat-0": -1, "cat-I": 3, "cat-II": 1, "cat-III": 0, "cat-IV": 0 },
  },
  {
    id: "agente-especial",
    name: "Agente Especial",
    ppMin: 50,
    creditLimit: "medio",
    catLimits: { "cat-0": -1, "cat-I": 3, "cat-II": 2, "cat-III": 1, "cat-IV": 0 },
  },
  {
    id: "oficial-operacoes",
    name: "Oficial de Operações",
    ppMin: 100,
    creditLimit: "alto",
    catLimits: { "cat-0": -1, "cat-I": 3, "cat-II": 3, "cat-III": 2, "cat-IV": 1 },
  },
  {
    id: "agente-elite",
    name: "Agente de Elite",
    ppMin: 200,
    creditLimit: "ilimitado",
    catLimits: { "cat-0": -1, "cat-I": 3, "cat-II": 3, "cat-III": 3, "cat-IV": 2 },
  },
]

export const RANK_CATEGORY_LABELS: Record<OPRankCategory, string> = {
  "cat-0":   "Cat. 0",
  "cat-I":   "Cat. I",
  "cat-II":  "Cat. II",
  "cat-III": "Cat. III",
  "cat-IV":  "Cat. IV",
}

export function getPatenteById(id: string): OPPatente {
  return PATENTE_DATA.find((p) => p.id === id) ?? PATENTE_DATA[0]
}

export function getPatenteForPP(pp: number): OPPatente {
  return [...PATENTE_DATA].reverse().find((p) => pp >= p.ppMin) ?? PATENTE_DATA[0]
}

// ─── Shop / Mercado ──────────────────────────────────────────────────────────

export type ShopItemCategory =
  | "arma-simples"
  | "arma-tatica"
  | "arma-fogo"
  | "arma-pesada"
  | "arma-disparo"
  | "municao"
  | "modificacao-arma"
  | "protecao"
  | "modificacao-protecao"
  | "explosivo"
  | "equipamento"
  | "medicamento"
  | "item-paranormal"
  | "item-amaldicado"
  | "veiculo"

export type ShopItem = {
  id: string
  name: string
  category: ShopItemCategory
  rankCategory: OPRankCategory
  price: number
  slots: number
  description: string
  icon?: string
  source: string
  damage?: string
  damageType?: string
  range?: string
  critical?: string
  hands?: "light" | "one" | "two"
  properties?: string[]
  defense?: number
  penalty?: number
  element?: string
}

export type ShopItemBook = {
  id: string
  name: string
  shortName: string
  coverImage: string
  items: ShopItem[]
}

export function gameIconUrl(icon: string, color = "ffffff") {
  return `https://game-icons.net/icons/${color}/transparent/1x1/${icon}.svg`
}

export type CustomShopItem = {
  id: string
  name: string
  category: ShopItemCategory
  rankCategory: OPRankCategory
  price: number
  slots: number
  description: string
  icon?: string
  damage?: string
  damageType?: string
  defense?: number
  properties?: string[]
  modifications?: string[]
  effectiveRankCategory?: OPRankCategory
}

export type ShopConfig = {
  mode: ShopMode
  disabled: string[]
  overrides: Record<string, { price?: number; rankCategory?: OPRankCategory }>
  customItems?: CustomShopItem[]
  activeBooks?: string[]
}

// ─── Modificações de Armas ───────────────────────────────────────────────────

export type WeaponMod = {
  id: string
  name: string
  description: string
  weaponTypes: ShopItemCategory[]
}

const ALL_WEAPON_CATS: ShopItemCategory[] = ["arma-simples", "arma-tatica", "arma-disparo", "arma-fogo", "arma-pesada"]
const FIRE_CATS: ShopItemCategory[] = ["arma-fogo", "arma-pesada"]
const RANGE_CATS: ShopItemCategory[] = ["arma-disparo", "arma-fogo", "arma-pesada"]

export const WEAPON_MODS: WeaponMod[] = [
  { id: "certeira",            name: "Certeira",            description: "+2 em testes de ataque",                                         weaponTypes: ALL_WEAPON_CATS },
  { id: "cruel",               name: "Cruel",               description: "+2 em rolagens de dano",                                        weaponTypes: ALL_WEAPON_CATS },
  { id: "discreta",            name: "Discreta",            description: "−1 espaço; +5 em Crime para ocultar",                           weaponTypes: ALL_WEAPON_CATS },
  { id: "perigosa",            name: "Perigosa",            description: "+2 na margem de ameaça (crítico)",                              weaponTypes: ALL_WEAPON_CATS },
  { id: "tatica",              name: "Tática",              description: "Sacar como ação livre",                                          weaponTypes: ALL_WEAPON_CATS },
  { id: "alongada",            name: "Alongada",            description: "+2 em testes de ataque (cano longo)",                           weaponTypes: RANGE_CATS },
  { id: "calibre-grosso",      name: "Calibre Grosso",      description: "+1 dado do mesmo tipo de dano; munição especial",               weaponTypes: FIRE_CATS },
  { id: "compensador",         name: "Compensador",         description: "Anula penalidade de rajadas (armas automáticas)",               weaponTypes: FIRE_CATS },
  { id: "ferrolho-automatico", name: "Ferrolho Automático", description: "A arma se torna automática",                                    weaponTypes: ["arma-fogo"] },
  { id: "mira-laser",          name: "Mira Laser",          description: "+2 na margem de ameaça",                                        weaponTypes: RANGE_CATS },
  { id: "mira-telescopica",    name: "Mira Telescópica",    description: "+1 categoria de alcance; Ataque Furtivo a qualquer distância",  weaponTypes: RANGE_CATS },
  { id: "silenciador",         name: "Silenciador",         description: "−10 na penalidade de Furtividade após disparar",                weaponTypes: ["arma-fogo"] },
  { id: "visao-de-calor",      name: "Visão de Calor",      description: "Ignora camuflagem do alvo ao disparar",                        weaponTypes: RANGE_CATS },
  { id: "dum-dum",             name: "Dum Dum",             description: "+1 no multiplicador de crítico (munição especial)",              weaponTypes: FIRE_CATS },
  { id: "explosiva-mun",       name: "Explosiva",           description: "+2d6 de dano adicional (munição especial)",                     weaponTypes: FIRE_CATS },
]

export function getModsForWeapon(category: ShopItemCategory): WeaponMod[] {
  return WEAPON_MODS.filter((m) => (m.weaponTypes as string[]).includes(category))
}

export function applyModsToCategory(base: OPRankCategory, modCount: number): OPRankCategory {
  const order: OPRankCategory[] = ["cat-0", "cat-I", "cat-II", "cat-III", "cat-IV"]
  const idx = order.indexOf(base)
  return order[Math.min(idx + modCount, order.length - 1)]
}

export const CATEGORY_LABELS: Record<ShopItemCategory, string> = {
  "arma-simples":          "Armas Simples",
  "arma-tatica":           "Armas Táticas",
  "arma-fogo":             "Armas de Fogo",
  "arma-pesada":           "Armas Pesadas",
  "arma-disparo":          "Armas de Disparo",
  "municao":               "Munições",
  "modificacao-arma":      "Modificações de Arma",
  "protecao":              "Proteção",
  "modificacao-protecao":  "Modificações de Proteção",
  "explosivo":             "Explosivos",
  "equipamento":           "Equipamentos",
  "medicamento":           "Medicamentos",
  "item-paranormal":       "Itens Paranormais",
  "item-amaldicado":       "Itens Amaldiçoados",
  "veiculo":               "Veículos",
}

// ─── Livro de Regras (Core) ──────────────────────────────────────────────────

const LIVRO_BASICO_ITEMS: ShopItem[] = [
  // Armas Simples
  { id: "lb-faca",    name: "Faca",    source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 30,  slots: 1, icon: "skoll/bowie-knife",         damage: "1d4",    damageType: "Corte",   critical: "19",    hands: "light", range: "curto (arremesso)", properties: ["arremessável"],          description: "Faca de uso geral. Arremessável em alcance curto." },
  { id: "lb-martelo", name: "Martelo", source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 30,  slots: 1, icon: "lorc/claw-hammer",    damage: "1d6",    damageType: "Impacto", critical: "x2",    hands: "one",                                                          description: "Martelo robusto. Simples e eficaz." },
  { id: "lb-punhal",  name: "Punhal",  source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 40,  slots: 1, icon: "lorc/stiletto",             damage: "1d4",    damageType: "Perf.",   critical: "x3",    hands: "light",                                 properties: ["ágil"],              description: "Adaga ágil e precisa. Margem de crítico alta." },
  { id: "lb-bastao",  name: "Bastão",  source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 20,  slots: 1, icon: "delapouite/bo",                   damage: "1d6/1d8",damageType: "Impacto", critical: "x2",    hands: "one",                                   properties: ["versátil (1d8)"],     description: "Pode ser usado com uma ou duas mãos (1d8 com duas mãos)." },
  { id: "lb-machete", name: "Machete", source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 50,  slots: 1, icon: "lorc/machete",              damage: "1d6",    damageType: "Corte",   critical: "19",    hands: "one",                                                          description: "Facão largo e resistente. Boa margem de crítico." },
  { id: "lb-lanca",   name: "Lança",   source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 30,  slots: 1, icon: "lorc/trident",           damage: "1d6",    damageType: "Perf.",   critical: "x2",    hands: "one",   range: "curto (arremesso)", properties: ["arremessável"],          description: "Lança de madeira. Pode ser arremessada em alcance curto." },
  { id: "lb-cajado",  name: "Cajado",  source: "livro-basico", category: "arma-simples", rankCategory: "cat-0", price: 20,  slots: 2, icon: "lorc/wizard-staff",         damage: "1d6/1d6",damageType: "Impacto", critical: "x2",    hands: "two",                                   properties: ["ágil", "duplo"],     description: "Empunhado com as duas mãos para Combater com Duas Armas. Ágil." },
  // Armas de Disparo
  { id: "lb-arco",    name: "Arco",    source: "livro-basico", category: "arma-disparo", rankCategory: "cat-0", price: 80,  slots: 2, icon: "delapouite/quiver",            damage: "1d6",    damageType: "Perf.",   critical: "x3",    hands: "two",   range: "médio",            properties: ["duas mãos"],             description: "Arco simples. Alta margem de crítico, alcance médio." },
  { id: "lb-besta",   name: "Besta",   source: "livro-basico", category: "arma-disparo", rankCategory: "cat-0", price: 100, slots: 2, icon: "carl-olsen/crossbow",            damage: "1d8",    damageType: "Perf.",   critical: "19",    hands: "two",   range: "médio",            properties: ["duas mãos", "recarregar (ação de mov.)"], description: "Besta compacta. Dano alto; recarregar gasta ação de movimento." },
  // Armas de Fogo (básicas)
  { id: "lb-pistola",    name: "Pistola",      source: "livro-basico", category: "arma-fogo", rankCategory: "cat-I", price: 400,  slots: 1, icon: "delapouite/revolver",   damage: "1d12",   damageType: "Balíst.", critical: "18",    hands: "light", range: "curto",            properties: ["balístico"],             description: "Pistola compacta de calibre médio. Ótima margem de crítico." },
  { id: "lb-revolver",   name: "Revólver",     source: "livro-basico", category: "arma-fogo", rankCategory: "cat-I", price: 350,  slots: 1, icon: "skoll/revolver",            damage: "2d6",    damageType: "Balíst.", critical: "19/x3", hands: "light", range: "curto",            properties: ["balístico"],             description: "Clássico revólver de seis tiros. Confiável e poderoso." },
  { id: "lb-fuzil-caca", name: "Fuzil de Caça",source: "livro-basico", category: "arma-fogo", rankCategory: "cat-I", price: 600,  slots: 2, icon: "skoll/ak47",    damage: "2d8",    damageType: "Balíst.", critical: "19/x3", hands: "two",   range: "médio",            properties: ["duas mãos", "balístico"],description: "Rifle de precisão para caça. Alcance médio, alto dano." },
  // Armas Táticas — corpo a corpo
  { id: "lb-machadinha", name: "Machadinha",   source: "livro-basico", category: "arma-tatica", rankCategory: "cat-0", price: 50,  slots: 1, icon: "delapouite/hatchet",        damage: "1d6",    damageType: "Corte",   critical: "x3",    hands: "light", range: "curto (arremesso)", properties: ["leve", "arremessável"],  description: "Pequena machadinha de mão. Arremessável e ágil." },
  { id: "lb-nunchaku",   name: "Nunchaku",     source: "livro-basico", category: "arma-tatica", rankCategory: "cat-0", price: 60,  slots: 1, icon: "delapouite/nunchaku",             damage: "1d8",    damageType: "Impacto", critical: "x2",    hands: "light",                                 properties: ["leve", "ágil"],          description: "Bastões interligados. Ágil e versátil." },
  { id: "lb-corrente",   name: "Corrente",     source: "livro-basico", category: "arma-tatica", rankCategory: "cat-0", price: 40,  slots: 1, icon: "lorc/andromeda-chain",                damage: "1d8",    damageType: "Impacto", critical: "x2",    hands: "one",                                   properties: ["+2 derrubar/desarmar"],  description: "Corrente de metal pesada. Bônus para derrubar e desarmar." },
  { id: "lb-espada",     name: "Espada",       source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 300, slots: 1, icon: "skoll/gladius",                damage: "1d8/1d10",damageType: "Corte",  critical: "19",    hands: "one",                                   properties: ["versátil (1d10)"],        description: "Espada de aço resistente. Versátil — 1d10 com duas mãos." },
  { id: "lb-florete",    name: "Florete",      source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 250, slots: 1, icon: "delapouite/sword-brandish",       damage: "1d6",    damageType: "Corte",   critical: "18",    hands: "one",                                   properties: ["ágil"],                  description: "Lâmina fina e ágil. Margem de crítico excelente." },
  { id: "lb-machado",    name: "Machado",      source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 200, slots: 1, icon: "lorc/battle-axe",           damage: "1d8",    damageType: "Corte",   critical: "x3",    hands: "one",                                                          description: "Machado de guerra. Multiplicador de crítico alto." },
  { id: "lb-maca",       name: "Maça",         source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 200, slots: 1, icon: "skoll/spiked-ball",           damage: "2d4",    damageType: "Impacto", critical: "x2",    hands: "one",                                                          description: "Maça de cabeça pesada. Boa média de dano." },
  { id: "lb-acha",       name: "Acha",         source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 280, slots: 2, icon: "delapouite/tomahawk",              damage: "1d12",   damageType: "Corte",   critical: "x3",    hands: "two",                                   properties: ["duas mãos"],             description: "Grande machado de duas mãos. Dano devastador." },
  { id: "lb-gadanho",    name: "Gadanho",      source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 300, slots: 2, icon: "lorc/grim-reaper",               damage: "2d4",    damageType: "Corte",   critical: "x4",    hands: "two",                                   properties: ["duas mãos"],             description: "Foice de guerra. Multiplicador de crítico brutal." },
  { id: "lb-katana",     name: "Katana",       source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 800, slots: 2, icon: "delapouite/katana",               damage: "1d10",   damageType: "Corte",   critical: "19",    hands: "two",                                   properties: ["duas mãos", "ágil"],     description: "Espada japonesa refinada. Com treinamento, pode ser usada com uma mão." },
  { id: "lb-marreta",    name: "Marreta",      source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 150, slots: 2, icon: "delapouite/warhammer",   damage: "3d4",    damageType: "Impacto", critical: "x2",    hands: "two",                                   properties: ["duas mãos"],             description: "Martelo maciço de construção. Alta média de dano." },
  { id: "lb-montante",   name: "Montante",     source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 450, slots: 2, icon: "delapouite/two-handed-sword",     damage: "2d6",    damageType: "Corte",   critical: "19",    hands: "two",                                   properties: ["duas mãos"],             description: "Grande espada de duas mãos. Alto dano e boa margem crítica." },
  { id: "lb-motosserra", name: "Motosserra",   source: "livro-basico", category: "arma-tatica", rankCategory: "cat-I", price: 350, slots: 2, icon: "delapouite/chainsaw",             damage: "3d6",    damageType: "Corte",   critical: "x2",    hands: "two",                                   properties: ["duas mãos", "ruidosa"],  description: "Motosserra adaptada para combate. Dano brutal mas barulhenta." },
  // Armas de Disparo Táticas
  { id: "lb-arco-composto", name: "Arco Composto", source: "livro-basico", category: "arma-disparo", rankCategory: "cat-I", price: 350, slots: 2, icon: "lorc/high-shot",       damage: "1d10",   damageType: "Perf.",   critical: "x3",    hands: "two",   range: "médio",            properties: ["duas mãos", "aplica Força no dano"], description: "Arco mecânico reforçado. Aplica Força no dano." },
  { id: "lb-balestra",      name: "Balestra",      source: "livro-basico", category: "arma-disparo", rankCategory: "cat-I", price: 400, slots: 2, icon: "delapouite/bow-arrow",        damage: "1d12",   damageType: "Perf.",   critical: "19",    hands: "two",   range: "médio",            properties: ["duas mãos", "recarregar (ação de mov.)"], description: "Besta pesada e poderosa. Dano máximo de disparo simples." },
  // Armas de Fogo Táticas
  { id: "lb-submetr",      name: "Submetralhadora", source: "livro-basico", category: "arma-fogo", rankCategory: "cat-I",  price: 1500, slots: 1, icon: "delapouite/mp5",       damage: "2d6",    damageType: "Balíst.", critical: "19/x3", hands: "one",   range: "curto",            properties: ["automática"],            description: "Arma automática compacta. Alta cadência, porte de pistola." },
  { id: "lb-espingarda",   name: "Espingarda",      source: "livro-basico", category: "arma-fogo", rankCategory: "cat-I",  price: 700,  slots: 2, icon: "sbed/shotgun",        damage: "4d6",    damageType: "Balíst.", critical: "x3",    hands: "two",   range: "curto",            properties: ["duas mãos", "metade do dano em médio+"], description: "Espingarda de cano longo. Poder devastador a curta distância." },
  { id: "lb-fuzil-assalto",name: "Fuzil de Assalto",source: "livro-basico", category: "arma-fogo", rankCategory: "cat-II", price: 2000, slots: 2, icon: "skoll/ak47",           damage: "2d10",   damageType: "Balíst.", critical: "19/x3", hands: "two",   range: "médio",            properties: ["duas mãos", "automática"],description: "Fuzil militar versátil. Automático, alto dano em alcance médio." },
  { id: "lb-fuzil-prec",   name: "Fuzil de Precisão",source: "livro-basico", category: "arma-fogo", rankCategory: "cat-III",price: 4000, slots: 2, icon: "lorc/high-shot",  damage: "2d10",   damageType: "Balíst.", critical: "19/x3", hands: "two",   range: "longo",            properties: ["duas mãos"],             description: "Sniper rifle. Alcance longo; mirando, bônus na margem de ameaça." },
  // Armas Pesadas
  { id: "lb-bazuca",       name: "Bazuca",        source: "livro-basico", category: "arma-pesada", rankCategory: "cat-III", price: 8000,  slots: 2, icon: "delapouite/mortar", damage: "10d8", damageType: "Impacto", critical: "x2", hands: "two",  range: "médio", properties: ["duas mãos", "área (raio 3m)", "Reflexos reduz"], description: "Lançador de foguetes. Explosão em área de 3 metros de raio." },
  { id: "lb-lancachamas",  name: "Lança-chamas",  source: "livro-basico", category: "arma-pesada", rankCategory: "cat-III", price: 6000,  slots: 2, icon: "delapouite/flamethrower",  damage: "6d6",  damageType: "Fogo",    critical: "x2", hands: "two",  range: "curto", properties: ["duas mãos", "linha 1,5m", "em chamas"],          description: "Projeta jato de fogo em linha. Alvos podem ficar em chamas." },
  { id: "lb-metralhadora", name: "Metralhadora",  source: "livro-basico", category: "arma-pesada", rankCategory: "cat-II",  price: 5000,  slots: 2, icon: "lorc/minigun",   damage: "2d12", damageType: "Balíst.", critical: "19/x3", hands: "two", range: "médio", properties: ["duas mãos", "automática", "Força 4+/tripé"],     description: "Metralhadora pesada. Requer Força 4+ ou suporte em tripé." },
  // Munições
  { id: "lb-balas-curtas", name: "Balas Curtas", source: "livro-basico", category: "municao", rankCategory: "cat-0", price: 30,  slots: 1, icon: "lorc/bullets",              description: "Munição para pistolas, revólveres e submetralhadoras. Dura 2 cenas." },
  { id: "lb-balas-longas", name: "Balas Longas", source: "livro-basico", category: "municao", rankCategory: "cat-I", price: 80,  slots: 1, icon: "lorc/bullets",         description: "Munição para fuzis, rifles e metralhadoras. Dura 1 cena." },
  { id: "lb-cartuchos",    name: "Cartuchos",    source: "livro-basico", category: "municao", rankCategory: "cat-I", price: 50,  slots: 1, icon: "lorc/bullets",        description: "Munição para espingardas. Dura 1 cena." },
  { id: "lb-combustivel",  name: "Combustível",  source: "livro-basico", category: "municao", rankCategory: "cat-I", price: 100, slots: 1, icon: "delapouite/jerrycan",       description: "Combustível para lança-chamas. Dura 1 cena." },
  { id: "lb-flechas",      name: "Flechas",      source: "livro-basico", category: "municao", rankCategory: "cat-0", price: 20,  slots: 1, icon: "lorc/arrow-flights",        description: "Flechas para arcos. Dura 1 missão inteira (reaproveitáveis)." },
  { id: "lb-foguete",      name: "Foguete",      source: "livro-basico", category: "municao", rankCategory: "cat-I", price: 200, slots: 1, icon: "lorc/rocket",               description: "Foguete para bazuca. Conta como 1 disparo." },
  // Proteções
  { id: "lb-prot-leve",  name: "Proteção Leve",  source: "livro-basico", category: "protecao", rankCategory: "cat-I",  price: 600,  slots: 2, icon: "lorc/breastplate",              defense: 5,  penalty: 0,  description: "Colete e acessórios leves. Defesa +5. Pode ser usada em público sem levantar suspeitas." },
  { id: "lb-prot-pesada",name: "Proteção Pesada", source: "livro-basico", category: "protecao", rankCategory: "cat-II", price: 2000, slots: 5, icon: "skoll/kevlar-vest",        defense: 10, penalty: -5, properties: ["RD 2 físico"], description: "Armadura completa. Defesa +10, RD 2 físico. −5 em perícias com penalidade de carga. Uso claramente militar." },
  { id: "lb-escudo",      name: "Escudo",         source: "livro-basico", category: "protecao", rankCategory: "cat-I",  price: 300,  slots: 2, icon: "willdabeast/round-shield",        defense: 2,  penalty: 0,  properties: ["empunhado (1 mão)"], description: "Escudo empunhado. Defesa +2 — acumula com proteção. Ocupa uma mão." },
  // Modificações de Proteção
  { id: "lb-mod-antibombas", name: "Mod: Antibombas", source: "livro-basico", category: "modificacao-protecao", rankCategory: "cat-II",  price: 600,  slots: 0, icon: "lorc/armor-vest",      description: "+5 em resistência vs. efeitos de área. Apenas proteção pesada. +I categoria." },
  { id: "lb-mod-blindada",   name: "Mod: Blindada",   source: "livro-basico", category: "modificacao-protecao", rankCategory: "cat-III", price: 1500, slots: 1, icon: "delapouite/abdominal-armor",  description: "RD sobe para 5, ocupa +1 espaço. Apenas proteção pesada. +I categoria." },
  { id: "lb-mod-discreta-p", name: "Mod: Discreta",   source: "livro-basico", category: "modificacao-protecao", rankCategory: "cat-I",   price: 400,  slots: 0, icon: "delapouite/spy",         description: "+5 em ocultar, −1 espaço. Apenas proteção leve. +I categoria." },
  { id: "lb-mod-reforcada",  name: "Mod: Reforçada",  source: "livro-basico", category: "modificacao-protecao", rankCategory: "cat-I",   price: 500,  slots: 1, icon: "lorc/layered-armor",   description: "Defesa +2, ocupa +1 espaço. +I categoria." },
  // Equipamentos — Acessórios
  { id: "lb-kit-pericia",  name: "Kit de Perícia",   source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 80,  slots: 1, icon: "lorc/magnifying-glass",   description: "Ferramentas para uma perícia específica. Sem ele: −5 no teste." },
  { id: "lb-utensilio",    name: "Utensílio",        source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 150, slots: 1, icon: "delapouite/swiss-army-knife",   description: "+2 em uma perícia (exceto Luta/Pontaria)." },
  { id: "lb-vestimenta",   name: "Vestimenta",       source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 200, slots: 1, icon: "lucasms/shirt",              description: "+2 em uma perícia. Máx. 2 simultâneas. Vestir/despir = ação completa." },
  // Explosivos
  { id: "lb-gr-atord",     name: "Granada de Atordoamento", source: "livro-basico", category: "explosivo", rankCategory: "cat-0", price: 150, slots: 1, icon: "lorc/grenade",  damage: "—",   damageType: "Especial",  description: "Atordoado 1 rodada. Fortitude: apenas ofuscado/surdo 1 rodada." },
  { id: "lb-gr-frag",      name: "Granada de Fragmentação", source: "livro-basico", category: "explosivo", rankCategory: "cat-I", price: 300, slots: 1, icon: "lorc/grenade",  damage: "8d6",  damageType: "Perf.",    description: "8d6 perfuração em área de 6m. Reflexos reduz à metade." },
  { id: "lb-gr-fumaca",    name: "Granada de Fumaça",       source: "livro-basico", category: "explosivo", rankCategory: "cat-0", price: 100, slots: 1, icon: "darkzaitzev/smoke-bomb", damage: "—",  damageType: "Especial",  description: "Cegos + camuflagem total por 2 rodadas em área de 6m." },
  { id: "lb-gr-incend",    name: "Granada Incendiária",     source: "livro-basico", category: "explosivo", rankCategory: "cat-I", price: 350, slots: 1, icon: "lorc/fire-bomb",      damage: "6d6",  damageType: "Fogo",     description: "6d6 fogo + em chamas. Reflexos reduz à metade e evita condição." },
  { id: "lb-mina",         name: "Mina Antipessoal",        source: "livro-basico", category: "explosivo", rankCategory: "cat-I", price: 400, slots: 1, icon: "lorc/land-mine",      damage: "12d6", damageType: "Perf.",    description: "12d6 perf. em cone de 6m. Instalar: ação completa + Tática DT 15." },
  // Itens Operacionais
  { id: "lb-algemas",      name: "Algemas",              source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 30,   slots: 1, icon: "lorc/manacles",           description: "Imobiliza alvo. Força DT 20 para escapar." },
  { id: "lb-arpeu",        name: "Arpéu",                source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 60,   slots: 1, icon: "lorc/grapple",     description: "Pontaria DT 15 para prender; +5 em Atletismo para subir." },
  { id: "lb-bandoleira",   name: "Bandoleira",           source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 100,  slots: 1, icon: "lucasms/belt",               description: "Sacar/guardar item como ação livre, 1×/rodada." },
  { id: "lb-binoculo",     name: "Binóculos",            source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 120,  slots: 1, icon: "delapouite/binoculars",   description: "+5 em Percepção à distância." },
  { id: "lb-bloqueador",   name: "Bloqueador de Sinal",  source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 300,  slots: 1, icon: "lorc/magnet",        description: "Bloqueia sinais eletrônicos em área de 9m." },
  { id: "lb-cicatrizante", name: "Cicatrizante",         source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 200,  slots: 1, icon: "delapouite/first-aid-kit",description: "Cura 2d8+2 PV em si ou adjacente. Ação padrão." },
  { id: "lb-corda",        name: "Corda (20m)",          source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 40,   slots: 1, icon: "delapouite/rope-coil",    description: "+5 em Atletismo para descer/escalar." },
  { id: "lb-equip-sobr",   name: "Equip. de Sobrevivência", source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 200, slots: 2, icon: "lorc/campfire",       description: "+5 em Sobrevivência; dispensa treinamento." },
  { id: "lb-lanterna",     name: "Lanterna Tática",      source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 60,   slots: 1, icon: "delapouite/flashlight",   description: "Pode ofuscar alvo em alcance curto (ação padrão)." },
  { id: "lb-mascara-gas",  name: "Máscara de Gás",       source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 100,  slots: 1, icon: "lorc/gas-mask",           description: "+10 em Fortitude vs. efeitos de inalação." },
  { id: "lb-mochila-mil",  name: "Mochila Militar",      source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 100,  slots: 0, icon: "delapouite/backpack",     description: "+2 espaços de capacidade de carga." },
  { id: "lb-oculos-term",  name: "Óculos Térmicos",      source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 600,  slots: 1, icon: "delapouite/steampunk-goggles",      description: "Ignora camuflagem; enxerga calor em escuridão total." },
  { id: "lb-pe-cabra",     name: "Pé de Cabra",          source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 30,   slots: 1, icon: "delapouite/crowbar",            description: "+5 em Força para arrombar. Pode ser usado como bastão (1d6)." },
  { id: "lb-pist-dardos",  name: "Pistola de Dardos",    source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 300,  slots: 1, icon: "delapouite/dart",               description: "Alvo inconsciente até o fim da cena. Fortitude reduz." },
  { id: "lb-pist-sinal",   name: "Pistola Sinalizadora", source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 80,   slots: 1, icon: "lorc/gunshot",              description: "Sinalização visual de longa distância. 2d6 fogo se usada como arma." },
  { id: "lb-soqueira",     name: "Soqueira",             source: "livro-basico", category: "equipamento", rankCategory: "cat-0", price: 20,   slots: 1, icon: "delapouite/brass-knuckles",     description: "+1 em dano desarmado." },
  { id: "lb-spray-pim",    name: "Spray de Pimenta",     source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 50,   slots: 1, icon: "lorc/aerosol",            description: "Cego por 1d4 rodadas. Fortitude evita a condição." },
  { id: "lb-taser",        name: "Taser",                source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 200,  slots: 1, icon: "lorc/electric-whip",              damage: "1d6", damageType: "Elétrico", description: "1d6 elétrico + atordoado. Fortitude anula a condição." },
  { id: "lb-traje-hazmat", name: "Traje Hazmat",         source: "livro-basico", category: "equipamento", rankCategory: "cat-I", price: 400,  slots: 2, icon: "delapouite/lab-coat",        description: "+5 em resistência ambiental; RD químico 10." },
  // Itens Paranormais
  { id: "lb-amarras",      name: "Amarras de Elemento",              source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 800,  slots: 1, icon: "lorc/harpoon-chain",              description: "Modo Armadilha (área 3×3m) ou Laçar para paralisar criatura paranormal." },
  { id: "lb-camera-aura",  name: "Câmera de Aura Paranormal",        source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 600,  slots: 1, icon: "delapouite/photo-camera", description: "Revela auras de elementos paranormais em fotografias." },
  { id: "lb-componentes",  name: "Componentes Ritualísticos",        source: "livro-basico", category: "item-paranormal", rankCategory: "cat-0",  price: 100,  slots: 1, icon: "lorc/crystal-ball",       description: "Insumos necessários para conjuração de rituais." },
  { id: "lb-emissor",      name: "Emissor de Pulsos Paranormais",    source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 900,  slots: 1, icon: "lorc/radar-dish",         description: "Atrai criaturas do mesmo elemento; afasta do elemento oposto." },
  { id: "lb-escuta-ruidos",name: "Escuta de Ruídos Paranormais",     source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 700,  slots: 1, icon: "delapouite/microphone",   description: "+5 em Ocultismo para identificar criatura via gravação de campo." },
  { id: "lb-medidor-mem",  name: "Medidor de Estabilidade da Membrana", source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 800, slots: 1, icon: "lorc/compass",        description: "Avalia probabilidade de manifestação paranormal na área." },
  { id: "lb-scanner",      name: "Scanner de Manifestação",          source: "livro-basico", category: "item-paranormal", rankCategory: "cat-II", price: 1000, slots: 1, icon: "lorc/ultrasound",              description: "Detecta manifestações paranormais em alcance longo. Consome 1 PE/rodada." },
  // Veículos
  { id: "lb-moto",  name: "Motocicleta", source: "livro-basico", category: "veiculo", rankCategory: "cat-I",  price: 8000,  slots: 0, icon: "delapouite/full-motorcycle-helmet",    description: "Moto de médio porte. Ágil em tráfego urbano, ideal para perseguições." },
  { id: "lb-carro", name: "Carro Comum", source: "livro-basico", category: "veiculo", rankCategory: "cat-I",  price: 15000, slots: 0, icon: "delapouite/city-car",      description: "Automóvel de passeio. Comporta 4 passageiros e oferece cobertura." },
  { id: "lb-van",   name: "Van Tática",  source: "livro-basico", category: "veiculo", rankCategory: "cat-II", price: 30000, slots: 0, icon: "delapouite/surfer-van",    description: "Van com compartimento traseiro adaptado para o grupo e equipamentos." },
]

// ─── Sobrevivendo ao Horror ───────────────────────────────────────────────────

const SAH_ITEMS: ShopItem[] = [
  // Novas Armas
  { id: "sah-pregador",       name: "Pregador Pneumático", source: "sobrevivendo-ao-horror", category: "arma-simples",  rankCategory: "cat-0", price: 80,   slots: 1,   damage: "1d4",      damageType: "Perf.",   critical: "x4",    hands: "light", range: "curto",            icon: "lorc/nails",           description: "Ferramenta remodelada para combate. Crítico brutal." },
  { id: "sah-estilingue",     name: "Estilingue",          source: "sobrevivendo-ao-horror", category: "arma-simples",  rankCategory: "cat-0", price: 20,   slots: 1,   damage: "1d4",      damageType: "Impacto", critical: "x2",    hands: "light", range: "curto",            icon: "delapouite/slingshot",          properties: ["arremessável", "aplica Força"], description: "Aplica Força no dano. Pode lançar granadas em alcance longo." },
  { id: "sah-baioneta",       name: "Baioneta",            source: "sobrevivendo-ao-horror", category: "arma-simples",  rankCategory: "cat-0", price: 60,   slots: 1,   damage: "1d4",      damageType: "Perf.",   critical: "19",    hands: "light",                            icon: "skoll/bayonet",            description: "Lâmina encaixável em fuzis. Transforma o fuzil em arma mista." },
  { id: "sah-gancho",         name: "Gancho de Carne",     source: "sobrevivendo-ao-horror", category: "arma-simples",  rankCategory: "cat-0", price: 30,   slots: 1,   damage: "1d4",      damageType: "Perf.",   critical: "x4",    hands: "light",                            icon: "delapouite/hook",               description: "Improviso brutal. Crítico devastador." },
  { id: "sah-picareta",       name: "Picareta",            source: "sobrevivendo-ao-horror", category: "arma-simples",  rankCategory: "cat-0", price: 50,   slots: 1,   damage: "1d6",      damageType: "Perf.",   critical: "x4",    hands: "one",                              icon: "delapouite/war-pick",               description: "Ferramenta de mineração adaptada. Perfura armaduras." },
  { id: "sah-rev-compacto",   name: "Revólver Compacto",   source: "sobrevivendo-ao-horror", category: "arma-fogo",    rankCategory: "cat-I", price: 300,  slots: 1,   damage: "2d4",      damageType: "Balíst.", critical: "19/x3", hands: "light", range: "curto",            icon: "skoll/revolver",           properties: ["compacto (Crime: sem espaço)"], description: "Treinado em Crime: não ocupa espaço de item." },
  { id: "sah-faca-tatica",    name: "Faca Tática",         source: "sobrevivendo-ao-horror", category: "arma-tatica",  rankCategory: "cat-I", price: 200,  slots: 1,   damage: "1d6",      damageType: "Corte",   critical: "19",    hands: "light", range: "curto (arremesso)", icon: "lorc/dripping-knife",        description: "Faca de combate de alta qualidade. Arremessável." },
  { id: "sah-bastao-pol",     name: "Bastão Policial",     source: "sobrevivendo-ao-horror", category: "arma-tatica",  rankCategory: "cat-I", price: 100,  slots: 1,   damage: "1d6",      damageType: "Impacto", critical: "x2",    hands: "light",                            icon: "skoll/baton",              description: "Cassetete retrátil policial. Leve e prático." },
  { id: "sah-shuriken",       name: "Shuriken",            source: "sobrevivendo-ao-horror", category: "arma-tatica",  rankCategory: "cat-I", price: 50,   slots: 1,   damage: "1d4",      damageType: "Perf.",   critical: "x2",    hands: "light", range: "curto",            icon: "lorc/shuriken",           properties: ["arremessável"], description: "Veterano em Pontaria: ataque adicional por 1 PE." },
  { id: "sah-pist-pesada",    name: "Pistola Pesada",      source: "sobrevivendo-ao-horror", category: "arma-fogo",    rankCategory: "cat-I", price: 700,  slots: 1,   damage: "2d8",      damageType: "Balíst.", critical: "18",    hands: "one",   range: "curto",            icon: "delapouite/revolver",             properties: ["balístico"], description: "Pistola de alto calibre. Poder de parada superior." },
  { id: "sah-esping-dupla",   name: "Espingarda Cano Duplo",source: "sobrevivendo-ao-horror", category: "arma-fogo",  rankCategory: "cat-II",price: 900,  slots: 2,   damage: "4d6 (6d6)", damageType: "Balíst.", critical: "x3",    hands: "two",   range: "curto",            icon: "delapouite/sawed-off-shotgun",     properties: ["duas mãos", "disparo duplo: 6d6"], description: "2 canos. Disparar ambos no mesmo alvo: 6d6 com penalidade no ataque." },
  // Novos Equipamentos
  { id: "sah-amuleto",        name: "Amuleto Sagrado",     source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 80,   slots: 1,   icon: "delapouite/fire-gem",             description: "+2 Religião e +2 Vontade." },
  { id: "sah-celular",        name: "Celular",             source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 150,  slots: 1,   icon: "delapouite/smartphone",         description: "+2 em perícias de pesquisa com internet. Lanterna cone 4,5m." },
  { id: "sah-chave-fenda",    name: "Chave de Fenda Universal", source: "sobrevivendo-ao-horror", category: "equipamento", rankCategory: "cat-0", price: 40, slots: 1, icon: "lorc/screwdriver",  description: "+2 em perícias para criar/reparar objetos." },
  { id: "sah-chaves",         name: "Chaves",              source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 10,   slots: 1,   icon: "lorc/skeleton-key",           description: "+2 em Furtividade para distrair com barulho de chaves." },
  { id: "sah-docs-falsos",    name: "Documentos Falsos",   source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 400,  slots: 1,   icon: "delapouite/passport",      description: "+2 Diplomacia/Enganação/Intimidação ao se passar por identidade falsa." },
  { id: "sah-manual-op",      name: "Manual Operacional",  source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 200,  slots: 1,   icon: "lorc/open-book",         description: "Usa perícia como treinado por uma aventura." },
  { id: "sah-notebook",       name: "Notebook",            source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 1200, slots: 2,   icon: "delapouite/notebook",             description: "+2 em perícias de pesquisa. Relaxar em interlúdio: +1 SAN." },
  // Explosivos SaH
  { id: "sah-dinamite",       name: "Dinamite",            source: "sobrevivendo-ao-horror", category: "explosivo",    rankCategory: "cat-I", price: 200,  slots: 1,   damage: "4d6+4d6",  damageType: "Imp./Fogo", icon: "delapouite/dynamite",     description: "4d6 impacto + 4d6 fogo em raio 6m. Em chamas. Reflexos reduz à metade." },
  { id: "sah-explosivo-plas", name: "Explosivo Plástico",  source: "sobrevivendo-ao-horror", category: "explosivo",    rankCategory: "cat-I", price: 600,  slots: 1,   damage: "16d6",     damageType: "Impacto", icon: "lorc/unlit-bomb",                 description: "16d6 impacto em raio 3m. Especialistas: dobra dano e ignora RD." },
  { id: "sah-galao",          name: "Galão Vermelho",      source: "sobrevivendo-ao-horror", category: "explosivo",    rankCategory: "cat-0", price: 30,   slots: 2,   damage: "12d6",     damageType: "Fogo",    icon: "delapouite/jerrycan",     description: "Explode se sofrer dano de fogo/balístico: 12d6 fogo em raio 6m. Área fica em chamas." },
  { id: "sah-gr-gas",         name: "Granada de Gás Sonífero", source: "sobrevivendo-ao-horror", category: "explosivo", rankCategory: "cat-I", price: 250, slots: 1,  icon: "lorc/poison-gas",      description: "Inconsciente (Fortitude: apenas exausto/fatigado)." },
  { id: "sah-gr-pem",         name: "Granada de PEM",      source: "sobrevivendo-ao-horror", category: "explosivo",    rankCategory: "cat-I", price: 350,  slots: 1,   damage: "6d6",      damageType: "Impacto", icon: "lorc/magnet-blast",        description: "Desativa eletrônicos em raio 18m. Criaturas de Energia: 6d6 + atordoado." },
  // Itens Operacionais SaH
  { id: "sah-alarme-mov",     name: "Alarme de Movimento", source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 80,   slots: 1,   icon: "lorc/radar-dish",              description: "Detecta movimento em cone de 30m. Alarme silencioso/sonoro." },
  { id: "sah-camera-film",    name: "Câmera Filmadora",    source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 400,  slots: 1,   icon: "delapouite/photo-camera",        description: "+2 Investigação/Percepção. Modo lanterna ou visão noturna." },
  { id: "sah-coldre",         name: "Coldre Saque Rápido", source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 100,  slots: 1,   icon: "delapouite/cowboy-holster",            description: "Saca/guarda arma de fogo leve como ação livre, 1×/rodada." },
  { id: "sah-escuta",         name: "Equipamento de Escuta",source: "sobrevivendo-ao-horror", category: "equipamento", rankCategory: "cat-I", price: 500,  slots: 1,   icon: "lorc/spyglass",             description: "Alcance 90m; 3 transmissores inclusos." },
  { id: "sah-estrepes",       name: "Estrepes (saco)",     source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 30,   slots: 1,   icon: "delapouite/caltrops",           description: "Pregos e espinhos no chão. Dificulta fuga/perseguição." },
  { id: "sah-faixa-pregos",   name: "Faixa de Pregos",     source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 80,   slots: 2,   icon: "lorc/nails",        description: "Fura pneus de veículos que passarem sobre ela." },
  { id: "sah-isqueiro",       name: "Isqueiro",            source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 10,   slots: 1,   icon: "delapouite/lighter",            description: "Fonte de fogo portátil. Acender como ação livre." },
  { id: "sah-oculos-noit",    name: "Óculos de Visão Noturna", source: "sobrevivendo-ao-horror", category: "equipamento", rankCategory: "cat-I", price: 800, slots: 1, icon: "delapouite/night-vision", description: "Elimina penalidades por escuridão." },
  { id: "sah-oculos-esc",     name: "Óculos Escuros",      source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 30,   slots: 1,   icon: "delapouite/sunglasses",         description: "Proteção contra ofuscamento. +2 vs. efeitos visuais." },
  { id: "sah-pa",             name: "Pá",                  source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-0", price: 40,   slots: 2,   icon: "lorc/spade",       description: "Ferramenta de escavação. Pode ser usada como arma (1d6 impacto)." },
  { id: "sah-paraquedas",     name: "Paraquedas",          source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 600,  slots: 2,   icon: "delapouite/life-jacket",    description: "Queda segura de grandes alturas." },
  { id: "sah-traje-merg",     name: "Traje de Mergulho",   source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-I", price: 800,  slots: 2,   icon: "delapouite/life-jacket",        description: "Respirar embaixo d'água. Proteção contra pressão." },
  { id: "sah-traje-esp",      name: "Traje Espacial",      source: "sobrevivendo-ao-horror", category: "equipamento",  rankCategory: "cat-II",price: 5000, slots: 5,   icon: "lorc/space-suit",         description: "Proteção contra vácuo, radiação e extremos de temperatura." },
  // Medicamentos
  { id: "sah-antibiotico",    name: "Antibiótico",         source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 80,   slots: 1,   icon: "lorc/pill",               description: "Combate infecções bacterianas." },
  { id: "sah-antidoto",       name: "Antídoto",            source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 120,  slots: 1,   icon: "delapouite/health-potion",           description: "Neutraliza venenos." },
  { id: "sah-anti-inflam",    name: "Anti-inflamatório",   source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 60,   slots: 1,   icon: "delapouite/medicines",              description: "Reduz inflamação e dor." },
  { id: "sah-antitermico",    name: "Antitérmico",         source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 50,   slots: 1,   icon: "lorc/thermometer-scale",  description: "Reduz febre." },
  { id: "sah-bronco",         name: "Broncodilatador",     source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 100,  slots: 1,   icon: "lorc/corked-tube",            description: "Facilita respiração em ambientes adversos." },
  { id: "sah-coagulante",     name: "Coagulante",          source: "sobrevivendo-ao-horror", category: "medicamento",  rankCategory: "cat-I", price: 150,  slots: 1,   icon: "lorc/scalpel",      description: "Estanca hemorragias rapidamente." },
  // Itens Paranormais SaH
  { id: "sah-cat-ampl",       name: "Catalisador: Ampliador",       source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-I", price: 300, slots: 1, icon: "lorc/striking-diamonds",     description: "Amplifica o alcance de rituais paranormais." },
  { id: "sah-cat-pert",       name: "Catalisador: Perturbador",     source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-I", price: 300, slots: 1, icon: "delapouite/prism",    description: "Perturba e enfraquece rituais inimigos." },
  { id: "sah-cat-pot",        name: "Catalisador: Potencializador", source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-I", price: 350, slots: 1, icon: "lorc/crystal-ball",      description: "Aumenta o poder do ritual paranormal." },
  { id: "sah-cat-prol",       name: "Catalisador: Prolongador",     source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-I", price: 300, slots: 1, icon: "lorc/cracked-glass",      description: "Estende a duração do ritual paranormal." },
  { id: "sah-ligacao-inf",    name: "Ligação Direta Infernal",      source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-II", price: 600, slots: 1, icon: "lorc/daemon-skull",           description: "Canal direto com entidades do submundo." },
  { id: "sah-med-vert",       name: "Medidor de Condição Vertebral",source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-II", price: 500, slots: 1, icon: "lorc/anatomy",          description: "Avalia a integridade vertebral de criaturas paranormais." },
  { id: "sah-pe-de-morto",    name: "Pé de Morto",                  source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-II", price: 450, slots: 1, icon: "lorc/broken-skull",          description: "Relíquia mortuária com propriedades paranormais." },
  { id: "sah-pendrive",       name: "Pendrive Selado",              source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-II", price: 400, slots: 1, icon: "delapouite/usb-key",      description: "Dados paranormais selados com proteção ritualística." },
  { id: "sah-valete",         name: "Valete da Salvação",           source: "sobrevivendo-ao-horror", category: "item-paranormal", rankCategory: "cat-I", price: 350, slots: 1, icon: "delapouite/ticket",       description: "Carta ritualística usada como proteção de emergência." },
  // Itens Amaldiçoados SaH — Morte
  { id: "sah-ampulheta",      name: "Ampulheta do Tempo Sofrido",   source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 800,  slots: 1, element: "Morte",        icon: "lorc/hourglass",          description: "5 PE: benefícios imediatos de interlúdio. Recarrega gastando ação de interlúdio." },
  { id: "sah-injecao-lodo",   name: "Injeção de Lodo",             source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 500,  slots: 1, element: "Morte",        icon: "zajkonur/skull-with-syringe",            description: "Vulnerabilidade a balístico/Energia até fim da cena. Próxima vez a 0 PV vai a 1." },
  { id: "sah-inst-mortal",    name: "Instantâneo Mortal",          source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 600,  slots: 1, element: "Morte",        icon: "delapouite/photo-camera", description: "Foto de morte. 1 PE: bônus em teste relacionado às circunstâncias de morte." },
  { id: "sah-proj-lodo-c",    name: "Projétil de Lodo (Curto)",    source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-I",  price: 400,  slots: 1, element: "Morte",        icon: "lorc/gooey-impact",               description: "Troca dano da arma para Morte. Arma se degrada ao fim da cena." },
  { id: "sah-proj-lodo-l",    name: "Projétil de Lodo (Longo)",    source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 700,  slots: 1, element: "Morte",        icon: "lorc/gooey-impact",               description: "Versão longo alcance do projétil de lodo." },
  { id: "sah-radio-chiad",    name: "Rádio Chiador",               source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 500,  slots: 1, element: "Morte",        icon: "lorc/death-note",          description: "Detecta paranormais em alcance extremo. Atrai criaturas paranormais." },
  // Itens Amaldiçoados SaH — Outros Elementos
  { id: "sah-repo-fracasso",  name: "Repositório do Fracasso",      source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 700,  slots: 1, element: "Conhecimento", icon: "lorc/evil-book",      description: "Acumula cargas quando inimigos tiram 1. Consome carga: +1d4 PE (penalidade Vontade cumulativa)." },
  { id: "sah-tabula",         name: "Tábula do Saber Custoso",      source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 900,  slots: 1, element: "Conhecimento", icon: "delapouite/wax-tablet",        description: "Usa perícia como treinado por um teste, perdendo SAN = atributo-chave." },
  { id: "sah-arreio-neural",  name: "Arreio Neural",                source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 700,  slots: 1, element: "Energia",      icon: "delapouite/brain-dump",         description: "+1 PE ao sofrer 5+ de dano elétrico/Energia. Até 2×Vigor por dia." },
  { id: "sah-espelho-ref",    name: "Espelho Refletor",             source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 600,  slots: 1, element: "Energia",      icon: "lorc/mirror-mirror",       description: "Observa pontos fora do ângulo de visão. Pode sacrificar para refletir dano de Energia." },
  { id: "sah-mandibula",      name: "Mandíbula Agonizante",         source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 500,  slots: 1, element: "Sangue",       icon: "lorc/fanged-skull",           description: "Grito encobre sons em raio de 30m. Atrai criaturas de Sangue. Vontade DT 35." },
  { id: "sah-retalho",        name: "Retalho Tenebroso",            source: "sobrevivendo-ao-horror", category: "item-amaldicado", rankCategory: "cat-II", price: 600,  slots: 1, element: "Sangue",       icon: "lorc/haunting",          description: "Máscara de carne. Faro e visão no escuro; vulnerável a Morte. +1 dano/dia de uso." },
]

// ─── Arquivos Secretos #3 ─────────────────────────────────────────────────────

const AS3_ITEMS: ShopItem[] = [
  { id: "as3-garra-harpia",    name: "Garra do Harpia",      source: "arquivos-secretos-3", category: "arma-tatica",     rankCategory: "cat-I",   price: 1200, slots: 2,   damage: "2d8",  damageType: "Corte",   critical: "19/x2", hands: "two",  icon: "lorc/flame-claws",         description: "Arma tática ágil de 2 mãos. Ao causar dano: 2 PE → agarrar como ação livre. Compatível com Combater com Duas Armas." },
  { id: "as3-bloody-mary",     name: "Bloody Mary Batizada", source: "arquivos-secretos-3", category: "item-amaldicado", rankCategory: "cat-II",  price: 400,  slots: 1,   element: "Especial", icon: "lorc/wine-glass",     description: "Remove condição mental/medo ao beber. Inflige 2d4 dano mental." },
  { id: "as3-pacoca",          name: "Paçoca",               source: "arquivos-secretos-3", category: "equipamento",     rankCategory: "cat-0",   price: 10,   slots: 1,   icon: "lorc/hot-spices",        description: "Prato rápido. 1×/dia: recupera 1d8+1 PV, PE e SAN." },
  { id: "as3-cranio-domin",    name: "Crânio Dominador",     source: "arquivos-secretos-3", category: "item-paranormal", rankCategory: "cat-III", price: 1500, slots: 1,   icon: "lorc/crowned-skull",              description: "Ação padrão + 2 PE: paralisa até 2 alvos em alcance curto. Recarrega em 24h." },
  { id: "as3-gaiola-corvo",    name: "Gaiola do Corvo",      source: "arquivos-secretos-3", category: "item-paranormal", rankCategory: "cat-IV",  price: 3000, slots: 2,   damage: "3d10", damageType: "Morte",   icon: "lorc/carrion",          description: "Cria Lodo em raio de 18m. 3d10 Morte/rodada. Quem morre vira cinzas." },
  { id: "as3-camiseta-psik",   name: "Camiseta Psikolera",   source: "arquivos-secretos-3", category: "item-amaldicado", rankCategory: "cat-II",  price: 600,  slots: 1,   element: "Sangue",   icon: "lucasms/shirt",       description: "Se machucado usando-a, dano causado tem +2d8 de Sangue adicional." },
  { id: "as3-dupla-obsessiva", name: "Dupla Obsessiva",      source: "arquivos-secretos-3", category: "item-amaldicado", rankCategory: "cat-III", price: 2000, slots: 2,   element: "Sangue",   icon: "lorc/crossed-swords",     description: "Maça + Florete amaldiçoados. Empunhando os dois: ação padrão = 2 ataques. 2 PE: tanka aliados próximos." },
  { id: "as3-armaduras",       name: "Armaduras dos Couraças",source: "arquivos-secretos-3", category: "item-amaldicado", rankCategory: "cat-III", price: 2500, slots: 0,  element: "Sangue",   icon: "lorc/breastplate",        defense: 10, properties: ["RD 5 físico", "RD 10 Sangue", "vulnerável a Morte"], description: "Proteção pesada amaldiçoada. Defesa +10, RD 5 físico, RD 10 Sangue. Quase impossível de remover." },
]

// ─── Arquivos Secretos #4 ─────────────────────────────────────────────────────

const AS4_ITEMS: ShopItem[] = [
  { id: "as4-gr-lacrim",       name: "Granada de Gás Lacrimogêneo", source: "arquivos-secretos-4", category: "explosivo",        rankCategory: "cat-I",  price: 200,  slots: 1, damage: "4d6",  damageType: "Químico", icon: "lorc/grenade",      description: "4d6 dano químico em raio 6m + enjoado + dificuldade de respirar. Fortitude reduz." },
  { id: "as4-gr-tinta",        name: "Granada de Tinta",            source: "arquivos-secretos-4", category: "explosivo",        rankCategory: "cat-0",  price: 80,   slots: 1,                              icon: "delapouite/paint-bucket",       description: "Raio 6m: vulnerável e −2d20 em Furtividade até fim da cena. Reflexos evita." },
  { id: "as4-gr-ctrl-v",       name: "Granada Ctrl+C Ctrl+V",       source: "arquivos-secretos-4", category: "item-amaldicado",  rankCategory: "cat-II", price: 800,  slots: 1, damage: "8d6",  damageType: "Energia", element: "Energia", icon: "lorc/bright-explosion",        description: "8d6 Energia em raio 6m. 1d4: par = gera segunda granada idêntica. Até 4 explosões." },
  { id: "as4-lanc-granadas",   name: "Lançador de Granadas",        source: "arquivos-secretos-4", category: "arma-pesada",      rankCategory: "cat-II", price: 3000, slots: 2, hands: "two",   range: "longo",        icon: "delapouite/missile-launcher",   description: "Arma pesada de 2 mãos. Alcance longo. Suporta granadas de 40mm." },
  { id: "as4-mod-gr-ades",     name: "Mod Granada: Adesiva",        source: "arquivos-secretos-4", category: "modificacao-arma", rankCategory: "cat-I",  price: 300,  slots: 0,                              icon: "lorc/magnet",        description: "A granada gruda no alvo ao invés de cair no chão. +I categoria." },
  { id: "as4-mod-gr-dupla",    name: "Mod Granada: Dupla",          source: "arquivos-secretos-4", category: "modificacao-arma", rankCategory: "cat-I",  price: 400,  slots: 0,                              icon: "lorc/double-shot",  description: "A granada explode duas vezes. +I categoria." },
  { id: "as4-mod-gr-prog",     name: "Mod Granada: Programada",     source: "arquivos-secretos-4", category: "modificacao-arma", rankCategory: "cat-I",  price: 350,  slots: 0,                              icon: "delapouite/detonator",              description: "A granada explode em delay configurável. +I categoria." },
]

// ─── Arquivos Secretos #5 ─────────────────────────────────────────────────────

const AS5_ITEMS: ShopItem[] = [
  { id: "as5-faixas-vid",      name: "Faixas da Vidência",   source: "arquivos-secretos-5", category: "item-amaldicado", rankCategory: "cat-III", price: 1000, slots: 1, element: "Morte",        icon: "lorc/bandage-roll",       description: "+5 Defesa/resistência contra ataques próximos. −5 contra distantes. +2 Intimidação." },
  { id: "as5-joias-mente",     name: "Joias da Mente",       source: "arquivos-secretos-5", category: "item-amaldicado", rankCategory: "cat-III", price: 1200, slots: 1, element: "Conhecimento", icon: "lorc/glass-heart",        description: "+2 Diplomacia, RD mental 10. Requer as duas peças simultaneamente." },
  { id: "as5-larva-furia",     name: "Larva da Fúria",       source: "arquivos-secretos-5", category: "item-amaldicado", rankCategory: "cat-II",  price: 600,  slots: 1, element: "Sangue",       icon: "lorc/maggot",              description: "Ingerida: +4 ataque/dano corpo a corpo. Impede ações que exijam calma." },
  { id: "as5-skate-caotico",   name: "Skate Caótico",        source: "arquivos-secretos-5", category: "item-amaldicado", rankCategory: "cat-II",  price: 700,  slots: 2, element: "Energia",      icon: "delapouite/snowboard",   damage: "1d12", damageType: "Impacto", description: "Transporte (+3m deslocamento) / arma (1d12 impacto) / escudo (+5 Defesa)." },
  { id: "as5-tenis-lepidos",   name: "Tênis Lépidos",        source: "arquivos-secretos-5", category: "item-amaldicado", rankCategory: "cat-III", price: 900,  slots: 1, element: "Energia",      icon: "delapouite/ice-skate",       description: "+12 Atletismo, +3m deslocamento. 2 PE: ignora terreno difícil e ganha escalada." },
]

// ─── Arquivos Secretos #6 ─────────────────────────────────────────────────────

const AS6_ITEMS: ShopItem[] = [
  { id: "as6-anel-invertido",  name: "Anel Invertido",          source: "arquivos-secretos-6", category: "item-amaldicado", rankCategory: "cat-II",  price: 700,  slots: 1, element: "Morte",  icon: "lorc/skull-ring",               description: "Reação + 2 PE: RD 4d10 contra dano de nidere." },
  { id: "as6-lanca-nitrogenio",name: "Lança-nitrogênio",        source: "arquivos-secretos-6", category: "arma-pesada",     rankCategory: "cat-III", price: 5000, slots: 2, hands: "two",   range: "curto", damage: "6d6", damageType: "Frio", critical: "x2", icon: "lorc/ice-spear",         properties: ["linha 1,5m", "enreda"], description: "6d6 frio em linha de 1,5m de largura. Enreda alvo em gelo." },
  { id: "as6-adrenalina",      name: "Aplicador de Adrenalina", source: "arquivos-secretos-6", category: "medicamento",     rankCategory: "cat-I",   price: 350,  slots: 1,                              icon: "lorc/potion-ball",      description: "+2d8+2 PV temporários, +3m deslocamento, +2 Força/Agilidade/Vigor. Rebote: fatigado." },
]

// ─── Organização por livros ────────────────────────────────────────────────────

export const ORDEM_PARANORMAL_ITEM_BOOKS: ShopItemBook[] = [
  { id: "livro-basico",          name: "Livro de Regras",        shortName: "Core",  coverImage: "/books/op-livro-basico-v2.png",      items: LIVRO_BASICO_ITEMS },
  { id: "sobrevivendo-ao-horror",name: "Sobrevivendo ao Horror", shortName: "SaH",   coverImage: "/books/op-sobrevivendo-horror.png",   items: SAH_ITEMS },
  { id: "arquivos-secretos-3",   name: "Arquivos Secretos #3",   shortName: "AS#3",  coverImage: "/books/op-arquivos-secretos-3.png",   items: AS3_ITEMS },
  { id: "arquivos-secretos-4",   name: "Arquivos Secretos #4",   shortName: "AS#4",  coverImage: "/books/op-arquivos-secretos-4.png",   items: AS4_ITEMS },
  { id: "arquivos-secretos-5",   name: "Arquivos Secretos #5",   shortName: "AS#5",  coverImage: "/books/op-arquivos-secretos-5.png",   items: AS5_ITEMS },
  { id: "arquivos-secretos-6",   name: "Arquivos Secretos #6",   shortName: "AS#6",  coverImage: "/books/op-arquivos-secretos-6.png",   items: AS6_ITEMS },
]

export const ORDEM_PARANORMAL_ITEMS: ShopItem[] =
  ORDEM_PARANORMAL_ITEM_BOOKS.flatMap((b) => b.items)

// ─── Habilidades ──────────────────────────────────────────────────────────────

export type OPHabilidadeSource = "livro-basico" | "sobrevivendo-ao-horror" | "arquivos-secretos"
export type OPHabilidadeClass  = "combatente" | "especialista" | "ocultista" | "paranormal"

export type OPHabilidadeDef = {
  id: string
  name: string
  description: string
  source: OPHabilidadeSource
  class: OPHabilidadeClass
  category: string        // "poder" | "poder-geral" | nome da trilha
  categoryType: "poder" | "trilha"
  prereq?: string
}

// ─── Rituais ──────────────────────────────────────────────────────────────────

export type OPRitualElement = "conhecimento" | "energia" | "morte" | "sangue" | "medo"
export type OPRitualSource  = "livro-basico" | "sobrevivendo-ao-horror" | "arquivos-secretos"
export type OPRitualCircle  = 1 | 2 | 3 | 4

export type OPRitualDef = {
  id: string
  name: string
  description: string
  source: OPRitualSource
  element: OPRitualElement
  circle: OPRitualCircle
  execution?: string
  range?: string
  duration?: string
  resistance?: string
  prereq?: string
  img?: string   // caminho relativo a /public, ex: "/rituais/cicatrizacao.jpg"
}

// ── COMBATENTE — Poderes — Livro de Regras ────────────────────────────────────
const COMBATENTE_PODERES_LDR: OPHabilidadeDef[] = [
  { id:"c-armamento-pesado",       name:"Armamento Pesado",         source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Proficiência com armas pesadas.", prereq:"For 2" },
  { id:"c-artista-marcial",        name:"Artista Marcial",          source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ataques desarmados causam 1d6 de dano, podem ser letais e contam como armas ágeis. NEX 35%: 1d8. NEX 70%: 1d10." },
  { id:"c-ataque-oportunidade",    name:"Ataque de Oportunidade",   source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Quando um ser sai voluntariamente de um espaço adjacente ao seu, gasta uma reação e 1 PE para fazer um ataque corpo a corpo contra ele." },
  { id:"c-duas-armas",             name:"Combater com Duas Armas",  source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Se usar duas armas (ao menos uma leve) e fizer a ação agredir, pode fazer dois ataques, um com cada arma. Sofre −5 em todos os ataques até o próximo turno.", prereq:"Agi 3, treinado em Luta ou Pontaria" },
  { id:"c-combate-defensivo",      name:"Combate Defensivo",        source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ao usar a ação agredir, pode combater defensivamente. Sofre −5 nos testes de ataque, mas recebe +5 na Defesa até o próximo turno.", prereq:"Int 2" },
  { id:"c-golpe-demolidor",        name:"Golpe Demolidor",          source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ao usar a manobra quebrar ou atacar um objeto, gasta 1 PE para causar dois dados de dano extra do mesmo tipo da arma.", prereq:"For 2, treinado em Luta" },
  { id:"c-golpe-pesado",           name:"Golpe Pesado",             source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo." },
  { id:"c-incansavel",             name:"Incansável",               source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Uma vez por cena, gasta 2 PE para fazer uma ação de investigação adicional, usando Força ou Agilidade como atributo-base do teste." },
  { id:"c-presteza-atletica",      name:"Presteza Atlética",        source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ao facilitar investigação, gasta 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar, o próximo aliado que usar seu bônus também recebe +5." },
  { id:"c-protecao-pesada",        name:"Proteção Pesada",          source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Proficiência com Proteções Pesadas.", prereq:"NEX 30%" },
  { id:"c-reflexos-defensivos",    name:"Reflexos Defensivos",      source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"+2 em Defesa e em testes de resistência.", prereq:"Agi 2" },
  { id:"c-saque-rapido",           name:"Saque Rápido",             source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Saca ou guarda itens como ação livre. Com contagem de munição, pode recarregar arma de disparo como ação livre uma vez por rodada.", prereq:"treinado em Iniciativa" },
  { id:"c-segurar-gatilho",        name:"Segurar o Gatilho",        source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ao acertar ataque com arma de fogo, pode fazer outro ataque contra o mesmo alvo gastando 2 PE por cada ataque já realizado no turno (2 PE, depois 4 PE, etc.), até errar ou atingir o limite de PE.", prereq:"NEX 60%" },
  { id:"c-sentido-tatico",         name:"Sentido Tático",           source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Gasta ação de movimento e 2 PE para analisar o ambiente. Recebe bônus em Defesa e testes de resistência igual ao Intelecto até o fim da cena.", prereq:"Int 2, treinado em Percepção e Tática" },
  { id:"c-tanque-guerra",          name:"Tanque de Guerra",         source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Se usar proteção pesada, a Defesa e a resistência a dano dela aumentam em +2.", prereq:"Proteção Pesada" },
  { id:"c-tiro-certeiro",          name:"Tiro Certeiro",            source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Com arma de disparo, soma Agilidade nas rolagens de dano e ignora penalidade contra alvos em combate corpo a corpo (mesmo sem usar mirar).", prereq:"treinado em Pontaria" },
  { id:"c-tiro-cobertura",         name:"Tiro de Cobertura",        source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Ação padrão + 1 PE para disparar na direção de um alvo. Teste de Pontaria vs. Vontade do alvo. Se vencer, até o início do próximo turno o alvo não pode sair do lugar e sofre −5 em ataques. Efeito de medo." },
  { id:"c-transcender",            name:"Transcender",              source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Recebe um poder paranormal escolhido, mas não ganha Sanidade nesse aumento de NEX. Pode ser escolhido várias vezes." },
  { id:"c-treinamento-pericia",    name:"Treinamento em Perícia",   source:"livro-basico", class:"combatente", category:"poder", categoryType:"poder", description:"Escolhe duas perícias e se torna treinado nelas. NEX 35%: pode elevar treinado para veterano. NEX 70%: pode elevar veterano para expert. Pode ser escolhido várias vezes." },
]

// ── COMBATENTE — Trilhas — Livro de Regras ────────────────────────────────────
const COMBATENTE_TRILHAS_LDR: OPHabilidadeDef[] = [
  { id:"c-t-aniquilador", name:"Aniquilador", source:"livro-basico", class:"combatente", category:"aniquilador", categoryType:"trilha", description:"NEX 10% — A Favorita: escolhe uma arma favorita, categoria dela reduzida em I.\nNEX 40% — Técnica Secreta: categoria reduzida em II; ao atacar com ela gasta 2 PE para usar um efeito (Amplo: atinge alvo adjacente adicional; Destruidor: +1 no multiplicador de crítico). Cada efeito extra custa +2 PE.\nNEX 65% — Técnica Sublime: adiciona à lista Letal (+2 margem de ameaça) e Perfurante (ignora até 5 de RD).\nNEX 99% — Máquina de Matar: categoria reduzida em III, +2 margem de ameaça, +1 dado de dano." },
  { id:"c-t-comandante",   name:"Comandante de Campo", source:"livro-basico", class:"combatente", category:"comandante-de-campo", categoryType:"trilha", description:"NEX 10% — Inspirar Confiança: reação + 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.\nNEX 40% — Estrategista: ação padrão + 1 PE por aliado (até o valor de Int) para que no próximo turno deles ganhem ação de movimento adicional.\nNEX 65% — Brecha na Guarda: reação + 2 PE quando aliado causar dano em inimigo próximo para que você ou outro aliado faça ataque adicional contra ele. Alcance aumenta para médio.\nNEX 99% — Oficial Comandante: ação padrão + 5 PE para que cada aliado visível em alcance médio receba ação padrão adicional no próximo turno." },
  { id:"c-t-guerreiro",    name:"Guerreiro",   source:"livro-basico", class:"combatente", category:"guerreiro", categoryType:"trilha", description:"NEX 10% — Técnica Letal: +2 na margem de ameaça em todos os ataques corpo a corpo.\nNEX 40% — Revidar: ao bloquear um ataque, reação + 2 PE para fazer ataque corpo a corpo no inimigo que atacou.\nNEX 65% — Força Opressora: ao acertar ataque corpo a corpo, gasta 1 PE para realizar manobra derrubar ou empurrar como ação livre. Empurrar recebe +5 por 10 pontos de dano causados.\nNEX 99% — Potência Máxima: ao usar Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados." },
  { id:"c-t-operacoes",    name:"Operações Especiais", source:"livro-basico", class:"combatente", category:"operacoes-especiais", categoryType:"trilha", description:"NEX 10% — Iniciativa Aprimorada: +5 em Iniciativa + ação de movimento adicional na primeira rodada.\nNEX 40% — Ataque Extra: uma vez por rodada, ao fazer um ataque gasta 2 PE para fazer um ataque adicional.\nNEX 65% — Surto de Adrenalina: gasta 5 PE para realizar uma ação padrão ou de movimento adicional.\nNEX 99% — Sempre Alerta: recebe ação padrão adicional no início de cada cena de combate." },
  { id:"c-t-tropa",        name:"Tropa de Choque", source:"livro-basico", class:"combatente", category:"tropa-de-choque", categoryType:"trilha", description:"NEX 10% — Casca Grossa: +1 PV por 5% NEX + ao bloquear soma Vigor na resistência a dano.\nNEX 40% — Cai Dentro: reação + 1 PE quando oponente em alcance curto atacar aliado, forçando-o a fazer Vontade (DT Vig) ou atacar você.\nNEX 65% — Duro de Matar: ao sofrer dano não paranormal, reação + 2 PE para reduzir à metade. NEX 85%: funciona com dano paranormal também.\nNEX 99% — Inquebrável: enquanto machucado recebe +5 Defesa e RD 5. Enquanto morrendo não fica indefeso e ainda pode agir." },
]

// ── COMBATENTE — Sobrevivendo ao Horror ──────────────────────────────────────
const COMBATENTE_SAH: OPHabilidadeDef[] = [
  { id:"c-t-agente-secreto", name:"Agente Secreto", source:"sobrevivendo-ao-horror", class:"combatente", category:"agente-secreto", categoryType:"trilha", description:"NEX 10% — Carteirada: treinamento em Diplomacia ou Enganação. Recebe documentos especiais no início de cada missão com privilégios (acesso a locais, portar armas, autoridade investigativa).\nNEX 40% — O Sorriso: +2 em Diplomacia e Enganação. Ao falhar em teste com NPCs, pode gastar 2 PE para tentar novamente com bônus.\nNEX 65% e NEX 99%: ver texto completo em Sobrevivendo ao Horror." },
  { id:"c-t-cacador",        name:"Caçador",        source:"sobrevivendo-ao-horror", class:"combatente", category:"cacador", categoryType:"trilha", description:"Trilha focada em rastreamento e eliminação de criaturas específicas. Ver texto completo em Sobrevivendo ao Horror." },
  { id:"c-acrobatico",       name:"Acrobático",     source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Acrobacia ou +2. Terreno difícil não reduz deslocamento nem impede investidas.", prereq:"Agi 2" },
  { id:"c-as-volante",       name:"Ás do Volante",  source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Pilotagem ou +2. Uma vez por rodada ao tomar dano em veículo, teste de Pilotagem para evitar o dano.", prereq:"Agi 2" },
  { id:"c-atletico",         name:"Atlético",       source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Atletismo ou +2. +3m no deslocamento.", prereq:"For 2" },
  { id:"c-atraente",         name:"Atraente",       source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"+5 em Artes, Diplomacia, Enganação e Intimidação contra pessoas atraídas por você.", prereq:"Pre 2" },
  { id:"c-caminho-fuga",     name:"Caminho para Fuga", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Ao usar sacrifício em perseguição, gasta 1 PE para +5 extra nos aliados. Ao usar chamar atenção em furtividade, 1 PE para −2 na visibilidade de aliados próximos." },
  { id:"c-ciente-cicatrizes",name:"Ciente das Cicatrizes", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Usa Luta ou Pontaria no lugar de outras perícias para testes relacionados a armas ou ferimentos.", prereq:"treinado em Luta ou Pontaria" },
  { id:"c-correria",         name:"Correria Desesperada", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"+3m no deslocamento + +5 em testes de perícia para fugir em perseguição." },
  { id:"c-dedos-ageis",      name:"Dedos Ágeis",    source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Crime ou +2. Pode arrombar (ação padrão), furtar (ação livre, 1/rodada) e sabotar (ação completa).", prereq:"Agi 2" },
  { id:"c-detector-mentiras",name:"Detector de Mentiras", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Intuição ou +2. Outros sofrem −10 em Enganação para mentir pra você.", prereq:"Pre 2" },
  { id:"c-especialista-emerg",name:"Especialista em Emergências", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Treinamento em Medicina ou +2. Aplica cicatrizantes como ação de movimento.", prereq:"Int 2" },
  { id:"c-estigmado",        name:"Estigmado",      source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Ao sofrer dano mental de medo, pode converter em perda de PV no lugar." },
  { id:"c-engolir-choro",    name:"Engolir o Choro",source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Não sofre penalidades por condições em testes de fuga e Furtividade." },
  { id:"c-foco-pericia",     name:"Foco em Perícia", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Escolhe uma perícia. Ao testá-la, rola +5. Pode ser escolhido para perícias diferentes.", prereq:"treinado na perícia" },
  { id:"c-instinto-fuga",    name:"Instinto de Fuga",source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Ao iniciar perseguição, recebe +2 em todos os testes da cena.", prereq:"treinado em Atletismo" },
  { id:"c-inventario-org",   name:"Inventário Organizado", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"Soma Int ao limite de espaços. Itens de 0,5 espaço passam a ocupar 0,25.", prereq:"Int 2" },
  { id:"c-paranoia-def",     name:"Paranoia Defensiva", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Uma vez por cena, gasta uma rodada + 3 PE: você e cada aliado escolhe +5 Defesa contra o próximo ataque OU +5 em um teste até fim da cena." },
  { id:"c-sacrificar-joelhos",name:"Sacrificar os Joelhos", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Uma vez por perseguição, ao usar esforço extra, gasta 2 PE para passar automaticamente.", prereq:"treinado em Atletismo" },
  { id:"c-sem-tempo",        name:"Sem Tempo, Irmão",source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Uma vez por cena de investigação, ao facilitar investigação pode ajudar de forma descuidada — passa automaticamente, mas faz rolagem extra na tabela de eventos." },
  { id:"c-valentao",         name:"Valentão",       source:"sobrevivendo-ao-horror", class:"combatente", category:"poder", categoryType:"poder", description:"Usa Força no lugar de Presença para Intimidação. Uma vez por cena, gasta 1 PE para fazer Intimidação para assustar como ação livre." },
  { id:"c-vitalidade-ref",   name:"Vitalidade Reforçada", source:"sobrevivendo-ao-horror", class:"combatente", category:"poder-geral", categoryType:"poder", description:"+1 PV por 5% NEX + +2 em Fortitude.", prereq:"Vig 2" },
]

// ── ESPECIALISTA — Poderes — Livro de Regras ─────────────────────────────────
const ESPECIALISTA_PODERES_LDR: OPHabilidadeDef[] = [
  { id:"e-artista-marcial",    name:"Artista Marcial",       source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Ataques desarmados causam 1d6 de dano, podem ser letais e contam como armas ágeis. NEX 35%: 1d8. NEX 70%: 1d10." },
  { id:"e-balistica",          name:"Balística Avançada",    source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Proficiência com armas táticas de fogo + +2 em dano com elas." },
  { id:"e-conhecimento-aplic", name:"Conhecimento Aplicado", source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Ao fazer teste de perícia (exceto Luta e Pontaria), gasta 2 PE para mudar o atributo-base para Int.", prereq:"Int 2" },
  { id:"e-hacker",             name:"Hacker",                source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"+5 em Tecnologia para invadir sistemas. Reduz tempo de hacking para ação completa.", prereq:"treinado em Tecnologia" },
  { id:"e-maos-rapidas",       name:"Mãos Rápidas",          source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Ao fazer teste de Crime, paga 1 PE para fazê-lo como ação livre.", prereq:"Agi 3, treinado em Crime" },
  { id:"e-mochila",            name:"Mochila de Utilidades", source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Um item à escolha (exceto armas) conta uma categoria abaixo e ocupa 1 espaço a menos." },
  { id:"e-movimento-tatico",   name:"Movimento Tático",      source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Gasta 1 PE para ignorar penalidade de terreno difícil e escalar até o fim do turno.", prereq:"treinado em Atletismo" },
  { id:"e-na-trilha",          name:"Na Trilha Certa",       source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Ao ter sucesso em procurar pistas, gasta 1 PE para +5 no próximo teste. Custo e bônus acumulam." },
  { id:"e-nerd",               name:"Nerd",                  source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Uma vez por cena, gasta 2 PE para teste de Atualidades DT 20. Se passar, recebe informação útil para a cena." },
  { id:"e-ninja-urbano",       name:"Ninja Urbano",          source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) + +2 em dano com elas." },
  { id:"e-pensamento-agil",    name:"Pensamento Ágil",       source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Uma vez por rodada em investigação, gasta 2 PE para fazer ação de procurar pistas adicional." },
  { id:"e-explosivos",         name:"Perito em Explosivos",  source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Soma Int na DT para resistir a seus explosivos. Pode excluir alvos da explosão igual ao valor de Int." },
  { id:"e-primeira-impressao", name:"Primeira Impressão",    source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"+10 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição feito em uma cena." },
  { id:"e-transcender",        name:"Transcender",           source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Recebe um poder paranormal escolhido, mas não ganha Sanidade nesse aumento de NEX. Pode ser escolhido várias vezes." },
  { id:"e-treinamento-pericia",name:"Treinamento em Perícia",source:"livro-basico", class:"especialista", category:"poder", categoryType:"poder", description:"Escolhe duas perícias e se torna treinado nelas. NEX 35%: pode elevar treinado para veterano. NEX 70%: pode elevar veterano para expert. Pode ser escolhido várias vezes." },
]

// ── ESPECIALISTA — Trilhas — Livro de Regras ─────────────────────────────────
const ESPECIALISTA_TRILHAS_LDR: OPHabilidadeDef[] = [
  { id:"e-t-atirador-elite", name:"Atirador de Elite", source:"livro-basico", class:"especialista", category:"atirador-de-elite", categoryType:"trilha", description:"NEX 10% — Mira de Elite: proficiência com armas de fogo de balas longas + soma Int em dano com elas.\nNEX 40% — Disparo Letal: ao usar mirar, gasta 1 PE para +2 na margem de ameaça do próximo ataque até fim do próximo turno.\nNEX 65% — Disparo Impactante: com arma de fogo calibre grosso, gasta 2 PE para fazer manobras derrubar, desarmar, empurrar e quebrar à distância.\nNEX 99% — Atirar para Matar: acerto crítico com arma de fogo causa dano máximo automático, sem rolar dados." },
  { id:"e-t-infiltrador",    name:"Infiltrador",       source:"livro-basico", class:"especialista", category:"infiltrador", categoryType:"trilha", description:"NEX 10% — Ataque Furtivo: uma vez por rodada, ao acertar alvo desprevenido ou flanqueado em corpo a corpo ou alcance curto, gasta 1 PE para +1d6 dano. NEX 40%: +2d6. NEX 65%: +3d6. NEX 99%: +4d6.\nNEX 40% — Gatuno: +5 em Atletismo e Crime. Pode percorrer deslocamento normal ao se esconder sem penalidade.\nNEX 65% — Assassinar: ação de movimento + 3 PE para analisar alvo. Até fim do próximo turno, primeiro Ataque Furtivo tem dados dobrados. Se causar dano, alvo fica inconsciente ou morrendo (Fortitude DT Agi evita).\nNEX 99% — Sombra Fugaz: ao fazer teste de Furtividade após ação chamativa, gasta 3 PE para não sofrer penalidade de −15." },
  { id:"e-t-medico",         name:"Médico de Campo",   source:"livro-basico", class:"especialista", category:"medico-de-campo", categoryType:"trilha", prereq:"treinado em Medicina e kit de medicina", description:"NEX 10% — Paramédico: ação padrão + 2 PE para curar 2d10 PV de aliado adjacente. NEX 40%: +1d10 (+1 PE). NEX 65%: +1d10 (+1 PE). NEX 99%: +1d10 (+1 PE).\nNEX 40% — Equipe de Trauma: ação padrão + 2 PE para remover condição negativa (exceto morrendo) de aliado adjacente.\nNEX 65% — Resgate: uma vez por rodada, pode se aproximar de aliado machucado/morrendo como ação livre. Ao curar PV ou remover condição, você e o aliado recebem +5 Defesa.\nNEX 99% — Reanimação: uma vez por cena, ação completa + 10 PE para trazer de volta um personagem morto na mesma cena." },
  { id:"e-t-negociador",     name:"Negociador",        source:"livro-basico", class:"especialista", category:"negociador", categoryType:"trilha", description:"NEX 10% — Eloquência: ação completa + 1 PE por alvo em alcance curto. Teste de Diplomacia/Enganação/Intimidação vs. Vontade dos alvos. Se vencer, ficam fascinados enquanto você se concentrar.\nNEX 40% — Discurso Motivador: ação padrão + 4 PE para que você e aliados em alcance curto ganhem +5 em testes até fim da cena. NEX 65%: pode gastar 8 PE para +10.\nNEX 65% — Eu Conheço um Cara: uma vez por missão, aciona rede de contatos para obter favor.\nNEX 99% — Truque de Mestre: gasta 5 PE para simular o efeito de qualquer habilidade vista em aliados na cena." },
  { id:"e-t-tecnico",        name:"Técnico",           source:"livro-basico", class:"especialista", category:"tecnico", categoryType:"trilha", description:"NEX 10% — Inventário Otimizado: soma Int à Força para calcular capacidade de carga.\nNEX 40% — Remendão: ação completa + 1 PE para remover condição quebrado de equipamento adjacente até fim da cena.\nNEX 65% — Improvisar: ação completa + 2 PE (+ 2 PE por categoria do item) para criar versão funcional de qualquer equipamento geral com materiais ao redor.\nNEX 99% — Preparado para Tudo: ação de movimento + 3 PE por categoria do item para \"lembrar\" que guardou qualquer item (exceto armas) no fundo da bolsa." },
]

// ── ESPECIALISTA — Sobrevivendo ao Horror ────────────────────────────────────
const ESPECIALISTA_SAH: OPHabilidadeDef[] = [
  { id:"e-t-bibliotecario", name:"Bibliotecário", source:"sobrevivendo-ao-horror", class:"especialista", category:"bibliotecario", categoryType:"trilha", description:"NEX 10% — Conhecimento Prático: ao fazer teste de perícia (exceto Luta e Pontaria), gasta 2 PE para mudar atributo-base para Int.\nNEX 40% — Leitor Contumaz: dados da ação de interlúdio ler aumentam para 1d8 e podem ser aplicados em qualquer perícia. Pode gastar 2 PE para +1 dado adicional.\nNEX 65% — Rato de Biblioteca: em ambiente com muitos livros, gasta alguns minutos para receber benefícios de ação de interlúdio ler ou revisar caso.\nNEX 99%: ver texto completo em Sobrevivendo ao Horror." },
  { id:"e-informado",       name:"Informado",    source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Atualidades ou +2. Usa Atualidades no lugar de qualquer perícia para testes envolvendo informações.", prereq:"Int 2" },
  { id:"e-interrogador",    name:"Interrogador", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Intimidação ou +2. Pode fazer Intimidação para coagir como ação padrão (uma vez por cena contra a mesma pessoa).", prereq:"For 2" },
  { id:"e-mentiroso-nato",  name:"Mentiroso Nato", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Enganação ou +2. Penalidade por mentiras muito implausíveis reduzida para −5.", prereq:"Pre 2" },
  { id:"e-observador",      name:"Observador",   source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Investigação ou +2. Soma Int em Intuição.", prereq:"Int 2" },
  { id:"e-pai-pet",         name:"Pai de Pet",   source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Adestramento ou +2. Possui animal de estimação aliado que fornece +2 em duas perícias.", prereq:"Pre 2" },
  { id:"e-palavras-devocao",name:"Palavras de Devoção", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Religião ou +2. Uma vez por cena, 3 PE + ação completa para oração a até 2×Presença pessoas. Todos recebem RD mental 5 até fim da cena.", prereq:"Pre 2" },
  { id:"e-parceiro",        name:"Parceiro",     source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Possui um aliado de um tipo à escolha que o acompanha em missões.", prereq:"treinado em Diplomacia, NEX 30%" },
  { id:"e-pensamento-tatico",name:"Pensamento Tático", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Tática ou +2. Ao passar em Tática para analisar terreno, você e aliados em alcance médio recebem ação de movimento adicional na primeira rodada do próximo combate neste terreno.", prereq:"Int 2" },
  { id:"e-pers-esoterica",  name:"Personalidade Esotérica", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"+3 PE + treinamento em Ocultismo (ou +2 se já treinado).", prereq:"Int 2" },
  { id:"e-persuasivo",      name:"Persuasivo",   source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Diplomacia ou +2. Penalidade por pedir coisas custosas ou perigosas reduzida em −5.", prereq:"Pre 2" },
  { id:"e-pesquisador-cient",name:"Pesquisador Científico", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Ciências ou +2. Pode usar Ciências no lugar de Ocultismo e Sobrevivência para identificar criaturas e animais.", prereq:"Int 2" },
  { id:"e-plano-fuga",      name:"Plano de Fuga",source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Usa Int no lugar de Força para criar obstáculos em perseguição. Uma vez por cena, gasta 2 PE para ser bem-sucedido automaticamente." },
  { id:"e-proativo",        name:"Proativo",     source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Iniciativa ou +2. Ao rolar 19 ou 20 em pelo menos um dado de Iniciativa, recebe ação padrão adicional no primeiro turno.", prereq:"Agi 2" },
  { id:"e-provisoes",       name:"Provisões de Emergência", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Uma vez por missão, ação de interlúdio para recuperar equipamentos equivalentes à patente atual." },
  { id:"e-racionalidade",   name:"Racionalidade Inflexível", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Usa Int no lugar de Pre como atributo-base de Vontade e para calcular PE.", prereq:"Int 3" },
  { id:"e-rato-computador", name:"Rato de Computador", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Tecnologia ou +2. Pode hackear, localizar arquivo ou operar dispositivo como ação completa. Uma vez por cena de investigação, teste de Tecnologia para procurar pistas sem gastar rodada.", prereq:"Int 2" },
  { id:"e-remoer-memorias", name:"Remoer Memórias", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Uma vez por cena, ao fazer teste de perícia baseada em Int ou Pre, gasta 2 PE para substituir por teste de Int DT 15.", prereq:"Int 1" },
  { id:"e-resistir-pressao",name:"Resistir à Pressão", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Uma vez por cena de investigação, gasta 5 PE para aumentar urgência em 1 rodada. Todos recebem +2 em testes nessa rodada.", prereq:"treinado em Investigação" },
  { id:"e-resposta-rapida", name:"Resposta Rápida", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Reflexos ou +2. Ao falhar em Percepção para evitar ficar desprevenido, gasta 2 PE para rolar novamente usando Reflexos.", prereq:"Agi 2" },
  { id:"e-sentidos-aguc",   name:"Sentidos Aguçados", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Percepção ou +2. Não fica desprevenido contra inimigos que não possa ver.", prereq:"Pre 2" },
  { id:"e-sobrevivencialista",name:"Sobrevivencialista", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Sobrevivência ou +2. +2 vs. efeitos de clima. Terreno difícil natural não reduz deslocamento nem impede investidas.", prereq:"Int 2" },
  { id:"e-sorrateiro",      name:"Sorrateiro",   source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Furtividade ou +2. Não sofre penalidade por se mover normalmente enquanto furtivo, nem por seguir alguém sem esconderijos.", prereq:"Agi 2" },
  { id:"e-talentoso",       name:"Talentoso",    source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Artes ou +2. Ao impressionar com Artes, bônus de perícia aumenta +1 para cada 5 pontos acima da DT.", prereq:"Pre 2" },
  { id:"e-teimosia",        name:"Teimosia Obstinada", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Vontade ou +2. Ao fazer Vontade contra condição mental ou efeito de mudança de atitude, gasta 2 PE para +5 no teste.", prereq:"Pre 2" },
  { id:"e-tenacidade",      name:"Tenacidade",   source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"Treinamento em Fortitude ou +2. Enquanto morrendo mas consciente, pode fazer Fortitude (DT 20 +10 por teste anterior na cena) como ação livre para encerrar a condição morrendo.", prereq:"Vig 2" },
  { id:"e-vontade-inab",    name:"Vontade Inabalável", source:"sobrevivendo-ao-horror", class:"especialista", category:"poder-geral", categoryType:"poder", description:"+1 PE por 10% NEX + +2 em Vontade.", prereq:"Pre 2" },
]

// ── OCULTISTA — Poderes — Livro de Regras ────────────────────────────────────
const OCULTISTA_PODERES_LDR: OPHabilidadeDef[] = [
  { id:"o-camuflar",       name:"Camuflar Ocultismo",     source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Ação livre para esconder símbolos gravados em objetos ou na pele. Ao lançar ritual, gasta +2 PE para conjurar sem componentes e sem gesticular." },
  { id:"o-criar-selo",     name:"Criar Selo",             source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Fabrica selos paranormais de rituais conhecidos (ação de interlúdio + PE iguais ao custo do ritual). Máximo de selos = Presença." },
  { id:"o-envolto",        name:"Envolto em Mistério",    source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"+5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo." },
  { id:"o-espec-elemento", name:"Especialista em Elemento", source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Escolhe um elemento. DT para resistir aos rituais desse elemento aumenta em +2." },
  { id:"o-ferramentas",    name:"Ferramentas Paranormais",source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Reduz categoria de item paranormal em I. Pode ativar itens paranormais sem pagar PE." },
  { id:"o-fluxo-poder",    name:"Fluxo de Poder",         source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Pode manter dois efeitos sustentados de rituais simultaneamente com uma ação livre, pagando cada custo separadamente.", prereq:"NEX 60%" },
  { id:"o-guiado",         name:"Guiado pelo Paranormal", source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Uma vez por cena, gasta 2 PE para fazer ação de investigação adicional." },
  { id:"o-identificacao",  name:"Identificação Paranormal", source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"+10 em Ocultismo para identificar criaturas, objetos ou rituais." },
  { id:"o-improvisar-comp",name:"Improvisar Componentes", source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Uma vez por cena, ação completa + teste de Investigação DT 15. Se passar, encontra objetos que servem como componentes de um elemento à escolha." },
  { id:"o-intuicao",       name:"Intuição Paranormal",    source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Ao facilitar investigação, soma Int ou Pre no teste (à sua escolha)." },
  { id:"o-mestre-elemento",name:"Mestre em Elemento",     source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Escolhe um elemento. Custo de rituais desse elemento −1 PE.", prereq:"Especialista em Elemento no elemento, NEX 45%" },
  { id:"o-ritual-potente", name:"Ritual Potente",         source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Soma Int nas rolagens de dano ou efeitos de cura dos rituais.", prereq:"Int 2" },
  { id:"o-ritual-predileto",name:"Ritual Predileto",      source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Escolhe um ritual conhecido. Custo reduzido em −1 PE. Acumula com outras reduções." },
  { id:"o-tatuagem",       name:"Tatuagem Ritualística",  source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Símbolos na pele reduzem em −1 PE o custo de rituais de alcance pessoal com você como alvo." },
  { id:"o-transcender",    name:"Transcender",            source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Recebe um poder paranormal escolhido, mas não ganha Sanidade nesse aumento de NEX. Pode ser escolhido várias vezes." },
  { id:"o-treinamento",    name:"Treinamento em Perícia", source:"livro-basico", class:"ocultista", category:"poder", categoryType:"poder", description:"Escolhe duas perícias e se torna treinado nelas. NEX 35%: pode elevar treinado para veterano. NEX 70%: pode elevar veterano para expert. Pode ser escolhido várias vezes." },
]

// ── OCULTISTA — Trilhas — Livro de Regras ────────────────────────────────────
const OCULTISTA_TRILHAS_LDR: OPHabilidadeDef[] = [
  { id:"o-t-conduite",    name:"Conduíte",          source:"livro-basico", class:"ocultista", category:"conduite", categoryType:"trilha", description:"NEX 10% — Ampliar Ritual: ao lançar ritual, gasta +2 PE para aumentar alcance um passo ou dobrar área de efeito.\nNEX 40% — Acelerar Ritual: uma vez por rodada, aumenta custo de ritual em 4 PE para conjurá-lo como ação livre.\nNEX 65% — Anular Ritual: ao ser alvo de ritual, gasta PE iguais ao custo do ritual e faz teste oposto de Ocultismo. Se vencer, anula o ritual.\nNEX 99% — Canalizar o Medo: aprende o ritual Canalizar o Medo." },
  { id:"o-t-flagelador",  name:"Flagelador",        source:"livro-basico", class:"ocultista", category:"flagelador", categoryType:"trilha", description:"NEX 10% — Poder do Flagelo: ao conjurar ritual, pode gastar PV para pagar PE à taxa de 2 PV por PE. PV gastos só recuperados com descanso.\nNEX 40% — Abraçar a Dor: ao sofrer dano não paranormal, reação + 2 PE para reduzir à metade.\nNEX 65% — Absorver Agonia: ao reduzir inimigos a 0 PV com ritual, recebe PE temporários = círculo do ritual.\nNEX 99% — Medo Tangível: aprende o ritual Medo Tangível." },
  { id:"o-t-graduado",    name:"Graduado",          source:"livro-basico", class:"ocultista", category:"graduado", categoryType:"trilha", description:"NEX 10% — Saber Ampliado: aprende ritual de 1º círculo extra. A cada novo círculo desbloqueado, aprende ritual adicional daquele círculo.\nNEX 40% — Grimório Ritualístico: cria grimório com rituais extras (Int rituais de 1º ou 2º círculo). Para conjurar, precisa do grimório e gasta ação completa para folhear.\nNEX 65% — Rituais Eficientes: DT para resistir a todos os rituais aumenta em +5.\nNEX 99% — Conhecendo o Medo: aprende o ritual Conhecendo o Medo." },
  { id:"o-t-intuitivo",   name:"Intuitivo",         source:"livro-basico", class:"ocultista", category:"intuitivo", categoryType:"trilha", description:"NEX 10% — Mente Sã: resistência paranormal +5.\nNEX 40% — Presença Poderosa: adiciona Presença ao limite de PE por turno, mas apenas para conjurar rituais.\nNEX 65% — Inabalável: resistência a dano mental e paranormal 10. Ao ser alvo de efeito paranormal com teste de Vontade para reduzir dano à metade, não sofre dano algum se passar.\nNEX 99% — Presença do Medo: aprende o ritual Presença do Medo." },
  { id:"o-t-lamina",      name:"Lâmina Paranormal", source:"livro-basico", class:"ocultista", category:"lamina-paranormal", categoryType:"trilha", description:"NEX 10% — Lâmina Maldita: aprende Amaldiçoar Arma (ou −1 PE se já conhece). Pode usar Ocultismo no lugar de Luta/Pontaria para ataques com a arma amaldiçoada.\nNEX 40% — Gladiador Paranormal: ao acertar ataque corpo a corpo, recebe 2 PE temporários.\nNEX 65% — Conjuração Marcial: uma vez por rodada, ao lançar ritual de ação padrão, gasta 2 PE para fazer ataque corpo a corpo como ação livre.\nNEX 99% — Lâmina do Medo: aprende o ritual Lâmina do Medo." },
]

// ── OCULTISTA — Sobrevivendo ao Horror ───────────────────────────────────────
const OCULTISTA_SAH: OPHabilidadeDef[] = [
  { id:"o-t-exorcista",     name:"Exorcista",             source:"sobrevivendo-ao-horror", class:"ocultista", category:"exorcista", categoryType:"trilha", description:"NEX 10% — Revelação do Mal: treinamento em Religião ou +2. Pode usar Religião no lugar de Investigação e Percepção para notar pistas paranormais, e no lugar de Ocultismo.\nNEX 40% — Poder da Fé: torna-se veterano em Religião ou recebe +5 se já for veterano. Bônus vs. efeitos mentais baseados na fé.\nNEX 65% e NEX 99%: ver texto completo em Sobrevivendo ao Horror." },
  { id:"o-sincronia",       name:"Sincronia Paranormal",  source:"sobrevivendo-ao-horror", class:"ocultista", category:"poder", categoryType:"poder", description:"Gasta ação padrão + 2 PE para estabelecer sincronia mental com aliados que já sobreviveram a encontro paranormal juntos. No início de cada rodada, distribui +5 de bônus = Presença entre os participantes. Custa 1 PE por rodada.", prereq:"Pre 2" },
  { id:"o-tracado",         name:"Traçado Conjuratório",  source:"sobrevivendo-ao-horror", class:"ocultista", category:"poder", categoryType:"poder", description:"Gasta 1 PE + ação completa para traçar símbolo paranormal no chão (1 espaço de 1,5m). Enquanto estiver no símbolo, pode usá-lo para reforçar rituais de formas variadas." },
]

// ── ARQUIVOS SECRETOS (AS#3–6 agrupados) ────────────────────────────────────
const ARQUIVOS_SECRETOS_HABILIDADES: OPHabilidadeDef[] = []

// ── PODERES PARANORMAIS ───────────────────────────────────────────────────────
// Acessados via poder de classe Transcender. Disponíveis a Combatente, Especialista e Ocultista.

const PODERES_PARANORMAIS_GERAIS_LDR: OPHabilidadeDef[] = [
  { id:"pp-aprender-ritual",    name:"Aprender Ritual",    source:"livro-basico", class:"paranormal", category:"geral", categoryType:"poder",
    description:"Aprende e pode conjurar um ritual de 1º círculo. Pode substituir um ritual já conhecido por outro. NEX 45%: aprende até 2º círculo. NEX 75%: até 3º círculo. Sujeito ao limite de rituais. Conta como poder do elemento do ritual escolhido." },
  { id:"pp-resistir-elemento",  name:"Resistir a Elemento", source:"livro-basico", class:"paranormal", category:"geral", categoryType:"poder",
    description:"Escolhe Conhecimento, Energia, Morte ou Sangue. Recebe resistência 10 contra esse elemento. Afinidade: resistência aumenta para 20." },
  { id:"pp-afinidade-elemental",name:"Afinidade Elemental", source:"livro-basico", class:"paranormal", category:"geral", categoryType:"poder",
    description:"Ao atingir NEX 50%, ao transcender pela primeira vez desenvolve afinidade com um elemento escolhido (Conhecimento, Energia, Morte ou Sangue). Benefícios: não precisa de componentes ritualísticos para rituais do elemento; +OO em testes contra efeitos do seu elemento (mas –OO contra o elemento opressor); pode escolher poderes do seu elemento uma segunda vez para ganhar o benefício de Afinidade." },
]

const PODERES_PARANORMAIS_CONHECIMENTO_LDR: OPHabilidadeDef[] = [
  { id:"pp-expansao-conhecimento",   name:"Expansão de Conhecimento",   source:"livro-basico", class:"paranormal", category:"conhecimento", categoryType:"poder", prereq:"Conhecimento 1",
    description:"Aprende um poder de classe que não pertença à sua classe (respeitando pré-requisitos). Afinidade: aprende um segundo poder de classe fora da sua classe." },
  { id:"pp-percepcao-paranormal",    name:"Percepção Paranormal",        source:"livro-basico", class:"paranormal", category:"conhecimento", categoryType:"poder",
    description:"Em investigação, ao procurar pistas, pode rolar novamente um dado com resultado menor que 10 (deve aceitar a segunda rolagem). Afinidade: pode rolar novamente até dois dados com resultado menor que 10." },
  { id:"pp-precognicao",             name:"Precognição",                 source:"livro-basico", class:"paranormal", category:"conhecimento", categoryType:"poder", prereq:"Conhecimento 1",
    description:"+2 em Defesa e em testes de resistência. Afinidade: fica imune à condição desprevenido." },
  { id:"pp-sensitivo",               name:"Sensitivo",                   source:"livro-basico", class:"paranormal", category:"conhecimento", categoryType:"poder",
    description:"+5 em Diplomacia, Intimidação e Intuição por sentir emoções e intenções dos outros. Afinidade: em testes opostos usando essas perícias, o oponente sofre –O." },
  { id:"pp-visao-do-oculto",         name:"Visão do Oculto",             source:"livro-basico", class:"paranormal", category:"conhecimento", categoryType:"poder",
    description:"+5 em Percepção e enxerga no escuro. Afinidade: ignora camuflagem." },
]

const PODERES_PARANORMAIS_ENERGIA_LDR: OPHabilidadeDef[] = [
  { id:"pp-afortunado",         name:"Afortunado",          source:"livro-basico", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Uma vez por rolagem, pode rolar novamente um resultado 1 em qualquer dado que não seja d20. Afinidade: também pode rolar novamente um resultado 1 em d20, uma vez por teste." },
  { id:"pp-campo-protetor",     name:"Campo Protetor",      source:"livro-basico", class:"paranormal", category:"energia", categoryType:"poder", prereq:"Energia 1",
    description:"Ao usar a ação esquiva, gasta 1 PE para +5 em Defesa. Afinidade: também recebe +5 em Reflexos e, até o início do próximo turno, se passar em teste de Reflexos que reduziria o dano à metade, em vez disso não sofre nenhum dano." },
  { id:"pp-causalidade-fortuita",name:"Causalidade Fortuita",source:"livro-basico", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Em investigação, a DT para procurar pistas diminui em –5 até você encontrar uma pista. Afinidade: a DT sempre diminui em –5 para você." },
  { id:"pp-golpe-de-sorte",     name:"Golpe de Sorte",      source:"livro-basico", class:"paranormal", category:"energia", categoryType:"poder", prereq:"Energia 1",
    description:"+1 na margem de ameaça em todos os ataques. Afinidade: +1 no multiplicador de crítico." },
  { id:"pp-manipular-entropia", name:"Manipular Entropia",  source:"livro-basico", class:"paranormal", category:"energia", categoryType:"poder", prereq:"Energia 1",
    description:"Gasta 2 PE para fazer um alvo em alcance curto (exceto você) rolar novamente um dos dados em um teste de perícia. Afinidade: o alvo rola novamente todos os dados que você escolher." },
]

const PODERES_PARANORMAIS_MORTE_LDR: OPHabilidadeDef[] = [
  { id:"pp-encarar-morte",       name:"Encarar a Morte",       source:"livro-basico", class:"paranormal", category:"morte", categoryType:"poder",
    description:"Durante cenas de ação, limite de gasto de PE +1 (não afeta DT). Afinidade: limite de PE +2 (total +3 acima do normal)." },
  { id:"pp-escapar-morte",       name:"Escapar da Morte",       source:"livro-basico", class:"paranormal", category:"morte", categoryType:"poder", prereq:"Morte 1",
    description:"Uma vez por cena, quando receber dano que o deixaria com 0 PV, fica com 1 PV. Não funciona com dano massivo. Afinidade: evita o dano completamente. Com dano massivo, fica com 1 PV." },
  { id:"pp-potencial-aprimorado",name:"Potencial Aprimorado",   source:"livro-basico", class:"paranormal", category:"morte", categoryType:"poder", prereq:"Morte 1",
    description:"+1 PE por NEX (retroativo e prospectivo). Afinidade: +2 PE por NEX." },
  { id:"pp-potencial-reaproveitado",name:"Potencial Reaproveitado",source:"livro-basico", class:"paranormal", category:"morte", categoryType:"poder",
    description:"Uma vez por rodada, ao passar em teste de resistência, ganha 2 PE temporários cumulativos (desaparecem no fim da cena). Afinidade: ganha 3 PE temporários." },
  { id:"pp-surto-temporal",      name:"Surto Temporal",         source:"livro-basico", class:"paranormal", category:"morte", categoryType:"poder", prereq:"Morte 2",
    description:"Uma vez por cena, durante seu turno, gasta 3 PE para realizar ação padrão adicional. Afinidade: pode usar uma vez por turno." },
]

const PODERES_PARANORMAIS_SANGUE_LDR: OPHabilidadeDef[] = [
  { id:"pp-anatomia-insana",name:"Anatomia Insana",source:"livro-basico", class:"paranormal", category:"sangue", categoryType:"poder", prereq:"Sangue 2",
    description:"50% de chance (resultado par em 1d4) de ignorar dano adicional de acerto crítico ou ataque furtivo. Afinidade: imunidade total a efeitos de acertos críticos e ataques furtivos." },
  { id:"pp-arma-de-sangue", name:"Arma de Sangue",  source:"livro-basico", class:"paranormal", category:"sangue", categoryType:"poder",
    description:"Ação de movimento + 2 PE para produzir garras, chifres ou lâmina de sangue cristalizado. Arma simples leve, causa 1d6 de dano de Sangue. Uma vez por turno ao usar agredir, gasta 1 PE para ataque corpo a corpo adicional. Dura até fim da cena. Afinidade: a arma torna-se permanente e causa 1d10 de dano." },
  { id:"pp-sangue-de-ferro",name:"Sangue de Ferro",  source:"livro-basico", class:"paranormal", category:"sangue", categoryType:"poder",
    description:"+2 PV por NEX (retroativo e prospectivo). Afinidade: +5 em Fortitude e imunidade a venenos e doenças." },
  { id:"pp-sangue-fervente",name:"Sangue Fervente",  source:"livro-basico", class:"paranormal", category:"sangue", categoryType:"poder", prereq:"Sangue 2",
    description:"Enquanto machucado, recebe +1 em Agilidade ou Força (escolhe quando ativado). Afinidade: bônus aumenta para +2." },
  { id:"pp-sangue-vivo",    name:"Sangue Vivo",       source:"livro-basico", class:"paranormal", category:"sangue", categoryType:"poder", prereq:"Sangue 1",
    description:"Na primeira vez que ficar machucado em uma cena, recebe cura acelerada 2. Nunca cura acima de metade dos PV máximos. Termina no fim da cena ou ao perder a condição machucado. Afinidade: cura acelerada aumenta para 5." },
]

const PODERES_PARANORMAIS_SAH: OPHabilidadeDef[] = [
  // Conhecimento
  { id:"pp-absorver-conhecimento",name:"Absorver Conhecimento",  source:"sobrevivendo-ao-horror", class:"paranormal", category:"conhecimento", categoryType:"poder",
    description:"Ação completa + 2 PE para tocar objeto escrito e fazer uma pergunta. Se a resposta estiver armazenada nele, obtém automaticamente. Combina com ação interlúdio ler para +1 passo no dado de bônus. Afinidade: ao usar ritual de Conhecimento em alvo que possa tocar, custo reduzido em –1 PE." },
  { id:"pp-apatia-herege",        name:"Apatia Herege",          source:"sobrevivendo-ao-horror", class:"paranormal", category:"conhecimento", categoryType:"poder", prereq:"Conhecimento 1",
    description:"Ao fazer teste contra condição de medo, gasta 2 PE para rolar novamente (deve aceitar a segunda). Afinidade: pode usar depois de saber se passou, e escolhe a melhor das duas rolagens." },
  // Energia
  { id:"pp-conexao-empatica",    name:"Conexão Empática",        source:"sobrevivendo-ao-horror", class:"paranormal", category:"energia", categoryType:"poder", prereq:"Energia 1",
    description:"Ação completa + 2 PE para tocar objeto elétrico ligado e conversar com ele como se fosse senciente até o fim da cena. O objeto tem percepção limitada e personalidade definida pelo que contém. Afinidade: +5 em testes de perícias baseadas em Int ou Pre com o item." },
  { id:"pp-valer-caos",          name:"Valer-se do Caos",        source:"sobrevivendo-ao-horror", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Ao fazer um teste, pode tentar controlar o caos: recebe +O nesse teste, mas se falhar ou se o dado adicional resultar em 5 ou menos, perde 1d4 pontos de Sanidade. Afinidade: perde Sanidade se falhar ou se o O extra resultar em 1 ou 2." },
  // Morte
  { id:"pp-antecipar-vitalidade",name:"Antecipar Vitalidade",    source:"sobrevivendo-ao-horror", class:"paranormal", category:"morte", categoryType:"poder",
    description:"Ao fazer um teste, pode acumular uma carga de antecipação para +O nesse teste. Máximo de cargas = Vigor. Enquanto tiver cargas, em cada ação de interlúdio dormir perde uma carga em vez de recuperar PV. Se acumular 2+ cargas, perde 2 cargas por ação dormir." },
  { id:"pp-aura-de-pavor",       name:"Aura de Pavor",           source:"sobrevivendo-ao-horror", class:"paranormal", category:"morte", categoryType:"poder",
    description:"Gasta 2 PE + ação de movimento para deixar uma pessoa ou animal em alcance médio apavorado (Vontade DT Pre reduz para abalado). Termina ao fim da cena, se o alvo se afastar ou se usar em outro alvo. Mesmo ser só pode ser afetado uma vez por dia. Afinidade: DT +5 e pode afetar quaisquer alvos escolhidos no alcance." },
  // Sangue
  { id:"pp-espreitar-besta",     name:"Espreitar da Besta",      source:"sobrevivendo-ao-horror", class:"paranormal", category:"sangue", categoryType:"poder",
    description:"+5 em Furtividade. Em perseguições como caçador, pode usar Furtividade em vez de Atletismo. Em cenas de furtividade, movimentos calculados pelos instintos permitem ações discretas sem penalidade de –O. Afinidade: bônus em Furtividade aumenta para +10." },
  { id:"pp-instintos-sanguinarios",name:"Instintos Sanguinários",source:"sobrevivendo-ao-horror", class:"paranormal", category:"sangue", categoryType:"poder",
    description:"Recebe visão no escuro e faro. Afinidade: não pode ser flanqueado, não fica desprevenido, +5 em resistência contra armadilhas da realidade ou paranormais." },
]

const PODERES_PARANORMAIS_AS: OPHabilidadeDef[] = [
  // AS#3 — Conhecimento
  { id:"pp-conhecimento-direcao",  name:"Conhecimento de Direção Precognitiva", source:"arquivos-secretos", class:"paranormal", category:"conhecimento", categoryType:"poder",
    description:"+5 em Percepção ou Sobrevivência para se localizar ou orientar até um local, mesmo nunca tendo visto ou sabido sua localização. Afinidade: bônus aumenta para +10." },
  // AS#3 — Energia
  { id:"pp-instrumento-eletrico",  name:"Instrumento Elétrico de Combate",      source:"arquivos-secretos", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Transforma instrumento musical em arma permanente de Energia: tática amaldiçoada, duas mãos, ataques à distância em alcance curto com ondas sonoras, usa Artes para atacar, dano 2d8 de Energia, soma Presença no dano, crítico 20/x2, Cat. II, 2 espaços. Afinidade: atinge todos os alvos à sua escolha em alcance curto." },
  // AS#3 — Sacrifício (exclusivo de personagens Sacrifício do Hexatombe)
  { id:"pp-arrogancia-diabólica", name:"Arrogância Diabólica",  source:"arquivos-secretos", class:"paranormal", category:"sacrificio", categoryType:"poder", prereq:"Ser o sacrifício da Arrogância",
    description:"Ação padrão + 3 PE para dizer a uma pessoa em alcance médio que ela pode fazer o que quiser. Vontade DT Pre+5: se falhar, faz ação extremamente imprudente no próximo turno. Se passar, sofre 2d6 de dano mental." },
  { id:"pp-causar-culpa",          name:"Causar Culpa",          source:"arquivos-secretos", class:"paranormal", category:"sacrificio", categoryType:"poder", prereq:"Ser o sacrifício da Culpa",
    description:"Ação padrão + 3 PE para causar sentimento de culpa terrível em pessoa em alcance curto até fim da cena. Vontade DT Pre+5: se falhar, fica indefeso com memórias vívidas das piores coisas que fez. Pode refazer o teste no início de cada turno." },
  { id:"pp-despertar-obsessao",    name:"Despertar Obsessão",    source:"arquivos-secretos", class:"paranormal", category:"sacrificio", categoryType:"poder", prereq:"Ser o sacrifício da Obsessão",
    description:"Ação padrão + 3 PE para encarar pessoa em alcance curto. Se desviar o olhar: fica desprevenido contra seus ataques por 1 rodada. Se encarar de volta: Vontade DT Pre+5 — se falhar, deve gastar todas as ações para se aproximar e adorar você, ou tem impulso de se automotilar." },
  // AS#4 — Energia
  { id:"pp-foco-gravitacional",    name:"Foco Gravitacional",    source:"arquivos-secretos", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Escolhe um equipamento. Enquanto guardado com você, ocupa 0 espaços. Quando empunhado, tem 25% de chance de voar para espaço em alcance curto (escolha do mestre). Se destruído, escolhe outro. Afinidade: aumenta para três equipamentos." },
  { id:"pp-sobrepor-imprevisivel", name:"Sobrepor Imprevisível", source:"arquivos-secretos", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Uma vez por rodada no início dela, gasta 2 PE para rolar 1d20. Se par, soma ao valor de iniciativa. Se ímpar, subtrai. Posição na ordem de iniciativa muda de acordo. Afinidade: rola 2d20 e escolhe o resultado preferido em um dos dados." },
  { id:"pp-traco-inconsistencia",  name:"Traço de Inconsistência",source:"arquivos-secretos", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Gasta 2 PE como reação para esconder sua identidade em imagens digitais no momento em que é fotografado ou filmado. Afinidade: sua presença torna-se permanentemente incapaz de ser capturada por imagens digitais e sua voz fica distorcida em gravações." },
  // AS#6 — Morte
  { id:"pp-escudo-espiral",        name:"Escudo Espiral Temporal",source:"arquivos-secretos", class:"paranormal", category:"morte", categoryType:"poder", prereq:"Morte 2",
    description:"Uma vez por rodada, gasta 2 PE como reação ao ser atingido por arma ou munição. Munição: recebe RD 20 e o projétil se desfaz em cinzas. Corpo a corpo: recebe RD 10 e a arma envelhece (10 de dano químico). Não funciona contra dano de Energia. Afinidade: pode usar mais de uma vez por rodada e o dano químico muda para 20." },
  { id:"pp-grilhoes-lodo",         name:"Grilhões de Lodo",       source:"arquivos-secretos", class:"paranormal", category:"morte", categoryType:"poder",
    description:"Gasta 2 PE para criar área de 9m de raio com correntes e vinhas de Lodo. Dura até fim da cena. Todos na área (exceto você e criaturas de Morte) sofrem 3d6 de dano de Morte e ficam lentos (Fortitude DT atributo mais alto reduz dano à metade e evita condição por 1 rodada). Afinidade: dano muda para 6d6 e condição muda para enredado." },
  // AS#6 — Energia
  { id:"pp-salto-de-dados",        name:"Salto de Dados",         source:"arquivos-secretos", class:"paranormal", category:"energia", categoryType:"poder",
    description:"Ação completa + 2 PE para marcar símbolo no próprio corpo. Dura 1 dia ou até ser consumido. Não pode ter dois símbolos simultaneamente. A qualquer momento, gasta 3 PE como reação para consumir a marca e retornar todo seu estado físico e mental (PV, PE, condições, efeitos, estatísticas) ao momento em que fez o símbolo." },
]

export const HABILIDADES_OP: OPHabilidadeDef[] = [
  ...COMBATENTE_PODERES_LDR,
  ...COMBATENTE_TRILHAS_LDR,
  ...COMBATENTE_SAH,
  ...ESPECIALISTA_PODERES_LDR,
  ...ESPECIALISTA_TRILHAS_LDR,
  ...ESPECIALISTA_SAH,
  ...OCULTISTA_PODERES_LDR,
  ...OCULTISTA_TRILHAS_LDR,
  ...OCULTISTA_SAH,
  ...ARQUIVOS_SECRETOS_HABILIDADES,
  ...PODERES_PARANORMAIS_GERAIS_LDR,
  ...PODERES_PARANORMAIS_CONHECIMENTO_LDR,
  ...PODERES_PARANORMAIS_ENERGIA_LDR,
  ...PODERES_PARANORMAIS_MORTE_LDR,
  ...PODERES_PARANORMAIS_SANGUE_LDR,
  ...PODERES_PARANORMAIS_SAH,
  ...PODERES_PARANORMAIS_AS,
]

// ─── RITUAIS — Livro de Regras ────────────────────────────────────────────────
const RITUAIS_LDR: OPRitualDef[] = [
  // ── 1º Círculo — Geral ───────────────────────────────────────────────────────
  { id:"rt-amaldicoar-arma", name:"Amaldiçoar Arma", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"toque", duration:"cena",
    description:"Escolhe um elemento (Conhecimento, Energia, Morte ou Sangue); a arma ou munição tocada causa +1d6 do tipo do elemento escolhido.\nDiscente (+2 PE): +2d6 (2º círculo).\nVerdadeiro (+5 PE): +4d6 (3º círculo e afinidade)." },

  // ── 1º Círculo — Conhecimento ─────────────────────────────────────────────────
  { id:"rt-compreensao-paranormal", name:"Compreensão Paranormal", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"toque", duration:"cena", resistance:"Vontade anula (involuntário)",
    description:"Entende qualquer idioma humano falado ou escrito em objeto, ou permite comunicação com um ser. Com animal, percebe sentimentos básicos.\nDiscente (+2 PE): alcance curto, alvos escolhidos.\nVerdadeiro (+5 PE): alcance pessoal, você fala, entende e escreve qualquer idioma humano (3º círculo)." },
  { id:"rt-enfeiticar", name:"Enfeitiçar", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"curto", duration:"cena", resistance:"Vontade anula",
    description:"Alvo torna-se prestativo: +10 em Diplomacia com ele. Alvo hostil ou em combate recebe +5 na resistência. Dissipa se você ou aliados agirem hostilmente.\nDiscente (+2 PE): sugere uma ação que o alvo obedece (2º círculo).\nVerdadeiro (+5 PE): afeta todos os alvos no alcance (3º círculo)." },
  { id:"rt-ouvir-sussurros", name:"Ouvir os Sussurros", source:"livro-basico", element:"conhecimento", circle:1, execution:"completa", range:"pessoal", duration:"instantânea",
    description:"Faz uma pergunta sobre evento que está prestes a realizar (resposta sim/não). 1d6 secreto: em 1, o ritual falha e responde 'não'.\nDiscente (+2 PE): pergunta sobre eventos até 1 dia no futuro (2º círculo).\nVerdadeiro (+5 PE): 5 rodadas, 1 pergunta por rodada (3º círculo)." },
  { id:"rt-perturbacao", name:"Perturbação", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"curto", duration:"1 rodada", resistance:"Vontade anula",
    description:"Dá uma ordem simples que o alvo obedece naquela rodada (Fuja / Largue / Pare / Sente-se / Venha).\nDiscente (+2 PE): afeta '1 ser' e adiciona comando 'Sofra' (3d8 Conhecimento + abalado).\nVerdadeiro (+5 PE): até 5 seres ou adiciona comando 'Ataque' (3º círculo)." },
  { id:"rt-tecer-ilusao", name:"Tecer Ilusão", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"médio", duration:"cena", resistance:"Vontade desacredita",
    description:"Cria ilusão visual ou sonora simples em até 4 cubos de 1,5m. Dissipa ao sair do alcance.\nDiscente (+2 PE): até 8 cubos, sustentada, sons complexos + odores + tato, pode movê-la (2º círculo).\nVerdadeiro (+5 PE): ilusão de perigo mortal — falha na Vontade causa 6d6 de Conhecimento (3º círculo)." },
  { id:"rt-terceiro-olho", name:"Terceiro Olho", source:"livro-basico", element:"conhecimento", circle:1, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Enxerga auras paranormais em alcance longo: rituais, itens e criaturas. Detecta elemento e poder aproximado.\nDiscente (+2 PE): duração 1 dia.\nVerdadeiro (+5 PE): também enxerga objetos e seres invisíveis como formas translúcidas." },

  // ── 1º Círculo — Energia ─────────────────────────────────────────────────────
  { id:"rt-amaldicoar-tecnologia", name:"Amaldiçoar Tecnologia", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"toque", duration:"cena",
    description:"O acessório ou arma de fogo tocado recebe uma modificação à escolha.\nDiscente (+2 PE): duas modificações (2º círculo).\nVerdadeiro (+5 PE): três modificações (3º círculo e afinidade)." },
  { id:"rt-coincidencia-forcada", name:"Coincidência Forçada", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"curto", duration:"cena",
    description:"Alvo recebe +2 em testes de perícias.\nDiscente (+2 PE): afeta aliados à escolha (2º círculo).\nVerdadeiro (+5 PE): aliados escolhidos com bônus +5 (3º círculo e afinidade)." },
  { id:"rt-eletrocussao", name:"Eletrocussão", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"curto", duration:"instantânea", resistance:"Fortitude parcial",
    description:"Corrente elétrica causa 3d6 de eletricidade + vulnerável por 1 rodada. Passando: metade do dano, sem condição. Contra eletrônicos: dobro do dano, ignora resistência.\nDiscente (+2 PE): área linha de 30m, 6d6 (2º círculo).\nVerdadeiro (+5 PE): alvos escolhidos, 8d6 cada (3º círculo)." },
  { id:"rt-embaralhar", name:"Embaralhar", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Cria 3 cópias ilusórias, concedendo +6 na Defesa. Cada acerto errado destrói uma cópia (–2 Defesa).\nDiscente (+2 PE): 5 cópias (+10 Defesa, 2º círculo).\nVerdadeiro (+5 PE): 8 cópias (+16 Defesa); cópias destruídas ofuscam o atacante (3º círculo)." },
  { id:"rt-luz", name:"Luz", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"curto", duration:"cena", resistance:"Vontade anula (involuntário)",
    description:"Objeto emite luz colorida em área de 9m de raio.\nDiscente (+2 PE): 4 esferas de luz em alcance longo, cada uma ilumina 6m de raio (2º círculo).\nVerdadeiro (+5 PE): luz cálida como sol — aliados +O em Vontade, inimigos ofuscados (3º círculo)." },
  { id:"rt-polarizacao-caotica", name:"Polarização Caótica", source:"livro-basico", element:"energia", circle:1, execution:"padrão", range:"curto", duration:"sustentada", resistance:"Vontade anula",
    description:"Escolhe Atrair (puxa objeto metálico de espaço 2 por ação de movimento) ou Repelir (RD 5 contra balístico/corte/impacto/perfuração).\nDiscente (+2 PE): expele até 10 objetos ou 10 espaços de uma vez, pode atingir seres.\nVerdadeiro (+5 PE): levita e move seres ou objetos de espaço 10 por até 9m dentro do alcance." },

  // ── 1º Círculo — Morte ────────────────────────────────────────────────────────
  { id:"rt-cicatrizacao", name:"Cicatrização", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"toque", duration:"instantânea",
    description:"Recupera 3d8+3 PV; alvo envelhece 1 ano.\nDiscente (+2 PE): cura 5d8+5 PV (2º círculo).\nVerdadeiro (+9 PE): alcance curto, seres escolhidos, cura 7d8+7 PV (4º círculo e afinidade Morte)." },
  { id:"rt-consumir-manancial", name:"Consumir Manancial", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"pessoal", duration:"instantânea",
    description:"Suga vida de plantas e insetos ao redor; recebe 3d6 PV temporários (até fim da cena).\nDiscente (+2 PE): 6d6 PV temporários (2º círculo).\nVerdadeiro (+5 PE): esfera de 6m de raio — causa 3d6 de Morte em seres vivos e recebe PV temporários igual ao dano total (3º círculo e afinidade)." },
  { id:"rt-decadencia", name:"Decadência", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Fortitude reduz à metade",
    description:"2d8+2 dano de Morte.\nDiscente (+2 PE): sem resistência, 3d8+3; como parte da execução faz ataque corpo a corpo (causa dano da arma + ritual).\nVerdadeiro (+5 PE): alcance pessoal, área explosão de 6m, 8d8+8 (3º círculo)." },
  { id:"rt-definhar", name:"Definhar", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"curto", duration:"cena", resistance:"Fortitude parcial",
    description:"Alvo fica fatigado. Passando na resistência: vulnerável.\nDiscente (+2 PE): exausto (ou fatigado se passar, 2º círculo).\nVerdadeiro (+5 PE): até 5 seres (3º círculo e afinidade Morte)." },
  { id:"rt-espirais-perdicao", name:"Espirais da Perdição", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"curto", duration:"cena",
    description:"Alvo sofre –O em testes de ataque.\nDiscente (+2 PE): –OO (2º círculo).\nVerdadeiro (+8 PE): –OO, seres escolhidos (3º círculo)." },
  { id:"rt-nuvem-cinzas", name:"Nuvem de Cinzas", source:"livro-basico", element:"morte", circle:1, execution:"padrão", range:"curto", duration:"cena",
    description:"Cria nuvem de 6m de raio e 6m de altura: camuflagem a 1,5m, camuflagem total a partir de 3m. Vento forte dispersa em 4 rodadas, vendaval em 1.\nDiscente (+2 PE): seres escolhidos enxergam através (2º círculo).\nVerdadeiro (+5 PE): deslocamento reduzido para 3m dentro + –2 em ataques (3º círculo)." },

  // ── 1º Círculo — Sangue ───────────────────────────────────────────────────────
  { id:"rt-arma-atroz", name:"Arma Atroz", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"toque", duration:"sustentada",
    description:"+2 em testes de ataque e +1 na margem de ameaça.\nDiscente (+2 PE): +5 em testes de ataque (2º círculo).\nVerdadeiro (+5 PE): +5 ataque, +2 margem de ameaça e +2 multiplicador de crítico (3º círculo e afinidade)." },
  { id:"rt-armadura-sangue", name:"Armadura de Sangue", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"pessoal", duration:"cena",
    description:"+5 na Defesa (não cumulativo com bônus de equipamento).\nDiscente (+5 PE): +10 Defesa e RD 5 contra balístico/corte/impacto/perfuração (3º círculo).\nVerdadeiro (+9 PE): +15 Defesa e RD 10 (4º círculo e afinidade)." },
  { id:"rt-corpo-adaptado", name:"Corpo Adaptado", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"toque", duration:"cena",
    description:"Imune a calor/frio extremos, pode respirar na água (ou no ar se aquático), não sufoca em fumaça.\nDiscente (+2 PE): duração 1 dia.\nVerdadeiro (+5 PE): alcance curto, pessoas e animais escolhidos." },
  { id:"rt-distorcer-aparencia", name:"Distorcer Aparência", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"pessoal", duration:"cena", resistance:"Vontade desacredita",
    description:"Muda aparência completamente (altura, peso, voz, digitais, córnea). +10 em Enganação para disfarce.\nDiscente (+2 PE): alcance curto, 1 ser involuntário pode anular.\nVerdadeiro (+5 PE): seres escolhidos (3º círculo)." },
  { id:"rt-fortalecimento-sensorial", name:"Fortalecimento Sensorial", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"pessoal", duration:"cena",
    description:"+O em Investigação, Luta, Percepção e Pontaria.\nDiscente (+2 PE): inimigos –O em ataque contra você (2º círculo).\nVerdadeiro (+5 PE): imune a surpreendido e desprevenido, +10 Defesa e Reflexos (4º círculo e afinidade)." },
  { id:"rt-odio-incontrolavel", name:"Ódio Incontrolável", source:"livro-basico", element:"sangue", circle:1, execution:"padrão", range:"toque", duration:"cena", resistance:"Fortitude parcial",
    description:"+2 em ataque e dano corpo a corpo, RD 5 balístico/corte/impacto/perfuração. Não pode fazer ações de calma/concentração; deve atacar alguém em cada rodada.\nDiscente (+2 PE): ataque adicional ao usar agredir.\nVerdadeiro (+5 PE): +5 bônus; alvo sofre metade do dano (3º círculo e afinidade)." },

  // ── 1º Círculo — Medo ────────────────────────────────────────────────────────
  { id:"rt-cineraria", name:"Cinerária", source:"livro-basico", element:"medo", circle:1, execution:"padrão", range:"curto", duration:"cena",
    description:"Cria nuvem de névoa paranormal de 6m de raio: rituais conjurados dentro têm DT +5.\nDiscente (+2 PE): rituais dentro custam –2 PE.\nVerdadeiro (+5 PE): rituais dentro causam dano maximizado." },

  // ── 2º Círculo — Conhecimento ─────────────────────────────────────────────────
  { id:"rt-aprimorar-mente", name:"Aprimorar Mente", source:"livro-basico", element:"conhecimento", circle:2, execution:"padrão", range:"toque", duration:"cena",
    description:"+1 em Intelecto ou Presença (à escolha; não concede PE ou perícias).\nDiscente (+3 PE): +2 (3º círculo).\nVerdadeiro (+7 PE): +3 (4º círculo e afinidade)." },
  { id:"rt-deteccao-ameacas", name:"Detecção de Ameaças", source:"livro-basico", element:"conhecimento", circle:2, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Esfera de 18m: ao entrar ser hostil ou armadilha na área, sensação de perigo + ação de movimento para Percepção DT 20 (saber direção e distância).\nDiscente (+3 PE): não fica desprevenido contra perigos detectados, +5 vs. armadilhas (3º círculo).\nVerdadeiro (+5 PE): duração 1 dia (4º círculo)." },
  { id:"rt-esconder-dos-olhos", name:"Esconder dos Olhos", source:"livro-basico", element:"conhecimento", circle:2, execution:"livre", range:"pessoal", duration:"1 rodada",
    description:"Invisível (camuflagem total, +15 Furtividade). Encerra ao fazer ataque ou ação hostil.\nDiscente (+3 PE): sustentada, esfera de invisibilidade de 3m ao redor (3º círculo).\nVerdadeiro (+7 PE): ação padrão, toque, 1 ser, sustentada, não dissipa por ação hostil (4º círculo e afinidade)." },
  { id:"rt-invadir-mente", name:"Invadir Mente", source:"livro-basico", element:"conhecimento", circle:2, execution:"padrão", range:"médio ou toque", duration:"instantânea ou 1 dia", resistance:"Vontade parcial",
    description:"Escolhe entre: Rajada Mental (6d6 Conhecimento + atordoado) ou Ligação Telepática (comunicação ilimitada por 1 dia).\nDiscente (+3 PE): rajada 10d6 ou ligação permite ver/ouvir pelos sentidos do alvo (3º círculo).\nVerdadeiro (+7 PE): rajada em seres escolhidos ou ligação entre até 5 pessoas." },
  { id:"rt-localizacao", name:"Localização", source:"livro-basico", element:"conhecimento", circle:2, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Círculo de 90m: indica direção e distância da pessoa ou objeto mais próximo do tipo buscado. Pode ser bloqueado por chumbo.\nDiscente (+3 PE): alcance toque, 1 pessoa, 1 hora, descobre caminho mais direto para entrar ou sair de um lugar.\nVerdadeiro (+7 PE): área de 1km de raio (4º círculo)." },

  // ── 2º Círculo — Energia ─────────────────────────────────────────────────────
  { id:"rt-chamas-caos", name:"Chamas do Caos", source:"livro-basico", element:"energia", circle:2, execution:"padrão", range:"curto", duration:"cena",
    description:"Escolhe: Chamejar (arma +1d6 fogo), Esquentar (objeto 1d6 fogo/rodada), Extinguir (apaga chama Grande, cria fumaça) ou Modelar (move chama Grande 9m/rodada, 3d6 fogo ao atravessar).\nDiscente (+3 PE): sustentada, projeta labareda que causa 4d6 Energia.\nVerdadeiro (+7 PE): dano 8d6 (3º círculo)." },
  { id:"rt-contencao-fantasmagorica", name:"Contenção Fantasmagórica", source:"livro-basico", element:"energia", circle:2, execution:"padrão", range:"médio", duration:"cena", resistance:"Reflexos anula",
    description:"3 laços de Energia deixam alvo agarrado. Gastar ação padrão + Atletismo DT destrói laços. Cada laço: Defesa 10, 10 PV, RD 5, imune a Energia.\nDiscente (+3 PE): 6 laços, pode escolher alvo de cada (mín. 2 por alvo, 3º círculo).\nVerdadeiro (+5 PE): cada laço destruído causa 2d6+2 Energia no alvo agarrado (3º círculo e afinidade)." },
  { id:"rt-dissonancia-acustica", name:"Dissonância Acústica", source:"livro-basico", element:"energia", circle:2, execution:"padrão", range:"médio", duration:"sustentada",
    description:"Esfera de 6m: todos na área ficam surdos e não podem conjurar rituais.\nDiscente (+1 PE): área se move com um objeto; esfera de silêncio de 3m (involuntário pode anular).\nVerdadeiro (+3 PE): duração cena, nenhum som sai da área mas dentro se ouve normalmente e pode conjurar (3º círculo)." },
  { id:"rt-sopro-caos", name:"Sopro do Caos", source:"livro-basico", element:"energia", circle:2, execution:"padrão", range:"médio", duration:"sustentada",
    description:"Escolhe: Ascender (levita ser/objeto Médio até 30m, Fortitude para encerrar), Sopro (cone 4,5m, empurrar com Ocultismo) ou Vento (área de vento forte, Fortitude para manter-se).\nDiscente (+3 PE): afeta Grandes.\nVerdadeiro (+9 PE): afeta Enormes." },
  { id:"rt-tela-ruido", name:"Tela de Ruído", source:"livro-basico", element:"energia", circle:2, execution:"padrão", range:"pessoal", duration:"cena",
    description:"30 PV temporários apenas contra balístico/corte/impacto/perfuração. Alternativa: como reação ao sofrer dano, RD 15 contra aquele dano.\nDiscente (+3 PE): 60 PV temporários, RD 30.\nVerdadeiro (+7 PE): alcance curto, 1 ser Enorme ou menor, cria esfera imóvel que nada atravessa (4º círculo)." },

  // ── 2º Círculo — Morte ────────────────────────────────────────────────────────
  { id:"rt-desacelerar-impacto", name:"Desacelerar Impacto", source:"livro-basico", element:"morte", circle:2, execution:"reação", range:"curto", duration:"até chegar ao solo",
    description:"Alvo cai lentamente (18m/rodada, sem dano de queda). Se projétil: causa metade do dano.\nDiscente (+3 PE): até 100 espaços de objetos." },
  { id:"rt-eco-espiral", name:"Eco Espiral", source:"livro-basico", element:"morte", circle:2, execution:"padrão", range:"curto", duration:"2 rodadas", resistance:"Fortitude reduz à metade",
    description:"Concentra por 1 rodada, descarrega na seguinte — alvo sofre dano de Morte igual ao dano que sofreu na rodada de concentração.\nDiscente (+3 PE): até 5 seres.\nVerdadeiro (+7 PE): até 3 rodadas; concentra nas duas primeiras, descarrega na terceira (4º círculo e afinidade)." },
  { id:"rt-miasma-entropico", name:"Miasma Entrópico", source:"livro-basico", element:"morte", circle:2, execution:"padrão", range:"médio", duration:"instantânea", resistance:"Fortitude parcial",
    description:"Nuvem de 6m: 4d8 químico + enjoado por 1 rodada. Passando: metade do dano, sem condição.\nDiscente (+3 PE): 6d8 de Morte." },
  { id:"rt-paradoxo", name:"Paradoxo", source:"livro-basico", element:"morte", circle:2, execution:"padrão", range:"médio", duration:"instantânea", resistance:"Fortitude reduz à metade",
    description:"Esfera de 6m: 6d6 de Morte em todos na área.\nDiscente (+3 PE): área vira esfera de 1,5m sustentada, 4d6 por rodada no mesmo espaço (mover gasta ação de movimento).\nVerdadeiro (+7 PE): 13d6; reduzido a 0 PV pelo Paradoxo = Fortitude ou vira cinzas e morte imediata (4º círculo)." },
  { id:"rt-velocidade-mortal", name:"Velocidade Mortal", source:"livro-basico", element:"morte", circle:2, execution:"padrão", range:"curto", duration:"sustentada",
    description:"Alvo recebe ação de movimento adicional por turno (não pode conjurar rituais).\nDiscente (+3 PE): em vez de movimento, ação padrão adicional.\nVerdadeiro (+7 PE): seres escolhidos (4º círculo e afinidade)." },

  // ── 2º Círculo — Sangue ───────────────────────────────────────────────────────
  { id:"rt-aprimorar-fisico", name:"Aprimorar Físico", source:"livro-basico", element:"sangue", circle:2, execution:"padrão", range:"toque", duration:"cena",
    description:"+1 em Agilidade ou Força (à escolha).\nDiscente (+3 PE): +2 (3º círculo).\nVerdadeiro (+7 PE): +3 (4º círculo e afinidade)." },
  { id:"rt-descarnar", name:"Descarnar", source:"livro-basico", element:"sangue", circle:2, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Fortitude parcial",
    description:"6d8 dano (metade corte, metade Sangue) + hemorragia severa (Fortitude no início de cada turno: falha = 2d8 Sangue; dois sucessos = estanca). Passando: metade do dano, sem hemorragia.\nDiscente (+3 PE): 10d8 + 4d8 hemorragia (3º círculo).\nVerdadeiro (+7 PE): alcance pessoal, sustentada, ataques corpo a corpo causam +4d8 Sangue + hemorragia automática (3º círculo e afinidade)." },
  { id:"rt-flagelo-sangue", name:"Flagelo de Sangue", source:"livro-basico", element:"sangue", circle:2, execution:"padrão", range:"toque", duration:"cena", resistance:"Fortitude parcial",
    description:"Grava marca com uma ordem no alvo. A cada rodada que desobedecer: 10d6 Sangue + enjoado (Fortitude reduz à metade e evita). Dois turnos passando = marca desaparece.\nDiscente (+3 PE): '1 ser exceto criaturas de Sangue' (3º círculo).\nVerdadeiro (+7 PE): duração 1 dia (4º círculo e afinidade)." },
  { id:"rt-hemofagia", name:"Hemofagia", source:"livro-basico", element:"sangue", circle:2, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Fortitude reduz à metade",
    description:"6d6 Sangue; recupera PV = metade do dano.\nDiscente (+3 PE): sem resistência, faz ataque corpo a corpo + causa dano da arma + ritual (recupera PV = metade do total).\nVerdadeiro (+7 PE): alcance pessoal, sustentada, por ação padrão toca 1 ser, 4d6 Sangue, recupera metade (4º círculo)." },
  { id:"rt-transfusao-vital", name:"Transfusão Vital", source:"livro-basico", element:"sangue", circle:2, execution:"padrão", range:"toque", duration:"instantânea",
    description:"Transfere até 30 dos seus próprios PV para curar o alvo (não fica com menos de 1 PV).\nDiscente (+3 PE): até 50 PV (3º círculo).\nVerdadeiro (+7 PE): até 100 PV (4º círculo)." },

  // ── 2º Círculo — Medo ────────────────────────────────────────────────────────
  { id:"rt-protecao-rituais", name:"Proteção contra Rituais", source:"livro-basico", element:"medo", circle:2, execution:"padrão", range:"toque", duration:"cena",
    description:"RD paranormal 5 e +5 em testes de resistência contra rituais e habilidades de criaturas.\nDiscente (+3 PE): até 5 seres tocados (3º círculo).\nVerdadeiro (+6 PE): até 5 seres, RD 10, +10 em resistências (4º círculo)." },
  { id:"rt-rejeitar-nevoa", name:"Rejeitar Névoa", source:"livro-basico", element:"medo", circle:2, execution:"padrão", range:"curto", duration:"cena",
    description:"Nuvem de 6m: rituais na área custam +2 PE por círculo e execução aumenta um passo. Anula Cinerária (a menos que o conjurador gaste ação completa para manter).\nDiscente (+2 PE): DT de resistência –5 para rituais na área.\nVerdadeiro (+5 PE): dano de rituais na área sempre mínimo." },

  // ── 3º Círculo — Conhecimento ─────────────────────────────────────────────────
  { id:"rt-alterar-memoria", name:"Alterar Memória", source:"livro-basico", element:"conhecimento", circle:3, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Vontade anula",
    description:"Altera ou apaga memórias de até 1 hora atrás. Pode mudar detalhes, não reescrever completamente. Alvo recupera memórias após 1d4 dias.\nVerdadeiro (+4 PE): memórias de até 24h atrás (4º círculo)." },
  { id:"rt-contato-paranormal", name:"Contato Paranormal", source:"livro-basico", element:"conhecimento", circle:3, execution:"completa", range:"pessoal", duration:"1 dia",
    description:"Recebe 6 d6 para somar em testes. A cada resultado 6, a entidade toma 2 SAN. Ritual acaba ao ficar sem dados ou Sanidade 0.\nDiscente (+4 PE): dados d8, resultado 8 = –3 SAN (4º círculo).\nVerdadeiro (+9 PE): dados d12, resultado 12 = –5 SAN (4º círculo e afinidade)." },
  { id:"rt-mergulho-mental", name:"Mergulho Mental", source:"livro-basico", element:"conhecimento", circle:3, execution:"padrão", range:"toque", duration:"sustentada", resistance:"Vontade parcial",
    description:"Enquanto tocando e sustentando, início de cada turno: alvo faz Vontade; falha = responde pergunta sim/não sem poder mentir.\nVerdadeiro (+4 PE): execução 1 dia, alcance ilimitado, requer cuba de ouro + água + máscara de ouro (4º círculo)." },
  { id:"rt-videncia", name:"Vidência", source:"livro-basico", element:"conhecimento", circle:3, execution:"completa", range:"ilimitado", duration:"5 rodadas", resistance:"Vontade anula",
    description:"Através de superfície reflexiva, vê e ouve o alvo e seus arredores (6m em qualquer direção). Alvo refaz Vontade no início de cada turno (2 sucessos = encerra). Bônus/penalidade conforme o conhecimento que você tem do alvo." },

  // ── 3º Círculo — Energia ─────────────────────────────────────────────────────
  { id:"rt-convocacao-instantanea", name:"Convocação Instantânea", source:"livro-basico", element:"energia", circle:3, execution:"padrão", range:"ilimitado", duration:"instantânea", resistance:"Vontade anula",
    description:"Convoca objeto preparado com símbolo do ritual para sua mão. Pode devolvê-lo por até 1h depois (ação de movimento).\nDiscente (+4 PE): até 10 espaços.\nVerdadeiro (+9 PE): 1 recipiente Médio + itens somando até 10 espaços, duração permanente (você perde 1 PE permanentemente ao conjurar)." },
  { id:"rt-salto-fantasma", name:"Salto Fantasma", source:"livro-basico", element:"energia", circle:3, execution:"padrão", range:"médio", duration:"instantânea",
    description:"Teletransporta para ponto já observado pessoalmente, por foto ou vídeo. Não pode aparecer em corpo sólido.\nDiscente (+2 PE): reação, salta 1 espaço adjacente, +10 Defesa e Reflexos contra o ataque.\nVerdadeiro (+4 PE): alcance longo, você + até 2 seres voluntários tocados." },
  { id:"rt-transfigurar-agua", name:"Transfigurar Água", source:"livro-basico", element:"energia", circle:3, execution:"padrão", range:"longo", duration:"cena",
    description:"Esfera de 30m. Escolhe: Congelar, Derreter, Enchente (+4,5m no nível), Evaporar (5d8 Energia; criaturas de Morte dobro do dano) ou Partir (baixa 4,5m, abre caminho seco).\nVerdadeiro (+5 PE): enchente +12m, evaporar 10d8." },
  { id:"rt-transfigurar-terra", name:"Transfigurar Terra", source:"livro-basico", element:"energia", circle:3, execution:"padrão", range:"longo", duration:"instantânea",
    description:"9 cubos de 1,5m. Escolhe: Amolecer (colapso 10d6 impacto ou terreno difícil), Modelar (cria objetos Enormes ou menores de pedra/argila) ou Solidificar (lama/areia vira terra, seres ficam agarrados).\nDiscente (+3 PE): 15 cubos.\nVerdadeiro (+7 PE): também afeta minerais e metais (4º círculo)." },

  // ── 3º Círculo — Morte ────────────────────────────────────────────────────────
  { id:"rt-ancora-temporal", name:"Âncora Temporal", source:"livro-basico", element:"morte", circle:3, execution:"padrão", range:"curto", duration:"cena", resistance:"Vontade parcial",
    description:"Início de cada turno do alvo: Vontade — falha = não pode se deslocar naquele turno. Dois sucessos = efeito termina.\nVerdadeiro (+4 PE): 'seres à sua escolha' (4º círculo)." },
  { id:"rt-poeira-podridao", name:"Poeira da Podridão", source:"livro-basico", element:"morte", circle:3, execution:"padrão", range:"médio", duration:"sustentada", resistance:"Fortitude",
    description:"Nuvem de 6m: ao conjurar e no início de cada turno, 4d8 Morte (Fortitude reduz à metade). Falha: não recupera PV por 1 rodada.\nVerdadeiro (+4 PE): 4d8+16." },
  { id:"rt-tentaculos-lodo", name:"Tentáculos de Lodo", source:"livro-basico", element:"morte", circle:3, execution:"padrão", range:"médio", duration:"cena",
    description:"Círculo de 6m: ao conjurar e no início de cada turno, manobra agarrar (Ocultismo no lugar de Luta) contra cada alvo. Se agarrado novamente: 4d6 (metade impacto, metade Morte). Área é terreno difícil. Tentáculos imunes a dano.\nVerdadeiro (+5 PE): raio 9m, dano 6d6." },
  { id:"rt-zerar-entropia", name:"Zerar Entropia", source:"livro-basico", element:"morte", circle:3, execution:"padrão", range:"curto", duration:"cena", resistance:"Vontade parcial",
    description:"Alvo fica paralisado (passando: lento). Início de cada turno pode gastar ação completa para novo teste de Vontade.\nDiscente (+4 PE): '1 ser' (4º círculo).\nVerdadeiro (+11 PE): seres escolhidos (4º círculo e afinidade)." },

  // ── 3º Círculo — Sangue ───────────────────────────────────────────────────────
  { id:"rt-ferver-sangue", name:"Ferver Sangue", source:"livro-basico", element:"sangue", circle:3, execution:"padrão", range:"curto", duration:"sustentada", resistance:"Fortitude parcial",
    description:"Ao conjurar e no início de cada turno: Fortitude ou 4d8 Sangue + fraco; passando: metade do dano, sem condição. Dois turnos passando = efeito termina.\nVerdadeiro (+4 PE): seres escolhidos (4º círculo e afinidade)." },
  { id:"rt-forma-monstruosa", name:"Forma Monstruosa", source:"livro-basico", element:"sangue", circle:3, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Transforma em criatura Grande: +5 ataque e dano corpo a corpo, 30 PV temporários, ataques causam dano de Sangue. Mente tomada por fúria: não pode falar nem conjurar rituais, deve atacar o ser mais próximo.\nDiscente (+3 PE): imune a atordoamento/fadiga/sangramento/sono/veneno, +10 bônus e 50 PV temporários (4º círculo e afinidade)." },
  { id:"rt-purgatorio", name:"Purgatório", source:"livro-basico", element:"sangue", circle:3, execution:"padrão", range:"curto", duration:"sustentada", resistance:"Fortitude parcial",
    description:"Poça de sangue de 6m: inimigos na área ficam vulneráveis a balístico/corte/impacto/perfuração. Tentar sair: 6d6 Sangue + Fortitude (falha = não consegue sair, perde ação de movimento)." },
  { id:"rt-vomitar-pestes", name:"Vomitar Pestes", source:"livro-basico", element:"sangue", circle:3, execution:"padrão", range:"médio", duration:"sustentada", resistance:"Reflexos reduz à metade",
    description:"Enxame Grande (3m): 5d12 Sangue a qualquer ser no mesmo espaço no final de cada turno. Ação de movimento para mover o enxame 12m.\nDiscente (+2 PE): alvo que falha fica agarrado (pode escapar com Acrobacia ou Atletismo).\nVerdadeiro (+5 PE): enxame Enorme (6m), voo 18m." },

  // ── 3º Círculo — Medo ────────────────────────────────────────────────────────
  { id:"rt-dissipar-ritual", name:"Dissipar Ritual", source:"livro-basico", element:"medo", circle:3, execution:"padrão", range:"médio", duration:"instantânea",
    description:"Teste de Ocultismo: anula rituais ativos com DT igual ou menor que o resultado. Pode converter item amaldiçoado em mundano por 1 dia (Vontade anula se em posse de alguém)." },

  // ── 4º Círculo — Conhecimento ─────────────────────────────────────────────────
  { id:"rt-controle-mental", name:"Controle Mental", source:"livro-basico", element:"conhecimento", circle:4, execution:"padrão", range:"médio", duration:"sustentada", resistance:"Vontade parcial",
    description:"Alvo obedece todos os comandos, exceto ordens suicidas. Vontade no final de cada turno para se livrar (falha = pasmo por 1 rodada).\nDiscente (+5 PE): até 5 pessoas ou animais.\nVerdadeiro (+10 PE): até 10 (requer afinidade Conhecimento)." },
  { id:"rt-inexistir", name:"Inexistir", source:"livro-basico", element:"conhecimento", circle:4, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Vontade parcial",
    description:"10d12+10 Conhecimento; passando: 2d12 + debilitado por 1 rodada. Se PV reduzirem a 0 ou menos: apagado completamente da existência.\nDiscente (+5 PE): 15d12+15.\nVerdadeiro (+10 PE): 20d12+20 (requer afinidade)." },
  { id:"rt-possessao", name:"Possessão", source:"livro-basico", element:"conhecimento", circle:4, execution:"padrão", range:"longo", duration:"1 dia", resistance:"Vontade anula",
    description:"Projeta consciência no corpo do alvo (usa sua ficha com atributos físicos do alvo). Se passar na resistência, alvo sabe e fica imune por 1 dia. Morte de qualquer um = mente sobrevivente presa no novo corpo permanentemente." },

  // ── 4º Círculo — Energia ─────────────────────────────────────────────────────
  { id:"rt-alterar-destino", name:"Alterar Destino", source:"livro-basico", element:"energia", circle:4, execution:"reação", range:"pessoal", duration:"instantânea",
    description:"Vislumbra futuro próximo: +15 em um teste de resistência ou na Defesa contra um ataque.\nVerdadeiro (+5 PE): alcance curto, um aliado à sua escolha." },
  { id:"rt-deflagracao-energia", name:"Deflagração de Energia", source:"livro-basico", element:"energia", circle:4, execution:"completa", range:"pessoal", duration:"instantânea", resistance:"Fortitude parcial",
    description:"Explosão de 15m: 3d10×10 Energia em todos na área. Todos os itens tecnológicos na área param de funcionar. Passando: metade do dano, itens voltam após 1d4 rodadas.\nVerdadeiro (+5 PE): afeta apenas alvos à sua escolha." },
  { id:"rt-teletransporte", name:"Teletransporte", source:"livro-basico", element:"energia", circle:4, execution:"padrão", range:"toque", duration:"instantânea",
    description:"Até 5 seres voluntários teletransportados para local a até 1.000km. Teste de Ocultismo: DT 25 (lugar frequentado), DT 30 (já visitou uma vez), DT 35 (só conhece por descrição). Falha: lugar parecido mas errado (até 100km). Falha por 5+: atordoado 1d4 rodadas.\nVerdadeiro (+5 PE): qualquer local na Terra." },

  // ── 4º Círculo — Morte ────────────────────────────────────────────────────────
  { id:"rt-convocar-algoz", name:"Convocar o Algoz", source:"livro-basico", element:"morte", circle:4, execution:"padrão", range:"1,5m", duration:"sustentada", resistance:"Vontade parcial, Fortitude parcial",
    description:"Cria imagem do maior medo do alvo. No fim de cada turno, o algoz flutua 12m em direção à vítima. Alcance curto: Vontade ou fica abalado. Adjacente: Fortitude — falha = 0 PV; passando = 6d6 Morte (não pode reduzir abaixo de 1 PV). Algoz incorpóreo, imune a dano; desaparece apenas se o alvo ficar morrendo ou for dissipado." },
  { id:"rt-distorcao-temporal", name:"Distorção Temporal", source:"livro-basico", element:"morte", circle:4, execution:"padrão", range:"pessoal", duration:"3 rodadas",
    description:"Bolsão temporal: você pode agir mas não se deslocar nem interagir com seres/objetos, e efeitos contínuos não o afetam. Efeitos de área com duração maior que este agem ao terminar." },
  { id:"rt-fim-inevitavel", name:"Fim Inevitável", source:"livro-basico", element:"morte", circle:4, execution:"completa", range:"extremo", duration:"4 rodadas", resistance:"Fortitude parcial",
    description:"Buraco negro de 1,5m: no início de cada turno, todos a até 90m fazem Fortitude ou ficam caídos e puxados 30m. Seres que iniciem o turno tocando o vácuo: 100 Morte/rodada.\nDiscente (+5 PE): 5 rodadas, você não é afetado (requer afinidade).\nVerdadeiro (+10 PE): 6 rodadas, seres escolhidos não são afetados (requer afinidade)." },

  // ── 4º Círculo — Sangue ───────────────────────────────────────────────────────
  { id:"rt-capturar-coracao", name:"Capturar o Coração", source:"livro-basico", element:"sangue", circle:4, execution:"padrão", range:"curto", duration:"cena", resistance:"Vontade parcial",
    description:"Obsessão doentia pelo conjurador. Início de cada turno do alvo: Vontade ou age para ajudá-lo da melhor forma possível. Dois sucessos = efeito termina." },
  { id:"rt-involucro-carne", name:"Invólucro de Carne", source:"livro-basico", element:"sangue", circle:4, execution:"padrão", range:"curto", duration:"cena",
    description:"Cria cópia com mesmas estatísticas e equipamento mundano. Sem consciência (Intelecto/Presença nulos). Ação de movimento para dar ordem à cópia. Alternativa: controle ativo (você entra em transe, assume os sentidos da cópia). A cópia se desfaz a 0 PV ou fora do alcance." },
  { id:"rt-vinculo-sangue", name:"Vínculo de Sangue", source:"livro-basico", element:"sangue", circle:4, execution:"padrão", range:"curto", duration:"cena", resistance:"Fortitude anula",
    description:"Símbolo no seu corpo e no alvo. Sempre que você sofrer dano, alvo faz Fortitude: falha = você sofre metade, alvo sofre a outra metade. Pode conjurar com efeito inverso. Alvos voluntários sem resistência." },

  // ── 4º Círculo — Medo ────────────────────────────────────────────────────────
  { id:"rt-canalizar-medo", name:"Canalizar o Medo", source:"livro-basico", element:"medo", circle:4, execution:"padrão", range:"toque", duration:"permanente até ser descarregada",
    description:"Transfere ritual de até 3º círculo que você conheça para o alvo. Alvo conjura uma vez sem pagar PE (pode usar formas avançadas com PE próprios). Seus PE máximos diminuem em valor = custo do ritual transferido enquanto durar." },
  { id:"rt-conhecendo-medo", name:"Conhecendo o Medo", source:"livro-basico", element:"medo", circle:4, execution:"padrão", range:"toque", duration:"cena", resistance:"Vontade parcial",
    description:"Manifesta medo absoluto: falha = Sanidade a 0 (enlouquece, torna-se criatura paranormal); passando = 10d6 dano mental + apavorado por 1 rodada." },
  { id:"rt-lamina-medo", name:"Lâmina do Medo", source:"livro-basico", element:"medo", circle:4, execution:"padrão", range:"toque", duration:"instantânea", resistance:"Fortitude parcial",
    description:"'Fenda na Realidade': falha = PV a 0, fica morrendo; passando = 10d8 Medo (ignora todas as resistências) + apavorado por 1 rodada. Sobrevivendo do estado morrendo: o ferimento nunca cicatriza, causando dor constante permanente.", prereq:"Poder de trilha específico para aprender" },
  { id:"rt-medo-tangivel", name:"Medo Tangível", source:"livro-basico", element:"medo", circle:4, execution:"padrão", range:"pessoal", duration:"cena",
    description:"Imune a atordoado, cego, debilitado, enjoado, envenenado, exausto, fatigado, fraco, lento, ofuscado, paralisado, além de doenças e venenos. Não sofre dano adicional de críticos e ataques furtivos. Dano balístico/corte/impacto/perfuração não pode reduzir PV abaixo de 1." },
  { id:"rt-presenca-medo", name:"Presença do Medo", source:"livro-basico", element:"medo", circle:4, execution:"padrão", range:"pessoal", duration:"sustentada",
    description:"Emanação de 9m: alvos na área ao conjurar ou no início de cada turno sofrem 5d8 dano mental + 5d8 Medo (Vontade reduz à metade). Falha = atordoado por 1 rodada (só uma vez por cena)." },
]

// ─── RITUAIS — Sobrevivendo ao Horror ────────────────────────────────────────
const RITUAIS_SAH: OPRitualDef[] = [
  { id:"rt-esfolar",           name:"Esfolar",             source:"sobrevivendo-ao-horror", element:"sangue",       circle:1, execution:"padrão",  range:"curto",   duration:"instantânea", resistance:"Reflexos parcial",
    description:"3d4+3 corte + fica sangrando. Passando: metade do dano, sem condição.\nDiscente (+2 PE): alcance médio, 5d4+5, explosão 6m (2º círculo).\nVerdadeiro (+5 PE): alcance longo, 10d4+10, explosão 6m, resistência não evita a condição (3º círculo)." },
  { id:"rt-sede-adrenalina",   name:"Sede de Adrenalina",  source:"sobrevivendo-ao-horror", element:"sangue",       circle:2, execution:"reação",  range:"pessoal", duration:"instantânea",
    description:"Quando falha em Acrobacia ou Atletismo, pode reconjurar usando Presença. OU ao sofrer dano de impacto, reduz esse dano em 20 (mas fica atordoado 1 rodada ao reduzir). Só uma vez por rodada.\nDiscente (+3 PE): reduz impacto em 40.\nVerdadeiro (+7 PE): reduz em 70 (4º círculo e afinidade)." },
  { id:"rt-odor-cacada",       name:"Odor da Caçada",      source:"sobrevivendo-ao-horror", element:"sangue",       circle:3, execution:"padrão",  range:"pessoal", duration:"cena",
    description:"Recebe faro. Em perseguições: +5 Atletismo + não perde PV pelo esforço extra. Custo: próxima cena com fome e sede (como falha no primeiro dia de Fortitude).\nDiscente (+4 PE): alcance toque, 1 ser.\nVerdadeiro (+9 PE): alcance curto, até 5 seres (afinidade)." },
  { id:"rt-martirio-sangue",   name:"Martírio de Sangue",  source:"sobrevivendo-ao-horror", element:"sangue",       circle:4, execution:"padrão",  range:"pessoal", duration:"sem fim",
    description:"Transformação bestial: faro, visão no escuro, cura acelerada 10, +10 ataque e dano corpo a corpo e Defesa, 30 PV temporários, ataques desarmados +1 dado extra e letais. Não pode conjurar rituais ou falar; –3O em interação social. Ao fim da cena: você se torna permanentemente uma criatura de Sangue (personagem perdido).\nDiscente (+5 PE): +20 bônus, 50 PV temporários (afinidade)." },
  { id:"rt-apagar-luzes",      name:"Apagar as Luzes",     source:"sobrevivendo-ao-horror", element:"morte",        circle:1, execution:"padrão",  range:"pessoal", duration:"instantânea",
    description:"Apaga todas as fontes de luz (mundanas e paranormais) em alcance curto. Você recebe visão no escuro até o fim da cena.\nDiscente (+2 PE): alcance longo para fontes afetadas (2º círculo).\nVerdadeiro (+5 PE): você + 5 seres escolhidos recebem visão no escuro (3º círculo)." },
  { id:"rt-lingua-morta",      name:"Língua Morta",        source:"sobrevivendo-ao-horror", element:"morte",        circle:2, execution:"padrão",  range:"toque",   duration:"sustentada",
    description:"Reanima cadáver com o Lodo. Responde 1 pergunta por rodada, até 3 rodadas. Ao fim das 3 rodadas: cadáver transforma-se em esqueleto de Lodo.\nDiscente (+3 PE): 4 rodadas; ao fim = enraizado.\nVerdadeiro (+7 PE): 5 rodadas; ao fim = marionete (4º círculo e afinidade)." },
  { id:"rt-fedor-putrido",     name:"Fedor Pútrido",       source:"sobrevivendo-ao-horror", element:"morte",        circle:3, execution:"padrão",  range:"pessoal", duration:"sustentada",
    description:"Cobre o corpo com odor de cadáver. Animais se afastam; –3O em Diplomacia. +5 Furtividade; +10 em Enganação para se fingir de morto. Custo: 1d4 Morte que ignora resistência por rodada sustentada.\nDiscente (+4 PE): toque, 1 ser voluntário.\nVerdadeiro (+9 PE): alcance curto, até 5 voluntários (afinidade)." },
  { id:"rt-singularidade-temporal", name:"Singularidade Temporal", source:"sobrevivendo-ao-horror", element:"morte", circle:4, execution:"padrão", range:"curto", duration:"instantânea", resistance:"veja texto",
    description:"Avança objeto não paranormal Médio ao estado de decomposição máximo para seu tipo. Objeto danificado: –5 em testes de uso; ou destruído. Objeto em uso: Fortitude para protegê-lo.\nDiscente (+5 PE): objeto Grande.\nVerdadeiro (+10 PE): objeto Enorme." },
  { id:"rt-desfazer-sinapses", name:"Desfazer Sinapses",  source:"sobrevivendo-ao-horror", element:"conhecimento", circle:1, execution:"padrão",  range:"curto",   duration:"instantânea", resistance:"Vontade parcial",
    description:"2d6+2 Conhecimento + frustrado por 1 rodada. Passando: metade, sem condição. Alvo precisa ter cérebro.\nDiscente (+2 PE): alcance longo, 3d6+3, até 5 seres (2º círculo).\nVerdadeiro (+5 PE): alcance extremo, 8d6+8, condição muda para esmorecido (3º círculo)." },
  { id:"rt-aurora-verdade",    name:"Aurora da Verdade",   source:"sobrevivendo-ao-horror", element:"conhecimento", circle:2, execution:"padrão",  range:"curto",   duration:"sustentada", resistance:"Vontade parcial",
    description:"Luz espectral dourada em esfera de 3m: todos na área só podem falar a verdade (inclusive o conjurador). Passando: pode mentir. Invisibilidade dentro da área revela o ser com sigilos.\nDiscente (+3 PE): alcance médio, esfera 9m, conjurador não é afetado.\nVerdadeiro (+7 PE): alcance longo, duração cena, você ouve tudo dentro da área à distância (4º círculo e afinidade)." },
  { id:"rt-relembrar-fragmento", name:"Relembrar Fragmento", source:"sobrevivendo-ao-horror", element:"conhecimento", circle:3, execution:"padrão", range:"toque", duration:"enquanto tocado",
    description:"Restaura objeto danificado (fonte de conhecimento escrito) ao estado da última anotação. Só precisa de fragmento equivalente ao dedo mindinho. Não funciona se destruído por meios paranormais.\nDiscente (+4 PE): permanece restaurado até o fim da missão.\nVerdadeiro (+9 PE): altera o objeto de forma imperceptível à vontade do conjurador + permanece alterado até o fim da missão (afinidade)." },
  { id:"rt-pronunciar-sigilo", name:"Pronunciar Sigilo",   source:"sobrevivendo-ao-horror", element:"conhecimento", circle:4, execution:"padrão",  range:"curto",   duration:"instantânea/veja texto", resistance:"Vontade parcial",
    description:"Escolhe: Esquecer (atordoado 1d4+1 rodadas; passando: desprevenido 1d4 rodadas), Cegar (cego; passando: ofuscado 1d4 rodadas) ou Inexistir (alvo deixa de existir por 1d4+1 rodadas; passando: 1 rodada; só pode ocorrer uma vez por cena).\nDiscente (+5 PE): alcance extremo.\nVerdadeiro (+10 PE): até 5 seres (afinidade)." },
  { id:"rt-overlock",          name:"Overlock",            source:"sobrevivendo-ao-horror", element:"energia",      circle:1, execution:"reação",  range:"pessoal", duration:"instantânea",
    description:"Após saber o resultado de teste de Tecnologia com objeto eletrônico, tenta por outro caminho (jogo de estátua). Falha = não obtém a informação. Objeto depois: inutilizável.\nDiscente (+2 PE): falha apenas se errar duas vezes (2º círculo).\nVerdadeiro (+5 PE): falha apenas se errar três vezes (3º círculo)." },
  { id:"rt-tremeluzir",        name:"Tremeluzir",          source:"sobrevivendo-ao-horror", element:"energia",      circle:2, execution:"padrão",  range:"pessoal", duration:"sustentada",
    description:"Você e seus itens podem atravessar objetos sólidos (ação de movimento por objeto; 25% de não atravessar). Em perseguições: cortar caminho sem penalidade em Atletismo. Custo: 1d4 Energia/rodada; +1d4 se terminar a rodada parcialmente dentro de objeto sólido.\nDiscente (+3 PE): toque, 1 ser voluntário.\nVerdadeiro (+7 PE): curto, até 5 voluntários (4º círculo)." },
  { id:"rt-mutar",             name:"Mutar",               source:"sobrevivendo-ao-horror", element:"energia",      circle:3, execution:"padrão",  range:"pessoal", duration:"sustentada",
    description:"Inibe emissão e recepção de qualquer som de/para você. +10 Furtividade; reduz ganho de visibilidade em cenas de furtividade em 1. Falar sem permissão do mestre dissipa o ritual.\nDiscente (+4 PE): toque, 1 ser.\nVerdadeiro (+9 PE): curto, até 5 seres (afinidade Energia)." },
  { id:"rt-milagre-ionizante", name:"Milagre Ionizante",   source:"sobrevivendo-ao-horror", element:"energia",      circle:3, execution:"completa", range:"toque", duration:"instantânea",
    description:"Cura o ser de uma condição (abalado, apavorado, alquebrado, atordoado, cego, confuso, debilitado, enjoado, envenenado, esmorecido, exausto, fascinado, fatigado, fraco, frustrado, lento, ofuscado, paralisado, pasmo, surdo, ou uma doença/veneno). Funciona em efeitos paranormais exceto os de Energia e condições permanentes. Custo: após a cura, Fortitude DT 30 — falha = incubado pelo Vírus do Infecticídio." },
]

// ─── RITUAIS — Arquivos Secretos ─────────────────────────────────────────────
const RITUAIS_AS: OPRitualDef[] = [
  { id:"rt-backup",             name:"Backup",             source:"arquivos-secretos", element:"energia",      circle:2, execution:"padrão",  range:"curto",   duration:"24h",
    description:"Cria chamariz com sua aparência em espaço vazio. Conexão de 50km. A qualquer momento, reação para trocar de lugar com o chamariz (perde 2d4 SAN). Dissipa se a cópia sofrer dano ou você sair da área de conexão.\nDiscente (+2 PE): permanente, pode alternar sentidos com a cópia (você fica cego, surdo e pasmo, 2º círculo).\nVerdadeiro (+5 PE): como Discente + pode falar pela cópia, escolher aparência baseada em alguém já visto, e ao trocar de lugar dissipa causando 6d6 Energia (Reflexos reduz) em alcance curto de ambos os pontos (3º círculo)." },
  { id:"rt-hesitacao-forcada",  name:"Hesitação Forçada", source:"arquivos-secretos", element:"conhecimento", circle:1, execution:"padrão",  range:"curto",   duration:"sustentada", resistance:"Vontade parcial",
    description:"Invade a mente do alvo com dúvidas. No início de cada turno: Vontade — falha = rola novamente o maior dado de qualquer teste feito até o fim de seu turno. Dois sucessos seguidos = efeito termina.\nDiscente (+2 PE): alvo '1 ser'; alvo que não resistiu não pode agir hostilmente contra o conjurador (2º círculo).\nVerdadeiro (+5 PE): resistência muda para 'anula'; efeito invertido — alvo fica extremamente confiante, rola novamente o menor dado de qualquer teste (3º círculo e afinidade)." },
]

const RITUAL_IMG_MAP: Record<string, string> = {
  "rt-amaldicoar-arma":           "/rituais/amaldicoar-arma.webp",
  "rt-compreensao-paranormal":    "/rituais/compreensao-paranormal.png",
  "rt-enfeiticar":                "/rituais/enfeiticar.webp",
  "rt-ouvir-sussurros":           "/rituais/ouvir-sussurros.webp",
  "rt-perturbacao":               "/rituais/perturbacao.png",
  "rt-tecer-ilusao":              "/rituais/tecer-ilusao.webp",
  "rt-terceiro-olho":             "/rituais/terceiro-olho.png",
  "rt-coincidencia-forcada":      "/rituais/coincidencia-forcada.png",
  "rt-eletrocussao":              "/rituais/eletrocussao.png",
  "rt-embaralhar":                "/rituais/embaralhar.webp",
  "rt-luz":                       "/rituais/luz.webp",
  "rt-polarizacao-caotica":       "/rituais/polarizacao-caotica.webp",
  "rt-chamas-caos":               "/rituais/chamas-do-caos.webp",
  "rt-contencao-fantasmagorica":  "/rituais/contencao-fantasmagorica.webp",
  "rt-dissonancia-acustica":      "/rituais/dissonancia-acustica.webp",
  "rt-sopro-caos":                "/rituais/sopro-do-caos.webp",
  "rt-tela-ruido":                "/rituais/tela-de-ruido.webp",
  "rt-consumir-manancial":        "/rituais/consumir-manancial.webp",
  "rt-decadencia":                "/rituais/decadencia.webp",
  "rt-definhar":                  "/rituais/definhar.webp",
  "rt-espirais-perdicao":         "/rituais/espirais-da-perdicao.webp",
  "rt-nuvem-cinzas":              "/rituais/nuvem-de-cinzas.webp",
  "rt-desacelerar-impacto":       "/rituais/desacelerar-impacto.webp",
  "rt-eco-espiral":               "/rituais/eco-espiral.webp",
  "rt-miasma-entropico":          "/rituais/miasma-entropico.webp",
  "rt-paradoxo":                  "/rituais/paradoxo.webp",
  "rt-velocidade-mortal":         "/rituais/velocidade-mortal.webp",
  "rt-arma-atroz":                "/rituais/arma-atroz.webp",
  "rt-armadura-sangue":           "/rituais/armadura-de-sangue.webp",
  "rt-corpo-adaptado":            "/rituais/corpo-adaptado.webp",
  "rt-distorcer-aparencia":       "/rituais/distorcer-aparencia.webp",
  "rt-fortalecimento-sensorial":  "/rituais/fortalecimento-sensorial.webp",
  "rt-odio-incontrolavel":        "/rituais/odio-incontrolavel.webp",
  "rt-descarnar":                 "/rituais/descarnar.webp",
  "rt-flagelo-sangue":            "/rituais/flagelo-de-sangue.webp",
  "rt-hemofagia":                 "/rituais/hemofagia.webp",
  "rt-transfusao-vital":          "/rituais/transfusao-vital.webp",
  "rt-cineraria":                 "/rituais/cineraria.webp",
  "rt-protecao-rituais":          "/rituais/protecao-contra-rituais.webp",
  "rt-rejeitar-nevoa":            "/rituais/rejeitar-nevoa.webp",
  "rt-aprimorar-mente":           "/rituais/aprimorar-mente.webp",
  "rt-esconder-dos-olhos":        "/rituais/esconder-os-olhos.webp",
  "rt-invadir-mente":             "/rituais/invadir-mente.webp",
  "rt-localizacao":               "/rituais/localizacao.webp",
  "rt-alterar-destino":           "/rituais/alterar-destino.webp",
  "rt-convocacao-instantanea":    "/rituais/convocacao-instantanea.webp",
  "rt-salto-fantasma":            "/rituais/salto-fantasma.webp",
  "rt-transfigurar-agua":         "/rituais/transfigurar-agua.webp",
  "rt-ancora-temporal":           "/rituais/ancora-temporal.webp",
  "rt-tentaculos-lodo":           "/rituais/tentaculos-de-lodo.webp",
  "rt-zerar-entropia":            "/rituais/zerar-entropia.webp",
  "rt-ferver-sangue":             "/rituais/ferver-sangue.webp",
  "rt-forma-monstruosa":          "/rituais/forma-monstruosa.webp",
  "rt-purgatorio":                "/rituais/purgatorio.webp",
  "rt-vomitar-pestes":            "/rituais/vomitar-pestes.webp",
  "rt-controle-mental":           "/rituais/controle-mental.webp",
  "rt-inexistir":                 "/rituais/inexistir.webp",
  "rt-possessao":                 "/rituais/possessao.webp",
  "rt-alterar-memoria":           "/rituais/alterar-memoria.webp",
  "rt-contato-paranormal":        "/rituais/contato-paranormal.webp",
  "rt-mergulho-mental":           "/rituais/mergulho-mental.webp",
  "rt-videncia":                  "/rituais/videncia.webp",
  "rt-deflagracao-energia":       "/rituais/deflagracao-de-energia.webp",
  "rt-teletransporte":            "/rituais/teletransporte.webp",
  "rt-distorcao-temporal":        "/rituais/distorcao-temporal.webp",
  "rt-fim-inevitavel":            "/rituais/fim-inevitavel.webp",
  "rt-aprimorar-fisico":          "/rituais/aprimorar-fisico.webp",
  "rt-capturar-coracao":          "/rituais/capturar-o-coracao.webp",
  "rt-involucro-carne":           "/rituais/involucro-de-carne.webp",
  "rt-vinculo-sangue":            "/rituais/vinculo-de-sangue.webp",
  "rt-canalizar-medo":            "/rituais/canalizar-o-medo.webp",
  "rt-conhecendo-medo":           "/rituais/conhecendo-o-medo.webp",
  "rt-lamina-medo":               "/rituais/lamina-do-medo.webp",
  "rt-medo-tangivel":             "/rituais/medo-tangivel.webp",
  "rt-presenca-medo":             "/rituais/presenca-do-medo.webp",
}

export const RITUAIS_OP: OPRitualDef[] = [
  ...RITUAIS_LDR,
  ...RITUAIS_SAH,
  ...RITUAIS_AS,
].map(r => ({ ...r, img: RITUAL_IMG_MAP[r.id] }))

