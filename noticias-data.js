// ── NEWS DATA (shared across noticias.html and individual news pages) ──
const news = [
  {
    id: 1,
    cat: 'Noticias',
    date: '30 jul. 2025',
    title: 'Descubren dos libros de la biblioteca personal de Lope de Vega en Ecuador',
    excerpt: 'El investigador Antonio Sánchez Jiménez halla los volúmenes en un convento de Santo Domingo en Quito.',
    img: '../media/lope-de-vega_ecuador.jpg',
    url: 'noticia-ecuador-2025.html',
    content: [
      'El investigador Antonio Sánchez Jiménez ha localizado dos volúmenes que formaron parte de la biblioteca personal de Lope de Vega en el convento de Santo Domingo de Quito, Ecuador.',
      'La noticia fue publicada en ABC Cultura el 30 de julio de 2025, bajo la firma de Adrián J. Sáez.',
    ],
    links: [
      { label: 'Ver el artículo completo', url: 'https://www.abc.es/cultura/descubren-dos-libros-biblioteca-personal-lope-vega-20250730043020-nt.html' }
    ]
  },
  {
    id: 2,
    cat: 'Congreso',
    date: '13 nov. 2024',
    title: 'XI Congreso Internacional Lope de Vega: «Lope político»',
    excerpt: 'Los días 27, 28 y 29 de noviembre se celebra el XI Congreso Internacional «Lope de Vega»: Lope político.',
    img: '../media/XI-Congreso-Prolope-Cartel.webp',
    url: 'noticia-congreso-xi-2024.html',
    content: [
      'El undécimo congreso internacional dedicado a Lope de Vega, centrado en la temática «Lope político», tendrá lugar los días 27, 28 y 29 de noviembre. El evento se retransmitirá vía Teams sin posibilidad de participación remota.',
      '27 de noviembre — Sala de grados B7/052. La inscripción abre a las 8:30 h. Gonzalo Pontón (Universitat Autònoma de Barcelona) inaugura el congreso a las 9:00 h. Elizabeth Wright (University of Georgia) ofrece la conferencia plenaria inaugural sobre glosas de esclavitud racializada. Las sesiones matutinas incluyen ponencias sobre roles diplomáticos en el teatro de Lope, cartografía digital de la Comedia Nueva y contextos políticos. Por la tarde, Diana Berruezo-Sánchez ofrece una plenaria sobre teatro de raza en el Siglo de Oro. Las sesiones vespertinas exploran la representación femenina en la política y las juezas en el teatro áureo.',
      '28 de noviembre — Sala de actos B7/1056. Jonathan Thacker (University of Oxford) abre con una plenaria sobre si Lope fue una figura del teatro político. Las sesiones examinan la institucionalización de Lope a través de la prensa del siglo XIX, su apropiación política durante la Guerra Civil española y las adaptaciones radiofónicas durante el franquismo. Se conmemoran los 30 años del Anuario Lope de Vega y se anuncia la publicación de la Parte XXIII. Luis González Fernández aborda las artes ocultas y la autoridad en el teatro del Siglo de Oro.',
      '29 de noviembre — Aula 305 B9B/016. Folke Gernert (Universität Trier) explora el uso político del cuerpo en la obra de Lope. Las sesiones cubren Contra valor no hay desdicha como espejo de príncipes, los retos de datación editorial y las políticas científicas. Pedro Ruiz Pérez cierra el congreso con una plenaria sobre las estructuras de representación en el corral de comedias.',
    ],
    links: []
  },
  {
    id: 3,
    cat: 'Jornadas',
    date: '22 jul. 2024',
    title: 'Olmedo Clásico: 18 Jornadas',
    excerpt: 'Las Jornadas de Olmedo afrontan su decimoctava edición: «Y sin embargo, amigos: estudiar y representar a nuestros clásicos».',
    img: '../media/olmedo-clasico_18.jpg',
    url: 'noticia-olmedo-clasico-18-2024.html',
    content: [
      'Las Jornadas de Olmedo afrontan su decimoctava edición con los objetivos que han sido su razón de ser como parte indisociable del Festival: ayudar a entender a nuestros clásicos desde las claves de su época, analizar su vigencia actual en la investigación académica y en los escenarios o pantallas, contribuir a su difusión y proyectar su futuro.',
    ],
    links: [
      { label: 'Programa en PDF', url: '../docs/18_jornadas_teatro_clasico_2024_0.pdf' },
      { label: 'Web de Olmedo clásico', url: 'https://www.olmedo.es/olmedoclasico/jornadas/18-jornadas-teatro-clasico' }
    ]
  },
  {
    id: 4,
    cat: 'Noticias',
    date: 'jul. 2024',
    title: 'Convocadas dos plazas postdoctorales para el proyecto Thal-IA',
    excerpt: 'Dos plazas de un año, prorrogables un segundo año, para trabajar con manuscritos teatrales del Siglo de Oro, fotografía espectral e Inteligencia Artificial.',
    img: '../media/Thal-IA.jpg',
    url: 'noticia-thal-ia-2024.html',
    content: [
      'Se han convocado dos plazas de un año, prorrogables un segundo año, con sueldo anual de 25.988 euros, para trabajar con manuscritos teatrales del Siglo de Oro, fotografía espectral e Inteligencia Artificial.',
    ],
    links: []
  },
  {
    id: 5,
    cat: 'Noticias',
    date: '8 jul. 2024',
    title: 'Álvaro Cuéllar, mejor artículo científico en los Premios HDH2024',
    excerpt: 'Álvaro Cuéllar, miembro de Prolope, ha recibido el premio al mejor artículo científico en los Premios de Humanidades Digitales Hispánicas 2024.',
    img: '../media/Premios2024-humanidades-digitales_cuellar.jpg',
    url: 'noticia-cuellar-hdh2024.html',
    content: [
      'Álvaro Cuéllar, miembro de Prolope, ha recibido el premio al mejor artículo científico en los Premios de Humanidades Digitales Hispánicas 2024 por «Cronología y estilometría: datación automática de comedias de Lope de Vega».',
    ],
    links: [
      { label: 'Ver el artículo en el Anuario Lope de Vega', url: 'https://doi.org/10.5565/rev/anuariolopedevega.483' }
    ]
  },
  {
    id: 6,
    cat: 'Seminario',
    date: '27 may. 2024',
    title: 'Seminario «Escriptura i rescriptura en el barroc»',
    excerpt: 'Los días 27 y 28 de mayo de 2024 se celebra en la Reial Acadèmia de Bones Lletres de Barcelona el seminario «Escriptura i reescriptura en el barroc».',
    img: '../media/escriptura-reescriptura-barroc.jpg',
    url: 'noticia-seminario-escriptura-barroc-2024.html',
    content: [
      'Los días 27 y 28 de mayo de 2024 se celebra en la Reial Acadèmia de Bones Lletres de Barcelona el seminario, presencial y en linea, «Escriptura i reescriptura en el barroc», con dirección científica de Sònia Boadas (UAB) y Eulàlia Miralles (UdV. IIFV).',
    ],
    links: [
      { label: 'Más información y programa en PDF', url: 'https://dfe.uab.cat/seminari-escriptura-i-reescriptura-en-el-barroc/' }
    ]
  },
  {
    id: 7,
    cat: 'Seminario',
    date: '14 may. 2024',
    title: 'Seminario del profesor Pedro Martín Baños',
    excerpt: '«El amuleto de Barcarrota y la tradición mágica europea». Seminario en la Sala de Graus de la Facultad de Filosofía y Letras de la UAB.',
    img: '../media/seminario-pedro-martin-banos.jpg',
    url: 'noticia-seminario-pedro-martin-banos-2024.html',
    content: [
      'El día 14 de mayo de 2024, a las 11:30h, se celebrará el seminario de Pedro Martín «El amuleto de Barcarrota y la tradición mágica europea» en la Sala de Graus de la Facultad de Filosofía y Letras de la UAB.',
    ],
    links: [
      { label: 'Más información', url: 'https://dfe.uab.cat/seminari-del-professor-pedro-martin-banos/' }
    ]
  },
  {
    id: 8,
    cat: 'Noticias',
    date: '20 abr. 2024',
    title: 'Documental sobre Lope de Vega en «Informe semanal»',
    excerpt: 'El sábado 20 de abril de 2024 se emite en La 1 «Lo que aún esconde Lope», documental sobre las investigaciones del grupo Prolope.',
    img: '../media/documental-lope_rtve.jpg',
    url: 'noticia-documental-lope-rtve-2024.html',
    content: [
      'El sábado 20 de abril de 2024, a las 21:30, se emitirá el documental sobre Lope de Vega «Lo que aún esconde Lope», en La 1 y RTVE Play. El reportaje muestra como los investigadores del grupo Prolope de la UAB «enseñan» a la IA a distinguir la caligrafía de los autores del Siglo de Oro.',
    ],
    links: [
      { label: 'Más información en la web de RTVE', url: 'https://www.rtve.es/noticias/20240418/si-lope-vega-levantara-cabeza-utilizan-tecnicas-policiales-para-descubrir-tacho/16065834.shtml' }
    ]
  },
  {
    id: 9,
    cat: 'Seminario',
    date: '18 abr. 2024',
    title: 'Seminario: Inteligencia Artificial y patrimonio cultural',
    excerpt: 'Los días 18 y 19 de abril se celebra el seminario «Inteligencia Artificial y patrimonio cultural», organizado por PROLOPE, HEURESIS y LT&T.',
    img: '../media/SeminarioIA.jpg',
    url: 'noticia-seminario-ia-patrimonio-2024.html',
    content: [
      'El seminario pretende poner en común diferentes aproximaciones al estudio e investigación del patrimonio cultural, artístico y literario basadas en procesos de Inteligencia Artificial.',
    ],
    links: [
      { label: 'Más información y programa', url: 'https://dfe.uab.cat/seminario-inteligencia-artificial-y-patrimonio-cultural/' }
    ]
  },
  {
    id: 10,
    cat: 'Noticias',
    date: '27 feb. 2024',
    title: 'Conferencia de David Merino: ¡Todos a una!',
    excerpt: 'David Merino Recalde presenta su proyecto de tesis doctoral: una edición digital y archivo social de Fuente Ovejuna de Lope de Vega.',
    img: '../media/conferencia_merino_fuenteovejuna.jpg',
    url: 'noticia-conferencia-merino-2024.html',
    content: [
      'El martes 27 de febrero de 2024, a las 13h en la Sala de Graus de la Facultad de Filosofía y Letras, David Merino Recalde presentará su proyecto de tesis doctoral sobre la edición digital y archivo social de Fuente Ovejuna.',
    ],
    links: []
  },
  {
    id: 11,
    cat: 'Publicación',
    date: '31 ene. 2024',
    title: 'El Anuario Lope de Vega publica su volumen XXX',
    excerpt: 'Acaba de publicarse el volumen XXX del Anuario Lope de Vega, revista vinculada al grupo Prolope desde su fundación en 1995.',
    img: '../media/AnuarioLopedeVega_V30.jpg',
    url: 'noticia-anuario-xxx-2024.html',
    content: [
      'El Anuario Lope de Vega, revista fundada por Alberto Blecua en 1995, acaba de publicar su número XXX. Siempre ha estado vinculado al Grupo de investigación Prolope y a la Universidad Autónoma de Barcelona.',
    ],
    links: [
      { label: 'Enlace al número XXX', url: 'https://revistes.uab.cat/anuariolopedevega/issue/view/v30' }
    ]
  },
  {
    id: 12,
    cat: 'Noticias',
    date: '30 ene. 2024',
    title: 'La profesora Sònia Boadas dirigirá el proyecto Thal-IA',
    excerpt: 'Sònia Boadas ha conseguido una «Ayuda para incentivar la Consolidación Investigadora 2023» del Ministerio de Ciencia e Innovación por su proyecto Thal-IA.',
    img: '../media/projecte-Thal-IA.jpg',
    url: 'noticia-sonia-boadas-thal-ia-2024.html',
    content: [
      'La profesora Sònia Boadas dirigirá el proyecto Thal-IA («Patrimonio teatral áureo: inteligencia artificial y fotografía espectral»), financiado con 281.500 euros por el Ministerio de Ciencia e Innovación.',
    ],
    links: []
  },
  {
    id: 13,
    cat: 'Congreso',
    date: 'Enero 2024',
    title: 'Call for papers para el XI Congreso Internacional Lope de Vega: Lope político',
    excerpt: 'Envío de propuestas hasta el 30 de abril de 2024. El XI Congreso Internacional de Prolope tendrá lugar en noviembre de 2024.',
    img: '../media/call-for-papers_lope-politico.jpg',
    url: 'noticia-xi-congreso-call-for-papers-2024.html',
    content: [
      'La extraordinaria labor realizada en investigación sobre el teatro del Siglo de Oro durante los últimos treinta años, con Lope de Vega como estandarte, ha comportado una no menos significativa renovación y ampliación de las perspectivas de análisis.',
      'Sensible a esta realidad, el XI Congreso Internacional de Prolope (que tendrá lugar a finales de noviembre de 2024) quiere prestar atención a esta pregunta sobre lo político, tanto en tiempos de Lope como en el Lope de hoy.',
    ],
    links: [
      { label: 'Primera circular', url: '../docs/PrimeraCircularXILopePolitico.pdf' },
      { label: 'Segunda circular', url: '../docs/SegundaCircularXILopePolitico.pdf' }
    ]
  },
  {
    id: 14,
    cat: 'Seminario',
    date: '5 dic. 2023',
    title: 'Seminario «Estudios clásicos y modernos en torno a Lope de Vega»',
    excerpt: 'Seminario en la Sala de Actos de la UAB con ponencias de Álvaro Cuéllar, Arantxa Llàcer y Guillermo Gómez.',
    img: '../media/seminario_estudios-clasicos.jpg',
    url: 'noticia-seminario-estudios-clasicos-2023.html',
    content: [
      'Seminario en el que se presentaron las ponencias de Álvaro Cuéllar, Arantxa Llàcer y Guillermo Gómez Sánchez-Ferrer en torno a la obra de Lope de Vega.',
      'El evento tuvo lugar en la Sala de Actos de la Facultad de Filosofía y Letras de la UAB.',
    ],
    links: [
      { label: 'Cartel en PDF', url: '../docs/seminario_estudios-clasicos_prolope.pdf' }
    ]
  },
  {
    id: 15,
    cat: 'Conferencia',
    date: '27 nov. 2023',
    title: 'Estudio y reconstrucción de documentos con fotografía espectral',
    excerpt: 'Conferencia y taller de Sergi Claveria en la Biblioteca de Humanidades de la UAB sobre fotografía espectral.',
    img: '../media/Taller_espectral_27_11.jpg',
    url: 'noticia-conferencia-taller-fotografia-espectral-2023.html',
    content: [
      'El lunes 27 de noviembre de 2023, Sergi Claveria pronunció la conferencia-taller en la Biblioteca de Humanidades de la UAB.',
    ],
    links: [
      { label: 'Cartel en PDF', url: '../docs/Taller_espectral_27_11.pdf' }
    ]
  },
  {
    id: 16,
    cat: 'Publicación',
    date: 'Nov. 2023',
    title: 'Publicada la «Parte XXI de las Comedias de Lope de Vega»',
    excerpt: 'Ya disponible la Parte XXII de las Comedias de Lope, coordinada por Fausta Antonucci y Marco Presotto.',
    img: '../media/comedias-parte-xxii_noticia.jpg',
    url: 'noticia-parte-xxi-publicada-2023.html',
    content: [
      'Tras haber obtenido en mayo de 1635 la licencia para la Parte XXI, el 21 de junio Lope la obtuvo para la Ventidós parte perfeta, que no llegaría a ver publicada.',
      'La obra, en dos volúmenes, está a la venta en las principales librerías.',
    ],
    links: [
      { label: 'Ir a la web de compra', url: 'https://www.rbalibros.com/gredos/comedias-parte-xxii-2-vols_7294' }
    ]
  },
  {
    id: 17,
    cat: 'Jornadas',
    date: '24 jul. 2023',
    title: '17 Jornadas sobre Teatro Clásico de Olmedo',
    excerpt: 'Las Jornadas de Olmedo vuelven a ocuparse de Lope con el lema «Lope sin fin» del 24 al 26 de julio.',
    img: '../media/olmedo-clasico_17.jpg',
    url: 'noticia-olmedo-clasico-17-2023.html',
    content: [
      'Las Jornadas de Olmedo vuelven a ocuparse de Lope, no solo para saldar la deuda contraída desde el momento en que el dramaturgo se interesó por un caballero de la Villa.',
      'Y así es como el conocido en su tiempo como el Fénix de los Ingenios confirma año a año la vocación de eternidad que se le atribuye al ave mitológica.',
    ],
    links: [
      { label: 'Programa en PDF', url: '../docs/programa_jornadas_olmedo_uva_2023_horizontal.pdf' },
      { label: 'Web de Olmedo Clásico', url: 'https://www.olmedo.es/olmedoclasico/jornadas/17-jornadas-teatro-clasico' }
    ]
  },
  {
    id: 18,
    cat: 'Seminario',
    date: '25 y 26 may. 2023',
    title: 'Los dramaturgos áureos a través de sus autógrafos',
    excerpt: 'Seminario internacional en la UAB coordinado por Sònia Boadas y Marco Presotto sobre manuscritos autógrafos.',
    img: '../media/seminario-autografos.jpg',
    url: 'noticia-seminario-autografos-2023.html',
    content: [
      'Seminario internacional coordinado por Sònia Boadas y Marco Presotto sobre los dramaturgos del Siglo de Oro y sus manuscritos autógrafos.',
      'Actividad formativa gratuita celebrada en la Facultad de Filosofía y Letras de la UAB.',
    ],
    links: [
      { label: 'Más información', url: 'https://dfe.uab.cat/los-dramaturgos-aureos-a-traves-de-sus-autografos/' }
    ]
  },
  {
    id: 19,
    cat: 'Seminario',
    date: '24 mar. 2023',
    title: 'Seminario Internacional «De la periferia al centro»',
    excerpt: 'Seminario Internacional «De la periferia al centro: imprenta y literatura española en los siglos XVI y XVII» en la Universidad de Trento.',
    img: '../media/fondo-noticias.jpg',
    url: 'noticia-seminario-periferia-centro-2023.html',
    content: [
      'El próximo día 24 de marzo de 2023 se celebra el Seminario Internacional «De la periferia al centro: imprenta y literatura española en los siglos XVI y XVII», en la Universidad de Trento, coordinado por Claudia Demattè, Arantxa Llàcer y Marco Presotto.',
    ],
    links: [
      { label: 'Más información y programa', url: 'https://prolope.uab.cat/wp-content/uploads/2023/03/Programa-Seminario-Trento.pdf' }
    ]
  },
  {
    id: 20,
    cat: 'Noticias',
    date: 'Mar. 2023',
    title: 'Alba Carmona recibe una ayuda Marie Skłodowska-Curie',
    excerpt: 'La investigadora de PROLOPE Alba Carmona recibe una ayuda Marie Skłodowska-Curie para realizar el proyecto EXODUS en la University of Leeds.',
    img: '../media/Alba-Carmona.jpg',
    url: 'noticia-alba-carmona-marie-curie-2023.html',
    content: [
      'La investigadora de PROLOPE Alba Carmona acaba de recibir una ayuda del prestigioso programa europeo Marie Skłodowska-Curie, para realizar el proyecto EXODUS, en la University of Leeds, con la supervisión del prof. Duncan Wheeler.',
    ],
    links: []
  },
    {
    id: 21,
    cat: 'Noticias',
    date: '31 ene. 2023',
    title: '«La francesa Laura», una comedia desconocida de Lope de Vega hallada gracias a la Inteligencia Artificial',
    excerpt: 'Álvaro Cuéllar y Germán Vega García-Luengos publican «La francesa Laura. El hallazgo de una nueva comedia del Lope de Vega último», que se halla en los fondos de la BNE.',
    img: '../media/La-Francesa-Laura.jpg',
    url: 'noticia-francesa-laura.html',
    content: [
      'Se trata de una entrega que recoge diversos artículos sobre Humanidades digitales, con descubrimientos tan importantes como la atribución a Lope de Vega de la comedia La francesa Laura, sumando, así, un título al nutrido corpus del dramaturgo.',
      'Los autores, Álvaro Cuéllar y Germán Vega García-Luengos, publican «La francesa Laura. El hallazgo de una nueva comedia del Lope de Vega último», que se halla en los fondos de la BNE. La noticia ya ha sido recogida en diversos medios y ha logrado ser tendencia en Twiter.',
      'La inteligencia artificial atribuye a Lope de Vega una obra anónima del fondo de manuscritos de la Biblioteca Nacional (El País)',
      'Descubren una obra desconocida de Lope de Vega gracias a la Inteligencia Artificial (ABC)',
      'La Inteligencia Artificial ayuda a descubrir una obra desconocida de Lope de Vega (El Diario)'
    ],
    links: [
      { label: 'Artículo completo', url: 'https://revistes.uab.cat/anuariolopedevega' }
    ]
  },
    {
    id: 24,
    cat: 'Publicación',
    date: 'Ene. 2023',
    title: 'Publicado el volumen XXIX (2023) del Anuario Lope de Vega',
    excerpt: 'Acaba de publicarse un nuevo volumen del Anuario Lope de Vega, en el que los lectores encontrarán la acostumbrada sección de miscelánea y un nutrido conjunto de reseñas.',
    img: '../media/Anuario-29.jpg',
    url: 'noticia-xxix-anuario-lope.html',
    content: [
      'Se trata de una entrega que recoge diversos artículos sobre Humanidades digitales, con descubrimientos tan importantes como la atribución a Lope de Vega de la comedia La francesa Laura, sumando, así, un título al nutrido corpus del dramaturgo (Álvaro Cuéllar y Germán Vega García-Luengos, «La francesa Laura. El hallazgo de una nueva comedia del Lope de Vega último»).'
    ],
    links: [
      { label: 'Número completo', url: 'https://revistes.uab.cat/anuariolopedevega/issue/view/13' }
    ]
  },
    {
    id: 25,
    cat: 'Conferencia',
    date: '3 feb. 2023',
    title: 'Conferencia de Álvaro Cuéllar y Germán Vega',
    excerpt: 'Álvaro Cuéllar y Germán Vega ofrecerán una conferencia sobre «La francesa Laura»',
    img: '../media/conferencia_francesa-laura.jpg',
    url: 'noticia-conferencia-cuellar-vega.html',
    content: [
      'El próximo 3 de febrero de 2023, a las 11:30 h., Álvaro Cuéllar y Germán Vega ofrecerán una conferencia titulada «La francesa Laura. Una comedia desconocida de Lope de Vega delatada por la Inteligencia Artificial».'
    ],
    links: [
      { label: 'Mas información', url: 'https://prolope.uab.cat/wp-content/uploads/2023/11/FRANCESA_LAURA.pdf' }
    ]
  },
    {
    id: 26,
    cat: 'Noticias',
    date: '2 feb. 2023',
    title: 'Taller Transkribus con Álvaro Cuéllar',
    excerpt: 'Álvaro Cuéllar impartirá un taller sobre el programa Transkribus',
    img: '../media/taller-transkribus.jpg',
    url: 'noticia-taller-transkribus.html',
    content: [
      'El próximo 2 de febrero de 2023, en el Salón de Grados de la Facultad de Filosofía y Letras de la UAB, Álvaro Cuéllar impartirá un taller sobre el programa Transkribus (10:00-13:00 horas).'
    ],
    links: [
      { label: 'Programa del taller (PDF)', url: 'https://prolope.uab.cat/wp-content/uploads/2023/11/TALLER_TRANSKRIBUS.pdf' }
    ]
  },
    {
    id: 27,
    cat: 'Noticias',
    date: '11 dic. 2022',
    title: 'El proyecto CREATEXT, en la prensa',
    excerpt: 'El diario ABC se hace eco del proyecto CREATEXT, dirigido por Sònia Boadas',
    img: '../media/Proyecto-Creatext.jpg',
    url: 'noticia-proyecto-creatext.html',
    content: [
      'Se trata de una iniciativa que combina la Filología y las herramientas digitales con el objetivo de determinar los diferentes agentes que intervenían en los autógrafos teatrales, tomando a Lope de Vega como ejemplo. Así, intentará describir, por un lado, el proceso de redacción del propio autor (con el análisis de los diferentes estadios de redacción) y concretar hasta qué punto los censores, los directores de compañías, los impresores… actuaban sobre el redactado inicial, conformando un texto estratificado, continuamente vivo.'
    ],
    links: [
      { label: 'Noticia completa', url: 'https://www.abc.es/cultura/lope-compania-caza-colaboradores-fenix-ingenios-20221211173118-nt.html' }
    ]
  },
    {
    id: 28,
    cat: 'Publicación',
    date: 'Nov. 2022',
    title: 'Novedad editorial: Parte XXI de las Comedias de Lope de Vega',
    excerpt: 'Se ha publicado la «Parte XXI» de las «Comedias» de Lope de Vega, a cargo de la Editorial Gredos y coordinada por Gonzalo Pontón y Ramón Valdés',
    img: '../media/Comedias_Parte_XXI.jpg',
    url: 'noticia-publicacion-parte-xxi.html',
    content: [
      'Nada más salir su Parte XX de comedias a inicios de 1625, Lope debía de estar pensando ya en publicar la XXI. Pero el Consejo de Castilla, en marzo de ese año, por razones morales decidió no conceder más licencias para imprimir comedias ni novelas. La suspensión, que duraría un decenio, desbocó la impresión ilegal y apócrifa de comedias. Lope siguió escribiendo y, ya anciano, cuando se volvieron a conceder licencias, había compuesto algunas de sus obras maestras que quiso incluir en esta Veinte y una parte, reivindicada como verdadera frente a las de los impresores sin escrúpulo. Incluyó obras recientes y otras más antiguas que tal vez había barajado estampar hacía tiempo; tragedias como La bella Aurora, mitológica, y la de ambiente palaciego El castigo sin venganza; la comedia palatina de La boba para los otros y discreta para sí; la tragicomedia de tema histórico-dinástico El piadoso aragonés; dramas historiales con casos de honra como El mejor alcalde, el rey, Los Tellos de Meneses y La victoria de la honra; pero lo que prefirió fueron comedias urbanas: ¡Ay, verdades, que en amor…!, La noche de San Juan, Los bandos de Sena, El premio del bien hablar y Por la puente, Juana.',
      'La ediciones críticas de estas doce comedias se acompañan de prólogo, texto crítico, variantes lingüísticas, notas al pie, aparato crítico y nota onomástica. La obra, en dos volúmenes, está a la venta en las principales librerías, y puede adquirirse también a través de la siguiente web.',
      'Excepcionalmente, la pieza El castigo sin venganza va acompañada de varios apéndices, 4 en una separata digital en pdf y una animación en power point sobre los diferentes finales, solo disponibles en línea.',
      'La bella Aurora, edición de Rosa Bono Velilla ¡Ay, verdades, que en amor…!, edición de Fernando Rodríguez-Gallego La boba para los otros y discreta para sí, edición de Paula Casariego y Alejandra Ulla Lorenzo La noche de san Juan, edición de Isabel Muguruza Roca El castigo sin venganza, edición de Alejandro García-Reidy y Ramón Valdés Los bandos de Sena, edición de Clara Monzó Ribes y Daniel Fernández Rodríguez',
      'El mejor alcalde, el rey, edición de Fausta Antonucci El premio del bien hablar, edición de Victoria Pineda La vitoria de la honra, edición de José Enrique López Martínez El piadoso aragonés, edición de Daniele Crivellari y Gonzalo Pontón Los Tellos de Meneses, edición de Ane Zapatero Molinuevo Por la puente, Juana, edición de Enrico Di Pastena'
    ],
    links: [
    ]
  },
    {
    id: 29,
    cat: 'Congreso',
    date: '17 y 18 nov. 2022',
    title: 'Congreso «Editar la danza de los siglos XVI y XVII»',
    excerpt: 'Congreso internacional «Editar la danza de los siglos XVI y XVII»',
    img: '../media/Editar_la_danza.jpg',
    url: 'noticia-congreso-editar-danza.html',
    content: [
      'Los próximos 17 y 18 de noviembre de 2022, celebraremos, en colaboración con la Université Sorbonne, el congreso internacional «Editar la danza de los siglos XVI y XVII», que podrá seguirse a distancia a través de Teams.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'media/Editar_la_danza.pdf' },
      { label: 'Programa en PDF', url: 'media/Editar_la_danza.pdf' }
    ]
  },
    {
    id: 30,
    cat: 'Congreso',
    date: '29 y 30 nov. y 1 dic. 2022',
    title: 'Congreso «Desvelando a Lope»',
    excerpt: 'Los próximos días 29 y 30 de noviembre y 1 de diciembre de 2022, se celebrará el congreso internacional «Desvelando a Lope», en la Universidad Complutense.',
    img: '../media/Desvelando_a_Lope.jpg',
    url: 'noticia-congreso-desvelando-lope.html',
    content: [
      'Los próximos días 29 y 30 de noviembre y 1 de diciembre de 2022, se celebrará el congreso internacional «Desvelando a Lope», en la Universidad Complutense.'
    ],
    links: [
      { label: 'Más información', url: 'https://eventos.ucm.es/90033/detail/congreso-internacional-desvelando-a-lope.html' },
      { label: 'Programa (PDF)', url: 'media/Triptico_Desvelando_a_Lope.pdf' }
    ]
  },
    {
    id: 31,
    cat: 'Beca',
    date: 'Oct. 2022',
    title: 'Sònia Boadas obtiene una Beca Leonardo de la Fundación BBVA',
    excerpt: 'Sònia Boadas obtiene una Beca Leonardo de la Fundación BBVA',
    img: '../media/beca-bbva-2022.jpg',
    url: 'noticia-beca-leonardo-sonia.html',
    content: [
      'Felicitamos a nuestra compañera Sònia Boadas por la obtención de esta prestigiosa Beca Leonardo, que otorga la Fundación BBVA, para realizar el proyecto CREATEXT.',
      'Con este proyecto quiere analizar seis manuscritos autógrafos de Lope de Vega para contrastar la hipótesis, nunca explorada hasta ahora, de un trabajo colaborativo en la creación y revisión de sus comedias. ¿Es posible que Lope trabajara junto con otros agentes del sistema teatral para consensuar el texto final? La experiencia de Boadas en fotografía espectral y en análisis químico con espectrometría, técnicas que permiten recuperar fragmentos ilegibles por tachaduras, determinar las fases de reescritura de distintos pasajes o diferenciar las tintas de un mismo manuscrito, será clave para el proyecto.'
    ],
    links: [
      { label: 'Entrevista en La SER', url: 'https://cadenaser.com/audio/cadenaser_laventana_20221018_160000_170000/' },
      { label: 'Noticia en El Confidencial', url: 'https://www.elconfidencial.com/tecnologia/ciencia/2022-10-10/quimica-fotografia-espectral-secreto-siglo-oro_3503373/' }
    ]
  },
    {
    id: 32,
    cat: 'Seminario',
    date: '10 jun. 2022',
    title: 'Seminario Internacional «Las Partes póstumas de Lope de Vega. La Parte XXII»',
    excerpt: 'Seminario Internacional «Las Partes póstumas de Lope de Vega. La Parte XXII», coordinado por Fausta Antonucci y Marco Presotto.',
    img: '../media/Seminario_Parte_XXII.jpg',
    url: 'noticia-seminario-partes-postumas.html',
    content: [
      'El próximo 10 de junio de 2022 se celebrará, en formato virtual, el Seminario Internacional «Las Partes póstumas de Lope de Vega. La Parte XXII», coordinado por Fausta Antonucci y Marco Presotto.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'media/Seminario_Parte_XXII.pdf' },
      { label: 'Unirse al evento', url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZWNhYTA2M2QtYTUxMS00Yzg5LWIzOTItOWIxNDYzMjM5ZjJm%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25226b514c29-2391-4831-b774-84f35c45bf01%2522%252c%2522Oid%2522%253a%252234e209f3-e4fb-408e-9d66-7b2cb255538f%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=4da96ae1-85f8-423b-bd2d-b2d8d591dd5c&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true' }
    ]
  },
    {
    id: 34,
    cat: 'Noticias',
    date: '3 jun. 2022',
    title: 'Taller en homenaje a Amalia Iriarte',
    excerpt: 'Se celebrará el Taller en homenaje a Amalia Iriarte, ‘Monstruos de apariencia llenos’: El teatro de Lope de Vega',
    img: '../media/AficheTallerLope.jpg',
    url: 'noticia-taller-homenaje-amalia-iriarte.html',
    content: [
      'Del 30 de mayo al 3 de junio de 2022 se celebrará el Taller en homenaje a Amalia Iriarte, ‘Monstruos de apariencia llenos’: El teatro de Lope de Vega, organizado entre los grupos de investigación Es de Lope, de la Universidad de los Andes, y Prolope.',
      'El encuentro podrá seguirse de forma telématica, previa inscripción'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'medios/AficheTallerLope.pdf' }
    ]
  },
    {
    id: 35,
    cat: 'Noticias',
    date: '4 mar. 2022',
    title: 'Defensa de tesis doctoral: Celio Hernández',
    excerpt: 'Defensa de la tesis doctoral de Celio Hernández, «Investigaciones sobre la transmisión, recepción y tradición cultural de La dama boba: del manuscrito autógrafo a la era digital»',
    img: '../media/hernandez-celio_tesi.jpg',
    url: 'noticia-defensa-tesis-celio-hernandez.html',
    content: [
      'Defensa de tesis doctoral Doctorado: Filología Espanyola Director: Ramón Valdés Gázquez (UAB), Mª Luz Mandigorra Llavata (UV) y Enrique Vidal Ruiz (UPV)',
      'Fecha: Viernes, 4 de marzo de 2022, 16:00h Lugar: Sala d’Actes (B7/1056) DEFENSA SEMIPRESENCIAL',
      'Para asistir como público a la videoconferencia, hay que solicitarlo a la dirección de correo postgrau.files@uab.cat antes del día 4 de marzo a las 12h'
    ],
    links: [
    ]
  },
    {
    id: 36,
    cat: 'Publicación',
    date: '27 ene. 2022',
    title: 'La «Parte XX» presentada en la Casa Museo Lope de Vega',
    excerpt: 'El pasado 27 de enero de 2022 se presentó, en la Casa Museo Lope de Vega, la «Parte XX»',
    img: '../media/presentacion_parte-xx.jpg',
    url: 'noticia-presentacion-parte-xx.html',
    content: [
      'El pasado 27 de enero de 2022 se presentó, en la Casa Museo Lope de Vega, la última entrega de la colección de las Partes de Comedias de Lope de Vega (Prolope-Gredos), la Parte XX. Contó con la presencia de sus coordinadores, Daniel Fernández Rodríguez y Guillermo Gómez Sánchez-Ferrer, y del profesor de la Universidad Autónoma de Madrid, José Enrique López Martínez.',
      'La Parte XX, aparecida en 1625, supone un hito en la trayectoria editorial de Lope, que a esas alturas llevaba casi un decenio ocupándose de la publicación de sus textos, nada más y nada menos que de 11 volúmenes de comedias. También representa un punto de inflexión en esa trayectoria, pues fue la última Parte publicada antes de la prohibición, vigente entre 1625 y 1635, de otorgar licencias para la impresión de comedias y novelas.',
      'Para Prolope, después de más de 30 años de trabajo conjunto, implica la asunción de un número redondo y la cercanía de cumplir el objetivo soñado por su fundador, el profesor Alberto Blecua, de publicar la integral dramática de Lope, en esta ocasión de la mano de dos de sus discípulos más jóvenes y brillantes.',
      'La velada contó, como broche de oro, con la representación de algunos fragmentos escogidos de las piezas de la Parte, de la mano de los actores Rafa Núñez y Marina Sánchez Vílchez, dirigidos por César Barló, de AlmaViva Teatro.',
      'Desde aquí dejamos constancia de nuestro agradecimiento a todos los que hicieron posible ese acto, a todos los asistentes, y a todos los colaboradores que han mantenido vivo un proyecto que, con esta entrega, suma 223 comedias editadas críticamente.',
      '«La Parte XX: Historia editorial», Daniel Fernández Rodríguez y Guillermo Gómez Sánchez-Ferrer Preliminares La discreta venganza, ed. Manuel Piqueras y Blanca Santos Lo cierto por lo dudoso, ed. Salomé Vuelta Pobreza no es vileza, ed. Federica Cappelli Arauco domado, ed. José Enrique Laplana La ventura sin buscalla, ed. Daniele Crivellari El valiente Céspedes, ed. Isabel Hernando Morata',
      'El hombre, por su palabra, ed. Santiago Restrepo Roma, abrasada, ed. Victoriano Roncero López Virtud, pobreza y mujer, ed. Daniel Fernández Rodríguez El rey sin reino, ed. Francesca leonetti y Oana Andreia Sambrian El mejor mozo de España, ed. Guillermo Gómez-Sánchez-Ferrer El marido más firme, ed. Clara Monzó Ribes'
    ],
    links: [
    ]
  },
    {
    id: 37,
    cat: 'Publicación',
    date: 'Ene. 2022',
    title: 'Publicado el número XXVIII (2022) del «Anuario Lope de Vega»',
    excerpt: 'Acaba de publicarse el número XXVIII (2022) del «Anuario Lope de Vega»',
    img: '../media/anuari.jpg',
    url: 'noticia-publicacion-xxviii-anuario.html',
    content: [
      'Acaba de publicarse un nuevo número del Anuario Lope de Vega, que acoge dos monográficos: «La hibridación genérica en el teatro de Lope de Vega», coordinado por Marcella Trambaioli, y «Hacia la edición de la Parte XXI y póstumas de Lope», coordinado por Ramón Valdés.',
      'En esta entrega nuestros lectores encontrarán, además, la acostumbrada sección de miscelánea y un nutrido conjunto de reseñas.'
    ],
    links: [
      { label: 'Número completo', url: 'https://revistes.uab.cat/anuariolopedevega/issue/view/v28' }
    ]
  },
    {
    id: 38,
    cat: 'Publicación',
    date: '27 ene. 2022',
    title: 'Presentación de la Parte XX de las Comedias de Lope de Vega',
    excerpt: 'Presentación de la Parte XX de las Comedias de Lope, recién publicadas por la editorial Gredos en colaboración con el grupo de investigación Prolope.',
    img: '../media/presentacion-comedias-parte-xx.jpg',
    url: 'noticia-presentacion-parte-xx-casa-museo.html',
    content: [
      'El jueves 27 de enero se realizará, en la Casa-Museo Lope de Vega, la presentación de la Parte XX de las Comedias de Lope, recién publicadas por la editorial Gredos en colaboración con el grupo de investigación Prolope.',
      'El acto contará con la presencia de los coordinadores, Daniel Fernández y Guillermo Gómez Sánchez-Ferrer, y del profesor José Enrique López Martínez.'
    ],
    links: [
      { label: 'Más información', url: 'https://casamuseolopedevega.org/es/actividades/colaboraciones-y-proyectos/610-presentacion-de-la-parte-veinte-de-las-comedias-de-lope' }
    ]
  },
    {
    id: 39,
    cat: 'Noticias',
    date: '8 oct. 2021',
    title: 'Alba Carmona habla del teatro clásico en «El País»',
    excerpt: 'Recomendamos el artículo que Alba Carmona publica hoy en «El País»',
    img: '../media/Alba-Carmona-ElPais.jpg',
    url: 'noticia-alba-carmona-el-pais.html',
    content: [
      'Recomendamos el artículo que Alba Carmona publica hoy, 8 de octubre de 2021, en El País sobre la visión actual del teatro clásico: «El brío del viejo teatro».'
    ],
    links: [
      { label: 'Enlace al artículo', url: 'https://elpais.com/opinion/2021-10-08/el-brio-del-viejo-teatro.html' },
      { label: 'Artículo (PDF)', url: 'media/El_brio_del_viejo_teatro_Opinion_EL_PAIS.pdf' }
    ]
  },
    {
    id: 40,
    cat: 'Noticias',
    date: '15 sep. 2021',
    title: 'Mesa redonda: «De un espectáculo de masas a otro: el teatro moderno y el cine»',
    excerpt: 'El próximo miércoles, 15 de septiembre de 2021, a las 18:30 h., celebraremos virtualmente una mesa redonda en la Casa Museo Lope de Vega',
    img: '../media/Mesa-redonda-espectuaculo-masas.jpg',
    url: 'noticia-mesa-redonda-espectaculo-masas.html',
    content: [
      'El próximo miércoles, 15 de septiembre de 2021, a las 18:30 h., celebraremos virtualmente una mesa redonda en la Casa Museo Lope de Vega, enmarcada en el conjunto de actividades que se derivan de la exposición «Unos clásicos… ¡de cine!», y lleva por título: «De un espectáculo de masas a otro: el teatro moderno y el cine».',
      'Alba Carmona y Guillermo Gómez (comisarios de la exposición) Duncan Wheeler (University of Leeds) José Antonio Pérez Bowie (Universidad de Salamanca) José Luis Sánchez Noriega (Universidad Complutense de Madrid).'
    ],
    links: [
      { label: 'Más información', url: 'https://casamuseolopedevega.org/es/actividades/colaboraciones-y-proyectos/603-mesa-redonda-de-un-espectaculo-de-masas-a-otro' }
    ]
  },
    {
    id: 41,
    cat: 'Publicación',
    date: 'Jul. 2021',
    title: 'Anuario Lope de Vega: Q1 en Scimago y REDIB',
    excerpt: 'En la edición de 2020, el Anuario Lope de Vega ha sido evaluado e incluido en el cuartil 1 (Q1) en las listas de Scimago Journal & Country Rank (SJR) y Red Iberoamericana de Innovación y Conocimiento Científico (REDIB).',
    img: '../media/anuari.jpg',
    url: 'noticia-anuario-q1.html',
    content: [
      'En la edición de 2020, el Anuario Lope de Vega ha sido evaluado e incluido en el cuartil 1 (Q1) en las listas de Scimago Journal & Country Rank (SJR) y Red Iberoamericana de Innovación y Conocimiento Científico (REDIB).',
      'Agradecemos a todos los que han trabajado y trabajan cada día para que el nivel de excelencia de nuestra revista la haga merecedora de tales reconocimientos.'
    ],
    links: [
    ]
  },
    {
    id: 42,
    cat: 'Noticias',
    date: '7 jul. 2021',
    title: 'Sònia Boadas premiada por la HDH',
    excerpt: 'Se ha hecho pública la resolución de la II Edición de los Premios HDH (Humanidades Digitales Hispánicas)',
    img: '../media/premios-hdh-2021.jpg',
    url: 'noticia-sonia-boadas-premaida.html',
    content: [
      'Hoy, 7 de julio de 2021, se ha hecho pública la resolución de la II Edición de los Premios HDH (Humanidades Digitales Hispánicas). El artículo de Sònia Boadas, «Técnicas e instrumentos para el estudio de los manuscritos autógrafos de Lope de Vega», que se publicó en la revista Hipogrifo (VIII.2, de 2020), ha sido galardonado como el mejor artículo científico publicado en 2020.',
      'Agradecemos el reconocimiento a la HDH y felicitamos a la autora, al tiempo que la animamos a seguir trabajando en esta línea que revierte en un mejor conocimiento de la obra de Lope de Vega.'
    ],
    links: [
      { label: 'Resolución', url: 'https://humanidadesdigitaleshispanicas.es/resolucion-de-la-ii-edicion-de-los-premios-hdh-2/' }
    ]
  },
    {
    id: 43,
    cat: 'Noticias',
    date: 'Jun. 2021',
    title: 'La prensa se hace eco de los avances en el estudio de los autógrafos de Lope',
    excerpt: 'Dos noticias recientes, aparecidas en ABC y ElDiario.es, se hacen eco de los interesantes descubrimientos de nuestra investigadora Sònia Boadas',
    img: '../media/Estudio-de-los-autografos-de-Lope.jpg',
    url: 'noticia-prensa-eco-avances-lope.html',
    content: [
      'Dos noticias recientes, aparecidas en ABC y ElDiario.es, se hacen eco de los interesantes descubrimientos de nuestra investigadora Sònia Boadas, quien está aplicando las nuevas tecnologías al estudio de los manuscritos autógrafos de Lope de Vega.',
      'Pueden leerse en los siguientes enlaces:'
    ],
    links: [
      { label: 'Noticia ABC', url: 'https://www.abc.es/cultura/teatros/abci-superordenador-para-descifrar-lope-vega-y-rayos-para-delatar-censor-202106210036_noticia.html' },
      { label: 'Noticia ElDiario.es', url: 'https://www.eldiario.es/cultura/libros/lope-vega-secretos-autores-siglo-oro-tecnologia-reconstruye-historia-literatura_1_8051490.html' }
    ]
  },
    {
    id: 44,
    cat: 'Exposición',
    date: 'Sep. 2021',
    title: 'Noticias sobre la exposición «Unos clásicos… ¡de cine!»',
    excerpt: 'Nos complace compartir dos enlaces de noticias que se hacen eco de la exposición «Unos clásicos… ¡de cine! El teatro del Siglo de Oro en el lienzo de plata (1914-1975)»',
    img: '../media/unos-clasicos-de-cine.jpg',
    url: 'noticia-noticias-exposicion-clasicos-cine.html',
    content: [
      'Nos complace compartir dos enlaces de noticias que se hacen eco de la exposición «Unos clásicos… ¡de cine! El teatro del Siglo de Oro en el lienzo de plata (1914-1975)», comisariada por Alba Carmona y Guillermo Gómez, investigadores del Grupo PROLOPE.',
      'Puede visitarse en la Casa Museo de Lope de Vega en Madrid hasta el 26 de septiembre.'
    ],
    links: [
      { label: 'Noticia 1', url: 'https://www.youtube.com/watch?v=kR2q_7HOklk' },
      { label: 'Noticia 2', url: 'https://www.europapress.tv/cultura/580359/1/casa-museo-lope-vega-acoge-exposicion-clasicos-cine' }
    ]
  },
    {
    id: 45,
    cat: 'Seminario',
    date: '21 jun. 2021',
    title: 'Seminario Internacional «Hacia la edición de la Parte XXI y póstumas de Lope»',
    excerpt: 'El próximo 21 de junio se celebrará en formato digital el Seminario Internacional «Hacia la edición de la Parte XXI y póstumas de Lope»',
    img: '../media/Seminario-Internaciona-2021.jpg',
    url: 'noticia-seminario-edicion-parte-xxi.html',
    content: [
      'El próximo 21 de junio se celebrará en formato digital el Seminario Internacional «Hacia la edición de la Parte XXI y póstumas de Lope», que se organizará según el siguiente programa.',
      'La asistencia es abierta y gratuita y puede realizarse a través del siguiente enlace.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'medios/Seminario_21_junio_programa_maquetado_para_publicitar.PDF' }
    ]
  },
    {
    id: 46,
    cat: 'Exposición',
    date: 'Del 28 may. hasta el 26 sep. 2021',
    title: 'Exposición «Unos clásicos… ¡de cine! El teatro del Siglo de Oro en el lienzo de plata (1914-1975)»',
    excerpt: 'Desde el pasado 28 de mayo y hasta el 26 de septiembre, puede visitarse en la casa Museo Lope de Vega de Madrid la exposición «Unos clásicos… ¡de cine! El teatro del Siglo de Oro en el lienzo de plata (1914-1975)»',
    img: '../media/exposicion-unos-clasicos-de-cine.JPG',
    url: 'noticia-exposicion-clasicos-cine.html',
    content: [
      'Se centra en las adaptaciones del teatro barroco al cine durante buena parte del siglo XX. En ella se puede realizar un viaje por el séptimo arte y su evolución, a través de las propuestas de traslación a la gran pantalla de las obras dramáticas de Lope de Vega, Calderón de la Barca y Tirso de Molina. En este recorrido de más de medio siglo descubrimos cómo se han aproximado los cineastas a los clásicos barrocos y cómo, en muchos casos, su lectura de dichas obras es bien distinta de la intención original de sus autores.',
      'El camino va desde los comienzos del cine mudo, con El alcalde de Zalamea de Adrià Gual, la primera adaptación de una comedia nueva, hasta los años del tardo-franquismo, con El mejor alcalde, el rey de Rafael Gil.',
      'Sin embargo, su área de exploración no se limita a las producciones nacionales y aborda igualmente la recepción fílmica de la comedia del Siglo de Oro en otros contextos como la República de Weimar, el Tercer Reich, la Rusia soviética, Italia o el exilio republicano español.',
      'La muestra presenta una selección de proyecciones, carteles, dibujos, fotos fijas, guiones, proyectos de adaptación, expedientes de censura y folletos promocionales, algunos nunca antes expuestos, y cuenta con fondos procedentes de archivos, museos e instituciones culturales nacionales y también internacionales como Deutsche Kinemathek de Berlín, la Friedrich Wilhelm Murnau Foundation de Wiesbaden o el Museo Nacional Centro de Arte Reina Sofía, entre otras muchas.'
    ],
    links: [
      { label: 'Más información', url: 'https://casamuseolopedevega.org/es/actividades/colaboraciones-y-proyectos/583-exposicion-cine-2021' }
    ]
  },
    {
    id: 47,
    cat: 'Conferencia',
    date: '7 may. 2021',
    title: 'Conferencia de Alba Carmona, ¿Cifras y letras? El Análisis de Redes Sociales en las Humanidades Digitales',
    excerpt: 'El próximo 7 de mayo, a las 16:00 horas, Alba Carmona impartirá la conferencia «¿Cifras y letras? El Análisis de Redes Sociales en las Humanidades Digitales»',
    img: '../media/cifras-letras.jpg',
    url: 'noticia-confereincia-cifras-letras.html',
    content: [
      'En ella se abordarán temas como el Análisis de Redes Sociales en las Humanidades Digitales, de gran utilidad para analizar cuestiones como la evolución de las relaciones sociales en el espacio y en el tiempo, o la circulación de ideas/objetos culturales, aplicable por ejemplo en el estudio de correspondencias privadas, en la sociología de la literatura o en los estudios biográficos.',
      'Especial atención merecerá el proyecto Gabriel García Márquez in Barcelona: An Analysis of His Intellectual Network, que pretende reconstruir a partir de la correspondencia del autor colombiano la red intelectual que tejió en sus años barceloneses, así como detectar las ideas y saberes que circularon a través de esta red epistolar.',
      'También se hablará de la aplicación del Análisis de Redes Sociales en el estudio de las interacciones entre los personajes de El mayordomo de la duquesa de Amalfi y de El perro del hortelano, que ha permitido iluminar la acusada similitud de las redes subyacentes en ambas piezas.'
    ],
    links: [
    ]
  },
    {
    id: 48,
    cat: 'Noticias',
    date: '15 abr. 2021',
    title: 'Evento destacado: En busca del autógrafo perdido',
    excerpt: 'El próximo jueves, 15 de abril, a las 18:00 horas, se llevará a cabo la presentación de la edición de Daniele Crivellari de la obra de Lope de Vega Barlaán y Josafat.',
    img: '../media/Barlaan-y-Josafat.jpg',
    url: 'noticia-noticia-en-busca-autografo.html',
    content: [
      'El próximo jueves, 15 de abril, a las 18:00 horas, se llevará a cabo la presentación de la edición de Daniele Crivellari de la obra de Lope de Vega Barlaán y Josafat. El acto, coorganizado por Cátedra, la Casa Museo Lope de Vega y Prolope, contará con las intervenciones de Javier Huerta Calvo, Marco Presotto y el propio editor.',
      'Esta edición crítica tiene en cuenta el manuscrito autógrafo de la obra, recuperado por el editor, lo cual, aparte su incalculable valor textual, permite comprender mejor el proceso de composición de Lope y posibilita un examen pormenorizado del reparto de actores que representó la obra.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'media/CA00417301_josafat_11.pdf' }
    ]
  },
    {
    id: 49,
    cat: 'Noticias',
    date: '26 mar. 2021',
    title: 'Alba Carmona participa en «Historia de nuestro cine»',
    excerpt: 'La investigadora de Prolope Alba Carmona participó el pasado viernes en el programa «Historia de nuestro cine»',
    img: '../media/Alba-Carmona-en-la-2.jpg',
    url: 'noticia-historia-de-nuestro-cine.html',
    content: [
      'La investigadora de Prolope Alba Carmona participó el pasado viernes en el programa «Historia de nuestro cine», de La 2, dedicado al Día mundial del teatro, en el que pudieron verse «El perro del hortelano» y «La venganza de don Mendo».'
    ],
    links: [
      { label: 'Enlace al coloquio', url: 'https://www.rtve.es/play/videos/historia-de-nuestro-cine/coloquio-dia-del-teatro/5828731/' }
    ]
  },
    {
    id: 50,
    cat: 'Noticias',
    date: 'Mar. 2021',
    title: 'Reconocimiento al proyecto TheaTheor de Sònia Boadas',
    excerpt: 'El proyecto TheaTheor. Theorising the Production of Comedia Nueva: the Process of the Play Configuration in the Spanish Golden Age Theatre (MSCA-IF 794064), dirigido por Sònia Boadas y coordinado por el profesor Marco Presotto en la Alma Mater Studiorum-Università di Bologna, ve reconocidos sus resultados en la web CORDIS de la Comisión Europea.',
    img: '../media/Estudio-de-los-autografos-de-Lope.jpg',
    url: 'noticia-reconocimiento-theatheor.html',
    content: [
      'El proyecto TheaTheor. Theorising the Production of Comedia Nueva: the Process of the Play Configuration in the Spanish Golden Age Theatre (MSCA-IF 794064), dirigido por Sònia Boadas y coordinado por el profesor Marco Presotto en la Alma Mater Studiorum-Università di Bologna, ve reconocidos sus resultados en la web CORDIS de la Comisión Europea.',
      'Enhorabuena por tan buen trabajo y por hacer visible la investigación en Humanidades.'
    ],
    links: [
      { label: 'Enlace a la noticia', url: 'https://cordis.europa.eu/article/id/429393-how-16th-and-17th-century-spanish-plays-contributed-to-europe-s-early-arts-scene?WT.mc_id=exp' }
    ]
  },
    {
    id: 51,
    cat: 'Conferencia',
    date: '19 mar. 2021',
    title: 'Conferencia de Sònia Boadas: Humanidades digitales',
    excerpt: 'El próximo viernes, 19 de marzo, a las 16:00 horas, Sònia Boadas impartirá una conferencia',
    img: '../media/sonia-boadas-humanidades-digitales.jpg',
    url: 'noticia-conferencia-sonia-boadas-humanidades-digitales.html',
    content: [
      'El próximo viernes, 19 de marzo, a las 16:00 horas, Sònia Boadas impartirá una conferencia sobre «Análisis de manuscritos teatrales áureos con fotografía espectral y espectroscopía de Rayos X», en el marco del Máster de Humanidades y Patrimonio Digitales de la UAB.',
      'En muchas ocasiones, el análisis paleográfico y codicológico de manuscritos teatrales áureos no permite ofrecer respuestas concluyentes a cuestiones sobre la composición y transmisión de la obra o sobre la intervención de terceras personas en la configuración del texto. En esta conferencia se presentarán algunos instrumentos relacionados con la fotografía y la espectroscopía que pueden ayudar al investigador y al filólogo a resolver esas y otras cuestiones. La aplicación de estas técnicas a determinados manuscritos autógrafos ha permitido, por ejemplo, leer debajo de fragmentos tachados o identificar la composición química de las tintas empleadas.'
    ],
    links: [
      { label: 'Cartel (PDF)', url: 'media/Cartel-conferencia-Sonia-Boadas.pdf' }
    ]
  },
     {
    id: 52,
    cat: 'Seminario',
    date: '5 mar. 2021',
    title: 'Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)»',
    excerpt: 'Nuestra investigadora Florence D’Artois presenta, el próximo 5 de marzo, a las 13 h., en el marco del Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)», que ella organiza, la conferencia de Álvaro Torrente «À la recherche du bal perdu».',
    img: '../media/mudanzas-marzo-2021.jpg',
    url: 'noticia-seminario-mudanzas.html',
    content: [
      'Nuestra investigadora Florence D’Artois presenta, el próximo 5 de marzo, a las 13 h., en el marco del Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)», que ella organiza, la conferencia de Álvaro Torrente «À la recherche du bal perdu».'
    ],
    links: [
    ]
  },
    {
    id: 53,
    cat: 'Publicación',
    date: 'Feb. 2021',
    title: 'Novedad editorial: “Que todo lo feo es malo / y bueno todo lo hermoso”. Aproximaciones a la estética de lo feo en Lope de Vega',
    excerpt: 'Damos cuenta de la publicación del libro «Que todo lo feo es malo / y bueno todo lo hermoso». Aproximaciones a la estética de lo feo en Lope de Vega, editado por Guillermo Gómez Sánchez-Ferrer y Claudia Jacobi (LIT Verlag, Münster, 2020)',
    img: '../media/Aproximaciones-a-la-estetica-de-lo-feo.jpg',
    url: 'noticia-novedad-editorial-todo-feo-malo.html',
    content: [
      'Damos cuenta de la publicación del libro «Que todo lo feo es malo / y bueno todo lo hermoso». Aproximaciones a la estética de lo feo en Lope de Vega, editado por Guillermo Gómez Sánchez-Ferrer y Claudia Jacobi (LIT Verlag, Münster, 2020), que recoge los trabajos de Marcella Trambaioli, Felipe B. Pedraza Jiménez, Ursula Hennigfeld, Folke Gernert, Claudi Jacobi, Timo Kehren y Karin Peters.',
      'La estética feísta no suele relacionarse con la literatura dramática no burlesca. La comedia de Lope de Vega sigue considerándose en muchos estudios como un oasis en el que la fealdad y la realidad más mundana desaparecen en pos de una idealización impregnada por el éxito del amor, los escenarios palaciegos o el carácter festivo. Sin embargo, la poética teatral de Lope de Vega contempla también la presencia de otros universos sociales, como el de los bandoleros, los rústicos, los corsarios, los gitanos, las alcahuetas, las busconas, sin rehuir las representaciones de violencia y de sexualidad grotesca. El presente volumen se enfrenta a la necesidad de repensar la obra lopesca en función de los elementos propios de la estética de lo feo.'
    ],
    links: [
    ]
  },
    {
    id: 54,
    cat: 'Noticias',
    date: '28 ene. 2021',
    title: 'Seguimos recordando a Alberto Blecua',
    excerpt: 'Después de haberse cumplido el pasado 28 de enero un año del fallecimiento de Alberto Blecua, queremos recordarlo recuperando la charla que mantuvo con Iñaki Gabilondo, en la sede de RBA en Barcelona, en octubre de 2012.',
    img: '../media/Blecua-Gabilondo.jpg',
    url: 'noticia-recordamos-alberto-blecua.html',
    content: [
      'Después de haberse cumplido el pasado 28 de enero un año del fallecimiento de Alberto Blecua, queremos recordarlo recuperando la charla que mantuvo con Iñaki Gabilondo, en la sede de RBA en Barcelona, en octubre de 2012.'
    ],
    links: [
      { label: 'Transcripción de la entrevista', url: 'Entrevista_Alberto_Blecua_febrero_2021.pdf' }
    ]
  },
    {
    id: 55,
    cat: 'Congreso',
    date: 'Feb. 2021',
    title: 'X Congreso Internacional Lope de Vega. Primera circular',
    excerpt: 'Nos complace anunciar la convocatoria del X Congreso Internacional Lope de Vega. «Editar a Lope, 30 años después», que se celebrará en Barcelona los días 24, 25 y 26 de noviembre de 2021.',
    img: '../media/X-Congreso.jpg',
    url: 'noticia-primera-circular-x-congreso.html',
    content: [
      'Nos complace anunciar la convocatoria del X Congreso Internacional Lope de Vega. «Editar a Lope, 30 años después», que se celebrará en Barcelona los días 24, 25 y 26 de noviembre de 2021.'
    ],
    links: [
      { label: 'Primera circular', url: 'media/Circular_X_Congreso_PROLOPE.pdf' }
    ]
  },
    {
    id: 56,
    cat: 'Publicación',
    date: '2021',
    title: 'Novedad editorial: La edición del diálogo teatral (siglos XVI-XVII)',
    excerpt: 'Anunciamos la aparición del volumen La edición del diálogo teatral (siglos XVI-XVII), coordinado por Luigi Giuliani y Victoria Pineda y publicado por la Università degli Studi di Firenze.',
    img: '../media/edicion-dialogo-teatral.jpg',
    url: 'noticia-novedad-editorial-edicion-dialogo.html',
    content: [
      'La conciencia de la complejidad del texto dramático ha guiado la programación de las ediciones XIV, XV y XVI de los Talleres Internacionales de Estudios Textuales celebradas en la Università degli Studi di Perugia. Los Talleres, fundados y dirigidos desde 2004 por Luigi Giuliani y Victoria Pineda, siempre han querido ser un lugar de encuentro interdisciplinar que superara las tradicionales divisiones entre las distintas filologías para ocuparse de teorías, metodologías y prácticas ecdóticas aplicadas a textos de distintas épocas, géneros y autores, escritos en distintos idiomas, compuestos y transmitidos a través de diferentes canales, desde la copia manuscrita a la imprenta manual, a la litografía, hasta las actuales tecnologías digitales. La última edición se ha centrado en el diálogo teatral en los textos del Siglo de Oro, tanto en su fase de creación por parte del dramaturgo, como en las modificaciones que sufrió por su paso por las tablas, en el Siglo de Oro como en las puestas en escenas actuales, y a las implicaciones que todo ello conlleva para el crítico textual.'
    ],
    links: [
      { label: 'Volumen completo', url: 'https://books.fupress.com/catalogue/la-edicion-del-dialogo-teatral-(siglos-xvi-xvii)/4412' }
    ]
  },
    {
    id: 57,
    cat: 'Publicación',
    date: 'Ene. 2021',
    title: 'Publicado el número XXVII (2021) del «Anuario Lope de Vega»',
    excerpt: 'Cuando se cumple un año del fallecimiento de nuestro maestro Alberto Blecua, damos la noticia de la publicación de un nuevo número del Anuario Lope de Vega, revista que él mismo ideó y fundó.',
    img: '../media/anuario-inici.jpg',
    url: 'noticia-volumen-xxvii-anuario.html',
    content: [
      'Cuando se cumple un año del fallecimiento de nuestro maestro Alberto Blecua, damos la noticia de la publicación de un nuevo número del Anuario Lope de Vega, revista que él mismo ideó y fundó.',
      'En esta entrega nuestros lectores encontrarán, además de la acostumbrada sección miscelánea y un nutrido conjunto de reseñas, el monográfico titulado «Los primeros años del teatro comercial en España y el primer Lope (1560-1598)», coordinado por el que fue su último doctorando, Daniel Fernández Rodríguez, ejemplo claro de que su sabiduría ha calado y pervive en las nuevas generaciones.'
    ],
    links: [
      { label: 'Volumen completo', url: 'https://revistes.uab.cat/anuariolopedevega/issue/view/v27' }
    ]
  },
    {
    id: 58,
    cat: 'Seminario',
    date: '15 ene. 2021',
    title: 'Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)»',
    excerpt: 'Nuestra investigadora Florence D’Artois presenta, el próximo 15 de enero, a las 14 h., en el marco del Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)», que ella organiza, la conferencia de Ana Yepes y Anna Romaní «La danza del Siglo de oro español vs otros estilos europeos».',
    img: '../media/mudanzas-enero-2021.jpg',
    url: 'noticia-seminario-mudanzas-danza.html',
    content: [
      'Nuestra investigadora Florence D’Artois presenta, el próximo 15 de enero, a las 14 h., en el marco del Seminario Internacional «Mudanzas: Interpretar el movimiento en España (XVI-XVII)», que ella organiza, la conferencia de Ana Yepes y Anna Romaní «La danza del Siglo de oro español vs otros estilos europeos».'
    ],
    links: [
      { label: 'Cartel', url: 'media/AfficheMudanza_0121.pdf' }
    ]
  },
    {
    id: 59,
    cat: 'Publicación',
    date: 'Ene. 2021',
    title: 'Novedad editorial: «El punto y la voz». La puntuación del texto teatral (siglos XVI-XVIII)',
    excerpt: 'Anunciamos la aparición del volumen »El punto y la voz». La puntuación del texto teatral (siglos XVI-XVIII), coordinado por Luigi Giuliani y Victoria Pineda y publicado por la Università di Pisa.',
    img: '../media/El-punto-y-la-voz.jpg',
    url: 'noticia-novedad-editorial-punto-voz.html',
    content: [
      'Anunciamos la aparición del volumen «El punto y la voz». La puntuación del texto teatral (siglos XVI-XVIII), coordinado por Luigi Giuliani y Victoria Pineda y publicado por la Università di Pisa.',
      'En los versos de una comedia o de una tragedia, la puntuación constituye no solo el armazón de la sintaxis del texto dialogado, sino también las señas interpretativas de los parlamentos, las pausas, la entonación que indican al actor los matices que debe aplicar a su recitado y las pautas de ejecución de la métrica. Y, sin embargo, el trabajo de edición e investigación del teatro del Siglo de Oro raras veces se ha detenido a considerar las implicaciones ecdóticas y performativas de los signos paragrafemáticos. Este volumen recoge los trabajos del XVI Taller Internacional de Estudios Textuales celebrado en la Università di Perugia en 2019, en que se abordó el tema desde múltiples perspectivas. Las indagaciones sobre los manuscritos y los impresos de la comedia española se acompañan con estudios sobre la puntuación de los textos de otras tradiciones teatrales – inglesa, francesa, italiana – de los siglos XVI al XVIII, para esbozar una línea de investigación que en España está aún en ciernes.'
    ],
    links: [
      { label: 'Acceso abierto a la publicación', url: 'https://www.pisauniversitypress.it/scheda-libro/autori-vari/el-punto-y-la-voz-9788833394343-575786.html' }
    ]
  },
    {
    id: 60,
    cat: 'Seminario',
    date: '25 nov. 2020',
    title: 'Seminario Internacional “La Parte XX de comedias de Lope de Vega»',
    excerpt: 'El próximo 25 de noviembre se celebrará el Seminario Internacional «La parte XX de comedias de Lope de Vega», organizado por la profesora Salomé Vuelta, en la Università degli Studi di Firenze.',
    img: '../media/Seminario-Parte-XX.jpg',
    url: 'noticia-seminario-internacional-parte-xx.html',
    content: [
      'El próximo 25 de noviembre se celebrará el Seminario Internacional «La parte XX de comedias de Lope de Vega», organizado por la profesora Salomé Vuelta, en la Università degli Studi di Firenze. El evento se retransmitió en directo.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'media/depliant_ParteXX.pdf' }
    ]
  },
    {
    id: 61,
    cat: 'Beca',
    date: 'Nov. 2020',
    title: 'Becas predoctorales en Prolope',
    excerpt: 'El grupo PROLOPE está en disposición de apoyar candidaturas para las becas predoctorales recién convocadas, FPU e Inphinit Retaining-La Caixa, para los alumnos que deseen realizar una tesis sobre Lope de Vega o el teatro del Siglo de Oro',
    img: '../media/Becas-Prolope.jpg',
    url: 'noticia-becas-predoctorales-prolope.html',
    content: [
      'El grupo PROLOPE está en disposición de apoyar candidaturas para las becas predoctorales recién convocadas, FPU e Inphinit Retaining-La Caixa, para los alumnos que deseen realizar una tesis sobre Lope de Vega o el teatro del Siglo de Oro, ya sea desde una perspectiva más tradicional, de crítica textual e historia de la Literatura, como desde enfoques más transversales, de crítica literaria, recepción, Humanidades digitales, etc.',
      'Al tratarse de concursos muy competititvos, el requisito mínimo de los candidatos debe ser una nota media de expediente de 9 o superior.',
      'El resto de requisitos se hallan en los siguientes enlaces. Se ruega a los candidatos la lectura atenta de la normativa completa y la verificación de que cumplen con todos los puntos requeridos.',
      'Plazos de solicitud: del 16 de noviembre de 2020 al 11 de diciembre  Requisitos principales:     1. Estar matriculado en un programa de doctorado de la UAB en el presente curso o tener la titulación requerida para poder matricularse en un programa de doctorado de la UAB en el curso 2021-2022.   2. Haber conseguido esa titulación en los años establecidos en la convoatoria.   3. Disponer de DNI o NIE en vigor.   Léase con atención la convocatoria completa, por favor.',
      'Plazos de solicitud: del 10 de noviembre de 2020 al 25 de febrero de 2021  Requisitos principales:    1. Experiencia: En la fecha de cierre de la convocatoria los candidatos deben estar en los primeros cuatro años (experiencia de investigación equivalente a tiempo completo) de su carrera investigadora y no haber obtenido un título de doctorado con anterioridad o estar en condiciones de solicitarlo.   2. Expediente académico: En el momento de la contratación, los candidatos deben cumplir con una de las siguientes opciones: – Haber finalizado los estudios que conducen a la obtención de un título universitario oficial español (o de otro país del Espacio Europeo de Educación Superior) de 300 créditos, de los cuales al menos 60 créditos deben corresponder a un nivel de máster. – Haber completado un grado en una universidad no adaptada al Espacio Europeo de Educación Superior que dé acceso a los estudios de doctorado. La verificación del nivel de estudios equivalente a los anteriormente mencionados será realizada por la universidad cuando se inicie el procedimiento de admisión.   3. Movilidad: Para candidatos que desean hacer el doctorado en centros o universidades españolas: los candidatos deben haber residido o haber llevado a cabo su actividad principal (trabajo, estudios, etc.) en España durante más de doce meses en los tres años inmediatamente anteriores a la fecha de cierre de la convocatoria. Los candidatos que obtengan una beca deberán cursar el doctorado en una universidad o centro de investigación donde no hayan cursado anteriormente estudios de grado o licenciatura.   4. Nivel de inglés: Los candidatos deben tener un nivel demostrable de inglés (B2 o superior).  Léase con atención la convocatoria completa, por favor.  CONTACTO: prolope@uab.cat'
    ],
    links: [
      { label: 'Contratos FPU', url: 'http://www.educacionyfp.gob.es/servicios-al-ciudadano/catalogo/general/99/998758/ficha/998758-2020.html' },
      { label: 'Becas Inphinit Retaining-La Caixa', url: 'https://fundacionlacaixa.org/ca/beques-la-caixa-doctorat-inphinit-retaining' }
    ]
  },
    {
    id: 62,
    cat: 'Noticias',
    date: '18 nov. 2020',
    title: 'Presentación de la Parte XIX de las Comedias de Lope de Vega',
    excerpt: 'El próximo 18 de noviembre (17:10 h) se llevará a cabo la presentación virtual de la Parte XIX de las Comedias de Lope de Vega, dentro del marco del Seminario Internacional «Editar a Lope de Vega en el siglo XXI: la Parte XIX de Comedias», coordinado por Alejandro García Reidy.',
    img: '../media/Seminario-Parte-XIX.jpg',
    url: 'noticia-presentacion-parte-xix.html',
    content: [
      'El próximo 18 de noviembre (17:10 h) se llevará a cabo la presentación virtual de la Parte XIX de las Comedias de Lope de Vega, dentro del marco del Seminario Internacional «Editar a Lope de Vega en el siglo XXI: la Parte XIX de Comedias», coordinado por Alejandro García Reidy.',
      'La presentación estará a cargo de Laura Fernández (Universitat Autònoma de Barcelona), Alejandro García Reidy (Universidad de Salamanca), Fernando Plata (Colgate University) y Gonzalo Pontón (Universitat Autònoma de Barcelona). El evento podrá seguirse en streaming.',
      'Se puso a disposición de los asistentes los enlaces a la lección y a la mesa redonda.'
    ],
    links: [
    ]
  },
];
