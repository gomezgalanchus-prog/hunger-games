/* ============================================================
   JDH · MODO HISTORIA — LÓGICA DEL JUEGO
   Estructura:
     1. Datos (distritos, roles, test, arenas, acontecimientos)
     2. Utilidades
     3. Estado de la partida
     4. Pantalla de inicio (tributo)
     5. Test de rol
     6. Mapa de la arena
     7. Gameplay (decisiones, objetos, patrocinadores, acontecimientos)
     8. Final de la arena / victoria
     9. Hotel del Capitolio
    10. Entrevista
    11. Time-skip y segunda arena
    12. Final de la historia
    13. Arranque
   ============================================================ */
'use strict';

/* ============================================================
   1. DATOS
   ============================================================ */

const DISTRITOS = [
  { n: 1,  nombre: 'Lujo',             especialidad: 'Joyas y objetos de lujo',  arma: 'Espada' },
  { n: 2,  nombre: 'Cantería',         especialidad: 'Piedra y albañilería',     arma: 'Lanza' },
  { n: 3,  nombre: 'Tecnología',       especialidad: 'Electrónica',              arma: 'Arco' },
  { n: 4,  nombre: 'Pesca',            especialidad: 'Redes y pesca',            arma: 'Tridente' },
  { n: 5,  nombre: 'Energía',          especialidad: 'Centrales eléctricas',     arma: 'Hacha' },
  { n: 6,  nombre: 'Transporte',       especialidad: 'Vehículos y trenes',       arma: 'Mazo' },
  { n: 7,  nombre: 'Madera',           especialidad: 'Tala y carpintería',       arma: 'Hacha doble' },
  { n: 8,  nombre: 'Textil',           especialidad: 'Tejidos',                  arma: 'Cuchillos' },
  { n: 9,  nombre: 'Grano',            especialidad: 'Cereales',                 arma: 'Hoz' },
  { n: 10, nombre: 'Ganadería',        especialidad: 'Animales',                 arma: 'Lazo y cuchillo' },
  { n: 11, nombre: 'Agricultura',      especialidad: 'Cultivos y huertos',       arma: 'Poda' },
  { n: 12, nombre: 'Minería',          especialidad: 'Carbón',                   arma: 'Pico' }
];

const ROLES = {
  soberbia: {
    clave: 'soberbia',
    nombre: 'Soberbia',
    pecado: 'Orgullo',
    icono: '♛',
    descripcion: 'Amor propio desordenado y excesivo que hace creer a la persona que es superior a las demás, llevándola a menospreciar a los otros.',
    rasgo: 'Desprecias a quien no te alcanza. Atacas de frente, buscas el golpe rápido y rara vez pides ayuda: para ti pedirla es humillarse.',
    stats: { fuerza: -1, resistencia: 0, inteligencia: 1, supervivencia: 0, agilidad: 0, combate: -1, patrocinadores: 0 },
    sesgo: { atacar: 3, huir: -1, ayudar: -2, alianza: -1, sigilo: 0, riesgo: 1 }
  },
  avaricia: {
    clave: 'avaricia',
    nombre: 'Avaricia',
    pecado: 'Codicia',
    icono: '⚜',
    descripcion: 'Deseo desordenado e insaciable por poseer riquezas, bienes materiales o dinero, acumulándolos sin compartirlos ni darles un uso justo. Alguien que haría cualquier cosa con el fin de una buena recompensa.',
    rasgo: 'Nada de lo que encuentras te parece suficiente. Arriesgas por botín, saqueas a los caídos y te cuesta compartir con tu alianza.',
    stats: { fuerza: 0, resistencia: 0, inteligencia: 0, supervivencia: 0, agilidad: 1, combate: 0, patrocinadores: -1 },
    sesgo: { atacar: 1, huir: 0, ayudar: -1, alianza: 0, sigilo: 1, riesgo: 2 }
  },
  lujuria: {
    clave: 'lujuria',
    nombre: 'Lujuria',
    pecado: 'Deseo',
    icono: '❦',
    descripcion: 'Deseo o goce desordenado del placer sexual, tratando a las personas como objetos de satisfacción personal y separando la sexualidad del amor y del compromiso. Para él, las mujeres son su prioridad y no dudará en estar a su favor cueste lo que cueste.',
    rasgo: 'Tu atención se la llevan los demás, y eso te hace vulnerable. Te distraes, proteges a quien no debes y perdonas lo imperdonable.',
    stats: { fuerza: 0, resistencia: 1, inteligencia: 0, supervivencia: -1, agilidad: 1, combate: -1, patrocinadores: -1 },
    sesgo: { atacar: -1, huir: 1, ayudar: 2, alianza: 3, sigilo: -1, riesgo: 0 }
  },
  ira: {
    clave: 'ira',
    nombre: 'Ira',
    pecado: 'Cólera',
    icono: '⚔',
    descripcion: 'Sentimiento descontrolado de enfado, indignación o rencor que impulsa al deseo de venganza, la violencia o la hostilidad hacia el prójimo. No puede controlar su ira y suele acabar hiriendo a los demás. Alguien que se enfada con facilidad y para quien la paciencia es su mayor enemigo.',
    rasgo: 'La paciencia es tu mayor enemigo. Cuando algo te enfurece, no hay plan que valga: golpeas primero y lo piensas después.',
    stats: { fuerza: 1, resistencia: 1, inteligencia: -1, supervivencia: -1, agilidad: 0, combate: 0, patrocinadores: -1 },
    sesgo: { atacar: 3, huir: -3, ayudar: 0, alianza: -1, sigilo: -2, riesgo: 2 }
  },
  gula: {
    clave: 'gula',
    nombre: 'Gula',
    pecado: 'Glotonería',
    icono: '⛨',
    descripcion: 'Consumo excesivo, desmedido e impulsivo de comida y bebida, movido por el apetito desordenado del placer sensorial. Su hambre lo convierte en un monstruo sin cabeza cegado por su apetito. Destruirá todo a su paso con el fin de poder saciar su apetito.',
    rasgo: 'El hambre manda. Devoras las reservas, no piensas en el mañana y tu cuerpo pesado aguanta lo que otros no aguantarían.',
    stats: { fuerza: 1, resistencia: 1, inteligencia: -1, supervivencia: -1, agilidad: -1, combate: 0, patrocinadores: 0 },
    sesgo: { atacar: 2, huir: -1, ayudar: 0, alianza: 0, sigilo: -1, riesgo: 2 }
  },
  envidia: {
    clave: 'envidia',
    nombre: 'Envidia',
    pecado: 'Rencor',
    icono: '◈',
    descripcion: 'Tristeza, amargura o resentimiento ante el bien, las virtudes, el éxito o las posesiones de otra persona, acompañado del deseo de arrebatárselo. Una pizca de envidia es suficiente para descontrolarse.',
    rasgo: 'Ves lo que otros tienen y lo quieres. Traicionas a quien destaca, eliges siempre el camino del que saca ventaja y nunca perdonas un éxito ajeno.',
    stats: { fuerza: -1, resistencia: 0, inteligencia: 1, supervivencia: 0, agilidad: 0, combate: 0, patrocinadores: -1 },
    sesgo: { atacar: 2, huir: -1, ayudar: -2, alianza: 0, sigilo: 1, riesgo: 1 }
  },
  pereza: {
    clave: 'pereza',
    nombre: 'Pereza',
    pecado: 'Acedia',
    icono: '☾',
    descripcion: 'Negligencia, apatía o flojera espiritual y física que lleva a eludir las obligaciones, el trabajo o el cuidado de uno mismo y de los demás. No le importa su vida ni la de los demás si se trata de hacer un gran esfuerzo.',
    rasgo: 'No le importa tu vida ni la de los demás si hay que hacer un gran esfuerzo. Te escondes, esperas y dejas que los demás se maten entre sí.',
    stats: { fuerza: 0, resistencia: -1, inteligencia: 0, supervivencia: -1, agilidad: 1, combate: 0, patrocinadores: 0 },
    sesgo: { atacar: -3, huir: 3, ayudar: -1, alianza: -1, sigilo: 3, riesgo: -2 }
  }
};

const LISTA_STATS = [
  { clave: 'fuerza',        nombre: 'Fuerza' },
  { clave: 'resistencia',   nombre: 'Resistencia' },
  { clave: 'inteligencia',  nombre: 'Inteligencia' },
  { clave: 'supervivencia', nombre: 'Supervivencia' },
  { clave: 'agilidad',      nombre: 'Agilidad' },
  { clave: 'combate',       nombre: 'Combate' },
  { clave: 'patrocinadores',nombre: 'Patrocinadores' }
];

/* ============================================================
   TEST DE ROL · preguntas de vida cotidiana
   Ninguna pregunta es de Los Juegos del Hambre: son situaciones
   normales (trabajo, dinero, amigos, comida, pareja, tráfico…)
   para que el resultado hable de ti y no de la saga.
   ============================================================ */

const PREGUNTAS_BASE = [
  {
    texto: 'Es viernes por la tarde y tu jefe deja caer que «alguien» debería quedarse a terminar el informe. Todos miran al suelo. ¿Qué haces?',
    opciones: [
      { texto: 'Me quedo, pero dejo claro que sin mí esto no sale adelante.', rol: 'soberbia' },
      { texto: 'Me quedo si me lo pagan como horas extra. Todo por escrito.', rol: 'avaricia' },
      { texto: 'Me quedo porque se queda la persona que me gusta.', rol: 'lujuria' },
      { texto: 'Le digo a la cara que lleva tres semanas cargándonos el trabajo.', rol: 'ira' },
      { texto: 'Me quedo, pero antes bajo a por algo de cenar. Y de paso un poco más.', rol: 'gula' },
      { texto: 'Me quedo, pero solo para ver quién no se queda.', rol: 'envidia' },
      { texto: 'Me escabullo en cuanto se gira. Total, siempre hay alguien que se queda.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Un amigo te pide dinero prestado. Otra vez. Todavía no te ha devuelto lo del mes pasado.',
    opciones: [
      { texto: 'Se lo presto y le recuerdo que soy yo el que le está salvando.', rol: 'soberbia' },
      { texto: 'Se lo presto con intereses y un papel firmado.', rol: 'avaricia' },
      { texto: 'Se lo presto sin pensarlo. Es mi amigo y me importa.', rol: 'lujuria' },
      { texto: 'Le digo cuatro cosas y le cierro la puerta en la cara.', rol: 'ira' },
      { texto: 'Se lo presto y me quedo a cenar en su casa.', rol: 'gula' },
      { texto: 'Se lo presto y luego miro a ver a quién más le ha pedido.', rol: 'envidia' },
      { texto: 'Le digo que sí y no vuelvo a contestar sus mensajes.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Vas en el metro, lleno, y alguien te empuja sin pedir perdón.',
    opciones: [
      { texto: 'Le sostengo la mirada hasta que aparta los ojos.', rol: 'soberbia' },
      { texto: 'Aprovecho el empujón para quedarme su sitio, que era el bueno.', rol: 'avaricia' },
      { texto: 'Le sonrío y le dejo pasar. A veces basta con un gesto.', rol: 'lujuria' },
      { texto: 'Le empujo yo también. Más fuerte.', rol: 'ira' },
      { texto: 'Me bajo en la siguiente para comerme un bocadillo tranquilo.', rol: 'gula' },
      { texto: 'Me fijo en si va mejor vestido que yo y me quedo rumiando.', rol: 'envidia' },
      { texto: 'Paso de todo y me apoyo en la puerta. Total, dos paradas.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Tienes la tarde libre. Nada obligatorio. ¿Qué haces?',
    opciones: [
      { texto: 'Organizo el plan y digo a todos dónde hay que ir.', rol: 'soberbia' },
      { texto: 'Miro precios, comparo y compro algo que llevaba meses queriendo.', rol: 'avaricia' },
      { texto: 'Llamo a la persona que me gusta y propongo algo sin pensarlo.', rol: 'lujuria' },
      { texto: 'Voy al gimnasio a descargar todo lo que llevo dentro.', rol: 'ira' },
      { texto: 'Me hago una comida larga, de las de sobremesa y siesta.', rol: 'gula' },
      { texto: 'Abro la red social y comparo mi tarde con la de los demás.', rol: 'envidia' },
      { texto: 'Me quedo en el sofá. Ya habrá tiempo de hacer cosas.', rol: 'pereza' }
    ]
  },
  {
    texto: 'En una cena de amigos, alguien cuenta una anécdota que ya has oído cinco veces y todos se ríen.',
    opciones: [
      { texto: 'Le corrijo un detalle para que quede claro que yo la oí primero.', rol: 'soberbia' },
      { texto: 'Pienso en cómo llevarme la mejor parte del postre mientras habla.', rol: 'avaricia' },
      { texto: 'Le sigo la broma y le hago brillar un poco más.', rol: 'lujuria' },
      { texto: 'Le corto y cuento la mía, que es mejor y más corta.', rol: 'ira' },
      { texto: 'Mientras habla, me acabo el pan de la cesta. Y la de al lado.', rol: 'gula' },
      { texto: 'Espero mi turno para contar algo que haya impresionado más.', rol: 'envidia' },
      { texto: 'Desconecto y asiento sin escuchar. Qué pereza repetir la misma charla.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Te toca organizar el cumpleaños de un familiar y solo hay un presupuesto justo.',
    opciones: [
      { texto: 'Lo organizo yo entero y que nadie me discuta nada.', rol: 'soberbia' },
      { texto: 'Busco la tarta más barata y guardo la diferencia «para imprevistos».', rol: 'avaricia' },
      { texto: 'Me gasto lo que haga falta para que sea un día bonito para todos.', rol: 'lujuria' },
      { texto: 'Exploto cuando alguien no aparece a ayudar después de haberlo dicho.', rol: 'ira' },
      { texto: 'Lo que más me importa es el menú. Lo demás es decorado.', rol: 'gula' },
      { texto: 'Me comparo con el cumpleaños que le hicieron a mi primo, que fue mejor.', rol: 'envidia' },
      { texto: 'Digo que sí y lo dejo para el último día. Ya saldrá.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Un compañero de trabajo recibe el ascenso que tú esperabas.',
    opciones: [
      { texto: 'Le felicito en público y le recuerdo todo lo que he hecho yo.', rol: 'soberbia' },
      { texto: 'Pregunto cuánto van a subirle el sueldo. Por tenerlo claro.', rol: 'avaricia' },
      { texto: 'Le felicito de verdad y le invito a celebrarlo.', rol: 'lujuria' },
      { texto: 'Se lo digo a la cara al jefe: esto es una injusticia.', rol: 'ira' },
      { texto: 'Me consuelo con una comida de las grandes.', rol: 'gula' },
      { texto: 'Repaso todo lo que él tiene y yo no. Y no puedo parar.', rol: 'envidia' },
      { texto: 'Me da igual. Total, más responsabilidad para él.', rol: 'pereza' }
    ]
  }
];

/* ---- Banco ampliado: cada partida se eligen 7 al azar ---- */
const PREGUNTAS_EXTRA = [
  {
    texto: 'Te han dado una tarjeta regalo y no sabes qué hacer con ella.',
    opciones: [
      { texto: 'Compro algo que se vea: quiero que pregunten de dónde es.', rol: 'soberbia' },
      { texto: 'La guardo por si algún día la necesito más.', rol: 'avaricia' },
      { texto: 'Se la doy a alguien que sé que la va a disfrutar más que yo.', rol: 'lujuria' },
      { texto: 'Me la gasto el mismo día, sin pensar. Qué rabia tener que esperar.', rol: 'ira' },
      { texto: 'Todo en comida. Es lo único que de verdad me hace feliz.', rol: 'gula' },
      { texto: 'Miro qué se ha comprado otra gente con la misma tarjeta.', rol: 'envidia' },
      { texto: 'Se queda en el cajón. Ya la usaré algún día.', rol: 'pereza' }
    ]
  },
  {
    texto: 'En el grupo de mensajes alguien propone un plan de fin de semana que a ti no te apetece nada.',
    opciones: [
      { texto: 'Digo lo que hay que hacer y espero que se sumen.', rol: 'soberbia' },
      { texto: 'Propongo lo que sale más barato y así todos contentos.', rol: 'avaricia' },
      { texto: 'Me apunto solo si va la persona que me interesa.', rol: 'lujuria' },
      { texto: 'Escribo lo que pienso del plan sin filtro ninguno.', rol: 'ira' },
      { texto: 'Me apunto si hay comida buena de por medio.', rol: 'gula' },
      { texto: 'Comparo: al parecer a todos les apetece más que a mí. Raro.', rol: 'envidia' },
      { texto: 'No contesto. Que decidan ellos.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Un vecino pone música alta a las dos de la mañana. Otra vez.',
    opciones: [
      { texto: 'Bajo y le digo delante de todos que esto no se hace.', rol: 'soberbia' },
      { texto: 'Bajo y le pido que me compense por las molestias.', rol: 'avaricia' },
      { texto: 'Bajo, hablo con él y acabo quedándome un rato en su casa.', rol: 'lujuria' },
      { texto: 'Golpeo la pared con fuerza hasta que se calla.', rol: 'ira' },
      { texto: 'Me levanto, me hago un bocadillo y me quedo despierto de todas formas.', rol: 'gula' },
      { texto: 'Me quedo pensando en lo bien que vive sin pensar en los demás.', rol: 'envidia' },
      { texto: 'Me pongo tapones. Ya se cansará.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Te ofrecen un trabajo mejor pagado a dos horas de casa, y tendrías que dejar tu vida aquí.',
    opciones: [
      { texto: 'Lo acepto y que todos sepan que he sido elegido yo.', rol: 'soberbia' },
      { texto: 'Lo acepto y negocio cada céntimo del contrato antes de firmar.', rol: 'avaricia' },
      { texto: 'Lo rechazo porque aquí está la gente que me importa.', rol: 'lujuria' },
      { texto: 'Lo acepto para demostrar algo a quien dijo que no lo conseguiría.', rol: 'ira' },
      { texto: 'Lo primero que miro es si hay buena comida cerca del trabajo.', rol: 'gula' },
      { texto: 'Lo acepto solo porque el que lo rechazó fue un compañero que no lo merece.', rol: 'envidia' },
      { texto: 'No contesto a la oferta. Qué pereza empezar de cero.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Es tu cumpleaños y nadie se ha acordado. Ya es la tarde.',
    opciones: [
      { texto: 'Escribo en el grupo recordando la fecha. Que quede claro.', rol: 'soberbia' },
      { texto: 'Pienso en lo que me habría gustado que me regalaran.', rol: 'avaricia' },
      { texto: 'Llamo a la persona que quiero y me la llevo a cenar.', rol: 'lujuria' },
      { texto: 'Me enfado de verdad. Con todos.', rol: 'ira' },
      { texto: 'Me compro una tarta entera y me la como yo solo.', rol: 'gula' },
      { texto: 'Miro las fotos de los cumpleaños de los demás. Todos tenían tarta.', rol: 'envidia' },
      { texto: 'Me quedo en casa. Total, es un día como otro cualquiera.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Encuentras una cartera en la calle, con dinero y el carné del dueño.',
    opciones: [
      { texto: 'La devuelvo en persona y le explico lo fácil que habría sido quedármela.', rol: 'soberbia' },
      { texto: 'Me quedo el dinero y devuelvo el carné. Nadie sale perdiendo del todo.', rol: 'avaricia' },
      { texto: 'La devuelvo y, si hay buena química, quedamos a tomar algo.', rol: 'lujuria' },
      { texto: 'Me indigna que la gente pierda cosas. La dejo en el mostrador de mal humor.', rol: 'ira' },
      { texto: 'Con el dinero me compro algo de comer. Total, ya está perdido.', rol: 'gula' },
      { texto: 'Miro a ver si el dueño parece tener más dinero que yo.', rol: 'envidia' },
      { texto: 'La dejo donde está. Que la encuentre quien la haya perdido.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Un amigo te cuenta un problema serio. Lleva media hora hablando.',
    opciones: [
      { texto: 'Le interrumpo y le explico exactamente lo que tiene que hacer.', rol: 'soberbia' },
      { texto: 'Le escucho, pero pienso en lo que me va a costar a mí ayudarle.', rol: 'avaricia' },
      { texto: 'Le escucho entero y me quedo con él hasta que se calme.', rol: 'lujuria' },
      { texto: 'Me indigno con él y quiero ir a decirle cuatro cosas al culpable.', rol: 'ira' },
      { texto: 'Le invito a comer algo para que se desahogue con el estómago lleno.', rol: 'gula' },
      { texto: 'Le escucho y me pregunto por qué a él le pasan cosas y a mí no.', rol: 'envidia' },
      { texto: 'Asiento y miro el móvil. Ya se le pasará.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Te proponen ir de rebajas a las siete de la mañana para conseguir la mejor oferta.',
    opciones: [
      { texto: 'Voy y me pongo el primero de la cola. Que me vean.', rol: 'soberbia' },
      { texto: 'Voy. Es la única razón por la que valdría la pena madrugar.', rol: 'avaricia' },
      { texto: 'Voy si viene también quien me gusta. Por él madrugo.', rol: 'lujuria' },
      { texto: 'Voy, y como alguien se cuele, se entera.', rol: 'ira' },
      { texto: 'Voy por el puesto de comida de la esquina.', rol: 'gula' },
      { texto: 'Voy a ver qué compran los demás, por si es mejor que lo mío.', rol: 'envidia' },
      { texto: 'A las siete de la mañana no voy ni aunque me lo regalen.', rol: 'pereza' }
    ]
  },
  {
    texto: 'Tu equipo gana un premio y te toca hablar en nombre de todos.',
    opciones: [
      { texto: 'Hablo yo. Es lo lógico: nadie lo habría hecho mejor.', rol: 'soberbia' },
      { texto: 'Hablo y menciono el esfuerzo extra que he puesto yo.', rol: 'avaricia' },
      { texto: 'Doy las gracias a todos, uno por uno, y se me nota el cariño.', rol: 'lujuria' },
      { texto: 'Aprovecho para decir lo que pienso de los que no han ayudado.', rol: 'ira' },
      { texto: 'Propongo celebrarlo con una comida. Lo único importante.', rol: 'gula' },
      { texto: 'Hablo, pero mirando al que el año pasado se llevó el mío.', rol: 'envidia' },
      { texto: 'Dejo que hable otro y me quedo detrás. Que se luzcan.', rol: 'pereza' }
    ]
  }
];

/* Mezcla y recorta: cada partida tiene preguntas distintas y opciones en otro orden */
function prepararPreguntasPartida() {
  const banco = PREGUNTAS_BASE.concat(PREGUNTAS_EXTRA);
  const elegidas = barajar(banco).slice(0, 7);
  return elegidas.map((p) => ({ ...p, opciones: barajar(p.opciones) }));
}

/* Cuántas preguntas de vida cotidiana hay en total */
const TOTAL_PREGUNTAS = PREGUNTAS_BASE.length + PREGUNTAS_EXTRA.length;

let PREGUNTAS = [];

/* ---- Objetos: curativos y armas ---- */
const CURATIVOS = {
  'Vendas':            { tipo: 'curativo', cura: 18, texto: 'Te vendas las heridas con lo que queda limpio.', cordura: 4 },
  'Antibiótico':       { tipo: 'curativo', cura: 26, texto: 'Traga el antibiótico amargo. La fiebre baja.', cordura: 3 },
  'Botiquín del Capitolio': { tipo: 'curativo', cura: 40, texto: 'Abres el botiquín plateado del Capitolio. Medicina de verdad.', cordura: 8 },
  'Bebida energética': { tipo: 'curativo', cura: 14, texto: 'Te bebes la lata de golpe. El azúcar te devuelve el pulso.', cordura: 2, cansancio: -30 },
  'Analgésicos':       { tipo: 'curativo', cura: 10, texto: 'Te tragas dos pastillas y esperas a que el dolor se vaya.', cordura: 6 },
  'Sutura de campaña': { tipo: 'curativo', cura: 22, texto: 'Te coses la herida con hilo de pescar. Duele más de lo que ayuda, pero ayuda.', cordura: -2 },
  'Suero de los Vigilantes': { tipo: 'curativo', cura: 32, texto: 'Te inyectas el suero de los Vigilantes. El pulso se te acelera y la cabeza se despeja.', cordura: 5, cansancio: -15 },
  'Té de corteza':     { tipo: 'curativo', cura: 8, texto: 'Hierves corteza en el agua. Sabe a tierra, pero calma el dolor.', cordura: 8, cansancio: -8 },
  'Ración de rescate': { tipo: 'curativo', cura: 12, texto: 'Te comes la ración de rescate del Capitolio. No cura heridas, pero te devuelve al mundo.', cordura: 4, cansancio: -25 },
  'Miel medicinal':    { tipo: 'curativo', cura: 16, texto: 'Untas miel en las heridas abiertas. Escuece y luego alivia.', cordura: 3 }
};

const ARMAS = {
  'Cuchillo de caza': { tipo: 'arma', dano: 12, usos: 3, texto: 'un cuchillo de caza' },
  'Machete oxidado':  { tipo: 'arma', dano: 16, usos: 2, texto: 'un machete oxidado' },
  'Hacha de mano':    { tipo: 'arma', dano: 22, usos: 2, texto: 'un hacha de mano' },
  'Lanza improvisada':{ tipo: 'arma', dano: 20, usos: 1, texto: 'una lanza improvisada' },
  'Arco de caza':     { tipo: 'arma', dano: 26, usos: 3, texto: 'un arco de caza' },
  'Espada del Capitolio': { tipo: 'arma', dano: 34, usos: 2, texto: 'una espada del Capitolio' },
  'Ballesta de caza': { tipo: 'arma', dano: 24, usos: 2, texto: 'una ballesta de caza' },
  'Maza de los Vigilantes': { tipo: 'arma', dano: 30, usos: 1, texto: 'una maza de los Vigilantes' },
  'Tridente':         { tipo: 'arma', dano: 28, usos: 2, texto: 'un tridente de pesca' },
  'Hoz de segar':     { tipo: 'arma', dano: 18, usos: 3, texto: 'una hoz de segar' },
  'Pico de minero':   { tipo: 'arma', dano: 26, usos: 2, texto: 'un pico de minero' },
  'Daga curva':       { tipo: 'arma', dano: 14, usos: 4, texto: 'una daga curva' },
  'Red de pesca lastrada': { tipo: 'arma', dano: 10, usos: 2, texto: 'una red de pesca con plomos' },
  'Cuchillo arrojadizo': { tipo: 'arma', dano: 11, usos: 3, texto: 'un cuchillo arrojadizo' },
  'Bate con clavos':  { tipo: 'arma', dano: 20, usos: 2, texto: 'un bate con clavos' },
  'Sierra de tala':   { tipo: 'arma', dano: 21, usos: 2, texto: 'una sierra de tala' }
};

/* Objetos de equipo: no curan ni golpean, pero se gastan solos cuando hacen falta */
const OTROS = {
  'Raciones':        { tipo: 'otro', cansancio: -18, texto: 'Comes las raciones: el hambre deja de doler por un rato.' },
  'Cantimplora':     { tipo: 'otro', vida: 4, cansancio: -10, texto: 'Bebes de la cantimplora. El agua te devuelve el pulso.' },
  'Cuerda':          { tipo: 'otro', util: 'huida', texto: 'La cuerda te salva de una caída.' },
  'Linterna':        { tipo: 'otro', util: 'noche', texto: 'La linterna corta la oscuridad.' },
  'Yesca':           { tipo: 'otro', util: 'fuego', texto: 'La yesca enciende el fuego a la primera.' },
  'Mapa de la arena':{ tipo: 'otro', util: 'mapa', texto: 'El mapa te dice por dónde no volver.' },
  'Saco de dormir':  { tipo: 'otro', cansancio: -22, cordura: 6, texto: 'Duermes de verdad un par de horas en el saco.' },
  'Señuelo de caza': { tipo: 'otro', util: 'trampa', texto: 'El señuelo distrae a un muto o a un tributo.' }
};

const OTROS_OBJETOS = Object.keys(OTROS);

/* Provisiones que aparecen en el botín: llenan hambre y sed */
const PROVISIONES = ['Raciones', 'Ración de rescate', 'Carne asada', 'Bayas secas', 'Pan de distrito',
  'Pescado ahumado', 'Tarta del Capitolio', 'Cantimplora', 'Agua de lluvia', 'Zumo de baya'];

function provisionAleatoria() {
  return elegir(PROVISIONES);
}

/* Comida y bebida: lo que llena la barra de hambre y de sed */
const COMIDA = {
  'Raciones': { hambre: 45 },
  'Ración de rescate': { hambre: 30 },
  'Carne asada': { hambre: 55 },
  'Bayas secas': { hambre: 20 },
  'Pan de distrito': { hambre: 25 },
  'Pescado ahumado': { hambre: 40 },
  'Tarta del Capitolio': { hambre: 35, cordura: 8 }
};

const BEBIDA = {
  'Cantimplora': { sed: 50, potable: true },
  'Agua de lluvia': { sed: 30, potable: true },
  'Zumo de baya': { sed: 35, potable: true },
  'Bebida energética': { sed: 20, potable: true },
  'Agua de arroyo': { sed: 45, potable: true },
  'Agua del estanque': { sed: 40, potable: false },
  'Agua turbia': { sed: 35, potable: false },
  'Charca del sector': { sed: 38, potable: false }
};

/* ¿Se puede beber sin riesgo? */
function esPotable(nombre) {
  return BEBIDA[nombre] ? BEBIDA[nombre].potable === true : false;
}

/* Bebidas que no son potables: alta probabilidad de enfermar, muy baja de librarse */
const RIESGO_AGUA_SUCIA = 0.88;

/* Enfermedad por beber agua contaminada: resta vida cada turno hasta que se cura */
function enfermar(gravedad) {
  estado.enfermo = {
    nombre: gravedad === 'grave' ? 'Fiebre de la arena' : 'Retortijones',
    turnos: gravedad === 'grave' ? 5 : 3,
    dano: gravedad === 'grave' ? 7 : 4
  };
  estado.heridas.push({ nombre: estado.enfermo.nombre, gravedad: gravedad === 'grave' ? 'grave' : 'leve' });
  estado.cordura = clamp(estado.cordura - 8, 0, 100);
}

/* Avance de la enfermedad en cada turno */
function procesarEnfermedad() {
  if (!estado.enfermo) return;
  estado.enfermo.turnos -= 1;
  const d = estado.enfermo.dano;
  estado.vida = clamp(estado.vida - d, 0, 100);
  if (estado.vida <= 0) estado.causaMuerte = 'Fiebre alta: el agua de la arena te pudrió por dentro.';
  narrar(`<span class="linea-muerte">${escapar(estado.enfermo.nombre)}: pierdes ${d} de vida.</span>`);
  if (estado.enfermo.turnos <= 0) {
    const nombre = estado.enfermo.nombre;
    estado.heridas = estado.heridas.filter((h) => h.nombre !== nombre);
    estado.enfermo = null;
    narrar('<span class="linea-bien">La fiebre baja por fin. El cuerpo aguanta.</span>');
  }
}

/* Gasta un objeto de equipo y devuelve su frase (o '' si no hay) */
function gastarObjetoDe(util) {
  const nombre = estado.inventario.find((i) => OTROS[i] && OTROS[i].util === util);
  if (!nombre) return '';
  estado.inventario = estado.inventario.filter((i) => i !== nombre);
  return OTROS[nombre].texto;
}

/* Paquetes de botín: cada partida reparte cosas distintas */
const BOTINES = {
  mochila: [
    ['Cuchillo de caza', 'Raciones', 'Cantimplora'],
    ['Daga curva', 'Analgésicos', 'Yesca'],
    ['Cuchillo arrojadizo', 'Miel medicinal', 'Mapa de la arena'],
    ['Machete oxidado', 'Té de corteza', 'Linterna']
  ],
  cornucopia: [
    ['Espada del Capitolio', 'Vendas', 'Cantimplora'],
    ['Ballesta de caza', 'Sutura de campaña', 'Saco de dormir'],
    ['Tridente', 'Suero de los Vigilantes', 'Cuerda'],
    ['Maza de los Vigilantes', 'Ración de rescate', 'Linterna']
  ],
  campamento: [
    ['Hacha de mano', 'Vendas', 'Raciones'],
    ['Pico de minero', 'Antibiótico', 'Mapa de la arena'],
    ['Sierra de tala', 'Miel medicinal', 'Señuelo de caza'],
    ['Bate con clavos', 'Analgésicos', 'Saco de dormir']
  ],
  sigilo: [
    ['Cuerda', 'Raciones', 'Bebida energética'],
    ['Cuchillo arrojadizo', 'Té de corteza', 'Señuelo de caza'],
    ['Hoz de segar', 'Ración de rescate', 'Yesca'],
    ['Red de pesca lastrada', 'Miel medicinal', 'Cantimplora']
  ]
};

function botinAleatorio(tipo) {
  if (tipo === 'provisiones') return [provisionAleatoria(), provisionAleatoria()];
  return elegir(BOTINES[tipo] || BOTINES.mochila).slice();
}

function armaAleatoria() {
  return elegir(Object.keys(ARMAS));
}

/* ---- Arenas ---- */
const ARENAS = {
  lago: {
    id: 'lago',
    edicion: 74,
    nombre: 'El Lago',
    descripcion: 'Un lago enorme en el centro, una cornucopia de metal en su orilla y un bosque cerrado alrededor.',
    mapaInfo: 'Sin reloj ni sectores fijos: aquí la cornucopia es la única zona segura y el agua, la única trampa.',
    eventos: ['niebla', 'bestias', 'inundacion', 'tormenta', 'sangre'],
    multiplicador: 1
  },
  reloj: {
    id: 'reloj',
    edicion: 75,
    nombre: 'El Reloj de Piedra',
    descripcion: 'Un reloj de piedra gigante en el centro, lleno de armas, bosques alrededor y un gran árbol que lo vigila todo.',
    mapaInfo: 'Cada 2 horas el reloj gira de sector y libera un acontecimiento: niebla, avispas, bestias o catástrofes.',
    eventos: ['niebla', 'avispas', 'bestias', 'terremoto', 'inundacion', 'tormenta', 'sangre'],
    multiplicador: 1.45
  }
};

/* Acontecimientos de la arena */
const ACONTECIMIENTOS = [
  { id: 'niebla',   icono: '☁', titulo: 'Niebla venenosa',     texto: 'Una bruma espesa y dulce avanza desde el borde oeste. Quema la piel y cierra la garganta.' },
  { id: 'avispas',  icono: '🐝', titulo: 'Avispas letales',     texto: 'Enjambres de avispas modificadas por el Capitolio salen de los árboles buscando calor humano.' },
  { id: 'bestias',  icono: '🐺', titulo: 'Bestias mutantes',    texto: 'Aullidos en el bosque. Los mutos del Capitolio cazan en manada y no se cansan.' },
  { id: 'terremoto',icono: '⛰', titulo: 'Catástrofe natural',  texto: 'La tierra ruge. El reloj de piedra se agrieta y el suelo se abre bajo los pies de todos.' },
  { id: 'inundacion',icono: '🌊', titulo: 'Inundación',        texto: 'El agua crece de golpe. Arrastra árboles, armas y cuerpos por igual.' },
  { id: 'tormenta', icono: '⚡', titulo: 'Tormenta eléctrica', texto: 'El cielo del Capitolio se enciende. Los rayos caen sobre el gran árbol y el aire huele a metal.' },
  { id: 'sangre',   icono: '🩸', titulo: 'Lluvia de sangre',   texto: 'Empieza a llover rojo sobre la arena. Los patrocinadores están impacientes y el Capitolio lo nota.' }
];

const NOMBRES_POOL = [
  'Katniss', 'Peeta', 'Gale', 'Rue', 'Clove', 'Cato', 'Thresh', 'Foxface', 'Prim', 'Haymitch',
  'Johanna', 'Finnick', 'Beetee', 'Wiress', 'Annie', 'Boggs', 'Cashmere', 'Gloss', 'Brutus', 'Enobaria',
  'Mags', 'Seeder', 'Cecelia', 'Marvel', 'Glimmer', 'Twill', 'Cinna', 'Effie', 'Plutarch', 'Coriolanus',
  'Lavinia', 'Corina', 'Marco', 'Silas', 'Nadia', 'Aurelio', 'Vespera', 'Tobias', 'Lira', 'Rurik'
];

/* ============================================================
   2. UTILIDADES
   ============================================================ */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const azar = (n) => Math.floor(Math.random() * n);
const elegir = (arr) => arr[azar(arr.length)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function barajar(arr) {
  const copia = arr.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = azar(i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function horaLegible(hora) {
  const h = ((hora % 24) + 24) % 24;
  return `${String(h).padStart(2, '0')}:00`;
}

function escapar(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ============================================================
   3. ESTADO DE LA PARTIDA
   ============================================================ */

const estado = {
  nombre: '',
  distrito: null,
  presentacion: '',
  rol: null,
  stats: {},
  fama: 0,
  tributos: [],
  yo: null,
  arena: 'lago',
  edicion: 74,
  hora: 0,
  sector: 0,
  turno: 0,
  vida: 100,
  cansancio: 0,
  cordura: 100,
  patrocinio: 0,
  heridas: [],
  sangrado: false,
  inventario: [],
  alianza: [],
  historial: [],
  vivo: true,
  fin: false,
  proximoAcontecimiento: 2,
  totalMuertes: 0,
  /* historia */
  armaUsada: '',
  entrevistaPuntos: 0,
  imagen: 'neutral',
  ediciones: [],
  esperandoEleccion: false,
  bloqueoCombate: false,
  causaMuerte: '',
  enCombate: false,
  ultimaAccion: null,
  ultimoEco: '',
  cazar: 3,
  trampas: 0,
  pedir: 1,
  // Hambre y sed (100 = saciado, 0 = al límite)
  hambre: 100,
  sed: 100,
  privacion: 0,
  enfermo: null,
  // Clima y oscuridad
  clima: 'despejado',
  climaTurnos: 0,
  // Eventos con decisiones (Cornucopia / Fiesta del Capitolio)
  cornucopiaTurno: 0,
  cornucopiaAbierta: false,
  fiestaTurno: 0,
  fiestaAbierta: false,
  objetivo: null,
  victoria74: false
};

function statsBase() {
  const base = {};
  LISTA_STATS.forEach((s) => { base[s.clave] = 5; });
  return base;
}

function aplicarRol(claveRol) {
  const rol = ROLES[claveRol];
  const stats = statsBase();
  LISTA_STATS.forEach((s) => {
    stats[s.clave] = clamp(stats[s.clave] + (rol.stats[s.clave] || 0) * 2, 1, 10);
  });
  return stats;
}

/* ============================================================
   4. PANTALLA DE INICIO
   ============================================================ */

const formTributo = $('#form-tributo');
const inputNombre = $('#input-nombre');
const textareaPres = $('#textarea-pres');
const contadorPres = $('#contador-pres');
const ayudaNombre = $('#ayuda-nombre');
const listaDistritos = $('#lista-distritos');

function pintarDistritos() {
  listaDistritos.innerHTML = '';
  DISTRITOS.forEach((d) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'distrito';
    btn.dataset.distrito = d.n;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.innerHTML = `<span class="distrito__num">Distrito ${d.n}</span>
                     <span class="distrito__nom">${d.nombre}</span>`;
    btn.addEventListener('click', () => {
      $$('.distrito', listaDistritos).forEach((b) => {
        b.classList.remove('elegido');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('elegido');
      btn.setAttribute('aria-checked', 'true');
      estado.distrito = d.n;
      $('#ayuda-distrito').textContent = `${d.especialidad}. Tu compañero de distrito luchará a tu lado… hasta que no le convenga.`;
      guardarConfig();
    });
    listaDistritos.appendChild(btn);
  });
}

/* ---------- Configuración guardada entre partidas ---------- */
const CLAVE_CONFIG = 'jdh.config';

function guardarConfig() {
  try {
    localStorage.setItem(CLAVE_CONFIG, JSON.stringify({
      nombre: inputNombre.value.trim(),
      distrito: estado.distrito || null,
      presentacion: textareaPres.value
    }));
  } catch (e) { /* modo privado: seguimos sin guardar */ }
}

function leerConfig() {
  try {
    const crudo = localStorage.getItem(CLAVE_CONFIG);
    return crudo ? JSON.parse(crudo) : null;
  } catch (e) {
    return null;
  }
}

function restaurarConfig() {
  const cfg = leerConfig();
  if (!cfg) return;

  if (cfg.nombre) inputNombre.value = cfg.nombre;
  if (cfg.presentacion) textareaPres.value = cfg.presentacion;
  actualizarContadorPres();

  if (cfg.distrito) {
    estado.distrito = cfg.distrito;
    const d = DISTRITOS.find((x) => x.n === cfg.distrito);
    const btn = listaDistritos.querySelector(`[data-distrito="${cfg.distrito}"]`);
    if (btn) {
      btn.classList.add('elegido');
      btn.setAttribute('aria-checked', 'true');
      btn.scrollIntoView({ block: 'nearest' });
    }
    if (d) {
      $('#ayuda-distrito').textContent =
        `${d.especialidad}. Tu compañero de distrito luchará a tu lado… hasta que no le convenga.`;
    }
    $('#ayuda-distrito').classList.remove('error');
  }

  const aviso = $('#aviso-config');
  if (aviso) {
    aviso.hidden = false;
    aviso.textContent = 'Se han recuperado tus datos de la última partida. Puedes cambiarlos cuando quieras.';
  }
}

function actualizarContadorPres() {
  contadorPres.textContent = `${textareaPres.value.length} / 240`;
}

textareaPres.addEventListener('input', actualizarContadorPres);
textareaPres.addEventListener('change', guardarConfig);
inputNombre.addEventListener('change', guardarConfig);

/* Análisis de la presentación: honestidad + amabilidad - arrogancia */
function analizarPresentacion(texto) {
  const t = texto.toLowerCase();
  const positivas = ['ayudar', 'ayuda', 'juntos', 'junto', 'gracias', 'honest', 'verdad', 'sincer', 'amable',
    'amistad', 'compartir', 'comparto', 'familia', 'herman', 'hermana', 'proteger', 'protejo', 'cuidar',
    'respeto', 'humilde', 'pequeñ', 'débil', 'lucharé por', 'lucho por', 'paz', 'bondad', 'luz', 'esperanza'];
  const negativas = ['soy el mejor', 'la mejor', 'soy superior', 'mataré a todos', 'matare a todos', 'os mataré',
    'os matare', 'soy invencible', 'nadie puede', 'os destruiré', 'os destruire', 'sangre', 'miedo', 'dominaré',
    'dominare', 'rey', 'reina', 'basura', 'estúpid', 'estupid', 'todos morirán', 'todos moriran'];

  let puntos = 0;
  positivas.forEach((p) => { if (t.includes(p)) puntos += 1; });
  negativas.forEach((p) => { if (t.includes(p)) puntos -= 1; });
  if (t.length > 120) puntos += 1;
  if (t.length < 15) puntos -= 1;
  return clamp(puntos, -4, 5);
}

formTributo.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim().replace(/\s+/g, ' ');
  if (nombre.length < 2) {
    ayudaNombre.textContent = 'El Capitolio exige un nombre de al menos 2 caracteres.';
    ayudaNombre.classList.add('error');
    inputNombre.focus();
    return;
  }
  if (!estado.distrito) {
    $('#ayuda-distrito').textContent = 'Elige un distrito antes de continuar.';
    $('#ayuda-distrito').classList.add('error');
    return;
  }

  ayudaNombre.classList.remove('error');
  ayudaNombre.textContent = 'De 2 a 18 caracteres.';
  $('#ayuda-distrito').classList.remove('error');

  estado.nombre = nombre;
  estado.presentacion = textareaPres.value.trim();
  estado.fama = analizarPresentacion(estado.presentacion);
  guardarConfig();

  irA('test');
  iniciarTest();
});

/* ============================================================
   5. TEST DE ROL
   ============================================================ */

const test = {
  indice: 0,
  puntos: {}
};

function iniciarTest() {
  test.indice = 0;
  test.puntos = {};
  // Cada partida: preguntas distintas del banco y opciones en otro orden
  PREGUNTAS = prepararPreguntasPartida();
  Object.keys(ROLES).forEach((k) => { test.puntos[k] = 0; });
  pintarPregunta();
}

function pintarPregunta() {
  const p = PREGUNTAS[test.indice];
  $('#test-contador').textContent = `${test.indice + 1} / ${PREGUNTAS.length}`;
  $('#test-barra').style.width = `${(test.indice / PREGUNTAS.length) * 100}%`;
  $('#test-pregunta').textContent = p.texto;

  const caja = $('#test-opciones');
  caja.innerHTML = '';
  const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  p.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${letras[i]}</span><span>${escapar(op.texto)}</span>`;
    btn.addEventListener('click', () => responder(op.rol));
    caja.appendChild(btn);
  });
}

function responder(rol) {
  test.puntos[rol] += 1;
  test.indice += 1;

  if (test.indice < PREGUNTAS.length) {
    pintarPregunta();
    return;
  }

  $('#test-barra').style.width = '100%';
  mostrarResultadoRol();
}

function rolGanador() {
  let mejor = null;
  let max = -1;
  Object.entries(test.puntos).forEach(([rol, pts]) => {
    if (pts > max) { max = pts; mejor = rol; }
  });
  return mejor;
}

function mostrarResultadoRol() {
  const clave = rolGanador();
  const rol = ROLES[clave];
  estado.rol = clave;
  estado.stats = aplicarRol(clave);

  $('#rol-nombre').textContent = `${rol.icono} ${rol.nombre}`;
  $('#rol-pecado').textContent = `Pecado capital · ${rol.pecado}`;
  $('#rol-descripcion').textContent = rol.descripcion;

  const caja = $('#rol-stats');
  caja.innerHTML = '';
  LISTA_STATS.forEach((s) => {
    const valor = estado.stats[s.clave];
    const fila = document.createElement('div');
    fila.className = 'stat';
    fila.dataset.neg = valor <= 4 ? 'true' : 'false';
    fila.innerHTML = `<span>${s.nombre}</span>
      <div class="stat__pista"><div class="stat__barra"></div></div>
      <span class="stat__valor">${valor}</span>`;
    caja.appendChild(fila);
    requestAnimationFrame(() => {
      fila.querySelector('.stat__barra').style.width = `${valor * 10}%`;
    });
  });

  $('#rol-aviso').innerHTML =
    `<strong>Tu rol marcará cada decisión.</strong> ${rol.rasgo}<br><br>` +
    `Fama de presentación: <strong>${estado.fama >= 0 ? '+' : ''}${estado.fama}</strong> · ` +
    `Los patrocinadores premian la honestidad y la amabilidad, no la arrogancia.`;

  irA('rol');
}

$('#btn-ir-mapa').addEventListener('click', () => {
  iniciarHistoria();
  irA('mapa');
});

/* ============================================================
   6. MAPA / ARENA
   ============================================================ */

const POSICIONES = {
  lago: [
    { x: 500, y: 300, zona: 'Orilla de la cornucopia' },
    { x: 430, y: 268, zona: 'Orilla de la cornucopia' },
    { x: 566, y: 272, zona: 'Orilla de la cornucopia' },
    { x: 500, y: 400, zona: 'Orilla sur del lago' },
    { x: 330, y: 120, zona: 'Pradera' },
    { x: 660, y: 130, zona: 'Pradera' },
    { x: 505, y: 552, zona: 'Pinar' },
    { x: 600, y: 520, zona: 'Pinar' },
    { x: 205, y: 300, zona: 'Río' },
    { x: 820, y: 300, zona: 'Bosque este' },
    { x: 120, y: 430, zona: 'Bosque oeste' },
    { x: 880, y: 460, zona: 'Bosque sureste' }
  ],
  reloj: [
    { x: 500, y: 300, zona: 'Cornucopia' },
    { x: 410, y: 250, zona: 'Cornucopia' },
    { x: 590, y: 430, zona: 'Cornucopia' },
    { x: 300, y: 180, zona: 'Bosque oeste' },
    { x: 210, y: 300, zona: 'Río' },
    { x: 700, y: 200, zona: 'Bosque este' },
    { x: 820, y: 300, zona: 'Bosque este' },
    { x: 500, y: 150, zona: 'Gran árbol' },
    { x: 300, y: 520, zona: 'Sur del río' },
    { x: 700, y: 540, zona: 'Bosque sur' },
    { x: 120, y: 430, zona: 'Bosque oeste' },
    { x: 880, y: 460, zona: 'Bosque sureste' }
  ]
};

/* Crea los 24 tributos. Si recibe una plantilla, reutiliza los mismos participantes. */
function crearTributos(plantilla) {
  const usados = new Set();
  const tributos = [];
  let id = 0;
  const clavesRol = Object.keys(ROLES);

  DISTRITOS.forEach((d) => {
    for (let i = 0; i < 2; i++) {
      const esYo = d.n === estado.distrito && i === 0;
      const previo = plantilla ? plantilla.find((p) => p.distrito === d.n && p.yo === esYo) : null;

      let nombre;
      if (esYo) {
        nombre = estado.nombre;
      } else if (previo) {
        nombre = previo.nombre;
      } else {
        const candidatos = NOMBRES_POOL.filter((n) => !usados.has(n.toLowerCase()));
        nombre = candidatos.length ? elegir(candidatos) : `Tributo ${d.n}-${i + 1}`;
      }
      usados.add(nombre.toLowerCase());

      const rol = esYo ? estado.rol : (previo ? previo.rol : elegir(clavesRol));
      const pos = POSICIONES[estado.arena][id % POSICIONES[estado.arena].length];

      const t = {
        id: id++,
        nombre,
        distrito: d.n,
        distritoNombre: d.nombre,
        arma: d.arma,
        rol,
        rolNombre: ROLES[rol].nombre,
        yo: esYo,
        vivo: true,
        vida: 100,
        heridas: [],
        alianza: [],
        traicionero: previo ? previo.traicionero : Math.random() < 0.35,
        fuerza: (previo ? previo.fuerza : 3 + azar(6)) + (ROLES[rol].stats.fuerza > 0 ? 2 : 0) +
          (estado.edicion === 75 && !esYo ? 2 : 0),
        x: pos.x + azar(40) - 20,
        y: pos.y + azar(40) - 20,
        zona: pos.zona,
        muertes: 0
      };
      tributos.push(t);
    }
  });

  // Compañero de distrito
  const companero = tributos.find((t) => t.distrito === estado.distrito && !t.yo);
  const yo = tributos.find((t) => t.yo);
  if (companero && yo) {
    companero.companero = true;
    yo.companero = companero.id;
    yo.alianza = [companero.id];
    companero.alianza = [yo.id];
    estado.alianza = [companero.id];
  }

  return tributos;
}

/* Prepara la primera arena (la del 74) */
function iniciarHistoria() {
  estado.edicion = 74;
  estado.arena = 'lago';
  $('#cabecera-sub').textContent = 'Modo Historia · Panem · Edición 74';
  estado.tributos = crearTributos(null);
  estado.yo = estado.tributos.find((t) => t.yo);
  prepararArena();
}

function prepararArena() {
  const arena = ARENAS[estado.arena];
  estado.vida = 100;
  estado.cansancio = 0;
  estado.cordura = 100;
  estado.heridas = [];
  estado.sangrado = false;
  estado.inventario = [];
  estado.hora = 0;
  estado.sector = 1;
  estado.turno = 0;
  estado.vivo = true;
  estado.fin = false;
  estado.armaUsada = '';
  estado.causaMuerte = '';
  estado.enCombate = false;
  estado.ultimaAccion = null;
  estado.ultimoEco = '';
  estado.ultimoEvento = '';
  estado.cazar = 3;
  estado.trampas = 0;
  estado.pedir = 1;
  estado.hambre = 100;
  estado.sed = 100;
  estado.privacion = 0;
  estado.enfermo = null;
  estado.minijuegos = 0;
  estado.minijuegosGanados = 0;
  estado.minijuegoFinalHecho = false;
  estado.dueloHecho = false;
  estado.clima = 'despejado';
  estado.climaTurnos = 0;
  estado.cornucopiaTurno = 3 + Math.floor(Math.random() * 3);
  estado.cornucopiaAbierta = false;
  estado.fiestaTurno = 7 + Math.floor(Math.random() * 4);
  estado.fiestaAbierta = false;
  estado.objetivo = null;
  estado.esperandoEleccion = false;
  estado.bloqueoCombate = false;
  estado.proximoAcontecimiento = 2;
  estado.totalMuertes = 0;
  historialEscenas.length = 0;
  elegirEscenasPartida();
  estado.patrocinio = clamp(20 + estado.fama * 8 + (estado.stats.patrocinadores - 5) * 6 +
    estado.entrevistaPuntos * 4, 0, 100);

  // Mapa según arena
  $('#arena-lago').hidden = estado.arena !== 'lago';
  $('#arena-reloj').hidden = estado.arena !== 'reloj';
  $('#mapa-etiqueta').textContent = `La arena · Edición ${arena.edicion}`;
  $('#mapa-titulo').textContent = arena.nombre;
  $('#mapa-descripcion').textContent = arena.descripcion;
  $('#mapa-info-titulo').textContent = estado.arena === 'reloj' ? 'El reloj de la arena' : 'La arena del lago';
  $('#mapa-info-texto').textContent = arena.mapaInfo;

  $('#registro-caidos').innerHTML = '<li class="vacio">Los cañones aún no han sonado.</li>';
  const btnJugar = $('#btn-entrar-juego');
  btnJugar.disabled = false;
  btnJugar.innerHTML = '<span>Que empiecen los Juegos</span>';

  dibujarSectores();
  pintarMapa();
  actualizarRelojMapa();
}

function dibujarSectores() {
  const g = $('#sectores-reloj');
  if (!g || g.childElementCount) return;
  let html = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    const b = ((i + 1) * 30 - 90) * Math.PI / 180;
    const x1 = 500 + Math.cos(a) * 96;
    const y1 = 340 + Math.sin(a) * 96;
    const x2 = 500 + Math.cos(b) * 96;
    const y2 = 340 + Math.sin(b) * 96;
    html += `<path d="M 500 340 L ${x1.toFixed(1)} ${y1.toFixed(1)} A 96 96 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="none"/>`;
  }
  g.innerHTML = html;
}

function pintarMapa() {
  // Dos capas fijas en el SVG: se usa la de la arena activa y se vacía la otra
  const capa = estado.arena === 'reloj' ? $('#capa-tributos-2') : $('#capa-tributos');
  const otra = estado.arena === 'reloj' ? $('#capa-tributos') : $('#capa-tributos-2');
  if (!capa) return;
  capa.innerHTML = '';
  if (otra) otra.innerHTML = '';

  estado.tributos.forEach((t) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `tributo-dot ${t.vivo ? '' : 'muerto'}`);

    let color = '#6fbc82';
    if (t.yo) color = '#e74c3c';
    else if (t.vivo && t.vida < 60) color = '#d8b25a';
    else if (!t.vivo) color = '#4a4a4a';

    g.innerHTML = `
      <circle cx="${t.x}" cy="${t.y}" r="${t.yo ? 9 : 7}" fill="${color}" opacity="${t.vivo ? 0.95 : 0.3}"
              stroke="#0a0f0b" stroke-width="1.5"/>
      ${t.yo ? `<circle cx="${t.x}" cy="${t.y}" r="15" fill="none" stroke="#e74c3c" stroke-width="1.2" opacity=".55"/>` : ''}
      <text x="${t.x}" y="${t.y - 13}" text-anchor="middle" font-family="Barlow Condensed, sans-serif"
            font-size="12" fill="${t.vivo ? '#cfc6b2' : '#5a5a5a'}">${escapar(t.nombre)}</text>`;
    capa.appendChild(g);
  });
}

function actualizarRelojMapa() {
  $('#mapa-hora').textContent = horaLegible(estado.hora);
  if (estado.arena === 'reloj') {
    const ac = ACONTECIMIENTOS[(estado.sector - 1) % ACONTECIMIENTOS.length];
    $('#mapa-sector').textContent = `Sector ${estado.sector} · ${ac.titulo}`;
    const aguja = $('#aguja-reloj');
    if (aguja) aguja.style.transform = `rotate(${estado.sector * 30}deg)`;
  } else {
    $('#mapa-sector').textContent = `Hora ${horaLegible(estado.hora)} · la arena no gira`;
  }
}

$('#btn-ver-tributos').addEventListener('click', () => {
  const cuerpo = $('#modal-cuerpo');
  cuerpo.innerHTML = '';
  estado.tributos.forEach((t) => {
    const div = document.createElement('div');
    div.className = `ficha ${t.yo ? 'yo' : ''}`;
    if (t.vivo === false) div.classList.add('muerto');
    div.innerHTML = `<span class="ficha__num">${String(t.id + 1).padStart(2, '0')}</span>
      <span><strong>${escapar(t.nombre)}</strong> · Distrito ${t.distrito} (${t.distritoNombre})</span>
      <span class="ficha__rol">${t.rolNombre}${t.yo ? ' · tú' : ''}</span>`;
    cuerpo.appendChild(div);
  });
  $('#modal-titulo').textContent = 'Los 24 tributos';
  $('#modal').hidden = false;
});

$('#modal-cerrar').addEventListener('click', () => { $('#modal').hidden = true; });
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });

$('#btn-entrar-juego').addEventListener('click', () => {
  // La partida ya había terminado: no se puede continuar, hay que empezar otra
  if (estado.fin || !estado.tributos.some((t) => t.yo && t.vivo)) {
    const btn = $('#btn-entrar-juego');
    btn.disabled = true;
    btn.innerHTML = '<span>Partida terminada · vuelve al inicio</span>';
    avisoArena();
    return;
  }
  irA('juego');
  iniciarJuego();
});

/* Aviso claro bajo el mapa cuando la partida ya ha terminado */
function avisoArena() {
  let aviso = $('#aviso-arena');
  if (!aviso) {
    aviso = document.createElement('p');
    aviso.id = 'aviso-arena';
    aviso.className = 'aviso-arena';
    $('.mapa__acciones').parentElement.insertBefore(aviso, $('.mapa__acciones'));
  }
  aviso.hidden = false;
  aviso.innerHTML = estado.fin
    ? 'Esta partida ya ha terminado. Pulsa <strong>← Volver al inicio</strong> para empezar una nueva con tus datos guardados.'
    : '';
}

/* ============================================================
   7. GAMEPLAY
   ============================================================ */

const narracion = $('#narracion');
const cajaOpciones = $('#opciones-juego');

/* Recuerdos breves de lo que pasó antes (solo los últimos, no toda la partida) */
const recuerdos = [];

function narrar(html, clase = '') {
  const p = document.createElement('p');
  if (clase) p.className = clase;
  p.innerHTML = html;
  narracion.appendChild(p);
  while (narracion.childElementCount > 26) narracion.firstElementChild.remove();
  narracion.scrollTop = narracion.scrollHeight;
}

function limpiarNarracion() { narracion.innerHTML = ''; }

function iniciarJuego() {
  limpiarNarracion();
  cajaOpciones.innerHTML = '';
  $('#caja-acontecimiento').hidden = true;
  $('#registro-caidos').innerHTML = '<li class="vacio">Los cañones aún no han sonado.</li>';

  const yo = estado.yo;
  const arena = ARENAS[estado.arena];
  if (estado.arena === 'reloj') {
    narrar(`<em>00:00 · Cornucopia del reloj.</em> El cañón truena y el reloj de piedra se abre. Tú eres <em>${escapar(yo.nombre)}</em>, ` +
      `tributo del Distrito ${yo.distrito}. Rol: <em>${ROLES[estado.rol].nombre}</em>.`);
    narrar('El suelo vibra bajo tus pies: los sectores ya están girando. Nada en esta arena se queda quieto.');
  } else {
    narrar(`<em>00:00 · El lago.</em> El cañón truena y la cornucopia se abre en la orilla. Tú eres <em>${escapar(yo.nombre)}</em>, ` +
      `tributo del Distrito ${yo.distrito}. Rol: <em>${ROLES[estado.rol].nombre}</em>.`);
    narrar('Veinticuatro tributos en un círculo de plata. En el centro, montañas de armas. Alrededor, un bosque que no perdona.');
  }
  narrar('Diez segundos. Decide.');

  actualizarHUD();
  pintarTributosHUD();
  modoPrueba();
  if (paramsPrueba && !paramsPruebaHecho) {
    paramsPruebaHecho = true;
    estado.tributos.forEach((t) => {
      if (t.vivo && !t.yo) {
        matarTributo(t, 'ha caído antes de que empieces');
        narrar(`<span class="linea-muerte">Cañón. ${t.nombre} ha caído.</span>`);
      }
    });
    pintarTributosHUD();
    pintarMapa();
    terminarArena('victoria');
    return;
  }
  ofrecerOpciones(escenaInicial());
}

/* ---------- Modo prueba (?prueba=1 | ?prueba=victoria) para QA ---------- */
let paramsPrueba = false;
let paramsPruebaHecho = false;
function modoPrueba() {
  const params = new URLSearchParams(location.search);
  const valor = params.get('prueba');
  if (!valor) return;

  // ?prueba=victoria&perfil=verdugo|sombra|corazon|resistencia|jugador|suerte|estrategia
  const perfil = params.get('perfil');
  if (valor === 'victoria' && perfil) {
    const recetas = {
      verdugo: { atacar: 6, riesgo: 1 },
      sombra: { sigilo: 4, huir: 3 },
      corazon: { ayudar: 3, alianza: 3 },
      resistencia: { riesgo: 2, atacar: 2, huir: 2 },
      jugador: { riesgo: 6 },
      suerte: { sigilo: 1, atacar: 1, riesgo: 1, ayudar: 1, alianza: 1, huir: 1 },
      estrategia: { alianza: 2, sigilo: 2, ayudar: 1, riesgo: 1 }
    };
    perfilPrueba = recetas[perfil] ? perfil : 'estrategia';
  }

  paramsPrueba = valor === 'victoria';
  paramsPruebaHecho = false;
  estado.vida = 100;
  estado.patrocinio = 100;
  estado.inventario = ['Vendas', 'Cuchillo de caza', 'Botiquín del Capitolio'];
  anadirObjetos(['Lanza improvisada', 'Bebida energética', 'Raciones', 'Saco de dormir']);
  estado.tributos.forEach((t) => {
    if (t.vivo && !t.yo && t.id % 2 === 0) t.vivo = false;
  });
  aplicarPerfilPrueba();
}

/* En modo QA, cada arena de prueba recibe el perfil de acciones pedido */
let perfilPrueba = '';
function aplicarPerfilPrueba() {
  if (!perfilPrueba) return;
  const recetas = {
    verdugo: { atacar: 6, riesgo: 1 },
    sombra: { sigilo: 4, huir: 3 },
    corazon: { ayudar: 3, alianza: 3 },
    resistencia: { riesgo: 2, atacar: 2, huir: 2 },
    jugador: { riesgo: 6 },
    suerte: { sigilo: 1, atacar: 1, riesgo: 1, ayudar: 1, alianza: 1, huir: 1 },
    estrategia: { alianza: 2, sigilo: 2, ayudar: 1, riesgo: 1 }
  };
  const receta = recetas[perfilPrueba] || recetas.estrategia;
  estado.historial = [];
  Object.entries(receta).forEach(([tipo, veces]) => {
    for (let i = 0; i < veces; i++) estado.historial.push({ tipo, texto: `Acción ${tipo}`, bien: true });
  });
  if (perfilPrueba === 'resistencia') {
    estado.heridas = [{ nombre: 'Fractura de fémur', gravedad: 'grave' },
      { nombre: 'Corte profundo en el muslo', gravedad: 'grave' },
      { nombre: 'Mano amputada', gravedad: 'critica' }];
    estado.cansancio = 78;
    estado.cordura = 30;
  }
  if (perfilPrueba === 'corazon') estado.imagen = 'querido';
  if (perfilPrueba === 'verdugo') estado.imagen = 'ruthless';
  if (perfilPrueba === 'sombra') estado.imagen = 'descarado';
}

/* ---------- Escenas y decisiones ---------- */

const ESCENAS_LAGO = [
  {
    id: 'cornucopia',
    texto: 'Estás en el borde de la cornucopia, junto al lago. Delante, una mochila con un cuchillo. A la izquierda, un tributo del Distrito 2 con una lanza. A tu espalda, el bosque.',
    opciones: [
      { texto: 'Correr a por la mochila y el cuchillo.', tipo: 'riesgo', efecto: 'Botín seguro · herida probable' },
      { texto: 'Atacar al del Distrito 2 antes de que se gire.', tipo: 'atacar', efecto: 'Muerte · herida grave posible' },
      { texto: 'Huir al bosque sin nada.', tipo: 'huir', efecto: 'Sin equipo · sin heridas' }
    ]
  },
  {
    id: 'orilla',
    texto: 'La orilla del lago está llena de huellas. Alguien ha dejado un machete oxidado clavado en la arena húmeda y, más allá, un tributo bebe de rodillas sin mirar atrás.',
    opciones: [
      { texto: 'Coger el machete y atacar por la espalda.', tipo: 'atacar', efecto: 'Arma · combate' },
      { texto: 'Rodear el lago en silencio y buscar refugio.', tipo: 'sigilo', efecto: 'Seguro · sin botín' },
      { texto: 'Gritarle para asustarlo y robarle la cantimplora.', tipo: 'riesgo', efecto: 'Agua · pelea posible' }
    ]
  },
  {
    id: 'pradera',
    texto: 'La pradera del norte está alta y dorada. Esconde bien, pero no hay dónde cubrirse. Un grupo de tres tributos cruza a lo lejos con las manos llenas.',
    opciones: [
      { texto: 'Proponerles una alianza desde la distancia.', tipo: 'alianza', efecto: 'Alianza · posible trampa' },
      { texto: 'Perseguirles y atacar al que se quede atrás.', tipo: 'atacar', efecto: 'Combate 1 vs 1' },
      { texto: 'Tumbarte en la hierba y esperar a que pasen.', tipo: 'sigilo', efecto: 'Sin riesgo · cansancio ↓' }
    ]
  },
  {
    id: 'pinar',
    texto: 'El pinar del sur huele a resina. Encuentras un campamento con fuego humeante, tres mochilas y un hacha clavada en un tronco.',
    opciones: [
      { texto: 'Coger todo rápido y desaparecer.', tipo: 'riesgo', efecto: 'Equipo completo · trampa posible' },
      { texto: 'Registrar con calma y buscar trampas.', tipo: 'sigilo', efecto: 'Equipo parcial · seguro' },
      { texto: 'Quedarte y esperar a que vuelvan los dueños.', tipo: 'atacar', efecto: 'Emboscada · riesgo alto' }
    ]
  },
  {
    id: 'encuentro',
    texto: 'Un tributo te bloquea el paso junto al agua. Tiene el arma rota y sangre en la cara. «Puedo matarte o puedo ayudarte», dice.',
    opciones: [
      { texto: 'Aliarte con él, por ahora.', tipo: 'alianza', efecto: 'Alianza · posible traición' },
      { texto: 'Atacarle mientras habla.', tipo: 'atacar', efecto: 'Ventaja · fama ↓' },
      { texto: 'Dejarle pasar y seguir tu camino.', tipo: 'huir', efecto: 'Sin conflicto · sin botín' }
    ]
  }
];

const ESCENAS_RELOJ = [
  {
    id: 'cornucopia',
    texto: 'La cornucopia del reloj es una bóveda de piedra llena de armas. A tu derecha, dos tributos ya se están matando por una espada. A tu izquierda, la salida al bosque.',
    opciones: [
      { texto: 'Entrar en la bóveda a por el arma más grande.', tipo: 'riesgo', efecto: 'Arma · herida probable' },
      { texto: 'Atacar al que está distraído con la espada.', tipo: 'atacar', efecto: 'Muerte · arma' },
      { texto: 'Salir corriendo hacia el gran árbol.', tipo: 'huir', efecto: 'Sin equipo · sin heridas' }
    ]
  },
  {
    id: 'sector-fuego',
    texto: 'El sector del fuego se enciende: árboles ardiendo en círculo y una única salida al norte. Tres tributos corren en la misma dirección que tú.',
    opciones: [
      { texto: 'Correr más que ellos y salir primero.', tipo: 'huir', efecto: 'Quemaduras leves' },
      { texto: 'Apartar al que te estorbe de un empujón.', tipo: 'atacar', efecto: 'Salida libre · fama ↓' },
      { texto: 'Esperar agazapado a que el fuego baje.', tipo: 'sigilo', efecto: 'Quemaduras · ahorras energía' }
    ]
  },
  {
    id: 'gran-arbol',
    texto: 'El gran árbol se alza sobre todo el sector. Entre sus raíces hay un escondite y, a lo lejos, un tributo herido que te llama con la mano.',
    opciones: [
      { texto: 'Subir al árbol y observar desde arriba.', tipo: 'sigilo', efecto: 'Información · sin riesgo' },
      { texto: 'Acercarte al herido y ayudarle.', tipo: 'ayudar', efecto: 'Patrocinadores ↑ · posible trampa' },
      { texto: 'Rematarlo y coger su equipo.', tipo: 'atacar', efecto: 'Equipo · fama ↓' }
    ]
  },
  {
    id: 'rio',
    texto: 'El río baja turbio entre raíces. Al otro lado, dos tributos llenan cantimploras. Uno de ellos te ha visto.',
    opciones: [
      { texto: 'Cruzar y proponer una tregua.', tipo: 'alianza', efecto: 'Alianza posible · confianza' },
      { texto: 'Esperar agazapado y robarles las provisiones.', tipo: 'sigilo', efecto: 'Provisiones · riesgo de pelea' },
      { texto: 'Gritar y cargar contra ellos.', tipo: 'atacar', efecto: 'Combate 2 vs 1' }
    ]
  },
  {
    id: 'boveda',
    texto: 'Una grieta del reloj deja ver un almacén abandonado por los Vigilantes: linternas, cuerdas y algo que brilla entre el polvo.',
    opciones: [
      { texto: 'Entrar y saquearlo entero.', tipo: 'riesgo', efecto: 'Equipo · trampa posible' },
      { texto: 'Coger solo lo que brilla y salir.', tipo: 'sigilo', efecto: 'Arma · cansancio ↓' },
      { texto: 'Sellarla con piedras para que nadie más entre.', tipo: 'ayudar', efecto: 'Nadie más la usa · tiempo perdido' }
    ]
  }
];

let escenaActual = null;
const historialEscenas = [];

/* Mezcla las escenas y baraja las opciones de cada una: nunca dos partidas iguales */
function escenasDeArena() {
  const base = estado.arena === 'reloj' ? ESCENAS_RELOJ : ESCENAS_LAGO;
  const propias = escenasPartida[estado.arena] || [];
  return barajar(base.concat(propias));
}

function escenaInicial() {
  return conOpcionesBarajadas(escenaApertura());
}

function conOpcionesBarajadas(escena) {
  return { ...escena, opciones: barajar(escena.opciones) };
}

/* Escenas extra por arena, elegidas al azar para cada partida */
const ESCENAS_EXTRA = {
  lago: [
    {
      id: 'pantano',
      texto: 'El pantano del oeste huele a hierro. Las aguas bajas esconden troncos y algo que se mueve bajo la superficie.',
      opciones: [
        { texto: 'Cruzar el pantano de noche, sin linterna.', tipo: 'sigilo', efecto: 'Ruta corta · riesgo de mutos' },
        { texto: 'Buscar lo que se mueve y atacarlo primero.', tipo: 'atacar', efecto: 'Pelea en el agua · equipo' },
        { texto: 'Rodear por la orilla, aunque tardes el doble.', tipo: 'huir', efecto: 'Cansancio ↑ · sin heridas' }
      ]
    },
    {
      id: 'presas',
      texto: 'Los tributos del Distrito 4 han montado presas y trampas de red en el río. Alguien ha caído en una.',
      opciones: [
        { texto: 'Liberar al que está atrapado y ganarte un aliado.', tipo: 'ayudar', efecto: 'Patrocinadores ↑ · alianza' },
        { texto: 'Saquear la presa y las redes.', tipo: 'riesgo', efecto: 'Equipo · trampa' },
        { texto: 'Romper las presas para que nadie más pesque.', tipo: 'atacar', efecto: 'Nadie come · fama ↓' }
      ]
    },
    {
      id: 'nido',
      texto: 'Encuentras un nido de avispas mutantes colgando de una rama, justo sobre el sendero de dos tributos.',
      opciones: [
        { texto: 'Tirar el nido sobre ellos.', tipo: 'riesgo', efecto: 'Dos rivales fuera · picaduras' },
        { texto: 'Sortearlo en silencio y dejar que se equivoquen solos.', tipo: 'sigilo', efecto: 'Seguro · sin botín' },
        { texto: 'Quemarlo para que la arena entera lo note.', tipo: 'atacar', efecto: 'Caos · patrocinadores' }
      ]
    },
    {
      id: 'pozo',
      texto: 'Un pozo de agua limpia en mitad de la pradera. Hay una mochila al lado y un cartel con un símbolo del Capitolio.',
      opciones: [
        { texto: 'Beber y coger la mochila sin pensarlo.', tipo: 'riesgo', efecto: 'Agua y equipo · trampa' },
        { texto: 'Comprobar el cartel antes de tocar nada.', tipo: 'sigilo', efecto: 'Información · seguro' },
        { texto: 'Esperar escondido a ver quién viene.', tipo: 'sigilo', efecto: 'Emboscada · tiempo' }
      ]
    },
    {
      id: 'refugio',
      texto: 'Una cabaña de los Vigilantes medio derruida, con una puerta que todavía cierra y provisiones dentro.',
      opciones: [
        { texto: 'Atrancar la puerta y dormir unas horas.', tipo: 'huir', efecto: 'Cansancio ↓↓ · cordura ↑' },
        { texto: 'Coger todo y seguir moviéndote.', tipo: 'riesgo', efecto: 'Equipo · cansancio ↑' },
        { texto: 'Dejar una trampa en la puerta por si vuelven.', tipo: 'atacar', efecto: 'Trampa · fama ↓' }
      ]
    }
  ],
  reloj: [
    {
      id: 'sector-agua',
      texto: 'El sector del agua sube de golpe: el suelo se convierte en un lago poco profundo y las armas pesan el doble.',
      opciones: [
        { texto: 'Soltar el equipo pesado y nadar rápido.', tipo: 'huir', efecto: 'Salvas la vida · pierdes equipo' },
        { texto: 'Quedarte a pelear en el agua contra quien pase.', tipo: 'atacar', efecto: 'Combate · arma obligada' },
        { texto: 'Trepar al gran árbol antes de que suba más.', tipo: 'sigilo', efecto: 'Altura · sin riesgo' }
      ]
    },
    {
      id: 'sector-monos',
      texto: 'Los mutos simiescos del sector 8 bajan de los árboles aullando. No atacan aún: te rodean.',
      opciones: [
        { texto: 'Mantener la mirada y retroceder despacio.', tipo: 'huir', efecto: 'Te dejan ir · cordura ↓' },
        { texto: 'Atacar al macho alfa.', tipo: 'atacar', efecto: 'Riesgo alto · botín' },
        { texto: 'Echarles la comida que llevas y correr.', tipo: 'riesgo', efecto: 'Pierdes raciones · te salvas' }
      ]
    },
    {
      id: 'sector-raices',
      texto: 'Una raíz gigante del gran árbol atraviesa el sector y forma un túnel. Se oyen voces dentro.',
      opciones: [
        { texto: 'Entrar y aliarte con quien esté dentro.', tipo: 'alianza', efecto: 'Alianza · posible traición' },
        { texto: 'Bloquear la entrada y dejarlos encerrados.', tipo: 'atacar', efecto: 'Rivales fuera · fama ↓' },
        { texto: 'Pasar por encima y seguir tu camino.', tipo: 'huir', efecto: 'Sin riesgo · cansancio ↑' }
      ]
    },
    {
      id: 'sector-cuchillas',
      texto: 'El sector 10 se llena de cuchillas que salen del suelo al ritmo de un tambor.',
      opciones: [
        { texto: 'Cruzar al ritmo del tambor, contando los golpes.', tipo: 'riesgo', efecto: 'Cruce · herida probable' },
        { texto: 'Esperar a que pare el mecanismo.', tipo: 'sigilo', efecto: 'Seguro · tiempo perdido' },
        { texto: 'Empujar a otro tributo a las cuchillas.', tipo: 'atacar', efecto: 'Muerte ajena · cordura ↓' }
      ]
    },
    {
      id: 'sector-arena',
      texto: 'El suelo del sector 12 es arena movediza y alguien se está hundiendo a diez metros de ti.',
      opciones: [
        { texto: 'Tenderle la cuerda y sacarle.', tipo: 'ayudar', efecto: 'Patrocinadores ↑↑ · alianza' },
        { texto: 'Pasar de largo: el suelo no perdona dos veces.', tipo: 'huir', efecto: 'Seguro · cordura ↓' },
        { texto: 'Esperar a que se hunda y coger su equipo.', tipo: 'atacar', efecto: 'Equipo · fama ↓↓' }
      ]
    }
  ]
};

let escenasPartida = { lago: [], reloj: [] };

/* Al empezar cada arena se eligen escenas extra al azar */
function elegirEscenasPartida() {
  escenasPartida = {
    lago: barajar(ESCENAS_EXTRA.lago).slice(0, 3),
    reloj: barajar(ESCENAS_EXTRA.reloj).slice(0, 3)
  };
}

/* ============================================================
   ÁRBOL DE DECISIONES
   La primera escena de cada arena es siempre la de la cornucopia.
   A partir de ahí, cada escena es consecuencia de lo que acabas de
   hacer (su 'tipo'), del éxito o el fracaso, y del estado en el que
   estás (herido, solo, con aliados, con hambre). Cada nodo se usa una
   sola vez por partida, así que la historia no se repite.
   ============================================================ */

const ESCENAS_ARBOL = {
  lago: [
    /* --- Consecuencias de ATACAR --- */
    {
      id: 'lago-atacar-bien', despues: 'atacar', exito: true,
      texto: 'Tu golpe ha dejado un cuerpo boca abajo en la hierba y a cinco tributos mirándote desde la otra orilla. Nadie se mueve. El primero que lo haga decide el resto.',
      opciones: [
        { texto: 'Sostenerles la mirada y limpiar el arma despacio.', tipo: 'riesgo', efecto: 'Fama ↑↑ · te retan' },
        { texto: 'Retroceder hacia el bosque sin darles la espalda.', tipo: 'huir', efecto: 'Seguro · pierdes el botín' },
        { texto: 'Gritarles que el siguiente es cualquiera de ellos.', tipo: 'atacar', efecto: 'Miedo · pelea segura' }
      ]
    },
    {
      id: 'lago-atacar-mal', despues: 'atacar', exito: false,
      texto: 'El golpe no ha servido de nada: estás herido, en campo abierto y el cañón de tu rival todavía no ha sonado. Alguien te ha visto sangrar.',
      opciones: [
        { texto: 'Arrastrarte hasta el agua y desaparecer por la orilla.', tipo: 'sigilo', efecto: 'Escapas · sangrado' },
        { texto: 'Terminar la pelea como sea, aunque te cueste la vida.', tipo: 'atacar', efecto: 'Todo o nada' },
        { texto: 'Pedir ayuda a gritos a los patrocinadores.', tipo: 'riesgo', efecto: 'Envío posible · fama' }
      ]
    },
    /* --- Consecuencias de HUIR --- */
    {
      id: 'lago-huir-bien', despues: 'huir', exito: true,
      texto: 'El bosque te ha tragado sin dejar rastro. Detrás, los gritos de la cornucopia se apagan. Estás solo, entero y sin nada en las manos.',
      opciones: [
        { texto: 'Buscar agua antes que armas: sin agua no hay días.', tipo: 'sigilo', efecto: 'Agua · seguro' },
        { texto: 'Volver por el borde para saquear lo que quede.', tipo: 'riesgo', efecto: 'Equipo · peligro' },
        { texto: 'Subir a un árbol y ver el mapa desde arriba.', tipo: 'sigilo', efecto: 'Información · cansancio' }
      ]
    },
    {
      id: 'lago-huir-mal', despues: 'huir', exito: false,
      texto: 'Corres mal, entre ramas bajas y raíces, y alguien corre detrás. El sonido de sus pasos es más regular que tu respiración.',
      opciones: [
        { texto: 'Esconderte en el barro y quedarte quieto.', tipo: 'sigilo', efecto: 'Escondite · cordura ↓' },
        { texto: 'Girarte y esperarle: no vas a llegar al río.', tipo: 'atacar', efecto: 'Combate · arma' },
        { texto: 'Soltar el equipo para correr más rápido.', tipo: 'huir', efecto: 'Escapas · pierdes botín' }
      ]
    },
    /* --- Consecuencias de ARRIESGARTE --- */
    {
      id: 'lago-riesgo-bien', despues: 'riesgo', exito: true,
      texto: 'La mochila es tuya y, dentro, algo mejor que comida: una brújula rota que apunta siempre al norte del Capitolio. Alguien la perdió con prisa.',
      opciones: [
        { texto: 'Seguir la brújula y ver a dónde lleva.', tipo: 'riesgo', efecto: 'Ruta oculta · botín' },
        { texto: 'Vaciarla, quedarte lo útil y abandonar el resto.', tipo: 'sigilo', efecto: 'Seguro · equipo' },
        { texto: 'Dejarla a la vista para que otro caiga en la trampa.', tipo: 'atacar', efecto: 'Trampa · fama ↓' }
      ]
    },
    {
      id: 'lago-riesgo-mal', despues: 'riesgo', exito: false,
      texto: 'La trampa era evidente y aun así entraste. Ahora estás colgado de una red de cuerdas a un metro del suelo, con el mundo al revés.',
      opciones: [
        { texto: 'Cortar las cuerdas con lo que tengas a mano.', tipo: 'riesgo', efecto: 'Libertad · caída' },
        { texto: 'Quedarte quieto y esperar a que se cansen de mirar.', tipo: 'sigilo', efecto: 'Sin heridas · humillación' },
        { texto: 'Gritar para que alguien venga: mejor un aliado que nada.', tipo: 'alianza', efecto: 'Aliado o trampa' }
      ]
    },
    /* --- Consecuencias de ESCONDERTE --- */
    {
      id: 'lago-sigilo-bien', despues: 'sigilo', exito: true,
      texto: 'Desde tu escondite ves pasar a dos tributos hablando de la zona donde esconden el agua. No te han visto y no lo saben.',
      opciones: [
        { texto: 'Seguirles a distancia hasta el depósito.', tipo: 'sigilo', efecto: 'Agua · información' },
        { texto: 'Atacarles por la espalda mientras van distraídos.', tipo: 'atacar', efecto: 'Ventaja · dos rivales' },
        { texto: 'Dejarles ir y memorizar la ruta.', tipo: 'riesgo', efecto: 'Mapa mental · seguro' }
      ]
    },
    {
      id: 'lago-sigilo-mal', despues: 'sigilo', exito: false,
      texto: 'Una rama cruje bajo tu bota. Al otro lado del tronco, una voz pregunta quién anda ahí. No hay tiempo para esconderse mejor.',
      opciones: [
        { texto: 'Salir con las manos abiertas y hablar.', tipo: 'alianza', efecto: 'Negociar · alianza' },
        { texto: 'Correr en la dirección contraria.', tipo: 'huir', efecto: 'Escapas · cansancio' },
        { texto: 'Atacar primero, mientras duda.', tipo: 'atacar', efecto: 'Ventaja · combate' }
      ]
    },
    /* --- Consecuencias de ALIARTE --- */
    {
      id: 'lago-alianza-bien', despues: 'alianza', exito: true,
      texto: 'Tenéis un campamento con fuego, dos mantas y un pacto que dura hasta que uno deje de ser útil. Tu aliado duerme con un ojo abierto.',
      opciones: [
        { texto: 'Vigilar mientras duerme y no dormir tú.', tipo: 'sigilo', efecto: 'Confianza · cansancio' },
        { texto: 'Cogerle el arma mientras duerme y esconderla.', tipo: 'riesgo', efecto: 'Ventaja · riesgo de traición' },
        { texto: 'Proponerle atacar juntos el campamento del Distrito 1.', tipo: 'atacar', efecto: 'Dos contra dos' }
      ]
    },
    {
      id: 'lago-alianza-mal', despues: 'alianza', exito: false,
      texto: 'El pacto se ha roto antes de la primera noche: tu aliado ha cogido lo que había en la mochila común y se ha ido dejándote la mitad vacía.',
      opciones: [
        { texto: 'Seguirle el rastro y cobrarte lo que falta.', tipo: 'atacar', efecto: 'Venganza · combate' },
        { texto: 'Aceptar la pérdida y buscarte otro aliado.', tipo: 'alianza', efecto: 'Nuevo pacto' },
        { texto: 'Quedarte solo y no fiarte de nadie más.', tipo: 'sigilo', efecto: 'Cordura ↑ · soledad' }
      ]
    },
    /* --- Consecuencias de AYUDAR --- */
    {
      id: 'lago-ayudar-bien', despues: 'ayudar', exito: true,
      texto: 'El tributo al que curaste vuelve con las manos llenas y te deja la mitad sin decir nada. Al fondo, los patrocinadores encienden una luz sobre tu cara.',
      opciones: [
        { texto: 'Aceptar y proponerle que os quedéis juntos.', tipo: 'alianza', efecto: 'Alianza · fama' },
        { texto: 'Coger la mitad y marcharte sin prometer nada.', tipo: 'riesgo', efecto: 'Equipo · fama ↓' },
        { texto: 'Pedirle que te enseñe dónde encontró eso.', tipo: 'sigilo', efecto: 'Zona de botín' }
      ]
    },
    {
      id: 'lago-ayudar-mal', despues: 'ayudar', exito: false,
      texto: 'Ayudaste a quien no debías: era el cebo de una emboscada y ahora dos tributos saben dónde duermes y cuánto te queda.',
      opciones: [
        { texto: 'Moverte de escondite esa misma noche.', tipo: 'sigilo', efecto: 'Seguro · cansancio ↑' },
        { texto: 'Esperarles despierto con el arma preparada.', tipo: 'atacar', efecto: 'Emboscada invertida' },
        { texto: 'Buscar a otro tributo y aliarte antes de que vuelvan.', tipo: 'alianza', efecto: 'Aliado · prisa' }
      ]
    },
    /* --- Estado del cuerpo --- */
    {
      id: 'lago-herido', requiere: 'herido',
      texto: 'La herida se ha abierto con el movimiento. Cada paso deja una mancha oscura en el suelo y alguien con paciencia podría seguirla.',
      opciones: [
        { texto: 'Parar, limpiarte y vendar como puedas.', tipo: 'sigilo', efecto: 'Sangrado ↓ · tiempo' },
        { texto: 'Seguir andando y no mirar atrás.', tipo: 'huir', efecto: 'Rápido · sangrado ↑' },
        { texto: 'Meterte en el agua fría del lago.', tipo: 'riesgo', efecto: 'Frena la sangre · frío' }
      ]
    },
    {
      id: 'lago-cansado', requiere: 'cansancio',
      texto: 'Llevas demasiadas horas andando. Los árboles empiezan a parecerse entre sí y el arma pesa como si fuera de plomo.',
      opciones: [
        { texto: 'Parar y dormir dos horas escondido.', tipo: 'sigilo', efecto: 'Fuerzas ↑ · riesgo' },
        { texto: 'Comer lo que quede y seguir.', tipo: 'riesgo', efecto: 'Cansancio ↓ · equipo' },
        { texto: 'Agarrarte a un árbol y esperar a que pase el mareo.', tipo: 'huir', efecto: 'Cordura ↓ · sin moverse' }
      ]
    },
    {
      id: 'lago-solo', requiere: 'solo',
      texto: 'Ya no te queda nadie. Ni aliados, ni compañero de distrito, ni voces que no sean las de los cañones. El bosque está demasiado quieto.',
      opciones: [
        { texto: 'Buscar activamente a alguien con quien pactar.', tipo: 'alianza', efecto: 'Alianza · exposición' },
        { texto: 'Aceptar la soledad y preparar una trampa.', tipo: 'atacar', efecto: 'Trampa · espera' },
        { texto: 'Hablar en voz alta para no volverte loco.', tipo: 'sigilo', efecto: 'Cordura ↑ · te oyen' }
      ]
    },
    {
      id: 'lago-alimento', requiere: 'hambre',
      texto: 'El estómago te delata antes que los pies. En un claro hay un arbusto de bayas oscuras y, junto a él, huellas de botas recientes.',
      opciones: [
        { texto: 'Comer las bayas aunque no sepas qué son.', tipo: 'riesgo', efecto: 'Comida · veneno posible' },
        { texto: 'Cazar algo con lo que lleves encima.', tipo: 'sigilo', efecto: 'Carne · tiempo' },
        { texto: 'Ignorarlas: hay huellas y no es tu claro.', tipo: 'huir', efecto: 'Sin riesgo · hambre' }
      ]
    },
    /* --- Escenas de situación --- */
    {
      id: 'lago-rio', requiere: 'siempre',
      texto: 'El río baja crecido y arrastra troncos. En la otra orilla hay un refugio de los Vigilantes con la puerta abierta y, dentro, algo que brilla.',
      opciones: [
        { texto: 'Cruzar el río nadando con el equipo a la espalda.', tipo: 'riesgo', efecto: 'Refugio · corriente' },
        { texto: 'Buscar un paso entre los troncos.', tipo: 'sigilo', efecto: 'Seguro · lento' },
        { texto: 'Seguir la orilla y dejar el refugio para otro.', tipo: 'huir', efecto: 'Sin botín · sin riesgo' }
      ]
    },
    {
      id: 'lago-noche', requiere: 'siempre',
      texto: 'Cae la noche y con ella el frío. A lo lejos se ven tres fuegos: uno grande con gente alrededor y dos pequeños que se apagan.',
      opciones: [
        { texto: 'Ir al fuego grande y presentarte.', tipo: 'alianza', efecto: 'Alianza · exposición' },
        { texto: 'Acercarte al fuego pequeño y esperar.', tipo: 'sigilo', efecto: 'Información · frío' },
        { texto: 'Pasar la noche sin fuego, en un árbol.', tipo: 'huir', efecto: 'Seguro · cansancio ↑↑' }
      ]
    }
  ],

  reloj: [
    {
      id: 'reloj-atacar-bien', despues: 'atacar', exito: true,
      texto: 'El cuerpo cae entre dos sectores y el reloj sigue girando como si nada. Cuando el sector cambia, el cadáver ya no está donde lo dejaste.',
      opciones: [
        { texto: 'Seguir el giro para recuperar lo que llevaba encima.', tipo: 'riesgo', efecto: 'Botín · sector desconocido' },
        { texto: 'Apartarte del sector antes de que vuelva a abrirse.', tipo: 'huir', efecto: 'Seguro · sin botín' },
        { texto: 'Quedarte a ver quién viene a por el cuerpo.', tipo: 'sigilo', efecto: 'Emboscada · espera' }
      ]
    },
    {
      id: 'reloj-atacar-mal', despues: 'atacar', exito: false,
      texto: 'El sector se ha cerrado a mitad de la pelea y os ha separado. Estás herido y solo, con el reloj marcando una hora que no entiendes.',
      opciones: [
        { texto: 'Aprender el ritmo del reloj antes de moverte.', tipo: 'sigilo', efecto: 'Información · seguro' },
        { texto: 'Cruzar el sector antes de que cambie.', tipo: 'riesgo', efecto: 'Rápido · cuchillas' },
        { texto: 'Curarte donde estás, aunque venga alguien.', tipo: 'huir', efecto: 'Vida ↑ · expuesto' }
      ]
    },
    {
      id: 'reloj-huir-bien', despues: 'huir', exito: true,
      texto: 'Has salido del sector justo antes del giro. Detrás, las cuchillas se cierran sobre el sitio donde estabas hace dos segundos.',
      opciones: [
        { texto: 'Estudiar el orden de los sectores desde fuera.', tipo: 'sigilo', efecto: 'Mapa del reloj' },
        { texto: 'Buscar el sector del agua antes de que se cierre.', tipo: 'riesgo', efecto: 'Agua · prisa' },
        { texto: 'Alejarte del reloj y buscar el borde de la arena.', tipo: 'huir', efecto: 'Sin peligro · sin botín' }
      ]
    },
    {
      id: 'reloj-huir-mal', despues: 'huir', exito: false,
      texto: 'Corriste en la dirección equivocada. Ahora estás en un sector que empieza a llenarse de agua y el borde queda demasiado lejos.',
      opciones: [
        { texto: 'Nadar hasta la salida antes de que suba más.', tipo: 'riesgo', efecto: 'Escapas · ahogo' },
        { texto: 'Trepár al árbol más alto del sector.', tipo: 'sigilo', efecto: 'Altura · espera' },
        { texto: 'Gritar para que alguien te oiga y te ayude.', tipo: 'ayudar', efecto: 'Aliado · fama' }
      ]
    },
    {
      id: 'reloj-riesgo-bien', despues: 'riesgo', exito: true,
      texto: 'Has cruzado el sector de las cuchillas sin un rasguño. Al otro lado hay un panel de los Vigilantes con un mapa dibujado a mano.',
      opciones: [
        { texto: 'Memorizar el mapa y destruirlo.', tipo: 'sigilo', efecto: 'Ventaja · nadie más lo sabe' },
        { texto: 'Llevártelo y usarlo delante de todos.', tipo: 'riesgo', efecto: 'Fama ↑↑ · te lo querrán' },
        { texto: 'Dejarlo donde estaba para que otro se confíe.', tipo: 'atacar', efecto: 'Trampa · fama ↓' }
      ]
    },
    {
      id: 'reloj-riesgo-mal', despues: 'riesgo', exito: false,
      texto: 'El mecanismo te ha atrapado la pierna entre dos placas de piedra. El sector va a girar en menos de un minuto.',
      opciones: [
        { texto: 'Tirar de la pierna aunque te desgarres.', tipo: 'riesgo', efecto: 'Libre · herida grave' },
        { texto: 'Esperar el giro y confiar en que se abra.', tipo: 'sigilo', efecto: 'Todo o nada' },
        { texto: 'Pedir ayuda a quien pase por el sector.', tipo: 'ayudar', efecto: 'Aliado · deuda' }
      ]
    },
    {
      id: 'reloj-sigilo-bien', despues: 'sigilo', exito: true,
      texto: 'Desde lo alto del árbol ves los doce sectores y el patrón: cada dos horas, el mismo orden. También ves a un tributo que llora sin ruido.',
      opciones: [
        { texto: 'Bajar y acercarte a él con las manos abiertas.', tipo: 'ayudar', efecto: 'Aliado · fama ↑↑' },
        { texto: 'Anotar su posición y esperar la noche.', tipo: 'atacar', efecto: 'Ventaja · espera' },
        { texto: 'Quedarte arriba hasta que el reloj vuelva a girar.', tipo: 'sigilo', efecto: 'Seguro · cansancio' }
      ]
    },
    {
      id: 'reloj-sigilo-mal', despues: 'sigilo', exito: false,
      texto: 'El sector se ha cerrado contigo dentro y la salida está al otro lado de una pared de piedra que no existía hace un minuto.',
      opciones: [
        { texto: 'Buscar una grieta en la pared nueva.', tipo: 'sigilo', efecto: 'Salida · tiempo' },
        { texto: 'Golpear la piedra hasta que algo ceda.', tipo: 'riesgo', efecto: 'Ruido · heridas' },
        { texto: 'Sentarte y esperar el siguiente giro.', tipo: 'huir', efecto: 'Seguro · cansancio ↑↑' }
      ]
    },
    {
      id: 'reloj-alianza-bien', despues: 'alianza', exito: true,
      texto: 'Con tu nuevo aliado habéis aprendido a moveros con el reloj: dos personas cubren el doble de sectores y ninguno duerme del todo.',
      opciones: [
        { texto: 'Repartiros los sectores y cubrir más terreno.', tipo: 'sigilo', efecto: 'Botín doble · riesgo' },
        { texto: 'Quedaros juntos y esperar a los que vengan.', tipo: 'atacar', efecto: 'Emboscada en equipo' },
        { texto: 'Contarle tu plan y confiar en él del todo.', tipo: 'alianza', efecto: 'Confianza · traición posible' }
      ]
    },
    {
      id: 'reloj-alianza-mal', despues: 'alianza', exito: false,
      texto: 'El pacto se rompió en el peor sitio: tu aliado se ha llevado el mapa y te ha dejado en el sector que se está cerrando.',
      opciones: [
        { texto: 'Salir del sector primero y vengarte después.', tipo: 'huir', efecto: 'Vivo · rencor' },
        { texto: 'Perseguirle aunque el sector se cierre.', tipo: 'atacar', efecto: 'Venganza · cuchillas' },
        { texto: 'Buscar otro aliado entre los que quedan.', tipo: 'alianza', efecto: 'Nuevo pacto' }
      ]
    },
    {
      id: 'reloj-ayudar-bien', despues: 'ayudar', exito: true,
      texto: 'Le has sacado de la arena movediza y él te ha dado la mitad de su agua. El Capitolio enfoca vuestras dos caras en la misma pantalla.',
      opciones: [
        { texto: 'Quedaros juntos hasta que uno de los dos caiga.', tipo: 'alianza', efecto: 'Alianza fuerte · fama' },
        { texto: 'Aceptar el agua y seguir tu camino.', tipo: 'riesgo', efecto: 'Equipo · fama ↓' },
        { texto: 'Pedirle que te cuente quién queda vivo.', tipo: 'sigilo', efecto: 'Información · sin riesgo' }
      ]
    },
    {
      id: 'reloj-ayudar-mal', despues: 'ayudar', exito: false,
      texto: 'Metiste la mano para sacarle y el suelo te tragó a ti también. Los dos estáis hundiéndoos y solo uno puede salir.',
      opciones: [
        { texto: 'Soltarle y salvarte tú.', tipo: 'huir', efecto: 'Vivo · cordura ↓↓' },
        { texto: 'Empujarle hacia arriba y hundirte tú un poco más.', tipo: 'ayudar', efecto: 'Fama ↑↑ · riesgo' },
        { texto: 'Gritar a los Vigilantes que os saquen.', tipo: 'riesgo', efecto: 'Rescate · deuda' }
      ]
    },
    {
      id: 'reloj-herido', requiere: 'herido',
      texto: 'La herida no cierra y cada giro del reloj te obliga a moverte. Arrastrarte de sector en sector deja un rastro que cualquiera puede leer.',
      opciones: [
        { texto: 'Buscar el sector del agua y limpiarte allí.', tipo: 'riesgo', efecto: 'Limpieza · cruce' },
        { texto: 'Quedarte quieto en un sector seguro hasta recuperarte.', tipo: 'sigilo', efecto: 'Vida ↑ · tiempo' },
        { texto: 'Seguir moviéndote y confiar en tu resistencia.', tipo: 'huir', efecto: 'Rápido · sangrado ↑' }
      ]
    },
    {
      id: 'reloj-cansado', requiere: 'cansancio',
      texto: 'El reloj no se detiene y tú sí. Llevas horas sin dormir y los números de los sectores se te mezclan en la cabeza.',
      opciones: [
        { texto: 'Dormir en un sector que acaba de girar.', tipo: 'sigilo', efecto: 'Fuerzas ↑ · dos horas' },
        { texto: 'Comer algo y aguantar despierto.', tipo: 'riesgo', efecto: 'Cansancio ↓ · equipo' },
        { texto: 'Moverte a ciegas y rezar por no cruzarte con nadie.', tipo: 'huir', efecto: 'Cordura ↓ · caos' }
      ]
    },
    {
      id: 'reloj-solo', requiere: 'solo',
      texto: 'En el reloj, estar solo significa cubrir doce sectores sin ayuda. Cada giro suena como un reloj que cuenta lo que te queda.',
      opciones: [
        { texto: 'Buscar a los últimos tributos y pactar con uno.', tipo: 'alianza', efecto: 'Alianza · exposición' },
        { texto: 'Elegir un sector y defenderlo como territorio.', tipo: 'atacar', efecto: 'Territorio · combate' },
        { texto: 'Dejar de contar los giros y sobrevivir hora a hora.', tipo: 'sigilo', efecto: 'Cordura ↑ · pasividad' }
      ]
    },
    {
      id: 'reloj-alimento', requiere: 'hambre',
      texto: 'En el sector de la vegetación crecen frutos enormes, pero el giro está cerca y ese sector se convierte en ceniza cada dos horas.',
      opciones: [
        { texto: 'Coger todo lo que puedas antes del giro.', tipo: 'riesgo', efecto: 'Comida · ceniza' },
        { texto: 'Coger solo un fruto y salir corriendo.', tipo: 'sigilo', efecto: 'Comida · seguro' },
        { texto: 'Esperar fuera y recoger lo que caiga ardiendo.', tipo: 'huir', efecto: 'Poco · sin riesgo' }
      ]
    },
    {
      id: 'reloj-borde', requiere: 'siempre',
      texto: 'Llegas al borde de la arena: una pared de cristal por la que se ven los Vigilantes mirando. Uno de ellos te señala y habla por su radio.',
      opciones: [
        { texto: 'Acercarte al cristal y mirarles a los ojos.', tipo: 'riesgo', efecto: 'Fama ↑↑ · peligro' },
        { texto: 'Apartarte y volver al centro antes de que llegue alguien.', tipo: 'huir', efecto: 'Seguro · sin fama' },
        { texto: 'Buscar una grieta en el cristal.', tipo: 'sigilo', efecto: 'Información · trampa' }
      ]
    }
  ]
};

/* ---------- Selección de la siguiente escena ---------- */

function nodosDelArbol() {
  return ESCENAS_ARBOL[estado.arena] || ESCENAS_ARBOL.lago;
}

/* Escena de apertura: siempre la cornucopia de la arena activa */
function escenaApertura() {
  const base = estado.arena === 'reloj' ? ESCENAS_RELOJ : ESCENAS_LAGO;
  return base.find((e) => e.id === 'cornucopia') || base[0];
}

function estaHerido() {
  return estado.heridas.length > 0 || estado.sangrado;
}

/* Elige la escena que sigue según lo que acabas de hacer y cómo estás */
function siguienteEscena(ultimaOpcion, ultimoBien) {
  const usados = new Set(historialEscenas);
  const nodos = nodosDelArbol();
  const aliados = estado.alianza.length + estado.tributos.filter((t) => t.vivo && !t.yo && t.alianza.includes(estado.yo.id)).length;

  // 1. Consecuencia directa de la última decisión (mismo tipo y mismo resultado)
  const consecuencia = nodos.filter((n) => n.despues === ultimaOpcion && n.exito === ultimoBien && !usados.has(n.id));
  if (consecuencia.length) return elegir(consecuencia);

  // 2. Consecuencia del mismo tipo de acción, sea cual sea el resultado
  const mismoTipo = nodos.filter((n) => n.despues === ultimaOpcion && !usados.has(n.id));
  if (mismoTipo.length) return elegir(mismoTipo);

  // 3. Algo que nazca del estado del cuerpo y de la situación
  const porEstado = [];
  if (estaHerido()) porEstado.push('herido');
  if (estado.cansancio >= 60) porEstado.push('cansancio');
  if (aliados === 0) porEstado.push('solo');
  if (estado.inventario.filter((i) => OTROS[i]).length === 0 || estado.vida < 55) porEstado.push('hambre');

  const deEstado = nodos.filter((n) => porEstado.includes(n.requiere) && !usados.has(n.id));
  if (deEstado.length) return elegir(deEstado);

  // 4. Escenas de situación que aún no hayan salido
  const situacion = nodos.filter((n) => n.requiere === 'siempre' && !usados.has(n.id));
  if (situacion.length) return elegir(situacion);

  // 5. Nada del árbol: se tira de las escenas de la arena que no hayan salido
  const base = estado.arena === 'reloj' ? ESCENAS_RELOJ : ESCENAS_LAGO;
  const libres = base.concat(escenasPartida[estado.arena] || []).filter((e) => !usados.has(e.id));
  if (libres.length) return elegir(libres);

  // 6. Se ha agotado todo: se reabre el árbol menos la última escena
  const ultima = historialEscenas[historialEscenas.length - 1];
  historialEscenas.length = 0;
  const reinicio = nodos.filter((n) => n.id !== ultima);
  return elegir(reinicio);
}

function ofrecerOpciones(escena) {
  escena = conOpcionesBarajadas(escena);
  escenaActual = escena;
  estado.esperandoEleccion = false;

  // Cada escena se lee limpia: arriba solo queda el eco de la anterior
  limpiarNarracion();
  if (estado.ultimoEco) narrar(`<span class="eco-antes">${escapar(estado.ultimoEco)}</span>`, 'eco');
  narrar(escena.texto, 'escena-texto');
  cajaOpciones.innerHTML = '';
  const letras = ['A', 'B', 'C'];

  const combate = escena.opciones.some((o) => o.tipo === 'atacar');
  estado.enCombate = combate;

  escena.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${letras[i]}</span>
      <span>${escapar(op.texto)}<span class="opcion__efecto">${op.efecto}</span></span>`;
    btn.addEventListener('click', () => elegirOpcion(op));
    cajaOpciones.appendChild(btn);
  });

  // Arma disponible: solo en escenas de combate y si llevas una
  if (combate && !estado.bloqueoCombate) {
    const arma = armaDisponible();
    if (arma && ARMAS[arma].usos <= 0) {
      estado.inventario = estado.inventario.filter((i) => i !== arma);
      return ofrecerOpciones(escena);
    }
    if (arma) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opcion opcion--arma';
      const info = ARMAS[arma];
      btn.innerHTML = `<span class="opcion__letra">⚔</span>
        <span>Usar ${info.texto} del equipo.<span class="opcion__efecto">${info.dano} de daño · ${info.usos} uso${info.usos > 1 ? 's' : ''} antes de romperse</span></span>`;
      btn.addEventListener('click', () => usarArmaEnCombate(arma));
      cajaOpciones.appendChild(btn);
    } else {
      const aviso = document.createElement('p');
      aviso.className = 'ayuda ayuda--arma';
      aviso.textContent = 'No llevas ningún arma encima: en este combate solo cuentan tus manos.';
      cajaOpciones.appendChild(aviso);
    }
  }

  actualizarHUD();
}

/* ---------- Armas ---------- */

function armaDisponible() {
  return estado.inventario.find((i) => ARMAS[i]);
}

async function usarArmaEnCombate(nombreArma) {
  if (estado.fin || estado.esperandoEleccion) return;
  estado.esperandoEleccion = true;
  cajaOpciones.innerHTML = '<p class="ayuda">El acero hace su trabajo…</p>';
  await dormir(300);

  const info = ARMAS[nombreArma];
  const bonus = info.dano + estado.stats.combate * 2;
  const victima = elegir(estado.tributos.filter((t) => t.vivo && !t.yo));
  let html = '';

  if (victima && Math.random() < clamp(0.5 + bonus / 90, 0.3, 0.95)) {
    matarTributo(victima, `a tus manos con ${info.texto}`);
    html = `Sacas ${info.texto} y atacas sin dudar. <em>${victima.nombre} cae</em> antes de poder gritar. `;
    estado.cordura = clamp(estado.cordura - 4, 0, 100);
    ajustarPatrocinio(4);
  } else {
    const h = nuevaHerida('leve');
    html = `Atacas con ${info.texto}, pero el golpe se atasca en el hombro de tu rival y te devuelve uno. <em>${h.nombre}</em>. `;
    estado.cordura = clamp(estado.cordura - 3, 0, 100);
  }

  // Desgaste: el arma aguanta sus usos y solo a veces cede antes de tiempo
  info.usos -= 1;
  const roto = info.usos <= 0 || Math.random() < 0.08;
  if (roto) {
    estado.inventario = estado.inventario.filter((i) => i !== nombreArma);
    html += `<span class="linea-muerte">${nombreArma} se parte con el impacto y se queda en tu mano como un muñón de metal.</span>`;
  } else {
    html += `<span class="linea-bien">${nombreArma}: ${info.usos} uso${info.usos > 1 ? 's' : ''} restante${info.usos > 1 ? 's' : ''}.</span>`;
  }

  estado.armaUsada = nombreArma;
  estado.cansancio = clamp(estado.cansancio + 16, 0, 100);
  narrar(html, 'linea-combate');

  actualizarHUD();
  pintarTributosHUD();
  pintarMapa();
  procesarHeridas();
  if (estado.vida <= 0) {
    if (!estado.causaMuerte) estado.causaMuerte = `Un golpe de vuelta durante el combate con ${info.texto}.`;
    narrar('<span class="linea-muerte">Te faltan fuerzas. Caes de rodillas y el mundo se apaga.</span>');
    await dormir(600);
    terminarArena('muerto');
    return;
  }

  estado.ultimaAccion = { tipo: 'atacar', bien: true };
  await dormir(400);
  await ofrecerEscenaSiguiente();
}

/* ============================================================
   MINIJUEGOS
   Seis pruebas cortas (5-15 s) que deciden el resultado de una
   acción: atacar, huir, vendarse, cazar, orientarse y saquear.
   ============================================================ */

const mj = { activo: null, raf: 0, temporizadores: [], limpiar: null };

function mjLienzo() { return document.getElementById('mj-lienzo'); }
function mjTexto(sel, txt) { const el = document.querySelector(sel); if (el) el.textContent = txt; }

function mjLimpiarTimers() {
  cancelAnimationFrame(mj.raf);
  mj.temporizadores.forEach((t) => clearTimeout(t));
  mj.temporizadores = [];
}

/* Cuenta atrás común: devuelve el temporizador para poder pararlo */
function mjTiempo(segundos, alAgotarse) {
  const total = segundos * 1000;
  const inicio = performance.now();
  let id = 0;
  const paso = () => {
    const resto = Math.max(0, total - (performance.now() - inicio));
    mjTexto('#mj-tiempo', `${(resto / 1000).toFixed(1)} s`);
    if (resto <= 0) { alAgotarse(); return; }
    id = requestAnimationFrame(paso);
    mj.raf = id;
  };
  paso();
  return id;
}

/* Abre un minijuego y devuelve una promesa con true (acierto) o false (fallo) */
function jugarMinijuego(clave) {
  return new Promise((resolve) => {
    const def = MINIJUEGOS[clave];
    if (!def) { resolve(true); return; }

    const capa = document.getElementById('minijuego');
    const lienzo = mjLienzo();
    capa.hidden = false;
    lienzo.innerHTML = '';
    mjTexto('#mj-etiqueta', def.etiqueta);
    mjTexto('#mj-titulo', def.titulo);
    mjTexto('#mj-instrucciones', def.instrucciones);
    mjTexto('#mj-tiempo', `${def.segundos.toFixed(1)} s`);
    const res = document.querySelector('#mj-resultado');
    res.textContent = '';
    res.className = 'minijuego__resultado';

    let cerrado = false;
    let abandonado = false;
    mj.activo = clave;
    mj.abandonar = () => {
      if (cerrado) return;
      cerrado = true;
      abandonado = true;
      resolve(false);
    };

    const terminar = (exito, mensaje) => {
      if (cerrado) return;
      cerrado = true;
      mjLimpiarTimers();
      if (mj.limpiar) { mj.limpiar(); mj.limpiar = null; }
      const el = document.querySelector('#mj-resultado');
      el.textContent = mensaje;
      el.className = `minijuego__resultado ${exito ? 'bien' : 'mal'}`;
      mj.activo = null;
      mj.abandonar = null;
      mj.temporizadores.push(setTimeout(() => {
        capa.hidden = true;
        lienzo.innerHTML = '';
        resolve(exito);
      }, 900));
    };

    def.montar(lienzo, terminar);
    mj.temporizadores.push(mjTiempo(def.segundos, () => terminar(false, def.fallo)));
  });
}

/* Momento decisivo: se juega el minijuego que corresponda a la situación */
const MINIJUEGO_DECISIVO = {
  combate: 'fuerza',
  huida: 'cuerda',
  botin: 'saqueo',
  orientacion: 'memoria',
  curacion: 'aguja',
  punteria: 'diana',
  esquivar: 'esquivar',
  tension: 'precision',
  persecucion: 'carrera',
  duelo: 'pulseada',
  ingenio: 'lectura',
  temple: 'equilibrio'
};

async function momentoDecisivo(tipo, titulo) {
  if (estado.fin) return false;
  estado.esperandoEleccion = false;
  if (titulo) mjTexto('#mj-titulo', titulo);
  const ganado = await jugarMinijuego(MINIJUEGO_DECISIVO[tipo] || 'fuerza');
  estado.esperandoEleccion = true;
  if (estado.fin) return false;
  estado.minijuegos = (estado.minijuegos || 0) + 1;
  if (ganado) estado.minijuegosGanados = (estado.minijuegosGanados || 0) + 1;
  return ganado;
}

/* ============================================================
   MARCO COMÚN DE LOS MINIJUEGOS
   Cada minijuego recibe un contexto con el lienzo, el resultado
   y utilidades para dibujar su marcador y terminar con puntuación.
   ============================================================ */

function mjContexto(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;

  // Marcador de puntos y vidas/combo, arriba a la izquierda
  const marcador = document.createElement('div');
  marcador.className = 'mj-marcador';
  const puntos = document.createElement('span');
  puntos.className = 'mj-marcador__puntos';
  puntos.textContent = '0';
  const extra = document.createElement('span');
  extra.className = 'mj-marcador__extra';
  marcador.append(puntos, extra);
  lienzo.appendChild(marcador);

  const ctx = {
    lienzo,
    ancho,
    alto,
    puntos: 0,
    sumar: (n, etiqueta) => {
      ctx.puntos += n;
      puntos.textContent = ctx.puntos;
      if (etiqueta) {
        extra.textContent = etiqueta;
        setTimeout(() => { if (extra.textContent === etiqueta) extra.textContent = ''; }, 700);
      }
      marcador.classList.add('pulso');
      setTimeout(() => marcador.classList.remove('pulso'), 160);
    },
    setExtra: (txt) => { extra.textContent = txt; },
    acabar: (exito, mensaje) => terminar(exito, `${mensaje} Puntos: ${ctx.puntos}`),
    // Crea un elemento con clase y posición
    pieza: (clase, x, y) => {
      const el = document.createElement('div');
      el.className = clase;
      if (x !== undefined) el.style.left = `${x}px`;
      if (y !== undefined) el.style.top = `${y}px`;
      lienzo.appendChild(el);
      return el;
    }
  };
  return ctx;
}

/* --- 1. Pulso de fuerza --- */
function mjPulso(lienzo, terminar) {
  const barra = document.createElement('div');
  barra.className = 'mj-pulso';
  const zona = document.createElement('div');
  zona.className = 'mj-pulso__zona';
  const anchoZona = 22 + estado.stats.fuerza * 2; // 22-34 %
  const inicioZona = 24 + Math.random() * (72 - anchoZona);
  zona.style.left = `${inicioZona}%`;
  zona.style.width = `${anchoZona}%`;
  const aguja = document.createElement('div');
  aguja.className = 'mj-pulso__aguja';
  barra.append(zona, aguja);
  lienzo.appendChild(barra);

  let pos = 0, dir = 1, ultimo = performance.now();
  const velocidad = 0.055 + estado.stats.fuerza * 0.004;
  const animar = (t) => {
    const dt = t - ultimo;
    ultimo = t;
    pos += dir * velocidad * dt;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0) { pos = 0; dir = 1; }
    aguja.style.left = `${pos}%`;
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  const golpear = () => {
    const dentro = pos >= inicioZona && pos <= inicioZona + anchoZona;
    terminar(dentro, dentro ? '¡Golpe limpio!' : 'Te has quedado corto…');
  };
  lienzo.addEventListener('pointerdown', golpear, { once: true });
  mj.limpiar = () => lienzo.removeEventListener('pointerdown', golpear);
}

/* --- 2. Tiro de arco --- */
function mjDiana(lienzo, terminar) {
  const diana = document.createElement('div');
  diana.className = 'mj-diana';
  const mira = document.createElement('div');
  mira.className = 'mj-mira';
  lienzo.append(diana, mira);

  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;
  const radio = 14 + estado.stats.agilidad * 1.4;
  const centro = { x: 60 + Math.random() * (ancho - 120), y: 60 + Math.random() * (alto - 120) };
  diana.style.left = `${centro.x}px`;
  diana.style.top = `${centro.y}px`;
  mira.style.left = `${centro.x}px`;
  mira.style.top = `${centro.y}px`;

  let x = centro.x, y = centro.y, vx = 1.1, vy = 0.7, ultimo = performance.now();
  const animar = (t) => {
    const dt = Math.min(40, t - ultimo);
    ultimo = t;
    x += vx * dt; y += vy * dt;
    if (x < 24 || x > ancho - 24) { vx *= -1; x = clamp(x, 24, ancho - 24); }
    if (y < 24 || y > alto - 24) { vy *= -1; y = clamp(y, 24, alto - 24); }
    mira.style.left = `${x}px`;
    mira.style.top = `${y}px`;
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  const disparar = () => {
    const dist = Math.hypot(x - centro.x, y - centro.y);
    terminar(dist <= radio, dist <= radio ? '¡En el centro!' : 'La flecha se pierde.');
  };
  lienzo.addEventListener('pointerdown', disparar, { once: true });
  mj.limpiar = () => lienzo.removeEventListener('pointerdown', disparar);
}

/* --- 3. Nudo de cuerda --- */
function mjCuerda(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'mj-cuerda');
  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  lienzo.appendChild(svg);

  const origen = { x: 26, y: alto * 0.5 };
  const destino = { x: ancho - 26, y: alto * 0.5 };
  const margen = 34 + estado.stats.agilidad * 2;
  const puntos = [];
  const pasos = 4;
  for (let i = 1; i < pasos; i++) {
    const t = i / pasos;
    puntos.push({
      x: origen.x + (destino.x - origen.x) * t,
      y: alto * 0.5 + (Math.random() * 2 - 1) * (alto / 2 - margen)
    });
  }
  const ruta = [origen, ...puntos, destino];

  const linea = document.createElementNS(svgNS, 'polyline');
  linea.setAttribute('points', ruta.map((p) => `${p.x},${p.y}`).join(' '));
  linea.setAttribute('fill', 'none');
  linea.setAttribute('stroke', 'rgba(255,255,255,.12)');
  linea.setAttribute('stroke-width', '10');
  linea.setAttribute('stroke-linecap', 'round');
  svg.appendChild(linea);

  const trazo = document.createElementNS(svgNS, 'polyline');
  trazo.setAttribute('points', '');
  trazo.setAttribute('fill', 'none');
  trazo.setAttribute('stroke', 'var(--oro)');
  trazo.setAttribute('stroke-width', '4');
  trazo.setAttribute('stroke-linecap', 'round');
  svg.appendChild(trazo);

  const marcador = document.createElementNS(svgNS, 'circle');
  marcador.setAttribute('r', '8');
  marcador.setAttribute('fill', '#fff');
  marcador.setAttribute('cx', origen.x);
  marcador.setAttribute('cy', origen.y);
  svg.appendChild(marcador);

  let arrastrando = false;
  let indice = 0;
  let hecho = '';
  let fallo = false;
  const recorrido = [[origen.x, origen.y]];

  const posicion = (ev) => {
    const r = lienzo.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (ancho / r.width), y: (ev.clientY - r.top) * (alto / r.height) };
  };

  const comprobar = (p) => {
    const objetivo = ruta[indice + 1];
    if (!objetivo) return;
    const dist = Math.hypot(p.x - objetivo.x, p.y - objetivo.y);
    if (dist <= 30) {
      indice += 1;
      if (indice >= ruta.length - 1) { hecho = 'bien'; terminar(true, 'Nudo tenso y firme.'); }
    } else {
      const seg = distanciaASegmento(p, ruta[indice], objetivo);
      if (seg > 46) { fallo = true; hecho = 'mal'; terminar(false, 'Se te escapa la cuerda.'); }
    }
  };

  const bajar = (ev) => { arrastrando = true; comprobar(posicion(ev)); };
  const mover = (ev) => {
    if (!arrastrando || hecho) return;
    const p = posicion(ev);
    recorrido.push([p.x, p.y]);
    trazo.setAttribute('points', recorrido.map((c) => `${c[0]},${c[1]}`).join(' '));
    marcador.setAttribute('cx', p.x);
    marcador.setAttribute('cy', p.y);
    comprobar(p);
  };
  const subir = () => {
    arrastrando = false;
    if (!hecho && indice < ruta.length - 1) { hecho = 'mal'; terminar(false, 'Suelta antes de tiempo.'); }
  };

  lienzo.addEventListener('pointerdown', bajar);
  lienzo.addEventListener('pointermove', mover);
  window.addEventListener('pointerup', subir);
  mj.limpiar = () => {
    lienzo.removeEventListener('pointerdown', bajar);
    lienzo.removeEventListener('pointermove', mover);
    window.removeEventListener('pointerup', subir);
  };
}

function distanciaASegmento(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const largo = dx * dx + dy * dy;
  if (!largo) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / largo;
  t = clamp(t, 0, 1);
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/* --- 4. Aguja firme --- */
function mjAguja(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;
  const total = 4;
  const puntos = [];
  const usados = [];
  const lejos = (x, y) => usados.every((u) => Math.hypot(u.x - x, u.y - y) > 70);
  while (puntos.length < total) {
    const x = 50 + Math.random() * (ancho - 100);
    const y = 50 + Math.random() * (alto - 100);
    if (lejos(x, y)) { puntos.push({ x, y }); usados.push({ x, y }); }
  }

  puntos.forEach((p, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'mj-punto';
    d.style.left = `${p.x}px`;
    d.style.top = `${p.y}px`;
    d.dataset.i = i;
    lienzo.appendChild(d);
  });

  let siguiente = 0;
  lienzo.addEventListener('click', (ev) => {
    const el = ev.target.closest('.mj-punto');
    if (!el) return;
    const i = Number(el.dataset.i);
    if (i !== siguiente) {
      el.classList.add('error');
      terminar(false, 'Te pinchas el dedo y no la herida.');
      return;
    }
    el.classList.add('hecho');
    siguiente += 1;
    if (siguiente === total) terminar(true, 'Puntada limpia, sin temblar.');
  });
}

/* --- 5. Memoria del sector --- */
function mjMemoria(lienzo, terminar) {
  const nombres = ['Costa', 'Bosque', 'Reloj', 'Ceniza', 'Viento', 'Hueso'];
  const caja = document.createElement('div');
  caja.className = 'mj-saqueo';
  caja.style.gridTemplateColumns = 'repeat(3, 1fr)';
  caja.style.gridTemplateRows = 'repeat(2, 1fr)';
  const celdas = nombres.map((n, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mj-celda';
    b.textContent = n;
    b.dataset.i = i;
    caja.appendChild(b);
    return b;
  });
  lienzo.appendChild(caja);

  const largo = 3 + Math.min(2, Math.floor(estado.stats.inteligencia / 4));
  const secuencia = [];
  for (let i = 0; i < largo; i++) secuencia.push(Math.floor(Math.random() * celdas.length));

  let turno = 0;
  let aceptando = false;

  const mostrar = () => {
    let i = 0;
    const siguiente = () => {
      if (i >= secuencia.length) { aceptando = true; return; }
      const c = celdas[secuencia[i]];
      c.classList.add('encendida');
      mj.temporizadores.push(setTimeout(() => {
        c.classList.remove('encendida');
        i += 1;
        mj.temporizadores.push(setTimeout(siguiente, 190));
      }, 420));
    };
    mj.temporizadores.push(setTimeout(siguiente, 350));
  };
  mostrar();

  caja.addEventListener('click', (ev) => {
    const el = ev.target.closest('.mj-celda');
    if (!el || !aceptando) return;
    const i = Number(el.dataset.i);
    if (i === secuencia[turno]) {
      el.classList.add('encendida');
      mj.temporizadores.push(setTimeout(() => el.classList.remove('encendida'), 220));
      turno += 1;
      if (turno === secuencia.length) terminar(true, 'Recuerdas el sector exacto.');
    } else {
      el.classList.add('error');
      terminar(false, 'Te confundes de sector.');
    }
  });
}

/* --- 6. Saqueo a contrarreloj --- */
function mjSaqueo(lienzo, terminar) {
  const objetos = ['Vendas', 'Raciones', 'Cantimplora', 'Analgésicos', 'Cuerda', 'Cuchillo de caza',
    'Té de corteza', 'Antibiótico', 'Piedra', 'Rama seca', 'Lata vacía', 'Trapo sucio'];
  const utiles = new Set(['Vendas', 'Raciones', 'Cantimplora', 'Analgésicos', 'Cuerda', 'Cuchillo de caza',
    'Té de corteza', 'Antibiótico']);
  const mesa = barajar(objetos);
  const caja = document.createElement('div');
  caja.className = 'mj-saqueo';
  mesa.forEach((o) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mj-objeto';
    b.textContent = o;
    b.dataset.o = o;
    caja.appendChild(b);
  });
  lienzo.appendChild(caja);

  const limite = 2 + (estado.stats.agilidad >= 7 ? 1 : 0);
  let cogidos = 0;
  let puntos = 0;
  caja.addEventListener('click', (ev) => {
    const el = ev.target.closest('.mj-objeto');
    if (!el || el.classList.contains('cogido')) return;
    el.classList.add('cogido');
    cogidos += 1;
    if (utiles.has(el.dataset.o)) puntos += 1;
    if (cogidos >= limite) {
      terminar(puntos > 0, puntos > 0 ? `Te llevas ${puntos} cosa${puntos > 1 ? 's' : ''} que sirve${puntos > 1 ? 'n' : ''}.` : 'Solo basura.');
    }
  });
}

/* --- 7. Esquivar la flecha: mueve el tributo con las flechas del teclado --- */
function mjEsquivar(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;
  const jugador = document.createElement('div');
  jugador.className = 'mj-jugador';
  const objetivo = document.createElement('div');
  objetivo.className = 'mj-objetivo';
  const barra = document.createElement('div');
  barra.className = 'mj-barra-vida';
  const relleno = document.createElement('div');
  barra.appendChild(relleno);
  lienzo.append(objetivo, jugador, barra);

  let x = ancho / 2 - 14;
  const y = alto - 44;
  const anchoJ = 28;
  jugador.style.top = `${y}px`;
  jugador.style.left = `${x}px`;

  let d = { x: 40 + Math.random() * (ancho - 120), y: -30 };
  let dy = 2.4 + Math.random() * 1.2;
  objetivo.style.top = `${d.y}px`;
  objetivo.style.left = `${d.x}px`;

  let vida = 3;
  let ultimo = performance.now();
  let teclas = {};

  const pintar = () => {
    jugador.style.left = `${x}px`;
    relleno.style.width = `${(vida / 3) * 100}%`;
  };
  const bajar = (e) => { teclas[e.key] = true; if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault(); };
  const subir = (e) => { teclas[e.key] = false; };
  window.addEventListener('keydown', bajar);
  window.addEventListener('keyup', subir);

  const animar = (t) => {
    const dt = Math.min(40, t - ultimo) / 16;
    ultimo = t;
    const vel = 5 * dt;
    if (teclas.ArrowLeft || teclas.a || teclas.A) x -= vel;
    if (teclas.ArrowRight || teclas.d || teclas.D) x += vel;
    x = clamp(x, 4, ancho - anchoJ - 4);

    d.y += dy * dt;
    if (d.y > alto) {
      d.y = -30;
      d.x = Math.random() * (ancho - 40);
      dy = 2.4 + Math.random() * 1.4;
    }
    objetivo.style.top = `${d.y}px`;
    objetivo.style.left = `${d.x}px`;

    if (d.y + 16 > y && d.y - 16 < y + 40 && d.x + 16 > x && d.x < x + anchoJ) {
      vida -= 1;
      d.y = -30;
      d.x = Math.random() * (ancho - 40);
      pintar();
      if (vida <= 0) { terminar(false, 'Te alcanzan tres veces: el golpe entra.'); return; }
    }
    pintar();
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);
  pintar();
  mj.limpiar = () => {
    window.removeEventListener('keydown', bajar);
    window.removeEventListener('keyup', subir);
  };
}

/* --- 8. Libertad condicional: detén la barra en la zona verde --- */
function mjPrecision(lienzo, terminar) {
  const barra = document.createElement('div');
  barra.className = 'mj-pulso';
  barra.style.height = '60px';
  barra.style.top = '50%';
  const zona = document.createElement('div');
  zona.className = 'mj-pulso__zona';
  const anchoZona = 14 + estado.stats.agilidad * 1.2;
  const inicio = 30 + Math.random() * (60 - anchoZona);
  zona.style.left = `${inicio}%`;
  zona.style.width = `${anchoZona}%`;
  zona.style.background = 'linear-gradient(90deg, rgba(127,209,138,.35), rgba(127,209,138,.8))';
  const aguja = document.createElement('div');
  aguja.className = 'mj-pulso__aguja';
  barra.append(zona, aguja);
  lienzo.appendChild(barra);

  let pos = 0, dir = 1, ultimo = performance.now();
  const animar = (t) => {
    const dt = t - ultimo;
    ultimo = t;
    pos += dir * 0.09 * dt;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0) { pos = 0; dir = 1; }
    aguja.style.left = `${pos}%`;
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  const cortar = () => {
    const dentro = pos >= inicio && pos <= inicio + anchoZona;
    terminar(dentro, dentro ? '¡Cortas en el momento justo!' : 'Cortas tarde: la cuerda te arrastra.');
  };
  lienzo.addEventListener('pointerdown', cortar, { once: true });
  mj.limpiar = () => lienzo.removeEventListener('pointerdown', cortar);
}

/* --- 9. Carrera de fondo: pulsa alternando dos teclas --- */
function mjCarrera(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const meta = document.createElement('div');
  meta.className = 'mj-meta';
  meta.style.left = `${ancho - 46}px`;
  const yo = document.createElement('div');
  yo.className = 'mj-corredor';
  const otro = document.createElement('div');
  otro.className = 'mj-corredor mj-corredor--otro';
  const pista = document.createElement('div');
  pista.className = 'mj-pista';
  lienzo.append(pista, meta, yo, otro);

  let x = 10, rival = 10;
  const avance = 2 + estado.stats.resistencia * 0.35;
  let ultimo = performance.now();
  let ultimaTecla = '';

  const tecla = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    if (e.key === ultimaTecla) return; // hay que alternar
    ultimaTecla = e.key;
    x += avance;
    yo.style.left = `${Math.min(x, ancho - 40)}px`;
    if (x >= ancho - 40) terminar(true, 'Llegas primero a la grieta.');
  };
  window.addEventListener('keydown', tecla);

  const animar = (t) => {
    const dt = Math.min(40, t - ultimo);
    ultimo = t;
    rival += (0.055 + Math.random() * 0.03) * dt;
    otro.style.left = `${Math.min(rival, ancho - 40)}px`;
    if (rival >= ancho - 40) { terminar(false, 'Te alcanza por detrás.'); return; }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  mj.limpiar = () => window.removeEventListener('keydown', tecla);
}

/* --- 10. Apretón de manos / pulseada: pulsa rápido para vencer --- */
function mjPulseada(lienzo, terminar) {
  const caja = document.createElement('div');
  caja.className = 'mj-pulseada';
  const medidor = document.createElement('div');
  medidor.className = 'mj-pulseada__medidor';
  const relleno = document.createElement('div');
  relleno.className = 'mj-pulseada__relleno';
  medidor.appendChild(relleno);
  const centro = document.createElement('div');
  centro.className = 'mj-pulseada__centro';
  caja.append(medidor, centro);
  lienzo.appendChild(caja);

  let fuerza = 50;
  const fuerzaJugador = 4 + estado.stats.fuerza;
  const fuerzaRival = 5 + Math.round(Math.random() * 3);
  let ultimo = performance.now();

  const apretar = () => { fuerza += fuerzaJugador; relleno.style.width = `${clamp(fuerza, 0, 100)}%`; };
  lienzo.addEventListener('pointerdown', apretar);

  const animar = (t) => {
    const dt = Math.min(60, t - ultimo) / 16;
    ultimo = t;
    fuerza -= fuerzaRival * dt * 0.9;
    fuerza = clamp(fuerza, 0, 100);
    relleno.style.width = `${fuerza}%`;
    if (fuerza >= 100) { terminar(true, 'Le ganas la mano.'); return; }
    if (fuerza <= 0) { terminar(false, 'Te dobla el brazo.'); return; }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  mj.limpiar = () => lienzo.removeEventListener('pointerdown', apretar);
}

/* --- 11. Lectura del Capitolio: caza la palabra clave en un texto que se mueve --- */
function mjLectura(lienzo, terminar) {
  const palabras = ['FIEBRE', 'INSPECTOR', 'DECRETO', 'TREN', 'MOVIMIENTO', 'SILENCIO', 'PANEM', 'DISTRITO'];
  const caja = document.createElement('div');
  caja.className = 'mj-lectura';
  const objetivo = document.createElement('div');
  objetivo.className = 'mj-lectura__objetivo';
  const clave = elegir(palabras);
  objetivo.textContent = `Busca: ${clave}`;
  const texto = document.createElement('div');
  texto.className = 'mj-lectura__texto';
  caja.append(objetivo, texto);
  lienzo.appendChild(caja);

  const trozos = [];
  for (let i = 0; i < 40; i++) {
    trozos.push(elegir(palabras));
    if (Math.random() < 0.2) trozos.push(clave);
  }
  if (!trozos.includes(clave)) trozos[5] = clave;

  trozos.forEach((w) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `mj-lectura__palabra${w === clave ? ' clave' : ''}`;
    b.textContent = w;
    b.addEventListener('click', () => {
      if (w === clave) terminar(true, 'Encuentras la palabra a tiempo.');
      else terminar(false, 'Te confundes de palabra y pierdes el momento.');
    });
    texto.appendChild(b);
  });

  // Las palabras se desplazan y hay que encontrarla antes de que salga de la vista
  let desplazado = 0;
  let ultimo = performance.now();
  const animar = (t) => {
    const dt = Math.min(50, t - ultimo);
    ultimo = t;
    desplazado += dt * 0.04;
    texto.style.transform = `translateY(${-desplazado}px)`;
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);
}

/* --- 12. Cuerda floja: mantén pulsado para subir, suelta para bajar --- */
function mjEquilibrio(lienzo, terminar) {
  const ancho = lienzo.clientWidth || 520;
  const alto = lienzo.clientHeight || 210;
  const barra = document.createElement('div');
  barra.className = 'mj-equilibrio';
  const zona = document.createElement('div');
  zona.className = 'mj-equilibrio__zona';
  const zonaAlto = 26 + estado.stats.agilidad * 2;
  zona.style.top = `${50 - zonaAlto / 2}%`;
  zona.style.height = `${zonaAlto}%`;
  const marcador = document.createElement('div');
  marcador.className = 'mj-equilibrio__marcador';
  barra.append(zona, marcador);
  lienzo.appendChild(barra);

  let y = 50, vel = 0, pulsado = false, ultimo = performance.now();
  const dentro = () => (Math.abs(y - 50) <= zonaAlto / 2);
  let fuera = 0;

  const bajar = () => { pulsado = true; };
  const soltar = () => { pulsado = false; };
  lienzo.addEventListener('pointerdown', bajar);
  window.addEventListener('pointerup', soltar);

  const animar = (t) => {
    const dt = Math.min(40, t - ultimo) / 16;
    ultimo = t;
    vel += (pulsado ? -0.55 : 0.55) * dt;
    vel *= 0.94;
    y = clamp(y + vel, 4, 96);
    marcador.style.top = `${y}%`;
    if (!dentro()) {
      fuera += dt;
      if (fuera > 55) { terminar(false, 'Pierdes el equilibrio y caes.'); return; }
    } else {
      fuera = Math.max(0, fuera - dt);
    }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);

  // Sobrevivir 4 segundos manteniéndote en la zona cuenta como acierto
  mj.temporizadores.push(setTimeout(() => {
    if (dentro()) terminar(true, 'Cruzas la cuerda sin caer.');
  }, 3800));

  mj.limpiar = () => {
    lienzo.removeEventListener('pointerdown', bajar);
    window.removeEventListener('pointerup', soltar);
  };
}

/* --- 13. Niebla venenosa: busca aire limpio por la zona con menos veneno --- */
function mjNiebla(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const rejilla = document.createElement('div');
  rejilla.className = 'mj-rejilla';
  rejilla.style.gridTemplateColumns = 'repeat(5, 1fr)';
  lienzo.appendChild(rejilla);

  // Cada celda tiene un nivel de veneno (0-100). Hay que llegar a la salida viva.
  const celdas = [];
  const filas = 3, cols = 5;
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mj-celda-niebla';
      const veneno = Math.round(Math.random() * 100);
      b.dataset.veneno = veneno;
      b.textContent = veneno > 70 ? '☠' : veneno > 40 ? '~' : '·';
      rejilla.appendChild(b);
      celdas.push(b);
    }
  }
  // La salida está en la última celda, siempre con algo de veneno
  celdas[celdas.length - 1].textContent = '🚪';

  let vida = 100;
  let fila = 0;
  ctx.setExtra(`Aire: ${vida}%`);
  const colorear = (b) => {
    const v = Number(b.dataset.veneno);
    b.classList.add(v > 70 ? 'mala' : v > 40 ? 'media' : 'buena');
  };

  rejilla.addEventListener('click', (ev) => {
    const b = ev.target.closest('.mj-celda-niebla');
    if (!b || b.classList.contains('mala') && b.dataset.visitada === '1') return;
    const indice = celdas.indexOf(b);
    if (Math.floor(indice / cols) < fila) return; // no se retrocede
    const v = Number(b.dataset.veneno);
    b.dataset.visitada = '1';
    colorear(b);
    vida -= Math.round(v / 4);
    ctx.setExtra(`Aire: ${Math.max(0, vida)}%`);
    ctx.sumar(10 - Math.round(v / 10));
    if (vida <= 0) { ctx.acabar(false, 'El veneno te llena los pulmones.'); return; }
    fila = Math.floor(indice / cols);
    if (b.textContent === '🚪') {
      ctx.acabar(true, vida > 60 ? 'Sales de la niebla respirando bien.' : 'Sales de la niebla, pero tosiendo sangre.');
    }
  });
}

/* --- 14. Avispas letales: mátalas antes de que te piquen tres veces --- */
function mjAvispas(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const avispas = [];
  let picaduras = 0;
  let ultimo = performance.now();

  ctx.setExtra('Picaduras: 0/3');
  for (let i = 0; i < 7; i++) {
    const el = ctx.pieza('mj-avispa', Math.random() * (ctx.ancho - 30), Math.random() * (ctx.alto - 30));
    el.textContent = '🐝';
    avispas.push({ el, x: Math.random() * (ctx.ancho - 30), y: Math.random() * (ctx.alto - 30),
      vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.5) * 2.4, viva: true });
  }

  lienzo.addEventListener('pointerdown', (ev) => {
    const r = lienzo.getBoundingClientRect();
    const px = ev.clientX - r.left, py = ev.clientY - r.top;
    avispas.forEach((a) => {
      if (!a.viva) return;
      if (Math.hypot(a.x + 14 - px, a.y + 14 - py) < 22) {
        a.viva = false;
        a.el.classList.add('muerta');
        ctx.sumar(15, '¡Una menos!');
      }
    });
    if (avispas.every((a) => !a.viva)) ctx.acabar(true, 'El enjambre cae entero.');
  });

  const animar = (t) => {
    const dt = Math.min(40, t - ultimo) / 16;
    ultimo = t;
    avispas.forEach((a) => {
      if (!a.viva) return;
      a.x += a.vx * dt; a.y += a.vy * dt;
      if (a.x < 0 || a.x > ctx.ancho - 28) a.vx *= -1;
      if (a.y < 0 || a.y > ctx.alto - 28) a.vy *= -1;
      a.x = clamp(a.x, 0, ctx.ancho - 28);
      a.y = clamp(a.y, 0, ctx.alto - 28);
      a.el.style.left = `${a.x}px`;
      a.el.style.top = `${a.y}px`;
    });
    // Una avispa te alcanza cuando lleva un rato sin que la mates
    if (Math.random() < 0.012 * dt) {
      picaduras += 1;
      ctx.setExtra(`Picaduras: ${picaduras}/3`);
      if (picaduras >= 3) { ctx.acabar(false, 'Te pican tres veces y se te hincha la garganta.'); return; }
    }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);
}

/* --- 15. Bestias mutantes: elige el camino y escóndete a tiempo --- */
function mjBestias(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const escenas = 3;
  let ronda = 0;

  const montarRonda = () => {
    lienzo.querySelectorAll('.mj-opcion-bestia, .mj-texto-bestia').forEach((n) => n.remove());
    const texto = document.createElement('div');
    texto.className = 'mj-texto-bestia';
    texto.textContent = [
      'Los mutos rodean el claro. ¿Por dónde sales?',
      'Uno te ha olido. ¿Qué haces?',
      'Quedan dos, y uno cojea. Última decisión.'
    ][ronda];
    lienzo.appendChild(texto);

    const opciones = barajar([
      { t: 'Subir al árbol más alto', bien: true },
      { t: 'Cruzar el río nadando', bien: ronda > 0 },
      { t: 'Correr en línea recta', bien: false },
      { t: 'Quedarte quieto y aguantar la respiración', bien: ronda === 2 }
    ]);
    const caja = document.createElement('div');
    caja.className = 'mj-opciones-bestia';
    opciones.forEach((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mj-opcion-bestia';
      b.textContent = o.t;
      b.addEventListener('click', () => {
        if (o.bien) {
          ctx.sumar(20, 'Bien pensado');
          ronda += 1;
          if (ronda >= escenas) ctx.acabar(true, 'Las bestias se quedan sin presa.');
          else montarRonda();
        } else {
          ctx.acabar(false, 'La manada te alcanza en tres zancadas.');
        }
      });
      caja.appendChild(b);
    });
    lienzo.appendChild(caja);
  };
  montarRonda();
}

/* --- 16. Terremoto: mantén el equilibrio mientras la pantalla se mueve --- */
function mjTerremoto(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const zona = ctx.pieza('mj-zona-segura');
  const jugador = ctx.pieza('mj-jugador-terremoto');
  const suelo = ctx.pieza('mj-suelo');
  suelo.style.bottom = '10px';

  let x = ctx.ancho / 2;
  let y = ctx.alto - 60;
  let sacudida = 0;
  let caidas = 0;
  let ultimo = performance.now();
  ctx.setExtra('Caídas: 0/3');

  const mover = (ev) => {
    const r = lienzo.getBoundingClientRect();
    x = clamp((ev.clientX - r.left) * (ctx.ancho / r.width), 10, ctx.ancho - 26);
    jugador.style.left = `${x}px`;
  };
  lienzo.addEventListener('pointermove', mover);
  lienzo.addEventListener('pointerdown', mover);

  const animar = (t) => {
    const dt = Math.min(40, t - ultimo) / 16;
    ultimo = t;
    sacudida += 0.06 * dt;
    const temblor = Math.sin(sacudida * 3) * (6 + Math.sin(sacudida) * 4);
    lienzo.style.transform = `translateX(${temblor * 0.4}px)`;

    // La zona segura se mueve: hay que seguirla
    const zx = (Math.sin(sacudida * 0.9) * 0.5 + 0.5) * (ctx.ancho - 90) + 10;
    zona.style.left = `${zx}px`;
    const dentro = x + 8 > zx && x < zx + 80;

    if (dentro) {
      ctx.sumar(0.15);
      caidas = Math.max(0, caidas - 0.01 * dt);
    } else {
      caidas += 0.012 * dt;
    }
    ctx.setExtra(`Caídas: ${caidas > 2 ? 3 : Math.floor(caidas)}/3`);
    if (caidas > 2.2) { ctx.acabar(false, 'El suelo se abre y caes.'); return; }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);
  mj.temporizadores.push(setTimeout(() => {
    ctx.acabar(true, 'El temblor para y sigues de pie.');
  }, 6500));

  mj.limpiar = () => {
    lienzo.removeEventListener('pointermove', mover);
    lienzo.removeEventListener('pointerdown', mover);
    lienzo.style.transform = '';
  };
}

/* --- 17. Inundación: sube a la plataforma más alta antes de que llegue el agua --- */
function mjInundacion(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const agua = ctx.pieza('mj-agua');
  const plataformas = [];
  const niveles = [ctx.alto - 60, ctx.alto - 110, ctx.alto - 160];
  niveles.forEach((y, i) => {
    const p = ctx.pieza('mj-plataforma', 40 + i * ((ctx.ancho - 140) / 2), y);
    p.dataset.nivel = i;
    p.addEventListener('click', () => {
      if (p.classList.contains('usada')) return;
      p.classList.add('usada');
      ctx.sumar(20 + i * 15, `Nivel ${i + 1}`);
      if (i === niveles.length - 1) ctx.acabar(true, 'El agua no llega hasta aquí arriba.');
    });
    plataformas.push(p);
  });
  // El agua sube: si llega a la plataforma en la que estás, se acaba
  let altura = ctx.alto;
  let ultimo = performance.now();
  const animar = (t) => {
    const dt = Math.min(40, t - ultimo) / 16;
    ultimo = t;
    altura -= 0.55 * dt;
    agua.style.top = `${altura}px`;
    if (altura < niveles[1] && !plataformas[2].classList.contains('usada')) {
      ctx.acabar(false, 'El agua te arrastra antes de subir.');
      return;
    }
    mj.raf = requestAnimationFrame(animar);
  };
  mj.raf = requestAnimationFrame(animar);
}

/* --- 18. Tormenta eléctrica: toca los pararrayos a tiempo --- */
function mjTormenta(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  let tocados = 0;
  let total = 5;
  let fallos = 0;
  ctx.setExtra('Rayos: 0/5');

  const nuevoRayo = () => {
    if (tocados >= total) { ctx.acabar(true, 'Los pararrayos aguantan.'); return; }
    const r = ctx.pieza('mj-pararrayos', Math.random() * (ctx.ancho - 60) + 20, Math.random() * (ctx.alto - 70) + 20);
    r.textContent = '⚡';
    let vivo = true;
    const quitar = () => { if (vivo) { vivo = false; r.remove(); } };
    r.addEventListener('click', () => {
      quitar();
      tocados += 1;
      ctx.sumar(20, '¡Descarga!');
      ctx.setExtra(`Rayos: ${tocados}/5`);
      nuevoRayo();
    });
    mj.temporizadores.push(setTimeout(() => {
      if (!vivo) return;
      quitar();
      fallos += 1;
      if (fallos >= 3) { ctx.acabar(false, 'Te alcanzan tres rayos.'); return; }
      ctx.setExtra(`Fallos: ${fallos}/3`);
      nuevoRayo();
    }, 1400 - estado.stats.agilidad * 40));
  };
  nuevoRayo();
}

/* --- 19. Lluvia de sangre: corre de zona en zona sin quedarte quieto --- */
function mjSangre(lienzo, terminar) {
  const ctx = mjContexto(lienzo, terminar);
  const zonas = [];
  for (let i = 0; i < 6; i++) {
    const z = ctx.pieza('mj-zona-carrera',
      20 + Math.random() * (ctx.ancho - 90),
      20 + Math.random() * (ctx.alto - 90));
    z.addEventListener('click', () => {
      if (z.dataset.usada === '1') return;
      z.dataset.usada = '1';
      z.classList.add('usada');
      ctx.sumar(15);
      if (zonas.filter((x) => x.dataset.usada === '1').length === zonas.length) {
        ctx.acabar(true, 'Has recorrido toda la zona sin parar.');
      }
    });
    zonas.push(z);
  }
  // Cada segundo, la lluvia se cierra un poco más: si no te mueves, te mancha
  let manchas = 0;
  let ultimoClic = performance.now();
  ctx.setExtra('Manchas: 0/4');
  mj.temporizadores.push(setInterval(() => {
    if (performance.now() - ultimoClic > 1200) {
      manchas += 1;
      ctx.setExtra(`Manchas: ${manchas}/4`);
      if (manchas >= 4) ctx.acabar(false, 'La lluvia te cubre y no ves nada.');
    }
  }, 1200));
  lienzo.addEventListener('pointerdown', () => { ultimoClic = performance.now(); });
}

const MINIJUEGOS = {
  niebla: {
    etiqueta: 'MINIJUEGO · AIRE',
    titulo: 'Buscar aire limpio',
    instrucciones: 'Pulsa celdas para avanzar por la niebla. Las celdas oscuras (☠) tienen mucho veneno: te quitan aire. Llega a la puerta 🚪 antes de quedarte sin aire.',
    segundos: 14,
    fallo: 'El veneno te llena los pulmones.',
    montar: mjNiebla
  },
  avispas: {
    etiqueta: 'MINIJUEGO · ENJAMBRE',
    titulo: 'Matar el enjambre',
    instrucciones: 'Pulsa las avispas para matarlas antes de que te piquen tres veces. Cuantas más mates, más puntos.',
    segundos: 12,
    fallo: 'El enjambre te alcanza.',
    montar: mjAvispas
  },
  bestias: {
    etiqueta: 'MINIJUEGO · INSTINTO',
    titulo: 'Escapar de la manada',
    instrucciones: 'Elige la salida correcta en cada ronda. Solo una opción te mantiene vivo; las demás te entregan a los mutos.',
    segundos: 12,
    fallo: 'La manada te alcanza.',
    montar: mjBestias
  },
  terremoto: {
    etiqueta: 'MINIJUEGO · EQUILIBRIO',
    titulo: 'Aguantar el temblor',
    instrucciones: 'Mueve el ratón o el dedo para mantenerte dentro de la zona dorada mientras el suelo se mueve. Si te salen tres caídas, el suelo te traga.',
    segundos: 9,
    fallo: 'El suelo se abre bajo tus pies.',
    montar: mjTerremoto
  },
  inundacion: {
    etiqueta: 'MINIJUEGO · ESCALADA',
    titulo: 'Subir antes del agua',
    instrucciones: 'Pulsa las plataformas en orden, de la más baja a la más alta, antes de que el agua te alcance.',
    segundos: 9,
    fallo: 'El agua te arrastra.',
    montar: mjInundacion
  },
  tormenta: {
    etiqueta: 'MINIJUEGO · REFLEJOS',
    titulo: 'Descargar los rayos',
    instrucciones: 'Pulsa cada rayo ⚡ antes de que caiga. Si se te escapan tres, te alcanza la corriente.',
    segundos: 12,
    fallo: 'Te alcanza un rayo.',
    montar: mjTormenta
  },
  sangre: {
    etiqueta: 'MINIJUEGO · AGUANTE',
    titulo: 'Lluvia de sangre',
    instrucciones: 'Pulsa todas las zonas de la arena sin quedarte quieto más de un segundo. Si te paran cuatro veces, la lluvia te cubre.',
    segundos: 12,
    fallo: 'La lluvia te cubre.',
    montar: mjSangre
  },
  esquivar: {
    etiqueta: 'MINIJUEGO · SUPERVIVENCIA',
    titulo: 'Esquivar la flecha',
    instrucciones: 'Mueve al tributo con las flechas ← → (o A y D) para esquivar lo que cae del cielo. Te pueden dar tres veces.',
    segundos: 12,
    fallo: 'Te alcanzan demasiadas veces.',
    montar: mjEsquivar
  },
  precision: {
    etiqueta: 'MINIJUEGO · TENSIÓN',
    titulo: 'Cortar la cuerda',
    instrucciones: 'Pulsa cuando la aguja esté dentro de la zona verde: ni antes ni después.',
    segundos: 4,
    fallo: 'La cuerda se rompe en el peor momento.',
    montar: mjPrecision
  },
  carrera: {
    etiqueta: 'MINIJUEGO · PERSECUCIÓN',
    titulo: 'Carrera de fondo',
    instrucciones: 'Alterna ← y → (o A y D) rápidamente para correr. Si repites la misma tecla no avanzas.',
    segundos: 12,
    fallo: 'Te alcanzan por detrás.',
    montar: mjCarrera
  },
  pulseada: {
    etiqueta: 'MINIJUEGO · DUELO',
    titulo: 'Pulseada',
    instrucciones: 'Pulsa sin parar para empujar la barra hasta el final antes de que él te doble el brazo.',
    segundos: 8,
    fallo: 'Te dobla el brazo.',
    montar: mjPulseada
  },
  lectura: {
    etiqueta: 'MINIJUEGO · INGENIO',
    titulo: 'Lectura del Capitolio',
    instrucciones: 'Encuentra la palabra clave entre las demás y púlsala antes de que desaparezca.',
    segundos: 8,
    fallo: 'Se acaba el tiempo antes de encontrarla.',
    montar: mjLectura
  },
  equilibrio: {
    etiqueta: 'MINIJUEGO · TEMPLE',
    titulo: 'Cuerda floja',
    instrucciones: 'Mantén pulsado para subir y suelta para bajar. Mantén la marca dentro de la zona dorada.',
    segundos: 9,
    fallo: 'Pierdes el equilibrio.',
    montar: mjEquilibrio
  },
  fuerza: {
    etiqueta: 'MINIJUEGO · COMBATE',
    titulo: 'Pulso de fuerza',
    instrucciones: 'Pulsa en el momento en que la aguja pase por la zona dorada.',
    segundos: 5,
    fallo: 'Te has quedado sin tiempo.',
    montar: mjPulso
  },
  diana: {
    etiqueta: 'MINIJUEGO · PUNTERÍA',
    titulo: 'Tiro de arco',
    instrucciones: 'El punto de mira se mueve. Pulsa cuando esté dentro del círculo dorado.',
    segundos: 6,
    fallo: 'La presa se escapa.',
    montar: mjDiana
  },
  cuerda: {
    etiqueta: 'MINIJUEGO · SIGILO',
    titulo: 'Nudo de cuerda',
    instrucciones: 'Arrastra el dedo o el ratón desde el punto blanco hasta el otro extremo sin salirte de la cuerda.',
    segundos: 8,
    fallo: 'La cuerda se queda floja.',
    montar: mjCuerda
  },
  aguja: {
    etiqueta: 'MINIJUEGO · CURACIÓN',
    titulo: 'Aguja firme',
    instrucciones: 'Pulsa los puntos en orden, de izquierda a derecha de la lista de abajo: primero el marcado, luego el siguiente.',
    segundos: 7,
    fallo: 'Te tiembla la mano.',
    montar: mjAguja
  },
  memoria: {
    etiqueta: 'MINIJUEGO · ORIENTACIÓN',
    titulo: 'Memoria del sector',
    instrucciones: 'Mira la secuencia de sectores que se iluminan y repítela en el mismo orden.',
    segundos: 10,
    fallo: 'No recuerdas el orden.',
    montar: mjMemoria
  },
  saqueo: {
    etiqueta: 'MINIJUEGO · BOTÍN',
    titulo: 'Saqueo a contrarreloj',
    instrucciones: 'Coge solo lo que sirva antes de que el otro tributo llegue. Los objetos inútiles no cuentan.',
    segundos: 6,
    fallo: 'Llega el otro tributo y te vas con las manos vacías.',
    montar: mjSaqueo
  }
};

document.getElementById('mj-salir').addEventListener('click', () => {
  const capa = document.getElementById('minijuego');
  capa.hidden = true;
  mjLimpiarTimers();
  if (mj.limpiar) { mj.limpiar(); mj.limpiar = null; }
  mj.activo = null;
  // Avisar al juego de que el jugador ha abandonado: cuenta como fallo
  if (mj.abandonar) {
    const f = mj.abandonar;
    mj.abandonar = null;
    f();
    const res = document.querySelector('#mj-resultado');
    if (res) { res.textContent = 'Has abandonado.'; res.className = 'minijuego__resultado mal'; }
  }
});

/* ============================================================
   ACCIONES PROPIAS DE LA ARENA
   Cazar, poner trampas, vendarte, pedir un envío y escuchar.
   Gastan turno y cansancio, pero te dan ventaja.
   ============================================================ */

const CLIMAS = [
  { id: 'despejado', nombre: 'Despejado', icono: '☀', escondite: 0, texto: 'El sol pega fuerte y no hay dónde esconderse.' },
  { id: 'lluvia', nombre: 'Lluvia', icono: '🌧', escondite: 0.1, texto: 'La lluvia borra las huellas y amortigua los pasos.' },
  { id: 'niebla', nombre: 'Niebla', icono: '🌫', escondite: 0.15, texto: 'La niebla lo cubre todo: nadie ve a nadie.' },
  { id: 'noche', nombre: 'Noche cerrada', icono: '🌙', escondite: 0.2, texto: 'Sin luz, la arena se vuelve otra cosa.' },
  { id: 'calor', nombre: 'Calor asfixiante', icono: '🔥', escondite: -0.1, texto: 'El aire quema y el agua se acaba antes.' }
];

function climaActual() {
  return CLIMAS.find((c) => c.id === estado.clima) || CLIMAS[0];
}

function cambiarClima() {
  estado.climaTurnos = (estado.climaTurnos || 0) + 1;
  if (estado.climaTurnos % 2 !== 0 && estado.climaTurnos > 1) return; // cambia cada dos turnos
  const opciones = CLIMAS.filter((c) => c.id !== estado.clima);
  estado.clima = elegir(opciones).id;
}

/* Comprueba si puedes hacer una acción libre (no en mitad de una decisión) */
function puedeActuar() {
  return !estado.fin && !estado.esperandoEleccion && escenaActual;
}

/* Cerrar el turno después de una acción propia */
async function cerrarTurnoLibre() {
  estado.esperandoEleccion = false;
  estado.turno += 1;
  cambiarClima();
  gastarHambreSed(estado.cansancio > 70 ? 2 : 1);
  procesarEnfermedad();
  actualizarHUD();
  pintarTributosHUD();
  pintarMapa();
  actualizarRelojMapa();
  procesarHeridas();

  if (estado.vida <= 0) {
    estado.vivo = false;
    if (!estado.causaMuerte) estado.causaMuerte = 'El cuerpo dijo basta en mitad de la arena.';
    narrar('<span class="linea-muerte">Te faltan fuerzas. Caes de rodillas y el mundo se apaga.</span>');
    await dormir(600);
    terminarArena('muerto');
    return;
  }

  const tocaAcontecimiento = estado.turno >= estado.proximoAcontecimiento && !estado.fin;
  if (tocaAcontecimiento) estado.proximoAcontecimiento += 1;

  resolverTrampas();

  if (estado.cornucopiaAbierta || estado.fiestaAbierta) return; // evento pendiente de elegir
  await ofrecerEscenaSiguiente();
  if (tocaAcontecimiento && !estado.fin && !estado.cornucopiaAbierta && !estado.fiestaAbierta) {
    estado.acontecimientoPendiente = true;
    dormir(420).then(() => lanzarAcontecimiento());
  }
}

/* Elige y muestra la siguiente escena del árbol (lo usan acciones y decisiones) */
async function ofrecerEscenaSiguiente() {
  // Eventos que llegan a mitad de los Juegos y exigen una decisión
  if (!estado.cornucopiaAbierta && estado.turno >= estado.cornucopiaTurno) {
    reabrirCornucopia();
    return;
  }
  if (!estado.fiestaAbierta && estado.turno >= estado.fiestaTurno) {
    fiestaCapitolio();
    return;
  }
  const accion = estado.ultimaAccion || { tipo: 'sigilo', bien: true };
  const siguiente = siguienteEscena(accion.tipo, accion.bien);
  historialEscenas.push(siguiente.id);
  ofrecerOpciones(siguiente);
}

function vivosRestantes() {
  return estado.tributos.filter((t) => t.vivo).length;
}

/* ---------- Hambre y sed ----------
   Bajan cada turno (más con calor y cansancio). Si llegan a cero,
   pierdes vida y cordura hasta que comas o bebas algo. */
function gastarHambreSed(extra = 1) {
  const cl = climaActual();
  const gastoHambre = 4 + extra;
  const gastoSed = (cl.id === 'calor' ? 9 : cl.id === 'despejado' ? 7 : 5) + extra;
  estado.hambre = clamp(estado.hambre - gastoHambre, 0, 100);
  estado.sed = clamp(estado.sed - gastoSed, 0, 100);

  const falta = (estado.hambre <= 0 ? 1 : 0) + (estado.sed <= 0 ? 1 : 0);
  if (falta) {
    estado.privacion += 1;
    const dano = 3 + falta * 2 + Math.floor(estado.privacion / 2);
    estado.vida = clamp(estado.vida - dano, 0, 100);
    estado.cordura = clamp(estado.cordura - 3, 0, 100);
    const aviso = estado.hambre <= 0 && estado.sed <= 0
      ? 'El hambre y la sed te vacían por dentro.'
      : estado.sed <= 0 ? 'La boca se te seca y la vista se nubla.' : 'El estómago te gruñe tan fuerte que duele.';
    narrar(`<span class="linea-muerte">${aviso} −${dano} de vida.</span>`);
  } else {
    estado.privacion = 0;
    if (estado.hambre < 30 || estado.sed < 30) {
      const queja = estado.sed < estado.hambre ? 'Tienes la garganta seca.' : 'Te ruge el estómago.';
      narrar(`<span class="ayuda">${queja}</span>`);
    }
  }
}

/* Come o bebe del inventario. Devuelve true si ha consumido algo */
function saciar(cantidad) {
  const comidas = estado.inventario.filter((i) => COMIDA[i]);
  const bebidas = estado.inventario.filter((i) => BEBIDA[i]);
  let comido = false;
  let bebido = false;

  if (estado.hambre < 60 && comidas.length) {
    const it = comidas[0];
    estado.inventario.splice(estado.inventario.indexOf(it), 1);
    estado.hambre = clamp(estado.hambre + (COMIDA[it].hambre || 30), 0, 100);
    estado.cordura = clamp(estado.cordura + 2, 0, 100);
    comido = true;
    narrar(`<span class="linea-bien">Te comes ${escapar(it)}. Sabes a gloria.</span>`);
  }
  if (estado.sed < 60 && bebidas.length) {
    const it = bebidas[0];
    estado.inventario.splice(estado.inventario.indexOf(it), 1);
    estado.sed = clamp(estado.sed + (BEBIDA[it].sed || 40), 0, 100);
    bebido = true;
    narrar(`<span class="linea-bien">Bebes ${escapar(it)} y el mundo vuelve a tener bordes.</span>`);
  }
  return comido || bebido;
}

/* ---------- Fuentes de agua de la arena ---------- */
const FUENTES_AGUA = {
  lago: [
    { nombre: 'Agua de arroyo', potable: true, texto: 'El arroyo baja limpio desde las rocas altas.' },
    { nombre: 'Agua del estanque', potable: false, texto: 'El estanque está quieto, verde y lleno de bichos.' },
    { nombre: 'Agua de lluvia', potable: true, texto: 'Recoges lluvia en una hoja grande, gota a gota.' },
    { nombre: 'Charca del sector', potable: false, texto: 'La charca huele mal desde aquí.' }
  ],
  reloj: [
    { nombre: 'Agua de arroyo', potable: true, texto: 'El sector del río aún corre limpio.' },
    { nombre: 'Agua turbia', potable: false, texto: 'El agua del sector de las nieblas está turbia.' },
    { nombre: 'Agua de lluvia', potable: true, texto: 'La lluvia del sector de las tormentas cae limpia.' },
    { nombre: 'Charca del sector', potable: false, texto: 'Una charca se ha quedado estancada entre las piedras.' }
  ]
};

async function buscarAgua() {
  if (!puedeActuar()) return;
  estado.esperandoEleccion = true;
  const lista = FUENTES_AGUA[estado.arena] || FUENTES_AGUA.lago;
  const fuente = elegir(lista);
  anadirObjetos([fuente.nombre]);
  estado.cansancio = clamp(estado.cansancio + 6, 0, 100);
  estado.ultimoEco = `Antes: encontraste ${fuente.nombre}.`;
  const aviso = fuente.potable
    ? '<span class="linea-bien">Se ve limpia: puedes beberla sin miedo.</span>'
    : '<span class="linea-muerte">Está turbia y huele raro: si la bebes, te juegas el estómago.</span>';
  narrar(`<span class="linea-bien">${escapar(fuente.texto)}</span> Llenas una cantimplora con <em>${escapar(fuente.nombre)}</em>. ${aviso}`);
  await cerrarTurnoLibre();
}

/* ---------- 1. Cazar ---------- */
async function cazar() {
  if (!puedeActuar()) return;
  if (estado.cazar <= 0) {
    narrar('<span class="ayuda">Ya no te quedan fuerzas para cazar. Ni para casi nada.</span>');
    return;
  }
  estado.cazar -= 1;
  estado.cansancio = clamp(estado.cansancio + 14, 0, 100);

  const suerte = clamp(0.35 + (estado.stats.supervivencia + estado.stats.agilidad) * 0.05
    + climaActual().escondite, 0.2, 0.9);

  if (Math.random() < suerte) {
    const piezas = ['Carne asada', 'Pescado ahumado', 'Bayas secas', 'Raciones'];
    const presa = elegir(piezas);
    anadirObjetos([presa]);
    estado.cordura = clamp(estado.cordura + 4, 0, 100);
    estado.ultimoEco = `Antes: cazaste y volviste con ${presa}.`;
    narrar(`<span class="linea-bien">Cazas con paciencia. Vuelves con <em>${escapar(presa)}</em> y las manos sucias. El hambre puede esperar.</span>`);
  } else {
    const h = nuevaHerida('leve');
    estado.ultimoEco = 'Antes: saliste a cazar y volviste con las manos vacías.';
    narrar(`<span class="linea-muerte">Sales a cazar y vuelves con las manos vacías: <em>${escapar(h.nombre)}</em>. La arena cobra por intentarlo.</span>`);
  }
  cerrarTurnoLibre();
}

/* ---------- 2. Trampas ---------- */
function ponerTrampa() {
  if (!puedeActuar()) return;
  if (estado.trampas >= 2) {
    narrar('<span class="ayuda">Ya tienes dos trampas colocadas. Más de eso y no podrías vigilarlas.</span>');
    return;
  }
  estado.trampas += 1;
  estado.cansancio = clamp(estado.cansancio + 8, 0, 100);
  estado.ultimoEco = 'Antes: colocaste una trampa.';
  narrar('<span class="linea-bien">Colocas una trampa con lo que llevas: cuerdas, ramas y un poco de paciencia. Ahora toca esperar.</span>');
  cerrarTurnoLibre();
}

/* Las trampas cobran su presa al final del turno */
function resolverTrampas() {
  if (!estado.trampas) return;
  if (Math.random() > 0.45) return;
  const presa = elegir(estado.tributos.filter((t) => t.vivo && !t.yo));
  estado.trampas -= 1;
  if (!presa) return;
  matarTributo(presa, 'ha caído en una de tus trampas');
  narrar(`<span class="linea-bien">La trampa ha funcionado: <em>${escapar(presa.nombre)}</em> (D${presa.distrito}) se ha quedado dentro. El cañón confirma lo que ya sabías.</span>`);
  ajustarPatrocinio(4);
  const botin = botinAleatorio('campamento');
  anadirObjetos(botin);
  narrar(`<span class="linea-bien">Recoges lo que llevaba: <em>${escapar(botin.join(', '))}</em>.</span>`);
}

/* ---------- 3. Vendarte ---------- */
async function vendarse() {
  if (!puedeActuar()) return;
  const tenia = estado.heridas.length || estado.sangrado;
  if (!tenia) {
    narrar('<span class="ayuda">No tienes nada que vendarte: el cuerpo aguanta por ahora.</span>');
    return;
  }
  estado.ultimoEco = 'Antes: te vendaste las heridas.';
  estado.sangrado = false;
  const antes = estado.heridas.length;
  estado.heridas = estado.heridas.filter((h) => h.gravedad !== 'leve');
  estado.vida = clamp(estado.vida + 8, 0, 100);
  estado.cansancio = clamp(estado.cansancio + 6, 0, 100);
  const cerradas = antes - estado.heridas.length;
  narrar(`<span class="linea-bien">Te vendas con lo que queda limpio. El sangrado se detiene${cerradas ? ` y cierras ${cerradas} herida${cerradas > 1 ? 's' : ''}` : ''}.</span>`);
  cerrarTurnoLibre();
}

/* ---------- 4. Pedir un envío ---------- */
async function pedirEnvio() {
  if (!puedeActuar()) return;
  if (estado.pedir <= 0) {
    narrar('<span class="ayuda">Ya has pedido todo lo que el Capitolio está dispuesto a mandarte en esta arena.</span>');
    return;
  }
  if (estado.patrocinio < 35) {
    narrar(`<span class="linea-muerte">Miras al cielo y pides ayuda. Nadie contesta: con ${Math.round(estado.patrocinio)} de patrocinio no eres rentable todavía.</span>`);
    return;
  }
  estado.pedir -= 1;
  estado.patrocinio = clamp(estado.patrocinio - 18, 0, 100);
  estado.cansancio = clamp(estado.cansancio + 5, 0, 100);

  const bueno = Math.random() < 0.6;
  estado.ultimoEco = bueno ? 'Antes: pediste un envío y llegó.' : 'Antes: pediste un envío y se perdió.';
  if (bueno) {
    const envio = [elegir(Object.keys(CURATIVOS)), elegir(OTROS_OBJETOS)];
    anadirObjetos(envio);
    estado.vida = clamp(estado.vida + 6, 0, 100);
    narrar(`<span class="linea-bien">Un paracaídas plateado cae entre los árboles: <em>${escapar(envio.join(' y '))}</em>. Alguien ahí arriba te quiere vivo.</span>`);
  } else {
    const h = nuevaHerida('leve');
    narrar(`<span class="linea-muerte">El paracaídas cae demasiado lejos y, al correr a por él, tropiezas: <em>${escapar(h.nombre)}</em>. Los patrocinadores se ríen en directo.</span>`);
  }
  cerrarTurnoLibre();
}

/* ---------- 5. Escuchar la arena ---------- */
async function escucharArena() {
  if (!puedeActuar()) return;
  const vivos = estado.tributos.filter((t) => t.vivo && !t.yo);
  estado.cordura = clamp(estado.cordura + 6, 0, 100);
  estado.cansancio = clamp(estado.cansancio + 4, 0, 100);

  const cerca = vivos.filter((t) => t.fuerza >= 7);
  const cl = climaActual();
  let texto = `<em>${cl.icono} ${cl.nombre}.</em> ${cl.texto} `;
  texto += vivos.length
    ? `Quedan <strong>${vivos.length}</strong> tributos vivos. `
    : 'No queda nadie más que tú. ';
  if (cerca.length) {
    const t = elegir(cerca);
    texto += `A lo lejos se oyen pasos pesados: <em>${escapar(t.nombre)}</em>, del Distrito ${t.distrito}, anda cerca. `;
    estado.objetivo = t.id;
  } else {
    texto += 'No se oye nada: o están lejos o están esperando. ';
  }
  texto += estado.trampas ? `Tus ${estado.trampas} trampa${estado.trampas > 1 ? 's' : ''} siguen armadas.` : 'No tienes trampas colocadas.';

  estado.ultimoEco = 'Antes: escuchaste la arena.';
  narrar(`<span class="linea-bien">${texto}</span>`);
  cerrarTurnoLibre();
}

function comerAlgo() {
  if (!puedeActuar()) return;
  const comidas = estado.inventario.filter((i) => COMIDA[i]);
  if (!comidas.length) {
    narrar('<span class="ayuda">No te queda nada de comer. Toca cazar.</span>');
    return;
  }
  const it = comidas[0];
  estado.inventario.splice(estado.inventario.indexOf(it), 1);
  estado.hambre = clamp(estado.hambre + (COMIDA[it].hambre || 30), 0, 100);
  estado.cordura = clamp(estado.cordura + (COMIDA[it].cordura || 2), 0, 100);
  estado.cansancio = clamp(estado.cansancio - 6, 0, 100);
  estado.ultimoEco = `Antes: comiste ${it}.`;
  narrar(`<span class="linea-bien">Te comes ${escapar(it)}. El hambre deja de doler por un rato.</span>`);
  cerrarTurnoLibre();
}

function beberAlgo() {
  if (!puedeActuar()) return;
  // Prioridad: primero el agua potable; el agua sucia queda para el final
  const bebidas = estado.inventario.filter((i) => BEBIDA[i]);
  const limpias = bebidas.filter((i) => BEBIDA[i].potable);
  if (!bebidas.length) {
    narrar('<span class="ayuda">No te queda nada de beber. Busca agua.</span>');
    return;
  }

  const it = limpias.length ? limpias[0] : bebidas[0];

  // Si solo queda agua sucia, avisa antes de arriesgarse
  if (!limpias.length) {
    narrar(`<span class="linea-muerte">Lo único que queda es <em>${escapar(it)}</em>, y no parece potable. Te lo piensas un segundo…</span>`);
  }
  const info = BEBIDA[it];
  estado.inventario.splice(estado.inventario.indexOf(it), 1);
  estado.sed = clamp(estado.sed + (info.sed || 40), 0, 100);

  if (info.potable) {
    estado.vida = clamp(estado.vida + 3, 0, 100);
    estado.ultimoEco = `Antes: bebiste de ${it}.`;
    narrar(`<span class="linea-bien">Bebes ${escapar(it)} y el mundo vuelve a tener bordes.</span>`);
    cerrarTurnoLibre();
    return;
  }

  // Agua no potable: casi siempre enfermas, muy rara vez sales limpio
  if (Math.random() < RIESGO_AGUA_SUCIA) {
    const grave = Math.random() < 0.4;
    enfermar(grave ? 'grave' : 'leve');
    estado.ultimoEco = `Antes: bebiste ${it} y te sentó mal.`;
    narrar(`<span class="linea-muerte">Bebes ${escapar(it)}. Sabe a barro. Al rato te doblas de dolor: <em>${escapar(estado.enfermo.nombre)}</em>. Perderás vida cada turno hasta que te cures.</span>`);
  } else {
    estado.ultimoEco = `Antes: bebiste ${it} y no pasó nada.`;
    narrar(`<span class="linea-bien">Bebes ${escapar(it)} con el estómago cerrado y, esta vez, no pasa nada. La suerte existe.</span>`);
  }
  cerrarTurnoLibre();
}

$('#btn-comer').addEventListener('click', comerAlgo);
$('#btn-beber').addEventListener('click', beberAlgo);
$('#btn-cazar').addEventListener('click', cazar);
$('#btn-trampa').addEventListener('click', ponerTrampa);
$('#btn-vendaje').addEventListener('click', vendarse);
$('#btn-pedir').addEventListener('click', pedirEnvio);
$('#btn-escuchar').addEventListener('click', escucharArena);
const btnAgua = document.getElementById('btn-agua');
if (btnAgua) btnAgua.addEventListener('click', buscarAgua);

/* ============================================================
   EVENTOS CON DECISIÓN
   La cornucopia se reabre a mitad de los Juegos y el Capitolio
   convoca la Fiesta: dos momentos en los que eliges tú.
   ============================================================ */

function reabrirCornucopia() {
  estado.cornucopiaAbierta = true;
  cajaOpciones.innerHTML = '';
  limpiarNarracion();
  narrar('<em>¡La cornucopia vuelve a abrirse!</em> Los Vigilantes han rellenado el centro de la arena mientras los tributos dormían. Quien llegue primero se lleva lo mejor.', 'escena-texto');

  const opciones = [
    {
      texto: 'Correr al centro y cargar con todo lo que puedas.',
      efecto: 'Botín máximo · pelea casi segura',
      aplicar: async () => {
        const ganado = await momentoDecisivo('botin', 'La cornucopia se reabre');
        if (estado.fin) return '';
        if (ganado) {
          const lote = [armaAleatoria(), ...botinAleatorio('cornucopia')];
          anadirObjetos(lote);
          ajustarPatrocinio(8);
          return `<span class="linea-bien">Llegas antes que nadie y arrasas: <em>${escapar(lote.join(', '))}</em>.</span> <span class="linea-muerte">No sales limpio: la cornucopia siempre cobra su parte.</span>`;
        }
        const h = nuevaHerida('grave');
        return `<span class="linea-muerte">Llegas tarde y con las manos vacías. <em>${escapar(h.nombre)}</em> y otro se lleva tu mochila.</span>`;
      }
    },
    {
      texto: 'Esperar en el borde y atacar al que salga cargado.',
      efecto: 'Botín ajeno · riesgo de emboscada',
      aplicar: async () => {
        const presa = elegir(estado.tributos.filter((t) => t.vivo && !t.yo));
        if (presa && Math.random() < 0.6) {
          matarTributo(presa, 'ha caído junto a la cornucopia');
          const lote = botinAleatorio('campamento');
          anadirObjetos(lote);
          ajustarPatrocinio(-2);
          return `<span class="linea-bien">Dejas que se llene la mochila y le esperas a la salida. <em>${escapar(presa.nombre)}</em> no llega al bosque. Te quedas con <em>${escapar(lote.join(', '))}</em>.</span>`;
        }
        const h = nuevaHerida('grave');
        return `<span class="linea-muerte">El que sale cargado te ve primero. <em>${escapar(h.nombre)}</em> y la cornucopia se vacía sin ti.</span>`;
      }
    },
    {
      texto: 'Quedarte escondido y dejar que se maten entre ellos.',
      efecto: 'Sin botín · información y cordura',
      aplicar: async () => {
        estado.cordura = clamp(estado.cordura + 8, 0, 100);
        const muertos = estado.tributos.filter((t) => t.vivo && !t.yo).slice(0, 2);
        muertos.forEach((t) => matarTributo(t, 'ha muerto en la cornucopia'));
        return `<span class="linea-bien">Desde tu escondite cuentas los cañones: ${muertos.length || 'ninguno'}. No ganas nada, pero sabes exactamente cuántos quedan.</span>`;
      }
    }
  ];

  opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${['A', 'B', 'C'][i]}</span>
      <span>${escapar(op.texto)}<span class="opcion__efecto">${escapar(op.efecto)}</span></span>`;
    btn.addEventListener('click', async () => {
      if (!estado.cornucopiaAbierta) return;
      estado.cornucopiaAbierta = false;
      cajaOpciones.innerHTML = '';
      const textoOp = await op.aplicar();
      narrar(textoOp);
      estado.ultimaAccion = { tipo: 'riesgo', bien: true };
      estado.turno += 1;
      actualizarHUD();
      pintarTributosHUD();
      pintarMapa();
      await dormir(500);
      if (estado.vida <= 0) { terminarArena('muerto'); return; }
      const vivos = estado.tributos.filter((t) => t.vivo);
      if (vivos.length <= 1 || (vivos.length === 2 && mismoDistrito(vivos))) {
        terminarArena(vivos.length === 2 ? 'empate-distrito' : 'victoria');
        return;
      }
      await ofrecerEscenaSiguiente();
    });
    cajaOpciones.appendChild(btn);
  });
}

function fiestaCapitolio() {
  estado.fiestaAbierta = true;
  cajaOpciones.innerHTML = '';
  limpiarNarracion();
  narrar('<em>El Capitolio convoca la Fiesta.</em> Durante una hora, los patrocinadores pueden enviar lo que quieran a quien quieran. Las cámaras buscan a alguien que dé espectáculo.', 'escena-texto');

  const opciones = [
    {
      texto: 'Dar un discurso al cielo agradeciendo a tus patrocinadores.',
      efecto: 'Patrocinadores ↑↑ · cordura ↓',
      aplicar: async () => {
        const inspirado = await momentoDecisivo('ingenio', 'El discurso de tu vida');
        if (estado.fin) return '';
        if (!inspirado) {
          ajustarPatrocinio(-6);
          estado.cordura = clamp(estado.cordura - 8, 0, 100);
          return '<span class="linea-muerte">Te trabas en mitad de la frase y el Capitolio cambia de cámara. Silencio incómodo.</span>';
        }
        ajustarPatrocinio(22);
        estado.cordura = clamp(estado.cordura - 8, 0, 100);
        const envio = [elegir(Object.keys(CURATIVOS)), armaAleatoria()];
        anadirObjetos(envio);
        return `<span class="linea-bien">Hablas mirando a las cámaras y el Capitolio se derrite. Caen envíos: <em>${escapar(envio.join(' y '))}</em>.</span>`;
      }
    },
    {
      texto: 'Cantar con los otros tributos una canción del Distrito 11.',
      efecto: 'Patrocinadores ↑ · fama de querido',
      aplicar: async () => {
        ajustarPatrocinio(14);
        estado.imagen = 'querido';
        estado.cordura = clamp(estado.cordura + 10, 0, 100);
        anadirObjetos([elegir(OTROS_OBJETOS), elegir(OTROS_OBJETOS)]);
        return '<span class="linea-bien">Cantáis todos juntos y el Capitolio no sabe si aplaudir o cortar la señal. Te dan provisiones y, por un rato, te dan la razón.</span>';
      }
    },
    {
      texto: 'Ignorar la Fiesta y moverte en silencio.',
      efecto: 'Sin envíos · posición ventajosa',
      aplicar: async () => {
        estado.ultimaAccion = { tipo: 'sigilo', bien: true };
        const botin = botinAleatorio('sigilo');
        anadirObjetos(botin);
        return `<span class="linea-bien">Mientras todos miran al cielo, tú te mueves. Encuentras <em>${escapar(botin.join(', '))}</em> y una posición que nadie ha visto.</span>`;
      }
    }
  ];

  opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${['A', 'B', 'C'][i]}</span>
      <span>${escapar(op.texto)}<span class="opcion__efecto">${escapar(op.efecto)}</span></span>`;
    btn.addEventListener('click', async () => {
      if (!estado.fiestaAbierta) return;
      estado.fiestaAbierta = false;
      cajaOpciones.innerHTML = '';
      const textoOp = await op.aplicar();
      narrar(textoOp);
      estado.turno += 1;
      actualizarHUD();
      pintarTributosHUD();
      pintarMapa();
      await dormir(500);
      await ofrecerEscenaSiguiente();
    });
    cajaOpciones.appendChild(btn);
  });
}

/* ---------- Objetos curativos ---------- */

/* ---------- Objetos de equipo ---------- */

function objetosDeEquipoDisponibles() {
  return estado.inventario.filter((i) => OTROS[i] && (OTROS[i].vida || OTROS[i].cansancio || OTROS[i].cordura || COMIDA[i] || BEBIDA[i]));
}

function usarObjetoEquipo() {
  if (estado.fin) return;
  const disponibles = objetosDeEquipoDisponibles();
  if (!disponibles.length) {
    narrar('No llevas nada que te devuelva fuerzas: solo armas y curativos.');
    return;
  }
  const nombre = disponibles[0];
  const info = OTROS[nombre];
  estado.inventario = estado.inventario.filter((i) => i !== nombre);
  if (info.vida) estado.vida = clamp(estado.vida + info.vida, 0, 100);
  if (info.cansancio) estado.cansancio = clamp(estado.cansancio + info.cansancio, 0, 100);
  if (info.cordura) estado.cordura = clamp(estado.cordura + info.cordura, 0, 100);
  if (COMIDA[nombre]) estado.hambre = clamp(estado.hambre + (COMIDA[nombre].hambre || 30), 0, 100);
  if (BEBIDA[nombre]) estado.sed = clamp(estado.sed + (BEBIDA[nombre].sed || 40), 0, 100);
  narrar(`<span class="linea-bien">${escapar(info.texto)} <em>(${escapar(nombre)})</em></span>`);
  actualizarHUD();
}

function curativosDisponibles() {
  return estado.inventario.filter((i) => CURATIVOS[i]);
}

function usarCurativo() {
  if (estado.fin) return;
  const nombre = curativosDisponibles()[0];
  if (!nombre) return;
  const valeLaPena = estado.vida < 96 || estado.sangrado || estado.cordura < 70 || estado.cansancio > 40;
  if (!valeLaPena) {
    narrar('<span class="ayuda">No necesitas curarte ahora: guardas los objetos para cuando de verdad hagan falta.</span>');
    return;
  }
  const info = CURATIVOS[nombre];
  const antes = estado.vida;
  estado.vida = clamp(estado.vida + info.cura, 0, 100);
  estado.cordura = clamp(estado.cordura + (info.cordura || 0), 0, 100);
  if (info.cansancio) {
    estado.cansancio = clamp(estado.cansancio + info.cansancio, 0, 100);
    narrar('<span class="linea-bien">La bebida te devuelve el aliento: el cansancio baja.</span>');
  }
  if (BEBIDA[nombre]) estado.sed = clamp(estado.sed + (BEBIDA[nombre].sed || 20), 0, 100);
  if (COMIDA[nombre]) estado.hambre = clamp(estado.hambre + (COMIDA[nombre].hambre || 20), 0, 100);
  if (estado.vida >= 60 && Math.random() < 0.5) estado.sangrado = false;
  if (info.cura >= 26 && Math.random() < 0.6) {
    const idx = estado.heridas.findIndex((h) => h.gravedad === 'grave');
    if (idx >= 0) {
      narrar(`<span class="linea-bien">Cierras «${estado.heridas[idx].nombre}» con lo que te queda.</span>`);
      estado.heridas.splice(idx, 1);
    }
  }

  estado.inventario.splice(estado.inventario.indexOf(nombre), 1);
  narrar(`<span class="linea-bien">${info.texto} Recuperas ${Math.round(estado.vida - antes)} de vida.</span>`);
  actualizarHUD();
}

$('#btn-cura').addEventListener('click', usarCurativo);
$('#btn-objeto').addEventListener('click', usarObjetoEquipo);

async function elegirOpcion(op) {
  if (estado.fin || estado.esperandoEleccion) return;
  estado.esperandoEleccion = true;
  cajaOpciones.innerHTML = '<p class="ayuda">La arena decide…</p>';
  await dormir(320);

  const rol = ROLES[estado.rol];
  const sesgo = rol.sesgo[op.tipo] || 0;
  const statClave = { atacar: 'combate', huir: 'agilidad', ayudar: 'supervivencia', alianza: 'inteligencia', sigilo: 'agilidad', riesgo: 'resistencia' }[op.tipo] || 'supervivencia';
  const stat = estado.stats[statClave] || 5;

  // Cansancio y cordura alteran la puntería de cada decisión
  const penalCansancio = (estado.cansancio / 100) * 0.22;
  const penalCordura = ((100 - estado.cordura) / 100) * 0.18;
  const exito = clamp(0.30 + stat * 0.045 + sesgo * 0.035 + (Math.random() * 0.3 - 0.15) - penalCansancio - penalCordura, 0.05, 0.95);
  let saleBien = Math.random() < exito;

  if (!saleBien) probabilidadMuerte();

  const resultado = resolverOpcion(op, saleBien, ultimoResultado);
  estado.historial.push({ tipo: op.tipo, texto: op.texto, bien: saleBien });
  estado.turno += 1;
  estado.ultimaAccion = { tipo: op.tipo, bien: saleBien };

  narrar(resultado.html, resultado.clase || '');
  ajustarPatrocinio(resultado.patrocinio || 0);
  gastarResistencia(op.tipo, saleBien);

  // Decisión decisiva: si con tu acción te juegas el último puesto, se juega el minijuego
  // Duelo de fuerza contra el tributo más fuerte si te la juegas atacándole
  const rivalFuerte = estado.tributos.filter((t) => t.vivo && !t.yo).sort((a, b) => b.fuerza - a.fuerza)[0];
  if (op.tipo === 'atacar' && rivalFuerte && rivalFuerte.fuerza >= 9 && !estado.dueloHecho && vivosRestantes() > 2) {
    estado.dueloHecho = true;
    const ganado = await momentoDecisivo('duelo', 'Pulseada con el más fuerte');
    if (estado.fin) { estado.esperandoEleccion = false; return; }
    if (ganado) {
      matarTributo(rivalFuerte, 'tras una pulseada que nadie esperaba');
      narrar(`<span class="linea-bien">Le agarras la muñeca y no la sueltas. <em>${escapar(rivalFuerte.nombre)}</em> cae, y la arena entera lo ha visto.</span>`);
      ajustarPatrocinio(8);
    } else {
      const h = nuevaHerida('grave');
      narrar(`<span class="linea-muerte">Te dobla el brazo y te tira al suelo: <em>${escapar(h.nombre)}</em>.</span>`);
    }
  }

  if (op.tipo === 'atacar' && vivosRestantes() === 2 && !estado.minijuegoFinalHecho) {
    estado.minijuegoFinalHecho = true;
    const ganado = await momentoDecisivo('combate', 'El último combate');
    if (estado.fin) { estado.esperandoEleccion = false; return; }
    if (ganado) {
      const rival = estado.tributos.find((t) => t.vivo && !t.yo);
      if (rival) {
        matarTributo(rival, 'en el combate final');
        narrar(`<span class="linea-bien">Era el último y lo has sabido antes que él. <em>${escapar(rival.nombre)}</em> cae y la arena se queda en silencio.</span>`);
      }
    } else {
      const h = nuevaHerida('grave');
      narrar(`<span class="linea-muerte">El último combate no sale como querías: <em>${escapar(h.nombre)}</em>. Sigues vivo, pero no solo.</span>`);
    }
  }

  // Si el golpe o el cansancio te han dejado a cero, la arena te cobra el turno
  if (estado.vida <= 0 && !estado.fin) {
    if (!estado.causaMuerte) estado.causaMuerte = 'Una mala decisión en el peor momento de la arena.';
    narrar('<span class="linea-muerte">Te faltan fuerzas. Caes de rodillas y el mundo se apaga.</span>');
    await dormir(600);
    terminarArena('muerto');
    return;
  }

  // Acontecimiento de la arena (cada 2 horas). Primero se ofrece la siguiente escena
  // y solo después llega el acontecimiento, para que nunca se quede la pantalla vacía.
  const tocaAcontecimiento = estado.turno >= estado.proximoAcontecimiento && !estado.fin;
  if (tocaAcontecimiento) estado.proximoAcontecimiento += 1;

  cambiarClima();
  gastarHambreSed(estado.cansancio > 70 ? 2 : 1);
  procesarEnfermedad();
  resolverTrampas();

  actualizarHUD();
  pintarTributosHUD();
  pintarMapa();
  actualizarRelojMapa();
  procesarHeridas();

  if (estado.vida <= 0) {
    estado.vivo = false;
    if (!estado.causaMuerte) estado.causaMuerte = 'Las heridas acumuladas de la arena.';
    narrar('<span class="linea-muerte">Te faltan fuerzas. Caes de rodillas y el mundo se apaga.</span>');
    await dormir(600);
    terminarArena('muerto');
    return;
  }

  muertesAmbiente();

  if (!estado.tributos.find((t) => t.yo).vivo) { terminarArena('muerto'); return; }

  const vivos = estado.tributos.filter((t) => t.vivo);
  if (vivos.length <= 1 || (vivos.length === 2 && mismoDistrito(vivos))) {
    terminarArena(vivos.length === 2 ? 'empate-distrito' : 'victoria');
    return;
  }

  // Eventos que llegan a mitad de los Juegos
  if (!estado.cornucopiaAbierta && !estado.fiestaAbierta) {
    if (!estado.cornucopiaAbierta && estado.turno >= estado.cornucopiaTurno) {
      reabrirCornucopia();
      return;
    }
    if (estado.turno >= estado.fiestaTurno) {
      fiestaCapitolio();
      return;
    }
  }

  await dormir(360);
  await ofrecerEscenaSiguiente();

  // Después de la escena, el acontecimiento de la arena (con su minijuego).
  // No se espera: si no, la pantalla se queda sin poder elegir mientras corre.
  if (tocaAcontecimiento && !estado.fin && !estado.cornucopiaAbierta && !estado.fiestaAbierta) {
    dormir(420).then(() => lanzarAcontecimiento());
  }
}

/* Cansancio y cordura según lo que hagas */
function gastarResistencia(tipo, bien) {
  const coste = { atacar: 15, huir: 10, ayudar: 9, alianza: 5, sigilo: 6, riesgo: 12 }[tipo] || 8;
  const aguante = 1 - (estado.stats.resistencia - 5) * 0.05;
  estado.cansancio = clamp(estado.cansancio + coste * aguante, 0, 100);

  const miedo = { atacar: 6, huir: 3, ayudar: 4, alianza: -4, sigilo: 2, riesgo: 5 }[tipo] || 3;
  estado.cordura = clamp(estado.cordura - (bien ? miedo * 0.6 : miedo), 0, 100);

  if (estado.cansancio >= 85) {
    estado.vida = clamp(estado.vida - 4, 0, 100);
    estado.cordura = clamp(estado.cordura - 3, 0, 100);
    narrar(`<span class="linea-muerte">${escapar(variar([
      'El cansancio te pesa en los huesos: pierdes 4 de vida y el pulso se te dispara.',
      'Las piernas te fallan y te golpeas la cabeza contra una raíz. Pierdes 4 de vida.',
      'Llevas demasiado tiempo en pie: la vista se te nubla y pierdes 4 de vida.',
      'El cuerpo te pasa factura: 4 de vida menos y el aire no llega.'
    ]))}</span>`);
  }
  if (estado.cordura <= 25 && Math.random() < 0.4) {
    const h = nuevaHerida('leve');
    narrar(`<span class="linea-muerte">Los nervios te traicionan y te mueves mal. ${h.nombre}.</span>`);
  }
}

/* En la arena, un error puede ser el último: la muerte siempre ronda */
/* Elige un texto distinto cada vez (recuerda los últimos usados) */
const usadosTexto = new Set();
function variar(lista) {
  const libres = lista.filter((t) => !usadosTexto.has(t));
  const texto = elegir(libres.length ? libres : lista);
  usadosTexto.add(texto);
  if (usadosTexto.size > 60) usadosTexto.clear();
  return texto;
}

function probabilidadMuerte() {
  const riesgo = (0.03 + (estado.heridas.length * 0.015) + (estado.sangrado ? 0.06 : 0) + (estado.vida < 35 ? 0.1 : 0))
    * (ARENAS[estado.arena].multiplicador);
  if (Math.random() < riesgo) {
    estado.vida = 0;
    estado.causaMuerte = 'Una decisión que salió mal en pleno combate.';
    narrar('<span class="linea-muerte">La arena no te da una segunda oportunidad. El cañón truena.</span>');
  }
}

function mismoDistrito(arr) {
  return arr[0].distrito === arr[1].distrito;
}

/* ---------- Resolución de la opción ---------- */

const HERIDAS = {
  leve: ['Corte en el antebrazo', 'Arañazo profundo en la mejilla', 'Esguince de tobillo', 'Costillas magulladas', 'Corte en la mano'],
  grave: ['Herida abierta en el costado', 'Corte profundo en el muslo', 'Fractura de clavícula', 'Hombro dislocado'],
  critica: ['Desangramiento activo', 'Fractura de fémur', 'Costillas rotas con hemorragia interna', 'Mano amputada']
};

function nuevaHerida(gravedad) {
  const usadas = estado.heridas.map((h) => h.nombre);
  const libres = HERIDAS[gravedad].filter((h) => !usadas.includes(h));
  const h = libres.length ? elegir(libres) : `${elegir(HERIDAS[gravedad])} (agravada)`;
  estado.heridas.push({ nombre: h, gravedad });
  const daño = { leve: 6, grave: 12, critica: 20 }[gravedad];
  estado.vida = clamp(estado.vida - daño, 0, 100);
  if (gravedad !== 'leve' && Math.random() < 0.5) estado.sangrado = true;
  if (estado.vida <= 0 && !estado.causaMuerte) estado.causaMuerte = `Las heridas: «${h}» fue demasiado.`;
  return { nombre: h, daño };
}

/* Cada turno: el sangrado resta vida; con patrocinadores altos se estabiliza */
function procesarHeridas() {
  // Las heridas leves se cierran solas con el tiempo
  if (estado.heridas.some((h) => h.gravedad === 'leve') && Math.random() < 0.45) {
    estado.heridas = estado.heridas.filter((h) => h.gravedad !== 'leve');
  }
  if (!estado.sangrado) return;
  if (estado.patrocinio >= 45 && Math.random() < 0.5) {
    estado.sangrado = false;
    estado.vida = clamp(estado.vida + 6, 0, 100);
    narrar('<span class="linea-bien">Un envío de patrocinador: vendas limpias. El sangrado se detiene.</span>');
    return;
  }
  const perdida = 5;
  estado.vida = clamp(estado.vida - perdida, 0, 100);
  if (estado.vida <= 0) estado.causaMuerte = 'Desangramiento: te vaciaste entre los árboles sin que nadie te vendara.';
  narrar(`<span class="linea-muerte">El sangrado no cesa: pierdes ${perdida} puntos de vida.</span>`);
}

function resolverOpcion(op, saleBien, textoAnterior) {
  let html = '';
  estado.ultimoEco = '';
  let clase = '';
  let patrocinio = 0;
  const repetido = (t) => t && textoAnterior && t === textoAnterior;
  const yo = estado.yo;

  // El texto cuenta lo que de verdad hiciste, no una plantilla genérica
  // (se cita en minúsculas para que no grite en medio de la narración)
  const textoOpcion = escapar(op.texto.replace(/\.$/, '').toLowerCase());

  switch (op.tipo) {
    case 'riesgo': {
      if (saleBien) {
        const lote = botinAleatorio(estado.arena === 'reloj' ? 'cornucopia' : 'mochila');
        anadirObjetos(lote);
        html = `«${textoOpcion}»: funciona. Vuelves con las manos llenas. <em>${escapar(lote.join(', '))}</em>. El corazón te golpea las costillas, pero sonríes.`;
        patrocinio = 4;
      } else {
        const h = nuevaHerida('grave');
        html = `«${textoOpcion}»: la arena no te lo perdona. Al girarte, un tributo te alcanza. <em>${h.nombre}</em>. Aprietas los dientes y escapas cojeando.`;
        clase = 'linea-muerte';
        patrocinio = -2;
      }
      break;
    }
    case 'atacar': {
      const victima = elegir(estado.tributos.filter((t) => t.vivo && !t.yo && t.fuerza <= (estado.stats.combate + 3)));
      if (saleBien) {
        if (victima) { matarTributo(victima, 'a tus manos'); }
        if (Math.random() < 0.45) {
          const h = nuevaHerida('leve');
          html = `«${textoOpcion}»: golpeas rápido y certero${victima ? `, ${escapar(victima.nombre)} cae` : ''}. Aun así, <em>${h.nombre}</em>. La arena te ha visto ganar.`;
        } else {
          html = `«${textoOpcion}»: golpeas rápido y certero${victima ? `, ${escapar(victima.nombre)} cae` : ''}. Limpias el arma con la manga y levantas la vista. Nadie te ha visto dudar.`;
        }
        patrocinio = victima ? -3 : 1;
        if (Math.random() < 0.35) {
          const botinArma = [armaAleatoria(), elegir(OTROS_OBJETOS)];
          anadirObjetos(botinArma);
          html += ` <em>Recoges ${escapar(botinArma.join(' y '))} antes de que llegue nadie.</em>`;
        }
      } else {
        const h = nuevaHerida('critica');
        html = `«${textoOpcion}»: fallas el primer golpe. <em>${h.nombre}</em> y te arrastras hasta los arbustos. El cañón no suena para ti. Todavía.`;
        clase = 'linea-muerte';
        patrocinio = -4;
      }
      break;
    }
    case 'huir': {
      if (saleBien) {
        html = `«${textoOpcion}»: el bosque te traga y nadie te sigue. A veces sobrevivir es solo no estar donde te buscan.`;
        patrocinio = -1;
      } else {
        const h = nuevaHerida('leve');
        html = `«${textoOpcion}»: no sale como querías. <em>${h.nombre}</em>. Pero estás vivo, y en esta arena eso cuenta.`;
        clase = 'linea-muerte';
      }
      break;
    }
    case 'ayudar': {
      if (saleBien) {
        const botinAyuda = [elegir(Object.keys(CURATIVOS)), elegir(OTROS_OBJETOS)];
        anadirObjetos(botinAyuda);
        html = `«${textoOpcion}». Cuando se va, deja una palabra —«te lo debo»— y algo en el suelo: <em>${escapar(botinAyuda.join(' y '))}</em>. <em>Los patrocinadores aplauden desde el Capitolio.</em>`;
        patrocinio = 12;
        clase = 'linea-bien';
      } else {
        const h = nuevaHerida('grave');
        html = `«${textoOpcion}». Era una trampa: un segundo tributo te esperaba detrás. <em>${h.nombre}</em>. La bondad en la arena tiene precio.`;
        clase = 'linea-muerte';
        patrocinio = 2;
      }
      break;
    }
    case 'alianza': {
      const candidato = elegir(estado.tributos.filter((t) => t.vivo && !t.yo && !estado.alianza.includes(t.id)));
      if (candidato && saleBien) {
        estado.alianza.push(candidato.id);
        candidato.alianza.push(yo.id);
        html = `«${textoOpcion}». Cierras el trato con <em>${escapar(candidato.nombre)}</em>, del Distrito ${candidato.distrito}. Dos sombras valen más que una.`;
        patrocinio = 6;
        clase = 'linea-bien';
      } else if (candidato) {
        estado.vida = clamp(estado.vida - 14, 0, 100);
        html = `«${textoOpcion}». <em>${escapar(candidato.nombre)}</em> te clava la mano en el costado. Te salvas de milagro. No todos los pactos son pactos.`;
        clase = 'linea-muerte';
        patrocinio = -2;
      } else {
        html = 'No queda nadie con quien pactar. El bosque está en silencio y ese silencio es la respuesta.';
      }
      break;
    }
    case 'sigilo': {
      if (saleBien) {
        const botinSigilo = botinAleatorio('sigilo');
        anadirObjetos(botinSigilo);
        html = `«${textoOpcion}». Te mueves sin una rama rota y consigues <em>${escapar(botinSigilo.join(', '))}</em> sin que nadie se entere de que estabas allí.`;
        estado.cansancio = clamp(estado.cansancio - 10, 0, 100);
        patrocinio = 3;
      } else {
        const h = nuevaHerida('leve');
        html = `«${textoOpcion}». Una rama cruje bajo tu pie: <em>${h.nombre}</em> antes de que puedas desaparecer del todo.`;
        clase = 'linea-muerte';
        patrocinio = -1;
      }
      break;
    }
  }

  // Rol: la Gula devora reservas, la Pereza pierde tiempo, etc.
  if (estado.rol === 'gula' && estado.inventario.includes('Raciones') && Math.random() < 0.5) {
    estado.inventario = estado.inventario.filter((i) => i !== 'Raciones');
    html += ' <em>El hambre puede contigo: te comes las raciones de una sentada.</em>';
    estado.cansancio = clamp(estado.cansancio - 12, 0, 100);
  }
  if (estado.rol === 'pereza' && Math.random() < 0.3) {
    html += ' <em>Te sientas a descansar más de la cuenta. Se te escapa una hora entera.</em>';
  }
  if (estado.rol === 'ira' && Math.random() < 0.3) {
    html += ' <em>La rabia te nubla: golpeas el tronco hasta romperte los nudillos.</em>';
    estado.vida = clamp(estado.vida - 5, 0, 100);
    estado.cordura = clamp(estado.cordura + 4, 0, 100);
  }
  if (estado.rol === 'envidia' && Math.random() < 0.25) {
    const aliado = estado.alianza.length ? elegir(estado.alianza) : null;
    if (aliado !== null) {
      const t = estado.tributos.find((x) => x.id === aliado);
      if (t && t.vivo) {
        html += ` <em>No soportas que ${t.nombre} vaya mejor que tú. Le robas parte de su equipo en la noche.</em>`;
        patrocinio -= 3;
      }
    }
  }

  // Aliados pueden morir en la escena
  if (estado.alianza.length && op.tipo !== 'alianza' && op.tipo !== 'ayudar' && Math.random() < 0.25) {
    const idAliado = elegir(estado.alianza);
    const t = estado.tributos.find((x) => x.id === idAliado);
    if (t && t.vivo) {
      matarTributo(t, 'en la refriega');
      estado.alianza = estado.alianza.filter((x) => x !== t.id);
      const quedan = estado.alianza
        .map((id) => estado.tributos.find((x) => x.id === id))
        .filter((x) => x && x.vivo).length;
      html += ` <span class="linea-muerte">${t.nombre} ha caído. ${quedan ? 'Tu alianza se reduce.' : 'Estás solo otra vez.'}</span>`;
      estado.cordura = clamp(estado.cordura - 8, 0, 100);
    }
  }

  if (repetido(html.replace(/<[^>]+>/g, ''))) {
    html = 'El bosque se repite: otra vez la misma trampa, otra vez el mismo silencio. <em>La arena te está gastando.</em> ' + html;
  }
  ultimoResultado = html.replace(/<[^>]+>/g, '');

  // Eco breve: la siguiente escena arranca recordando lo que acabas de hacer
  estado.ultimoEco = `Antes: «${op.texto}» → ${saleBien ? 'salió bien' : 'salió mal'}.`;

  return { html, clase, patrocinio };
}

let ultimoResultado = '';

/* ---------- Tributos ---------- */

function matarTributo(t, causa) {
  if (!t.vivo) return;
  t.vivo = false;
  t.vida = 0;
  t.causa = causa;
  estado.totalMuertes += 1;
  t.alianza.forEach((id) => {
    const otro = estado.tributos.find((x) => x.id === id);
    if (otro) otro.alianza = otro.alianza.filter((x) => x !== t.id);
  });
  estado.alianza = estado.alianza.filter((x) => x !== t.id);
  anadirRegistro(`${t.nombre} (D${t.distrito}) ${causa}.`);
}

function muertesAmbiente() {
  const vivos = estado.tributos.filter((t) => t.vivo && !t.yo);
  if (!vivos.length) return;
  const base = estado.arena === 'reloj' ? 0.55 : 0.45;
  if (Math.random() < base) {
    const t = elegir(vivos);
    const causas = ['ha caído por la niebla', 'ha sido alcanzado por las avispas', 'ha muerto en una emboscada',
      'se ha desangrado entre los árboles', 'ha caído al agua', 'ha muerto aplastado por un muto'];
    matarTributo(t, elegir(causas));
    narrar(`<span class="linea-muerte">Cañón. ${t.nombre}, del Distrito ${t.distrito}, ha muerto.</span>`);
    estado.cordura = clamp(estado.cordura - 2, 0, 100);
  }
}

function anadirRegistro(texto) {
  const ul = $('#registro-caidos');
  if (!ul) return;
  const vacio = ul.querySelector('.vacio');
  if (vacio) vacio.remove();
  const li = document.createElement('li');
  li.textContent = texto;
  ul.prepend(li);
  while (ul.childElementCount > 30) ul.lastElementChild.remove();
}

/* ---------- Inventario y patrocinadores ---------- */

function anadirObjetos(lista) {
  lista.forEach((obj) => {
    const veces = estado.inventario.filter((i) => i === obj).length;
    if (veces < 2) estado.inventario.push(obj);
  });
}

function ajustarPatrocinio(delta) {
  if (!delta) return;
  const factor = 0.7 + (estado.stats.patrocinadores || 5) * 0.06;
  estado.patrocinio = clamp(estado.patrocinio + delta * factor, 0, 100);
  if (delta >= 8) {
    narrar('<span class="linea-bien">Un paracaídas plateado cae a tu lado: un patrocinador te envía ayuda.</span>');
    if (estado.patrocinio > 50) {
      estado.vida = clamp(estado.vida + 12, 0, 100);
      anadirObjetos([elegir(Object.keys(CURATIVOS))]);
    }
  }
}

/* ---------- Acontecimientos de la arena ---------- */

async function lanzarAcontecimiento() {
  if (estado.fin) return;
  estado.acontecimientoPendiente = false;
  const arena = ARENAS[estado.arena];
  const ids = arena.eventos;
  // Nunca el mismo dos veces seguidas: se elige entre los que no acaban de pasar
  const candidatos = ids.filter((x) => x !== estado.ultimoEvento);
  const idEvento = elegir(candidatos.length ? candidatos : ids);
  let ac = ACONTECIMIENTOS.find((a) => a.id === idEvento) || ACONTECIMIENTOS[0];
  if (estado.ultimoEvento && ac.id === estado.ultimoEvento) {
    const otros = ACONTECIMIENTOS.filter((a) => a.id !== estado.ultimoEvento);
    if (otros.length) ac = elegir(otros);
  }
  estado.ultimoEvento = ac.id;

  estado.sector = (estado.sector % 12) + 1;
  estado.hora = (estado.hora + 2) % 24;

  const caja = $('#caja-acontecimiento');
  caja.hidden = false;
  $('#ac-icono').textContent = ac.icono;
  $('#ac-titulo').textContent = `${horaLegible(estado.hora)} · ${ac.titulo}`;
  $('#ac-texto').textContent = ac.texto;

  actualizarRelojMapa();
  actualizarHUD();
  const giro = estado.arena === 'reloj' ? ` El reloj gira al sector ${estado.sector}.` : '';
  // El aviso ya está en el panel del acontecimiento; aquí solo se narra lo que te pasa
  $('#ac-texto').textContent = ac.texto + giro;

  const daño = ({ niebla: 16, avispas: 12, bestias: 18, terremoto: 15, inundacion: 14, tormenta: 11, sangre: 6 }[ac.id] || 10)
    * arena.multiplicador;
  let esquiva = clamp(0.4 + (estado.stats.agilidad + estado.stats.supervivencia) * 0.035, 0.2, 0.9);

  // Minijuego del acontecimiento: el resultado manda sobre la suerte
  const mjEvento = {
    niebla: 'niebla', avispas: 'avispas', bestias: 'bestias',
    terremoto: 'terremoto', inundacion: 'inundacion',
    tormenta: 'tormenta', sangre: 'sangre'
  }[ac.id];
  let resultadoMinijuego = null;
  if (mjEvento && !estado.fin) {
    resultadoMinijuego = await jugarMinijuego(mjEvento);
    if (estado.fin) return;
  }

  if (resultadoMinijuego === true || (resultadoMinijuego === null && Math.random() < esquiva)) {
    const conCuerda = gastarObjetoDe('huida');
    const frase = conCuerda
      ? 'Reaccionas a tiempo y encuentras refugio. ' + conCuerda
      : elegir([
        'Reaccionas a tiempo y encuentras refugio. Solo te llevas el susto.',
        'Te tiras al suelo y dejas pasar el peligro. Cuentas hasta diez antes de levantarte.',
        'Encuentras una grieta entre las rocas y te metes de cabeza. Sale el sol y sigues vivo.',
        'Corres en la dirección correcta, que en esta arena no es poco. El peligro se queda atrás.',
        'Te cubres como puedes. Cuando abres los ojos, la arena ha cambiado de sitio.'
      ]);
    narrar(`<span class="linea-bien">${escapar(frase)}</span>`);
    ajustarPatrocinio(3);
  } else {
    const gravedad = daño > 14 ? 'critica' : 'grave';
    const h = nuevaHerida(gravedad);
    if (estado.vida <= 0) estado.causaMuerte = `${ac.titulo}: la arena te alcanzó sin refugio.`;
    narrar(`<span class="linea-muerte">No llegas a cubierto. ${h.nombre}. Pierdes ${h.daño} puntos de vida.</span>`);
    estado.cordura = clamp(estado.cordura - 8, 0, 100);
    ajustarPatrocinio(1);
  }

  estado.cansancio = clamp(estado.cansancio + 10, 0, 100);

  // Los mutos y catástrofes también matan a otros
  const cuantos = ac.id === 'bestias' || ac.id === 'terremoto' ? 2 : 1;
  for (let i = 0; i < cuantos; i++) {
    if (Math.random() < 0.6) {
      const t = elegir(estado.tributos.filter((x) => x.vivo && !x.yo));
      if (t) {
        matarTributo(t, `ha caído por ${ac.titulo.toLowerCase()}`);
        narrar(`<span class="linea-muerte">Cañón. ${t.nombre}, del Distrito ${t.distrito}, no ha sobrevivido a ${ac.titulo.toLowerCase()}.</span>`);
      }
    }
  }

  actualizarRelojMapa();
  actualizarHUD();
}

/* ---------- HUD ---------- */

function actualizarHUD() {
  const yo = estado.yo;
  if (!yo) return;
  $('#hud-avatar').textContent = estado.nombre.charAt(0).toUpperCase();
  $('#hud-nombre').textContent = estado.nombre;
  $('#hud-distrito').textContent = `Distrito ${yo.distrito} · ${ROLES[estado.rol].nombre} · Ed. ${estado.edicion}`;
  $('#hud-hora').textContent = horaLegible(estado.hora);
  $('#hud-sector').textContent = estado.arena === 'reloj' ? `Sector ${estado.sector}` : ARENAS[estado.arena].nombre;

  $('#val-vida').textContent = Math.round(estado.vida);
  $('#barra-vida').style.width = `${clamp(estado.vida, 0, 100)}%`;

  $('#val-pat').textContent = Math.round(estado.patrocinio);
  $('#barra-pat').style.width = `${clamp(estado.patrocinio, 0, 100)}%`;

  $('#val-cans').textContent = Math.round(estado.cansancio);
  $('#barra-cans').style.width = `${clamp(estado.cansancio, 0, 100)}%`;

  $('#val-cord').textContent = Math.round(estado.cordura);
  $('#barra-cord').style.width = `${clamp(estado.cordura, 0, 100)}%`;

  const valH = $('#val-hambre');
  if (valH) {
    valH.textContent = Math.round(estado.hambre);
    $('#barra-hambre').style.width = `${clamp(estado.hambre, 0, 100)}%`;
    $('#val-sed').textContent = Math.round(estado.sed);
    $('#barra-sed').style.width = `${clamp(estado.sed, 0, 100)}%`;

    const comidas = estado.inventario.filter((i) => COMIDA[i]);
    const todasBebidas = estado.inventario.filter((i) => BEBIDA[i]);
    const bebidas = todasBebidas.filter((i) => BEBIDA[i].potable).concat(todasBebidas.filter((i) => !BEBIDA[i].potable));
    const bComer = $('#btn-comer');
    const bBeber = $('#btn-beber');
    bComer.disabled = !comidas.length || estado.fin;
    bComer.title = comidas.length ? `Comer ${comidas[0]}` : 'No llevas nada de comer';
    $('#txt-comer').textContent = comidas.length ? comidas[0] : 'Comer';
    bBeber.disabled = !bebidas.length || estado.fin;
    if (bebidas.length) {
      const limpia = BEBIDA[bebidas[0]].potable;
      bBeber.title = limpia ? `Beber ${bebidas[0]} (potable)`
        : `Beber ${bebidas[0]} — NO es potable: hay muchas probabilidades de enfermar`;
      $('#txt-beber').textContent = limpia ? bebidas[0] : `${bebidas[0]} ⚠`;
    } else {
      bBeber.title = 'No llevas nada de beber';
      $('#txt-beber').textContent = 'Beber';
    }
  }

  // Acciones propias de la arena
  const setTxt = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  setTxt('#info-cazar', estado.cazar);
  setTxt('#info-trampa', estado.trampas);
  setTxt('#info-pedir', estado.pedir);
  const cl = climaActual();
  setTxt('#hud-clima', `${cl.icono} ${cl.nombre}`);
  const activas = !estado.fin && !estado.esperandoEleccion && !estado.bloqueoCombate;
  ['#btn-cazar', '#btn-trampa', '#btn-vendaje', '#btn-pedir', '#btn-escuchar', '#btn-agua'].forEach((id) => {
    const b = $(id);
    if (b) b.disabled = !activas || (id === '#btn-cazar' && estado.cazar <= 0) || (id === '#btn-pedir' && estado.pedir <= 0);
  });

  // Botón de curación junto a la vida
  const curas = curativosDisponibles();
  const btnCura = $('#btn-cura');
  btnCura.disabled = curas.length === 0 || estado.fin;
  btnCura.title = curas.length ? `Usar ${curas[0]}` : 'No llevas objetos curativos';
  $('#txt-cura').textContent = curas.length ? `${curas[0]}` : 'Curar';

  // Botón de objetos de equipo (raciones, agua, saco de dormir…)
  const equipo = objetosDeEquipoDisponibles();
  const btnObjeto = $('#btn-objeto');
  if (btnObjeto) {
    btnObjeto.disabled = equipo.length === 0 || estado.fin;
    btnObjeto.title = equipo.length
      ? `Usar ${equipo[0]} (llevas ${equipo.length}: ${equipo.join(', ')})`
      : 'No llevas raciones, agua ni saco de dormir';
    $('#txt-objeto').textContent = equipo.length ? `${equipo[0]}${equipo.length > 1 ? ` +${equipo.length - 1}` : ''}` : 'Equipo';
  }

  const ulHeridas = $('#lista-heridas');
  ulHeridas.innerHTML = '';
  if (!estado.heridas.length) {
    ulHeridas.innerHTML = '<li class="vacio">Sin heridas. Por ahora.</li>';
  } else {
    estado.heridas.forEach((h) => {
      const li = document.createElement('li');
      li.className = h.gravedad === 'critica' || h.gravedad === 'grave' ? 'grave' : 'leve';
      li.textContent = h.nombre;
      ulHeridas.appendChild(li);
    });
    if (estado.sangrado) {
      const li = document.createElement('li');
      li.className = 'grave';
      li.textContent = 'Desangramiento activo · pierdes vida cada turno';
      ulHeridas.appendChild(li);
    }
  }

  const ulInv = $('#lista-inventario');
  ulInv.innerHTML = '';
  if (!estado.inventario.length) {
    ulInv.innerHTML = '<li class="vacio">Nada. Solo tus manos.</li>';
  } else {
    const conteo = {};
    estado.inventario.forEach((i) => { conteo[i] = (conteo[i] || 0) + 1; });
    Object.entries(conteo).forEach(([item, n]) => {
      const li = document.createElement('li');
      let etiqueta = n > 1 ? `${item} ×${n}` : item;
      if (CURATIVOS[item]) {
        li.className = 'objeto--curativo';
        etiqueta += ` · cura ${CURATIVOS[item].cura}`;
      } else if (ARMAS[item]) {
        li.className = 'objeto--arma';
        etiqueta += ` · ${ARMAS[item].dano} daño`;
      } else if (BEBIDA[item]) {
        const limpia = BEBIDA[item].potable;
        li.className = limpia ? 'objeto--curativo' : 'objeto--agua-sucia';
        etiqueta += limpia ? ` · potable · sed +${BEBIDA[item].sed}` : ` · NO potable ⚠`;
      } else if (OTROS[item]) {
        li.className = 'objeto--equipo';
        const ef = [];
        if (OTROS[item].cansancio) ef.push(`cansancio ${OTROS[item].cansancio}`);
        if (OTROS[item].vida) ef.push(`vida +${OTROS[item].vida}`);
        if (OTROS[item].cordura) ef.push(`cordura +${OTROS[item].cordura}`);
        if (ef.length) etiqueta += ` · ${ef.join(' · ')}`;
      }
      li.textContent = etiqueta;
      ulInv.appendChild(li);
    });
  }

  const idsAliados = new Set(estado.alianza);
  estado.tributos.forEach((t) => {
    if (t.vivo && !t.yo && t.alianza.includes(estado.yo.id)) idsAliados.add(t.id);
  });
  const aliadosVivos = Array.from(idsAliados)
    .map((id) => estado.tributos.find((t) => t.id === id))
    .filter((t) => t && t.vivo);
  const companero = estado.tributos.find((t) => t.id === estado.yo.companero);
  const partes = aliadosVivos.map((t) => `${t.nombre} (D${t.distrito})${companero && t.id === companero.id ? ' · tu compañero' : ''}`);
  $('#txt-alianza').textContent = partes.length
    ? partes.join(' · ')
    : 'Nadie confía en ti todavía.';
}

function pintarTributosHUD() {
  const ul = $('#lista-tributos');
  ul.innerHTML = '';
  estado.tributos.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'tributo' + (t.yo ? ' yo' : '') + (!t.vivo ? ' muerto' : '') +
      (estado.alianza.includes(t.id) && t.vivo ? ' aliado' : '');
    li.innerHTML = `<span class="tributo__num">${String(t.distrito).padStart(2, '0')}</span>
      <span class="tributo__nom">${escapar(t.nombre)}</span>
      <span class="tributo__dist">${t.vivo ? t.rolNombre : 'caído'}</span>`;
    ul.appendChild(li);
  });
  $('#contador-vivos').textContent = estado.tributos.filter((t) => t.vivo).length;
}

/* ============================================================
   8. FINAL DE LA ARENA / VICTORIA
   ============================================================ */

function terminarArena(tipo) {
  estado.fin = true;
  cajaOpciones.innerHTML = '';
  const yo = estado.yo;
  const vivos = estado.tributos.filter((t) => t.vivo);

  estado.ediciones.push({
    edicion: estado.edicion,
    arena: ARENAS[estado.arena].nombre,
    tipo,
    turnos: estado.turno,
    vivos: vivos.length,
    patrocinio: Math.round(estado.patrocinio),
    // Huella de la partida: sirve para escribir el epílogo
    acciones: estado.historial.reduce((acc, h) => { acc[h.tipo] = (acc[h.tipo] || 0) + 1; return acc; }, {}),
    decisiones: estado.historial.length,
    aciertos: estado.historial.filter((h) => h.bien).length,
    propias: estado.tributos.filter((t) => !t.vivo && !t.yo && (t.causa || '').includes('a tus manos')).length,
    heridas: estado.heridas.length,
    aliados: estado.alianza.length,
    cansancio: Math.round(estado.cansancio),
    cordura: Math.round(estado.cordura),
    imagen: estado.imagen
  });

  if (tipo === 'victoria' || tipo === 'empate-distrito') {
    estado.victoria74 = true;
    // La victoria del 74 te lleva al hotel; el 75 es el final de la historia
    if (estado.edicion === 74) {
      actualizarHUD();
      pintarTributosHUD();
      pintarMapa();
      abrirHotel(tipo, vivos);
      return;
    }
  }

  mostrarFinal(tipo);
}

/* ============================================================
   9. HOTEL DEL CAPITOLIO
   ============================================================ */

const OPCIONES_HOTEL = [
  {
    id: 'descansar',
    texto: 'Dormir doce horas seguidas sin soñar con la arena.',
    efecto: 'Cordura ↑↑ · Cansancio ↓↓',
    aplicar: () => {
      estado.cordura = clamp(estado.cordura + 30, 0, 100);
      estado.cansancio = clamp(estado.cansancio - 60, 0, 100);
      return 'Duermes como no dormías desde niño. Despiertas con la boca seca y, por un momento, sin recordar nada.';
    }
  },
  {
    id: 'medico',
    texto: 'Dejar que los médicos del Capitolio te reconstruyan.',
    efecto: 'Vida ↑↑ · heridas cerradas · imagen frágil',
    aplicar: () => {
      estado.vida = 100;
      estado.heridas = [];
      estado.sangrado = false;
      estado.imagen = estado.imagen === 'querido' ? 'querido' : 'frágil';
      return 'Manos frías, luces blancas, agujas. Cierran lo que la arena abrió. En las fotos de mañana saldrás impecable, y el público lo notará.';
    }
  },
  {
    id: 'fiesta',
    texto: 'Ir a la fiesta de los patrocinadores.',
    efecto: 'Patrocinadores ↑↑ · Cansancio ↑ · Cordura ↓',
    aplicar: () => {
      estado.patrocinio = clamp(estado.patrocinio + 25, 0, 100);
      estado.cansancio = clamp(estado.cansancio + 30, 0, 100);
      estado.cordura = clamp(estado.cordura - 10, 0, 100);
      return 'Copas, risas y gente que te llama héroe sin mirarte a los ojos. Brindas, sonríes y no duermes.';
    }
  },
  {
    id: 'entrenar',
    texto: 'Bajar al gimnasio y prepararte para lo que venga.',
    efecto: 'Combate y Resistencia +1 · Cansancio ↑',
    aplicar: () => {
      estado.stats.combate = clamp(estado.stats.combate + 1, 1, 10);
      estado.stats.resistencia = clamp(estado.stats.resistencia + 1, 1, 10);
      estado.cansancio = clamp(estado.cansancio + 20, 0, 100);
      return 'Entrenas hasta que las manos te sangran. No sabes por qué, pero algo dentro de ti sabe que no has terminado.';
    }
  },
  {
    id: 'companero',
    texto: 'Buscar a la familia de los caídos y darles lo que puedas.',
    efecto: 'Cordura ↑↑ · Patrocinadores ↑ · imagen querida',
    aplicar: () => {
      estado.cordura = clamp(estado.cordura + 20, 0, 100);
      estado.patrocinio = clamp(estado.patrocinio + 10, 0, 100);
      estado.imagen = 'querido';
      return 'Visitas a madres que no te perdonan y a hermanos que sí. Das tu premio a quien lo necesita. El Capitolio no sabe qué hacer con eso.';
    }
  }
];

function abrirHotel(tipo, vivos) {
  estado.fin = false;
  const yo = estado.yo;
  const companeroVivo = vivos.find((t) => t.distrito === yo.distrito && !t.yo);

  $('#hotel-stats').innerHTML = `
    <div class="hotel__fila"><span>Vencedor</span><strong>${escapar(estado.nombre)}</strong></div>
    <div class="hotel__fila"><span>Edición</span><strong>74 · ${ARENAS[estado.arena].nombre}</strong></div>
    <div class="hotel__fila"><span>Tributos vivos</span><strong>${vivos.length}</strong></div>
    <div class="hotel__fila"><span>Turnos</span><strong>${estado.turno}</strong></div>
    <div class="hotel__fila"><span>Vida</span><strong>${Math.round(estado.vida)} / 100</strong></div>
    <div class="hotel__fila"><span>Patrocinadores</span><strong>${Math.round(estado.patrocinio)} / 100</strong></div>
    ${companeroVivo ? `<div class="hotel__fila"><span>Compañero</span><strong>${escapar(companeroVivo.nombre)} sigue vivo</strong></div>` : ''}
  `;

  const caja = $('#opciones-hotel');
  caja.innerHTML = '';
  OPCIONES_HOTEL.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${i + 1}</span>
      <span>${escapar(op.texto)}<span class="opcion__efecto">${op.efecto}</span></span>`;
    btn.addEventListener('click', () => elegirHotel(op));
    caja.appendChild(btn);
  });

  irA('hotel');
}

function elegirHotel(op) {
  const texto = op.aplicar();
  const caja = $('#opciones-hotel');
  caja.innerHTML = `<div class="aviso">${texto}</div>
    <button class="btn btn--principal" id="btn-ir-entrevista"><span>Ir a la entrevista</span></button>`;
  $('#btn-ir-entrevista').addEventListener('click', () => {
    irA('entrevista');
    iniciarEntrevista();
  });
}

/* ============================================================
   10. ENTREVISTA
   ============================================================ */

const ENTREVISTA = [
  {
    pregunta: 'César Flickerman se inclina hacia ti: «Dinos la verdad, vencedor. ¿Lloraste por los que mataste?»',
    opciones: [
      { texto: '«Sí. Cada noche. Los veo a todos.»', publico: 12, imagen: 'querido', cordura: -6, patrocinio: 10 },
      { texto: '«No. Era ellos o yo, y elegí yo.»', publico: 6, imagen: 'ruthless', cordura: 4, patrocinio: -4 },
      { texto: '«¿Y usted, César? ¿Lloró alguna vez?»', publico: 14, imagen: 'descarado', cordura: 6, patrocinio: 6 },
      { texto: 'Bajas la mirada y no dices nada.', publico: 3, imagen: 'fragil', cordura: -10, patrocinio: 2 }
    ]
  },
  {
    pregunta: '«Se rumorea que el Capitolio quiere volver a verte en la arena. ¿Volverías?»',
    opciones: [
      { texto: '«Volvería y ganaría otra vez.»', publico: 10, imagen: 'ruthless', cordura: 5, patrocinio: 4 },
      { texto: '«No. Ya no me queda nada que demostrar.»', publico: 6, imagen: 'descarado', cordura: 8, patrocinio: -6 },
      { texto: '«Solo si mi distrito lo necesita.»', publico: 13, imagen: 'querido', cordura: 2, patrocinio: 8 },
      { texto: '«Que se lo pregunten a los muertos.»', publico: 15, imagen: 'descarado', cordura: -8, patrocinio: -8 }
    ]
  },
  {
    pregunta: '«Tu compañero de distrito, ¿qué fue de él? El público quiere saberlo.»',
    opciones: [
      { texto: '«Le debo la vida. Le debo todo.»', publico: 12, imagen: 'querido', cordura: 6, patrocinio: 8 },
      { texto: '«Se interpuso. Hice lo que había que hacer.»', publico: 8, imagen: 'ruthless', cordura: -6, patrocinio: -6 },
      { texto: '«Sigue vivo. Y debería estar aquí sentado conmigo.»', publico: 14, imagen: 'descarado', cordura: 4, patrocinio: 6 },
      { texto: 'Cambias de tema y hablas de tu distrito.', publico: 5, imagen: 'fragil', cordura: -3, patrocinio: 0 }
    ]
  },
  {
    pregunta: '«Última pregunta: si pudieras borrar una sola cosa de la arena, ¿cuál sería?»',
    opciones: [
      { texto: '«Ninguna. Todo lo que hice me trajo hasta aquí.»', publico: 9, imagen: 'ruthless', cordura: 3, patrocinio: 2 },
      { texto: '«La cara del primero que maté.»', publico: 14, imagen: 'querido', cordura: -5, patrocinio: 10 },
      { texto: '«Los Juegos. Borraría los Juegos.»', publico: 16, imagen: 'descarado', cordura: 8, patrocinio: 4 },
      { texto: '«Nada. Me gusta lo que soy ahora.»', publico: 7, imagen: 'ruthless', cordura: -4, patrocinio: -2 }
    ]
  }
];

const IMAGENES = {
  querido:   { nombre: 'Querido',   texto: 'El público te ama. Tu cara está en cada pantalla del Capitolio y los patrocinadores hacen cola.' },
  ruthless:  { nombre: 'Despiadado', texto: 'El público te teme y te admira. No hay aplausos, hay silencio respetuoso.' },
  descarado: { nombre: 'Descarado', texto: 'El público se ríe contigo y contigo se atreve. Eres el que dijo lo que nadie dice.' },
  fragil:    { nombre: 'Frágil',    texto: 'El público siente lástima. Es cariño, pero un cariño que no te hará ningún favor en la arena.' },
  neutral:   { nombre: 'Neutral',   texto: 'El público aún no sabe quién eres. Panem espera a ver qué haces.' }
};

const entrevista = { indice: 0 };

function iniciarEntrevista() {
  entrevista.indice = 0;
  estado.entrevistaPuntos = 0;
  if (estado.imagen === 'neutral' && estado.patrocinio > 60) estado.imagen = 'querido';
  pintarEntrevista();
}

function pintarEntrevista() {
  const p = ENTREVISTA[entrevista.indice];
  $('#entre-contador').textContent = `${entrevista.indice + 1} / ${ENTREVISTA.length}`;
  $('#entre-barra').style.width = `${(entrevista.indice / ENTREVISTA.length) * 100}%`;
  $('#entre-pregunta').textContent = p.pregunta;
  $('#entre-feedback').hidden = true;

  const caja = $('#entre-opciones');
  caja.innerHTML = '';
  const letras = ['A', 'B', 'C', 'D'];
  p.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion';
    btn.innerHTML = `<span class="opcion__letra">${letras[i]}</span><span>${escapar(op.texto)}</span>`;
    btn.addEventListener('click', () => responderEntrevista(op));
    caja.appendChild(btn);
  });
}

function responderEntrevista(op) {
  estado.entrevistaPuntos += op.publico;
  estado.imagen = op.imagen;
  estado.cordura = clamp(estado.cordura + (op.cordura || 0), 0, 100);
  estado.patrocinio = clamp(estado.patrocinio + (op.patrocinio || 0), 0, 100);

  const caja = $('#entre-opciones');
  caja.innerHTML = '';
  const fb = $('#entre-feedback');
  fb.hidden = false;
  fb.innerHTML = `El público reacciona: <strong>+${op.publico} de imagen</strong>. ` +
    `Ahora te ven como <strong>${IMAGENES[op.imagen].nombre.toLowerCase()}</strong>. ` +
    `Patrocinadores: ${op.patrocinio >= 0 ? '+' : ''}${op.patrocinio}.`;

  entrevista.indice += 1;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--principal';
  btn.innerHTML = `<span>${entrevista.indice < ENTREVISTA.length ? 'Siguiente pregunta' : 'Terminar la entrevista'}</span>`;
  btn.addEventListener('click', () => {
    if (entrevista.indice < ENTREVISTA.length) {
      pintarEntrevista();
    } else {
      $('#entre-barra').style.width = '100%';
      prepararTimeSkip();
    }
  });
  caja.appendChild(btn);
}

/* ============================================================
   11. TIME-SKIP Y SEGUNDA ARENA
   ============================================================ */

function prepararTimeSkip() {
  const img = IMAGENES[estado.imagen] || IMAGENES.neutral;
  const yo = estado.yo;
  const companero = estado.tributos.find((t) => t.distrito === yo.distrito && !t.yo);
  const companeroVivo = companero && companero.vivo;

  const lineas = [
    `La entrevista termina con los focos apagándose de golpe. Al día siguiente, el Capitolio anuncia el Quarter Quell: la edición 75 se celebrará con los mismos tributos de la 74.`,
    companeroVivo
      ? `Tu compañero de distrito, ${companero.nombre}, vuelve contigo. El Capitolio no deja nada al azar.`
      : 'No hay compañero esta vez: el Capitolio rellena tu distrito con un nombre que no conoces.',
    `Durante un año entrenas, sonríes en los desfiles y ves tu propia cara en cada edificio de Panem. Imagen pública: ${img.nombre.toLowerCase()}. ${img.texto}`,
    'Y entonces suena el tren. La arena del 75 es un reloj de piedra gigante: doce sectores que giran, doce formas de morir cada dos horas. Bosques alrededor, un gran árbol en el centro y una bóveda de armas dentro del reloj.',
    'No hay tributos nuevos. Son los mismos. Y esta vez nadie va a subestimarte.'
  ];

  const caja = $('#timeskip-lineas');
  caja.innerHTML = lineas.map((l, i) => `<p class="timeskip__linea" style="animation-delay:${i * 0.18}s">${escapar(l)}</p>`).join('');

  $('#timeskip-aviso').innerHTML =
    `<strong>Segunda arena: más difícil.</strong> Los acontecimientos del reloj pegan más fuerte, los tributos están mejor preparados ` +
    `y la muerte acecha el doble en cada error. Tu patrocinio (${Math.round(estado.patrocinio)}/100) y tu imagen te acompañan.`;

  irA('timeskip');
}

$('#btn-ir-arena2').addEventListener('click', () => {
  iniciarSegundaArena();
});

function iniciarSegundaArena() {
  estado.edicion = 75;
  estado.arena = 'reloj';
  $('#cabecera-sub').textContent = 'Modo Historia · Panem · Edición 75';

  // Mismos participantes: se reutiliza la plantilla del 74
  const plantilla = estado.tributos.map((t) => ({
    distrito: t.distrito, yo: t.yo, nombre: t.nombre, rol: t.rol, traicionero: t.traicionero, fuerza: t.fuerza
  }));
  estado.tributos = crearTributos(plantilla);
  estado.yo = estado.tributos.find((t) => t.yo);

  // El cansancio y la cordura se arrastran; la vida se recupera en parte
  const vidaPrevia = estado.vida;
  const cansPrevio = estado.cansancio;
  const cordPrevia = estado.cordura;
  const heridasPrevias = estado.heridas.slice(0, 2);
  const arma = estado.armaUsada;

  prepararArena();

  estado.vida = clamp(55 + vidaPrevia * 0.35, 40, 100);
  estado.cansancio = clamp(cansPrevio * 0.5, 0, 100);
  estado.cordura = clamp(cordPrevia * 0.7 + 10, 0, 100);
  estado.heridas = heridasPrevias;
  estado.patrocinio = clamp(estado.patrocinio + 10, 0, 100);
  estado.inventario = [elegir(['Bebida energética', 'Ración de rescate', 'Analgésicos'])];
  if (arma && ARMAS[arma]) estado.inventario.push(arma);
  else if (Math.random() < 0.5) estado.inventario.push(armaAleatoria());

  pintarMapa();
  actualizarRelojMapa();
  irA('mapa');
}

/* ============================================================
   12. FINAL DE LA HISTORIA
   ============================================================ */

/* ============================================================
   EPÍLOGOS
   El cierre cambia según cómo hayas ganado: por las manos, por la
   cabeza, por la gente, por aguantar, por suerte o en pareja.
   ============================================================ */

function contarAccion(ed, tipo) {
  return (ed.acciones && ed.acciones[tipo]) || 0;
}

/* Devuelve la clave del epílogo que te toca */
function claveEpilogo(tipo, ed) {
  if (tipo === 'empate-distrito') return 'pareja';
  const combate = contarAccion(ed, 'atacar');
  const sigilo = contarAccion(ed, 'sigilo') + contarAccion(ed, 'huir');
  const gente = contarAccion(ed, 'ayudar') + contarAccion(ed, 'alianza');
  const riesgo = contarAccion(ed, 'riesgo');
  const acierto = ed.decisiones ? ed.aciertos / ed.decisiones : 0;

  // El que se lo llevó todo a base de golpes
  if (combate >= 4 && combate >= sigilo) return 'verdugo';
  // El que sobrevivió sin que nadie le viera
  if (sigilo >= 4 && sigilo > combate) return 'sombra';
  // El que se hizo querer y llegó hasta el final con gente al lado
  if (gente >= 4 || ed.imagen === 'querido') return 'corazon';
  // El que aguantó: herido, cansado y aun así de pie
  if (ed.heridas >= 3 || ed.cansancio >= 70 || ed.cordura <= 35) return 'resistencia';
  // El que arriesgó y le salió bien
  if (riesgo >= 3 && acierto >= 0.55) return 'jugador';
  // El que ganó sin saber muy bien cómo
  if (acierto < 0.45) return 'suerte';
  return 'estratega';
}

const EPILOGOS = {
  verdugo: {
    titulo: 'El nombre que no se dice en voz alta',
    entradilla: 'Ganaste por las manos',
    texto: (c) => `En Panem no te recuerdan por haber ganado: te recuerdan por cómo. ${c.propias} de los cañones de esa arena ` +
      `sonaron por tu mano y el Capitolio aprendió a bajar el volumen cuando repone las imágenes. ` +
      `Los niños del Distrito ${c.distrito} juegan a ser tú en los callejones, y sus madres les llaman a casa antes de que oscurezca. ` +
      `Te dan una casa con agua caliente y una puerta que nadie llama. ${c.imagenTexto}`,
    cierre: 'No tienes pesadillas: tienes memoria. Es peor.',
    noticia: '«EL VENCEDOR QUE NUNCA SOLTÓ EL ARMA»'
  },
  sombra: {
    titulo: 'Nadie te vio llegar',
    entradilla: 'Ganaste sin dar la cara',
    texto: (c) => `Los Vigilantes tardaron tres horas en encontrar tu posición cuando el último cañón sonó. ` +
      `Tú ya estabas a doscientos metros, contando los giros del sector y sin una gota de sangre que no fuera tuya. ` +
      `En el Capitolio repiten tus imágenes y no te encuentran en ninguna. Eso, dicen los patrocinadores, vale más que un ejército. ` +
      `Tu casa del Distrito ${c.distrito} tiene las cortinas cerradas desde el primer día. ${c.imagenTexto}`,
    cierre: 'En la arena aprendiste que el que no está donde le buscan, vive.',
    noticia: '«EL FANTASMA DEL DISTRITO»'
  },
  corazon: {
    titulo: 'El vencedor que dio de comer a sus rivales',
    entradilla: 'Ganaste con gente al lado',
    texto: (c) => `Sobreviviste rodeado de gente: curaste a los que podías curar y te aliarte fue tu arma más afilada. ` +
      `Cuando quedó un solo cañón, en la arena había alguien más que te sostenía. En Panem eso se llama debilidad; ` +
      `en el Capitolio lo llaman audiencia, y tú eras la audiencia entera. ` +
      `Tu distrito te recibe con las manos abiertas y el Capitolio te pone delante de una cámara cada semana. ${c.imagenTexto}`,
    cierre: 'Cuidaste a los demás hasta el último turno. También al último que cayó.',
    noticia: '«EL TRIBUTO QUE HIZO LLORAR A PANEM»'
  },
  resistencia: {
    titulo: 'Lo que quedó de ti',
    entradilla: 'Ganaste aguantando',
    texto: (c) => `No ganaste rápido ni limpio: ganaste porque seguías respirando cuando otros ya no. ` +
      `Saliste de la arena con ${c.heridas} herida${c.heridas === 1 ? '' : 's'} abierta${c.heridas === 1 ? '' : 's'}, el cuerpo a medio reconstruir y la cabeza ` +
      `sonando como un tambor. Los médicos del Capitolio dicen que estás entero. Tú sabes lo que falta. ` +
      `En el Distrito ${c.distrito} te miran como se mira a un edificio que aguantó el incendio. ${c.imagenTexto}`,
    cierre: 'Sobrevivir no fue una decisión: fue una costumbre.',
    noticia: '«EL VENCEDOR QUE VOLVIÓ A PIE»'
  },
  jugador: {
    titulo: 'El que apostó y ganó',
    entradilla: 'Ganaste arriesgando',
    texto: (c) => `Te lanzaste ${contarAccion(c.ed, 'riesgo')} veces a por lo que no era tuyo y ${c.aciertos} de tus decisiones ` +
      `salieron como querías. La arena es un juego de probabilidades y tú fuiste el único que llevaba la cuenta. ` +
      `Los patrocinadores te adoran porque contigo nunca se sabe, y el Capitolio te ha fichado para sus programas de apuestas. ` +
      `Tu casa del Distrito ${c.distrito} tiene más cosas de las que caben en ella. ${c.imagenTexto}`,
    cierre: 'Al final apostaste lo único que no se puede recuperar. Y salió bien.',
    noticia: '«EL TRIBUTO QUE JUGÓ CON LA ARENA»'
  },
  suerte: {
    titulo: 'No sabes por qué sigues vivo',
    entradilla: 'Ganaste de milagro',
    texto: (c) => `Hubo un momento, y tú sabes cuál, en el que todo dependía de algo que no controlabas. Y salió a tu favor. ` +
      `Sobreviviste ${c.decisiones} decisiones, la mayoría equivocadas, y aun así el último cañón no fue para ti. ` +
      `El Capitolio te llama «el afortunado» y el público se ríe contigo, que es la única forma de que se rían de alguien sin matarlo. ` +
      `En el Distrito ${c.distrito} hay quien dice que hiciste un pacto. Tú no lo desmientes. ${c.imagenTexto}`,
    cierre: 'La suerte también se agota. Solo que no lo hace dentro de la arena.',
    noticia: '«EL VENCEDOR QUE NO SE LO CREE»'
  },
  estratega: {
    titulo: 'La partida mejor jugada',
    entradilla: 'Ganaste pensando',
    texto: (c) => `No fuiste el más fuerte ni el más rápido: fuiste el que entendió antes que nadie cómo funcionaba el tablero. ` +
      `${c.aciertos} de ${c.decisiones} decisiones salieron como querías y ninguna te costó más de lo necesario. ` +
      `El Capitolio te ofrece un puesto de asesor y el Distrito ${c.distrito} te pide que no aceptes. ` +
      `En las entrevistas hablas poco y cada frase se repite durante semanas. ${c.imagenTexto}`,
    cierre: 'Ganaste sin que la arena te viera dudar ni una vez.',
    noticia: '«EL TRIBUTO QUE GANÓ DOS VECES: EN LA ARENA Y EN LA SALA DE MANDO»'
  },
  pareja: {
    titulo: 'Dos, no uno',
    entradilla: 'Ganaste en pareja',
    texto: (c) => `El Capitolio no tenía previsto un empate, y por eso mismo fue perfecto: dos tributos del Distrito ${c.distrito} ` +
      `de pie, cogidos del brazo, y una audiencia que no supo si aplaudir o exigir una muerte más. ` +
      `Los dos coméis en la misma mesa desde entonces, y ninguno de los dos duerme del todo. ` +
      `El Capitolio ha decidido que sois un símbolo. Los símbolos, en Panem, duran poco. ${c.imagenTexto}`,
    cierre: 'Sobrevivisteis juntos. Eso también es una forma de desafiar al Capitolio.',
    noticia: '«DOS VENCEDORES, UNA ARENA»'
  }
};

/* Construye los datos del epílogo para la última edición jugada */
function datosEpilogo(ed) {
  const img = IMAGENES[estado.imagen] || IMAGENES.neutral;
  return {
    ed,
    distrito: estado.yo.distrito,
    nombre: estado.nombre,
    heridas: ed.heridas || 0,
    aciertos: ed.aciertos || 0,
    decisiones: ed.decisiones || 1,
    propias: ed.propias || 0,
    imagenTexto: img.texto,
    imagen: img
  };
}

function pintarEpilogo(tipo) {
  const caja = $('#final-epilogo');
  if (!caja) return;
  if (tipo !== 'victoria' && tipo !== 'empate-distrito') {
    caja.hidden = true;
    caja.innerHTML = '';
    return;
  }
  const ed = estado.ediciones[estado.ediciones.length - 1] || {};
  const clave = claveEpilogo(tipo, ed);
  const ep = EPILOGOS[clave];
  const datos = datosEpilogo(ed);

  // La noticia del Capitolio: su titular y la reacción de tu distrito
  const reacciones = {
    querido: 'Tu distrito cuelga tu cara en las ventanas. La paz del Capitolio también se compra con ídolos.',
    ruthless: 'Tu distrito celebra en silencio. Nadie quiere ser el primero en aplaudir a alguien así.',
    descarado: 'Tu distrito se ríe y repite tus frases. Reírse de ti es, en el fondo, reírse del Capitolio.',
    fragil: 'Tu distrito reza por ti. En el fondo saben que el Capitolio no deja volver a nadie del todo.',
    neutral: 'Tu distrito no sabe qué hacer con tu nombre. Aún no hay canción que lo acompañe.'
  };

  caja.hidden = false;
  caja.innerHTML = `
    <p class="epilogo__entradilla">${escapar(ep.entradilla)}</p>
    <h3 class="epilogo__titulo">${escapar(ep.titulo)}</h3>
    <p class="epilogo__texto">${escapar(ep.texto(datos))}</p>
    <p class="epilogo__cierre">${escapar(ep.cierre)}</p>
    <div class="epilogo__noticia">
      <span class="epilogo__medio">PANEM · EDICIÓN ${ed.edicion || estado.edicion}</span>
      <strong>${escapar(ep.noticia.replace(/^«|»$/g, ''))}</strong>
      <p>${escapar(reacciones[estado.imagen] || reacciones.neutral)}</p>
    </div>`;
}

function mostrarFinal(tipo) {
  estado.fin = true;
  cajaOpciones.innerHTML = '';
  const yo = estado.yo;
  const vivos = estado.tributos.filter((t) => t.vivo);
  const img = IMAGENES[estado.imagen] || IMAGENES.neutral;

  let etiqueta = 'Los Juegos han terminado';
  let titulo = '';
  let texto = '';

  const dosEdiciones = estado.ediciones.length > 1;

  if (tipo === 'victoria' || tipo === 'empate-distrito') {
    etiqueta = dosEdiciones ? 'Bicampeón · Ediciones 74 y 75' : 'Vencedor de los Juegos';
    titulo = tipo === 'empate-distrito' ? 'Dos, no uno' : 'Victorioso';
    texto = tipo === 'empate-distrito'
      ? `Solo quedáis tú y ${vivos.find((t) => !t.yo)?.nombre}, los dos del Distrito ${yo.distrito}. Ninguno se mueve. ` +
        `El Capitolio no puede declarar un vencedor único… y por primera vez, la arena empata. ` +
        `Sobrevives a la arena del ${estado.edicion}, y Panem no sabe qué hacer contigo.`
      : `Has sobrevivido a la arena del ${estado.edicion}. ${dosEdiciones ? 'Dos veces. Dos arenas. ' : ''}` +
        `Las cámaras te buscan entre el humo y el Capitolio te corona otra vez. ${img.texto}`;
  } else {
    etiqueta = estado.edicion === 75 ? 'Eliminado en la Edición 75' : 'Eliminado';
    titulo = 'El cañón sonó para ti';
    texto = `${estado.nombre} ha caído en la arena del ${estado.edicion}, a las ${horaLegible(estado.hora)}. ` +
      `${dosEdiciones ? 'Después de ganar una vez, el Capitolio se cobró su revancha. ' : ''}` +
      `En Panem alguien encenderá una vela. Y mañana, otros veinticuatro nombres.`;
  }

  $('#final-etiqueta').textContent = etiqueta;
  $('#final-titulo').textContent = titulo;
  $('#final-texto').textContent = texto;

  pintarDetallesMuerte(tipo, vivos);
  pintarEpilogo(tipo);

  const caja = $('#final-stats');
  caja.innerHTML = '';
  const resumen = [
    ['Rol', ROLES[estado.rol].nombre],
    ['Distrito', `${yo.distrito} · ${yo.distritoNombre}`],
    ['Arenas jugadas', estado.ediciones.map((e) => `${e.edicion} (${e.arena})`).join(' · ') || '—'],
    ['Imagen pública', img.nombre],
    ['Tributos vivos', String(vivos.length)],
    ['Turnos jugados', String(estado.turno)],
    ['Patrocinadores', `${Math.round(estado.patrocinio)} / 100`],
    ['Heridas', estado.heridas.length ? estado.heridas.map((h) => h.nombre).join(', ') : 'Ninguna'],
    ['Vida final', `${Math.round(Math.max(0, estado.vida))} / 100`]
  ];
  resumen.forEach(([k, v]) => {
    const fila = document.createElement('div');
    fila.className = 'stat';
    fila.innerHTML = `<span>${k}</span><div class="stat__pista"><div class="stat__barra" style="width:100%"></div></div><span class="stat__valor">${escapar(v)}</span>`;
    caja.appendChild(fila);
  });

  $('#final-resultados').hidden = true;
  $('#final-resultados').innerHTML = '';
  $('#btn-ver-resultados').textContent = 'Ver resultados de la partida';

  actualizarHUD();
  pintarTributosHUD();
  pintarMapa();

  irA('final');
}

/* ---------- Detalles de la muerte ---------- */

function asesinoProbable() {
  const vivos = estado.tributos.filter((t) => t.vivo && !t.yo);
  if (!vivos.length) return null;
  const causa = (estado.causaMuerte || '').toLowerCase();
  if (causa.includes('niebla') || causa.includes('avisp') || causa.includes('mut') ||
      causa.includes('terremoto') || causa.includes('inundaci') || causa.includes('tormenta') ||
      causa.includes('sangre') || causa.includes('desangramiento') || causa.includes('heridas')) {
    return null; // lo mató la arena, no una persona
  }
  // El más fuerte de los que siguen vivos es el que más papeletas tiene
  return vivos.slice().sort((a, b) => b.fuerza - a.fuerza)[0];
}

function pintarDetallesMuerte(tipo, vivos) {
  const caja = $('#final-muerte');
  const esMuerte = tipo !== 'victoria' && tipo !== 'empate-distrito';
  vivos = vivos.filter((t) => !t.yo);

  if (!esMuerte) {
    caja.hidden = true;
    caja.innerHTML = '';
    return;
  }

  const yo = estado.yo;
  const arena = ARENAS[estado.arena];
  const asesino = asesinoProbable();
  const armaUsada = estado.armaUsada || 'tus propias manos';
  const critica = estado.heridas.find((h) => h.gravedad === 'critica');
  let causa = estado.causaMuerte || 'Las heridas de la arena.';
  if (critica && !causa.toLowerCase().includes(critica.nombre.toLowerCase())) {
    causa += ` Te llevaste «${critica.nombre}» y no hubo forma de cerrarla.`;
  }
  const heridas = estado.heridas.length
    ? estado.heridas.map((h) => `<li class="${h.gravedad === 'critica' || h.gravedad === 'grave' ? 'grave' : 'leve'}">${escapar(h.nombre)}</li>`).join('')
    : '<li class="vacio">Ninguna herida abierta.</li>';

  const vistos = new Set();
  const ultimos = estado.historial
    .slice()
    .reverse()
    .filter((h) => {
      if (vistos.has(h.texto)) return false;
      vistos.add(h.texto);
      return true;
    })
    .slice(0, 6);
  const actos = ultimos.length
    ? ultimos.map((h) => `<li class="${h.bien ? 'bien' : 'mal'}">${h.bien ? '✓' : '✗'} ${escapar(h.texto)}</li>`).join('')
    : '<li class="vacio">No hubo tiempo para nada.</li>';

  caja.hidden = false;
  caja.innerHTML = `
    <h3 class="panel__titulo">Informe de la caída</h3>
    <div class="muerte__rejilla">
      <div class="muerte__bloque">
        <h4>Causa</h4>
        <p class="muerte__causa">${escapar(causa)}</p>
        <p class="muerte__autor">${asesino
          ? `A manos de <strong>${escapar(asesino.nombre)}</strong>, Distrito ${asesino.distrito} (${asesino.rolNombre}).`
          : 'Ningún tributo puede reclamar tu muerte: te la cobró la arena.'}</p>
        <p class="muerte__detalle">Caíste a las <strong>${horaLegible(estado.hora)}</strong> del turno <strong>${estado.turno}</strong>,
          en <strong>${escapar(arena.nombre)}</strong> (edición ${arena.edicion}).
          Tu última arma: <strong>${escapar(armaUsada)}</strong>.
          El Capitolio recoge tu cuerpo a las pocas horas, cuando ya no queda nadie mirando.</p>
      </div>
      <div class="muerte__bloque">
        <h4>El cuerpo</h4>
        <ul class="muerte__lista">${heridas}</ul>
        <p class="muerte__detalle">Vida final <strong>${Math.round(Math.max(0, estado.vida))} / 100</strong> ·
          Cansancio <strong>${Math.round(estado.cansancio)}</strong> ·
          Cordura <strong>${Math.round(estado.cordura)}</strong></p>
      </div>
      <div class="muerte__bloque">
        <h4>Los últimos actos</h4>
        <ul class="muerte__lista muerte__lista--actos">${actos}</ul>
      </div>
      <div class="muerte__bloque">
        <h4>Quién sobrevive</h4>
        <p class="muerte__detalle">${vivos.length
          ? `Quedan <strong>${vivos.length}</strong> tributos vivos: ${vivos.slice(0, 6).map((t) => escapar(t.nombre)).join(', ')}${vivos.length > 6 ? '…' : ''}.`
          : 'Nadie. La arena se quedó vacía.'}</p>
        <p class="muerte__detalle">Los cañones de esta edición sonaron <strong>${estado.totalMuertes}</strong> veces por tus manos y por las de los demás.</p>
      </div>
    </div>`;
}

/* ---------- Resultados de la partida ---------- */

function pintarResultados() {
  const caja = $('#final-resultados');
  const yo = estado.yo;
  const vivos = estado.tributos.filter((t) => t.vivo);

  const totalActos = estado.historial.length;
  const aciertos = estado.historial.filter((h) => h.bien).length;
  const aciertoPct = totalActos ? Math.round((aciertos / totalActos) * 100) : 0;

  const conteo = {};
  estado.historial.forEach((h) => { conteo[h.tipo] = (conteo[h.tipo] || 0) + 1; });
  const tipos = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `<li>${n} × ${escapar(TIPOS_ACTOS[t] || t)}</li>`)
    .join('') || '<li class="vacio">Sin acciones registradas.</li>';

  const filasEdicion = estado.ediciones.map((e) => `
    <li><span>Edición ${e.edicion} · ${escapar(e.arena)}</span>
        <strong>${e.tipo === 'victoria' ? 'victoria' : e.tipo === 'empate-distrito' ? 'empate' : 'eliminado'}</strong>
        <em>${e.turnos} turnos · ${e.vivos} vivos</em></li>`).join('') || '<li class="vacio">Sin ediciones terminadas.</li>';

  const muertos = estado.tributos
    .filter((t) => !t.vivo)
    .map((t) => `<span class="chip">${escapar(t.nombre)} <em>D${t.distrito}</em></span>`)
    .join('') || '<span class="vacio">Nadie ha caído.</span>';

  const statsFinales = LISTA_STATS
    .map((st) => `<li><span>${st.nombre}</span><strong>${estado.stats[st.clave]}</strong></li>`)
    .join('');

  caja.innerHTML = `
    <h3 class="panel__titulo">Resultados de la partida</h3>
    <div class="resumen__grid">
      <div class="resumen__caja">
        <h4>Rendimiento</h4>
        <ul class="resumen__lista">
          <li><span>Turnos jugados</span><strong>${estado.turno}</strong></li>
          <li><span>Decisiones</span><strong>${totalActos}</strong></li>
          <li><span>Aciertos</span><strong>${aciertos} (${aciertoPct} %)</strong></li>
          <li><span>Patrocinadores</span><strong>${Math.round(estado.patrocinio)} / 100</strong></li>
          <li><span>Caídos en la arena</span><strong>${estado.totalMuertes}</strong></li>
          <li><span>Supervivientes</span><strong>${vivos.length}</strong></li>
        </ul>
      </div>
      <div class="resumen__caja">
        <h4>Tu tributo</h4>
        <ul class="resumen__lista">
          <li><span>Nombre</span><strong>${escapar(estado.nombre)}</strong></li>
          <li><span>Distrito</span><strong>${yo.distrito} · ${yo.distritoNombre}</strong></li>
          <li><span>Rol</span><strong>${ROLES[estado.rol].nombre}</strong></li>
          <li><span>Imagen pública</span><strong>${(IMAGENES[estado.imagen] || IMAGENES.neutral).nombre}</strong></li>
          <li><span>Vida final</span><strong>${Math.round(Math.max(0, estado.vida))} / 100</strong></li>
          <li><span>Cansancio / Cordura</span><strong>${Math.round(estado.cansancio)} / ${Math.round(estado.cordura)}</strong></li>
        </ul>
      </div>
      <div class="resumen__caja">
        <h4>Estadísticas finales</h4>
        <ul class="resumen__lista">${statsFinales}</ul>
      </div>
      <div class="resumen__caja">
        <h4>Ediciones</h4>
        <ul class="resumen__ediciones">${filasEdicion}</ul>
        <h4 class="resumen__sub">Tipo de decisiones</h4>
        <ul class="resumen__lista resumen__lista--corta">${tipos}</ul>
      </div>
    </div>
    <h4 class="resumen__sub">Caídos</h4>
    <div class="resumen__chips">${muertos}</div>`;
}

const TIPOS_ACTOS = {
  atacar: 'ataques',
  huir: 'huidas',
  ayudar: 'ayudas',
  alianza: 'alianzas',
  sigilo: 'escondites',
  riesgo: 'riesgos'
};

$('#btn-ver-resultados').addEventListener('click', () => {
  const caja = $('#final-resultados');
  const abierta = !caja.hidden;
  if (abierta) {
    caja.hidden = true;
    $('#btn-ver-resultados').textContent = 'Ver resultados de la partida';
    return;
  }
  pintarResultados();
  caja.hidden = false;
  $('#btn-ver-resultados').textContent = 'Ocultar resultados';
  caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function reiniciarPartida() {
  // Se limpia la partida entera y se vuelve a la ceremonia de la cosecha
  if (paramsPrueba) {
    location.href = location.pathname;
    return;
  }
  location.reload();
}

/* Vuelve a la ceremonia de la cosecha sin recargar: la partida anterior queda limpia */
function volverAlInicio() {
  guardarConfig();

  // 1. Estado de la partida a cero
  const cfg = leerConfig() || {};
  estado.nombre = cfg.nombre || '';
  estado.presentacion = cfg.presentacion || '';
  estado.distrito = cfg.distrito || null;
  estado.fama = 0;
  estado.rol = 'soberbia';
  estado.stats = {};
  estado.entrevistaPuntos = 0;
  estado.imagen = 'neutral';
  estado.ediciones = [];
  estado.victoria74 = false;
  estado.arena = 'lago';
  estado.edicion = 74;
  estado.fin = false;
  estado.vivo = true;
  estado.turno = 0;
  estado.hora = 0;
  estado.sector = 1;
  estado.vida = 100;
  estado.cansancio = 0;
  estado.cordura = 100;
  estado.patrocinio = 0;
  estado.heridas = [];
  estado.sangrado = false;
  estado.inventario = [];
  estado.alianza = [];
  estado.historial = [];
  estado.armaUsada = '';
  estado.causaMuerte = '';
  estado.enCombate = false;
  estado.totalMuertes = 0;
  estado.esperandoEleccion = false;
  estado.bloqueoCombate = false;
  estado.proximoAcontecimiento = 2;
  estado.escenaActual = null;
  historialEscenas.length = 0;

  // 2. Tributos nuevos (24 nombres limpios, sin heridas ni alianzas)
  estado.tributos = crearTributos();
  estado.yo = estado.tributos.find((t) => t.yo) || estado.yo;

  // 3. El botón de la arena vuelve a estar disponible
  const btnJugar = $('#btn-entrar-juego');
  btnJugar.disabled = false;
  btnJugar.innerHTML = '<span>Que empiecen los Juegos</span>';
  const aviso = $('#aviso-arena');
  if (aviso) { aviso.hidden = true; aviso.innerHTML = ''; }

  // 4. Registro y pantallas limpias
  if (narracion) narracion.innerHTML = '';
  if (cajaOpciones) cajaOpciones.innerHTML = '';
  const ac = $('#caja-acontecimiento');
  if (ac) ac.hidden = true;
  $('#registro-caidos').innerHTML = '<li class="vacio">Los cañones aún no han sonado.</li>';
  $('#final-muerte').hidden = true;
  $('#final-muerte').innerHTML = '';
  $('#final-resultados').hidden = true;
  $('#final-resultados').innerHTML = '';
  $('#lista-heridas').innerHTML = '<li class="vacio">Sin heridas. Por ahora.</li>';
  $('#lista-inventario').innerHTML = '<li class="vacio">Nada. Solo tus manos.</li>';

  // 5. Formulario con lo que había
  restaurarConfig();
  $('#ayuda-nombre').classList.remove('error');
  $('#ayuda-nombre').textContent = 'De 2 a 18 caracteres.';

  pintarMapa();
  actualizarHUD();
  irA('inicio');
}

$('#btn-reiniciar').addEventListener('click', reiniciarPartida);
$('#btn-reiniciar-top').addEventListener('click', reiniciarPartida);

$('#btn-ver-mapa-final').addEventListener('click', () => {
  // Se reconstruye el mapa limpio antes de mostrarlo, para que no quede bloqueado
  const btnJugar = $('#btn-entrar-juego');
  btnJugar.disabled = true;
  btnJugar.innerHTML = '<span>Partida terminada</span>';
  pintarMapa();
  pintarTributosHUD();
  actualizarRelojMapa();
  irA('mapa');
  avisoArena();
});

$('#btn-inicio-mapa').addEventListener('click', volverAlInicio);
$('#btn-inicio-final').addEventListener('click', volverAlInicio);

/* ============================================================
   13. NAVEGACIÓN Y ARRANQUE
   ============================================================ */

const ORDEN_PASOS = ['inicio', 'test', 'mapa', 'juego'];

function irA(id) {
  $$('.pantalla').forEach((p) => p.classList.remove('activa'));
  const destino = $(`#pantalla-${id}`);
  if (destino) destino.classList.add('activa');

  const equivalencias = {
    rol: 'test',
    hotel: 'juego',
    entrevista: 'juego',
    timeskip: 'mapa',
    final: 'juego'
  };
  const clave = equivalencias[id] || id;
  const idx = ORDEN_PASOS.indexOf(clave);
  $$('.paso').forEach((p) => {
    const i = ORDEN_PASOS.indexOf(p.dataset.paso);
    p.classList.toggle('activo', i === idx);
    p.classList.toggle('hecho', i < idx);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

pintarDistritos();
actualizarContadorPres();
restaurarConfig();
dibujarSectores();
irA('inicio');
