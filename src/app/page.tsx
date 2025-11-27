export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Barber Place</h1>
          <nav>
            <a href="/login" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Selamat Datang di Barber Place</h2>
          <p className="text-xl text-gray-600 mb-8">Tempat cukur terbaik dengan pelayanan profesional</p>
          
          {/* Gallery placeholder - 6 foto akan ditambahkan nanti */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Foto {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white p-8 mt-20">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Barber Place. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
