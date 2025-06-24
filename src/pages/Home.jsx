import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://685997d09f6ef9611153a5fd.mockapi.io/pets"
        );
        const recentPets = res.data.slice(-5).reverse();
        setPets(recentPets);

        const imgs = {};
        await Promise.all(
          recentPets.map(async (pet) => {
            const imgRes = await axios.get(
              "https://dog.ceo/api/breeds/image/random"
            );
            imgs[pet.id] = imgRes.data.message;
          })
        );
        setImages(imgs);
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-green-50 to-green-100 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 drop-shadow-md">
        Bem-vindo ao VetClinic!
      </h1>

      {loading ? (
        <p className="text-lg text-gray-600">Carregando pets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transform hover:scale-105 transition"
            >
              <img
                src={images[pet.id]}
                alt={pet.breed}
                className="w-48 h-48 object-cover rounded-lg mb-5"
              />
              <h2 className="text-2xl font-semibold text-green-800">{pet.name}</h2>
              <p className="text-gray-700 mt-1">Raça: {pet.breed}</p>
              <p className="text-gray-600 mt-1">Tutor: {pet.owner}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/login")}
        className="mt-12 bg-green-700 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-green-800 transition"
      >
        Acesso Funcionário
      </button>
    </div>
  );
}
