const sites = [
  {
    "id": 1,
    "name": "Machu Picchu",
    "coordinates": "-13.1631 S, -72.5450 W",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "West"
    },
    "description": "Ancient Incan citadel set high in the Andes Mountains of Peru, built in the 15th century and later abandoned.",
    "image": "machu-picchu.jpg"
  },
  {
    "id": 2,
    "name": "Great Barrier Reef",
    "coordinates": "-18.2871 S, 147.6992 E",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "East"
    },
    "description": "World's largest coral reef system composed of over 2,900 individual reefs and 900 islands stretching for 2,300 kilometers.",
    "image": "great-barrier-reef.jpg"
  },
  {
    "id": 3,
    "name": "Petra",
    "coordinates": "30.3285 N, 35.4444 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Famous archaeological site in Jordan's southwestern desert with massive facades carved into pink sandstone cliffs.",
    "image": "petra.png"
  },
  {
    "id": 4,
    "name": "Mount Everest",
    "coordinates": "27.9881 N, 86.9250 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Earth's highest mountain above sea level, located in the Mahalangur Himal sub-range of the Himalayas.",
    "image": "mount-everest.webp"
  },
  {
    "id": 5,
    "name": "Victoria Falls",
    "coordinates": "-17.9243 S, 25.8572 E",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "East"
    },
    "description": "Spectacular waterfall on the Zambezi River at the border of Zambia and Zimbabwe, creating the world's largest sheet of falling water.",
    "image": "victoria-falls.webp"
  },
  {
    "id": 6,
    "name": "Angkor Wat",
    "coordinates": "13.4125 N, 103.8670 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Massive temple complex in Cambodia and the largest religious monument in the world, originally constructed as a Hindu temple.",
    "image": "angkor-wat.png"
  },
  {
    "id": 7,
    "name": "Grand Canyon",
    "coordinates": "36.0544 N, -112.2401 W",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "West"
    },
    "description": "Steep-sided canyon carved by the Colorado River in Arizona, known for its overwhelming size and intricate landscape.",
    "image": "grand-canyon.png"
  },
  {
    "id": 8,
    "name": "Santorini",
    "coordinates": "36.3932 N, 25.4615 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Greek island known for its stunning white-washed buildings with blue domes, dramatic views, and spectacular sunsets.",
    "image": "santorini.png"
  },
  {
    "id": 9,
    "name": "Northern Lights (Tromsø)",
    "coordinates": "69.6492 N, 18.9553 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "One of the best places to view the Aurora Borealis, with the dancing lights frequently visible during winter months.",
    "image": "tromso.png"
  },
  {
    "id": 10,
    "name": "Serengeti National Park",
    "coordinates": "-2.3333 S, 34.8333 E",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "East"
    },
    "description": "Tanzania's oldest and most popular national park, famous for its annual migration of over 1.5 million wildebeest.",
    "image": "serengeti.png"
  },
  {
    "id": 11,
    "name": "Taj Mahal",
    "coordinates": "27.1751 N, 78.0421 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Ivory-white marble mausoleum on the southern bank of the Yamuna river in the Indian city of Agra, built by Mughal emperor Shah Jahan.",
    "image": "taj-mahal.png"
  },
  {
    "id": 12,
    "name": "Easter Island",
    "coordinates": "-27.1127 S, -109.3497 W",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "West"
    },
    "description": "Remote Chilean island in the Pacific known for its nearly 1,000 monumental statues called moai, created by the Rapa Nui people.",
    "image": "easter-island.jpg"
  },
  {
    "id": 13,
    "name": "Zhangjiajie National Forest Park",
    "coordinates": "29.3167 N, 110.4833 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Chinese national park known for towering quartzite sandstone pillars, the inspiration for the 'floating mountains' in the movie Avatar.",
    "image": "zhangjiajie.png"
  },
  {
    "id": 14,
    "name": "Venice",
    "coordinates": "45.4408 N, 12.3155 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Built on more than 100 small islands in a lagoon in the Adriatic Sea, this Italian city has no roads, just canals including the Grand Canal.",
    "image": "venice.png"
  },
  {
    "id": 15,
    "name": "Great Blue Hole",
    "coordinates": "17.3162 N, -87.5351 W",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "West"
    },
    "description": "Giant marine sinkhole off the coast of Belize, circular in shape with rich blue color, a world-class destination for recreational scuba divers.",
    "image": "blue-hole.webp"
  },
  {
    "id": 16,
    "name": "Uluru (Ayers Rock)",
    "coordinates": "-25.3444 S, 131.0369 E",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "East"
    },
    "description": "Massive sandstone monolith in Australia's Northern Territory, sacred to indigenous Australians and known for its size and red glow at sunset.",
    "image": "ayers-rock.jpg"
  },
  {
    "id": 17,
    "name": "Pamukkale",
    "coordinates": "37.9217 N, 29.1203 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Natural site in Turkey featuring terraces of carbonate minerals left by flowing water, appearing as a 'cotton castle' with thermal pools.",
    "image": "pamukkale.avif"
  },
  {
    "id": 18,
    "name": "Antelope Canyon",
    "coordinates": "36.8619 N, -111.3743 W",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "West"
    },
    "description": "Slot canyon in Arizona known for its wave-like structure and light beams that shine down through openings in the top.",
    "image": "antelope-canyon.jpg"
  },
  {
    "id": 19,
    "name": "Salar de Uyuni",
    "coordinates": "-20.1337 S, -67.4891 W",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "West"
    },
    "description": "World's largest salt flat, located in Bolivia, creates a mirror effect when covered with water during the rainy season.",
    "image": "salar-de-uyuni.jpg"
  },
  {
    "id": 20,
    "name": "Kyoto's Arashiyama Bamboo Grove",
    "coordinates": "35.0176 N, 135.6710 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Famous bamboo forest in Japan with pathways that wind through towering green stalks, creating an otherworldly atmosphere.",
    "image": "bamboo-grove.jpg"
  },
  {
    "id": 21,
    "name": "Cappadocia",
    "coordinates": "38.6431 N, 34.8289 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "Region in Turkey known for its distinctive 'fairy chimney' rock formations and historic cave dwellings, popular for hot air balloon rides.",
    "image": "cappadocia.jpg"
  },
  {
    "id": 22,
    "name": "Ha Long Bay",
    "coordinates": "20.9101 N, 107.1839 E",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "East"
    },
    "description": "UNESCO World Heritage Site in Vietnam featuring thousands of limestone karsts and isles in various shapes and sizes rising from emerald waters.",
    "image": "ha-long-bar.jpg"
  },
  {
    "id": 23,
    "name": "Moraine Lake",
    "coordinates": "51.3217 N, -116.1860 W",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "West"
    },
    "description": "Glacially-fed lake in Canada's Banff National Park known for its stunning turquoise blue color set against a backdrop of mountains.",
    "image": "lake-moraine.jpg"
  },
  {
    "id": 24,
    "name": "Bioluminescent Bay (Mosquito Bay)",
    "coordinates": "18.0970 N, -65.4468 W",
    "cardinal_direction": {
      "latitude": "North",
      "longitude": "West"
    },
    "description": "Bay in Vieques, Puerto Rico, containing microorganisms that glow blue when disturbed, creating a magical nighttime spectacle.",
    "image": "bioluminescent-bay.jpg"
  },
  {
    "id": 25,
    "name": "Namib Desert",
    "coordinates": "-24.2964 S, 15.3403 E",
    "cardinal_direction": {
      "latitude": "South",
      "longitude": "East"
    },
    "description": "Coastal desert in southern Africa with some of the tallest and most spectacular sand dunes in the world, including the famous 'Big Daddy' dune.",
    "image": "namib-desert.webp"
  }
]

export default sites;