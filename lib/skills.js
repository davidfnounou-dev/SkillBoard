// ---------------------------------------------------------------------------
// Catálogo de oficios (español / inglés) + búsqueda flexible.
//
// Qué hace este archivo:
//  1. Sabe que "Plomería" y "Plumbing" son el mismo oficio, así que:
//     - al cambiar de idioma, el oficio se muestra traducido;
//     - quien busca en inglés encuentra a quien lo escribió en español.
//  2. Es flexible al escribir: sin tildes, con letras dobles ("plomerria"),
//     con errores de ortografía comunes (b/v, s/z/c, h muda, ll/y) y con
//     pequeños errores de tipeo ("plomeira").
//  3. Da sugerencias mientras la persona escribe (como el buscador de YouTube).
//
// Para agregar un oficio nuevo, agrega una línea a RAW:
//   ["Nombre en español", "Name in English", "sinónimos,separados,por,comas"]
// ---------------------------------------------------------------------------

const RAW = [
  // Casa y construcción
  ["Plomería", "Plumbing", "plomero,plomera,fontanero,fontanería,plumber,tuberías,pipes"],
  ["Electricidad", "Electrical work", "electricista,electrician,cableado,wiring,instalaciones eléctricas"],
  ["Carpintería", "Carpentry", "carpintero,carpenter,woodworking,ebanista,muebles de madera"],
  ["Pintura", "Painting", "pintor,pintora,painter,pintar,pintura de casas,house painting"],
  ["Albañilería", "Masonry & construction", "albañil,bricklayer,mason,construcción,construction,obra,contratista,contractor"],
  ["Soldadura", "Welding", "soldador,welder"],
  ["Herrería", "Ironwork", "herrero,blacksmith,rejas,portones,gates,metalistería"],
  ["Aire acondicionado", "Air conditioning", "a/c,ac,aire,hvac,técnico de aire,climatización,ac technician"],
  ["Refrigeración", "Refrigeration", "refrigeradora,nevera,fridge,freezer,técnico de nevera"],
  ["Techos e impermeabilización", "Roofing & waterproofing", "techista,roofer,impermeabilizar,goteras,leaks,roof"],
  ["Pisos y cerámica", "Tile & flooring", "ceramista,tile,pisos,azulejos,flooring,porcelanato"],
  ["Gypsum y cielo raso", "Drywall", "drywall,yeso,gypsum,tabiques,cielo raso,ceiling"],
  ["Cerrajería", "Locksmith", "cerrajero,locksmith,llaves,keys,chapas"],
  ["Vidrio y aluminio", "Glass & aluminum", "vidriero,glazier,ventanas,windows,aluminio,vidrios"],
  ["Paneles solares", "Solar panels", "solar,energía solar,instalación de paneles solares,solar energy"],
  ["Cámaras y alarmas", "Security cameras & alarms", "cámaras,cctv,alarmas,seguridad electrónica,security system"],
  ["Mantenimiento de piscinas", "Pool maintenance", "piscinero,pool,piscina,pool cleaner"],
  ["Fumigación", "Pest control", "fumigador,plagas,exterminador,pest,cucarachas"],
  ["Tapicería", "Upholstery", "tapicero,upholsterer,sillones,sofás,sofa repair"],
  ["Cortinas y persianas", "Blinds & curtains", "cortinas,persianas,blinds,curtains,instalación de cortinas"],
  ["Reparación de electrodomésticos", "Appliance repair", "lavadora,washer,estufa,microondas,appliances,electrodomésticos,secadora"],
  ["Mantenimiento general", "Handyman", "handyman,todero,mil usos,reparaciones,arreglos,maintenance,mantenimiento del hogar"],
  ["Armado de muebles", "Furniture assembly", "ensamblaje,armar muebles,assembly,ikea,montaje de muebles"],
  ["Instalación de TV y audio", "TV & audio installation", "instalar tv,montar televisor,mount tv,televisión,home theater,bocinas"],
  ["Redes e internet", "Networking & internet", "wifi,redes,routers,network,instalación de internet,cableado de red"],
  ["Poda y tala de árboles", "Tree trimming", "tala,poda,tree removal,arborista,arborist,cortar árboles"],
  ["Tanques y sistemas de agua", "Water tanks & systems", "tanques,cisternas,agua potable,bombas de agua,pumps,pozos,wells,filtros de agua,water filters"],
  ["Mudanzas y fletes", "Moving & hauling", "mudanza,flete,movers,carga,hauling,camión,trasteos"],

  // Limpieza y cuidado
  ["Limpieza del hogar", "House cleaning", "limpieza,doméstica,empleada doméstica,maid,cleaner,aseo,limpiador"],
  ["Lavandería y planchado", "Laundry & ironing", "lavandería,planchado,laundry,ironing,lavar ropa,planchadora"],
  ["Cuidado de niños", "Childcare", "niñera,babysitter,nanny,cuidar niños,babysitting,canguro"],
  ["Cuidado de adultos mayores", "Elder care", "cuidador,cuidadora,abuelos,caregiver,senior care,adulto mayor"],
  ["Cuidado de mascotas", "Pet care", "paseador de perros,dog walker,mascotas,pets,pet sitter,perros"],
  ["Peluquería canina", "Dog grooming", "grooming,estética canina,bañar perros,baño de mascotas"],
  ["Peluquería", "Hairdressing", "peluquero,peluquera,estilista,hairdresser,hairstylist,cortes,cabello,hair,salón"],
  ["Barbería", "Barbering", "barbero,barber,barbershop,corte de hombre"],
  ["Manicure y pedicure", "Manicure & pedicure", "manicurista,uñas,nails,pedicure,manicura,nail tech"],
  ["Maquillaje", "Makeup", "maquillista,makeup artist,make up,maquilladora"],
  ["Masajes", "Massage", "masajista,masseur,massage,terapia de masajes,masoterapia"],
  ["Cuidado de la piel", "Skincare", "facial,estética,esthetician,limpieza facial,cosmetología"],

  // Comida
  ["Cocina", "Cooking", "cocinero,cocinera,chef,cook,comida,almuerzos,chef a domicilio,personal chef"],
  ["Repostería", "Baking & pastry", "repostero,pasteles,cakes,baker,postres,desserts,tortas,cupcakes"],
  ["Panadería", "Bakery", "panadero,bakery,pan,bread,panadera"],
  ["Catering y banquetes", "Catering", "catering,banquetes,buffet,comida para eventos,servicio de comida"],
  ["Bartender", "Bartending", "bartender,barman,cócteles,cocktails,mixología,coctelería"],
  ["Mesero", "Waitstaff", "mesera,mesero,waiter,waitress,server,camarero,camarera"],
  ["Pesca", "Fishing", "pescador,fisherman,mariscos,seafood,pescado"],
  ["Agricultura", "Farming", "agricultor,farmer,cultivo,finca,farm,campesino,siembra"],
  ["Jardinería", "Gardening", "jardinero,jardinera,gardener,plantas,plants,paisajismo,landscaping,césped,lawn,jardín"],

  // Transporte y vehículos
  ["Transporte", "Driving & transport", "chofer,conductor,driver,taxi,taxista,transportista,transporte privado"],
  ["Mensajería y entregas", "Delivery & courier", "mensajero,delivery,courier,entregas,domicilio,repartidor,motorizado"],
  ["Transporte en lancha", "Boat transport", "lanchero,boat captain,capitán,bote,lancha,boatman"],
  ["Mecánica automotriz", "Auto mechanic", "mecánico,mecanico,mechanic,carros,autos,car repair,taller,vehículos"],
  ["Latonería y pintura de autos", "Auto body & paint", "latonería,hojalatería,body shop,pintura de carros,collision repair"],
  ["Lavado de autos", "Car wash", "lavado de carros,autolavado,car detailing,detailing,lavacarros"],
  ["Electricidad automotriz", "Auto electrician", "electricista automotriz,car electrician,alternador,batería de carro"],
  ["Mecánica de motos", "Motorcycle repair", "motos,motocicletas,motorcycle,mecánico de motos"],
  ["Llantas y gomería", "Tire shop", "gomero,gomería,llantas,tires,vulcanizadora,pinchazo"],

  // Tecnología y creativo
  ["Reparación de celulares", "Phone repair", "celulares,teléfonos,iphone,phone repair,pantallas,móviles,smartphones"],
  ["Reparación de computadoras", "Computer repair", "computadoras,laptops,pc,ordenadores,soporte técnico,tech support,it support,computadora"],
  ["Desarrollo web", "Web development", "programador,developer,páginas web,websites,programación,software,desarrollador,coding"],
  ["Diseño gráfico", "Graphic design", "diseñador gráfico,graphic designer,logos,branding,diseño"],
  ["Marketing digital y redes sociales", "Digital marketing & social media", "community manager,redes sociales,marketing,social media,publicidad,anuncios"],
  ["Fotografía", "Photography", "fotógrafo,fotografo,photographer,fotos,photos,sesión de fotos"],
  ["Video y edición", "Videography & editing", "videógrafo,video,editor de video,filmmaker,video editing,filmación"],
  ["Música y DJ", "Music & DJ", "dj,músico,musician,sonido,band,banda,disc jockey,música en vivo"],
  ["Clases de música", "Music lessons", "guitarra,piano,music teacher,profesor de música,canto,violín,batería"],
  ["Arte e ilustración", "Art & illustration", "artista,artist,ilustrador,illustrator,murales,murals,dibujo,pintura artística"],
  ["Tatuajes", "Tattoo artist", "tatuador,tattoo,tatuajes,tattoos"],
  ["Redacción y escritura", "Writing & editing", "escritor,writer,redactor,copywriter,corrección,editor,corrección de textos"],
  ["Artesanía", "Handcrafts", "artesano,artisan,molas,crafts,manualidades,handmade,hecho a mano"],
  ["Costura y modistería", "Sewing & tailoring", "costurera,modista,sastre,tailor,seamstress,arreglos de ropa,alterations,dressmaker,costura"],
  ["Zapatería", "Shoe repair", "zapatero,cobbler,shoe repair,reparación de zapatos"],
  ["Joyería y relojería", "Jewelry & watch repair", "joyero,jeweler,relojero,watch repair,joyas,jewelry"],

  // Educación y deporte
  ["Tutorías", "Tutoring", "tutor,profesor particular,clases particulares,maestro,teacher,tutoría,reforzamiento,private lessons"],
  ["Clases de inglés", "English lessons", "inglés,english teacher,idiomas,esl,profesor de inglés,conversación en inglés"],
  ["Clases de matemáticas", "Math tutoring", "matemáticas,math tutor,álgebra,cálculo,algebra,geometría"],
  ["Traducción e interpretación", "Translation & interpreting", "traductor,intérprete,translator,interpreter,traducciones"],
  ["Entrenamiento personal", "Personal training", "entrenador,personal trainer,gimnasio,gym,fitness,ejercicio,entrenador personal"],
  ["Yoga y pilates", "Yoga & Pilates", "yoga,pilates,instructor de yoga,meditación"],
  ["Clases de natación", "Swimming lessons", "natación,swimming,nadar,instructor de natación"],
  ["Entrenador deportivo", "Sports coaching", "fútbol,soccer,béisbol,baseball,coach,entrenador de fútbol,baloncesto,basketball"],

  // Profesionales
  ["Contabilidad", "Accounting", "contador,contadora,accountant,impuestos,taxes,bookkeeping,declaración de renta,finanzas"],
  ["Abogacía", "Legal services", "abogado,abogada,lawyer,attorney,legal,notario,asesoría legal"],
  ["Arquitectura", "Architecture", "arquitecto,arquitecta,architect,planos,blueprints,diseño arquitectónico"],
  ["Ingeniería civil", "Civil engineering", "ingeniero civil,civil engineer,estructural,ingeniero,cálculo estructural"],
  ["Topografía", "Land surveying", "topógrafo,surveyor,agrimensor,mediciones de terreno"],
  ["Diseño de interiores", "Interior design", "interiorista,interior designer,decoración,decoration,decoración de interiores"],
  ["Bienes raíces", "Real estate", "corredor de bienes raíces,realtor,agente inmobiliario,real estate agent,alquiler,venta de casas"],
  ["Seguros", "Insurance", "agente de seguros,insurance agent,pólizas,insurance"],
  ["Trámites y mandados", "Paperwork & errands", "trámites,gestor,mandados,errands,paperwork,gestiones,diligencias"],
  ["Consultoría de negocios", "Business consulting", "consultor,consultant,emprendimiento,negocios,business coach,asesor de negocios"],
  ["Asistente virtual", "Virtual assistant", "secretaria,secretary,assistant,asistente administrativa,oficina,administrative assistant"],
  ["Atención al cliente", "Customer service", "recepcionista,receptionist,call center,servicio al cliente,atención al público"],
  ["Seguridad privada", "Security guard", "guardia,vigilante,security guard,guardia de seguridad,seguridad"],

  // Salud y bienestar
  ["Enfermería a domicilio", "Home nursing", "enfermera,enfermero,nurse,inyecciones,cuidados de enfermería"],
  ["Fisioterapia", "Physical therapy", "fisioterapeuta,physiotherapist,terapia física,rehabilitación,physical therapist"],
  ["Nutrición", "Nutrition", "nutricionista,nutritionist,dieta,diet,plan alimenticio"],
  ["Psicología", "Psychology", "psicólogo,psicologa,psychologist,terapeuta,therapist,counselor,consejería"],
  ["Odontología", "Dentistry", "dentista,dentist,odontólogo,dental"],
  ["Veterinaria", "Veterinary care", "veterinario,veterinaria,veterinarian,vet,animales,animal doctor"],
  ["Medicina general", "General medicine", "doctor,doctora,médico,physician,consulta médica,medicina"],

  // Eventos
  ["Organización de eventos", "Event planning", "organizador de eventos,event planner,bodas,weddings,fiestas,quinceañeras,party planner"],
  ["Decoración de eventos", "Event decoration", "globos,balloons,decoración de fiestas,party decor,decoración de bodas"],
  ["Animación de fiestas", "Party entertainment", "payaso,animador,clown,entertainer,mago,magician,fiestas infantiles,show infantil"],
  ["Alquiler para eventos", "Event rentals", "sillas,mesas,toldos,tents,chairs,tables,alquiler de mobiliario,rentals"],
  ["Floristería", "Floristry", "florería,florista,flores,flowers,arreglos florales,ramos,bouquets,florist"],
  ["Mesa de dulces y cabinas de fotos", "Candy tables & photo booths", "mesa de dulces,candy bar,cabina de fotos,photo booth,dulces para fiestas"],
  ["Alquiler de sonido e iluminación", "Sound & lighting rental", "equipos de sonido,luces para eventos,sound system,lighting rental,tarima,stage"],

  // Más oficios de casa y construcción
  ["Concreto y vaciado", "Concrete work", "concreto,vaciado,losa,cemento,fundaciones,concrete,foundations,aceras"],
  ["Excavación y movimiento de tierra", "Excavation & earthmoving", "excavadora,retroexcavadora,backhoe,excavation,relleno,movimiento de tierra,bulldozer"],
  ["Cercas y portones", "Fencing & gates", "cercas,cerca,verjas,fence,portones eléctricos,automatic gates,mallas ciclón"],
  ["Pulido y barnizado de pisos", "Floor sanding & varnishing", "pulido de pisos,barniz,floor sanding,floor polishing,lustrado,encerado"],
  ["Instalación de luminarias y ventiladores", "Lighting & fan installation", "luminarias,ventiladores,lámparas,ceiling fan,light fixtures,instalar lámparas"],
  ["Instalación de gas", "Gas installation", "gas,tanque de gas,gas lp,gas fitter,estufa de gas,cocina a gas"],
  ["Plantas eléctricas y generadores", "Generators & power plants", "generador,planta eléctrica,generator,inversor,ups,power backup"],
  ["Limpieza de alfombras y tapizados", "Carpet & upholstery cleaning", "alfombras,limpieza de sofás,carpet cleaning,lavado de muebles,shampoo de alfombras"],
  ["Limpieza de vidrios y fachadas", "Window & facade cleaning", "limpiavidrios,window cleaning,lavado de fachadas,pressure washing,hidrolavado"],
  ["Limpieza después de obra", "Post-construction cleaning", "limpieza de obra,limpieza final,construction cleanup,limpieza de apartamento nuevo"],
  ["Muebles a medida", "Custom furniture", "muebles a medida,closets,clóset,cocinas integrales,custom cabinets,kitchen cabinets,gabinetes"],
  ["Mantenimiento de edificios", "Building maintenance", "conserje,janitor,mantenimiento de edificios,building maintenance,portero,custodio"],
  ["Administración de propiedades", "Property management", "administrador de propiedades,property manager,alquileres,airbnb,hospedaje,vacation rental,condominios"],

  // Campo, mar y naturaleza
  ["Ganadería", "Cattle ranching", "ganadero,ganado,rancher,vacas,livestock,leche,lechería"],
  ["Apicultura", "Beekeeping", "apicultor,miel,abejas,honey,beekeeper"],
  ["Cría de aves y animales de granja", "Poultry & farm animals", "gallinas,pollos,huevos,eggs,cerdos,pigs,granja,chickens,avicultura"],
  ["Viveros y plantas ornamentales", "Plant nursery", "vivero,plantas ornamentales,nursery,orquídeas,orchids,plantas de interior,houseplants"],
  ["Reparación de lanchas y botes", "Boat repair", "mecánico naval,boat mechanic,motor fuera de borda,outboard,fibra de vidrio,reparación de botes"],
  ["Pesca deportiva", "Sport fishing charters", "pesca deportiva,sport fishing,charter de pesca,fishing guide,guía de pesca"],
  ["Buceo y snorkel", "Diving & snorkeling", "buceo,instructor de buceo,dive instructor,snorkel,scuba,dive guide"],
  ["Surf y deportes acuáticos", "Surf & water sports", "surf,instructor de surf,surf teacher,kayak,paddle,kitesurf,wakeboard"],
  ["Guía turístico", "Tour guide", "guía de turismo,tour operator,turismo,tourism,city tour,ecoturismo,birdwatching,avistamiento de aves"],
  ["Agencia de viajes", "Travel agent", "agente de viajes,viajes,travel agency,boletos,tickets,paquetes turísticos,tour packages"],

  // Comida típica y más cocina
  ["Comida típica panameña", "Traditional Panamanian food", "comida típica,tamales,sancocho,hojaldras,carimañolas,arroz con pollo,empanadas,fritanga,típico"],
  ["Parrilla y asados", "BBQ & grilling", "parrillero,asador,bbq,barbacoa,asados,grill,carnes a la parrilla"],
  ["Jugos y bebidas naturales", "Fresh juices & drinks", "jugos naturales,batidos,smoothies,chicha,refrescos naturales,juice bar,kombucha"],
  ["Heladería y postres fríos", "Ice cream & frozen treats", "helados,raspados,ice cream,paletas,gelato,postres fríos,frozen desserts"],
  ["Cocina internacional", "International cuisine", "sushi,comida italiana,pasta,comida china,comida árabe,mexican food,cocina de autor,gourmet"],
  ["Comida saludable y meal prep", "Healthy meals & meal prep", "comida saludable,meal prep,dieta,fitness food,comida vegana,vegan,vegetariana,almuerzos saludables"],

  // Vehículos y transporte
  ["Grúa y remolque", "Towing", "grúa,remolque,tow truck,asistencia vial,roadside assistance,auxilio vial"],
  ["Transporte escolar", "School transport", "transporte escolar,bus escolar,school bus,ruta escolar,van escolar"],
  ["Audio y accesorios para autos", "Car audio & accessories", "audio de carro,car audio,polarizado,tint,alarmas de carro,accesorios,vidrios polarizados"],
  ["Reparación de bicicletas", "Bike repair", "bicicletas,bicicleta,bike mechanic,bicycle repair,ciclismo,bike shop"],
  ["Alquiler de vehículos", "Vehicle rental", "alquiler de carros,rent a car,car rental,alquiler de autos,alquiler de motos"],

  // Tecnología y creativo
  ["Drones y fotografía aérea", "Drones & aerial photography", "drones,dron,drone pilot,fotografía aérea,aerial video,piloto de dron"],
  ["Impresión 3D", "3D printing", "3d,impresión 3d,3d printer,prototipos,prototyping,modelado 3d"],
  ["Edición y retoque de fotos", "Photo editing & retouching", "retoque,photoshop,photo editing,restauración de fotos,photo restoration,lightroom"],
  ["Animación y motion graphics", "Animation & motion graphics", "animación,animator,motion graphics,after effects,dibujos animados,2d,3d animation"],
  ["Análisis de datos", "Data analysis", "datos,data analyst,excel,power bi,estadística,statistics,reportes,dashboards,hojas de cálculo"],
  ["Creación de contenido", "Content creation", "creador de contenido,content creator,influencer,youtuber,tiktok,podcast,reels,streaming"],
  ["Impresión, rotulación y serigrafía", "Printing, signage & screen printing", "imprenta,rotulación,rótulos,serigrafía,sublimación,printing,signs,banners,vinil,tarjetas de presentación"],
  ["Bordados y uniformes", "Embroidery & uniforms", "bordado,uniformes,embroidery,estampado,camisetas personalizadas,custom t-shirts,gorras"],

  // Educación, arte y deporte
  ["Clases de baile", "Dance lessons", "baile,bailarín,salsa,bachata,tambor,folklore,dance teacher,ballet,zumba,reggaetón"],
  ["Clases de manejo", "Driving lessons", "clases de manejo,instructor de manejo,driving instructor,licencia de conducir,driver's license"],
  ["Preparación de exámenes", "Test prep", "sat,act,toefl,ielts,preparación de exámenes,test preparation,examen de admisión,universidad,college prep"],
  ["Apoyo escolar y tareas", "Homework help", "tareas,apoyo escolar,homework help,refuerzo escolar,niños con tareas,doposcuola,after school"],
  ["Estimulación temprana", "Early childhood stimulation", "estimulación temprana,preescolar,preschool,kinder,early learning,maestra de preescolar"],
  ["Lengua de señas", "Sign language", "lengua de señas,sign language,señas,asl,intérprete de señas,sordos"],
  ["Clases de computación", "Computer lessons", "computación,clases de computadora,computer classes,office,word,excel básico,alfabetización digital"],
  ["Ajedrez", "Chess lessons", "ajedrez,chess,entrenador de ajedrez,torneos de ajedrez"],
  ["Artes marciales y boxeo", "Martial arts & boxing", "karate,taekwondo,judo,boxeo,boxing,jiu jitsu,muay thai,defensa personal,self defense,mma"],
  ["Cerámica y alfarería", "Pottery & ceramics", "alfarería,cerámica artística,pottery,barro,ceramics,torno de alfarero"],
  ["Tejido y crochet", "Knitting & crochet", "tejido,crochet,knitting,ganchillo,macramé,bordado a mano,hand embroidery"],
  ["Velas y jabones artesanales", "Handmade candles & soap", "velas,jabones,candles,soap,aromaterapia,productos artesanales,cosmética natural"],
  ["Diseño de modas", "Fashion design", "diseñador de modas,fashion designer,diseño de ropa,patronaje,pattern making,ropa a medida,moda"],
  ["Asesoría de imagen y estilo", "Personal styling", "estilista de imagen,personal stylist,asesor de imagen,image consultant,armario,colorimetría"],

  // Salud y belleza
  ["Depilación", "Waxing & hair removal", "depilación,cera,waxing,depilación láser,laser hair removal,threading"],
  ["Terapia del lenguaje", "Speech therapy", "fonoaudiología,terapia del lenguaje,speech therapist,logopeda,problemas de habla"],
  ["Quiropráctica y acupuntura", "Chiropractic & acupuncture", "quiropráctico,chiropractor,acupuntura,acupuncture,medicina alternativa,ventosas,cupping"],
  ["Óptica", "Optical services", "óptica,optometrista,optometrist,lentes,gafas,glasses,examen de la vista"],
  ["Cuidado posparto y lactancia", "Postpartum & lactation care", "doula,posparto,postpartum,lactancia,lactation consultant,cuidado de recién nacidos,newborn care"],
  ["Primeros auxilios y capacitación", "First aid training", "primeros auxilios,first aid,cpr,rcp,capacitación en seguridad,safety training,paramédico"],

  // Negocios y trámites
  ["Corredor de aduanas e importaciones", "Customs brokerage & imports", "aduana,corredor de aduanas,customs broker,importaciones,imports,exportaciones,exports,zona libre"],
];

// ---------------------------------------------------------------------------
// Normalización
// ---------------------------------------------------------------------------

/** minúsculas, sin tildes ni signos, espacios simples: "Plomería!" -> "plomeria" */
export function norm(input) {
  return String(input == null ? "" : input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * "Llave de comparación" tolerante a errores de ortografía.
 * Dos textos que suenan parecido dan la misma llave:
 *   plomeria / plomerria / plomeria  -> "plomeria"
 *   vidriero / bidriero              -> igual
 *   cerrajero / serrajero            -> igual
 */
export function phon(input) {
  return norm(input)
    .replace(/ch/g, "X")        // protege "ch" antes de quitar la h muda
    .replace(/h/g, "")
    .replace(/ll/g, "y")
    .replace(/qu/g, "k")
    .replace(/c(?=[ei])/g, "s")
    .replace(/c/g, "k")
    .replace(/z/g, "s")
    .replace(/v/g, "b")
    .replace(/g(?=[ei])/g, "j")
    .replace(/(.)\1+/g, "$1");  // letras dobles -> una sola
}

// Distancia de edición (cuántas letras hay que cambiar para llegar de a a b).
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

function wordMatch(q, w) {
  if (w.startsWith(q) || (q.length >= 3 && w.includes(q))) return true;
  // Errores de tipeo: solo con palabras de 4+ letras y la misma primera letra
  if (q.length < 4 || q[0] !== w[0]) return false;
  const tolerance = q.length >= 8 ? 2 : 1;
  if (lev(q, w) <= tolerance) return true;
  // La persona todavía está escribiendo y se equivocó en una letra
  if (q.length >= 5 && w.length > q.length && lev(q, w.slice(0, q.length)) <= tolerance) return true;
  return false;
}

/** ¿La llave de búsqueda (qKey) coincide con esta llave de texto (tKey)? */
function keyMatches(qKey, tKey) {
  if (!qKey) return true;
  if (tKey.includes(qKey)) return true;
  const tw = tKey.split(" ");
  return qKey.split(" ").every((q) => tw.some((w) => wordMatch(q, w)));
}

/** Coincidencia flexible de un texto cualquiera (nombre de persona, zona…). */
export function textMatches(qKey, text) {
  return keyMatches(qKey, phon(text));
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export const CATALOG = RAW.map(([es, en, aliases]) => {
  const list = aliases ? aliases.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return {
    id: norm(es).replace(/ /g, "-"),
    es,
    en,
    keys: [es, en, ...list].map(phon),
  };
});

const KEY_INDEX = new Map();
CATALOG.forEach((entry) =>
  entry.keys.forEach((k) => {
    if (!KEY_INDEX.has(k)) KEY_INDEX.set(k, entry);
  })
);

const entryCache = new Map();

/** Busca el oficio del catálogo que corresponde a un texto (o null si es uno personalizado). */
export function findEntry(name) {
  const k = phon(name);
  if (!k) return null;
  if (entryCache.has(k)) return entryCache.get(k);
  let found = KEY_INDEX.get(k) || null;
  if (!found && k.length >= 5) {
    // Un error de tipeo pequeño: "plomeira" -> Plomería
    for (const [key, entry] of KEY_INDEX) {
      if (Math.abs(key.length - k.length) <= 1 && lev(key, k) <= 1) {
        found = entry;
        break;
      }
    }
  }
  entryCache.set(k, found);
  return found;
}

/** Nombre del oficio en el idioma activo ("Plomería" <-> "Plumbing"). */
export function skillLabel(name, lang) {
  const entry = findEntry(name);
  return entry ? entry[lang] || entry.es : name;
}

/** Identificador estable de un oficio (para contar oficios distintos). */
export function skillId(name) {
  const entry = findEntry(name);
  return entry ? entry.id : "c:" + phon(name);
}

/** Lo que se guarda en la base de datos: el nombre en español si está en el catálogo. */
export function canonicalSkillName(name) {
  const entry = findEntry(name);
  return entry ? entry.es : String(name || "").trim();
}

/** ¿Este oficio responde a la búsqueda (en español, inglés, con errores, etc.)? */
export function skillMatches(skillName, qKey) {
  if (!qKey) return true;
  const entry = findEntry(skillName);
  if (entry && entry.keys.some((k) => keyMatches(qKey, k))) return true;
  return textMatches(qKey, skillName);
}

/** Lista de oficios del catálogo en el idioma activo (para los autocompletar). */
export function catalogLabels(lang) {
  return CATALOG.map((e) => e[lang] || e.es).sort((a, b) => a.localeCompare(b, lang));
}

// ---------------------------------------------------------------------------
// Sugerencias mientras se escribe
// ---------------------------------------------------------------------------

/**
 * @param query       lo que la persona lleva escrito
 * @param lang        "es" | "en"
 * @param boardSkills lista de nombres de oficios que existen en el tablero (con repetidos)
 * @returns [{ id, label, count }] ordenado por relevancia
 */
export function suggestSkills(query, lang, boardSkills, limit = 6) {
  const qKey = phon(query);

  // Cuántas personas tiene cada oficio en el tablero
  const counts = new Map();
  const customLabels = new Map();
  (boardSkills || []).forEach((name) => {
    const id = skillId(name);
    counts.set(id, (counts.get(id) || 0) + 1);
    if (!findEntry(name) && !customLabels.has(id)) customLabels.set(id, String(name).trim());
  });

  const candidates = CATALOG.map((e) => ({
    id: e.id,
    label: e[lang] || e.es,
    keys: e.keys,
    labelKey: phon(e[lang] || e.es),
  }));
  customLabels.forEach((label, id) =>
    candidates.push({ id, label, keys: [phon(label)], labelKey: phon(label) })
  );

  // Sin texto: mostrar los oficios más populares del tablero
  if (!qKey) {
    return candidates
      .map((c) => ({ id: c.id, label: c.label, count: counts.get(c.id) || 0 }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, lang))
      .slice(0, limit);
  }

  const scored = [];
  candidates.forEach((c) => {
    let score = null;
    if (c.labelKey.startsWith(qKey)) score = 0;
    else if (c.keys.some((k) => k.startsWith(qKey))) score = 1;
    else if (c.labelKey.split(" ").some((w) => w.startsWith(qKey))) score = 2;
    else if (c.keys.some((k) => k.split(" ").some((w) => w.startsWith(qKey)))) score = 2;
    else if (qKey.length >= 4 && c.keys.some((k) => k.includes(qKey))) score = 3;
    else if (qKey.length >= 5 && c.keys.some((k) => keyMatches(qKey, k))) score = 4; // con errores de tipeo
    if (score !== null) {
      scored.push({ id: c.id, label: c.label, count: counts.get(c.id) || 0, score });
    }
  });
  // Las coincidencias con errores de tipeo solo se muestran si no hay suficientes buenas
  if (scored.filter((s) => s.score <= 3).length >= 3) {
    for (let i = scored.length - 1; i >= 0; i--) if (scored[i].score === 4) scored.splice(i, 1);
  }

  scored.sort(
    (a, b) =>
      a.score - b.score ||
      (b.count > 0) - (a.count > 0) ||
      b.count - a.count ||
      a.label.localeCompare(b.label, lang)
  );
  return scored.slice(0, limit).map(({ id, label, count }) => ({ id, label, count }));
}

// ---------------------------------------------------------------------------
// Zonas de Panamá (sugerencias para el campo "Ubicación")
// ---------------------------------------------------------------------------

export const ZONES = [
  "Ciudad de Panamá", "San Miguelito", "Panamá Norte", "Tocumen", "Pacora", "Las Cumbres",
  "Chilibre", "Panamá Oeste", "La Chorrera", "Arraiján", "Capira", "Chame", "Coronado",
  "Colón", "Portobelo", "Sabanitas", "Cativá", "David", "Boquete", "Volcán", "Puerto Armuelles",
  "Bocas del Toro", "Almirante", "Santiago", "Soná", "Chitré", "Las Tablas", "Penonomé",
  "Aguadulce", "Antón", "Darién", "Metetí", "Guna Yala", "Herrera", "Los Santos", "Veraguas",
  "Coclé", "Chiriquí",
];
