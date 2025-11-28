
export interface Miracle {
  id: string;
  title: string;
  description: string;
  details: string;
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
        description: 'The Quran describes the stages of human embryonic development with remarkable accuracy.',
        details: 'The Quran mentions the stages of embryonic development: "We created man from an extract of clay. Then We made him as a drop in a place of settlement, firmly fixed. Then We made the drop into an alaqah (leech, suspended thing, and blood clot), then We made the alaqah into a mudghah (chewed substance)..." (Quran 23:12-14). These descriptions align with modern embryology.',
        reference: 'Quran 23:12-14',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      },
      {
        id: 's2',
        title: 'Mountains as Pegs',
        description: 'The Quran describes mountains as pegs that stabilize the Earth.',
        details: 'The Quran states: "Have We not made the earth as a bed, and the mountains as pegs?" (Quran 78:6-7). Modern geology confirms that mountains have deep roots beneath the surface, like pegs, which help stabilize the Earth\'s crust.',
        reference: 'Quran 78:6-7',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      },
      {
        id: 's3',
        title: 'The Expanding Universe',
        description: 'The Quran mentions the expansion of the universe 1400 years before modern science.',
        details: 'The Quran states: "And the heaven We constructed with strength, and indeed, We are [its] expander." (Quran 51:47). This was revealed centuries before Edwin Hubble discovered the expansion of the universe in 1929.',
        reference: 'Quran 51:47',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
      },
      {
        id: 's4',
        title: 'Barrier Between Seas',
        description: 'The Quran describes a barrier between two bodies of water that meet but do not mix.',
        details: 'The Quran states: "He released the two seas, meeting [side by side]; Between them is a barrier [so] neither of them transgresses." (Quran 55:19-20). Modern oceanography has discovered that when two seas meet, there is a barrier that prevents them from mixing.',
        reference: 'Quran 55:19-20',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      },
      {
        id: 's5',
        title: 'The Big Bang',
        description: 'The Quran describes the origin of the universe in a way that aligns with the Big Bang theory.',
        details: 'The Quran states: "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them..." (Quran 21:30). This description is remarkably similar to the Big Bang theory.',
        reference: 'Quran 21:30',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
      },
      {
        id: 's6',
        title: 'Fingerprints',
        description: 'The Quran mentions the uniqueness of fingerprints.',
        details: 'The Quran states: "Does man think that We cannot assemble his bones? Yes, [We are] Able [even] to proportion his fingertips." (Quran 75:3-4). The emphasis on fingertips is significant as fingerprints are unique to each individual.',
        reference: 'Quran 75:3-4',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
      },
      {
        id: 's7',
        title: 'Iron Sent Down',
        description: 'The Quran states that iron was "sent down" to Earth.',
        details: 'The Quran states: "And We sent down iron, wherein is great military might and benefits for the people." (Quran 57:25). Modern science confirms that iron came to Earth from meteorites and is not native to our planet.',
        reference: 'Quran 57:25',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      },
      {
        id: 's8',
        title: 'The Water Cycle',
        description: 'The Quran accurately describes the water cycle.',
        details: 'The Quran states: "And We send down from the sky water in due measure, and We give it lodging in the earth..." (Quran 23:18). This describes evaporation, condensation, and precipitation - the complete water cycle.',
        reference: 'Quran 23:18',
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
        title: 'Unmatched Eloquence',
        description: 'The Quran challenged the Arabs, masters of poetry, to produce something similar.',
        details: 'The Quran challenged: "And if you are in doubt about what We have sent down upon Our Servant, then produce a surah the like thereof and call upon your witnesses other than Allah, if you should be truthful." (Quran 2:23). Despite being masters of Arabic poetry, no one could meet this challenge.',
        reference: 'Quran 2:23',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      },
      {
        id: 'l2',
        title: 'Perfect Preservation',
        description: 'The Quran has been perfectly preserved in its original language for over 1400 years.',
        details: 'The Quran states: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." (Quran 15:9). The Quran remains unchanged in its original Arabic, with millions of people having memorized it word for word.',
        reference: 'Quran 15:9',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
      },
      {
        id: 'l3',
        title: 'Rhythmic Structure',
        description: 'The Quran has a unique rhythmic structure that aids in memorization.',
        details: 'The Quran\'s verses have a distinctive rhythm and rhyme scheme that makes it easy to memorize. This is one reason why millions of Muslims, including children, have memorized the entire Quran.',
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',
      },
      {
        id: 'l4',
        title: 'Multiple Meanings',
        description: 'Quranic verses often have multiple layers of meaning.',
        details: 'The Quran\'s linguistic structure allows for multiple valid interpretations, providing depth and richness to its message. This is a hallmark of divine eloquence.',
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80',
      },
      {
        id: 'l5',
        title: 'Unique Literary Style',
        description: 'The Quran has a literary style that is neither poetry nor prose.',
        details: 'The Quran has a unique literary form that doesn\'t fit into traditional Arabic categories of poetry or prose. This uniqueness was recognized even by the Prophet\'s enemies.',
        reference: 'Various Surahs',
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
        description: 'The Quran stated that Pharaoh\'s body would be preserved as a sign.',
        details: 'The Quran states: "So today We will save you in body that you may be to those who succeed you a sign." (Quran 10:92). The mummy of Pharaoh Ramses II was discovered in 1881, confirming this prophecy.',
        reference: 'Quran 10:92',
        image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
      },
      {
        id: 'h2',
        title: 'Victory of the Romans',
        description: 'The Quran predicted the Romans would defeat the Persians.',
        details: 'The Quran states: "The Romans have been defeated in the nearest land. But they, after their defeat, will overcome within three to nine years." (Quran 30:2-4). This prophecy came true when the Romans defeated the Persians.',
        reference: 'Quran 30:2-4',
        image: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=800&q=80',
      },
      {
        id: 'h3',
        title: 'Haman in Egypt',
        description: 'The Quran mentions Haman as a minister of Pharaoh in Egypt.',
        details: 'The Quran mentions Haman as a close associate of Pharaoh (Quran 28:6). This was unknown in history until hieroglyphics were deciphered, confirming a person named Haman in ancient Egypt.',
        reference: 'Quran 28:6',
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
      },
      {
        id: 'h4',
        title: 'The Lowest Point on Earth',
        description: 'The Quran mentions a battle at the lowest point on Earth.',
        details: 'The Quran states the Romans were defeated "in the nearest land" (Quran 30:3). The Arabic word "adna" means both "nearest" and "lowest." The battle occurred near the Dead Sea, the lowest point on Earth.',
        reference: 'Quran 30:3',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      },
      {
        id: 'h5',
        title: 'Prophecy of Abu Lahab',
        description: 'The Quran prophesied that Abu Lahab would never accept Islam.',
        details: 'Surah Al-Masad (111) condemned Abu Lahab and stated he would never believe. This was a bold prophecy as Abu Lahab could have falsified it by simply accepting Islam, but he never did.',
        reference: 'Quran 111:1-5',
        image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&q=80',
      },
    ],
  },
  {
    id: 'mathematical',
    title: 'Mathematical',
    icon: 'calculate',
    color: '#FFD54F',
    miracles: [
      {
        id: 'm1',
        title: 'The Number 19',
        description: 'The number 19 appears in various patterns throughout the Quran.',
        details: 'The Quran states: "Over it are nineteen [angels]" (Quran 74:30). The number 19 appears in various mathematical patterns in the Quran, including the number of letters in the opening verse.',
        reference: 'Quran 74:30',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      },
      {
        id: 'm2',
        title: 'Word Frequency',
        description: 'Certain words appear the same number of times as their opposites.',
        details: 'The word "day" (yawm) appears 365 times in the Quran. The word "month" (shahr) appears 12 times. The words "man" and "woman" each appear 23 times. These patterns demonstrate divine design.',
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
      },
      {
        id: 'm3',
        title: 'Land and Sea Ratio',
        description: 'The ratio of "land" to "sea" mentions matches Earth\'s actual ratio.',
        details: 'The word "land" (barr) appears 13 times and "sea" (bahr) appears 32 times in the Quran. The ratio 13:32 equals approximately 29:71, which matches the actual land to sea ratio on Earth.',
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      },
      {
        id: 'm4',
        title: 'Symmetrical Structure',
        description: 'The Quran has a symmetrical structure in its chapters and verses.',
        details: 'The Quran has 114 chapters (19 x 6). The first revelation has 19 words. The first complete revelation (Surah Al-Muddaththir) has 19 verses. These patterns suggest divine authorship.',
        reference: 'Various Surahs',
        image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
      },
    ],
  },
];
