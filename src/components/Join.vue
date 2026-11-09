<template>
  <div class="join-us">
    <h2 class="intro">There's always room for one more...</h2>

    <section 
      ref="tos"
      class="tos" 
      :class="{ 'user-is-member': isMemberAlready , 'open' : openTOS}"
      @mousemove="handleMouseMove" 
      @pointermove="handleMouseMove" 
      @mouseenter="handleMouseMove"
    >

      <h2>REMOTE VIEWERS CLUB</h2>
      <h3>MEMBERSHIP AGREEMENT AND TERMS OF PARTICIPATION</h3>
      <div class="tos-body" ref="tosBody">
        <p class="recital">
          <strong>WHEREAS</strong>, the undersigned individual (hereinafter referred to as
          &ldquo;MEMBER,&rdquo; &ldquo;PSYCHIC ASPIRANT,&rdquo; &ldquo;THIRD EYE ENTHUSIAST,&rdquo;
          or &ldquo;YOU&rdquo;) wishes to join the organization known as the Remote Viewers Club
          (hereinafter referred to as &ldquo;THE CLUB,&rdquo; &ldquo;THE ORGANIZATION,&rdquo;
          &ldquo;THE PSYCHIC COLLECTIVE,&rdquo; or &ldquo;THOSE WHO SEE BEYOND&rdquo;);
        </p>

        <p class="recital">
          <strong>AND WHEREAS</strong>, THE CLUB offers training, community, and support for
          individuals seeking to develop their extrasensory perception abilities and other arcane
          practices;
        </p>

        <p class="recital">
          <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants contained
          herein, and other good and valuable consideration (both visible and invisible to the
          naked eye), the parties hereby agree as follows:
        </p>

        <h4 class="article-title">Article I: Definitions</h4>

        <p class="clause">
          <span class="clause-num">1.1</span>
          <span><strong>&ldquo;Remote Viewing&rdquo;</strong> shall be defined as the alleged
          practice of seeking impressions about a distant or unseen target using paranormal means,
          in particular, extrasensory perception (ESP) or &ldquo;sensing&rdquo; with the mind.</span>
        </p>

        <p class="clause">
          <span class="clause-num">1.2</span>
          <span><strong>&ldquo;S&eacute;ance&rdquo;</strong> shall refer to the practice of
          attempting to communicate with spirits of the dead, whether through mediumship, automatic
          writing, Ouija boards, or simply asking politely if any entities would like to join the
          conversation.</span>
        </p>

        <p class="clause">
          <span class="clause-num">1.3</span>
          <span><strong>&ldquo;Precognition&rdquo;</strong> shall be defined as the purported
          ability to perceive future events before they happen, whether through dreams, visions,
          intuition, or suddenly knowing what your friends will order at a restaurant before they
          do.</span>
        </p>

        <p class="clause">
          <span class="clause-num">1.4</span>
          <span><strong>&ldquo;Arcane Practices&rdquo;</strong> shall encompass all esoteric
          activities including but not limited to: astral projection, aura reading, psychometry,
          dowsing, channeling, energy healing, telepathic communication with animals or plants, and
          locating lost TV remotes through extrasensory means.</span>
        </p>

        <p class="clause">
          <span class="clause-num">1.5</span>
          <span><strong>&ldquo;Psychic Abilities&rdquo;</strong> shall refer to any and all
          paranormal talents including but not limited to: clairvoyance, telepathy, retrocognition,
          psychokinesis, teleportation, and knowing which streaming service has that movie you want
          to watch without having to search for it.</span>
        </p>

        <p class="clause">
          <span class="clause-num">1.6</span>
          <span><strong>&ldquo;Session&rdquo;</strong> shall refer to any period of time during
          which MEMBER engages in arcane practices, regardless of whether said MEMBER is actually
          achieving results or is, in fact, simply staring blankly at a wall.</span>
        </p>

        <h4 class="article-title">Article II: Membership Terms</h4>

        <p class="clause">
          <span class="clause-num">2.1</span>
          <span>Membership shall commence upon the signing of this Agreement in blood.</span>
        </p>

        <p class="clause">
          <span class="clause-num">2.2</span>
          <span>MEMBER acknowledges that THE CLUB makes no guarantees regarding the development of
          psychic abilities or mastery of arcane practices, and that results may vary from
          &ldquo;absolutely nothing&rdquo; to &ldquo;mild coincidences that could be interpreted as
          evidence of paranormal phenomena&rdquo; to &ldquo;successful communication with beings
          from other planes of existence.&rdquo;</span>
        </p>

        <p class="clause">
          <span class="clause-num">2.3</span>
          <span>MEMBER hereby waives the right to request refunds based on lack of psychic
          development. THE CLUB maintains that failure to develop abilities is due to MEMBER&rsquo;s
          insufficient spiritual evolution, skepticism, mercury being in retrograde, or temporary
          disturbances in the ether.</span>
        </p>

        <h4 class="article-title">Article III: Member Conduct and Responsibilities</h4>

        <p class="clause">
          <span class="clause-num">3.1</span>
          <span>MEMBER agrees to participate in all exercises and training protocols as prescribed
          by THE CLUB, no matter how ridiculous they may appear to the untrained mind or conventional
          society.</span>
        </p>

        <p class="clause">
          <span class="clause-num">3.2</span>
          <span>MEMBER shall maintain a dream journal, meditation log, s&eacute;ance record,
          precognition prediction ledger, and documentation of all arcane sessions, even if said
          records consist primarily of drawings resembling children&rsquo;s scribbles or
          descriptions that could apply to literally any location or entity in this realm or
          others.</span>
        </p>

        <p class="clause">
          <span class="clause-num">3.3</span>
          <span>MEMBER agrees to use any developed psychic abilities and arcane practices at their
          own discretion, understanding that THE CLUB neither encourages nor discourages any
          particular application of said abilities. THE CLUB acknowledges that the moral and ethical
          deployment of mystical powers remains the sole responsibility of the MEMBER.</span>
        </p>

        <p class="clause">
          <span class="clause-num">3.4</span>
          <span>MEMBER shall exercise independent judgment when communicating with spirits, peering
          into the future, manipulating energy fields, or otherwise engaging in activities that may
          alter the fabric of reality.</span>
        </p>

        <h4 class="article-title">Article IV: Club Protocols and Practices</h4>

        <p class="clause">
          <span class="clause-num">4.1</span>
          <span>THE CLUB shall provide MEMBER with various protocols for developing remote viewing
          abilities, conducting s&eacute;ances, enhancing precognition, and mastering other arcane
          practices, including but not limited to:</span>
        </p>
        <ol class="sub-clauses">
          <li>Staring at random photographs while attempting to &ldquo;sense&rdquo; their locations</li>
          <li>Drawing impressions of hidden objects</li>
          <li>Attempting to identify playing cards without looking at them</li>
          <li>Communicating with spirits through various mediumship techniques</li>
          <li>Documenting precognitive dreams and visions</li>
          <li>Attempting to bend spoons with the mind (spoons not provided)</li>
          <li>Sending telepathic messages to other MEMBERS (receipt of messages not guaranteed)</li>
          <li>Projecting consciousness to other planes of existence</li>
          <li>Reading the energy fields of objects, places, or persons</li>
        </ol>

        <p class="clause">
          <span class="clause-num">4.2</span>
          <span>MEMBER acknowledges that THE CLUB&rsquo;s training techniques are based on a
          proprietary blend of declassified government research, ancient mystical practices,
          communications with non-corporeal entities, New Age philosophy, and things we saw in
          science fiction movies that seemed plausible.</span>
        </p>

        <h4 class="article-title">Article V: Disclaimers and Limitations of Liability</h4>

        <p class="clause">
          <span class="clause-num">5.1</span>
          <span>THE CLUB expressly disclaims any responsibility for:</span>
        </p>
        <ol class="sub-clauses">
          <li>Headaches resulting from intense psychic concentration</li>
          <li>Vivid dreams that may or may not be prophetic</li>
          <li>Sudden urges to purchase crystals, incense, or ceremonial daggers</li>
          <li>The development of an annoying habit of saying &ldquo;I knew that was going to
            happen&rdquo; after ordinary events</li>
          <li>Friends and family members slowly backing away during conversations</li>
          <li>Unexpected spirit visitations following s&eacute;ance activities</li>
          <li>Temporal paradoxes resulting from precognitive interference</li>
          <li>Interdimensional beings taking up residence in MEMBER&rsquo;s home</li>
        </ol>

        <p class="clause">
          <span class="clause-num">5.2</span>
          <span>MEMBER assumes all risks associated with remote viewing, s&eacute;ances,
          precognition, and other arcane practices, including but not limited to: ego inflation,
          metaphysical confusion, being a topic of concern at family interventions, and unexpected
          alterations to the space-time continuum.</span>
        </p>

        <p class="clause">
          <span class="clause-num">5.3</span>
          <span>THE CLUB makes no warranties, express or implied, that MEMBER will:</span>
        </p>
        <ol class="sub-clauses">
          <li>Actually develop any psychic abilities whatsoever</li>
          <li>Successfully communicate with the deceased</li>
          <li>Accurately predict future events</li>
          <li>Be able to find lost keys, remote controls, or socks</li>
          <li>Avoid traffic by predicting accidents</li>
          <li>Save money on cable by psychically viewing premium content</li>
          <li>Successfully traverse the astral plane without incident</li>
        </ol>

        <h4 class="article-title">Article VI: Confidentiality</h4>

        <p class="clause">
          <span class="clause-num">6.1</span>
          <span>MEMBER agrees to maintain the confidentiality of all CLUB techniques, protocols, and
          practices, except when attempting to impress others at parties, in which case limited
          disclosure is permitted if accompanied by a mysterious smile and enigmatic nod.</span>
        </p>

        <p class="clause">
          <span class="clause-num">6.2</span>
          <span>THE CLUB reserves the right to deny knowledge of MEMBER should their public claims
          of psychic ability become embarrassingly grandiose or result in unwanted media
          attention.</span>
        </p>

        <p class="clause">
          <span class="clause-num">6.3</span>
          <span>Information obtained through precognition, remote viewing, or communication with
          non-corporeal entities may be shared at MEMBER&rsquo;s discretion, with the understanding
          that THE CLUB bears no responsibility for the consequences of such disclosure.</span>
        </p>

        <h4 class="article-title">Article VII: Termination</h4>

        <p class="clause">
          <span class="clause-num">7.1</span>
          <span>This Agreement may be terminated by either party, provided that:</span>
        </p>
        <ol class="sub-clauses">
          <li>MEMBER provides written notice; or</li>
          <li>THE CLUB senses MEMBER&rsquo;s desire to leave through psychic means; or</li>
          <li>A spirit guide conveys MEMBER&rsquo;s intention to depart during a s&eacute;ance.</li>
        </ol>

        <p class="clause">
          <span class="clause-num">7.2</span>
          <span>Upon termination, MEMBER agrees to cease representing themselves as affiliated with
          THE CLUB, but may continue personal psychic development and arcane practices in the
          privacy of their own home, preferably with the blinds drawn.</span>
        </p>

        <h4 class="article-title">Article VIII: Governing Law</h4>

        <p class="clause">
          <span class="clause-num">8.1</span>
          <span>This Agreement shall be governed by the laws of physical reality, except where
          superseded by the laws of metaphysics, quantum uncertainty, or whatever paradigm MEMBER
          believes in most strongly at the time of dispute.</span>
        </p>

        <p class="clause">
          <span class="clause-num">8.2</span>
          <span>Any disputes arising from this Agreement shall be settled through conventional legal
          means, as THE CLUB acknowledges that while psychic arbitration would be preferable, it
          remains impractical for non-initiates.</span>
        </p>

        <p class="clause">
          <span class="clause-num">8.3</span>
          <span>In matters involving spirits, precognitive events, or other extradimensional
          phenomena, the ruling of the Council of Elders (a group of THE CLUB&rsquo;s most advanced
          practitioners) shall be considered binding in all realms of existence.</span>
        </p>

        <p class="attestation">
          In witness whereof, the parties have executed this Agreement as of the date first written
          above, or as of the date they psychically became aware of it, whichever came first.
        </p>

        <p class="tos-note">
          Note: By signing this document, MEMBER confirms they have read and understood all terms,
          or have at least attempted to perceive them psychically. This Agreement is binding in this
          dimension and all parallel realities.
        </p>
      </div>

      <CandleAnimation 
        class="candle-mover" 
        :isMemberAlready="isMemberAlready"
      />
    </section>

    <section class="members-toggle">
      <button 
        v-show="isMemberAlready"
        class="tos-handler"
        @click="handleTOSToggle">
        {{ openTOS ? 'Close Terms you already agreed to' : 'Review Terms - No Backsies!'}}
      </button>
    </section>

    <section class="signature" v-show="!isMemberAlready">
      <h3>- Sign Here When Ready -</h3>
      <SignaturePad 
        bloodColor="#8B0000"
      />
    </section>

    <section>
      <button v-show="!showMembershipRoll" @click="enableShowMembershipRoll">Show Roll</button>
      <button v-show="showMembershipRoll" @click="showMembershipRoll = false">Hide Roll</button>
    </section>

    <section v-if="isMemberAlready || showMembershipRoll" class="signature-gallery">
      <SignatureGallery />
    </section>
  </div>
</template>

<script>
import SignaturePad from './SignaturePad'
import SignatureGallery from './SignatureGallery'
import CandleAnimation from './animations/CandleAnimation'
import { eventBus } from '../EventBus'

export default {
  name: 'join-us',
  components: {
    SignaturePad,
    SignatureGallery,
    CandleAnimation
  },
  methods: {
    handleMouseMove(e) {
      // offsetX/offsetY are relative to whatever element the pointer happens to
      // be over, so the origin snaps every time the cursor crosses a clause.
      // Keep the viewport coords and measure against fixed boxes instead.
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;

      // mousemove and pointermove both fire for a mouse; collapse them (and any
      // bursts between paints) into a single write per frame
      if (this.pointerFrame === null) {
        this.pointerFrame = requestAnimationFrame(this.trackPointer);
      }
    },
    trackPointer() {
      this.pointerFrame = null;

      const section = this.$refs.tos;
      if (!section) return;

      const root = document.documentElement;
      const sectionBox = section.getBoundingClientRect();
      // the gradient is painted on .tos-body, so it has to be placed in that
      // box's coordinates or the lit spot drifts away from the flame
      const bodyBox = (this.$refs.tosBody || section).getBoundingClientRect();

      root.style.setProperty('--mouse-x', `${this.pointerX - bodyBox.left}px`);
      root.style.setProperty('--mouse-y', `${this.pointerY - bodyBox.top}px`);

      // the candle is absolutely positioned against .tos
      root.style.setProperty('--candle-x', `${this.pointerX - sectionBox.left}px`);
      root.style.setProperty('--candle-y', `${this.pointerY - sectionBox.top}px`);
    },
    checkIfSigSaved() {
      this.isMemberAlready = localStorage.getItem('rvc-joined') || false
    },
    confirmSigSaved() {
      this.isMemberAlready = true;
    },
    handleTOSToggle() {
      this.openTOS = !this.openTOS;
    },
    enableShowMembershipRoll() {
      this.showMembershipRoll = true;
    }
  },
  data() {
    return {
      isMemberAlready: false,
      openTOS: false,
      showMembershipRoll: false,
      pointerX: 0,
      pointerY: 0,
      pointerFrame: null,
    }
  },
  mounted() {
    this.isMemberAlready = localStorage.getItem('rvc-joined') || false

    eventBus.on('confirmSigSaved', this.confirmSigSaved)
  },
  beforeUnmount() {
    if (this.pointerFrame !== null) cancelAnimationFrame(this.pointerFrame)
  },
  updated() {
    this.isMemberAlready = localStorage.getItem('rvc-joined') || false
  }
}
</script>

<style>
/* registering these makes them real <length> values rather than raw tokens,
   which is what lets the transition below interpolate them instead of
   snapping the gradient and the candle to each new pointer sample */
@property --mouse-x {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}

@property --mouse-y {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}

@property --candle-x {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}

@property --candle-y {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}

/* registered so flameFlicker can interpolate the flame's reach */
@property --size {
  syntax: "<length>";
  inherits: true;
  initial-value: 15em;
}

:root {
  --color-1: var(--candle);
  --color-2: rgb(0 0 0 / 0);
  --mouse-x: 160px;
  --mouse-y: 150px;
  --candle-x: 208px;
  --candle-y: 260px;
  --size: 15em;

  transition:
    --mouse-x 0.2s ease-out,
    --mouse-y 0.2s ease-out,
    --candle-x 0.2s ease-out,
    --candle-y 0.2s ease-out;
}

.tos {
  background-color: var(--panel);
  width: 90%;
  margin: 0 auto;
  padding: 2rem 3rem;
  cursor: grabbing;
  max-width: 1200px;
  position: relative;
  transition: max-height 1.1s var(--ease-in-out);
} 

.tos-body {
  background: radial-gradient(var(--size) var(--size) at var(--mouse-x) var(--mouse-y),  
    var(--color-1) 0%,
    var(--color-2) 99%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  user-select: none;
  text-align: left;
  animation: flameFlicker 7s var(--ease-in-out) infinite;
  margin-top: 1.5rem;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

/* the gradient is painted once on .tos-body and clipped to all of its text,
   so descendants must stay transparent and background-free */
.tos-body * {
  color: inherit;
  background: none;
}

.tos-body p {
  margin: 0 0 1em;
}

.tos-body .recital {
  text-indent: 2rem;
}

.recital strong {
  letter-spacing: 0.04em;
}

.tos-body .article-title {
  margin: 2.25rem 0 1rem;
  font-size: var(--text-base);
  font-weight: bold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
}

.tos-body .clause {
  display: grid;
  grid-template-columns: 2.75rem 1fr;
  column-gap: 0.5rem;
}

.clause-num {
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}

.tos-body .sub-clauses {
  counter-reset: sub-clause;
  list-style: none;
  margin: -0.5em 0 1em;
  padding: 0 0 0 3.25rem;
}

.tos-body .sub-clauses li {
  counter-increment: sub-clause;
  display: grid;
  grid-template-columns: 1.75rem 1fr;
  column-gap: 0.5rem;
  margin-bottom: 0.35em;
}

.tos-body .sub-clauses li::before {
  content: counter(sub-clause, lower-alpha) ")";
}

.tos-body .attestation {
  margin-top: 2.25rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
}

.tos-body .tos-note {
  font-style: italic;
  font-size: var(--text-sm);
  text-align: center;
  max-width: 55ch;
  margin: 1.5rem auto 0;
}

@media (max-width: 600px) {
  .tos-body .clause {
    grid-template-columns: 2.25rem 1fr;
  }

  .tos-body .sub-clauses {
    padding-left: 1.5rem;
  }
}

.tos h2,
.tos h3 {
  margin: 0;
  padding: 0;
}

.tos h3 {
  font-weight: 400;
  font-size: var(--text-md);
}

.tos.user-is-member {
  max-height: 20rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tos.user-is-member.open {
  max-height: 100rem;
}

.signature {
  margin: 0 auto;
  background-color: var(--panel);
  padding: 2rem;
  max-width: 500px;
}

.signature h3 {
  margin: 0;
  padding: 0;
}

/*
 * A candle does not pulse evenly, so the stops are deliberately uneven and
 * the cycle length is prime-ish against the page's other motion -- it never
 * lines up with itself twice the same way. The flame's reach is what moves,
 * not its brightness, which is what the eye actually reads as guttering.
 *
 * This animation was referenced here long before it existed; the contract
 * has been asking for it.
 */
@keyframes flameFlicker {
  0%   { --size: 15em; }
  9%   { --size: 14.4em; }
  17%  { --size: 15.3em; }
  26%  { --size: 13.9em; }
  34%  { --size: 15.1em; }
  47%  { --size: 15.8em; }
  55%  { --size: 14.6em; }
  63%  { --size: 15.4em; }
  71%  { --size: 14.1em; }
  84%  { --size: 15.6em; }
  92%  { --size: 14.8em; }
  100% { --size: 15em; }
}

@media (prefers-reduced-motion: reduce) {
  .tos-body {
    animation: none;
  }
}

.candle-mover {
  position: absolute;
  left: 0;
  top: 0;
  /* translate rather than left/top: it rides the same eased vars as the
     gradient, so flame and lit text stay locked together, and it moves
     without relaying out the contract on every frame */
  translate: var(--candle-x) calc(var(--candle-y) + 20px);
  width: 80px;
  will-change: translate;
}

.members-toggle {
  display: flex;
  align-content: center;
  margin-top: -1rem;
  position: relative;
  z-index: 10;
}

.tos-handler {
  margin: 0 auto;
  width: 450px;
  max-width: 100%;
  font-size: var(--text-md);
  border-radius: 10px;
  border-color: rgba(0, 0, 0, 0.8);
  opacity: 0.85;
  transform: scale(0.95);
  transition: opacity 0.5s ease, transform 0.5s ease, background-color 0.2s ease;
}

.tos-handler:hover {
  opacity: 1;
  transform: scale(1);
}
</style>