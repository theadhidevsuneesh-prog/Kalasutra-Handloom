/**
 * Real photographs of the crafts, hosted on Wikimedia Commons under free licences.
 * Each entry keeps the author and licence so we can credit them (see /credits).
 * Format: [hash dir, encoded file name, author, licence, originalSize?]
 */
type Entry = [dir: string, file: string, author: string, license: string, original?: boolean];

const RAW = {
  ikat: ["d/da", "Sambalpuri_Double_Ikat_Saree.jpg", "Sanjana Krishnamoorthy", "CC BY 4.0"],
  kantha1: ["9/92", "Kantha_embroidery_of_bengal.jpg", "தீப்தி செந்தில்", "CC BY-SA 4.0"],
  kantha2: ["6/61", "Kantha_%28bed_cover%29%2C_West_BengalHonolulu_Museum_of_Art_3928.1.JPG", "Hiart", "CC0"],
  bluepot1: ["3/3e", "Blue_Pottery%2C_Jaipur_School_of_Art.jpg", "Neek-Theri", "CC BY-SA 4.0"],
  bluepot2: ["2/28", "Jaipur_Blue_Pottery_Vase_with_Raja-Rani_Design.jpg", "Neek-Theri", "CC BY-SA 4.0"],
  dokra: ["7/7b", "Dokra_by_Contact_Base_edited.png", "Susannaanas", "CC BY-SA 4.0"],
  banarasi: ["9/96", "Silk_Looms%2C_Varanasi.jpg", "Dan Ruth", "CC BY 2.0"],
  channa1: ["c/c1", "Finished_Channapatna_toys.jpg", "KartikMistry", "CC BY-SA 4.0"],
  channa2: ["6/61", "Channapatna_artist_making_toy.jpg", "KartikMistry", "CC BY-SA 4.0"],
  kalam1: ["a/ab", "KALAMKARI_HAND_PAINTED_CLOTH_SRIKALAHASTI_AP_-_panoramio.jpg", "rajaraman sundaram", "CC BY 3.0"],
  kalam2: ["7/7d", "Kalamkari_painting.jpg", "Anilbhardwajnoida", "CC BY-SA 3.0"],
  molela1: ["4/47", "Molela_Terracotta_Art_and_Wooden_Idols_11.jpg", "The open draft", "CC BY-SA 4.0"],
  molela2: ["a/a1", "Molela_Terracotta_Art_and_Wooden_Idols_03.jpg", "The open draft", "CC BY-SA 4.0"],
  pocham: ["7/7d", "Pochampalli_Ikat_saree.jpg", "Ramkumar Kalyani", "CC BY-SA 4.0"],
  chanderi: ["f/f1", "A_man_weaving_the_famous_handloom_Chanderi_Saree.jpg", "Monali0906", "CC BY-SA 4.0"],
  pash1: ["6/6d", "Handwoven-kashmir-pashmina.jpg", "AG", "CC BY-SA 4.0"],
  pash2: ["1/1e", "Pashmina_scarf_with_woven_elephant_design_02.jpg", "Kritzolina", "CC BY-SA 4.0"],
  patta1: ["3/3a", "Pattachitra_Painting_%2817041543331%29.jpg", "Mike Prince", "CC BY 2.0"],
  patta2: ["4/49", "Pattachitra_Painting_%2816419912954%29.jpg", "Mike Prince", "CC BY 2.0"],
  patta3: ["f/f6", "Pattachitra_artist_at_work_in_Odisha%2C_India.jpg", "Euphoric Captures", "CC BY-SA 4.0"],
  kanchi1: ["8/83", "Silk_saree_on_the_making_at_Kanchipuram_%287642281054%29.jpg", "Kamal Venkit", "CC BY 2.0"],
  kanchi2: ["f/f1", "Kanchipuram_silk_sareer.JPG", "రహ్మానుద్దీన్", "CC BY-SA 3.0"],
  aran1: ["b/ba", "Aranmula_kannadi_%28mirror%29.jpg", "Vishnuvxyz", "CC BY-SA 4.0"],
  aran2: ["7/79", "Aranmula_Kannadi.jpg", "Prasanth Prakash", "CC BY-SA 4.0"],
  kasavu: ["c/c2", "Balaramapuram_Handloom_House.jpg", "Amr vignesh", "CC BY-SA 4.0"],
  paithani: ["2/2d", "Allover_work_paithani_saree.jpg", "NBMSSILKSAREE", "CC0", true],
  warli1: ["a/a3", "Warli_painting.jpg", "Omrmankar", "CC BY-SA 4.0"],
  warli2: ["b/b9", "Warli_art_on_a_house_wall_at_Sanjay_Gandhi_National_Park.jpg", "Blackstardust", "CC BY-SA 4.0"],
  madhu1: ["f/fd", "Madhubani_paintings_%28Madhubani_Railway_Station%29.jpg", "Sntshkumar750", "CC BY-SA 4.0"],
  madhu2: ["d/d8", "Dilli_Haat_Madhubani_Mithila_Painting_Artist.jpg", "Pallav.journo", "CC BY-SA 4.0"],
  phul1: ["6/65", "Embroidery_on_a_shawl_from_Punjab_05.jpg", "Kritzolina", "CC BY-SA 4.0"],
  phul2: ["0/09", "Embroidery_on_a_shawl_from_Punjab_01.jpg", "Kritzolina", "CC BY-SA 4.0"],
  kullu1: ["7/77", "Kullvi_Pattu_Weaving_in_Kullu_district%2C2.jpg", "Rajani Gairshail", "CC BY-SA 4.0"],
  kullu2: ["3/3c", "Kullvi_Pattu_Weaving_in_Kullu_district%2C1.jpg", "Rajani Gairshail", "CC BY-SA 4.0"],
  longpi1: ["5/55", "Longpi_pottery_of_Thankul_Naga_tribes_DSCN1244_01.jpg", "Sumita Roy Dutta", "CC BY-SA 4.0"],
  longpi2: ["8/81", "Longpi_pottery_of_Thankul_Naga_tribes_DSCN1244_07.jpg", "Sumita Roy Dutta", "CC BY-SA 4.0"],
  naga1: ["c/c1", "Naga_shawl_2.jpg", "Atcelsius", "CC BY-SA 4.0"],
  naga2: ["a/a5", "Naga_Tribe_Traditional_Shawl.jpg", "পাপৰি বৰা", "CC BY-SA 4.0"],
  sohrai1: ["d/de", "Sohrai_Flowery_Design_1.jpg", "Veera.sj", "CC0"],
  sohrai2: ["4/4e", "A_Munda_tribesman_sitting_in_front_of_wall_decorated_with_Munda_style_Sohrai_Painting_at_Isko_Village%2C_Hazaribagh.jpg", "Kingshuk Mondal", "CC BY 4.0"],
  bidri: ["b/bb", "Bidriware_vases_and_decanter.jpg", "Randhirreddy", "CC BY-SA 3.0"],
  gond: ["b/b2", "Gond_Painting.JPG", "Roboture", "CC BY-SA 3.0", true],
  chikan: ["0/05", "Chikankari_of_lucknow.jpg", "Bundleofemotions", "CC BY-SA 4.0"],
  morad1: ["0/05", "Designer_Brass_Showpieces_of_Moradabad.jpg", "Ashishb04", "CC BY-SA 4.0"],
  morad2: ["3/3a", "Brass_Handicrafts_of_Moradabad.jpg", "Ashishb04", "CC BY-SA 4.0"],
  tanjore: ["3/31", "Tanjore_Painting_Vinayaka_2.jpg", "Iramuthusamy", "CC BY-SA 3.0"],
  cherial: ["5/5d", "Cheriyal_painting_-_toddy_tappers.jpg", "Subha murugan", "CC BY-SA 3.0"],
  rogan: ["3/32", "Rogan-art-Tree-of-Life-Abdul-Gafur-Khatri-29-12-2013.jpg", "Wiki-uk", "CC BY-SA 3.0"],
  muga: ["b/bb", "Assam_Muga_Silk_Mekhela_Chador.jpg", "Chiring chandan", "CC BY-SA 4.0"],
  sikki: ["0/02", "Sikki_Grass_Craft_by_artisan_Nazda_Khatun_of_Bihar_14.jpg", "Goutam1962", "CC BY-SA 4.0"],
  etiko: ["1/14", "Etikoppaka_Toys_at_an_Exhibition_in_Visakhapatnam.JPG", "Adityamadhav83", "CC BY-SA 4.0"],
  jutti: ["c/c9", "Punjabi_jutti_at_Dilli_Haat.jpg", "Ekabhishek", "CC BY-SA 3.0"],
  shola1: ["8/81", "Craft_sholapith.jpg", "Iamjfcal", "CC BY-SA 4.0"],
  shola2: ["3/33", "Figurine_made_out_of_Sholapith.jpg", "Prakriti Panda", "CC BY-SA 4.0"],
  thangka: ["a/a3", "Thanka_painting.jpg", "Wikimedia Commons contributor", "CC BY-SA 3.0"],
  tripura: ["b/be", "%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%AA%E0%A7%81%E0%A6%B0%E0%A6%BE%E0%A6%B0_%E0%A6%AC%E0%A6%BE%E0%A6%81%E0%A6%B6%E0%A7%87%E0%A6%B0_%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A7%81%E0%A6%B6%E0%A6%BF%E0%A6%B2%E0%A7%8D%E0%A6%AA_Bamboo_Handicraft_of_Tripura.jpg", "Sumasa", "CC BY-SA 4.0"],
  haryana: ["6/6e", "Pottery_at_the_Chokhi_Dhani_Resort_Panchkula_30.jpg", "Kritzolina", "CC BY-SA 4.0"],
  bell1: ["b/bc", "Bell_metal_handicraft_Sarthebari.jpg", "Dhruba Jyoti Deka", "CC BY-SA 4.0"],
  bell2: ["3/3a", "Bell-metal_worker.jpg", "পৱন বৰ্মন", "CC BY 4.0"],
  kutch: ["c/c4", "Ahir_Embroidery_From_Kutch.jpg", "Fewword", "CC BY-SA 4.0"],
  arunachal: ["d/db", "Miju_Mishmi_Traditional_Attire.jpg", "Mytravelstory2023", "CC BY-SA 4.0"],
} satisfies Record<string, Entry>;

export type ImgKey = keyof typeof RAW;

export interface Credit {
  key: ImgKey;
  url: string;
  title: string;
  author: string;
  license: string;
  page: string;
}

const build = (k: ImgKey): Credit => {
  const [dir, file, author, license, original] = RAW[k] as Entry;
  const base = "https://upload.wikimedia.org/wikipedia/commons";
  return {
    key: k,
    url: original ? `${base}/${dir}/${file}` : `${base}/thumb/${dir}/${file}/960px-${file}`,
    title: decodeURIComponent(file).replace(/_/g, " "),
    author,
    license,
    page: `https://commons.wikimedia.org/wiki/File:${file}`,
  };
};

export const credits: Credit[] = (Object.keys(RAW) as ImgKey[]).map(build);
export const img = (k: ImgKey) => build(k).url;
export const imgs = (...ks: ImgKey[]) => ks.map(img);
