// ── NEWS DATA (shared across noticias.html and individual news pages) ──
const news = [
  {
    id: 1,
    cat: 'Noticias',
    date: '30 jul. 2025',
    title: 'Descubren dos libros de la biblioteca personal de Lope de Vega en Ecuador',
    excerpt: 'El investigador Antonio Sánchez Jiménez halla los volúmenes en un convento de Santo Domingo en Quito.',
    img: 'media/lope-de-vega_ecuador.jpg',
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
    img: 'media/XI-Congreso-Prolope-Cartel.webp',
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
    img: 'media/olmedo-clasico_18.jpg',
    url: 'noticia-olmedo-clasico-18-2024.html',
    content: [
      'Las Jornadas de Olmedo afrontan su decimoctava edición con los objetivos que han sido su razón de ser como parte indisociable del Festival: ayudar a entender a nuestros clásicos desde las claves de su época, analizar su vigencia actual en la investigación académica y en los escenarios o pantallas, contribuir a su difusión y proyectar su futuro.',
    ],
    links: [
      { label: 'Programa en PDF', url: 'docs/18_jornadas_teatro_clasico_2024_0.pdf' },
      { label: 'Web de Olmedo clásico', url: 'https://www.olmedo.es/olmedoclasico/jornadas/18-jornadas-teatro-clasico' }
    ]
  },
  {
    id: 4,
    cat: 'Noticias',
    date: 'jul. 2024',
    title: 'Convocadas dos plazas postdoctorales para el proyecto Thal-IA',
    excerpt: 'Dos plazas de un año, prorrogables un segundo año, para trabajar con manuscritos teatrales del Siglo de Oro, fotografía espectral e Inteligencia Artificial.',
    img: 'media/Thal-IA.jpg',
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
    img: 'media/Premios2024-humanidades-digitales_cuellar.jpg',
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
    img: 'media/escriptura-reescriptura-barroc.jpg',
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
    img: 'media/seminario-pedro-martin-banos.jpg',
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
    img: 'media/documental-lope_rtve.jpg',
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
    img: 'media/SeminarioIA.jpg',
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
    img: 'media/conferencia_merino_fuenteovejuna.jpg',
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
    img: 'media/AnuarioLopedeVega_V30.jpg',
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
    img: 'media/projecte-Thal-IA.jpg',
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
    img: 'media/call-for-papers_lope-politico.jpg',
    url: 'noticia-xi-congreso-call-for-papers-2024.html',
    content: [
      'La extraordinaria labor realizada en investigación sobre el teatro del Siglo de Oro durante los últimos treinta años, con Lope de Vega como estandarte, ha comportado una no menos significativa renovación y ampliación de las perspectivas de análisis.',
      'Sensible a esta realidad, el XI Congreso Internacional de Prolope (que tendrá lugar a finales de noviembre de 2024) quiere prestar atención a esta pregunta sobre lo político, tanto en tiempos de Lope como en el Lope de hoy.',
    ],
    links: [
      { label: 'Primera circular', url: 'docs/PrimeraCircularXILopePolitico.pdf' },
      { label: 'Segunda circular', url: 'docs/SegundaCircularXILopePolitico.pdf' }
    ]
  },
  {
    id: 14,
    cat: 'Seminario',
    date: '5 dic. 2023',
    title: 'Seminario «Estudios clásicos y modernos en torno a Lope de Vega»',
    excerpt: 'Seminario en la Sala de Actos de la UAB con ponencias de Álvaro Cuéllar, Arantxa Llàcer y Guillermo Gómez.',
    img: 'media/seminario_estudios-clasicos.jpg',
    url: 'noticia-seminario-estudios-clasicos-2023.html',
    content: [
      'Seminario en el que se presentaron las ponencias de Álvaro Cuéllar, Arantxa Llàcer y Guillermo Gómez Sánchez-Ferrer en torno a la obra de Lope de Vega.',
      'El evento tuvo lugar en la Sala de Actos de la Facultad de Filosofía y Letras de la UAB.',
    ],
    links: [
      { label: 'Cartel en PDF', url: 'docs/seminario_estudios-clasicos_prolope.pdf' }
    ]
  },
  {
    id: 15,
    cat: 'Conferencia',
    date: '27 nov. 2023',
    title: 'Estudio y reconstrucción de documentos con fotografía espectral',
    excerpt: 'Conferencia y taller de Sergi Claveria en la Biblioteca de Humanidades de la UAB sobre fotografía espectral.',
    img: 'media/Taller_espectral_27_11.jpg',
    url: 'noticia-conferencia-taller-fotografia-espectral-2023.html',
    content: [
      'El lunes 27 de noviembre de 2023, Sergi Claveria pronunció la conferencia-taller en la Biblioteca de Humanidades de la UAB.',
    ],
    links: [
      { label: 'Cartel en PDF', url: 'docs/Taller_espectral_27_11.pdf' }
    ]
  },
  {
    id: 16,
    cat: 'Publicación',
    date: 'Nov. 2023',
    title: 'Publicada la «Parte XXI de las Comedias de Lope de Vega»',
    excerpt: 'Ya disponible la Parte XXII de las Comedias de Lope, coordinada por Fausta Antonucci y Marco Presotto.',
    img: 'media/comedias-parte-xxii_noticia.jpg',
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
    img: 'media/olmedo-clasico_17.jpg',
    url: 'noticia-olmedo-clasico-17-2023.html',
    content: [
      'Las Jornadas de Olmedo vuelven a ocuparse de Lope, no solo para saldar la deuda contraída desde el momento en que el dramaturgo se interesó por un caballero de la Villa.',
      'Y así es como el conocido en su tiempo como el Fénix de los Ingenios confirma año a año la vocación de eternidad que se le atribuye al ave mitológica.',
    ],
    links: [
      { label: 'Programa en PDF', url: 'docs/programa_jornadas_olmedo_uva_2023_horizontal.pdf' },
      { label: 'Web de Olmedo Clásico', url: 'https://www.olmedo.es/olmedoclasico/jornadas/17-jornadas-teatro-clasico' }
    ]
  },
  {
    id: 18,
    cat: 'Seminario',
    date: '25 y 26 may. 2023',
    title: 'Los dramaturgos áureos a través de sus autógrafos',
    excerpt: 'Seminario internacional en la UAB coordinado por Sònia Boadas y Marco Presotto sobre manuscritos autógrafos.',
    img: 'media/seminario-autografos.jpg',
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
    img: 'media/fondo-noticias.jpg',
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
    img: 'media/Alba-Carmona.jpg',
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
    img: 'media/La-Francesa-Laura.jpg',
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
    img: 'media/Anuario-29.jpg',
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
    img: 'media/conferencia_francesa-laura.jpg',
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
    img: 'media/taller-transkribus.jpg',
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
    img: 'media/Proyecto-Creatext.jpg',
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
    img: 'media/Comedias_Parte_XXI.jpg',
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
    img: 'media/Editar_la_danza.jpg',
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
    img: 'media/Desvelando_a_Lope.jpg',
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
    img: 'media/beca-bbva-2022.jpg',
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
    img: 'media/Seminario_Parte_XXII.jpg',
    url: 'noticia-seminario-partes-postumas.html',
    content: [
      'El próximo 10 de junio de 2022 se celebrará, en formato virtual, el Seminario Internacional «Las Partes póstumas de Lope de Vega. La Parte XXII», coordinado por Fausta Antonucci y Marco Presotto.'
    ],
    links: [
      { label: 'Programa (PDF)', url: 'media/Seminario_Parte_XXII.pdf' },
      { label: 'Unirse al evento', url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZWNhYTA2M2QtYTUxMS00Yzg5LWIzOTItOWIxNDYzMjM5ZjJm%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25226b514c29-2391-4831-b774-84f35c45bf01%2522%252c%2522Oid%2522%253a%252234e209f3-e4fb-408e-9d66-7b2cb255538f%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=4da96ae1-85f8-423b-bd2d-b2d8d591dd5c&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true' }
    ]
  },
];
