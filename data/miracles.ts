
export interface Miracle {
  id: string;
  title: string;
  description: string;
  details: string;
  reference: string;
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
      },
      {
        id: 's2',
        title: 'Mountains as Pegs',
        description: 'The Quran describes mountains as pegs that stabilize the Earth.',
        details: 'The Quran states: "Have We not made the earth as a bed, and the mountains as pegs?" (Quran 78:6-7). Modern geology confirms that mountains have deep roots beneath the surface, like pegs, which help stabilize the Earth&apos;s crust.',
        reference: 'Quran 78:6-7',
      },
      {
        id: 's3',
        title: 'The Expanding Universe',
        description: 'The Quran mentions the expansion of the universe 1400 years before modern science.',
        details: 'The Quran states: "And the heaven We constructed with strength, and indeed, We are [its] expander." (Quran 51:47). This was revealed centuries before Edwin Hubble discovered the expansion of the universe in 1929.',
        reference: 'Quran 51:47',
      },
      {
        id: 's4',
        title: 'Barrier Between Seas',
        description: 'The Quran describes a barrier between two bodies of water that meet but do not mix.',
        details: 'The Quran states: "He released the two seas, meeting [side by side]; Between them is a barrier [so] neither of them transgresses." (Quran 55:19-20). Modern oceanography has discovered that when two seas meet, there is a barrier that prevents them from mixing.',
        reference: 'Quran 55:19-20',
      },
      {
        id: 's5',
        title: 'The Big Bang',
        description: 'The Quran describes the origin of the universe in a way that aligns with the Big Bang theory.',
        details: 'The Quran states: "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them..." (Quran 21:30). This description is remarkably similar to the Big Bang theory.',
        reference: 'Quran 21:30',
      },
      {
        id: 's6',
        title: 'Fingerprints',
        description: 'The Quran mentions the uniqueness of fingerprints.',
        details: 'The Quran states: "Does man think that We cannot assemble his bones? Yes, [We are] Able [even] to proportion his fingertips." (Quran 75:3-4). The emphasis on fingertips is significant as fingerprints are unique to each individual.',
        reference: 'Quran 75:3-4',
      },
      {
        id: 's7',
        title: 'Iron Sent Down',
        description: 'The Quran states that iron was "sent down" to Earth.',
        details: 'The Quran states: "And We sent down iron, wherein is great military might and benefits for the people." (Quran 57:25). Modern science confirms that iron came to Earth from meteorites and is not native to our planet.',
        reference: 'Quran 57:25',
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
      },
      {
        id: 'l2',
        title: 'Perfect Preservation',
        description: 'The Quran has been perfectly preserved in its original language for over 1400 years.',
        details: 'The Quran states: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." (Quran 15:9). The Quran remains unchanged in its original Arabic, with millions of people having memorized it word for word.',
        reference: 'Quran 15:9',
      },
      {
        id: 'l3',
        title: 'Rhythmic Structure',
        description: 'The Quran has a unique rhythmic structure that aids in memorization.',
        details: 'The Quran&apos;s verses have a distinctive rhythm and rhyme scheme that makes it easy to memorize. This is one reason why millions of Muslims, including children, have memorized the entire Quran.',
        reference: 'Various Surahs',
      },
      {
        id: 'l4',
        title: 'Multiple Meanings',
        description: 'Quranic verses often have multiple layers of meaning.',
        details: 'The Quran&apos;s linguistic structure allows for multiple valid interpretations, providing depth and richness to its message. This is a hallmark of divine eloquence.',
        reference: 'Various Surahs',
      },
      {
        id: 'l5',
        title: 'Unique Literary Style',
        description: 'The Quran has a literary style that is neither poetry nor prose.',
        details: 'The Quran has a unique literary form that doesn&apos;t fit into traditional Arabic categories of poetry or prose. This uniqueness was recognized even by the Prophet&apos;s enemies.',
        reference: 'Various Surahs',
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
        title: 'Preservation of Pharaoh&apos;s Body',
        description: 'The Quran stated that Pharaoh&apos;s body would be preserved as a sign.',
        details: 'The Quran states: "So today We will save you in body that you may be to those who succeed you a sign." (Quran 10:92). The mummy of Pharaoh Ramses II was discovered in 1881, confirming this prophecy.',
        reference: 'Quran 10:92',
      },
      {
        id: 'h2',
        title: 'Victory of the Romans',
        description: 'The Quran predicted the Romans would defeat the Persians.',
        details: 'The Quran states: "The Romans have been defeated in the nearest land. But they, after their defeat, will overcome within three to nine years." (Quran 30:2-4). This prophecy came true when the Romans defeated the Persians.',
        reference: 'Quran 30:2-4',
      },
      {
        id: 'h3',
        title: 'Haman in Egypt',
        description: 'The Quran mentions Haman as a minister of Pharaoh in Egypt.',
        details: 'The Quran mentions Haman as a close associate of Pharaoh (Quran 28:6). This was unknown in history until hieroglyphics were deciphered, confirming a person named Haman in ancient Egypt.',
        reference: 'Quran 28:6',
      },
      {
        id: 'h4',
        title: 'The Lowest Point on Earth',
        description: 'The Quran mentions a battle at the lowest point on Earth.',
        details: 'The Quran states the Romans were defeated "in the nearest land" (Quran 30:3). The Arabic word "adna" means both "nearest" and "lowest." The battle occurred near the Dead Sea, the lowest point on Earth.',
        reference: 'Quran 30:3',
      },
      {
        id: 'h5',
        title: 'Prophecy of Abu Lahab',
        description: 'The Quran prophesied that Abu Lahab would never accept Islam.',
        details: 'Surah Al-Masad (111) condemned Abu Lahab and stated he would never believe. This was a bold prophecy as Abu Lahab could have falsified it by simply accepting Islam, but he never did.',
        reference: 'Quran 111:1-5',
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
      },
      {
        id: 'm2',
        title: 'Word Frequency',
        description: 'Certain words appear the same number of times as their opposites.',
        details: 'The word "day" (yawm) appears 365 times in the Quran. The word "month" (shahr) appears 12 times. The words "man" and "woman" each appear 23 times. These patterns demonstrate divine design.',
        reference: 'Various Surahs',
      },
      {
        id: 'm3',
        title: 'Land and Sea Ratio',
        description: 'The ratio of "land" to "sea" mentions matches Earth&apos;s actual ratio.',
        details: 'The word "land" (barr) appears 13 times and "sea" (bahr) appears 32 times in the Quran. The ratio 13:32 equals approximately 29:71, which matches the actual land to sea ratio on Earth.',
        reference: 'Various Surahs',
      },
      {
        id: 'm4',
        title: 'Symmetrical Structure',
        description: 'The Quran has a symmetrical structure in its chapters and verses.',
        details: 'The Quran has 114 chapters (19 x 6). The first revelation has 19 words. The first complete revelation (Surah Al-Muddaththir) has 19 verses. These patterns suggest divine authorship.',
        reference: 'Various Surahs',
      },
    ],
  },
];
