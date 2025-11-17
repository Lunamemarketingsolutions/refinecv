export default function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
          Your Next Shortlist Starts Here
        </h2>

        <p className="text-xl sm:text-2xl mb-8 text-white/90">
          Stop running to seniors. Get AI-powered insights from 600+ elite IIM CVs—instantly.
        </p>

        <a
          href="/signup"
          className="inline-block bg-white text-primary px-10 py-5 rounded-lg font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all"
          data-cta="final-cta"
        >
          Analyze My CV Now
        </a>

        <p className="text-sm text-white/80 mt-6">
          Free forever • 3 analyses per day • No credit card required
        </p>
      </div>
    </section>
  );
}
