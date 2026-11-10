"use client";

const categories = [
  { image: "/products/small-polaroid.jpg", title: "Polaroid Prints", sub: "Keep your moments close" },
  { image: "/products/red-rose-bouquet-750.jpg", title: "Gift Bouquets", sub: "Flowers with a twist" },
  { image: "/products/photo-collage-frame-329.jpg", title: "Photo Frames", sub: "Memories that stay" },
  { image: "/products/customised-magazine-210.jpg", title: "Personalised Gifts", sub: "Made only for you" },
  { image: "/products/birthday-hamper-bag-800.jpg", title: "Hampers & Hamper Boxes", sub: "A little box of happiness" },
];

const loveEdit = [
  {
    image: "/products/teddy-bouquet-529.jpg",
    eyebrow: "THE THOUGHTFUL ONE",
    title: "Bouquets full of love",
    description: "A little surprise that says a lot.",
  },
  {
    image: "/products/small-polaroid.jpg",
    eyebrow: "THE MEMORY KEEPER",
    title: "Moments to hold close",
    description: "Your favourite memories, made tangible.",
  },
  {
    image: "/products/made-just-for-them.jpg",
    eyebrow: "THE PERSONAL TOUCH",
    title: "Made just for them",
    description: "Little details, big feelings.",
  },
];

const occasions = [
  {
    image: "/products/birthday-hamper-bag-800.jpg",
    title: "Birthdays",
  },
  {
    image: "/products/20-pics-with-chocolate-400.jpg",
    title: "Anniversaries",
  },
  {
    image: "/products/just-because.jpg",
    title: "Just Because",
  },
  {
    image: "/products/customised-magazine-210.jpg",
    title: "Special Days",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff9f5] text-[#171717]">

      {/* ANNOUNCEMENT */}
      <div className="overflow-hidden bg-[#b63132] py-3 text-white">
        <div className="announcement-track flex w-max gap-12 whitespace-nowrap text-[10px] font-semibold tracking-[.25em]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              EVERY GIFT TELLS A STORY ✦ MADE WITH LOVE ✦ DELIVERING HAPPINESS ACROSS INDIA ✦
            </span>
          ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-[#eadbd1] bg-[#fff9f5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="/" className="leading-none">
            <span className="block text-xl font-black tracking-[-.06em] text-[#b63132] md:text-2xl">
              THE GIFT JAMMERS
            </span>
            <span className="mt-1 block text-[8px] tracking-[.35em] text-[#79513c]">
              EVERY GIFT TELLS A STORY
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[11px] font-semibold tracking-[.13em] md:flex">
            <a href="/">HOME</a>
            <a href="/products">SHOP</a>
            <a href="#categories">CATEGORIES</a>
            <a href="#story">OUR STORY</a>
          </nav>

          <a href="/products" className="rounded-full bg-[#b63132] px-5 py-3 text-[10px] font-bold tracking-widest text-white transition hover:bg-[#171717]">
            SHOP NOW
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid min-h-[570px] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-12 md:py-24">
        <div className="relative z-10">
          <p className="mb-6 text-[10px] font-bold tracking-[.35em] text-[#b63132]">
            LITTLE THINGS. BIG FEELINGS.
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-.06em] md:text-7xl">
            Gifts that make
            <span className="block font-serif italic text-[#b63132]">hearts smile.</span>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-[#79513c]">
            Thoughtful surprises, personalised treasures and little bundles
            of happiness. Find something special for every person and every moment.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="/products" className="rounded-full bg-[#b63132] px-8 py-4 text-[10px] font-bold tracking-[.18em] text-white transition hover:-translate-y-1 hover:bg-[#171717]">
              EXPLORE GIFTS
            </a>
            <a href="#categories" className="rounded-full border border-[#b63132] px-8 py-4 text-[10px] font-bold tracking-[.18em] text-[#b63132] transition hover:bg-[#b63132] hover:text-white">
              FIND YOUR GIFT
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="/products/small-polaroid.jpg" alt="Polaroid gift" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
              <img src="/products/red-rose-bouquet-750.jpg" alt="Rose bouquet" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
              <img src="/products/birthday-hamper-bag-800.jpg" alt="Gift hamper" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
            </div>
            <p className="text-[10px] tracking-wide text-[#79513c]">
              MADE WITH LOVE, JUST FOR YOU
            </p>
          </div>
        </div>

        <div className="hero-image relative mx-auto w-full max-w-lg">
          <div className="overflow-hidden rounded-[48%_48%_20px_20px] bg-[#f1ddd6]">
            <img
              src="/products/birthday-hamper-bag-800.jpg"
              alt="Beautiful birthday gift hamper"
              className="h-[430px] w-full object-cover md:h-[520px]"
            />
          </div>

          <div className="float-one absolute -left-4 top-16 w-28 overflow-hidden rounded-2xl bg-white p-2 shadow-xl md:-left-10">
            <img src="/products/red-rose-bouquet-750.jpg" alt="Rose bouquet" className="h-20 w-full rounded-lg object-cover" />
            <p className="py-2 text-center text-[8px] font-bold tracking-wider">MADE WITH LOVE</p>
          </div>

          <div className="float-two absolute -bottom-5 right-2 w-28 overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
            <img src="/products/small-polaroid.jpg" alt="Polaroid memories" className="h-20 w-full rounded-lg object-cover" />
            <p className="py-2 text-center text-[8px] font-bold tracking-wider">MADE PERSONAL</p>
          </div>
        </div>
      </section>

      {/* MOVING MARQUEE */}
      <div className="overflow-hidden border-y border-[#eadbd1] bg-[#f7eae3] py-5">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-serif text-2xl italic text-[#b63132]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              Thoughtfully Yours ✦ Made to Make You Smile ✦ A Gift Full of Love ✦
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[.35em] text-[#b63132]">
            A LITTLE SOMETHING FOR EVERYONE
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Find your kind of <span className="font-serif italic text-[#b63132]">happy.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#79513c]">
            From tiny keepsakes to thoughtful surprises, discover gifts that
            make every moment memorable.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, i) => (
            <a href="/products" key={category.title} className="category-card group rounded-2xl bg-white p-3 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-square overflow-hidden rounded-xl bg-[#f4e4dd]">
                <img src={category.image} alt={category.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{category.title}</h3>
              <p className="mt-1 text-[10px] leading-5 text-[#79513c]">{category.sub}</p>
              <p className="mt-3 text-[10px] font-bold tracking-widest text-[#b63132]">EXPLORE</p>
            </a>
          ))}
        </div>
      </section>

      {/* THE LOVE EDIT */}
      <section className="bg-[#f5e8e1] py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[.35em] text-[#b63132]">CURATED WITH LOVE</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                THE <span className="font-serif italic text-[#b63132]">LOVE EDIT.</span>
              </h2>
            </div>
            <a href="/products" className="text-[10px] font-bold tracking-[.2em] text-[#b63132] transition hover:tracking-[.3em]">
              SHOP ALL GIFTS
            </a>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {loveEdit.map((item) => (
              <a href="/products" key={item.title} className="group overflow-hidden rounded-2xl bg-[#fffaf6] p-5 transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className="aspect-[1.1] overflow-hidden rounded-xl bg-[#f4d8d0]">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <p className="mt-5 text-[9px] font-bold tracking-[.2em] text-[#b63132]">{item.eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs text-[#79513c]">{item.description}</p>
                <p className="mt-5 text-[10px] font-bold tracking-widest text-[#b63132]">DISCOVER MORE</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GIFTS FOR EVERY OCCASION */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[.35em] text-[#b63132]">MAKE EVERY DAY SPECIAL</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Gifts for every <span className="font-serif italic text-[#b63132]">occasion.</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {occasions.map((occasion) => (
            <a href="/products" key={occasion.title} className="group overflow-hidden rounded-2xl border border-[#eadbd1] bg-white transition duration-300 hover:-translate-y-2 hover:border-[#b63132] hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={occasion.image} alt={occasion.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <div className="px-3 py-5 text-center">
                <h3 className="text-sm font-semibold">{occasion.title}</h3>
                <p className="mt-2 text-[9px] font-bold tracking-widest text-[#b63132]">SHOP GIFTS</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PERSONALISED GIFTS */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] bg-[#b63132] md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-14 text-white md:px-16 md:py-20">
            <p className="text-[10px] font-bold tracking-[.35em] text-[#f6d8cc]">YOUR IDEA. OUR LITTLE MAGIC.</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Make it personal.
              <span className="block font-serif italic text-[#f6d8cc]">Make it unforgettable.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/80">
              The best gifts are the ones that feel like they were made for
              one person and one person only.
            </p>
            <a href="/products" className="mt-8 inline-block w-fit rounded-full bg-white px-8 py-4 text-[10px] font-bold tracking-[.2em] text-[#b63132] transition hover:-translate-y-1 hover:bg-[#f6d8cc]">
              CREATE YOUR GIFT
            </a>
          </div>
          <div className="min-h-[300px] overflow-hidden md:min-h-[500px]">
            <img src="/products/hoodie-hamper-box-2150.jpg" alt="Customised personalised gift" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 md:grid-cols-2 md:px-12">
        <div className="overflow-hidden rounded-[30px] bg-[#f2dfd5]">
          <img src="/products/teddy-chocolate-flowers-studs-hamper-2400.jpg" alt="Thoughtfully arranged gift hamper" className="h-[390px] w-full object-cover transition duration-700 hover:scale-105" />
        </div>

        <div className="md:pl-8">
          <p className="text-[10px] font-bold tracking-[.35em] text-[#b63132]">A LITTLE ABOUT US</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            We believe every gift has a <span className="font-serif italic text-[#b63132]">story.</span>
          </h2>
          <p className="mt-6 text-sm leading-8 text-[#79513c]">
            At The Gift Jammers, we believe gifting is more than just
            exchanging things. It is about remembering, celebrating and
            making someone feel special.
          </p>
          <p className="mt-4 text-sm leading-8 text-[#79513c]">
            From personalised keepsakes to beautiful surprises, every little
            detail is chosen to make your moments matter.
          </p>
          <a href="/products" className="mt-8 inline-block border-b border-[#b63132] pb-2 text-[10px] font-bold tracking-[.2em] text-[#b63132]">
            EXPLORE OUR COLLECTION
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#171717] px-6 py-14 text-white md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-black tracking-[-.05em]">THE GIFT JAMMERS</h2>
            <p className="mt-2 text-[9px] tracking-[.3em] text-[#e9b8a9]">EVERY GIFT TELLS A STORY</p>
            <p className="mt-6 max-w-xs text-xs leading-7 text-white/60">
              Thoughtful gifts, personalised treasures and little bundles
              of happiness. Made with love in Coimbatore.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[.25em] text-[#e9b8a9]">QUICK LINKS</h3>
            <div className="mt-6 flex flex-col gap-4 text-xs text-white/70">
              <a href="/">Home</a>
              <a href="/products">Shop All Gifts</a>
              <a href="#categories">Categories</a>
              <a href="#story">Our Story</a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[.25em] text-[#e9b8a9]">GET IN TOUCH</h3>
            <div className="mt-6 flex flex-col gap-4 text-xs text-white/70">
              <a href="mailto:thegiftjammers@gmail.com">thegiftjammers@gmail.com</a>
              <a href="https://wa.me/919487041090" target="_blank" rel="noreferrer">WhatsApp: +91 94870 41090</a>
              <p>Coimbatore · Shipping across India</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-t border-white/15 pt-7 text-center text-[9px] tracking-[.15em] text-white/40">
          © 2026 THE GIFT JAMMERS. MADE WITH LOVE.
        </div>
      </footer>

      {/* ANIMATIONS */}
      <style jsx>{`
        .announcement-track {
          animation: announcement 35s linear infinite;
        }

        .marquee-track {
          animation: marquee 45s linear infinite;
        }

        .float-one {
          animation: float 4s ease-in-out infinite;
        }

        .float-two {
          animation: float 5s ease-in-out infinite reverse;
        }

        .hero-image {
          animation: appear 1s ease both;
        }

        .category-card {
          animation: rise 0.8s ease both;
        }

        @keyframes announcement {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-13px); }
        }

        @keyframes appear {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-track,
          .marquee-track,
          .float-one,
          .float-two,
          .hero-image,
          .category-card {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}