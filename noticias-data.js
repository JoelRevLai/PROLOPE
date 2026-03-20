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
  
];
