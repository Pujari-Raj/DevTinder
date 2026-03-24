export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="hero py-20 lg:py-32 px-4">
        <div className="hero-content text-center max-w-2xl">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to DevTinder
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Connect with talented developers, discover amazing projects, and build your career in tech.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <button className="btn bg-sky-500 hover:bg-sky-600 border-0 text-white font-semibold px-8">
                Get Started
              </button>
              <button className="btn bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold px-8">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Easy Matching",
                description: "Find developers that match your skills and interests",
              },
              {
                title: "Collaborate",
                description: "Work together on projects and build amazing things",
              },
              {
                title: "Grow Together",
                description: "Learn and improve your skills with the community",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card bg-gray-900 border border-gray-800 hover:border-sky-600 transition"
              >
                <div className="card-body text-center">
                  <h3 className="card-title text-xl justify-center text-sky-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
