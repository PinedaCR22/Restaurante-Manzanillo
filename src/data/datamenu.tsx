// Tipos
export type MenuItem = { 
  id: string;
  name: string;
  price?: string;
  image: string;
  description?: string;
};

export type CategoryData = {
  id: string;
  name: string;
  cover: string;           
  items: MenuItem[];
};

export const DATA_MENU: Record<string, CategoryData> = {
  // ================== CEVICHES ==================
  ceviches: {
    id: "ceviches",
    name: "Ceviches",
    cover: "https://i.ytimg.com/vi/YF-yzSOyQsE/maxresdefault.jpg",
    items: [
      {
        id: "ceviche-clasico",
        name: "Ceviche clásico",
        price: "₡4,500",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        description: "Pescado blanco fresco, limón, cebolla morada, chile dulce, culantro."
      },
      { id: "ceviche-camaron", name: "Ceviche de camarón", price: "₡6,000", image: "https://images.unsplash.com/photo-1613478223719-3c1f0b6a3b3d?q=80&w=1200&auto=format&fit=crop", description: "Camarón cocido en limón con cebolla y culantro." },
      { id: "ceviche-mixto", name: "Ceviche mixto", price: "₡6,800", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop", description: "Combinación de pescado, camarón y calamar." },
      { id: "ceviche-pulpo", name: "Ceviche de pulpo", price: "₡7,500", image: "https://images.unsplash.com/photo-1604908554063-7a4b9a2b2b7c?q=80&w=1200&auto=format&fit=crop", description: "Pulpo tierno con limón, aceite de oliva y ajo." },
      { id: "ceviche-coco", name: "Ceviche caribeño", price: "₡8,000", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop", description: "Con leche de coco y especias tropicales." },
      { id: "ceviche-aguacate", name: "Ceviche con aguacate", price: "₡6,800", image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8d7?q=80&w=1200&auto=format&fit=crop", description: "Pescado fresco con aguacate en cubos." },
      { id: "ceviche-tropical", name: "Ceviche tropical", price: "₡7,000", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", description: "Con mango, piña y hierbas frescas." },
      { id: "ceviche-calamar", name: "Ceviche de calamar", price: "₡7,200", image: "https://images.unsplash.com/photo-1604908176997-4a9ed0af0d1f?q=80&w=1200&auto=format&fit=crop", description: "Calamar con limón y apio crocante." },
      { id: "ceviche-veg", name: "Ceviche vegetariano", price: "₡5,800", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", description: "Hongos y vegetales en limón." },
      { id: "ceviche-patacon", name: "Ceviche con patacones", price: "₡6,200", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop", description: "Ceviche clásico acompañado de patacones." },
    ],
  },

  // ================== MARISCOS ==================
  mariscos: {
    id: "mariscos",
    name: "Mariscos",
    cover: "https://media.istockphoto.com/id/1305699663/es/foto/plato-de-mariscos-langosta-a-la-parrilla-camarones-vieiras-langostinos-pulpo-calamar-en-plato.jpg?s=612x612&w=0&k=20&c=H_dWTXDSIuNKsdyN-WCZB8X--1Iy64V4m4E4Zq9wns4=",
    items: [
      { id: "parrillada-mariscos", name: "Parrillada de mariscos", price: "₡12,500", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop", description: "Mezcla de camarones, calamar, pescado y mejillones a la parrilla." },
      { id: "camarones-ajo", name: "Camarones al ajillo", price: "₡8,500", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Camarones salteados con ajo y mantequilla." },
      { id: "langosta", name: "Langosta a la parrilla", price: "₡15,000", image: "https://images.unsplash.com/photo-1604908176997-4a9ed0af0d1f?q=80&w=1200&auto=format&fit=crop", description: "Langosta fresca a la parrilla con mantequilla de ajo." },
      { id: "pulpo-gallega", name: "Pulpo a la gallega", price: "₡10,500", image: "https://images.unsplash.com/photo-1604908554063-7a4b9a2b2b7c?q=80&w=1200&auto=format&fit=crop", description: "Pulpo en rodajas con pimentón y aceite de oliva." },
      { id: "calamares-fritos", name: "Calamares fritos", price: "₡7,900", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Calamares empanizados con salsa tártara." },
      { id: "mejillones", name: "Mejillones al vino blanco", price: "₡9,200", image: "https://images.unsplash.com/photo-1604908176997-4a9ed0af0d1f?q=80&w=1200&auto=format&fit=crop", description: "Mejillones frescos al vapor con vino blanco y ajo." },
      { id: "paella-mariscos", name: "Paella de mariscos", price: "₡13,000", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Arroz con camarones, calamares, mejillones y langostinos." },
      { id: "camarones-coco", name: "Camarones empanizados con coco", price: "₡9,800", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Camarones empanizados con coco rallado y salsa dulce." },
      { id: "sopa-mariscos", name: "Sopa de mariscos", price: "₡8,900", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Caldo de pescado con camarones, mejillones y especias." },
      { id: "ostras", name: "Ostras frescas", price: "₡11,500", image: "https://images.unsplash.com/photo-1604908176997-4a9ed0af0d1f?q=80&w=1200&auto=format&fit=crop", description: "Servidas en su concha con limón." },
    ],
  },

  // ================== PESCADOS ==================
  pescados: {
    id: "pescados",
    name: "Pescados",
    cover: "https://www.recetasnestle.com.co/sites/default/files/inline-images/Recetas_2_-Mojarra-con-ensalada-de-aguacate%2C-arroz-con-coco%2C-pla%CC%81tano-y-limo%CC%81n_1200x500.jpeg",
    items: [
      { id: "pescado-frito", name: "Pescado frito entero", price: "₡7,900", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Mojarra entera frita, acompañada de ensalada y patacones." },
      { id: "filete-mantequilla", name: "Filete en mantequilla", price: "₡8,200", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Filete de pescado a la plancha con mantequilla y ajo." },
      { id: "pescado-ajo", name: "Filete al ajillo", price: "₡8,500", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Filete bañado en salsa de ajo fresco." },
      { id: "pescado-coco", name: "Filete al coco", price: "₡9,000", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", description: "Filete en salsa de leche de coco y especias caribeñas." },
      { id: "tilapia", name: "Tilapia a la plancha", price: "₡7,800", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Tilapia fresca con limón y culantro." },
      { id: "salmon", name: "Salmón grillado", price: "₡12,000", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Salmón a la parrilla con vegetales al vapor." },
      { id: "pescado-criolla", name: "Filete a la criolla", price: "₡8,700", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Con salsa criolla de tomate, cebolla y chile." },
      { id: "pescado-salsa", name: "Pescado en salsa blanca", price: "₡9,200", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Filete bañado en salsa blanca cremosa." },
      { id: "trucha", name: "Trucha a la mantequilla", price: "₡10,500", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Trucha fresca de montaña con mantequilla de hierbas." },
      { id: "sudado", name: "Sudado de pescado", price: "₡8,600", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", description: "Pescado en caldo con vegetales y yuca." },
    ],
  },

  // ================== CASADOS ==================
  casados: {
    id: "casados",
    name: "Casados",
    cover: "https://morphocostarica.com/wp-content/uploads/2020/03/Casado.jpg",
    items: [
      { id: "casado-pollo", name: "Casado con pollo", price: "₡5,900", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Arroz, frijoles, ensalada y pollo guisado." },
      { id: "casado-pescado", name: "Casado con pescado", price: "₡6,200", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Arroz, frijoles, ensalada y filete de pescado." },
      { id: "casado-carne", name: "Casado con carne", price: "₡6,500", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Con carne en salsa criolla." },
      { id: "casado-cerdo", name: "Casado con cerdo", price: "₡6,200", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Con chuleta de cerdo a la plancha." },
      { id: "casado-mixto", name: "Casado mixto", price: "₡7,000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Carne, pollo y pescado en un mismo plato." },
      { id: "casado-vegetariano", name: "Casado vegetariano", price: "₡5,500", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", description: "Arroz, frijoles, plátano maduro y vegetales." },
      { id: "casado-huevo", name: "Casado con huevo", price: "₡5,200", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Acompañado con huevos fritos y plátano maduro." },
      { id: "casado-chorizo", name: "Casado con chorizo", price: "₡6,000", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop", description: "Con chorizo criollo y tortilla casera." },
      { id: "casado-lomo", name: "Casado con lomo", price: "₡6,800", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Con lomo de res en salsa." },
      { id: "casado-gallina", name: "Casado con gallina", price: "₡6,300", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", description: "Con gallina criolla guisada." },
    ],
  },

  // ================== BATIDOS ==================
  batidos: {
    id: "batidos",
    name: "Batidos",
    cover: "https://hiraoka.com.pe/media/mageplaza/blog/post/j/u/juegos_y_batidos_saludables_nutritivos-hiraoka.jpg",
    items: [
      { id: "batido-fresa", name: "Batido de fresa", price: "₡2,800", image: "https://images.unsplash.com/photo-1572491521127-1462b5f0f8b7?q=80&w=1200&auto=format&fit=crop", description: "Fresas frescas con leche." },
      { id: "batido-mora", name: "Batido de mora", price: "₡2,800", image: "https://images.unsplash.com/photo-1572491521127-1462b5f0f8b7?q=80&w=1200&auto=format&fit=crop", description: "Moras ácidas mezcladas con leche o agua." },
      { id: "batido-guanabana", name: "Batido de guanábana", price: "₡3,000", image: "https://images.unsplash.com/photo-1502741126161-b048400d0768?q=80&w=1200&auto=format&fit=crop", description: "Guanábana cremosa y refrescante." },
      { id: "batido-mango", name: "Batido de mango", price: "₡2,900", image: "https://images.unsplash.com/photo-1610440042657-6125aeb9ac73?q=80&w=1200&auto=format&fit=crop", description: "Mango maduro con leche o agua." },
      { id: "batido-pina", name: "Batido de piña", price: "₡2,700", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1200&auto=format&fit=crop", description: "Piña fresca con hielo y azúcar." },
      { id: "batido-papaya", name: "Batido de papaya", price: "₡2,800", image: "https://images.unsplash.com/photo-1502741126161-b048400d0768?q=80&w=1200&auto=format&fit=crop", description: "Papaya dulce con leche o agua." },
      { id: "batido-melon", name: "Batido de melón", price: "₡2,800", image: "https://images.unsplash.com/photo-1610440042657-6125aeb9ac73?q=80&w=1200&auto=format&fit=crop", description: "Melón fresco licuado con hielo." },
      { id: "batido-banano", name: "Batido de banano", price: "₡2,800", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1200&auto=format&fit=crop", description: "Banano maduro con leche." },
      { id: "batido-mixto", name: "Batido mixto", price: "₡3,200", image: "https://images.unsplash.com/photo-1572491521127-1462b5f0f8b7?q=80&w=1200&auto=format&fit=crop", description: "Combinación de frutas tropicales." },
      { id: "batido-avena", name: "Batido de avena", price: "₡3,000", image: "https://images.unsplash.com/photo-1502741126161-b048400d0768?q=80&w=1200&auto=format&fit=crop", description: "Avena licuada con banano y leche." },
    ],
  },

  // ================== COMIDA RÁPIDA ==================
  "com-rapida": {
    id: "com-rapida",
    name: "Comida rápida",
    cover: "https://images.unsplash.com/photo-1550547660-d9450f859349?fm=jpg&q=60&w=3000",
    items: [
      { id: "hamburguesa-clasica", name: "Hamburguesa clásica", price: "₡4,900", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop", description: "Carne de res, lechuga, tomate y queso." },
      { id: "hamburguesa-pollo", name: "Hamburguesa de pollo", price: "₡4,800", image: "https://images.unsplash.com/photo-1606755962773-0b98d1a0fba5?q=80&w=1200&auto=format&fit=crop", description: "Pechuga empanizada con ensalada." },
      { id: "hamburguesa-bacon", name: "Hamburguesa con bacon", price: "₡5,200", image: "https://images.unsplash.com/photo-1610440042657-6125aeb9ac73?q=80&w=1200&auto=format&fit=crop", description: "Carne de res con tocineta crujiente." },
      { id: "perro-caliente", name: "Perro caliente", price: "₡3,500", image: "https://images.unsplash.com/photo-1610440042657-6125aeb9ac73?q=80&w=1200&auto=format&fit=crop", description: "Salchicha, repollo y salsas." },
      { id: "sandwich", name: "Sándwich club", price: "₡4,200", image: "https://images.unsplash.com/photo-1606755962773-0b98d1a0fba5?q=80&w=1200&auto=format&fit=crop", description: "Pan, pollo, jamón y queso." },
      { id: "papas-fritas", name: "Papas fritas", price: "₡2,200", image: "https://images.unsplash.com/photo-1586190848861-99aa4b96c9f8?q=80&w=1200&auto=format&fit=crop", description: "Papas crujientes con sal." },
      { id: "nachos", name: "Nachos con queso", price: "₡3,800", image: "https://images.unsplash.com/photo-1586190848861-99aa4b96c9f8?q=80&w=1200&auto=format&fit=crop", description: "Totopos con queso fundido y guacamole." },
      { id: "pizza-personal", name: "Pizza personal", price: "₡5,500", image: "https://images.unsplash.com/photo-1594007654729-df3bdf0aa57a?q=80&w=1200&auto=format&fit=crop", description: "Pizza individual con ingredientes a elegir." },
      { id: "burrito", name: "Burrito de pollo", price: "₡4,800", image: "https://images.unsplash.com/photo-1606755962773-0b98d1a0fba5?q=80&w=1200&auto=format&fit=crop", description: "Tortilla de harina rellena de pollo y frijoles." },
      { id: "quesadilla", name: "Quesadilla", price: "₡4,200", image: "https://images.unsplash.com/photo-1594007654729-df3bdf0aa57a?q=80&w=1200&auto=format&fit=crop", description: "Tortilla de harina con queso fundido." },
    ],
  },

  // ================== ALCOHOL ==================
  alcohol: {
    id: "alcohol",
    name: "Alcohol",
    cover: "https://media.istockphoto.com/id/475273684/es/foto/frascos-y-gafas-de-una-variedad-de-bebidas-alcoh%C3%B3licas.jpg?s=612x612&w=0&k=20&c=SgFGQskDEHv_--Teekq_J4DQ7rOdZybPSX2j37H51Ck=",
    items: [
      { id: "cerveza", name: "Cerveza nacional", price: "₡1,800", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c76d9?q=80&w=1200&auto=format&fit=crop", description: "Botella de cerveza lager nacional." },
      { id: "cerveza-importada", name: "Cerveza importada", price: "₡2,500", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Selección de cervezas internacionales." },
      { id: "ron", name: "Ron", price: "₡3,500", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c76d9?q=80&w=1200&auto=format&fit=crop", description: "Ron oscuro o añejo." },
      { id: "whisky", name: "Whisky", price: "₡5,000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Trago de whisky escocés o americano." },
      { id: "vodka", name: "Vodka", price: "₡4,000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Vodka servido en las rocas." },
      { id: "tequila", name: "Tequila", price: "₡3,800", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Caballito de tequila reposado." },
      { id: "gin-tonic", name: "Gin tonic", price: "₡4,200", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Cóctel clásico de ginebra y tónica." },
      { id: "coctel-casa", name: "Cóctel de la casa", price: "₡4,800", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Creación especial del bartender." },
      { id: "licor-cafe", name: "Licor de café", price: "₡3,200", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Licor dulce con base de café." },
      { id: "sangria", name: "Sangría", price: "₡4,500", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c76d9?q=80&w=1200&auto=format&fit=crop", description: "Bebida refrescante de vino con frutas." },
    ],
  },

  // ================== COCTELES ==================
  cocteles: {
    id: "cocteles",
    name: "Cocteles",
    cover: "https://animalgourmet.com/wp-content/uploads/2019/12/cocteles-faciles-1-e1577462291521.jpg",
    items: [
      { id: "piña-colada", name: "Piña colada", price: "₡3,800", image: "https://images.unsplash.com/photo-1570739283879-801db1c376cc?q=80&w=1200&auto=format&fit=crop", description: "Ron, crema de coco y jugo de piña." },
      { id: "mojito", name: "Mojito", price: "₡3,500", image: "https://images.unsplash.com/photo-1570739283879-801db1c376cc?q=80&w=1200&auto=format&fit=crop", description: "Ron, hierbabuena, azúcar y soda." },
      { id: "margarita", name: "Margarita", price: "₡3,800", image: "https://images.unsplash.com/photo-1558640476-437a2a99d7d5?q=80&w=1200&auto=format&fit=crop", description: "Tequila, triple sec y jugo de limón." },
      { id: "caipirinha", name: "Caipirinha", price: "₡3,500", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Cachaça, azúcar y limón." },
      { id: "daiquiri", name: "Daiquiri", price: "₡3,600", image: "https://images.unsplash.com/photo-1558640476-437a2a99d7d5?q=80&w=1200&auto=format&fit=crop", description: "Ron, limón y azúcar." },
      { id: "negroni", name: "Negroni", price: "₡4,200", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Ginebra, vermut rojo y Campari." },
      { id: "bloody-mary", name: "Bloody Mary", price: "₡4,000", image: "https://images.unsplash.com/photo-1558640476-437a2a99d7d5?q=80&w=1200&auto=format&fit=crop", description: "Vodka, jugo de tomate y especias." },
      { id: "tequila-sunrise", name: "Tequila Sunrise", price: "₡4,000", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Tequila, jugo de naranja y granadina." },
      { id: "cosmopolitan", name: "Cosmopolitan", price: "₡4,200", image: "https://images.unsplash.com/photo-1625940928780-7b35d3c21f30?q=80&w=1200&auto=format&fit=crop", description: "Vodka, triple sec, jugo de arándano y lima." },
      { id: "mai-tai", name: "Mai Tai", price: "₡4,500", image: "https://images.unsplash.com/photo-1558640476-437a2a99d7d5?q=80&w=1200&auto=format&fit=crop", description: "Ron oscuro, ron blanco y jugos tropicales." },
    ],
  },

  // ================== VINOS ==================
  vinos: {
    id: "vinos",
    name: "Vinos",
    cover: "https://vivancoculturadevino.es/blog/wp-content/uploads/2015/07/vino-rosado-blanco-tinto.jpg",
    items: [
      { id: "vino-tinto", name: "Vino tinto", price: "₡6,900", image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop", description: "Copa de vino tinto seco." },
      { id: "vino-blanco", name: "Vino blanco", price: "₡6,900", image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop", description: "Copa de vino blanco afrutado." },
      { id: "vino-rosado", name: "Vino rosado", price: "₡6,900", image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1200&auto=format&fit=crop", description: "Copa de vino rosado ligero." },
      { id: "vino-espumante", name: "Vino espumante", price: "₡7,500", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de vino espumante italiano." },
      { id: "vino-cabernet", name: "Cabernet Sauvignon", price: "₡7,800", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de cabernet de cuerpo robusto." },
      { id: "vino-merlot", name: "Merlot", price: "₡7,800", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de Merlot suave y afrutado." },
      { id: "vino-chardonnay", name: "Chardonnay", price: "₡7,800", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de Chardonnay fresco." },
      { id: "vino-sauvignon", name: "Sauvignon Blanc", price: "₡7,800", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de Sauvignon Blanc cítrico." },
      { id: "vino-rioja", name: "Rioja", price: "₡8,200", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de Rioja español." },
      { id: "vino-malbec", name: "Malbec", price: "₡8,200", image: "https://images.unsplash.com/photo-1524592094714-0f0654e203a0?q=80&w=1200&auto=format&fit=crop", description: "Copa de Malbec argentino." },
    ],
  },
  };

// Lista de categorías para la grilla inicial
export const CATEGORIES_FOR_GRID = Object.values(DATA_MENU).map(c => ({
  id: c.id,
  name: c.name,
  image: c.cover,
}));
