const questions = [
    {
      keyword: "Poltergeist",
      description: "A type of supernatural phenomenon characterized by noisy disturbances and objects moving seemingly by themselves.",
      explanation: "Derived from German words 'poltern' (to make noise) and 'geist' (ghost). Often associated with adolescent-centered hauntings and unexplained physical disturbances.",
      choices: ["Poltergeist", "Banshee", "Cryptid", "Zeitgeist"]
    },
    {
      keyword: "Cryptid",
      description: "A creature whose existence is unproven by scientific consensus, often part of local folklore or mythology.",
      explanation: "Examples include Bigfoot, Loch Ness Monster, and Chupacabra. These legendary animals are studied by cryptozoology, a pseudoscience focused on proving their existence.",
      choices: ["Wendigo", "Cryptid", "Tulpa", "EVP"]
    },
    {
      keyword: "Ectoplasm",
      description: "A supposed supernatural viscous substance said to exude from the body of a medium during a spiritualistic trance.",
      explanation: "Popularized in the early 20th century, ectoplasm was claimed to be physical evidence of spirit manifestation during séances.",
      choices: ["Skinwalker", "Doppelganger", "Ectoplasm", "Zeitgeist"]
    },
    {
      keyword: "Skinwalker",
      description: "A type of harmful witch in Navajo tradition with the ability to transform into, possess, or disguise themselves as animals.",
      explanation: "In Navajo culture, skinwalkers are shapeshifters associated with dark magic and considered taboo to discuss openly.",
      choices: ["Banshee", "Skinwalker", "EVP", "Tulpa"]
    },
    {
      keyword: "EVP",
      description: "An acronym standing for a specific type of paranormal audio recording technique.",
      explanation: "Electronic Voice Phenomenon (EVP) involves capturing unexplained voices or sounds on electronic recording devices, often believed to be communications from spirits.",
      choices: ["Cryptid", "Doppelganger", "EVP", "Ectoplasm"]
    },
    {
      keyword: "Tulpa",
      description: "A concept from Tibetan mysticism describing a being created through spiritual or mental concentration.",
      explanation: "In theory, a tulpa is a sentient, independent thought-form that can be manifested through intense meditation and visualization.",
      choices: ["Poltergeist", "Tulpa", "Skinwalker", "Zeitgeist"]
    },
    {
      keyword: "Doppelganger",
      description: "A ghostly double of a living person, often considered an omen of bad luck or impending death.",
      explanation: "From German meaning 'double-walker', a doppelganger is a look-alike or double of a living person that is considered paranormal.",
      choices: ["Banshee", "Doppelganger", "Wendigo", "EVP"]
    },
    {
      keyword: "Banshee",
      description: "A female spirit in Irish folklore known for her haunting wail that signals an impending death in a family.",
      explanation: "In Celtic mythology, a banshee's mournful cry is a supernatural warning of an upcoming tragedy or loss of life.",
      choices: ["Ectoplasm", "Banshee", "Cryptid", "Tulpa"]
    },
    {
      keyword: "Wendigo",
      description: "A cannibalistic creature from Algonquian-speaking First Nations folklore, associated with winter, coldness, and hunger.",
      explanation: "A mythological man-eating monster that symbolizes the desperation and taboo of cannibalism in Native American legends.",
      choices: ["Skinwalker", "Zeitgeist", "Wendigo", "Doppelganger"]
    },
    {
      keyword: "Zeitgeist",
      description: "While not strictly paranormal, this term relates to the spirit or mood of a particular period in history.",
      explanation: "From German, meaning 'spirit of the time'. Used to describe the intellectual and cultural climate of an era.",
      choices: ["EVP", "Zeitgeist", "Poltergeist", "Banshee"]
    },
    // New 10 questions
    {
      keyword: "Kitsune",
      description: "A mythical fox-like creature from Japanese folklore with shapeshifting abilities and multiple tails.",
      explanation: "In Japanese mythology, kitsune are intelligent spirits that can transform into human form, often associated with the Shinto deity Inari.",
      choices: ["Kitsune", "Djinn", "Golem", "Sprite"]
    },
    {
      keyword: "Djinn",
      description: "Supernatural creatures in Islamic mythology, capable of good or evil and existing in a parallel dimension.",
      explanation: "Often mistranslated as 'genie', djinn are intelligent beings created from smokeless fire, with free will and the ability to interact with humans.",
      choices: ["Wraith", "Djinn", "Changeling", "Revenant"]
    },
    {
      keyword: "Changeling",
      description: "A folklore creature supposedly left in place of a human child by supernatural beings.",
      explanation: "In European folklore, fairies or other mythical entities would secretly replace a human infant with one of their own kind.",
      choices: ["Golem", "Banshee", "Changeling", "Sprite"]
    },
    {
      keyword: "Revenant",
      description: "A visible ghost or animated corpse that returns from the grave to terrorize the living.",
      explanation: "Derived from the French word 'revenir', meaning 'to return', revenants are believed to be corpses that rise from their graves.",
      choices: ["Zombie", "Wraith", "Revenant", "Poltergeist"]
    },
    {
      keyword: "Golem",
      description: "An animated anthropomorphic being in Jewish folklore, created from inanimate matter like clay or mud.",
      explanation: "Traditionally created by a rabbi through mystical practices, golems were powerful protectors without free will or speech.",
      choices: ["Tulpa", "Sprite", "Kitsune", "Golem"]
    },
    {
      keyword: "Wraith",
      description: "A ghostly apparition or spirit, often considered an omen of death.",
      explanation: "In paranormal mythology, a wraith is a spectral entity that represents the soul or essence of a deceased person.",
      choices: ["Djinn", "Wraith", "Changeling", "Doppelganger"]
    },
    {
      keyword: "Sprite",
      description: "A type of fairy or elf-like supernatural being, often associated with natural elements.",
      explanation: "In folklore, sprites are small, ethereal creatures that inhabit forests, waters, and other natural environments.",
      choices: ["Kitsune", "Sprite", "Golem", "Tulpa"]
    },
    {
      keyword: "Simulacrum",
      description: "A representation or imitation of a person or thing, sometimes with supernatural connotations.",
      explanation: "In philosophical and paranormal contexts, a simulacrum is an ersatz version of reality that may be indistinguishable from the original.",
      choices: ["Doppelganger", "Simulacrum", "Zeitgeist", "EVP"]
    },
    {
      keyword: "Fetch",
      description: "A supernatural double or wraith of a living person in Irish and British folklore.",
      explanation: "Similar to a doppelganger, a fetch is believed to be an exact duplicate that appears as a portent of the person's imminent death.",
      choices: ["Banshee", "Fetch", "Revenant", "Skinwalker"]
    },
    {
      keyword: "Homunculus",
      description: "A miniature human or humanoid creature created through alchemical or magical processes.",
      explanation: "Originating in medieval folklore, a homunculus was believed to be artificially created through arcane scientific or magical methods.",
      choices: ["Tulpa", "Golem", "Homunculus", "Sprite"]
    }
  ]

  export default questions