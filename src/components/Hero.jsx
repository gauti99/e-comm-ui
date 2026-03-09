function Hero() {
  return (
    <div className="bg-black text-white py-28 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-6xl md:text-7xl font-black tracking-widest mb-6">
          <span className="text-red-600">RED</span>LINE
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Streetwear inspired by racing culture
        </p>

        <button className="bg-red-600 hover:bg-red-700 px-10 py-3 font-bold rounded-lg transition">
          SHOP COLLECTION
        </button>

      </div>
    </div>
  );
}

export default Hero;