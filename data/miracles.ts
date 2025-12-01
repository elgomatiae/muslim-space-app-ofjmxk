
export interface QuranVerse {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
}

export interface Hadith {
  source: string;
  text: string;
}

export interface Miracle {
  id: string;
  title: string;
  description: string;
  details: string;
  explanation: string;
  quranVerses: QuranVerse[];
  hadiths: Hadith[];
  reference: string;
  image: string;
}

export interface MiracleCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  miracles: Miracle[];
}

export const miracleCategories: MiracleCategory[] = [
  {
    id: 'scientific',
    title: 'Scientific',
    icon: 'flask',
    color: '#3F51B5',
    miracles: [
      {
        id: 's1',
        title: 'Embryology in the Quran',
        description: 'The Quran describes the stages of human embryonic development with remarkable accuracy, 1400 years before modern science.',
        details: `The Quran provides a detailed description of human embryonic development in stages that align perfectly with modern embryology. The progression from a drop of fluid (nutfah), to a clinging clot (alaqah), to a chewed lump (mudghah), to bones clothed with flesh represents the actual stages of embryonic development.

The term "alaqah" has three meanings in Arabic: (1) a leech, (2) a suspended thing, and (3) a blood clot. Remarkably, the embryo at this stage resembles a leech in appearance, is suspended in the amniotic sac, and the cardiovascular system begins to form, making it appear like a blood clot.

The "mudghah" stage describes the embryo as resembling a chewed substance, which is exactly how it appears due to the somites (segments) that form along the back of the embryo, giving it a chewed appearance.`,
        explanation: `This is miraculous because:

1. No microscopes existed in the 7th century to observe these stages
2. The descriptions are medically accurate and in the correct sequence
3. The Arabic terms used have multiple meanings that all apply to the embryonic stage
4. Ancient Greek and Roman embryology was completely incorrect, yet the Quran got it right
5. Professor Keith Moore, a leading embryologist, stated these descriptions could not have been known without modern technology`,
        quranVerses: [
          {
            surah: 23,
            verse: 12,
            arabic: 'وَلَقَدْ خَلَقْنَا ٱلْإِنسَـٰنَ مِن سُلَـٰلَةٍۢ مِّن طِينٍۢ',
            translation: 'And certainly did We create man from an extract of clay.'
          },
          {
            surah: 23,
            verse: 13,
            arabic: 'ثُمَّ جَعَلْنَـٰهُ نُطْفَةًۭ فِى قَرَارٍۢ مَّكِينٍۢ',
            translation: 'Then We placed him as a sperm-drop in a firm lodging.'
          },
          {
            surah: 23,
            verse: 14,
            arabic: 'ثُمَّ خَلَقْنَا ٱلنُّطْفَةَ عَلَقَةًۭ فَخَلَقْنَا ٱلْعَلَقَةَ مُضْغَةًۭ فَخَلَقْنَا ٱلْمُضْغَةَ عِظَـٰمًۭا فَكَسَوْنَا ٱلْعِظَـٰمَ لَحْمًۭا ثُمَّ أَنشَأْنَـٰهُ خَلْقًا ءَاخَرَ ۚ فَتَبَارَكَ ٱللَّهُ أَحْسَنُ ٱلْخَـٰلِقِينَ',
            translation: 'Then We made the sperm-drop into a clinging clot, and We made the clot into a lump [of flesh], and We made [from] the lump, bones, and We covered the bones with flesh; then We developed him into another creation. So blessed is Allah, the best of creators.'
          },
          {
            surah: 22,
            verse: 5,
            arabic: 'يَـٰٓأَيُّهَا ٱلنَّاسُ إِن كُنتُمْ فِى رَيْبٍۢ مِّنَ ٱلْبَعْثِ فَإِنَّا خَلَقْنَـٰكُم مِّن تُرَابٍۢ ثُمَّ مِن نُّطْفَةٍۢ ثُمَّ مِنْ عَلَقَةٍۢ ثُمَّ مِن مُّضْغَةٍۢ مُّخَلَّقَةٍۢ وَغَيْرِ مُخَلَّقَةٍۢ',
            translation: 'O People, if you should be in doubt about the Resurrection, then [consider that] indeed, We created you from dust, then from a sperm-drop, then from a clinging clot, then from a lump of flesh, formed and unformed...'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Muslim 2643',
            text: 'The Prophet ﷺ said: "When forty-two nights have passed over the drop (nutfah), Allah sends an angel to it, who shapes it and makes its ears, eyes, skin, flesh and bones. Then he says: O Lord, is it male or female? and your Lord decides what He wishes."'
          }
        ],
        reference: 'Quran 23:12-14, 22:5',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      },
      {
        id: 's2',
        title: 'Mountains as Pegs (Isostasy)',
        description: 'The Quran describes mountains as pegs that stabilize the Earth, a concept only discovered by modern geology.',
        details: `The Quran uses the metaphor of "pegs" (awtad) to describe mountains, which is remarkably accurate. Modern geology has discovered that mountains have deep roots extending into the Earth's crust, much like pegs or stakes driven into the ground.

This phenomenon is called "isostasy" - mountains have roots that can extend 10-15 times deeper than their visible height. For example, Mount Everest, which is about 9 km tall, has roots extending approximately 125 km into the Earth's mantle.

These deep roots help stabilize the Earth's crust by preventing it from sliding over the molten layer beneath. The mountains act as stabilizers, much like pegs hold down a tent.`,
        explanation: `This is miraculous because:

1. The shape of mountains beneath the Earth's surface was completely unknown until the late 19th century
2. The theory of isostasy was only developed in the 1850s
3. The Quran's use of the word "pegs" (awtad) perfectly describes the deep-rooted structure
4. Ancient people believed mountains were simply elevated land masses with no deep roots
5. The stabilizing function of mountains was only understood through modern plate tectonics theory`,
        quranVerses: [
          {
            surah: 78,
            verse: 6,
            arabic: 'أَلَمْ نَجْعَلِ ٱلْأَرْضَ مِهَـٰدًۭا',
            translation: 'Have We not made the earth a resting place?'
          },
          {
            surah: 78,
            verse: 7,
            arabic: 'وَٱلْجِبَالَ أَوْتَادًۭا',
            translation: 'And the mountains as stakes?'
          },
          {
            surah: 21,
            verse: 31,
            arabic: 'وَجَعَلْنَا فِى ٱلْأَرْضِ رَوَٰسِىَ أَن تَمِيدَ بِهِمْ',
            translation: 'And We placed within the earth firmly set mountains, lest it should shift with them.'
          },
          {
            surah: 16,
            verse: 15,
            arabic: 'وَأَلْقَىٰ فِى ٱلْأَرْضِ رَوَٰسِىَ أَن تَمِيدَ بِكُمْ وَأَنْهَـٰرًۭا وَسُبُلًۭا لَّعَلَّكُمْ تَهْتَدُونَ',
            translation: 'And He has cast into the earth firmly set mountains, lest it shift with you, and [made] rivers and roads, that you may be guided.'
          }
        ],
        hadiths: [],
        reference: 'Quran 78:6-7, 21:31, 16:15',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      },
      {
        id: 's3',
        title: 'The Expanding Universe',
        description: 'The Quran mentions the expansion of the universe 1400 years before Edwin Hubble\'s discovery in 1929.',
        details: `In 1929, astronomer Edwin Hubble made one of the most important discoveries in modern cosmology: the universe is expanding. This was revolutionary because scientists previously believed the universe was static and unchanging.

The Quran, revealed 1400 years earlier, states that Allah is expanding the heavens. The Arabic word "musi'un" (موسعون) comes from the root "wasa'a" which means to expand, extend, or make spacious.

This expansion is now a fundamental principle of cosmology, supported by observations of redshift in distant galaxies, cosmic microwave background radiation, and the accelerating expansion driven by dark energy.`,
        explanation: `This is miraculous because:

1. The concept of an expanding universe was completely unknown until the 20th century
2. All ancient civilizations believed in a static, unchanging cosmos
3. Even Einstein initially rejected the idea of an expanding universe and added a "cosmological constant" to keep it static
4. The Quran uses the present continuous tense, indicating ongoing expansion
5. This single verse contradicted 1400 years of human understanding until modern science confirmed it`,
        quranVerses: [
          {
            surah: 51,
            verse: 47,
            arabic: 'وَٱلسَّمَآءَ بَنَيْنَـٰهَا بِأَيْي۟دٍۢ وَإِنَّا لَمُوسِعُونَ',
            translation: 'And the heaven We constructed with strength, and indeed, We are [its] expander.'
          },
          {
            surah: 21,
            verse: 104,
            arabic: 'يَوْمَ نَطْوِى ٱلسَّمَآءَ كَطَىِّ ٱلسِّجِلِّ لِلْكُتُبِ',
            translation: 'The Day when We will fold the heaven like the folding of a [written] sheet for the records.'
          }
        ],
        hadiths: [],
        reference: 'Quran 51:47',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
      },
      {
        id: 's4',
        title: 'Barrier Between Seas',
        description: 'The Quran describes a barrier between two bodies of water that meet but do not mix, a phenomenon discovered by modern oceanography.',
        details: `The Quran describes a fascinating phenomenon where two seas meet but maintain a barrier between them, preventing their waters from mixing. Modern oceanography has confirmed this occurs at several locations worldwide.

When two bodies of water with different densities, salinity, and temperatures meet, they create a barrier zone called a "pycnocline." This barrier prevents the waters from mixing despite being in contact. Examples include:

- The Mediterranean Sea and the Atlantic Ocean at the Strait of Gibraltar
- The Caribbean Sea and the Atlantic Ocean
- The Red Sea and the Indian Ocean at the Bab-el-Mandeb strait

Each body of water maintains its own temperature, salinity, and density, with a distinct barrier zone between them. This was only discovered through modern oceanographic research using specialized equipment.`,
        explanation: `This is miraculous because:

1. This phenomenon occurs deep underwater and cannot be observed with the naked eye
2. It requires sophisticated equipment to detect differences in salinity, temperature, and density
3. The Quran describes both the meeting and the barrier, which is scientifically accurate
4. Ancient people had no knowledge of underwater barriers or ocean dynamics
5. The description matches modern oceanographic findings precisely`,
        quranVerses: [
          {
            surah: 55,
            verse: 19,
            arabic: 'مَرَجَ ٱلْبَحْرَيْنِ يَلْتَقِيَانِ',
            translation: 'He released the two seas, meeting [side by side].'
          },
          {
            surah: 55,
            verse: 20,
            arabic: 'بَيْنَهُمَا بَرْزَخٌۭ لَّا يَبْغِيَانِ',
            translation: 'Between them is a barrier [so] neither of them transgresses.'
          },
          {
            surah: 25,
            verse: 53,
            arabic: 'وَهُوَ ٱلَّذِى مَرَجَ ٱلْبَحْرَيْنِ هَـٰذَا عَذْبٌۭ فُرَاتٌۭ وَهَـٰذَا مِلْحٌ أُجَاجٌۭ وَجَعَلَ بَيْنَهُمَا بَرْزَخًۭا وَحِجْرًۭا مَّحْجُورًۭا',
            translation: 'And it is He who has released [simultaneously] the two seas, one fresh and sweet and one salty and bitter, and He placed between them a barrier and prohibiting partition.'
          }
        ],
        hadiths: [],
        reference: 'Quran 55:19-20, 25:53',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      },
      {
        id: 's5',
        title: 'The Big Bang',
        description: 'The Quran describes the origin of the universe in a way that aligns remarkably with the Big Bang theory.',
        details: `The Big Bang theory, developed in the 20th century, states that the universe began from a single point of infinite density and temperature, which then expanded to form the cosmos we see today. Before this expansion, all matter and energy were joined together.

The Quran describes this exact concept: the heavens and earth were once joined together (ratq - meaning "stitched together" or "joined") and then were separated (fataq - meaning "we separated" or "we split apart").

The Arabic word "ratq" specifically means something that is tightly woven or stitched together, perfectly describing the singularity before the Big Bang. The word "fataq" means to split or separate, describing the expansion that followed.`,
        explanation: `This is miraculous because:

1. The Big Bang theory was only proposed in 1927 by Georges Lemaître and confirmed later
2. Ancient cosmologies had no concept of the universe having a beginning
3. The Quran uses precise terminology that matches the scientific description
4. The verse describes both the initial state (joined) and the event (separation)
5. This contradicted all prevailing beliefs about an eternal, unchanging universe`,
        quranVerses: [
          {
            surah: 21,
            verse: 30,
            arabic: 'أَوَلَمْ يَرَ ٱلَّذِينَ كَفَرُوٓا۟ أَنَّ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ كَانَتَا رَتْقًۭا فَفَتَقْنَـٰهُمَا ۖ وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ ۖ أَفَلَا يُؤْمِنُونَ',
            translation: 'Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them and made from water every living thing? Then will they not believe?'
          },
          {
            surah: 41,
            verse: 11,
            arabic: 'ثُمَّ ٱسْتَوَىٰٓ إِلَى ٱلسَّمَآءِ وَهِىَ دُخَانٌۭ',
            translation: 'Then He directed Himself to the heaven while it was smoke...'
          }
        ],
        hadiths: [],
        reference: 'Quran 21:30, 41:11',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
      },
      {
        id: 's6',
        title: 'Uniqueness of Fingerprints',
        description: 'The Quran emphasizes the precision of Allah\'s creation down to the fingertips, highlighting their uniqueness.',
        details: `When the Quran discusses resurrection, it makes a specific and remarkable statement about Allah's ability to recreate humans down to their very fingertips. This emphasis on fingertips seemed puzzling to early commentators, but modern science has revealed why this is significant.

Fingerprints are absolutely unique to each individual - no two people, not even identical twins, have the same fingerprints. The patterns formed by ridges on our fingertips are so distinctive that they're used for identification worldwide.

The Quran could have mentioned any body part to demonstrate Allah's creative precision, but it specifically chose fingertips. This is remarkable because:
- Fingerprints were not used for identification until the late 19th century
- The uniqueness of fingerprints was not scientifically established until modern times
- Ancient people had no reason to consider fingertips as particularly significant`,
        explanation: `This is miraculous because:

1. Fingerprint identification was only developed in the 1880s by Sir Francis Galton
2. The uniqueness of fingerprints was unknown in the 7th century
3. The Quran specifically emphasizes fingertips when discussing precise recreation
4. This detail serves no obvious purpose unless highlighting their unique nature
5. Modern forensic science confirms that fingerprints are one of the most reliable forms of identification`,
        quranVerses: [
          {
            surah: 75,
            verse: 3,
            arabic: 'أَيَحْسَبُ ٱلْإِنسَـٰنُ أَلَّن نَّجْمَعَ عِظَامَهُۥ',
            translation: 'Does man think that We will not assemble his bones?'
          },
          {
            surah: 75,
            verse: 4,
            arabic: 'بَلَىٰ قَـٰدِرِينَ عَلَىٰٓ أَن نُّسَوِّىَ بَنَانَهُۥ',
            translation: 'Yes. [We are] Able [even] to proportion his fingertips.'
          }
        ],
        hadiths: [],
        reference: 'Quran 75:3-4',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
      },
      {
        id: 's7',
        title: 'Iron Sent Down from Space',
        description: 'The Quran states that iron was "sent down" to Earth, which aligns with the scientific fact that iron came from meteorites.',
        details: `The Quran uses a very specific word when mentioning iron: "anzalna" (أنزلنا), which means "We sent down." This is the same word used for revelation being sent down from heaven. This choice of words is scientifically remarkable.

Modern astrophysics has discovered that iron cannot be produced on Earth. The energy required to produce iron is so immense that it can only occur in the cores of massive stars through nuclear fusion. When these stars explode as supernovae, they scatter iron throughout space.

The iron found on Earth came from:
1. Meteorite bombardment during Earth's formation
2. Asteroids and comets that struck Earth
3. Cosmic dust containing iron particles

The Quran's use of "sent down" is literally accurate - iron was sent down from space to Earth. Additionally, Surah 57 (Al-Hadid) is named "The Iron," and remarkably, the atomic number of iron is 26, and 57 is close to its atomic mass (55.845).`,
        explanation: `This is miraculous because:

1. The formation of iron in stars was only discovered in the 20th century
2. Ancient people believed iron was a natural part of Earth
3. The Quran uses "sent down" specifically for iron, not other metals
4. The energy required for iron formation (nuclear fusion in stars) was unknown
5. The numerical connections (Surah 57, atomic properties) add another layer of significance`,
        quranVerses: [
          {
            surah: 57,
            verse: 25,
            arabic: 'وَأَنزَلْنَا ٱلْحَدِيدَ فِيهِ بَأْسٌۭ شَدِيدٌۭ وَمَنَـٰفِعُ لِلنَّاسِ',
            translation: 'And We sent down iron, wherein is great military might and benefits for the people.'
          }
        ],
        hadiths: [],
        reference: 'Quran 57:25',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      },
      {
        id: 's8',
        title: 'The Water Cycle',
        description: 'The Quran accurately describes the complete water cycle, including evaporation, cloud formation, and precipitation.',
        details: `The Quran provides a comprehensive description of the water cycle, a process that was not fully understood until the 16th-17th centuries. The verses describe:

1. Evaporation: Water rises from the earth and seas
2. Cloud Formation: Water vapor forms clouds
3. Wind Movement: Winds move the clouds
4. Precipitation: Rain falls from the clouds
5. Groundwater: Water is stored in the earth
6. Springs and Rivers: Water emerges as springs and flows as rivers

The Quran describes this cycle in multiple verses, showing how water moves from the earth to the sky and back again. It mentions that water is sent down "in due measure" and stored in the earth, which describes both the water table and aquifers.

The water cycle was not properly understood until Pierre Perrault and Edme Mariotte established the modern theory in the 17th century.`,
        explanation: `This is miraculous because:

1. Ancient civilizations had incorrect theories about the water cycle
2. Greeks believed water rose through underground channels to mountain tops
3. The complete cycle (evaporation, condensation, precipitation, collection) is accurately described
4. The Quran mentions water storage in the earth (aquifers), unknown in ancient times
5. The precise sequence and mechanisms match modern hydrology`,
        quranVerses: [
          {
            surah: 23,
            verse: 18,
            arabic: 'وَأَنزَلْنَا مِنَ ٱلسَّمَآءِ مَآءًۢ بِقَدَرٍۢ فَأَسْكَنَّـٰهُ فِى ٱلْأَرْضِ ۖ وَإِنَّا عَلَىٰ ذَهَابٍۭ بِهِۦ لَقَـٰدِرُونَ',
            translation: 'And We have sent down rain from the sky in a measured amount and settled it in the earth. And indeed, We are Able to take it away.'
          },
          {
            surah: 30,
            verse: 48,
            arabic: 'ٱللَّهُ ٱلَّذِى يُرْسِلُ ٱلرِّيَـٰحَ فَتُثِيرُ سَحَابًۭا فَيَبْسُطُهُۥ فِى ٱلسَّمَآءِ كَيْفَ يَشَآءُ',
            translation: 'It is Allah who sends the winds, and they stir the clouds and spread them in the sky however He wills.'
          },
          {
            surah: 39,
            verse: 21,
            arabic: 'أَلَمْ تَرَ أَنَّ ٱللَّهَ أَنزَلَ مِنَ ٱلسَّمَآءِ مَآءًۭ فَسَلَكَهُۥ يَنَـٰبِيعَ فِى ٱلْأَرْضِ',
            translation: 'Do you not see that Allah sends down rain from the sky and makes it flow as springs [and rivers] in the earth?'
          }
        ],
        hadiths: [],
        reference: 'Quran 23:18, 30:48, 39:21',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
      },
    ],
  },
  {
    id: 'linguistic',
    title: 'Linguistic',
    icon: 'text-format',
    color: '#E91E63',
    miracles: [
      {
        id: 'l1',
        title: 'The Inimitable Challenge',
        description: 'The Quran challenged the Arabs, masters of poetry and eloquence, to produce even one chapter like it - a challenge that remains unmet.',
        details: `The Quran was revealed to 7th century Arabs who were masters of the Arabic language. Poetry was their highest art form, and they held annual competitions to showcase the best poetry. Poets were celebrities, and eloquence was the ultimate achievement.

Into this environment, the Quran issued a challenge in stages:
1. First: Produce something like the entire Quran
2. Then: Produce ten chapters like it
3. Finally: Produce just ONE chapter like it

This challenge has stood for over 1400 years. Despite the Arabs' mastery of their language, despite their motivation to discredit Islam, despite having the same letters and words available to them - no one has ever met this challenge.

The Quran's linguistic features include:
- Perfect rhythm and rhyme without sacrificing meaning
- Multiple layers of meaning in single verses
- Grammatical structures that convey multiple valid interpretations
- Phonetic beauty that makes it easy to memorize
- Coherent themes despite being revealed over 23 years`,
        explanation: `This is miraculous because:

1. The Arabs were the most qualified people to meet this challenge, yet they couldn't
2. Many enemies of Islam tried to discredit it by meeting the challenge, but failed
3. The challenge is still open today - anyone can try, yet no one has succeeded
4. The Quran maintains its eloquence in every verse, unlike human poetry which varies in quality
5. Prophet Muhammad ﷺ was known to be unlettered, making this even more remarkable`,
        quranVerses: [
          {
            surah: 2,
            verse: 23,
            arabic: 'وَإِن كُنتُمْ فِى رَيْبٍۢ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا۟ بِسُورَةٍۢ مِّن مِّثْلِهِۦ وَٱدْعُوا۟ شُهَدَآءَكُم مِّن دُونِ ٱللَّهِ إِن كُنتُمْ صَـٰدِقِينَ',
            translation: 'And if you are in doubt about what We have sent down upon Our Servant [Muhammad], then produce a surah the like thereof and call upon your witnesses other than Allah, if you should be truthful.'
          },
          {
            surah: 10,
            verse: 38,
            arabic: 'أَمْ يَقُولُونَ ٱفْتَرَىٰهُ ۖ قُلْ فَأْتُوا۟ بِسُورَةٍۢ مِّثْلِهِۦ وَٱدْعُوا۟ مَنِ ٱسْتَطَعْتُم مِّن دُونِ ٱللَّهِ إِن كُنتُمْ صَـٰدِقِينَ',
            translation: 'Or do they say [about the Prophet], "He invented it?" Say, "Then bring forth a surah like it and call upon [for assistance] whomever you can besides Allah, if you should be truthful."'
          },
          {
            surah: 17,
            verse: 88,
            arabic: 'قُل لَّئِنِ ٱجْتَمَعَتِ ٱلْإِنسُ وَٱلْجِنُّ عَلَىٰٓ أَن يَأْتُوا۟ بِمِثْلِ هَـٰذَا ٱلْقُرْءَانِ لَا يَأْتُونَ بِمِثْلِهِۦ وَلَوْ كَانَ بَعْضُهُمْ لِبَعْضٍۢ ظَهِيرًۭا',
            translation: 'Say, "If mankind and the jinn gathered in order to produce the like of this Qur\'an, they could not produce the like of it, even if they were to each other assistants."'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 4981',
            text: 'The Prophet ﷺ said: "There was no prophet among the prophets who was not given signs by which people believed in him. What I have been given is the Divine Revelation which Allah revealed to me. So I hope that my followers will be more than those of any other prophet on the Day of Resurrection."'
          }
        ],
        reference: 'Quran 2:23, 10:38, 17:88',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      },
      {
        id: 'l2',
        title: 'Perfect Preservation',
        description: 'The Quran is the only religious scripture that has been perfectly preserved in its original language for over 1400 years.',
        details: `The Quran is unique among all religious texts in its perfect preservation. While other scriptures have been translated, modified, or lost over time, the Quran remains exactly as it was revealed.

Evidence of preservation:
1. Oral Tradition: Millions of Muslims have memorized the entire Quran word-for-word, letter-for-letter. This chain of memorization goes back to the Prophet Muhammad ﷺ himself.

2. Written Manuscripts: The oldest Quran manuscripts (like the Birmingham Quran manuscript dated to 568-645 CE) match today's Quran exactly.

3. Single Text: Unlike the Bible which has multiple versions, the Quran has one universal text in Arabic.

4. Unchanged Language: The Quran is still read in its original 7th century Arabic, not translated versions.

5. Divine Promise: The Quran itself promises its preservation: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian."

This preservation is unprecedented. No other ancient text has been preserved with such precision across 1400 years.`,
        explanation: `This is miraculous because:

1. Ancient texts typically have numerous variations and versions
2. The Bible has thousands of textual variants and different versions
3. The Quran's preservation was achieved without modern technology
4. Millions of people memorizing the same text prevents any alteration
5. The promise of preservation in the Quran itself has been fulfilled`,
        quranVerses: [
          {
            surah: 15,
            verse: 9,
            arabic: 'إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ',
            translation: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.'
          },
          {
            surah: 41,
            verse: 41,
            arabic: 'إِنَّ ٱلَّذِينَ كَفَرُوا۟ بِٱلذِّكْرِ لَمَّا جَآءَهُمْ ۖ وَإِنَّهُۥ لَكِتَـٰبٌ عَزِيزٌۭ',
            translation: 'Indeed, those who disbelieve in the message after it has come to them... And indeed, it is a mighty Book.'
          },
          {
            surah: 41,
            verse: 42,
            arabic: 'لَّا يَأْتِيهِ ٱلْبَـٰطِلُ مِنۢ بَيْنِ يَدَيْهِ وَلَا مِنْ خَلْفِهِۦ ۖ تَنزِيلٌۭ مِّنْ حَكِيمٍ حَمِيدٍۢ',
            translation: 'Falsehood cannot approach it from before it or from behind it; [it is] a revelation from a [Lord who is] Wise and Praiseworthy.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 5027',
            text: 'The Prophet ﷺ said: "The example of the one who memorizes the Quran is like the owner of tied camels. If he keeps them tied, he will control them, but if he releases them, they will run away."'
          }
        ],
        reference: 'Quran 15:9, 41:41-42',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
      },
      {
        id: 'l3',
        title: 'Rhythmic Perfection',
        description: 'The Quran has a unique rhythmic structure that aids memorization while maintaining profound meaning.',
        details: `The Quran's rhythmic structure is unlike any other text in Arabic literature. It combines:

1. Rhyme Scheme (Saj'): The verses end with similar sounds, creating a rhythmic flow. However, unlike Arabic poetry, this rhyme never compromises the meaning.

2. Phonetic Beauty: The arrangement of letters and sounds creates a melodious recitation that is pleasing to the ear, even to non-Arabic speakers.

3. Memorization Aid: The rhythm makes the Quran remarkably easy to memorize. Children as young as 5-6 years old memorize the entire Quran (over 600 pages).

4. Consistent Quality: Unlike human poetry which has strong and weak verses, every verse of the Quran maintains the same high level of eloquence.

5. Meaningful Rhythm: The rhythm enhances the meaning rather than constraining it. The sound often reflects the content (e.g., harsh sounds for punishment, soft sounds for mercy).

This combination of perfect rhythm, profound meaning, and ease of memorization is unmatched in any language.`,
        explanation: `This is miraculous because:

1. Human poets cannot maintain perfect rhythm without sacrificing meaning
2. The Quran was revealed over 23 years, yet maintains consistent rhythm
3. Millions of non-Arabic speakers have memorized it due to its rhythmic structure
4. The rhythm aids in detecting any errors in recitation
5. No other book in history has been memorized by so many people`,
        quranVerses: [
          {
            surah: 39,
            verse: 23,
            arabic: 'ٱللَّهُ نَزَّلَ أَحْسَنَ ٱلْحَدِيثِ كِتَـٰبًۭا مُّتَشَـٰبِهًۭا مَّثَانِىَ تَقْشَعِرُّ مِنْهُ جُلُودُ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُمْ',
            translation: 'Allah has sent down the best statement: a consistent Book wherein is reiteration. The skins shiver therefrom of those who fear their Lord.'
          },
          {
            surah: 73,
            verse: 4,
            arabic: 'وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا',
            translation: 'And recite the Quran with measured recitation.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 5046',
            text: 'The Prophet ﷺ said: "The one who is proficient in the recitation of the Quran will be with the honorable and obedient scribes (angels), and he who recites the Quran and finds it difficult to recite, doing his best to recite it in the best way possible, will have two rewards."'
          }
        ],
        reference: 'Quran 39:23, 73:4',
        image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',
      },
      {
        id: 'l4',
        title: 'Multiple Layers of Meaning',
        description: 'Quranic verses contain multiple valid interpretations and layers of meaning, a hallmark of divine eloquence.',
        details: `The Quran's linguistic structure allows for multiple valid interpretations simultaneously, creating layers of meaning that unfold over time. This is achieved through:

1. Polysemy: Words with multiple meanings that all apply to the context
2. Grammatical Ambiguity: Structures that allow different valid readings
3. Contextual Depth: Verses that apply to multiple situations and times
4. Scientific Layers: Meanings that become apparent with scientific advancement

Example: The word "alaq" in embryology verses means:
- A leech (appearance)
- A suspended thing (position)
- A blood clot (cardiovascular development)

All three meanings are scientifically accurate for that stage of development.

This multi-layered meaning is why scholars continue to discover new insights in the Quran 1400 years later. Each generation finds relevance to their time and circumstances.`,
        explanation: `This is miraculous because:

1. Human authors must choose one meaning, but the Quran conveys multiple meanings simultaneously
2. The layers of meaning remain coherent and don't contradict each other
3. New meanings emerge with scientific and historical discoveries
4. This depth is maintained throughout the entire Quran
5. It demonstrates knowledge beyond human capacity`,
        quranVerses: [
          {
            surah: 3,
            verse: 7,
            arabic: 'هُوَ ٱلَّذِىٓ أَنزَلَ عَلَيْكَ ٱلْكِتَـٰبَ مِنْهُ ءَايَـٰتٌۭ مُّحْكَمَـٰتٌ هُنَّ أُمُّ ٱلْكِتَـٰبِ وَأُخَرُ مُتَشَـٰبِهَـٰتٌۭ',
            translation: 'It is He who has sent down to you, [O Muhammad], the Book; in it are verses [that are] precise - they are the foundation of the Book - and others unspecific.'
          },
          {
            surah: 4,
            verse: 82,
            arabic: 'أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ ٱللَّهِ لَوَجَدُوا۟ فِيهِ ٱخْتِلَـٰفًۭا كَثِيرًۭا',
            translation: 'Then do they not reflect upon the Quran? If it had been from [any] other than Allah, they would have found within it much contradiction.'
          }
        ],
        hadiths: [],
        reference: 'Quran 3:7, 4:82',
        image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80',
      },
      {
        id: 'l5',
        title: 'Unique Literary Form',
        description: 'The Quran has a literary style that is neither poetry nor prose, creating a unique category in Arabic literature.',
        details: `The Quran introduced a completely new literary form in Arabic that had never been seen before. It is:

NOT Poetry because:
- It doesn't follow the strict meter (wazn) required in Arabic poetry
- It doesn't have the same rhyme scheme as poetry
- It doesn't use the same stylistic devices as poetry

NOT Prose because:
- It has rhythmic patterns unlike normal prose
- It has rhyming verse endings
- It has a structured, elevated style

This unique form is called "Nazm" - a category created specifically for the Quran. The Arabs, who were experts in their language, immediately recognized this as something entirely new.

Even the enemies of Islam acknowledged this uniqueness. Al-Walid ibn al-Mughirah, a chief opponent of Islam, said: "By Allah, there is not among you a man who knows poetry better than I... By Allah, what he says (the Quran) does not resemble anything I know, and by Allah, it is very sweet, and it is very beautiful."`,
        explanation: `This is miraculous because:

1. The Arabs had perfected poetry and prose over centuries
2. Creating a new literary form that surpasses both is extraordinary
3. The Quran's form has never been successfully imitated
4. Even enemies acknowledged its uniqueness and beauty
5. This new form became the standard for eloquence in Arabic`,
        quranVerses: [
          {
            surah: 52,
            verse: 33,
            arabic: 'أَمْ يَقُولُونَ تَقَوَّلَهُۥ ۚ بَل لَّا يُؤْمِنُونَ',
            translation: 'Or do they say, "He has made it up"? Rather, they do not believe.'
          },
          {
            surah: 52,
            verse: 34,
            arabic: 'فَلْيَأْتُوا۟ بِحَدِيثٍۢ مِّثْلِهِۦٓ إِن كَانُوا۟ صَـٰدِقِينَ',
            translation: 'Then let them produce a statement like it, if they should be truthful.'
          }
        ],
        hadiths: [
          {
            source: 'Sirah Ibn Hisham',
            text: 'Al-Walid ibn al-Mughirah said about the Quran: "By Allah, there is sweetness in it, and there is beauty upon it. Its top is fruitful and its bottom is gushing forth. It is supreme and cannot be surpassed."'
          }
        ],
        reference: 'Quran 52:33-34',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      },
    ],
  },
  {
    id: 'historical',
    title: 'Historical',
    icon: 'history',
    color: '#03A9F4',
    miracles: [
      {
        id: 'h1',
        title: 'Preservation of Pharaoh\'s Body',
        description: 'The Quran stated that Pharaoh\'s body would be preserved as a sign for future generations.',
        details: `The Quran tells the story of Pharaoh who drowned while pursuing Prophet Moses (peace be upon him) and the Israelites. But it adds a remarkable detail: Allah would preserve Pharaoh's body as a sign for future generations.

This was revealed in the 7th century, when the ancient Egyptian civilization was long forgotten, hieroglyphics couldn't be read, and the pyramids' purpose was unknown. The mummies of the Pharaohs were still buried, undiscovered.

In 1881, Pharaoh Ramses II's mummy was discovered in the Valley of the Kings. When it was examined, scientists found that the body had been preserved remarkably well, and there were signs of drowning and a violent death.

In 1975, the mummy was brought to France for preservation. Dr. Maurice Bucaille, a French physician, examined it and was amazed to find that the Quran had mentioned this preservation 1400 years earlier. This led to his conversion to Islam and his famous book "The Bible, The Quran and Science."`,
        explanation: `This is miraculous because:

1. The Quran mentioned this preservation when no one knew about Egyptian mummies
2. Hieroglyphics weren't deciphered until 1822 (Rosetta Stone)
3. The mummy wasn't discovered until 1881
4. The Quran specifically says the body would be a "sign" - and it has been
5. This prophecy was fulfilled over 1200 years after it was made`,
        quranVerses: [
          {
            surah: 10,
            verse: 90,
            arabic: 'وَجَـٰوَزْنَا بِبَنِىٓ إِسْرَٰٓءِيلَ ٱلْبَحْرَ فَأَتْبَعَهُمْ فِرْعَوْنُ وَجُنُودُهُۥ بَغْيًۭا وَعَدْوًا',
            translation: 'And We took the Children of Israel across the sea, and Pharaoh and his soldiers pursued them in tyranny and enmity.'
          },
          {
            surah: 10,
            verse: 92,
            arabic: 'فَٱلْيَوْمَ نُنَجِّيكَ بِبَدَنِكَ لِتَكُونَ لِمَنْ خَلْفَكَ ءَايَةًۭ ۚ وَإِنَّ كَثِيرًۭا مِّنَ ٱلنَّاسِ عَنْ ءَايَـٰتِنَا لَغَـٰفِلُونَ',
            translation: 'So today We will save you in body that you may be to those who succeed you a sign. And indeed, many among the people, of Our signs, are heedless.'
          }
        ],
        hadiths: [],
        reference: 'Quran 10:90-92',
        image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
      },
      {
        id: 'h2',
        title: 'Victory of the Romans',
        description: 'The Quran predicted the Romans would defeat the Persians within 3-9 years, when this seemed impossible.',
        details: `In 613-614 CE, the Persian Empire defeated the Byzantine Romans in a crushing victory, conquering Jerusalem and taking the True Cross. The Romans were in complete disarray, and everyone believed they were finished.

At this exact time, the Quran was revealed with a bold prophecy: The Romans would be defeated, but they would achieve victory within "bid'i sinin" (3-9 years).

This prophecy seemed impossible because:
1. The Romans had just suffered a devastating defeat
2. The Persians were at the height of their power
3. The Romans had lost their most sacred relic
4. Politically and militarily, a Roman comeback seemed impossible

The Muslims in Makkah were being persecuted, and this prophecy gave them hope. Abu Bakr (may Allah be pleased with him) even made a bet with the polytheists about this prophecy.

Remarkably, in 622 CE, the Roman Emperor Heraclius began his counter-offensive. By 627 CE (exactly within the predicted timeframe), the Romans achieved a decisive victory over the Persians at the Battle of Nineveh.

The prophecy was fulfilled precisely as the Quran had stated.`,
        explanation: `This is miraculous because:

1. The prophecy was made when a Roman victory seemed impossible
2. It specified a timeframe (3-9 years) and was fulfilled within it
3. The Quran took a risk - if wrong, it would have discredited Islam
4. The prophecy involved future events beyond human control
5. It was fulfilled exactly as predicted, strengthening the Muslims' faith`,
        quranVerses: [
          {
            surah: 30,
            verse: 2,
            arabic: 'غُلِبَتِ ٱلرُّومُ',
            translation: 'The Romans have been defeated.'
          },
          {
            surah: 30,
            verse: 3,
            arabic: 'فِىٓ أَدْنَى ٱلْأَرْضِ وَهُم مِّنۢ بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ',
            translation: 'In the nearest land. But they, after their defeat, will overcome.'
          },
          {
            surah: 30,
            verse: 4,
            arabic: 'فِى بِضْعِ سِنِينَ ۗ لِلَّهِ ٱلْأَمْرُ مِن قَبْلُ وَمِنۢ بَعْدُ ۚ وَيَوْمَئِذٍۢ يَفْرَحُ ٱلْمُؤْمِنُونَ',
            translation: 'Within three to nine years. To Allah belongs the command before and after. And that day the believers will rejoice.'
          }
        ],
        hadiths: [
          {
            source: 'Tafsir Ibn Kathir',
            text: 'Abu Bakr made a bet with Ubayy ibn Khalaf about this prophecy. When the Romans won, Abu Bakr won the bet and brought the winnings to the Prophet ﷺ, who told him to give it in charity.'
          }
        ],
        reference: 'Quran 30:2-4',
        image: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=800&q=80',
      },
      {
        id: 'h3',
        title: 'Haman in Egypt',
        description: 'The Quran mentions Haman as a minister of Pharaoh in Egypt, a fact unknown until hieroglyphics were deciphered.',
        details: `The Quran mentions Haman as a close associate and minister of Pharaoh in ancient Egypt. This was problematic for critics because:

1. The Bible mentions Haman as a minister in Persia (Book of Esther), not Egypt
2. There was no historical record of Haman in Egypt
3. Critics claimed the Quran confused the Biblical Haman with Pharaoh's time

However, when hieroglyphics were finally deciphered in the 19th century using the Rosetta Stone, an amazing discovery was made:

The name "Haman" appeared in Egyptian inscriptions as a close associate of Pharaoh. The hieroglyphics showed that Haman was involved in building projects, specifically stone construction - exactly as the Quran describes!

The Quran states that Pharaoh ordered Haman to build a tower, and Haman is described as being in charge of construction. The hieroglyphic evidence confirms:
- A person named Haman existed in ancient Egypt
- He was close to Pharaoh
- He was involved in stone building projects

This information was completely unknown in the 7th century and only came to light 1200 years later.`,
        explanation: `This is miraculous because:

1. Hieroglyphics couldn't be read until 1822 (Rosetta Stone)
2. The Quran mentioned Haman in Egypt when all known sources placed him in Persia
3. Critics used this as "proof" the Quran was wrong
4. Archaeological evidence vindicated the Quran's account
5. Prophet Muhammad ﷺ had no access to Egyptian hieroglyphics`,
        quranVerses: [
          {
            surah: 28,
            verse: 6,
            arabic: 'وَنُمَكِّنَ لَهُمْ فِى ٱلْأَرْضِ وَنُرِىَ فِرْعَوْنَ وَهَـٰمَـٰنَ وَجُنُودَهُمَا مِنْهُم مَّا كَانُوا۟ يَحْذَرُونَ',
            translation: 'And establish them in the land and show Pharaoh and Haman and their soldiers through them that which they had feared.'
          },
          {
            surah: 28,
            verse: 38,
            arabic: 'وَقَالَ فِرْعَوْنُ يَـٰٓأَيُّهَا ٱلْمَلَأُ مَا عَلِمْتُ لَكُم مِّنْ إِلَـٰهٍ غَيْرِى فَأَوْقِدْ لِى يَـٰهَـٰمَـٰنُ عَلَى ٱلطِّينِ فَٱجْعَل لِّى صَرْحًۭا',
            translation: 'And Pharaoh said, "O eminent ones, I have not known you to have a god other than me. Then ignite for me, O Haman, [a fire] upon the clay and make for me a tower."'
          },
          {
            surah: 40,
            verse: 36,
            arabic: 'وَقَالَ فِرْعَوْنُ يَـٰهَـٰمَـٰنُ ٱبْنِ لِى صَرْحًۭا لَّعَلِّىٓ أَبْلُغُ ٱلْأَسْبَـٰبَ',
            translation: 'And Pharaoh said, "O Haman, construct for me a tower that I might reach the ways."'
          }
        ],
        hadiths: [],
        reference: 'Quran 28:6, 28:38, 40:36',
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
      },
      {
        id: 'h4',
        title: 'The Lowest Point on Earth',
        description: 'The Quran mentions a battle at the lowest point on Earth, a geographical fact unknown in the 7th century.',
        details: `The Quran describes the Roman-Persian battle as occurring in "adna al-ard" (أدنى الأرض). The Arabic word "adna" has two meanings:
1. Nearest
2. Lowest

The verse can be read as: "The Romans were defeated in the nearest land" or "The Romans were defeated in the lowest land."

The battle between the Romans and Persians took place in the region near the Dead Sea, which is:
- The lowest point on Earth's surface (430 meters below sea level)
- Near to Arabia (the nearest land to the Arabs)

This dual meaning is remarkable because:
1. The Dead Sea being the lowest point on Earth was unknown in the 7th century
2. This fact was only discovered with modern surveying equipment
3. The Quran's use of "adna" perfectly captures both meanings
4. No one in Arabia could have known this geographical detail

The Dead Sea's status as the lowest point on Earth was only confirmed in modern times with precise elevation measurements.`,
        explanation: `This is miraculous because:

1. Precise elevation measurements didn't exist in the 7th century
2. The Dead Sea's status as Earth's lowest point was unknown
3. The Quran uses a word with dual meaning, both of which are accurate
4. This geographical detail couldn't have been known without modern surveying
5. The prophecy and geographical fact are combined in one verse`,
        quranVerses: [
          {
            surah: 30,
            verse: 2,
            arabic: 'غُلِبَتِ ٱلرُّومُ',
            translation: 'The Romans have been defeated.'
          },
          {
            surah: 30,
            verse: 3,
            arabic: 'فِىٓ أَدْنَى ٱلْأَرْضِ وَهُم مِّنۢ بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ',
            translation: 'In the nearest land [or lowest land]. But they, after their defeat, will overcome.'
          }
        ],
        hadiths: [],
        reference: 'Quran 30:2-3',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      },
      {
        id: 'h5',
        title: 'Prophecy of Abu Lahab',
        description: 'The Quran prophesied that Abu Lahab would never accept Islam, a bold prophecy that could have been easily falsified.',
        details: `Abu Lahab was one of the Prophet Muhammad's ﷺ uncles and his fiercest enemy. An entire chapter of the Quran (Surah Al-Masad) was revealed condemning him and his wife, stating they would enter Hellfire.

This was an incredibly bold prophecy because:
1. It was revealed publicly in Makkah
2. Abu Lahab was alive and could hear it
3. He could have falsified it simply by pretending to accept Islam
4. The Quran stated with certainty he would never believe

If Abu Lahab had said the shahada (even insincerely), it would have discredited the Quran and Islam. Yet, despite having every motivation to do so, despite it being the easiest way to discredit Islam, Abu Lahab never accepted Islam - not even falsely.

He died as a disbeliever, exactly as the Quran had prophesied. This demonstrates:
- Divine knowledge of the future
- Confidence in the prophecy
- Protection of the Quran's integrity

No human would make such a risky prophecy unless they had divine knowledge that it would be fulfilled.`,
        explanation: `This is miraculous because:

1. The prophecy could have been easily falsified by Abu Lahab
2. Abu Lahab had every reason to falsify it to discredit Islam
3. Simply saying "I believe" would have been enough to prove the Quran wrong
4. Yet he never did, despite the prophecy being public for years
5. This shows divine knowledge of Abu Lahab's future choices`,
        quranVerses: [
          {
            surah: 111,
            verse: 1,
            arabic: 'تَبَّتْ يَدَآ أَبِى لَهَبٍۢ وَتَبَّ',
            translation: 'May the hands of Abu Lahab be ruined, and ruined is he.'
          },
          {
            surah: 111,
            verse: 2,
            arabic: 'مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ',
            translation: 'His wealth will not avail him or that which he gained.'
          },
          {
            surah: 111,
            verse: 3,
            arabic: 'سَيَصْلَىٰ نَارًۭا ذَاتَ لَهَبٍۢ',
            translation: 'He will [enter to] burn in a Fire of [blazing] flame.'
          },
          {
            surah: 111,
            verse: 4,
            arabic: 'وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ',
            translation: 'And his wife [as well] - the carrier of firewood.'
          },
          {
            surah: 111,
            verse: 5,
            arabic: 'فِى جِيدِهَا حَبْلٌۭ مِّن مَّسَدٍۭ',
            translation: 'Around her neck is a rope of [twisted] fiber.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 4971',
            text: 'When "And warn your closest kindred" was revealed, the Prophet ﷺ stood up and said, "O people of Quraysh! Save yourselves from the Fire!" Abu Lahab said, "May you perish! Is this why you gathered us?" Then Surah Al-Masad was revealed.'
          }
        ],
        reference: 'Quran 111:1-5',
        image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&q=80',
      },
    ],
  },
  {
    id: 'mathematical',
    title: 'Mathematical',
    icon: 'calculate',
    color: '#FF9800',
    miracles: [
      {
        id: 'm1',
        title: 'The Miracle of Number 19',
        description: 'The number 19 appears in intricate mathematical patterns throughout the Quran, demonstrating divine design.',
        details: `The number 19 is explicitly mentioned in the Quran: "Over it are nineteen [angels]" (74:30). Following this verse, Allah says: "And We have not made the keepers of the Fire except angels. And We have not made their number except as a trial for those who disbelieve" (74:31).

This number appears in remarkable mathematical patterns throughout the Quran:

**BASIC STRUCTURE:**
1. The Quran has 114 chapters (19 × 6)
2. The first revelation (96:1-5) consists of 19 words
3. The first complete chapter revealed (Chapter 96) has 19 verses
4. The first verse revealed (96:1) has 19 letters in Arabic
5. The last revelation (Chapter 110) has 19 words

**THE BASMALAH (بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ):**
1. Consists of 19 Arabic letters
2. The first word (Ism/name) appears 19 times in the Quran
3. The second word (Allah) appears 2,698 times (19 × 142)
4. The third word (Ar-Rahman) appears 57 times (19 × 3)
5. The fourth word (Ar-Rahim) appears 114 times (19 × 6)

**CHAPTER 74 (Where 19 is mentioned):**
1. It is the 74th chapter (19 + 19 + 19 + 19 - 2)
2. Verse 74:30 says "Over it are nineteen"
3. From verse 74:30 to the end of the Quran, there are 19 × 6 = 114 chapters
4. The word "Muddaththir" (the title) has 19 letters when written in Arabic

**MATHEMATICAL PATTERNS:**
1. The sum of all chapter numbers (1+2+3...+114) = 6,555 (19 × 345)
2. The Quran has 6,236 numbered verses (excluding Basmalah)
3. The Basmalah appears 114 times (19 × 6)
4. Chapter 9 is the only chapter without Basmalah, but Chapter 27 has two Basmalahs, maintaining the count
5. From the missing Basmalah in Chapter 9 to the extra Basmalah in Chapter 27 is exactly 19 chapters

**WORD FREQUENCIES:**
1. The word "Quran" appears 57 times (19 × 3)
2. The phrase "Bismillah Ar-Rahman Ar-Rahim" appears 114 times (19 × 6)
3. The word "Allah" appears 2,698 times (19 × 142)

**CHAPTER 96 (First Revelation):**
1. Has 19 verses
2. Has 304 letters (19 × 16)
3. The first 5 verses (first revelation) have 19 words

**UNIQUE LETTERS:**
1. The Quran uses 29 unique Arabic letters
2. 29 chapters begin with unique letter combinations (Muqatta'at)
3. These letters appear in patterns divisible by 19

This is just a fraction of the 19-based patterns. The mathematical structure is so intricate that it would be impossible to maintain while preserving the linguistic eloquence and profound meaning of the Quran.`,
        explanation: `This is miraculous because:

1. The patterns are too complex to be coincidental
2. The Quran was revealed over 23 years, yet maintains these patterns
3. The mathematical structure doesn't compromise the linguistic beauty or meaning
4. These patterns were only discovered with computers in the modern era
5. No human author could maintain such intricate mathematical patterns while creating eloquent, meaningful text
6. The number 19 is prime, making these patterns even more remarkable
7. The patterns exist at multiple levels: letters, words, verses, chapters
8. Changing even one letter would break multiple patterns
9. This serves as a protection against alteration
10. It demonstrates knowledge beyond human capability`,
        quranVerses: [
          {
            surah: 74,
            verse: 30,
            arabic: 'عَلَيْهَا تِسْعَةَ عَشَرَ',
            translation: 'Over it are nineteen [angels].'
          },
          {
            surah: 74,
            verse: 31,
            arabic: 'وَمَا جَعَلْنَآ أَصْحَـٰبَ ٱلنَّارِ إِلَّا مَلَـٰٓئِكَةًۭ ۙ وَمَا جَعَلْنَا عِدَّتَهُمْ إِلَّا فِتْنَةًۭ لِّلَّذِينَ كَفَرُوا۟',
            translation: 'And We have not made the keepers of the Fire except angels. And We have not made their number except as a trial for those who disbelieve.'
          },
          {
            surah: 74,
            verse: 35,
            arabic: 'إِنَّهَا لَإِحْدَى ٱلْكُبَرِ',
            translation: 'Indeed, it [the Fire] is of the greatest [afflictions].'
          }
        ],
        hadiths: [],
        reference: 'Quran 74:30-31',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      },
      {
        id: 'm2',
        title: 'Word Frequency Miracles',
        description: 'Certain words and their opposites appear the exact same number of times, demonstrating precise mathematical balance.',
        details: `The Quran contains remarkable word frequency patterns where related words appear in mathematically significant numbers:

**EQUAL PAIRS (Words appearing the same number of times):**
1. "Man" (rajul) - 24 times | "Woman" (imra'ah) - 24 times
2. "Life" (hayat) - 145 times | "Death" (mawt) - 145 times
3. "Angels" (mala'ikah) - 88 times | "Devils" (shayatin) - 88 times
4. "This world" (dunya) - 115 times | "Hereafter" (akhirah) - 115 times
5. "Benefit" (naf') - 50 times | "Corrupt" (fasad) - 50 times
6. "Reward" (thawab) - 107 times | "Action" (fi'l) - 107 times
7. "Love" (mahabbah) - 83 times | "Obedience" (ta'ah) - 83 times
8. "Guidance" (huda) - 79 times | "Mercy" (rahmah) - 79 times
9. "Hardship" ('usr) - 12 times | "Patience" (sabr) - 12 times
10. "Tongue" (lisan) - 25 times | "Sermon" (maw'izah) - 25 times

**CALENDAR PATTERNS:**
1. "Day" (yawm) - 365 times (days in a year)
2. "Days" (ayyam, yawmayn) - 30 times (days in a month)
3. "Month" (shahr) - 12 times (months in a year)
4. "Hour" (sa'ah) - 24 times (hours in a day)

**MATHEMATICAL RELATIONSHIPS:**
1. "Seven heavens" - mentioned 7 times
2. "Creation of heavens" - 7 times
3. "Say" (qul) - 332 times | "They said" (qalu) - 332 times
4. "Seeking refuge" - 23 times | "Refuge" - 23 times
5. "Punishment" - 117 times | "Forgiveness" - 234 times (exactly double)
6. "Righteous" (salihun) - 50 times | "Wicked" (fasiqun) - 50 times

**CREATION PATTERNS:**
1. "Plant" - 26 times | "Tree" - 26 times
2. "Sea" (bahr) - 32 times | "Land" (barr) - 13 times
   Ratio: 32:13 = 71.11% : 28.89% (matches Earth's water:land ratio!)

**WORSHIP PATTERNS:**
1. "Prayer" (salat) - 5 times in command form (5 daily prayers)
2. "Zakat" (charity) - mentioned 32 times, same as "salat" when counted together

This mathematical precision exists while maintaining:
- Perfect linguistic eloquence
- Profound meanings
- Coherent narratives
- Grammatical perfection

No human author could maintain such precise word counts while creating meaningful, eloquent text over 23 years.`,
        explanation: `This is miraculous because:

1. These patterns were only discovered with computer analysis
2. The Quran was revealed over 23 years, yet maintains precise word counts
3. The patterns exist in the original Arabic, not translations
4. Changing even one word would break multiple patterns
5. The sea:land ratio matching Earth's actual ratio is extraordinary
6. The calendar patterns (365, 12, 30) are precise
7. Equal pairs show perfect balance in the Quran's message
8. No human could maintain such precision while preserving eloquence
9. These patterns serve as protection against alteration
10. The mathematical structure complements the linguistic miracle`,
        quranVerses: [
          {
            surah: 54,
            verse: 17,
            arabic: 'وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍۢ',
            translation: 'And We have certainly made the Quran easy for remembrance, so is there any who will remember?'
          },
          {
            surah: 4,
            verse: 82,
            arabic: 'أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ ٱللَّهِ لَوَجَدُوا۟ فِيهِ ٱخْتِلَـٰفًۭا كَثِيرًۭا',
            translation: 'Then do they not reflect upon the Quran? If it had been from [any] other than Allah, they would have found within it much contradiction.'
          }
        ],
        hadiths: [],
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
      },
      {
        id: 'm3',
        title: 'Land and Sea Ratio',
        description: 'The ratio of "land" to "sea" mentions in the Quran matches Earth\'s actual land to sea ratio.',
        details: `One of the most remarkable mathematical miracles in the Quran is the ratio of the words "land" (barr) and "sea" (bahr).

**THE COUNTS:**
- "Sea" (bahr) appears: 32 times
- "Land" (barr) appears: 13 times
- Total: 45 times

**THE RATIO:**
- Sea percentage: 32/45 = 71.11%
- Land percentage: 13/45 = 28.89%

**EARTH'S ACTUAL RATIO:**
- Water coverage: 71.11%
- Land coverage: 28.89%

The match is precise to two decimal places!

This is extraordinary because:
1. The Quran was revealed in the 7th century
2. Accurate measurement of Earth's surface was impossible then
3. The ratio was only determined with modern satellite technology
4. The Quran didn't need to mention these words this many times
5. The precision (71.11% vs 71.11%) is remarkable

**ADDITIONAL PATTERNS:**
When you count all derivatives and forms:
- Water-related words (bahr, ma', nahr): appear in patterns related to water coverage
- Land-related words (ard, barr, jabal): appear in patterns related to land coverage

The Quran uses these words naturally in context, not forced. Yet the mathematical ratio emerges perfectly.

This demonstrates:
- Divine knowledge of Earth's geography
- Mathematical precision in word choice
- Protection against alteration (changing one word breaks the ratio)
- A sign for modern people with technology to verify it`,
        explanation: `This is miraculous because:

1. Earth's surface ratio was unknown in the 7th century
2. Accurate measurement required satellite technology
3. The precision to two decimal places is extraordinary
4. The words are used naturally in context, not forced
5. This pattern was only discovered in modern times
6. No human author could plan such precise word counts
7. It demonstrates divine knowledge of Earth's geography
8. The ratio serves as a mathematical signature
9. Changing even one occurrence would break the pattern
10. This is verifiable by anyone who can count`,
        quranVerses: [
          {
            surah: 2,
            verse: 164,
            arabic: 'إِنَّ فِى خَلْقِ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَـٰفِ ٱلَّيْلِ وَٱلنَّهَارِ وَٱلْفُلْكِ ٱلَّتِى تَجْرِى فِى ٱلْبَحْرِ',
            translation: 'Indeed, in the creation of the heavens and earth, and the alternation of the night and the day, and the [great] ships which sail through the sea...'
          },
          {
            surah: 27,
            verse: 63,
            arabic: 'أَمَّن يَهْدِيكُمْ فِى ظُلُمَـٰتِ ٱلْبَرِّ وَٱلْبَحْرِ',
            translation: 'Is He [not best] who guides you through the darknesses of the land and sea?'
          }
        ],
        hadiths: [],
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      },
      {
        id: 'm4',
        title: 'Symmetrical Structure',
        description: 'The Quran has a symmetrical structure in its chapters, verses, and word patterns.',
        details: `The Quran exhibits remarkable symmetry at multiple levels:

**CHAPTER STRUCTURE:**
1. Total chapters: 114 (19 × 6)
2. Chapters can be divided into two equal halves of 57 chapters each
3. The middle chapters (57-58) are about balance and justice
4. First half focuses more on law and guidance
5. Second half focuses more on stories and warnings

**VERSE SYMMETRY:**
1. The Quran has 6,236 numbered verses (excluding Basmalah)
2. The middle verse is about balance and justice
3. Verses are distributed in patterns across chapters

**WORD PATTERNS:**
1. The Quran begins with "Bismillah" (In the name of Allah)
2. The Quran ends with "min al-jinnati wan-nas" (from jinn and mankind)
3. These bookends create perfect symmetry

**NUMERICAL SYMMETRY:**
1. Chapter 1 (Al-Fatihah) has 7 verses
2. It's recited in every unit of prayer
3. The number 7 appears throughout the Quran in significant patterns
4. "Seven heavens" mentioned 7 times
5. Creation in 6 days, rest on the 7th (pattern of completion)

**THEMATIC SYMMETRY:**
1. Stories are told multiple times with different emphases
2. Each retelling adds new dimensions
3. The repetitions create a spiral structure, not linear
4. Themes introduced early are resolved later in symmetrical patterns

**LINGUISTIC SYMMETRY:**
1. Verses often have internal symmetry (chiastic structure)
2. Parallel phrases create balance
3. Rhyme schemes create auditory symmetry

**MATHEMATICAL SYMMETRY:**
1. First revelation: 19 words, 76 letters (19 × 4)
2. Last revelation: 19 words
3. This creates a perfect bookend

**CHAPTER 19 (Maryam):**
1. Named after Mary, mother of Jesus
2. Has 98 verses (19 + 19 + 19 + 19 + 19 + 3)
3. Mentions Jesus and his miraculous birth
4. The number 19 appears in patterns throughout

This symmetry exists while maintaining:
- Linguistic eloquence
- Profound meanings
- Historical accuracy
- Scientific accuracy
- Coherent narratives

No human author could create such multi-layered symmetry over 23 years while preserving all other aspects of the text.`,
        explanation: `This is miraculous because:

1. The symmetry exists at multiple levels simultaneously
2. The Quran was revealed over 23 years, yet maintains perfect structure
3. Symmetry doesn't compromise meaning or eloquence
4. The patterns were only discovered with modern analysis
5. Changing any part would break multiple symmetrical patterns
6. The structure serves as protection against alteration
7. It demonstrates intentional design, not random composition
8. The mathematical precision is beyond human capability
9. The symmetry enhances memorization and recitation
10. It shows divine authorship and planning`,
        quranVerses: [
          {
            surah: 15,
            verse: 87,
            arabic: 'وَلَقَدْ ءَاتَيْنَـٰكَ سَبْعًۭا مِّنَ ٱلْمَثَانِى وَٱلْقُرْءَانَ ٱلْعَظِيمَ',
            translation: 'And We have certainly given you, [O Muhammad], seven of the often repeated [verses] and the great Quran.'
          },
          {
            surah: 39,
            verse: 23,
            arabic: 'ٱللَّهُ نَزَّلَ أَحْسَنَ ٱلْحَدِيثِ كِتَـٰبًۭا مُّتَشَـٰبِهًۭا مَّثَانِىَ',
            translation: 'Allah has sent down the best statement: a consistent Book wherein is reiteration.'
          }
        ],
        hadiths: [],
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
      },
    ],
  },
  {
    id: 'prophetic',
    title: 'Prophetic',
    icon: 'star',
    color: '#9C27B0',
    miracles: [
      {
        id: 'p1',
        title: 'Conquest of Makkah',
        description: 'The Prophet ﷺ saw a vision that he would enter Makkah safely, which was fulfilled exactly as prophesied.',
        details: `In the 6th year after Hijrah, the Prophet Muhammad ﷺ saw a vision that he and his companions would enter the Sacred Mosque in Makkah safely, with heads shaved and hair shortened, without fear.

At that time, this seemed impossible because:
1. The Muslims were in Madinah, exiled from Makkah
2. The Quraysh were hostile and would never allow peaceful entry
3. The Muslims were relatively weak militarily
4. There was no indication this would happen soon

The Quran revealed this vision: "Certainly has Allah showed to His Messenger the vision in truth. You will surely enter al-Masjid al-Haram, if Allah wills, in safety, with your heads shaved and [hair] shortened, not fearing [anyone]." (48:27)

When the Muslims set out for Umrah that year, they were stopped at Hudaybiyyah and had to return without entering Makkah. Some companions were confused - wasn't the prophecy supposed to be fulfilled?

But the Prophet ﷺ assured them it would happen, just not immediately. The Treaty of Hudaybiyyah was signed, which seemed like a setback but was actually a strategic victory.

The following year (7 AH), the Muslims performed Umrah peacefully, exactly as prophesied - with heads shaved, in safety, without fear.

Two years later (8 AH), Makkah was conquered peacefully, and the Muslims entered the Sacred Mosque as the prophecy had foretold.

Every detail of the vision was fulfilled precisely.`,
        explanation: `This is miraculous because:

1. The prophecy was made when it seemed impossible
2. It was publicly revealed in the Quran, risking credibility if wrong
3. Every detail was fulfilled: safety, shaved heads, no fear
4. The timing was in Allah's control, not human planning
5. The peaceful conquest was unprecedented in Arabian history
6. The prophecy strengthened the believers' faith during difficulty
7. It demonstrated divine knowledge of future events
8. The fulfillment was witnessed by thousands
9. It showed the Prophet's ﷺ truthfulness
10. It proved the Quran's divine origin`,
        quranVerses: [
          {
            surah: 48,
            verse: 27,
            arabic: 'لَّقَدْ صَدَقَ ٱللَّهُ رَسُولَهُ ٱلرُّءْيَا بِٱلْحَقِّ ۖ لَتَدْخُلُنَّ ٱلْمَسْجِدَ ٱلْحَرَامَ إِن شَآءَ ٱللَّهُ ءَامِنِينَ مُحَلِّقِينَ رُءُوسَكُمْ وَمُقَصِّرِينَ لَا تَخَافُونَ',
            translation: 'Certainly has Allah showed to His Messenger the vision in truth. You will surely enter al-Masjid al-Haram, if Allah wills, in safety, with your heads shaved and [hair] shortened, not fearing [anyone].'
          },
          {
            surah: 48,
            verse: 1,
            arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًۭا مُّبِينًۭا',
            translation: 'Indeed, We have given you, [O Muhammad], a clear conquest.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 4177',
            text: 'The Prophet ﷺ said to his companions: "You will enter the Sacred Mosque, if Allah wills, in safety, with your heads shaved and hair shortened, not fearing anyone."'
          },
          {
            source: 'Sahih Muslim 1780',
            text: 'When the Treaty of Hudaybiyyah was concluded, Umar said: "O Messenger of Allah, are we not upon the truth?" The Prophet ﷺ said: "Yes." Umar said: "Then why should we accept humiliation in our religion?" The Prophet ﷺ said: "I am the Messenger of Allah and I will not disobey Him, and He will make me victorious."'
          }
        ],
        reference: 'Quran 48:27, 48:1',
        image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
      },
      {
        id: 'p2',
        title: 'Protection of the Quran',
        description: 'The Prophet ﷺ prophesied the Quran would be preserved forever, a prophecy fulfilled for 1400 years.',
        details: `The Prophet Muhammad ﷺ made a bold claim: the Quran would be preserved perfectly, unchanged, for all time. This was extraordinary because:

1. All previous scriptures had been altered or lost
2. The Torah and Gospel had numerous versions and changes
3. Ancient texts typically deteriorate or get modified
4. There was no printing press or modern preservation technology
5. The Muslims were a small, persecuted community

Yet the Prophet ﷺ was confident, and the Quran itself declared: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." (15:9)

**HOW THE PROPHECY WAS FULFILLED:**

1. **Oral Preservation:**
   - The Prophet ﷺ encouraged memorization
   - Thousands of companions memorized the entire Quran
   - This chain of memorization continues unbroken to today
   - Currently, millions of Muslims have memorized the entire Quran

2. **Written Preservation:**
   - The Quran was written during the Prophet's ﷺ lifetime
   - Abu Bakr compiled it into one book
   - Uthman standardized the copies
   - Ancient manuscripts match today's Quran exactly

3. **Universal Text:**
   - Unlike the Bible with multiple versions, the Quran has one text
   - All Muslims worldwide read the same Arabic Quran
   - Translations exist, but the original Arabic is preserved

4. **Scientific Verification:**
   - The Birmingham Quran manuscript (dated 568-645 CE) matches today's Quran
   - The Topkapi manuscript (early 8th century) is identical
   - Carbon dating confirms ancient manuscripts match modern copies

5. **Protection Mechanism:**
   - The memorization tradition prevents alteration
   - If someone changes a word, millions of memorizers would catch it
   - The mathematical patterns (like the number 19) would break
   - The linguistic eloquence would be disrupted

Over 1400 years, through wars, persecutions, book burnings, and attempts to destroy Islam, the Quran has remained perfectly preserved - exactly as prophesied.`,
        explanation: `This is miraculous because:

1. No other ancient text has been preserved with such precision
2. The Bible has thousands of textual variants
3. The Quran's preservation was achieved without modern technology
4. Millions memorizing the same text is unprecedented
5. The prophecy has been fulfilled for 1400 years
6. Every attempt to alter or destroy the Quran has failed
7. The preservation method (memorization + writing) is divinely designed
8. Ancient manuscripts prove no changes have occurred
9. The mathematical patterns serve as a protection mechanism
10. This fulfills the Quranic promise of preservation`,
        quranVerses: [
          {
            surah: 15,
            verse: 9,
            arabic: 'إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ',
            translation: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.'
          },
          {
            surah: 41,
            verse: 42,
            arabic: 'لَّا يَأْتِيهِ ٱلْبَـٰطِلُ مِنۢ بَيْنِ يَدَيْهِ وَلَا مِنْ خَلْفِهِۦ ۖ تَنزِيلٌۭ مِّنْ حَكِيمٍ حَمِيدٍۢ',
            translation: 'Falsehood cannot approach it from before it or from behind it; [it is] a revelation from a [Lord who is] Wise and Praiseworthy.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Bukhari 5027',
            text: 'The Prophet ﷺ said: "The example of the one who memorizes the Quran is like the owner of tied camels. If he keeps them tied, he will control them, but if he releases them, they will run away."'
          },
          {
            source: 'Sunan Ibn Majah 215',
            text: 'The Prophet ﷺ said: "This Quran will not be washed away by water (i.e., it will be preserved in the hearts)."'
          }
        ],
        reference: 'Quran 15:9, 41:42',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
      },
      {
        id: 'p3',
        title: 'Spread of Islam',
        description: 'The Prophet ﷺ prophesied Islam would spread across the world, from a small persecuted community to 1.8 billion followers.',
        details: `When the Prophet Muhammad ﷺ began his mission, the Muslims were a tiny, persecuted minority in Makkah. They were tortured, boycotted, and forced to flee. Yet in this dire situation, the Prophet ﷺ made an extraordinary prophecy:

"This matter (Islam) will reach wherever the night and day reach." (Musnad Ahmad)

At the time, this seemed impossible:
1. The Muslims numbered only a few dozen
2. They were being persecuted and killed
3. They had no political power or military strength
4. Arabia was divided into warring tribes
5. The superpowers (Persia and Rome) seemed invincible

Yet the Prophet ﷺ made specific prophecies:

**PROPHECY 1: Islam will spread to every corner of the Earth**
"There will not remain a house of mud or hair (i.e., in cities or deserts) except that Allah will cause this religion to enter it, bringing honor to some and humiliation to others - honor with which Allah honors Islam and humiliation with which Allah humiliates disbelief." (Musnad Ahmad)

**PROPHECY 2: The treasures of Persia and Rome will be conquered**
While the Muslims were weak in Makkah, the Prophet ﷺ said: "The treasures of Khosrau and Caesar will be spent in the way of Allah." (Sahih Bukhari)

**PROPHECY 3: Islam will reach the East and West**
The Prophet ﷺ said: "The earth was gathered for me so that I saw its eastern and western parts, and the dominion of my nation will reach what was gathered for me." (Sahih Muslim)

**FULFILLMENT:**

1. **During the Prophet's ﷺ lifetime:**
   - Islam spread throughout Arabia
   - Makkah was conquered peacefully
   - Tribes from across Arabia accepted Islam

2. **Within 100 years:**
   - The Persian Empire was conquered
   - Large parts of the Roman Empire were conquered
   - Islam spread from Spain to India

3. **Today (1400 years later):**
   - Islam is the second-largest religion (1.8 billion followers)
   - Muslims live in every country on Earth
   - Islam is the fastest-growing religion
   - The prophecy "wherever night and day reach" is fulfilled

This growth happened despite:
- Constant persecution
- Crusades and invasions
- Colonial attempts to suppress Islam
- Modern propaganda against Islam

Yet Islam continues to spread, exactly as prophesied.`,
        explanation: `This is miraculous because:

1. The prophecy was made when Muslims were weak and persecuted
2. It seemed impossible at the time
3. The spread happened despite constant opposition
4. The prophecy specified global reach - now fulfilled
5. Islam spread through both conquest and peaceful conversion
6. The religion has survived 1400 years of challenges
7. It's currently the fastest-growing religion
8. The prophecy about Persia and Rome was fulfilled within decades
9. No human could predict such growth from such humble beginnings
10. The fulfillment continues to this day`,
        quranVerses: [
          {
            surah: 48,
            verse: 28,
            arabic: 'هُوَ ٱلَّذِىٓ أَرْسَلَ رَسُولَهُۥ بِٱلْهُدَىٰ وَدِينِ ٱلْحَقِّ لِيُظْهِرَهُۥ عَلَى ٱلدِّينِ كُلِّهِۦ ۚ وَكَفَىٰ بِٱللَّهِ شَهِيدًۭا',
            translation: 'It is He who sent His Messenger with guidance and the religion of truth to manifest it over all religion. And sufficient is Allah as Witness.'
          },
          {
            surah: 61,
            verse: 9,
            arabic: 'هُوَ ٱلَّذِىٓ أَرْسَلَ رَسُولَهُۥ بِٱلْهُدَىٰ وَدِينِ ٱلْحَقِّ لِيُظْهِرَهُۥ عَلَى ٱلدِّينِ كُلِّهِۦ وَلَوْ كَرِهَ ٱلْمُشْرِكُونَ',
            translation: 'It is He who has sent His Messenger with guidance and the religion of truth to manifest it over all religion, although those who associate others with Allah dislike it.'
          }
        ],
        hadiths: [
          {
            source: 'Musnad Ahmad 16509',
            text: 'The Prophet ﷺ said: "This matter (Islam) will reach wherever the night and day reach, and Allah will not leave a house of mud or hair except that Allah will cause this religion to enter it."'
          },
          {
            source: 'Sahih Muslim 2889',
            text: 'The Prophet ﷺ said: "The earth was gathered for me so that I saw its eastern and western parts, and the dominion of my nation will reach what was gathered for me."'
          },
          {
            source: 'Sahih Bukhari 3120',
            text: 'The Prophet ﷺ said: "The treasures of Khosrau and Caesar will be spent in the way of Allah."'
          }
        ],
        reference: 'Quran 48:28, 61:9',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
      },
      {
        id: 'p4',
        title: 'Competition in Building Tall Structures',
        description: 'The Prophet ﷺ prophesied people would compete in constructing tall buildings, a sign of the Last Day.',
        details: `In a famous hadith, the Prophet Muhammad ﷺ described the signs of the Last Day. One of the most striking prophecies was about people competing in building tall structures.

**THE PROPHECY:**
The Prophet ﷺ was asked about the signs of the Hour (Day of Judgment). He mentioned: "When you see barefoot, naked, destitute shepherds competing in constructing tall buildings." (Sahih Muslim)

In another narration: "The Hour will not be established until... people compete with one another in constructing high buildings." (Sahih Bukhari)

**CONTEXT OF THE PROPHECY:**
When this was said:
1. Arabia was a desert with simple dwellings
2. The Bedouins (shepherds) lived in tents
3. They had no interest in or resources for construction
4. Tall buildings were rare and impractical in the desert
5. The idea of shepherds building skyscrapers was absurd

**FULFILLMENT:**

1. **The Arabian Peninsula:**
   - The descendants of Bedouin shepherds now rule oil-rich nations
   - UAE, Saudi Arabia, Qatar, Kuwait - all were Bedouin territories
   - These nations now compete in building the world's tallest structures

2. **Specific Examples:**
   - Burj Khalifa (Dubai, UAE): 828 meters - world's tallest building
   - Makkah Royal Clock Tower (Saudi Arabia): 601 meters
   - Abraj Al Bait (Saudi Arabia): massive complex
   - Jeddah Tower (under construction): planned to exceed 1 km
   - Qatar's skyscrapers for World Cup 2022

3. **The Competition:**
   - Each Gulf nation tries to outdo the others
   - "Who can build the tallest?" is a real competition
   - Billions spent on architectural marvels
   - The competition is explicit and public

4. **From Shepherds to Builders:**
   - Within 2-3 generations, Bedouins became wealthy
   - Oil wealth transformed desert dwellers
   - Those who lived in tents now build skyscrapers
   - The transformation happened in the 20th-21st centuries

**WHY THIS IS REMARKABLE:**
The Prophet ﷺ specifically mentioned:
- Barefoot, naked, destitute shepherds (describing poverty)
- Competing (not just building, but competing)
- Tall buildings (not just houses, but tall structures)

All three elements are fulfilled precisely in the modern Gulf states.`,
        explanation: `This is miraculous because:

1. The prophecy was made 1400 years ago in a desert environment
2. It seemed absurd that shepherds would build tall buildings
3. The transformation happened exactly as described
4. The competition aspect is explicitly fulfilled
5. The prophecy specified the Arabian Peninsula (where shepherds were)
6. The timeframe (sign of the Last Day) suggests modern times
7. No human could predict such a specific social transformation
8. The prophecy has been fulfilled in our lifetime
9. It demonstrates knowledge of future events
10. It serves as a warning sign for the approaching Hour`,
        quranVerses: [
          {
            surah: 47,
            verse: 18,
            arabic: 'فَهَلْ يَنظُرُونَ إِلَّا ٱلسَّاعَةَ أَن تَأْتِيَهُم بَغْتَةًۭ ۖ فَقَدْ جَآءَ أَشْرَاطُهَا',
            translation: 'Then do they await except that the Hour should come upon them unexpectedly? But already there have come [some of] its indications.'
          }
        ],
        hadiths: [
          {
            source: 'Sahih Muslim 8',
            text: 'The Prophet ﷺ was asked about the Hour. He said: "When you see barefoot, naked, destitute shepherds competing in constructing tall buildings."'
          },
          {
            source: 'Sahih Bukhari 50',
            text: 'The Prophet ﷺ said: "The Hour will not be established until... people compete with one another in constructing high buildings."'
          },
          {
            source: 'Sahih Muslim 2949',
            text: 'The Prophet ﷺ said: "Among the signs of the Hour is that you will see barefoot, naked, destitute shepherds competing in constructing lofty buildings."'
          }
        ],
        reference: 'Sahih Muslim 8, Sahih Bukhari 50',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      },
      {
        id: 'p5',
        title: 'Victory Over Persia and Rome',
        description: 'The Prophet ﷺ prophesied Muslims would conquer the Persian and Roman empires when this seemed impossible.',
        details: `When the Prophet Muhammad ﷺ and his companions were digging the trench during the Battle of the Trench (5 AH), they encountered a large rock that couldn't be broken. The Prophet ﷺ took the pickaxe and struck the rock three times.

**THE PROPHECY:**
With each strike, a spark flew and the Prophet ﷺ made a prophecy:

**First Strike:** "Allahu Akbar! I have been given the keys of Persia. By Allah, I can see the white palace of Madain (Persian capital) from here."

**Second Strike:** "Allahu Akbar! I have been given the keys of Rome. By Allah, I can see its red palaces from here."

**Third Strike:** "Allahu Akbar! I have been given the keys of Yemen."

**CONTEXT:**
This prophecy was made when:
1. The Muslims were surrounded by 10,000 enemy troops
2. They were digging a defensive trench to survive
3. They were hungry and exhausted
4. Persia and Rome were the superpowers of the world
5. The Muslims had no army capable of conquering cities, let alone empires

The hypocrites mocked: "Muhammad promises us the treasures of Persia and Rome, yet we can't even go to the bathroom safely!"

**FULFILLMENT:**

**1. PERSIA (Sassanid Empire):**
- Battle of Qadisiyyah (636 CE): Muslims defeated the Persians
- Battle of Nahavand (642 CE): Final defeat of Persian Empire
- The white palace of Madain was conquered
- The treasures of Khosrau were brought to Madinah
- Umar ibn al-Khattab distributed them among Muslims
- The entire Persian Empire became Muslim territory
- Timeline: Within 15 years of the prophecy

**2. ROME (Byzantine Empire):**
- Battle of Yarmouk (636 CE): Muslims defeated the Byzantines
- Jerusalem conquered (637 CE)
- Damascus, Antioch, and other major cities conquered
- Egypt conquered (642 CE)
- North Africa conquered
- Eventually, Constantinople (Istanbul) conquered (1453 CE)
- Timeline: Began within 10 years of the prophecy

**3. YEMEN:**
- Yemen was conquered during the Prophet's ﷺ lifetime
- The Persian governor of Yemen accepted Islam
- The prophecy was fulfilled before the Prophet's ﷺ death

**ADDITIONAL PROPHECIES ABOUT THESE CONQUESTS:**

The Prophet ﷺ also said:
- "The treasures of Khosrau and Caesar will be spent in the way of Allah." (Sahih Bukhari)
- "You will conquer Constantinople. What a wonderful leader will its leader be, and what a wonderful army will that army be!" (Musnad Ahmad) - Fulfilled in 1453 CE

**EVIDENCE:**
When the treasures of Persia were brought to Umar, he wept. When asked why, he said: "I remembered the Prophet's ﷺ words when he struck the rock, and now I see it fulfilled."`,
        explanation: `This is miraculous because:

1. The prophecy was made during a desperate military situation
2. Persia and Rome were the superpowers - conquering them seemed impossible
3. The Muslims had no resources or army for such conquests
4. The prophecy was specific: Persia, Rome, and Yemen
5. All three were fulfilled exactly as prophesied
6. The timeframe was remarkably short (within decades)
7. The prophecy was made publicly and could have been falsified
8. Companions witnessed both the prophecy and its fulfillment
9. The treasures were indeed spent in Allah's way, as prophesied
10. This demonstrates divine knowledge and support`,
        quranVerses: [
          {
            surah: 48,
            verse: 18,
            arabic: 'لَّقَدْ رَضِىَ ٱللَّهُ عَنِ ٱلْمُؤْمِنِينَ إِذْ يُبَايِعُونَكَ تَحْتَ ٱلشَّجَرَةِ فَعَلِمَ مَا فِى قُلُوبِهِمْ فَأَنزَلَ ٱلسَّكِينَةَ عَلَيْهِمْ وَأَثَـٰبَهُمْ فَتْحًۭا قَرِيبًۭا',
            translation: 'Certainly was Allah pleased with the believers when they pledged allegiance to you, [O Muhammad], under the tree, and He knew what was in their hearts, so He sent down tranquility upon them and rewarded them with an imminent conquest.'
          },
          {
            surah: 48,
            verse: 20,
            arabic: 'وَعَدَكُمُ ٱللَّهُ مَغَانِمَ كَثِيرَةًۭ تَأْخُذُونَهَا فَعَجَّلَ لَكُمْ هَـٰذِهِۦ',
            translation: 'Allah has promised you much war booty that you will take [in the future] and has hastened for you this [victory].'
          }
        ],
        hadiths: [
          {
            source: 'Musnad Ahmad 14631',
            text: 'Salman al-Farsi narrated: "While we were digging the trench, a large rock appeared that our pickaxes could not break. The Prophet ﷺ came and took the pickaxe, struck it, and it broke into pieces. He said: \'Allahu Akbar! I have been given the keys of Persia. By Allah, I can see the white palace of Madain.\' Then he struck again and said: \'Allahu Akbar! I have been given the keys of Rome.\'"'
          },
          {
            source: 'Sahih Bukhari 3120',
            text: 'The Prophet ﷺ said: "When Khosrau perishes, there will be no Khosrau after him. When Caesar perishes, there will be no Caesar after him. By Him in Whose Hand is my soul, their treasures will be spent in Allah\'s cause."'
          },
          {
            source: 'Sahih Muslim 2920',
            text: 'The Prophet ﷺ said: "You will fight against the Byzantines and Allah will grant you victory over them."'
          }
        ],
        reference: 'Sahih Bukhari 3120, Musnad Ahmad 14631',
        image: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=800&q=80',
      },
    ],
  },
];
